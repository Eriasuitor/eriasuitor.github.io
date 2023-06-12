import config from '@/config';
import Image from 'next/image';
import Link from 'next/link';
import styles from './layout.module.css';

export default function Layout({ children }: { children: any }) {
  return (
    <>
      {/* <div className={styles.topBar}>NEXT.JS IS GREAT</div> */}
      <header className={`${styles.header} ${styles.dev}`}>
        <nav className={styles.nav}>
          <div className={styles.links}>
            <Link href='/'>首页</Link>
          </div>
          <div className={styles.headerRight}>
            {
              config.media.map(media => <Link target='_blank' key={media.domain} href={media.domain} title={media.name}>
                <Image src={media.icon} width={18} height={18} alt='media icon' className={styles.media_icon} />
              </Link>)
            }
          </div>
        </nav>
      </header>
      {children}
    </>
  );
}