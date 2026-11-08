import '../src/index.css'
import '../src/styles/spidey.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Magesh Kumar A T - Portfolio</title>
        <meta name="description" content="Magesh Kumar A T - Quality Assurance Engineer Portfolio. Experienced QA professional with expertise in manual and automated testing." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0d1b3e" />
        <link rel="apple-touch-icon" href="/logos/me.png" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
