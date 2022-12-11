import Countdown from 'react-countdown'
import { useEffect, useState } from 'react'
import Icon from '@elements/Icon'

export default function CountDown() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) return <></>

  return (
    <>
      <h5>
        You are the SPARK that will change the world
        <br />
        Be prepared -&nbsp;
        <Countdown
          date={new Date('Thu Dec 31 2026 17:00:00 GMT-0000')}
          renderer={(props) => {
            let years = Math.floor(props.days / 365)
            let days = `${props.days - years * 365}d `
            years = years === 0 ? '' : `${years}y `
            return (
              <>
                {years}
                {days}
                {props.formatted.hours}h {props.formatted.minutes}m{' '}
                {props.formatted.seconds}s{' '}
              </>
            )
          }}
        />
      </h5>
      <Icon id="Globe" size={280} strokeWidth={0.2} />
    </>
  )
}
