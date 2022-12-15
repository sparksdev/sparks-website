import { useEffect, useState } from "react"
import { getAttestation } from "@modules/attestations"
import StatCard from './StatCard'
import cuid from "cuid"

export default function App () {
  const [ stats, setStats ] = useState(null)
  const [ error, setError ] = useState(null)

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

  return (
    <>
      <style jsx>{`
        h5 {
          margin-top: 0;
        }
        div {
        }
      `}</style>
      <h5>Member Stats</h5>
      {error && <p>{error}</p>}
      <div>
        {!error && stats && stats.map(({ service, data }) => {
          const attestation = getAttestation(service)
          return <StatCard key={cuid()} {...attestation} data={data} />
        })}
      </div>
    </>
  )
}