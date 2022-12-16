import css from 'styled-jsx/css'

const styles = css`
  section {
    padding-top: 3.6rem;
    padding-bottom: 3.6rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    min-height: calc(100vh - 13rem);
    width: 100%;
    max-width: 128rem;
    margin: 0 auto;
  }
`

export default function Content({ children, className = '' }) {
  return (
    <>
      <section className={className}>
        <style jsx>{styles}</style>
        {children}
      </section>
      <hr />
    </>
  )
}
