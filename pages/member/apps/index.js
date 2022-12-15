import Head from '@layout/Head'
import Header from '@layout/Header'
import Footer from '@layout/Footer'
import { withSessionRequired } from '@utilities/session/client-routes'
import Nav from '@pages/member/Navigation'
import Content from '@pages/member/Content'
import apps from '@modules/apps'
import Card from '@pages/member/apps/Card'
import CardLayout from '@pages/member/CardLayout'
import PageDesc from '@pages/member/PageDesc'

export default function Member({ user, session: { userId } }) {
  return (
    <>
      <Head />
      <Header userId={userId} />
      <Nav />
      <Content>
        <PageDesc>
          Apps allow you to granularly enable/disable various functionality from
          SPARKS ecosystem as well as third parties.
        </PageDesc>
        <CardLayout>
          {apps.map(({ Dialog, ...app }, index) => {
            return (
              <Card
                key={`${app.id}-${index}`}
                {...app}
              />
            )
          })}
          <Card
            user={user}
            fullWidth={true}
            service="more"
            name="More"
            icon="Rocket"
            introduction="There's a lot of opportunity to bring back your value. We're activelly modelling feature opportunities for 2023. Some include: single sign-on, trustless raffes, reverse advertising, document & media signing, candidate matching, mentorship & skills validation, education, activism, journalism & more."
          />
        </CardLayout>
      </Content>
      <Footer />
    </>
  )
}

export const getServerSideProps = withSessionRequired()
