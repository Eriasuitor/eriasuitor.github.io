import Link from 'next/link';
import styles from './layout.module.css';

export default function Layout({ children }: { children: any }) {
    return (
        <>
            <div className={styles.topBar}>NEXT.JS IS GREAT</div>
            <div className={styles.header}>
                <nav className={styles.nav}>
                    <Link href='/'>HOME</Link>
                </nav>
            </div>
            {children}
        </>
    );
}