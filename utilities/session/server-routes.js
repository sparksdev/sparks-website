import { withIronSessionApiRoute } from 'iron-session/next'

const sessionOptions = {
  cookieName: process.env.APP_NAME,
  password: process.env.SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

export function withSession(handler) {
  return withIronSessionApiRoute(handler, sessionOptions)
}

export function withSessionRequired(handler) {
  return withIronSessionApiRoute(async function (req, res) {
    const { session } = req
    const { userId } = session
    if (!!userId) {
      return handler(req, res)
    } else {
      session.destroy()
      return res.status(403).send('forbidden')
    }
  }, sessionOptions)
}
