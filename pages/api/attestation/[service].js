import { withSession } from '@utilities/session/server-routes'
import { getAttestation } from '@modules/attestations'
import { prisma } from '@utilities/database'
import * as utils from '@utilities/encryption/utilities'

async function challenge(req, res) {
  const { service } = req.query
  const attestation = getAttestation(service)
  if (!attestation) return res.status(404).send('attestation not found')
  const nonce = utils.nonce()
  await attestation.challenge({ req, res, nonce })
}

async function verify(req, res) {
  const { service } = req.query
  const attestation = getAttestation(service)
  if (!attestation) return res.status(404).send('attestation not found')
  await attestation.verify({ req, res })
}

async function update(req, res) {
  const { service } = req.query
  const { systemId, humanId } = req.body
  const { userId } = req.session
  const attestation = await prisma.attestation.create({
    data: { userId, service, systemId, humanId },
  })
  return res.json({ ok: true, attestation })
}

async function remove(req, res) {
  const { userId } = req.session
  if (!userId) return res.status(403).send('not allowed')
  const { attestationId } = req.query
  const result = await prisma.attestation.delete({
    where: { attestationId },
  })
  return res.json(result)
}

async function handler(req, res) {
  const {
    method,
    query: { service },
  } = req

  if (!getAttestation(service)) return res.status(404).send('not found')
  if (method === 'GET') return challenge(req, res)
  if (method === 'POST') return verify(req, res)
  if (method === 'PUT') return update(req, res)
  if (method === 'DELETE') return remove(req, res)
  return res.status(405).send('method not allowed')
}

export default withSession(handler)
