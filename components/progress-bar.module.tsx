'use client';
import { Router, useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';
import ProgressBar2 from 'next-nprogress-bar';


export function ProgressBar() {
  // const router = useRouter();
  // router.events.on('routeChangeStart', () => console.log('xxxxasdjiqw'));
  return <NextNProgress />;
}
