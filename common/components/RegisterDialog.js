import useMetamask from '@hooks/metamask'
import css from 'styled-jsx/css'

const styles = css`
  p {
    text-align: justify;
  }
  h4 {
    margin-top: 1.2rem;
    text-align: center;
  }
  .buttons {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }
  .buttons > button:first-of-type {
    margin-right: 2.4rem;
  }
  p > code {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    display: inline-block;
    vertical-align: middle;
  }
`

export default function Register({ onSubmit, onCancel }) {
  const { address } = useMetamask()
  return (
    <div>
      <style jsx>{styles}</style>
      <h4>Create Profile</h4>
      <p>
        Creating a profile stores only your account address. Any data you
        connect is encrypted with keys only you control.
      </p>
      <p>
        SPARKS only uses message signing and doesn&apos;t require fees or gas.
        You&apos;re free to use an empty wallet to register.
      </p>
      <p>
        Registering: <code>{address}</code>
      </p>
      <div className="buttons">
        <button onClick={onCancel}>CANCEL</button>
        <button onClick={onSubmit}>REGISTER</button>
      </div>
    </div>
  )
}
