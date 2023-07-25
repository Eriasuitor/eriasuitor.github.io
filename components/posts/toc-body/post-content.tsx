import { ForwardedRef, HTMLAttributes, HTMLProps, forwardRef } from 'react';
import { PostNode } from '@/lib/post';
import classNames from 'classnames';
import styles from './post-content.module.css';

const PostContent = forwardRef(function PostContent({ post, className, ...args}: {
  post: PostNode;
} & HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) {
  return <div
    dangerouslySetInnerHTML={{ __html: post.contentHtml ?? '' }}
    ref={ref}
    className={classNames({
      [styles.post_content]: true,
      [className ?? '']: true
    })}
    {...args}
  />;
});

export default PostContent;