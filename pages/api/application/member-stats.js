import { withSession } from '@utilities/session/server-routes'
import { prisma } from '@utilities/database'
import { getAttestation } from '@modules/attestations/server'
import { decrypt } from '@utilities/encryption/shared-box'
import cache from 'memory-cache'

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
  const hash = req.query.hash ? decodeURIComponent(req.query.hash) : null
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
  const refreshMinutes = 15

  if (cached && timestamp - cached.updatedAt < 60 * 1000 * refreshMinutes) {
    return res.json(cached)
  }

  const encryptedRecords = await prisma.memberStats.findMany()
  const records = encryptedRecords
    .map((record) => ({
      service: record.service,
      systemId: decrypt(
        record.systemId,
        process.env.STATS_SECRET_KEY,
        record.publicKey
      ),
      humanId: decrypt(
        record.humanId,
        process.env.STATS_SECRET_KEY,
        record.publicKey
      ),
    }))
    .filter(({ systemId, humanId }) => {
      return !!(systemId && humanId)
    })
    .reduce((records, record) => {
      const { service, systemId, humanId } = record
      records[service] = records[service] || []
      records[service].push({ systemId, humanId })
      return records
    }, {})

  const services = {}
  for (let service in records) {
    const attestation = getAttestation(service)
    const data = await attestation.data(records[service])
    if (data) services[service] = data
  }
 
  const emailCount = services.email?.data.length
  const websiteCount = services.domain?.data.length
  const smartContractCount = services.smartContract?.data.length
  const twitterCount = services.twitter?.data.length
  const twitterFollowers = services.twitter?.data.reduce(
    (t, a) => t + a.public_metrics.followers_count,
    0
  )
  const twitterFollowing = services.twitter?.data.reduce(
    (t, a) => t + a.public_metrics.following_count,
    0
  )
  const twitterTweets = services.twitter?.data.reduce(
    (t, a) => t + a.public_metrics.tweet_count,
    0
  )
  const mediumCount = services.medium?.data.length
  const mediumFollowers = services.medium?.data.reduce(
    (t, a) => t + a.followers,
    0
  )
  const mediumFollowing = services.medium?.data.reduce(
    (t, a) => t + a.following,
    0
  )

  const report = []
  if (emailCount) report.push(`We have ${emailCount} verified Emails`)
  if (websiteCount) report.push(`We own ${websiteCount} Websites`)
  if (smartContractCount)
    report.push(`We have deployed ${smartContractCount} Smart Contracts`)
  if (twitterCount) report.push(`We are ${twitterCount} Twitter accounts`)
  if (twitterFollowers)
    report.push(`We are followed by ${twitterFollowers} Twitter users`)
  if (twitterFollowing)
    report.push(`We follow ${twitterFollowing} Twitter account`)
  if (twitterTweets)
    report.push(`We have published over ${twitterTweets} Tweets`)
  if (mediumCount) report.push(`We are ${mediumCount} Medium content authors`)
  if (mediumFollowers)
    report.push(`We are followed by ${mediumFollowers} Medium readers`)
  if (mediumFollowing)
    report.push(`We are follow and read ${mediumFollowing} Medium authos`)

  cache.put('report', { report, updatedAt: new Date().getTime() })
  return res.json({ report, updatedAt: new Date().getTime() })
}

async function handler(req, res) {
  if (req.method === 'GET' && req.query.forceUpdate) cache.clear()
  if (req.method === 'GET') return updateStats(res, res)
  if (req.method === 'POST') return addIdentifiers(req, res)
  if (req.method === 'DELETE') return removeIdentifiers(req, res)
  return res.status(404).send('method not found')
}

export default withSession(handler)
