import css from 'styled-jsx/css'

export default css`
  section {
    padding: 6.8rem 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    max-width: 72rem;
    margin: 0 auto;
    text-align: justify;
  }
  section > h2 {
    margin-top: 0;
    display: flex;
    margin-bottom: 3.2rem;
    align-items: center;
  }
  section > h2 :global(.icon) {
    margin-right: 1.6rem;
  }
  section > p :global(.icon) {
    transform: translate3d(0.5rem, 0.5rem, 0);
    display: inline-block;
  }
  li {
    text-align: left;
  }
  hr {
    max-width: 2.4rem;
  }
`
