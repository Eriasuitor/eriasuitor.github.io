import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
// import { reporter } from 'vfile-reporter'
import rehypeFormat from 'rehype-format';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const postDir = path.join(process.cwd(), 'posts');

export enum PostNodeType {
  CONTENT,
  SECTION,
}

export interface PostNode {
  key: string;
  title?: string;
  date?: string;
  contentHtml?: string;
  sections: PostNode[];
  content?: string
}

async function recursiveReadPost(fullPath: string, params?: {withContent: boolean}): Promise<PostNode> {
  let contentPath: string = fullPath;
  const sections = [];
  if ((await fs.promises.stat(fullPath)).isDirectory()) {
    const dirname = path.basename(fullPath);
    contentPath = path.join(fullPath, `${dirname}.md`);
    const filenames = await fs.promises.readdir(fullPath);
    for (const filename of filenames.filter(
      (filename) => path.parse(filename).name !== dirname
    )) {
      sections.push(await recursiveReadPost(path.join(fullPath, filename), params));
    }
  }
  const contentBuffer = fs.existsSync(contentPath)
    ? await fs.promises.readFile(contentPath)
    : undefined;
  const matterResult = contentBuffer ? matter(contentBuffer) : undefined;

  return {
    key: fullPath.replace(new RegExp(`^${postDir}/`), ''),
    ...matterResult?.data,
    content: params?.withContent && matterResult?.content || undefined,
    sections,
  };
}

function findPost(key: string, posts: PostNode[]): PostNode | undefined {
  const post = posts.find((post) => key.startsWith(post.key));
  if (!post) return;
  return post?.key === key ? post : findPost(key, post?.sections);
}

export async function getPosts(): Promise<Omit<PostNode, 'contentHtml'>[]> {
  const posts = (await recursiveReadPost(postDir)).sections;
  return posts.map(({contentHtml, ...args}) => args);
}

export async function getPost(titles: string[]): Promise<{posts: Pick<PostNode, 'key' | 'title' | 'sections'>[], post?: PostNode}> {
  const posts = (await recursiveReadPost(postDir, {withContent: true})).sections;
  const post = findPost((titles as string[])?.join?.('/'), posts);
  if (!post) return {posts};
  const contentHtml  = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(post?.content ?? ''); 
  post.contentHtml = contentHtml.toString();
  return {
    post,
    posts,
  };
}