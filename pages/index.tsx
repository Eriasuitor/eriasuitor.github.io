import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getPosts, PostNode } from '../lib/post';
import styles from '../styles/Home.module.css';
import Title from '@/components/title';

export default function Home({ posts }: { posts: PostNode[] }) {
  return (
    <div className={styles.container}>
      <Title text='首页' />
      <main>
        <h1 className="title">
          Read <Link href="/posts/first-post">this page!</Link>
        </h1>

        <div className={styles.grid}>
          <ul>
            {posts.map(post => <li key={post.key} >
              <Link href={`/posts/${post.key}`}>{post.title}</Link>
            </li>)}
          </ul>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts();
  return { props: { posts } };
};
