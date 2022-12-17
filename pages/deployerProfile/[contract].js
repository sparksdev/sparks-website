import { useEffect, useState } from "react"
import ServiceCard from '@modules/apps/deployerProfile/ServiceCard'
import cuid from "cuid"
import Head from "@layout/Head"
import Header from "@layout/Header"
import Footer from "@layout/Footer"

export default function App({ contract }) {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    (async () => {
      setWaiting(true)
      const result = await fetch(`/api/apps/deployerProfile?contract=${contract}`)
      const failed = `profile for contract ${contract} not found`
      if (!result.ok) return setError(failed)
      const json = await result.json()
      setWaiting(false)
      setProfile(json)
    })();
  }, [])

  return (
    <>
      <Head />
      <Header />
      <div className="app">
        <style jsx>{`
            .app {
              padding-top: 3.6rem;
              padding-bottom: 3.6rem;
              min-height: calc(100vh - 2.4rem);
              max-width: 120rem;
              margin: 0 auto;
            }
            .app, .cards {
              display: flex;
              width: 100%;
              flex-direction: column;
              align-items: center;
            }
            .app h4 {
              margin-bottom: 0rem;
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
        <h5>{contract}</h5>
        {error && <p>{error}</p>}
        {waiting && <p>loading...</p>}
        {!waiting && profile && (
          <div className="cards">
            {profile.map(({ service, ...data }) => (
              <ServiceCard key={cuid()} service={service} data={data} />
            ))}
          </div>
        )}
      </div>
      <hr />
      <Footer />
    </>
  )
}

export const getServerSideProps = function (ctx) {
  return {
    props: {
      contract: ctx.query.contract
    }
  }
}