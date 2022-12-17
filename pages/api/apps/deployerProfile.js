import { getAttestation } from '@modules/attestations/server'
import { prisma } from '@utilities/database'
import { decrypt } from '@utilities/encryption/shared-box'
import { hash } from '@utilities/encryption/utilities'
import { withSession } from '@utilities/session/server-routes'

async function addContracts(req, res) {
  const { publicKey, contracts, profile } = req.body
  const { userId } = req.session
  if (!userId) return res.status(403).send('forbidden')
  const results = await prisma.$transaction(
    contracts.map((contract) => {
      return prisma.deployerProfile.upsert({
        where: { contract: contract },
        update: { contract, userId, profile, publicKey },
        create: { contract, userId, profile, publicKey },
      })
    })
  )
  return res.send({ ok: results.length })
}

async function removeContracts(req, res) {
  const { userId } = req.session
  if (!userId) return res.status(403).send('forbidden')
  const result = await prisma.deployerProfile.deleteMany({ where: { userId } })
  return res.json({ ok: result.ok })
}

async function getProfile(req, res) {
  const { userId } = req.session
  const { contract } = req.query
  if (!userId && !contract) return res.status(404).send('not foundd')
  const record = contract 
    ? await prisma.deployerProfile.findFirst({ where: { contract: hash(contract) }})
    : await prisma.deployerProfile.findFirst({ where: { userId }})

  if (!record) return res.status(404).send('profile not found')

  const services = JSON.parse(decrypt(
    record.profile,
    process.env.DEPLOYER_PROFILE_SECRET_KEY,
    record.publicKey
  ))

  const profile = []
  for(let settings of services) {
    if (!settings.include) continue
    const attestation = getAttestation(settings.service)
    const data = (await attestation.data([ settings ]))[0]
    if (!data) continue

    if (settings.service === 'email') {
      profile.push({
        service: settings.service,
        matches: settings.usePattern && (new RegExp(settings.pattern)).test(data.humanId) ? settings.pattern : undefined,
        email: !settings.usePattern ? data.humanId : undefined,
      })
    }
    if (settings.service === 'domain') {
      profile.push({
        service: settings.service,
        domain: settings.humanId
      })
    }
    if (settings.service === 'github') {
      profile.push({
        service: settings.service,
        username: settings.show_handle ? data.humanId : undefined,
        public_repos: settings.public_repos ? data.public_repos : undefined,
        public_gists: settings.public_gists ? data.public_gists : undefined,
        followers: settings.followers ? data.followers : undefined,
        contributions: settings.contributions ? data.contributions : undefined,
      })
    }
    if (settings.service === 'twitter') {
      profile.push({
        service: settings.service,
        handle: settings.show_handle ? '@' + data.username : undefined,
        followers: settings.followers ? data.public_metrics.followers_count : undefined,
        tweets: settings.tweets ? data.public_metrics.tweet_count : undefined,
      })
    }
    if (settings.service === 'medium') {
      profile.push({
        service: settings.service,
        username: settings.show_handle ? '@' + data.humanId : undefined,
        followers: settings.followers ? data.followers : undefined,
      })
    }
  }

  return res.status(200).json(profile)
}

async function handler(req, res) {
  if (req.method === 'GET') return getProfile(req, res)
  if (req.method === 'POST') return addContracts(req, res)
  if (req.method === 'DELETE') return removeContracts(req, res)
  return res.status(404).send('method not found')
}

export default withSession(handler)
