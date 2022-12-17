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
  const [domain, setDomain] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const [challenge, setChallenge] = useState(false)
  const [nonce, setNonce] = useState(null)
  const [error, setError] = useState(null)

  async function verify(e) {
    e.preventDefault()
    setError(null)
    setWaiting(true)

    let result = await fetch('/api/attestations/domain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nonce, domain }),
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

    result = await fetch('/api/attestations/domain', {
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
          service: 'domain',
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

  async function getChallenge(e) {
    e.preventDefault()
    setError(null)
    setWaiting(true)
    const domain = e.target.elements.domain.value
    const result = await fetch(`/api/attestations/domain?domain=${domain}`)
    if (!result.ok) {
      setWaiting(false)
      return setError(await result.text())
    }
    const { challenge, nonce } = await result.json()
    e.target.elements.domain.value = ''
    setDomain(domain)
    setNonce(nonce)
    setWaiting(false)
    setChallenge(challenge)
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
        pre {
          text-align: left;
        }
      `}</style>
      {challenge ? (
        <form onSubmit={verify}>
          <h4>Confirm Challenge</h4>
          <p>
            To attest ownership of your domain add a <code>TXT</code> record to
            your DNS records with the following value then click verify.
          </p>
          <pre>{challenge}</pre>
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
          <h4>Generate Challenge</h4>
          <p>
            Enter your domain to recieve a unique code to confirm ownership.
            Once confirmed it will be encrypted & stored with keys only you
            control. Do not include http or www.
          </p>
          <span>
            <label>Domain</label>
            <input
              name="domain"
              defaultValue={''}
              pattern=".+\..+"
              placeholder="example.com"
              required
            />
          </span>
          <div>
            <button disabled={waiting} onClick={cancel}>
              cancel
            </button>
            <button disabled={waiting} type="submit">
              get code
            </button>
          </div>
        </form>
      )}
    </>
  )
}
