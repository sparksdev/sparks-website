import { useState, useEffect } from "react"
import { TypeAnimation } from 'react-type-animation'

export default function MemberStats() {
  const [report, setReport] = useState(null)

  async function getReport() {
    const result = await fetch('/api/application/member-stats')
    if (!result.ok) return
    const { report, updatedAt } = await result.json()
    if (report.length) {
      setReport([ 
        'We are SPARKS', 
        2000,
        ...report.flatMap(text => ([text, 2000])) 
      ])
    }
  }

  useEffect(() => {
    getReport()
  }, [])

  if (!report || !report.length) {
    return <></>
  }

  return (
    <>
      <style jsx>{`
        :global(p.memberStats) {
          margin-top: 1.2rem;
        }
      `}</style>
      <TypeAnimation
        className='memberStats'
        sequence={report}
        wrapper="p"
        cursor={true}
        speed={75}
        deletionSpeed={99}
        repeat={Infinity}
      />
    </>
  )
}