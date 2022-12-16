import Head from '@layout/Head'
import Header from '@layout/Header'
import Footer from '@layout/Footer'
import { withSessionRequired } from '@utilities/session/client-routes'
import Content from '@pages/member/Content'
import { getApp } from '@modules/apps'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Icon from '@elements/Icon'

export default function Member({ user, session: { userId } }) {
  const router = useRouter()
  const { service } = router.query
  const app = getApp(service)
  const { App, Signup } = app
  return (
    <>
      <Head />
      <Header userId={userId} />
      <style jsx>{`
        .content {
          padding-top: 4rem;
          width: 100%;
          min-height: calc(100vh - 2.8rem);
          display: flex;
          justify-content: center; 
        }
        :global(a.back) {
          position: absolute;
          top: 10.1rem;
          left: 2.2rem;
          color: var(--main-color);
          text-decoration: none;
          font-weight: bold;
          display: flex;
          align-items: center;
        }
        h4 {
          margin-top: 1.2rem;
          text-align: center;
        }
      `}</style>
      <div className='content'>
        <Link className="back" href="/member/apps"><Icon id="ArrowLeft" />back</Link>
        {user.apps[service] ? (
          <App />
        ) : (
          <Signup user={user} />
        )}
      </div>
      <hr />
      <Footer />
    </>
  )
}

export const getServerSideProps = withSessionRequired()
