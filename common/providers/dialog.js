import { useState, useContext, createContext } from 'react'
import css from 'styled-jsx/css'

const DialogContext = createContext({})

export function useDialog() {
  return useContext(DialogContext)
}

export function DialogProvider({ children }) {
  const [content, openDialog] = useState(null)
  const closeDialog = () => openDialog(null)
  const value = { content, openDialog, closeDialog }
  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  )
}

const styles = css`
  .background {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    flex-direction: column;
    animation: appear 250ms forwards;
    z-index: 1000;
    opacity: 0;
    backdrop-filter: blur(3px);
  }

  @keyframes appear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .content {
    padding: 2.4rem;
    background-color: var(--main-background-color);
    box-shadow: 0px 0px 8rem var(--box-shadow-color);
    width: calc(100% - 4rem);
    max-width: 60rem;
    margin: 2rem;
    border: solid 1px #333;
    border-radius: 4px;
    margin-top: auto;
    margin-bottom: auto;
  }
`

export default function Dialog() {
  const { content } = useDialog()
  return content ? (
    <div className="background">
      <style jsx>{styles}</style>
      <div className="content">{content}</div>
    </div>
  ) : (
    <></>
  )
}
