import { withSession } from '@utilities/session/server-routes'
import * as utils from '@utilities/encryption/utilities'
import { ethers } from 'ethers'
import { User } from '@utilities/database'

async function challenge(req, res) {
  const {
    session,
    query: { address },
  } = req

  const message =
    '' +
    'Welcome to SPARKS. Please sign this message to login. ' +
    'This signin does not submit a transaction and is only ' +
    `used to authenticate you as a user. Challenge code ${utils.nonce()}`

  session.challenge = { address, message }
  await session.save()
  return res.json({ ok: true, message })
}

async function verify(req, res) {
  const {
    query: { signature },
    session,
  } = req

  const {
    challenge: { message, address },
  } = session

  const _address = await ethers.utils.verifyMessage(message, signature)

  if (_address !== address) {
    return res.status(403).send('invalid')
  }

  const userId = utils.hash(address)
  const user = await User.get(userId)

  if (!!user) {
    delete session.challenge
    session.userId = user.userId
    session.nonce = utils.nonce()
    await session.save()
    res.json({ userId })
  } else {
    session.challenge.signature = signature
    await session.save()
    res.status(404).send('user not found')
  }
}

async function handler(req, res) {
  const {
    method,
    query: { address, signature },
  } = req

  if (method !== 'GET') return res.status(405).send('method not allowed')
  if (!address && !signature)
    return res.status(406).send('missing required param')
  if (address) return challenge(req, res)
  if (signature) return verify(req, res)

  res.status(404).send('not found')
}

export default withSession(handler)
