import { User } from '@utilities/database'
import { withIronSessionSsr } from 'iron-session/next'

const sessionOptions = {
  cookieName: process.env.APP_NAME,
  password: process.env.SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

export function withSession(handler) {
  return withIronSessionSsr(async function (ctx) {
    const session = ctx.req.session || {}
    const user = session.userId ? await User.get(session.userId) : undefined
    const data = handler ? await handler(ctx) : { props: {} }
    if (user) data.props.user = user
    return { ...data, props: { session, ...data.props } }
  }, sessionOptions)
}

export function withSessionRequired(handler) {
  return withIronSessionSsr(async function (ctx) {
    const session = ctx.req.session || {}
    const user = await User.get(session.userId)
    if (!user) {
      session.destroy()
      return { redirect: { permanent: false, destination: '/' } }
    } else {
      const data = handler ? await handler(ctx) : { props: { user } }
      return { ...data, props: { session, ...data.props } }
    }
  }, sessionOptions)
}
