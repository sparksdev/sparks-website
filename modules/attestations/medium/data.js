import cuid from "cuid"
import { CheerioCrawler } from "crawlee"

export default async function (entries) {
  let data = []
  const crawler = new CheerioCrawler({
    async requestHandler({ request, response, body, contentType, $ }) {
      const userData = {}
      const username = $('meta[property="profile:username"]').attr('content')
      if (!username || entries.find(e => e.humanId === username)) return
      userData.humanId = username
      userData.systemId = username
      userData.followers = parseInt($('.pw-follower-count a').first().text().replace(/\s*Followers\s*/, '') || 0)
      userData.following = parseInt($('.pw-follower-count + span + button').first().text().replace(/\s*Following\s*/, '') || 0)
      userData.first_name = $('meta[property="profile:first_name"]').attr('content') || ''
      userData.last_name = $('meta[property="profile:last_name"]').attr('content') || ''
      data.push(userData)
    },
    async errorHandler() {}
  });

  await crawler.run(entries.map(({ humanId }) => `https://medium.com/@${humanId}/about?cache=${cuid()}`));
  return { service: 'medium', data }
}
