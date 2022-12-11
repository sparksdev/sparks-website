import mailer from '@sendgrid/mail'

export async function challenge({ req, res, nonce }) {
  const {
    session,
    query: { email },
  } = req

  mailer.setApiKey(process.env.SENDGRID_API_KEY)

  try {
    await mailer.send({
      to: email,
      from: 'verify@sparks.dev',
      subject: 'email verification code',
      text: `paste following verification code to verify\n\n${nonce}\n\n`,
    })
  } catch (e) {
    return res.status(500).send('could not send email')
  }

  session.attest = session.attest || {}
  session.attest.email = { nonce, email }
  await req.session.save()
  return res.json({ ok: true })
}

export async function verify({ req, res }) {
  const { session, body } = req
  const { nonce, email } = session.attest.email
  if (body.nonce !== nonce || body.email !== email) {
    return res.status(403).send('invalid confirmation')
  }
  delete session.attest.email
  await session.save()
  return res.json({ ok: true, humanId: email, systemId: email })
}
