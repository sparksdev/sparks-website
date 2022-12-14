import { default as email } from './email'
import { default as twitter } from './twitter'
import { default as domain } from './domain'
import { default as medium } from './medium'
import { default as github } from './github'
import { default as smartContract } from './smart-contract'

const attestations = [email, domain, github, twitter, medium, smartContract]

export function getAttestation(service) {
  return attestations.find((attestation) => attestation.service === service)
}

export default attestations
