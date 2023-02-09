import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getPosts, PostNode } from "../../lib/post";
import styles from '../../styles/post.module.css';

function Section({ post }: { post: PostNode | undefined }) {
    if (!post) return <></>
    return <div className={styles.section}>
        <div className={styles.sectionTitle}>
            <Link href={post.key}>{post.title}</Link>
        </div>
        <div className={styles.sections}>
            {post.sections.map(section => <Section key={section.key} post={section} />)}
        </div>
    </div>
}

const postContentKey = 'post_content'

interface HeaderNode { element?: Element, title: string, children: HeaderNode[] }

function combineHeaders(elements: NodeListOf<Element>, start: number): { end: number, node: HeaderNode } {
    const currentElement = elements.item(start)
    const result: HeaderNode = { element: currentElement, title: currentElement.innerHTML, children: [] }
    let i = start + 1
    while (i < elements.length) {
        if (currentElement.nodeName >= elements.item(i).nodeName) break
        const { end, node } = combineHeaders(elements, i)
        result.children.push(node)
        i = end + 1;
    }
    return { end: i - 1, node: result }
}

function Toc({ tocNode }: { tocNode: HeaderNode }) {
    return <div>
        <div
            style={{ marginLeft: `${tocNode.element?.nodeName?.replace(/[^0-9]/, '') || 0}rem` }}
            className={styles.title}
            onClick={() => tocNode?.element?.scrollIntoView({ behavior: 'smooth', block: 'center'  })}
        >
            {tocNode.title}
        </div>
        {tocNode.children.map(node => <Toc key={node.title} tocNode={node} />)}
    </div>
}

export default function Post({ post, posts }: { post: PostNode, posts: PostNode[] }) {
    const [headers, setHeaders] = useState<HeaderNode[]>([])
    useEffect(() => {
        const postContent = document.getElementById(postContentKey)
        console.log(postContent)
        const headerElements = postContent?.querySelectorAll('h1, h2, h3, h4, h5, h6')
        console.log(headerElements)
        if (!headerElements) return
        let current = 0
        const result = []
        while (current < headerElements.length) {
            const { end, node } = combineHeaders(headerElements, current)
            result.push(node)
            current = end + 1
        }
        setHeaders(result)
    }, [])
    return <>
        <Head>
            <title>{post.title}</title>
        </Head>
        <div className={styles.toc}> {headers.map(node => <Toc key={node.title} tocNode={node} />)}</div>
        <div><Section post={posts.find(p => post.key.startsWith(p.key))} /></div>
        <div id={postContentKey} dangerouslySetInnerHTML={{ __html: post.contentHtml }} className={styles.postContent} />
    </>
}

function findPost(key: string, posts: PostNode[]): PostNode | undefined {
    const post = posts.find(post => key.startsWith(post.key))
    if (!post) return
    return post?.key === key ? post : findPost(key, post?.sections)
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const posts = await getPosts()
    return { props: { post: findPost((params?.title as string[])?.join?.('/'), posts), posts } }
};

function getAllPaths(posts: PostNode[]): string[] {
    return posts.map(post => getAllPaths(post.sections).concat(post.key)).flat()
}

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getPosts()
    return {
        paths: getAllPaths(posts).map(key => ({
            params: {
                title: key.split('/')
            }
        })),
        fallback: false,
    }
};