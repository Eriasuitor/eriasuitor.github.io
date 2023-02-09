import fs from "fs";
import path from "path";
import matter from 'gray-matter';
import { remark } from "remark";
import html from 'remark-html';

const postDir = path.join(process.cwd(), 'posts')

export enum PostNodeType {
    CONTENT,
    SECTION
}

export interface PostNode {
    key: string,
    title?: string,
    date?: string,
    contentHtml: string,
    sections: PostNode[]
    [key: string]: any,
}

async function recursiveReadPost(fullPath: string): Promise<PostNode> {
    let contentPath: string = fullPath
    const sections = []
    if ((await fs.promises.stat(fullPath)).isDirectory()) {
        const dirname = path.basename(fullPath)
        contentPath = path.join(fullPath, `${dirname}.md`)
        const filenames = await fs.promises.readdir(fullPath)
        for (const filename of filenames.filter(filename => path.parse(filename).name !== dirname)) {
            sections.push(await recursiveReadPost(path.join(fullPath, filename)))
        }
    }
    const contentBuffer = fs.existsSync(contentPath) ? await fs.promises.readFile(contentPath) : undefined
    const matterResult = contentBuffer ? matter(contentBuffer) : undefined
    const processedContent = await remark()
        .use(html)
        .process(matterResult?.content || '');
    return {
        key: fullPath.replace(new RegExp(`^${postDir}/`), ''),
        ...matterResult?.data,
        contentHtml: processedContent.toString(),
        sections
    }
}

export async function getPosts(): Promise<PostNode[]> {
    return (await recursiveReadPost(postDir)).sections
}