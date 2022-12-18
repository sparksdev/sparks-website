import { CheerioCrawler } from 'crawlee'
import cuid from 'cuid'

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
  session.attest.medium = { nonce, username }
  await session.save()
  return res.json({ ok: true, nonce, challenge })
}

export async function verify({ req, res }) {
  const { body, session } = req
  const { username, nonce } = session.attest.medium
  if (nonce !== body.nonce || username !== body.username) {
    return res.status(403).send('invalid challenge')
  }

  const handle = username.trim().replace('@', '')
  const verified = await checkBiography(handle, nonce)

  if (!verified) {
    return res
      .status(403)
      .send("can't find verification - check bio & try again")
  }

  delete session.attest.medium
  await session.save()
  return res.json({
    systemId: username,
    humanId: username,
  })
}

async function checkBiography(username, nonce) {
  return new Promise(async (resolve, reject) => {
    let verified = false
    const crawler = new CheerioCrawler({
      async requestHandler({ request, response, body, contentType, $ }) {
        verified = body.includes(nonce)
      },
      async errorHandler() {
        verified = false
      }
    });
    await crawler.run([
      `https://www.youtube.com/@${username}/about?cache=${cuid()}`,
    ]);
    resolve(verified)
  })
}
