import Head from '@layout/Head'
import Header from '@layout/Header'
import Footer from '@layout/Footer'
import { withSessionRequired } from '@utilities/session/client-routes'
import Nav from '@pages/member/Navigation'
import Content from '@pages/member/Content'
import { getApp } from '@modules/apps'
import { useRouter } from 'next/router'

export default function Member({ user, session: { userId } }) {
  const router = useRouter()
  const { service } = router.query
  const app = getApp(service)
  const { App, Signup } = app

  return (
    <>
      <style jsx>{`
        h5 { 
          text-align: left; 
          margin-top: 0;
        }
      `}</style>
      <Head />
      <Header userId={userId} />
      <Nav />
      <Content>
        {user.apps[service] ? (
          <App />
        ) : (
          <Signup />
        )}
      </Content>
      <Footer />
    </>
  )
}

export const getServerSideProps = withSessionRequired()
