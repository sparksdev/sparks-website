import sharedBox from '@utilities/encryption/shared-box'
import secretBox from '@utilities/encryption/secret-box'
import { hash, keyPairFromSignature } from '@utilities/encryption/utilities'

export async function enable({ user, sign }) {
  const signature = await sign(user.challenge)
  const keyPair = keyPairFromSignature(signature)

  const data = []
  for (let attestation of user.attestations) {
    const systemId = secretBox.decrypt(attestation.systemId, keyPair.secretKey)
    const humanId = secretBox.decrypt(attestation.humanId, keyPair.secretKey)

    const encrypted = {
      systemId: sharedBox.encrypt(
        systemId,
        keyPair.secretKey,
        process.env.STATS_PUBLIC_KEY
      ),
      humanId: sharedBox.encrypt(
        humanId,
        keyPair.secretKey,
        process.env.STATS_PUBLIC_KEY
      ),
    }

    const idHash = hash(systemId + humanId)

    data.push({
      // store a hash to avoid dupes and remove upon request
      service: attestation.service,
      hash: idHash,
      ...encrypted,
    })
  }

  const result = await fetch('/api/apps/memberStats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicKey: keyPair.publicKey, data }),
  })

  return result.ok
}

export async function disable() {
  const result = await fetch('/api/apps/memberStats', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  return result.ok
}

export function Disclosures({ services }) {

  return (
    <>
    </>
  )
}