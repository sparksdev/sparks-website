import Icon from '@elements/Icon'
import css from 'styled-jsx/css'
import React, { useState } from 'react'
import useMetamask from '@hooks/metamask'
import { hash, keyPairFromSignature } from '@utilities/encryption/utilities'
import { decrypt } from '@utilities/encryption/secret-box'
import { useRouter } from 'next/router'
import apps, { getApplication } from '@modules/applications'

const styles = css`
  div {
    border: solid 2px var(--h5-font-color);
    border-radius: 4px;
    padding: 1.8rem;
    display: inline-flex;
    flex-direction: column;
    align-items: stretch;
    margin: 1.2rem;
    flex: 1;
    min-width: 40rem;
  }
  div h5 {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div h5 :global(.icon) {
    margin-right: 1.2rem;
  }
  div pre {
    font-style: normal;
    flex-grow: 1;
    margin: 1.6rem auto;
    text-align: justify;
    overflow: hidden;
    width: 100%;
    text-align: center;
    text-overflow: ellipsis;
  }
  div :global(button) {
    width: auto;
    margin: 0 0.6rem;
  }
  span {
    display: flex;
    justify-content: center;
  }
`

export default function CardProfile({
  attestationId,
  humanId,
  systemId,
  service,
  user,
}) {
  const [waiting, setWaiting] = useState(false)
  const [humanIdentifier, setHumanIdentifier] = useState(humanId)
  const [systemIdentifier, setSystemIdentifier] = useState(humanId)
  const [revealed, setRevealed] = useState(false)
  const { sign } = useMetamask()
  const router = useRouter()

  async function remove() {
    setWaiting(true)
    const result = await fetch(
      `/api/attestation/${service}?attestationId=${attestationId}`,
      { method: 'DELETE' }
    )
    if (!result.ok) return
    const json = await result.json()
    setWaiting(false)

    const hasApp = apps.find((app) => user.applications[app.service])
    if (hasApp && !revealed) {
      const data = await reveal()
      const idsHash = hash(data.systemId + data.humanId)
      for (let app of apps) {
        const userApp = getApplication(app.service)
        if (userApp && app.removeAttestation) {
          app.removeAttestation({ hash: idsHash })
        }
      }
    }
    router.replace(router.asPath)
  }

  async function reveal() {
    setWaiting(true)
    const signature = await sign(user.challenge)
    const { secretKey } = keyPairFromSignature(signature)
    const data = {
      humanId: decrypt(humanId, secretKey),
      systemId: decrypt(systemId, secretKey),
    }
    setHumanIdentifier(data.humanId)
    setSystemIdentifier(data.systemId)
    setWaiting(false)
    setRevealed(true)
    return data
  }

  async function hide() {
    setWaiting(true)
    setHumanIdentifier(humanId)
    setRevealed(false)
    setWaiting(false)
  }

  return (
    <div>
      <style jsx>{styles}</style>
      <h5>
        <Icon id={service} size={24} />
        {service}
      </h5>
      <pre>{humanIdentifier}</pre>
      <span>
        <button disabled={waiting} onClick={remove}>
          DELETE
        </button>
        <button disabled={waiting} onClick={revealed ? hide : reveal}>
          {revealed ? 'HIDE' : 'REVEAL'}
        </button>
      </span>
    </div>
  )
}
