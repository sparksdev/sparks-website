import { default as email } from './email'
import { default as twitter } from './twitter'

const attestations = [email, twitter]

export function getAttestation(service) {
  return attestations.find((attestation) => attestation.service === service)
}

export default attestations
