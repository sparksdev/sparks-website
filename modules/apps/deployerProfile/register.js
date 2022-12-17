import sharedBox from '@utilities/encryption/shared-box'
import secretBox from '@utilities/encryption/secret-box.js'
import { hash, keyPairFromSignature } from '@utilities/encryption/utilities'
import settingsCards from './settingsCards.js'
import { useState } from 'react'

export async function enable({ user, sign, profile: decryptedProfile, contracts: encryptedContracts }) {
  const signature = await sign(user.challenge)
  const keyPair = keyPairFromSignature(signature)

  const profile = sharedBox.encrypt(
    JSON.stringify(decryptedProfile),
    keyPair.secretKey,
    process.env.DEPLOYER_PROFILE_PUBLIC_KEY
  )

  const contracts = encryptedContracts.map(contract => {
    return hash(secretBox.decrypt(contract, keyPair.secretKey))
  })

  const result = await fetch('/api/apps/deployerProfile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      publicKey: keyPair.publicKey, 
      contracts,
      profile, 
    }),
  })

  return result.ok
}

export async function disable() {
  const result = await fetch('/api/apps/deployerProfile', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  return result.ok
}

const defaultSettings = {
  email: {
    include: false,
    usePattern: false,
    pattern: '',
    categorize: false,
    error: null,
  },
  domain: {
    include: false,
    error: null,
  },
  github: {
    include: false,
    show_handle: false,
    public_repos: false,
    public_gists: false,
    followers: false,
    contributions: false,
    error: null,
  },
  twitter: {
    include: false,
    show_handle: false,
    followers: false,
    tweets: false,
    error: null,
  },
  medium: {
    include: false,
    show_handle: false,
    followers: false,
    error: null,
  }
}

export function Disclosures({ attestations, handleSubmit, handleCancel }) {
  const [index, setIndex] = useState(0)
  const [settings, setSettings] = useState(attestations.map(attestation => ({
    ...attestation,
    ...defaultSettings[attestation.service]
  })))

  function update(data, index) {
    settings[index] = { ...data }
    setSettings([...settings])
  }

  return (
    <>
      <style jsx>{`
        h5 {
          margin-bottom: 0rem;
        }
        .buttons {
          display: flex;
          justify-content: center;
        }
        .buttons button {
          margin: .8rem;
        }
      `}</style>
      <h5>Setup Disclosures </h5>
      {settings.map((settings, number) => {
        const Card = settingsCards[settings.service]
        return number === index && (
          <Card
            key={`${settings.service}${number}`}
            settings={settings}
            update={data => update(data, number)}
          />
        )
      })}
      <div className='buttons'>
        {index > 0 && <button disabled={settings[index].error} onClick={() => setIndex(index - 1)}>prev</button>}
        {index < (settings.length - 1) && <button disabled={settings[index].error} onClick={() => setIndex(index + 1)}>next</button>}
        {index === (settings.length - 1) && (
          <>
            <button onClick={() => handleCancel()}>cancel</button>
            <button disabled={settings[index].error} onClick={() => handleSubmit(settings)}>submit</button>
          </>
        )}
      </div>
    </>
  )
}