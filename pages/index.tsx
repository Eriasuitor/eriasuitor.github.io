import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { getPosts, PostNode } from '../lib/post';
import styles from '../styles/Home.module.css';

export default function Home({ posts }: { posts: PostNode[] }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts()
  return { props: { posts } }
};
