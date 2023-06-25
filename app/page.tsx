import Title from '@/components/title.module';
import classNames from 'classnames';
import dayjs from 'dayjs';
import _ from 'lodash';
import Link from 'next/link';
import { getPosts } from '../lib/post';
import styles from './page.module.css';

export default async  function Home() {
  const posts = await listPosts();
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

async function listPosts() {
  const posts = await getPosts();
  return  _(posts)
    .groupBy((p) => dayjs(p.date).format('YYYY'))
    .mapValues((ps) => _.orderBy(ps, (p) => new Date(p.date ?? ''), 'desc'))
    .toPairs()
    .orderBy(([date]) => date, 'desc')
    .value();
};
