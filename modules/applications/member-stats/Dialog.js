import { useDialog } from '@providers/dialog'
import cuid from 'cuid'
import { useState } from 'react'
import useMetamask from '@hooks/metamask'
import { useRouter } from 'next/router'
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
  p {
    text-align: justify;
  }
  ul {
    display: inline-block;
    margin: 0 auto;
    text-align: left;
    margin-bottom: 2.4rem;
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
`

export default function Dialog({
  user,
  description,
  enable,
  disable,
  onCancel,
}) {
  const { closeDialog } = useDialog()
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState(null)
  const { sign } = useMetamask()
  const router = useRouter()

  function cancel(event) {
    if (event) event.preventDefault()
    setError(null)
    setWaiting(false)
    closeDialog()
    if (onCancel) onCancel()
  }

  async function _enable(event) {
    event.preventDefault()
    if (!enable) {
      throw Error('missing app callback')
    }
    setWaiting(true)
    await enable({ user, sign })
    setWaiting(false)
    closeDialog()
    router.replace(router.asPath)
  }

  async function _disable(event) {
    if (event) event.preventDefault()
    if (!disable) {
      throw Error('missing app callback')
    }
    setWaiting(true)
    await disable()
    setWaiting(false)
    closeDialog()
    router.replace(router.asPath)
  }

  return (
    <form onSubmit={enable}>
      <style jsx>{styles}</style>
      <h4>Sparks Stats</h4>
      {Array.isArray(description) ? (
        description.map((paragraph) => <p key={cuid()}>{paragraph}</p>)
      ) : (
        <p>{description}</p>
      )}
      {error ? <p className="error">{error}</p> : <></>}
      <div>
        <button disabled={waiting} onClick={cancel}>
          cancel
        </button>
        {user.applications.memberStats ? (
          <button disabled={waiting} onClick={_disable}>
            disable
          </button>
        ) : (
          <button disabled={waiting} onClick={_enable}>
            enable
          </button>
        )}
      </div>
    </form>
  )
}
