import Icon from '@elements/Icon'
import css from 'styled-jsx/css'
import Link from 'next/link'

const styles = css`
  footer {
    padding: 1.2rem;
    text-align: center;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
  }
  section {
    display: flex;
    justify-content: space-around;
    margin: 3.2rem auto;
  }
  li {
    list-style: none;
    margin: 0.8rem;
  }
  li :global(a) {
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  li :global(a):visited {
    color: currentColor;
  }
  li :global(.icon) {
    margin-right: 1.2rem;
  }
  small {
    display: block;
    margin-bottom: 3.2rem;
  }
`

export default function Footer(props) {
  return (
    <footer {...props}>
      <style jsx>{styles}</style>
      <section>
        <ul>
          <li>
            <Link target="_blank" href="https://twitter.com/sparksdev_">
              <Icon id="Twitter" size={20} strokeWidth={2} />
              Twitter
            </Link>
          </li>
          <li>
            <Link target="_blank" href="https://discord.com/invite/JuNWR6vGKC">
              <Icon id="Discord" size={20} strokeWidth={2} />
              Discord
            </Link>
          </li>
          <li>
            <Link target="_blank" href="https://t.me/sparks_official">
              <Icon id="Telegram" size={20} strokeWidth={2} />
              Telegram
            </Link>
          </li>
          <li>
            <Link target="_blank" href="https://medium.com/@sparksdev">
              <Icon id="Medium" size={20} strokeWidth={2} />
              Medium
            </Link>
          </li>
          <li>
            <Link target="_blank" href="https://github.com/sparksdev">
              <Icon id="GitHub" size={20} strokeWidth={2} />
              GitHub
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link
              target="_blank"
              href="https://etherscan.io/token/0x5f5c86a9f8aaf63ce27b82fab3b33df73cbc3d12"
            >
              <Icon id="Etherscan" size={20} strokeWidth={2} />
              Etherscan
            </Link>
          </li>
          <li>
            <Link
              target="_blank"
              href="https://dextools.io/app/en/ether/pair-explorer/0xdb4a17ee208f7e7e35f6af0ee3cc72e307322821"
              rel="noreferrer"
            >
              <Icon id="Dextools" size={20} strokeWidth={2} />
              Dextools
            </Link>
          </li>
          <li>
            <Link
              target="_blank"
              href="https://nomics.com/assets/spark4-sparks"
              rel="noreferrer"
            >
              <Icon id="Nomics" size={20} strokeWidth={2} />
              Nomics
            </Link>
          </li>
          <li>
            <Link target="_blank" href="https://gitcoin.co/sparksdev">
              <Icon id="Gitcoin" size={20} strokeWidth={0} />
              Gitcoin
            </Link>
          </li>
          <li>
            <Link target="_blank" href="mailto:info@sparks.dev">
              <Icon id="Mail" size={20} strokeWidth={2} />
              Email
            </Link>
          </li>
        </ul>
      </section>
      <small>&copy; Copyright 2022, Sparks Development</small>
    </footer>
  )
}
