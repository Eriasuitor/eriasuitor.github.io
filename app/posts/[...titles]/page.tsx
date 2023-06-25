import { Section } from '@/components/posts/section';
import { Toc } from '@/components/posts/toc';
import Title from '@/components/title.module';
import 'highlight.js/styles/default.css';
import { PostNode, getPosts } from '../../../lib/post';
import markdownStyles from './markdown.module.css';
import styles from './post.module.css';

const postContentKey = 'post_content';

export default async function Post({ params}: {
  params: {titles: string[]};
}) {
  const {posts, post} = await getPost(params.titles);
  return post?    <>
    <Title text={post.title ?? '文章'} />
    <Toc postContentKey={postContentKey} className={styles.toc} />
    <Section
      post={posts.find((p) => post.key.startsWith(p.key))}
      className={styles.section}
    />
    <div
      id={postContentKey}
      dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      className={`${styles.post_content} ${markdownStyles.post_content}`}
    />
  </> : <>404</>;
}

function findPost(key: string, posts: PostNode[]): PostNode | undefined {
  const post = posts.find((post) => key.startsWith(post.key));
  if (!post) return;
  return post?.key === key ? post : findPost(key, post?.sections);
}

async function  getPost(titles: string[]) {
  const posts = await getPosts();
  return {
    post: findPost((titles as string[])?.join?.('/'), posts),
    posts,
  };
};

function getAllPaths(posts: PostNode[]): string[] {
  return posts
    .map((post) => getAllPaths(post.sections).concat(post.key))
    .flat();
}

export async function generateStaticParams () {
  const posts = await getPosts();
  return getAllPaths(posts).map((key) => ({    titles: key.split('/')  }));
};
