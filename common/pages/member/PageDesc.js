import css from 'styled-jsx/css'

const styles = css`
  p {
    font-style: italic;
    margin-bottom: 1.6rem;
    text-align: center;
  }
`

export default function PageDesc({ children }) {
  return (
    <>
      <style jsx>{styles}</style>
      <p>{children}</p>
    </>
  )
}
