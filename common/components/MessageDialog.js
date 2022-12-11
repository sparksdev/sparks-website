import { useDialog } from '@providers/dialog'
import css from 'styled-jsx/css'

const styles = css`
  h4 {
    margin-top: 1.2rem;
    text-align: center;
  }
  span {
    display: inline-block;
    text-align: left;
  }
  button {
    margin: 0 auto;
  }
`

export default function Message({ title, content }) {
  const { closeDialog } = useDialog()
  return (
    <>
      <style jsx>{styles}</style>
      <h4>{title}</h4>
      <p>{content}</p>
      <div>
        <button onClick={closeDialog}>CLOSE</button>
      </div>
    </>
  )
}
