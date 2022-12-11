import css from 'styled-jsx/css'

export default css`
  section {
    padding: 6.8rem 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    max-width: 72rem;
    margin: 0 auto;
    text-align: justify;
  }
  section:not(#hero) {
    justify-content: flex-start;
  }
  #hero > a {
    position: absolute;
    bottom: 6.4rem;
  }
  #hero h5,
  #hero h1 {
    margin: 0;
  }
  #hero h1 {
    margin: 1.2rem 0;
  }
  section > h2 {
    margin-top: 0;
  }
  li {
    text-align: left;
  }
  hr {
    max-width: 2.4rem;
  }
  #impact h5 {
    line-height: 2;
    text-align: center;
  }
  #impact hr {
    margin-bottom: 3.8rem;
    margin-top: 4.6rem;
  }
  section > p > :global(.icon) {
    display: inline-block;
    margin-top: 4.8rem;
  }
  :global(a.roadmap:visited) {
    color: var(--a-font-color);
  }
`
