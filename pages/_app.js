import '../src/index.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Magesh Kumar A T — QA Engineer</title>
        <meta
          name="description"
          content="Portfolio of Magesh Kumar A T, a software quality engineer specialising in Playwright, TypeScript, Selenium, Java, API testing, CI/CD, and QA leadership."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0C0C0C" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logos/me.png" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
