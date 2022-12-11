import css from 'styled-jsx/css'
import ReactIdenticon from 'react-identicons'

const styles = css`
  span {
    display: inline-block;
    border: solid 2px var(--h5-font-color);
    border-radius: 8px;
    padding: 2rem;
    user-select: none;
  }
  img {
    height: 6rem;
    width: 6rem;
    margin: 0;
  }
`

export default function Identicon({ address }) {
  return (
    <span>
      <style jsx>{styles}</style>
      <ReactIdenticon string={address} size={100} />
    </span>
  )
}
