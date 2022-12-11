import metadata from './metadata'
import { enable, disable } from './register'
import { addAttestation, removeAttestation } from './update'

export default {
  ...metadata,
  enable,
  disable,
  addAttestation,
  removeAttestation,
  data: {
    async email({ systemId, humanId }) {
      const data = {}
      return { service: 'email', data }
    },
    async twitter({ systemId, humanId }) {
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
    },
  },
}
