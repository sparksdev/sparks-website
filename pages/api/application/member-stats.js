import { withSession } from '@utilities/session/server-routes'
import { prisma } from '@utilities/database'
import { getAttestation } from '@modules/attestations'
import { decrypt } from '@utilities/encryption/shared-box'
import cache from 'memory-cache';


async function addIdentifiers(req, res) {
  const { data, publicKey } = req.body
  const { userId } = req.session

  const results = await prisma.$transaction(
    data.map((entry) => {
      const { hash } = entry
      return prisma.memberStats.upsert({
        where: { hash },
        update: { ...entry, userId, publicKey },
        create: { ...entry, userId, publicKey },
      })
    })
  )

  return res.send({ ok: results.length })
}

async function removeIdentifiers(req, res) {
  const { userId } = req.session
  const hash = decodeURIComponent(req.query.hash)
  let result
  if (hash) {
    result = await prisma.memberStats.delete({ where: { hash } })
  } else {
    result = await prisma.memberStats.deleteMany({ where: { userId } })
  }
  return res.json({ ok: !!result })
}

async function updateStats(req, res) {
  const cached = cache.get('report')
  const timestamp = new Date().getTime()

  if (cached && timestamp - cached.updatedAt < (60 * 1000)) {
    return res.json(cached)
  }

  const records = await prisma.memberStats.findMany()
  const stats = []
  for (let record of records) {
    const { publicKey, service } = record
    const systemId = decrypt(
      record.systemId,
      process.env.STATS_SECRET_KEY,
      publicKey
    )
    const humanId = decrypt(
      record.humanId,
      process.env.STATS_SECRET_KEY,
      publicKey
    )
    if (!systemId || !humanId) continue
    const attestation = getAttestation(service)
    const data = await attestation.data({ systemId, humanId })
    if (data) stats.push(data)
  }
  
  const emailCount = stats.filter(s => s.service === 'email').length
  const twitterFollowers = stats.filter(s => s.service === 'twitter').reduce((t, a) => (t + a.data.followers_count), 0)
  const twitterFollowing = stats.filter(s => s.service === 'twitter').reduce((t, a) => (t + a.data.following_count), 0)
  const twitterTweets = stats.filter(s => s.service === 'twitter').reduce((t, a) => (t + a.data.tweet_count), 0)
  const twitterListed = stats.filter(s => s.service === 'twitter').reduce((t, a) => (t + a.data.listed_count), 0)

  const report = []
  if (emailCount) report.push(`We have ${emailCount} unique Emails`)
  if (twitterFollowers) report.push(`We are followed by ${twitterFollowers} Twitter users`,)
  if (twitterFollowing) report.push(`We follow ${twitterFollowing} Twitter accounts`,)
  if (twitterTweets) report.push(`We have published ${twitterTweets} Tweets`,)
  if (twitterListed) report.push(`We are members of ${twitterListed} Twitter lists`)

  cache.put('report', { report, updatedAt: new Date().getTime() })

  return res.json({ report, updatedAt: new Date().getTime() })
}

async function handler(req, res) {
  if (req.method === 'GET') return updateStats(res, res)
  if (req.method === 'POST') return addIdentifiers(req, res)
  if (req.method === 'DELETE') return removeIdentifiers(req, res)
  return res.status(404).send('method not found')
}

export default withSession(handler)
