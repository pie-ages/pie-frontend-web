import { ReactNode } from 'react';
import styles from './FormHeader.module.css';

interface FormHeaderProps {
  title: ReactNode;
  subtitle?: string;
}

export default function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
