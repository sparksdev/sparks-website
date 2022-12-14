import Head from '@layout/Head'
import Header from '@layout/Header'
import Identicon from '@elements/Identicon'
import Footer from '@layout/Footer'
import { withSessionRequired } from '@utilities/session/client-routes'
import { useRouter } from 'next/router'
import Nav from '@pages/member/Navigation'
import Content from '@pages/member/Content'
import CardLayout from '@pages/member/CardLayout'
import Card from '@pages/member/profile/Card'
import styles from '@pages/member/profile/styles'
import useMetamask from '@hooks/metamask'

export default function Member({ user, session: { userId } }) {
  const { attestations = [] } = user
  const { address } = useMetamask()
  const router = useRouter()

  return (
    <>
      <style jsx>{styles}</style>
      <Head />
      <Header userId={userId} />
      <Nav />
      <Content>
        <Identicon address={address} />
        <small
          onClick={async () => {
            if (
              confirm(
                "are you sure? this deletes everything and can't be undone"
              )
            ) {
              await fetch('/api/session/register', { method: 'DELETE' })
              router.push('/')
            }
          }}
        >
          delete account
        </small>
        <h5>{address}</h5>
        <CardLayout>
          {attestations.map((attestation, index) => (
            <Card
              key={`${attestation.service}${index}`}
              {...attestation}
              user={user}
            />
          ))}
        </CardLayout>
      </Content>
      <Footer />
    </>
  )
}

export const getServerSideProps = withSessionRequired()
