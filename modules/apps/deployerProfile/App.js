import { useEffect, useState } from "react"
import { getAttestation } from "@modules/attestations"
import cuid from "cuid"
import { disable } from './register'
import { useRouter } from "next/router"

export default function App() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const result = await fetch('/api/apps/memberStats?update=1')
      const failed = 'could not load stats try again later'
      if (!result.ok) return setError(failed)
      const { data } = await result.json()
      if (!data || !Array.isArray(data)) return setError(failed)
      setStats(data)
    })();
  }, [])

  async function _disable(event) {
    if (event) event.preventDefault()
    setWaiting(true)
    const ok = await disable()
    setWaiting(false)
    if (!ok) setError('failed to dsiable try again')
    else router.replace(router.asPath)
  }

  return (
    <div className="app">
      <style jsx>{`
        .app, .cards {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: center;
        }
        .cards {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          justify-content: flex-start;
          flex-wrap: wrap;
          width: 100%;
        }
        button {
          margin-top: 1.8rem;
        }
      `}</style>
      <h4>Member Stats</h4>
      {error ? <p>{error}</p> : <></>}
      {stats && !error && (
        <div className="cards">
          {stats.map(({ service, data }) => {
          })}
        </div>
      )}
      {!stats && !error ? (
        <p>loading...</p>
      ) : (
        <button disabled={waiting} onClick={_disable}>disable app</button>
      )}
    </div>
  )
}