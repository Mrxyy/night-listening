import React from 'react';
import '../styles/globals.css'


type MyAppProps = {
    Component: React.FunctionComponent;
    pageProps: Record<string, any>;
};

export default function App({ Component, pageProps }: MyAppProps) {
  return  <Component {...pageProps} />
}