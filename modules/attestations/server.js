import * as email from './email/verification'
import * as twitter from './twitter/verification'
import * as domain from './domain/verification'
import * as medium from './medium/verification'
import * as smartContract from './smart-contract/verification'

const attestations = {
  email, 
  domain,
  twitter, 
  medium,
  smartContract,
}

export function getAttestation(service) {
  return attestations[service]
}

export default attestations
