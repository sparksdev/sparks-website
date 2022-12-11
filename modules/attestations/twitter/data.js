export default async function ({ systemId, humanId }) {
  const result = await fetch(
    `https://api.twitter.com/2/users/${systemId}?user.fields=public_metrics`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }
  )

  if (!result.ok) return null
  const json = await result.json()
  const data = json.data ? json.data.public_metrics : {}
  return { service: 'twitter', data }
}
