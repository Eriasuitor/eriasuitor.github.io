import { AppProps } from 'next/app';
import '../styles/globals.css';
import Layout from '@/components/layout/layout';
import NextNProgress from 'nextjs-progressbar';

export default function App({ Component, pageProps }: AppProps) {
  return <Layout>
    <NextNProgress  options={{showSpinner: false}} />
    <Component {...pageProps} />
  </Layout>;
}