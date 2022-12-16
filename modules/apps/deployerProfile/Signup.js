import { useEffect, useState } from 'react'
import useMetamask from '@hooks/metamask'
import { useRouter } from 'next/router'
import css from 'styled-jsx/css'
import { Disclosures, enable } from './register'
import { keyPairFromSignature } from '@utilities/encryption/utilities'
import secretBox from '@utilities/encryption/secret-box'

const styles = css`
  div.container {
    text-align: center;
    max-width: 80rem;
  }
  div.container p {
    text-align: justify;
  }
  div.container div {
    display: flex;
    justify-content: center;
  }
  div.container button {
    margin: 0 1.2rem;
  }
  div.container p.error {
    font-weight: bold;
    font-style: italic;
    margin: 0;
    margin-bottom: 2.4rem;
  }
`

export default function SignUp({ user }) {
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState(null)
  const [attestations, setAttestations] = useState()
  const [settingUp, setSettingUp] = useState(false)
  const { sign } = useMetamask()
  const router = useRouter()

  async function setupProfile(event) {
    event.preventDefault()

    const signature = await sign(user.challenge)
    const keyPair = keyPairFromSignature(signature)
    const _attestations = user.attestations.filter(a => {
      return a.service !== 'smartContract'
    })

    if (!_attestations.length) {
      return setError('you need at least one attestation to continue')
    }

    const decrypted = []
    for (let attestation of _attestations) {
      const service = attestation.service
      if (service === 'smartContract') continue
      const systemId = secretBox.decrypt(attestation.systemId, keyPair.secretKey)
      const humanId = secretBox.decrypt(attestation.humanId, keyPair.secretKey)
      decrypted.push({
        service,
        systemId,
        humanId,
      })
    }
    setAttestations(decrypted)
    setSettingUp(true)
  }

  async function _enable(event) {
    event.preventDefault()
    setWaiting(true)
    const ok = await enable({ user, sign })
    setWaiting(false)
    if (!ok) setError('failed to enable try again')
    else router.replace(router.asPath)
  }

  async function cancel(event) {
    event.preventDefault()
    setSettingUp(false)
    setAttestations(null)
  }

  const smartContracts = user.attestations.filter(a => a.service === 'smartContract')
  const disabled = !smartContracts.length || waiting

  useEffect(() => {
    if (!smartContracts.length) {
      setError('you need at least one Smart Contract to enable')
    }
  }, [])

  return (
    <div className="container">
      <style jsx>{styles}</style>
      <h4>Deployer Profile</h4>
      {settingUp ? (
        <Disclosures attestations={attestations} onSubmit={_enable} onCancel={cancel} />
      ) : (
        <>
          <p>
            Deployer Profiles allow you to assert ownership over project properties and optionally disclose aspects of your identity.
            This allows you to build trust with your community with a level of disclosure that you're comfortable with.
          </p>
          <p>
            Once enabled users will be able to find your profile by searching for any of your attested smart contracts. Thus extending
            your reputation and trust to your projects, tokens and service contracts.
          </p>
          {error ? <p className="error">{error}</p> : <></>}
          <div>
            {!settingUp && <button disabled={disabled} onClick={setupProfile}>start setup</button>}
          </div>
        </>
      )}
    </div>
  )
}
