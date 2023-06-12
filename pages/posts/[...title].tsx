import { Section } from '@/components/posts/section';
import { Toc } from '@/components/posts/toc';
import Title from '@/components/title';
import 'highlight.js/styles/default.css';
import { GetStaticPaths, GetStaticProps } from 'next';
import { PostNode, getPosts } from '../../lib/post';
import styles from './post.module.css';
import markdownStyles from './markdown.module.css';

const postContentKey = 'post_content';

export default function Post({  post,  posts,}: {
  post: PostNode;
  posts: PostNode[];
}) {
  return (
    <>
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
    </>
  );
}

function findPost(key: string, posts: PostNode[]): PostNode | undefined {
  const post = posts.find((post) => key.startsWith(post.key));
  if (!post) return;
  return post?.key === key ? post : findPost(key, post?.sections);
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const posts = await getPosts();
  return {
    props: {
      post: findPost((params?.title as string[])?.join?.('/'), posts),
      posts,
    },
  };
};

function getAllPaths(posts: PostNode[]): string[] {
  return posts
    .map((post) => getAllPaths(post.sections).concat(post.key))
    .flat();
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  return {
    paths: getAllPaths(posts).map((key) => ({
      params: {
        title: key.split('/'),
      },
    })),
    fallback: false,
  };
};
