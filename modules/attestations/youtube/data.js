import cuid from "cuid"
import { CheerioCrawler } from "crawlee"

export default async function (entries) {
  let data = []
  const crawler = new CheerioCrawler({
    async requestHandler({ request, response, body, contentType, $ }) {
      const userData = {}
      const username = (request.url.split('/').filter(t => t.startsWith('@'))[0] || '').replace('@', '')
      if (!username || !entries.find(e => e.humanId === username)) return
      userData.humanId = username
      userData.systemId = username

      const multipliers = {
        K: 1000,
        M: 1000000,
        none: 1
      }

      const viewsMatch = body.match(/"simpleText":"([\d,\.]+)([KM]*)\s*views"/)
      try {
        const viewsNumber = (viewsMatch[1] || '0').replaceAll(',', '')
        const viewsMultiplier = multipliers[viewsMatch[2] || 'none']
        userData.views = parseInt(parseFloat(viewsNumber) * viewsMultiplier)
      } catch (e) {
        userData.views = 0
      }

      const subscribersMatch = body.match(/"simpleText":"([\d,\.]+)([KM]*)\s*subscribers"/)
      try {
        const subscribersNumber = (subscribersMatch[1] || '0').replaceAll(',', '')
        const subscribersMultiplier = multipliers[subscribersMatch[2] || 'none']
        userData.subscribers = parseInt(parseFloat(subscribersNumber) * subscribersMultiplier)
      } catch(e) {
        userData.subscribers = 0
      }

      data.push(userData)
    },
    async errorHandler() { }
  });

  await crawler.run(entries.map(({ humanId }) => `https://www.youtube.com/@${humanId}/about?cache=${cuid()}`,));
  return data
}
