import { PostNode, getPost, getPosts } from '../../../lib/post';
import PostItem from './post-item';

export default async function Post({ params }: {
  params: { titles: string[] };
}) {
  const { posts, post } = await getPost(params.titles);
  return <PostItem post={post} posts={posts} />;
}

function getAllPaths(posts: Omit<PostNode, 'contentHtml'>[]): string[] {
  return posts
    .map((post) => getAllPaths(post.sections).concat(post.key))
    .flat();
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return getAllPaths(posts).map((key) => ({ titles: key.split('/') }));
};
