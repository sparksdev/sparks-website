import { Octokit } from "@octokit/rest" 

export async function challenge({ req, res, nonce }) {
  const {
    session,
    query: { username },
  } = req
  if (!username) {
    return res.status(403).send('invalid username')
  }
  const challenge = `SPARKS Verification ${nonce}`
  session.attest = session.attest || {}
  session.attest.github = { nonce, username }
  await session.save()
  return res.json({ ok: true, nonce, challenge })
}

export async function verify({ req, res }) {
  const { body, session } = req
  const { username, nonce } = session.attest.github
  if (nonce !== body.nonce || username !== body.username) {
    return res.status(403).send('invalid challenge')
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_API_KEY })
  const result = await octokit.request('GET /users/{username}', { username })
  let verified = false
  if (result.status === 200 && result.data.bio.includes(nonce)) {
    verified = true
  }

  if (!verified) {
    return res
      .status(403)
      .send("can't find verification - check bio & try again")
  }

  delete session.attest.github
  await session.save()
  return res.json({
    systemId: result.data.id + '',
    humanId: result.data.login,
  })
}
