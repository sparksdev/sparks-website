import Icon from '@elements/Icon'
import css from 'styled-jsx/css'
import { useDialog } from '@providers/dialog'

const styles = css`
  div {
    border: solid 2px var(--h5-font-color);
    border-radius: 4px;
    padding: 1.8rem;
    display: inline-flex;
    flex-direction: column;
    align-items: stretch;
    margin: 1.2rem;
    flex: 1;
    min-width: 40rem;
  }
  .fullWidth {
    flex: 100%;
  }
  div h5 {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div h5 :global(.icon) {
    margin-right: 1.2rem;
  }
  div p {
    font-style: normal;
    flex-grow: 1;
    margin: 1.6rem auto;
    text-align: justify;
  }
  div :global(button) {
    width: auto;
    margin: 0 auto;
  }
`

export default function Card({
  user,
  service,
  icon,
  name,
  introduction,
  Dialog,
  fullWidth = false,
}) {
  const { openDialog } = useDialog()
  const action = user.applications[service] ? 'disable' : 'enable'

  return (
    <div className={fullWidth ? 'fullWidth' : ''}>
      <style jsx>{styles}</style>
      <h5>
        <Icon id={icon} size={24} />
        {name}
      </h5>
      <p>{introduction}</p>
      {service !== 'more' && (
        <button onClick={() => openDialog(<Dialog />)}>{action}</button>
      )}
    </div>
  )
}
