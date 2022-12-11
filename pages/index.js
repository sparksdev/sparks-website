import Head from '@layout/Head'
import Header from '@layout/Header'
import Footer from '@layout/Footer'
import Logo from '@elements/Logo'
import Icon from '@elements/Icon'
import { withSession } from '@utilities/session/client-routes'
import Link from 'next/link'
import CountDown from '@pages/home/Countdown'
import styles from '@pages/home/styles'
import MemberStats from '@pages/home/MemberStats'

export default function Home({ session: { userId }, user }) {
  return (
    <>
      <style jsx>{styles}</style>
      <Head />
      <Header userId={userId} />
      <section id="hero">
        <Logo size={60} />
        <h1>SPARKS</h1>
        <h5>Identity · Community · Impact</h5>
        <MemberStats />
        <a href="#identity">
          <Icon id="MoveDown" size={64} strokeWidth={1} />
        </a>
      </section>
      <hr />
      <section id="identity">
        <h2>Identity</h2>
        <p>
          <Icon id="UserScan" size={80} strokeWidth={0.6} />
          <Icon id="SendDollars" size={80} strokeWidth={0.6} />
          <Icon id="Db" size={80} strokeWidth={0.6} />
        </p>
        <p>
          Your identity & information fuels a massive data economy, running
          under the pretext of user convenience.
        </p>
        <p>
          <Icon id="VerifiedUser" size={80} strokeWidth={0.6} />
          <Icon id="ArrowLeft" size={80} strokeWidth={0.6} />
          <Icon id="MultiplePages" size={80} strokeWidth={0.6} />
        </p>
        <p>
          What if you had decentralized identifiers, credentials & other
          enabling technologies to put you in control?
        </p>
        <p>
          <Icon id="City" size={80} strokeWidth={0.6} />
          <Icon id="Building" size={80} strokeWidth={0.6} />
        </p>
        <p>
          It&apos;s coming! But Government & Enterprise are winning the race;
          what happens if verification & attestation silos form under
          centralized control?
        </p>
        <p>
          <Icon id="Group" size={80} strokeWidth={0.6} />
          <Icon id="Group" size={80} strokeWidth={0.6} />
          <Icon id="Group" size={80} strokeWidth={0.6} />
          <Icon id="Group" size={80} strokeWidth={0.6} />
        </p>
        <p>
          Attestations form your identity & verifications unlock its value. This
          interface must be open-source & decentralized to ensure positive
          outcomes.
        </p>
        <p>
          <Icon id="Globe" size={80} strokeWidth={0.6} />
          <Icon id="VerifiedUser" size={80} strokeWidth={0.6} />
        </p>
        <p>
          SPARKS is building open-source, agnostic tools for you to attest &
          verify web2/web3 identities using current tech to reclaim your data,
          today.
        </p>
      </section>
      <hr />
      <section id="community">
        <h2>Community</h2>
        <p>
          <Icon id="Compass" size={80} strokeWidth={0.6} />
          <Icon id="Group" size={80} strokeWidth={0.6} />
          <Icon id="MoneySquare" size={80} strokeWidth={0.6} />
        </p>
        <p>
          What do you need to be effective as a community? Clear goals?
          Alignment? Resources? These are at the core of many successful
          initiatives.
        </p>
        <p>
          <Icon id="Compass" size={80} strokeWidth={0.6} />
        </p>
        <p>
          What&apos;s your goal? Create a decentralized, open-source identity
          interface between your identity & its value to keep you safe &
          un-siloed forever.
        </p>
        <p>
          <Icon id="Group" size={80} strokeWidth={0.6} />
        </p>
        <p>
          How can you align? SPARKS verifications align you with peers; trusted
          to have similar skills & interests, to tackle smaller more manageable
          tasks.
        </p>
        <p>
          <Icon id="MoneySquare" size={80} strokeWidth={0.6} />
        </p>
        <p>
          How can you be resourced? SPARKS reserve slowly releases funds for
          developments & investments. Income from initiatives grows the reserve.
          Rinse, repeat, in perpetuity.
        </p>
      </section>
      <hr />
      <section id="impact">
        <h2>Impact</h2>
        <p>
          <Icon id="MessageText" size={80} strokeWidth={0.6} />
        </p>
        <p>
          You might have noticed we&apos;re talking to you directly - as if
          SPARKS belongs to you. That&apos;s because it does.
        </p>
        <p>
          <Icon id="SwitchOnOutline" size={80} strokeWidth={0.6} />
        </p>
        <p>
          A 25% fund is releasing over four years to start initial services,
          communities & income. We&apos;ll fill the reserve & establish
          governance.
        </p>
        <p>
          <Icon id="Rocket" size={80} strokeWidth={0.6} />
        </p>
        <p>
          After that, it&apos;s all yours. All assets, code & reserves. Truly
          free, open-source & decentralized for common good. What kind of impact
          will you have?
        </p>
        <hr />
        <CountDown />
        <Link className="roadmap" href="/roadmap">
          roadmap
        </Link>
      </section>
      <hr />
      <Footer id="links" />
    </>
  )
}

export const getServerSideProps = withSession()
