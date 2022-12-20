import { useEffect, useState } from "react"
import ServiceCard from '@modules/apps/deployerProfile/ServiceCard'
import cuid from "cuid"
import Head from "@layout/Head"
import Header from "@layout/Header"
import Footer from "@layout/Footer"
import { ethers } from 'ethers'

export default function App({ contract }) {
  const [profile, setProfile] = useState(null)
  const [signature, setSignature] = useState(null)
  const [error, setError] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const [verifiedAddress, setVerifiedAddress] = useState(null)

  useEffect(() => {
    (async () => {
      setWaiting(true)
      const result = await fetch(`/api/apps/deployerProfile?contract=${contract}`)
      const failed = `contract could not be found`
      if (!result.ok) return setError(failed)
      const { profile, signature } = await result.json()
      setWaiting(false)
      setProfile(profile)
      setSignature(signature)
    })();
  }, [contract])

  async function verifyContract(event) {
    event.preventDefault()
    setWaiting(true)
    const contract = event.target.contract.value
    const address = ethers.utils.verifyMessage(contract, signature)
    const result = await fetch(`/api/apps/deployerProfile?contract=${contract}&address=${address}`)
    const failed = `couldn't verify deployer address`
    setWaiting(false)
    if (!result.ok) return setError(failed)
    const { verified } = await result.json()
    if (verified) setVerifiedAddress(address)
  }

  return (
    <>
      <Head />
      <Header protect={false} />
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
            .app h6 {
              font-weight: bold;
              font-style: italic;
              margin-bottom: 0;
              margin-top: 1.2rem;
            }
            .cards {
              display: flex;
              flex-direction: row;
              align-items: stretch;
              justify-content: flex-start;
              flex-wrap: wrap;
              width: 100%;
              margin-top: 2.4rem;
            }
            .app h5 {
              text-align: center;
              max-width: 60rem;;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .app h5 + h5 {
              margin-top: 0;
              margin-bottom: 0;
            }
            .app .signature {
              display: flex;
              width: 100%;
              max-width: 60rem;
              align-items: center;
            }
            .app .signature * {
              margin: 0;
            }
            .app .signature input {
              flex-grow: 1;
            }
            button {
              margin-top: 1.8rem;
            }
            .buttons {
              margin-bottom: 2.4rem;
            }
          `}</style>
        <h4>Deployer Profile</h4>
        {error && <h6>{error}</h6>}
        <h5>Contract<br />{contract}</h5>
        {waiting && !error && <h5>loading</h5>}
        {!waiting && profile && (
          <>
            {verifiedAddress  && error ? (
              <h6>{error}</h6>
            ) : verifiedAddress ? (
              <>
                <h5>Deployer Address</h5>
                <h5>{verifiedAddress}</h5>
              </>
            ) : (
              <>
                <h5>Signature</h5>
                <h5>{signature}</h5>
                <form onSubmit={verifyContract} className="signature">
                  <input type="text" name="contract" placeholder="enter contract to verify profile's address" defaultValue="" />
                  <button type="submit" disabled={waiting}>verify</button>
                </form>
              </>
            )}
            {!error && verifiedAddress && (
              <div className="cards">
                {profile.map(({ service, ...data }) => (
                  <ServiceCard key={cuid()} service={service} data={data} />
                ))}
              </div>
            )}
          </>
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