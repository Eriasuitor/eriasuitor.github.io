import { PostNode } from '@/lib/post';
import styles from './section.module.css';
import Link from 'next/link';

export function SectionNode({ post }: { post?: PostNode }) {
  return post ?
    <div className={styles.section}>
      <div className={styles.sectionTitle}>
        <Link href={post.key}>{post.title}</Link>
      </div>
      <div className={styles.sections}>
        {post.sections.map((section) => (
          <SectionNode key={section.key} post={section} />
        ))}
      </div>
    </div>: <></>;
}

export function Section({ post,className }: { post?: PostNode,className?:string }) {
  return post  ? <div className={className}>
    <SectionNode post={post} />
  </div> : <></>;
}