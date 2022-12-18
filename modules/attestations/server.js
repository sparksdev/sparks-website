import * as email from './email/verification'
import * as twitter from './twitter/verification'
import * as domain from './domain/verification'
import * as github from './github/verification'
import * as medium from './medium/verification'
import * as youtube from './youtube/verification'
import * as smartContract from './smart-contract/verification'

import emailData from './email/data'
import twitterData from './twitter/data'
import domainData from './domain/data'
import githubData from './github/data'
import mediumData from './medium/data'
import youtubeData from './youtube/data'
import smartContractData from './smart-contract/data'

const attestations = {
  email: { ...email, data: emailData },
  domain: { ...domain, data: domainData },
  github: { ...github, data: githubData },
  twitter: { ...twitter, data: twitterData },
  medium: { ...medium, data: mediumData },
  youtube: { ...youtube, data: youtubeData },
  smartContract: { ...smartContract, data: smartContractData },
}

export function getAttestation(service) {
  return attestations[service]
}

export default attestations
