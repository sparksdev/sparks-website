export async function challenge({ req, res, nonce }) {
  const {
    session,
    query: { domain },
  } = req

  const challenge = `sparks=${nonce}`

  session.attest = session.attest || {}
  session.attest.domain = { nonce, domain, challenge }
  await req.session.save()
  return res.json({ ok: true, challenge, nonce })
}

export async function verify({ req, res }) {
  const { body, session } = req
  const { domain, nonce, challenge } = session.attest.domain

  if (nonce !== body.nonce || domain !== body.domain) {
    return res.status(403).send('invalid challenge')
  }

  const record = await checkForDnsRecord(domain, challenge)

  if (!record) {
    return res
      .status(403)
      .send("can't find record yet - wait a few minutes and try again, it can take time to propagate")
  }

  delete session.attest.domain
  await session.save()
  return res.json({
    systemId: domain,
    humanId: domain,
  })
}

// try for one minute then give up
async function checkForDnsRecord(url, challenge, resolve, count) {
  if (!resolve) {
    return new Promise((resolve) => {
      checkForDnsRecord(url, challenge, resolve, 0)
    })
  }

  const result = await fetch("https://api.geekflare.com/dnsrecord", {
    method: 'POST',
    headers: {
      "x-api-key": process.env.GEEKFLARE_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      types: ['TXT']
    })
  })

  const json = await result.json()
  const txt = json.data?.TXT || []
  const verified = !!txt
    .flatMap(txt => txt)
    .filter(txt => txt === challenge).length

  console.log(verified)
    
  if (!verified && count < 12) {
    return setTimeout(() => {
      checkForDnsRecord(url, challenge, resolve, count + 1)
    }, 5000)
  }

  return resolve(verified)
}