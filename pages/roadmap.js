import Head from '@layout/Head'
import Header from '@layout/Header'
import Footer from '@layout/Footer'
import Icon from '@elements/Icon'
import { withSession } from '@utilities/session/client-routes'
import styles from '@pages/roadmap/styles'

export default function RoadMap({ user }) {
  return (
    <>
      <style jsx>{styles}</style>
      <Head />
      <Header user={user} />
      <section>
        <h2>Roadmap</h2>
        <p>
          SPARKS is a community-born project. No backers. No VCs. No tax. No
          tricks. It will thrive or fail by its ability to bring utility &
          value. This uncertainty means we can&apos;t map when we can execute.
          But we can map what we need to execute. Here are our high-level
          milestones.
        </p>
      </section>
      <hr />
      <section>
        <h2>
          <Icon id="Apple" size={40} strokeWidth={1.2} /> Measure Appetite
        </h2>
        <p>
          <Icon id="Check" size={24} strokeWidth={2} /> The first phase&apos;s
          primary goal was to measure the appetite for an open-source,
          decentralized identity layer for the common good using a crude
          prototype. SPARKS is a massive undertaking. We&apos;re racing against
          big & well established & resourced organizations. There is much work
          ahead, but you have all made clear - this is an initiative worth
          fighting for.
        </p>
      </section>
      <hr />
      <section>
        <h2>
          <Icon id="Group" size={40} strokeWidth={1.2} /> Rally The Troops
        </h2>
        <p>
          <Icon id="Running" size={24} strokeWidth={2} /> The current phase,
          marked by the site update, is to rally support through community
          building, forming partnerships, allies, content, etc. For this phase,
          we&apos;ve polished the prototype & added enough content to
          communicate the vision. We&apos;ll continue developments here but will
          limit sharing functionality & adding attestations & instead focus more
          attention on community formation & culture building.
        </p>
      </section>
      <hr />
      <section>
        <h2>
          <Icon id="CodeBracketsSquare" size={40} strokeWidth={1.2} />{' '}
          Foundational Engineering
        </h2>
        <p>
          This phase aims to take our polished prototype & build a world-class,
          highly scalable architecture ready for plugin-style contributions for
          connections, available attestations & apps. This phase is predicated
          on successful community growth. If we can achieve sufficient growth in
          the community, I will be full-time SPARKS, & I will hire by my side
          the best engineer possible.
        </p>
      </section>
      <hr />
      <section>
        <h2>
          <Icon id="DashFlag" size={40} strokeWidth={1.2} /> Start The Engines
        </h2>
        <p>
          In this phase, we start bringing value. We&apos;ll code the reserve
          contract & deploy our first revenue-generating apps. We&apos;ll also
          begin using the development fund beyond internal resourcing by issuing
          bounties. These bounties will serve the purpose of rapid scale,
          building upon our plugin architecture to ensure you are not limited by
          how you can use SPARKS or where it can be useful.
        </p>
      </section>
      <hr />
      <section>
        <h2>
          <Icon id="ScaleFrameEnlarge" size={40} strokeWidth={1.2} /> Scale
        </h2>
        <p>
          This phase is all about growth. We&apos;ll hire marketing, business
          development & developer relations resources to take the architecture &
          valuable apps we&apos;re built & begin bringing them to the masses
          within the cryptosphere & beyond.
        </p>
      </section>
      <hr />
      <section>
        <h2>
          <Icon id="BookStack" size={40} strokeWidth={1.2} /> Research
        </h2>
        <p>
          Once we&apos;ve grown & are operating profitably, it&apos;s time to
          start succession planning. We&apos;ll form a consortium of allies with
          privacy, identity & the common good at the core of their ethos.
          We&apos;ll use these resources to create a charter & plan governance
          for the fated time when the SPARKS development fund is exhausted & the
          ecosystem becomes self-sustaining.
        </p>
      </section>
      <hr />
      <section>
        <h2>
          <Icon id="PeaceHand" size={40} strokeWidth={1.2} /> Impact
        </h2>
        <p>
          If we&apos;ve made it this far, we&apos;ve created an open-source
          layer that empowers everyone to interact safely with their identities.
          You were the SPARK that changed the world. What you do from now on,
          the impact you have, is up to you.
        </p>
      </section>
      <Footer id="links" />
    </>
  )
}

export const getServerSideProps = withSession()
