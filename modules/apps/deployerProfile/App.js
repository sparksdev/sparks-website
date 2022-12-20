import { useEffect, useState } from "react"
import { disable } from './register'
import { useRouter } from "next/router"
import ServiceCard from './ServiceCard'
import cuid from "cuid"

export default function App({ user }) {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const result = await fetch('/api/apps/deployerProfile')
      const failed = 'could not load profiles try again later'
      if (!result.ok) return setError(failed)
      const { profile } = await result.json()
      setProfile(profile)
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
        .buttons {
          margin-bottom: 2.4rem;
        }
      `}</style>
      <h4>Deployer Profile</h4>
      {error ? <p>{error}</p> : <></>}
      {profile && !error && (
        <div className="cards">
          {profile.map(({ service, ...data }) => (
            <ServiceCard key={cuid()} service={service} data={data} />
          ))}
        </div>
      )}
      <div className="buttons">
        {!profile && !error ? (
          <p>loading...</p>
        ) : (
          <button disabled={waiting} onClick={_disable}>disable app</button>
        )}
      </div>
    </div>
  )
}