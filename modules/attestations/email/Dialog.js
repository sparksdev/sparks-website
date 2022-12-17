import secretBox from '@utilities/encryption/secret-box'
import sharedBox from '@utilities/encryption/shared-box'
import useMetamask from '@hooks/metamask'
import { useState } from 'react'
import { useDialog } from '@providers/dialog'
import { keyPairFromSignature, hash } from '@utilities/encryption/utilities'
import apps from '@modules/apps'

export default function Dialog({ onVerified, onCancel, user }) {
  const { sign } = useMetamask()
  const { closeDialog } = useDialog()
  const [email, setEmail] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const [nonceSent, setNonceSent] = useState(false)
  const [error, setError] = useState(null)

  async function verify(e) {
    e.preventDefault()
    setError(null)
    setWaiting(true)
    const nonce = e.target.elements.nonce.value
    let result = await fetch('/api/attestations/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nonce, email }),
    })

    if (!result.ok) {
      setWaiting(false)
      return setError(await result.text())
    }

    const { systemId, humanId } = await result.json()
    const signature = await sign(user.challenge)
    const keyPair = keyPairFromSignature(signature)

    const encrypted = {
      systemId: secretBox.encrypt(systemId, keyPair.secretKey),
      humanId: secretBox.encrypt(humanId, keyPair.secretKey),
      hash:  hash(systemId + humanId),
    }

    result = await fetch('/api/attestations/email', {
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
      if (user.apps[app.service] && app.addAttestation) {
        app.addAttestation({
          service: 'email',
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

  async function sendNonce(e) {
    e.preventDefault()
    setError(null)
    setWaiting(true)
    const email = e.target.elements.email.value
    const result = await fetch(`/api/attestations/email?email=${email}`)
    if (!result.ok) {
      setWaiting(false)
      return setError(await result.text())
    }
    e.target.elements.email.value = ''
    setEmail(email)
    setWaiting(false)
    setNonceSent(true)
  }

  function cancel(e) {
    if (e) e.preventDefault()
    setError(null)
    setWaiting(false)
    closeDialog()
    if (onCancel) onCancel()
  }

  return (
    <>
      <style jsx>{`
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
      `}</style>
      {nonceSent ? (
        <form onSubmit={verify}>
          <h4>Confirm Challenge</h4>
          <p>
            Enter the code you recieved, be sure to check your spam if it's been
            a few minutes.
          </p>
          <span>
            <label>Email Code</label>
            <input
              name="nonce"
              type="text"
              defaultValue={''}
              placeholder="123LKJ02348RSFI3KJH3"
              required
            />
          </span>
          {error ? <p className="error">{error}</p> : <></>}
          <div>
            <button disabled={waiting} onClick={cancel}>
              cancel
            </button>
            <button disabled={waiting} type="submit">
              verify
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={sendNonce}>
          <h4>Send Email Code</h4>
          <p>
            Enter your email to recieve a unique code to confirm ownership. Once
            confirmed it will be encrypted & stored with keys only you control.
          </p>
          <span>
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              defaultValue={''}
              placeholder="username@email.com"
              required
            />
          </span>
          <div>
            <button disabled={waiting} onClick={cancel}>
              cancel
            </button>
            <button disabled={waiting} type="submit">
              send code
            </button>
          </div>
        </form>
      )}
    </>
  )
}
