import Head from '@layout/Head'
import Header from '@layout/Header'
import Footer from '@layout/Footer'
import { withSessionRequired } from '@utilities/session/client-routes'
import Nav from '@pages/member/Navigation'
import Content from '@pages/member/Content'
import CardLayout from '@pages/member/CardLayout'
import Card from '@pages/member/attest/Card'
import services from '@modules/attestations'
import { useDialog } from '@providers/dialog'
import MessageDialog from '@components/MessageDialog'
import PageDesc from '@pages/member/PageDesc'

export default function Member({ user, session: { userId } }) {
  const { openDialog } = useDialog()

  function onVerified(service) {
    openDialog(
      <MessageDialog
        title="Success"
        content={`${service} attested! Check it out in your profile.`}
      />
    )
  }

  return (
    <>
      <Head />
      <Header userId={userId} />
      <Nav />
      <Content>
        <PageDesc>
          Attestations let you prove ownership of accounts & attributes. Stored
          securely with keys under your control, you can choose to allow apps
          access to unlock your value!
        </PageDesc>
        <CardLayout>
          {services.map(({ Dialog, ...service }, index) => (
            <Card
              key={`${service.id}-${index}`}
              {...service}
              Dialog={() => (
                <Dialog
                  user={user}
                  onVerified={() => onVerified(service.name)}
                />
              )}
              button={`Attest ${service.name}`}
            />
          ))}
          <Card
            id="more"
            icon="MultiplePages"
            name="More Coming Soon"
            description="We're working on a modular architecture so open-source developers can easily contribute to scaling web2 attestations across ALL possible services. Your value is scattered & locked in silos - time to get it back."
          />
        </CardLayout>
      </Content>
      <Footer />
    </>
  )
}

export const getServerSideProps = withSessionRequired()
