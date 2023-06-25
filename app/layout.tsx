import { ProgressBar } from '@/components/progress-bar.module';
import config from '@/config';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';
import styles from './layout.module.css';
import NextNProgress from 'nextjs-progressbar';
import { Router } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProgressBar />
        {/* <div className={styles.topBar}>NEXT.JS IS GREAT</div> */}
        <header className={`${styles.header} ${styles.dev}`}>
          <nav className={styles.nav}>
            <div className={styles.links}>
              <Link href='/'>首页</Link>
            </div>
            <div className={styles.headerRight}>
              {
                config.media.map(media => <Link target='_blank' key={media.domain} href={media.domain} title={media.name}>
                  <Image src="/github.png" width={18} height={18} alt='media icon' className={styles.media_icon} />
                </Link>)
              }
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
