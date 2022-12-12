import { default as email } from './email'
import { default as twitter } from './twitter'
import { default as domain } from './domain'

const attestations = [email, twitter, domain]

export function getAttestation(service) {
  return attestations.find((attestation) => attestation.service === service)
}

export default attestations
