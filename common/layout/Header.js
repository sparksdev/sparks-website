import Logo from '@elements/Logo'
import Icon from '@elements/Icon'
import RegisterDialog from '@components/RegisterDialog'
import { useDialog } from '@providers/dialog'
import { useTheme } from '@providers/theme'
import useMetamask from '@hooks/metamask'
import Link from 'next/link'
import { useRouter } from 'next/router'
import css from 'styled-jsx/css'
import { useEffect } from 'react'
import { hash } from '@utilities/encryption/utilities'

const styles = css`
  header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    padding: 2rem;
    background-color: var(--main-background-color);
    transition: background-color 250ms;
  }
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  nav > section {
    flex-grow: 1;
    text-align: center;
  }
  nav > :global(a) {
    display: flex;
    align-items: center;
    text-decoration: none;
    margin: 0;
  }
  nav > :global(a) > h6 {
    margin: 0;
    margin-left: 0.8rem;
    display: inline-block;
  }
  nav > :global(a):hover {
    border-bottom: solid 0px transparent;
  }
  nav > :global(a) > h2 {
    line-height: 2.8rem;
    font-size: 2.4rem;
    margin: 0 0 0 0.8rem;
  }
  nav > :global(span) > :global(span) {
    display: inline-block;
    cursor: pointer;
    margin-left: 1.2rem;
  }
  nav > :global(span) :global(svg) {
    height: 2.8rem;
    width: auto;
  }
`

export default function Header({ userId, protect = true }) {
  const { address, active, connect, disconnect, sign } = useMetamask()
  const { openDialog, closeDialog } = useDialog()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (!active || !protect) return
    const handleLoggedOut = async () => {
      const currentUser = hash(address || '')
      if (!address || !active || (!!userId && userId !== currentUser)) {
        fetch('/api/session/logout')
          .then(() => router.replace('/'))
      }
    }
    handleLoggedOut()
  }, [ active, address ])

  async function register() {
    openDialog(
      <RegisterDialog
        onSubmit={async () => {
          const result = await fetch('/api/session/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address }),
          })
          if (result.ok) {
            closeDialog()
            login()
          }
        }}
        onCancel={closeDialog}
      />
    )
  }

  async function login() {
    const result = await fetch(`/api/session/login?address=${address}`)
    if (!result.ok) return
    const { message } = await result.json()
    const signature = await sign(message)
    const { ok } = await fetch(`/api/session/login?signature=${signature}`)
    if (!ok) return register()
    router.push('/member/profile')
  }

  async function logout() {
    const { ok } = await fetch(`/api/session/logout`)
    if (ok) disconnect() && router.replace(router.asPath)
  }

  return (
    <>
      <header>
        <style jsx>{styles}</style>
        <nav>
          <Link href="/">
            <Logo size={26} />
            <h2>SPARKS</h2>
            <h6>[prototype]</h6>
          </Link>
          <span>
            <Icon
              id={theme === 'light' ? 'MoonSat' : 'SunLight'}
              title="theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
            {userId && router.pathname !== '/' && (
              <Icon id="LogOut" title="Log Out" onClick={logout} />
            )}
            {userId && router.pathname === '/' && (
              <Icon
                id="ProfileCircled"
                title="Log In"
                onClick={() => router.push('/member/profile')}
              />
            )}
            {!userId && !(active && address) && (
              <Icon id="EvPlug" title="Connect Wallet" onClick={connect} />
            )}
            {!userId && active && address && (
              <Icon id="ProfileCircled" title="Log In" onClick={login} />
            )}
          </span>
        </nav>
      </header>
    </>
  )
}
