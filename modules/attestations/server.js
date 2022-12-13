import * as email from './email/verification'
import * as twitter from './twitter/verification'
import * as domain from './domain/verification'
import * as medium from './medium/verification'
import * as smartContract from './smart-contract/verification'

import emailData from './email/data'
import twitterData from './twitter/data'
import domainData from './domain/data'
import mediumData from './medium/data'
import smartContractData from './smart-contract/data'

const attestations = {
  email: { ...email, data: emailData },
  domain: { ...domain, data: domainData },
  twitter: { ...twitter, data: twitterData },
  medium: { ...medium, data: mediumData },
  smartContract: { ...smartContract, data: smartContractData },
}

export function getAttestation(service) {
  return attestations[service]
}

export default attestations
