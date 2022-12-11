import css from 'styled-jsx/css'

export default function CardLayout({ children }) {
  const styles = css`
    div {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }
  `

  return (
    <>
      <style jsx>{styles}</style>
      <div>{children}</div>
    </>
  )
}
