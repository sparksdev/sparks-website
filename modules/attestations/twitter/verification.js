export async function challenge({ req, res, nonce }) {
  const {
    session,
    query: { handle },
  } = req
  if (!handle) {
    return res.status(403).send('invalid handle')
  }
  const challenge = `I hereby reclaim my digital identity with https://sparks.dev! ◆ #SPARKS @sparksdev_ ${nonce}`
  session.attest = session.attest || {}
  session.attest.twitter = { nonce, handle }
  await session.save()
  return res.json({ ok: true, nonce, challenge })
}

export async function verify({ req, res }) {
  const { body, session } = req
  const { handle, nonce } = session.attest.twitter
  if (nonce !== body.nonce || handle !== body.handle) {
    return res.status(403).send('invalid challenge')
  }

  const from = handle.trim()
  const tweet = await checkForTweet(from, nonce)

  if (!tweet) {
    return res
      .status(403)
      .send("can't lookup tweet yet - try verifying again shortly")
  }

  delete session.attest.twitter
  await session.save()
  return res.json({
    systemId: tweet.author_id,
    humanId: handle.replace('@', ''),
  })
}

// try for one minute then give up
async function checkForTweet(from, nonce, resolve, count) {
  if (!resolve)
    return new Promise((resolve) => {
      checkForTweet(from, nonce, resolve, 0)
    })

  const url =
    `https://api.twitter.com/2/tweets/search/recent` +
    `?query=from:${from} ${nonce}` +
    `&tweet.fields=author_id,created_at`

  const search = await fetch(encodeURI(url), {
    headers: {
      'User-Agent': 'v2RecentSearchJS',
      authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  })

  const json = await search.json()
  const tweet = json.data?.filter((t) => t.text.includes(nonce))[0] || null
  if (!tweet && count < 12) {
    return setTimeout(() => {
      checkForTweet(from, nonce, resolve, count + 1)
    }, 5000)
  }

  return resolve(tweet)
}
