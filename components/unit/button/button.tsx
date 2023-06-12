import { ButtonHTMLAttributes } from 'react';
import styles from './button.module.css';

export default function Button(args: ButtonHTMLAttributes<any>) {
  return <button {...args} className={styles.button}>{args.children}</button>;
}