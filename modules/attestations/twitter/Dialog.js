import { useState } from 'react'
import { useDialog } from '@providers/dialog'
import Link from 'next/link'
import useMetamask from '@hooks/metamask'
import apps from '@modules/applications'
import { hash, keyPairFromSignature } from '@utilities/encryption/utilities'
import secretBox from '@utilities/encryption/secret-box'
import sharedBox from '@utilities/encryption/shared-box'

export default function Dialog({ onVerified, onCancel, user }) {
  const { sign } = useMetamask()
  const { closeDialog } = useDialog()
  const [handle, setHandle] = useState('')
  const [waiting, setWaiting] = useState(false)
  const [challenge, setChallenge] = useState(null)
  const [nonce, setNonce] = useState(null)
  const [error, setError] = useState(null)

  async function getChallenge(event) {
    event.preventDefault()
    setError(null)
    setWaiting(true)
    const result = await fetch(
      `/api/attestation/twitter?handle=${handle.replace('@', '')}`
    )
    if (!result.ok) {
      setWaiting(false)
      return setError(await result.text())
    }
    const { challenge, nonce } = await result.json()
    setWaiting(false)
    setNonce(nonce)
    setChallenge(challenge)
  }

  async function verify(event) {
    event.preventDefault()
    setError(null)

    let result

    setWaiting(true)

    result = await fetch('/api/attestation/twitter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: handle.replace('@', ''), nonce }),
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
    }

    result = await fetch('/api/attestation/twitter', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(encrypted),
    })

    if (!result.ok) {
      setWaiting(false)
      return setError(await result.text())
    }

    const verification = await result.json()

    for (let app of apps) {
      if (user.applications[app.service] && app.addAttestation) {
        app.addAttestation({
          service: 'twitter',
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
    onVerified(verification)
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
        form :global(a) {
          display: block;
          cursor: pointer;
          padding: 2.4rem;
        }
        pre {
          margin-bottom: 0;
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
      {challenge ? (
        <form onSubmit={verify}>
          <h4>Confirm Challenge</h4>
          <p>Tweet the following, and when ready click attest to verify it.</p>
          <pre>{challenge}</pre>
          <Link
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              challenge
            )}`}
            target="_blank"
          >
            click here to tweet
          </Link>
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
        <form onSubmit={getChallenge}>
          <h4>Set Tweet Challenge</h4>
          <p>
            Enter your handle to recieve a unique tweet to confirm ownership.
            Once confirmed it will be encrypted & stored with keys only you
            control.
          </p>
          <input
            value={handle}
            required
            placeholder="@twitter_handle"
            pattern="^@.*$"
            onChange={(e) => setHandle(e.target.value.trim())}
          />
          <div>
            <button disabled={waiting} onClick={cancel}>
              cancel
            </button>
            <button disabled={waiting} type="submit">
              get challenge
            </button>
          </div>
        </form>
      )}
    </>
  )
}
