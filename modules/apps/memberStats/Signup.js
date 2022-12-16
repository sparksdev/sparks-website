import { useState } from 'react'
import useMetamask from '@hooks/metamask'
import { useRouter } from 'next/router'
import css from 'styled-jsx/css'
import { enable } from './register'
import Icon from '@elements/Icon'

const styles = css`
  form {
    text-align: center;
    max-width: 80rem;
  }
  p {
    text-align: justify;
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

export default function SignUp({ user }) {
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState(null)
  const { sign } = useMetamask()
  const router = useRouter()

  async function _enable(event) {
    event.preventDefault()
    setWaiting(true)
    const ok = await enable({ user, sign })
    setWaiting(false)
    if (!ok) setError('failed to enable try again')
    else router.replace(router.asPath)
  }

  return (
    <form onSubmit={enable}>
      <style jsx>{styles}</style>
      <h4><Icon id="StatsReport" size={24}/> Member Stats</h4>
      <p>SPARKS wants to encrypt your identifiers using a shared key & store them to compute aggregate stats. Individual data is only be used to calculate totals & will not be stored individually.</p>
      <p>We'll use these stats to signal the strength of the community & seek opportunities to bring value to the ecosystem.</p>
      {error ? <p className="error">{error}</p> : <></>}
      <div>
        <button disabled={waiting} onClick={_enable}>enable app</button>
      </div>
    </form>
  )
}
