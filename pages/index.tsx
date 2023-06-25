import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getPosts, PostNode } from '../lib/post';
import styles from '@/pages/index.module.css';
import Title from '@/components/title';
import _ from 'lodash';
import classNames from 'classnames';
import dayjs from 'dayjs';

export default function Home({ posts }: { posts: [string, PostNode[]][] }) {
  return (
    <>
      <Title text="首页" />
      <div className={classNames([styles.main])}>
        <ul>
          {posts.map(([date, posts]) => <div key={date}>
            <h1 className={classNames(styles.date_bar)}>{date}</h1>
            {posts.map((post) => (
              <li key={post.key} className={classNames(styles.post_line)}>
                <Link href={`/posts/${post.key}`}>{post.title}</Link>
              </li>
            ))}
          </div>
          )}
        </ul>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts();
  return {
    props: {
      posts: _(posts)
        .groupBy((p) => dayjs(p.date).format('YYYY'))
        .mapValues((ps) => _.orderBy(ps, (p) => new Date(p.date ?? ''), 'desc'))
        .toPairs()
        .orderBy(([date]) => date, 'desc')
        .value(),
    },
  };
};
