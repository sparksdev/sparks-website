import { ethers } from 'ethers'
import { withSession } from '@utilities/session/server-routes'
import { User } from '@utilities/database'
import { hash } from '@utilities/encryption/utilities'

async function deleteUser(req, res) {
  const { userId } = req.session
  if (!User.delete(userId)) {
    req.session.destroy()
    return res.status(200).send('deleted')
  } else {
    return res.status(500).send('failed to remove user')
  }
}

async function registerUser(req, res) {
  const {
    session,
    body: { address },
  } = req
  const { message, signature } = session.challenge

  if (!address) {
    return res.status(406).send('missing required data')
  }

  const signerAddr = await ethers.utils.verifyMessage(message, signature)
  if (signerAddr !== address) {
    return res.status(403).send('invalid signature')
  }

  const userId = hash(address)
  const created = await User.create(userId)
  if (!created) {
    return res.status(500).send('failed to register')
  }

  session.userId = userId
  delete session.challenge
  await session.save()

  res.status(200).send(userId)
}

async function handler(req, res) {
  const { method } = req

  if (method === 'DELETE') return deleteUser(req, res)
  if (method === 'POST') return registerUser(req, res)

  return res.status(405).send('method not allowed')
}

export default withSession(handler)
