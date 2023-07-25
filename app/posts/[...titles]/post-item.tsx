'use client';
import Title from '@/components/title.module';
import classNames from 'classnames';
import 'highlight.js/styles/default.css';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { PostNode } from '../../../lib/post';
import styles from './post.module.css';
import { Section } from '@/components/posts/section/section';
import { Toc } from '@/components/posts/toc/toc';
import PostContent from '@/components/posts/toc-body/post-content';
import Head from 'next/head';

const postContentKey = 'post_content';

export default function PostItem({posts, post}: {  post?: PostNode, posts: PostNode[] }) {
  const [hideToc, setHideToc] = useState<boolean>(true);
  const [hideSection, setHideSection] = useState<boolean>(true);
  const postContentRef = useRef<HTMLDivElement>(null);

  return post ? <>
    <Title text={post.title ?? '文章'} />
    <div className={styles.left_draw_wrapper}>
      <Section
        post={posts.find((p) => post.key.startsWith(p.key))}
        className={classNames({
          [styles.section]: true,
          [styles.hidden]: hideSection
        })}
      />
      <div>
        <div className={styles.left_icon} onClick={() => {
          setHideSection(c => !c);
          setHideToc(true);
        }}>
          <span>{hideSection ? '章节' : '收起'}</span>
          <Image src="/expand.svg" width={18} height={18} alt='section icon' className={classNames({
            [styles.left_icon_icon]: true,
            [styles.hidden]: hideSection
          })} />
        </div>
      </div>
    </div>
    <div className={styles.draw_wrapper}>
      <div>
        <div className={styles.icon} onClick={() => {
          setHideToc(c => !c);
          setHideSection(true);
        }}>
          <Image src="/expand.svg" width={18} height={18} alt='toc icon' className={classNames({
            [styles.icon_icon]: true,
            [styles.hidden]: hideToc
          })} />
          <span>{hideToc ? '目录' : '收起'}</span>
        </div>
      </div>
      <Toc
        contentRef={postContentRef}
        refClassNames={postContentRef.current?.className}
        className={classNames({
          [styles.toc]: true,
          [styles.hidden]: hideToc
        })}
        onSelect={() => setHideToc(true)}
      />
    </div>
    <PostContent 
      id={postContentKey}
      ref={postContentRef}
      post={post} 
      className={classNames({
        [styles.post_content]:true,
        [styles.mask]: !hideSection || !hideToc,
      })}
    />
  </> : <>404</>;
}