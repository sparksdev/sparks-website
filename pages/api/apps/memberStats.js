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
        where: { userId_hash: { userId, hash } },
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
    result = await prisma.memberStats.delete({ where: { userId_hash: { userId, hash } } })
  } else {
    result = await prisma.memberStats.deleteMany({ where: { userId } })
  }
  return res.json({ ok: !!result })
}

async function updateStats(req, res) {
  const cachedData = cache.get('memberStatsData')
  const cachedReport = cache.get('memberStatsReport')
  const timestamp = new Date().getTime()
  const refreshMinutes = 15

  if (cachedData && (timestamp - cachedData.updatedAt) < (60 * 1000 * refreshMinutes)) {
    return req.query.report ? res.json(cachedReport) : res.json(cachedData)
  }

  // get all records and keep only unique hashes for stats
  let encryptedRecords = await prisma.memberStats.findMany()
  encryptedRecords = [...new Map(encryptedRecords.map(item => [item['hash'], item])).values()]

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
    if (data) {
      // de-identify the data
      services[service] = data.map(({ systemId, humanId, ...data }) => data)
    }
  }

  const data = {
    email: {
      total: services.email?.length,
      academic: services.email?.reduce((t, a) => t + (a.academic ? 1 : 0), 0),
    },
    domain: {
      total: services.domain?.length,
    },
    smartContract: {
      total: services.smartContract?.length,
    },
    twitter: {
      total: services.twitter?.length,
      followers: services.twitter?.reduce((t, a) => t + a.public_metrics.followers_count, 0),
      following: services.twitter?.reduce((t, a) => t + a.public_metrics.following_count, 0),
      tweets: services.twitter?.reduce((t, a) => t + a.public_metrics.tweet_count, 0),
    },
    medium: {
      total: services.medium?.length,
      followers: services.medium?.reduce((t, a) => t + a.followers, 0),
      following: services.medium?.reduce((t, a) => t + a.following, 0),
    },
    github: {
      total: services.github?.length,
      publicRepos: services.github?.reduce((t, a) => t + a.public_repos, 0),
      publicGists: services.github?.reduce((t, a) => t + a.public_gists, 0),
      followers: services.github?.reduce((t, a) => t + a.followers, 0),
      following: services.github?.reduce((t, a) => t + a.following, 0),
      contributions: services.github?.reduce((t, a) => t + a.contributions, 0),
    },
    youtube: {
      total: services.youtube?.length,
      views: services.youtube?.reduce((t, a) => t + a.views, 0),
      subscribers: services.youtube?.reduce((t, a) => t + a.subscribers, 0),
    }
  }

  const updatedAt = new Date().getTime()
  const rawData = Object.keys(data).map(service => ({ service, data: data[service] }))
  cache.put('memberStatsData', { data: rawData, updatedAt })
  if (!req.query.report) {
    return res.json({ data: rawData, updatedAt })
  }

  const report = []
  if (data.email.total) report.push(`We have ${data.email.total} verified Emails`)
  if (data.email.academic) report.push(`We have ${data.email.academic} academic Emails`)
  if (data.domain.total) report.push(`We own ${data.domain.total} Websites`)
  if (data.github.total) report.push(`We are ${data.github.total} developers on GitHub`)
  if (data.github.publicRepos) report.push(`We have published ${data.github.publicRepos} public GitHub repos`)
  if (data.github.publicGists) report.push(`We have published ${data.github.publicGists} public GitHub gists`)
  if (data.github.followers) report.push(`We are followed by ${data.github.followers} fellow GitHub developers`)
  if (data.github.following) report.push(`We follow ${data.github.following} other GitHub accounts`)
  if (data.github.contributions) report.push(`We have made ${data.github.contributions} GitHub repo contributions`)
  if (data.smartContract.total) report.push(`We have deployed ${data.smartContract.total} Smart Contracts`)
  if (data.twitter.total) report.push(`We are ${data.twitter.total} Twitter accounts`)
  if (data.twitter.followers) report.push(`We are followed by ${data.twitter.followers} Twitter users`)
  if (data.twitter.following) report.push(`We follow ${data.twitter.following} Twitter account`)
  if (data.twitter.tweets) report.push(`We have published over ${data.twitter.tweets} Tweets`)
  if (data.medium.total) report.push(`We are ${data.medium.total} Medium content authors`)
  if (data.medium.followers) report.push(`We are followed by ${data.medium.followers} Medium readers`)
  if (data.medium.following) report.push(`We follow and read ${data.medium.following} Medium authors`)
  if (data.youtube.total) report.push(`We are ${data.youtube.total} YouTube content creators`)
  if (data.youtube.subscribers) report.push(`We have ${data.youtube.subscribers} YouTube subscribers`)
  if (data.youtube.views) report.push(`We have gotten ${data.youtube.views} views on YouTube`)

  cache.put('memberStatsReport', { report, updatedAt })
  res.json({ report, updatedAt })
}

async function handler(req, res) {
  if (req.method === 'GET' && req.query.update) cache.clear()
  if (req.method === 'GET') return updateStats(req, res)
  if (req.method === 'POST') return addIdentifiers(req, res)
  if (req.method === 'DELETE') return removeIdentifiers(req, res)
  return res.status(404).send('method not found')
}

export default withSession(handler)
