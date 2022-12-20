import { getAttestation } from '@modules/attestations/server'
import { prisma } from '@utilities/database'
import { decrypt } from '@utilities/encryption/shared-box'
import { hash } from '@utilities/encryption/utilities'
import { withSession } from '@utilities/session/server-routes'
import cache from 'memory-cache'

async function addContracts(req, res) {
  const { publicKey, contracts, profile } = req.body
  const { userId } = req.session
  if (!userId) return res.status(403).send('forbidden')
  const results = await prisma.$transaction(
    contracts.map(({ contract, signature }) => {
      return prisma.deployerProfile.upsert({
        where: { contract: contract },
        update: { contract, signature, userId, profile, publicKey },
        create: { contract, signature, userId, profile, publicKey },
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
  cache.clear()
  const { userId } = req.session
  const { contract } = req.query
  if (!userId && !contract) return res.status(404).send('not found')

  const cachedProfile = cache.get(`deployerProfile_${contract}`)
  const timestamp = new Date().getTime()
  const refreshMinutes = 60
  if (cachedProfile && (timestamp - cachedProfile.updatedAt) < (60 * 1000 * refreshMinutes)) {
    return res.json(cachedProfile)
  }

  const record = contract 
    ? await prisma.deployerProfile.findFirst({ where: { contract: hash(contract) }})
    : await prisma.deployerProfile.findFirst({ where: { userId }})

  if (!record) return res.status(404).send('profile not found')

  const services = JSON.parse(decrypt(
    record.profile,
    process.env.DEPLOYER_PROFILE_SECRET_KEY,
    record.publicKey
  ))

  const signature = record.signature

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
        academic: settings.categorize ? data.academic : undefined,
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
        public_repos: settings.public_repos ? (Math.round(data.public_repos / 10) * 10) : undefined,
        public_gists: settings.public_gists ? (Math.round(data.public_gists / 10) * 10) : undefined,
        followers: settings.followers ? (Math.round(data.followers / 10) * 10) : undefined,
        contributions: settings.contributions ? (Math.round(data.contributions / 10) * 10) : undefined,
      })
    }
    if (settings.service === 'twitter') {
      profile.push({
        service: settings.service,
        handle: settings.show_handle ? '@' + data.username : undefined,
        followers: settings.followers ? (Math.round(data.public_metrics.followers_count / 10) * 10) : undefined,
        tweets: settings.tweets ? (Math.round(data.public_metrics.tweet_count / 10) * 10) : undefined,
      })
    }
    if (settings.service === 'medium') {
      profile.push({
        service: settings.service,
        username: settings.show_handle ? '@' + data.humanId : undefined,
        followers: settings.followers ? (Math.round(data.followers / 10) * 10) : undefined,
      })
    }
    if (settings.service === 'youtube') {
      profile.push({
        service: settings.service,
        channel: settings.show_handle ? '@' + data.humanId : undefined,
        subscribers: settings.subscribers ? (Math.round(data.subscribers / 10) * 10) : undefined,
        views: settings.views ? (Math.round(data.views / 10) * 10) : undefined,
      })
    }
  }

  cache.put(`deployerProfile_${contract}`, { profile, signature, updatedAt: new Date().getTime() })
  return res.status(200).json({ profile, signature })
}

async function confirmDeployer(req, res) {
  const { contract, address } = req.query

  const url =
    `https://api.etherscan.io/api` +
    `?module=contract&action=getcontractcreation` +
    `&contractaddresses=${contract}` +
    `&apikey=${process.env.ETHERSCAN_API_KEY}`

  const result = await fetch(url)
  if (!result.ok) {
    return res.status(500).send(result.statusText)
  }

  const json = await result.json()
  const verified = !!json.result?.find(
    ({ contractCreator }) =>
      contractCreator.toLowerCase() === address.toLowerCase()
  )
  return res.json({ verified })
}

async function handler(req, res) {
  if (req.method === 'GET' && req.query.update) cache.clear()
  if (req.method === 'GET' && req.query.contract && req.query.address) {
    return confirmDeployer(req, res)
  } 
  if (req.method === 'GET') return getProfile(req, res)
  if (req.method === 'POST') return addContracts(req, res)
  if (req.method === 'DELETE') return removeContracts(req, res)
  return res.status(404).send('method not found')
}

export default withSession(handler)
