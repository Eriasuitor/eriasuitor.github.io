import config from '@/config';
import Head from 'next/head';

export default function Title({text}: {text: string}) {
  const fullTitle = `${config.name} - ${text}`;
  return <Head>
    <title>{fullTitle}</title>
  </Head>;
}