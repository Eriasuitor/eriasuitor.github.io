'use client';
import classNames from 'classnames';
import { HTMLAttributes, useEffect, useRef } from 'react';
import styles from './draw.module.css';

export default function Draw(params: HTMLAttributes<any> & {direction?: 'left' | 'right', hidden: boolean, width: string}) {
  return <div className={classNames({
    [styles.draw]: true,
    [styles.hidden]:params.hidden,
    [styles[params.direction ?? 'right']]: true,
    [params.className ?? '']: true
  })} style={{width: params.width}}>
    {params.children}
  </div>;
}