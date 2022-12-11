import { withSession } from '@utilities/session/server-routes'

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('method not allowed')
  }
  req.session.destroy()
  res.redirect('/')
}

export default withSession(handler)
