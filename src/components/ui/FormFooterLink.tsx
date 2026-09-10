import Link from 'next/link';
import styles from './FormFooterLink.module.css';

interface FormFooterLinkProps {
  text: string;
  linkText: string;
  href: string;
}

export default function FormFooterLink({ text, linkText, href }: FormFooterLinkProps) {
  return (
    <div className={styles.container}>
      {text}{' '}
      <Link href={href} className={styles.link}>
        {linkText}
      </Link>
    </div>
  );
}
