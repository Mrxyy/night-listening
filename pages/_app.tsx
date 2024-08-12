import React from 'react';
import '../styles/globals.css'
import Head from 'next/head';


type MyAppProps = {
  Component: React.FunctionComponent;
  pageProps: Record<string, any>;
};

export default function App({ Component, pageProps }: MyAppProps) {
  return <>
    <Head>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"></meta>
    </Head>
    <Component {...pageProps} />
  </>
}