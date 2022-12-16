import Icon from '@elements/Icon'
import css from 'styled-jsx/css'
import Case from 'case'
import cuid from 'cuid'

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
  div h5 {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div h5 :global(.icon) {
    margin-right: 1.2rem;
  }
  pre span {
    font: inherit;
  }
`

function EmailCard({
  humanId,
  update,
}) {
  return (
    <div>
      <style jsx>{styles}</style>
      <h5><Icon id="Mail" size={24} /> Email</h5>
      <pre>{humanId}</pre>
      <label>
        <input type="checkbox" onChange={e => { update({ include: e.target.checked }) }}/>
        include
      </label>
    </div>
  )
}

export default {
  email: EmailCard
}