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

export default function Card({
  name,
  icon,
  data,
}) {
  return (
    <div>
      <style jsx>{styles}</style>
      <h5>
        <Icon id={icon} size={24} />
        {name}
      </h5>
      <pre>
        {Object.keys(data).map(key => {
          return <span key={cuid()}>{Case.capital(key)} - {data[key]}<br/></span>
        })}
      </pre>
    </div>
  )
}
