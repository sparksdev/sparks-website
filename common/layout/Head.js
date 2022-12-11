import Head from 'next/head'

export default function HTMLHead({ title = '', description = '' }) {
  title = title ? `SPARKS - ${title}` : 'SPARKS'
  description = description ? description : `Identity · Community · Impact`
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta description={description} />
      <base href={`${process.env.ORIGIN}/`}></base>
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="icon" type="image/svg" href="/favicon.svg" />
    </Head>
  )
}
