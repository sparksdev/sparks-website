import puppeteer from 'puppeteer'

export async function challenge({ req, res, nonce }) {
  const {
    session,
    query: { username },
  } = req
  if (!username) {
    return res.status(403).send('invalid username')
  }
  const challenge = `#SPARKS Verification ${nonce}`
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
  const results = await checkBiography(handle, nonce)

  if (!results) {
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

// try for one minute then give up
async function checkBiography(username, nonce) {
  // todo scrape the about page and return verified
  let verified = false

  try {
    const url = `https://medium.com/@${username}/about`
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    const bio = await page.$eval('.pw-post-body-paragraph', (bio) => bio.textContent);
    verified = bio.includes(nonce)
    await browser.close()
  } catch (error) {
    verified = false
  }

  return verified
}
