import { ethers } from 'ethers'
import { hash } from '@utilities/encryption/utilities'

export async function challenge({ req, res, nonce }) {
  const {
    session,
    query: { contract, creator },
  } = req

  session.attest = session.attest || {}
  session.attest.smartContract = { nonce, contract, creator }
  await req.session.save()
  return res.json({ ok: true, nonce })
}

export async function verify({ req, res }) {
  const { body, session } = req
  const { creator, contract, nonce } = session.attest.smartContract

  if (nonce !== body.nonce || contract !== body.contract || creator !== body.creator) {
    return res.status(403).send('invalid challenge')
  }

  const address = await ethers.utils.verifyMessage(nonce, body.signature)
  if (!address || address !== creator) {
    return res.status(403).send('address mismatch')
  }

  if (hash(creator) !== session.userId) {
    return res.status(403).send('must be logged in with creator account')
  }

  const isCreator = await isContractCreator(contract, creator)

  if (!isCreator) {
    return res.status(403).send('not creator')
  }

  delete session.attest.smartContract
  await session.save()
  return res.json({
    systemId: contract,
    humanId: contract,
  })
}

async function isContractCreator(contract, creator) {
  const url = `https://api.etherscan.io/api` +
    `?module=contract&action=getcontractcreation` +
    `&contractaddresses=${contract}` +
    `&apikey=${process.env.ETHERSCAN_API_KEY}`

  const result = await fetch(url)
  if (!result.ok) {
    return res.status(500).send(result.statusText)
  }

  const json = await result.json()
  const isOwner = !!json.result?.find(({ contractCreator }) => contractCreator.toLowerCase() === creator.toLowerCase())
  return isOwner
}