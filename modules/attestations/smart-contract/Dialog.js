import secretBox from '@utilities/encryption/secret-box'
import sharedBox from '@utilities/encryption/shared-box'
import useMetamask from '@hooks/metamask'
import { useState } from 'react'
import { useDialog } from '@providers/dialog'
import { keyPairFromSignature, hash } from '@utilities/encryption/utilities'
import apps from '@modules/applications'
import css from 'styled-jsx/css'

const styles = css`
  form {
    text-align: center;
  }
  h4 {
    margin-top: 1.2rem;
    text-align: center;
  }
  span {
    display: inline-block;
    text-align: left;
  }
  div {
    display: flex;
    justify-content: center;
  }
  button {
    margin: 0 1.2rem;
  }
  p.error {
    font-weight: bold;
    font-style: italic;
    margin: 0;
    margin-bottom: 2.4rem;
  }
  pre {
    text-align: left;
  }
`

export default function Dialog({ onVerified, onCancel, user }) {
  const { sign, address, connect } = useMetamask()
  const { closeDialog } = useDialog()
  const [contract, setContract] = useState('')
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setWaiting(true)

    let result = await fetch(`/api/attestation/smartContract?contract=${contract}&creator=${address}`)
    if (!result.ok) {
      setWaiting(false)
      return setError(await result.text())
    }

    const { nonce } = await result.json()
    let signature = await sign(nonce)

    result = await fetch(`/api/attestation/smartContract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nonce,
        signature,
        creator: address,
        contract,
      })
    })

    if (!result.ok) {
      setWaiting(false)
      return setError(await result.text())
    }

    const { systemId, humanId } = await result.json()
    signature = await sign(user.challenge)
    const keyPair = keyPairFromSignature(signature)

    const encrypted = {
      systemId: secretBox.encrypt(systemId, keyPair.secretKey),
      humanId: secretBox.encrypt(humanId, keyPair.secretKey),
    }

    result = await fetch('/api/attestation/smartContract', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(encrypted),
    })

    if (!result.ok) {
      setWaiting(false)
      return setError(await result.text())
    }
    const attestation = await result.json()

    for (let app of apps) {
      if (user.applications[app.service] && app.addAttestation) {
        app.addAttestation({
          service: 'smartContract',
          humanId: sharedBox.encrypt(
            humanId,
            keyPair.secretKey,
            process.env.STATS_PUBLIC_KEY
          ),
          systemId: sharedBox.encrypt(
            systemId,
            keyPair.secretKey,
            process.env.STATS_PUBLIC_KEY
          ),
          hash: hash(systemId + humanId),
          publicKey: keyPair.publicKey,
        })
      }
    }

    closeDialog()
    setWaiting(false)
    onVerified(attestation)
  }

  function handleReset(e) {
    if (e) e.preventDefault()
    setError(null)
    setWaiting(false)
    closeDialog()
    if (onCancel) onCancel()
  }

  return (
    <>
      <style jsx>{styles}</style>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <h4>Generate Challenge</h4>
          <p>
            Enter your contract address to recieve a signature challenge to confirm ownership.
            Once confirmed it will be encrypted & stored with keys only you control.
          </p>
          <span>
            <label>Contract Address</label>
            <input
              name="smartContract"
              pattern="[a-zA-Z0-9]{42}"
              value={contract}
              onChange={e => setContract(e.target.value)}
              required
            />
          </span>
          {error ? <p className="error">{error}</p> : <></>}
          <div>
            <button disabled={waiting} type="reset">
              cancel
            </button>
            <button disabled={waiting} type="submit">
              verify
            </button>
          </div>
        </form>
    </>
  )
}
