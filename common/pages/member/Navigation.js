import { useRouter } from 'next/router'
import css from 'styled-jsx/css'
import Link from 'next/link'

const styles = css`
  nav {
    margin-top: 6.88rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  nav :global(a),
  nav :global(a):visited {
    color: var(--a-font-color);
    font-size: 2rem;
    text-decoration: none;
    margin: 0 1.2rem;
  }
  nav :global(a).active {
    font-weight: 500;
    text-decoration: underline;
  }
`

export default function Nav() {
  const router = useRouter()

  return (
    <nav>
      <style jsx>{styles}</style>
      <Link
        className={router.pathname === '/member/profile' ? 'active' : ''}
        href="/member/profile"
      >
        Profile
      </Link>
      <Link
        className={router.pathname === '/member/attest' ? 'active' : ''}
        href="/member/attest"
      >
        Attest
      </Link>
      <Link
        className={router.pathname === '/member/apps' ? 'active' : ''}
        href="/member/apps"
      >
        Apps
      </Link>
    </nav>
  )
}
