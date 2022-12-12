export default async function (entries) {
  const maxUsers = 100
  const users = [...entries]
  const queue = []

  while (users.length > 0) {
    queue.push(users.splice(0, maxUsers))
  }

  const data = []
  for (let users of queue) {
    const ids = users.map(({ systemId }) => systemId).join(',')
    const result = await fetch(
      `https://api.twitter.com/2/users?ids=${ids}&user.fields=public_metrics`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    )
    if (!result.ok) continue
    const json = await result.json()
    json.data.forEach((user) => data.push(user))
  }

  return { service: 'twitter', data }
}
