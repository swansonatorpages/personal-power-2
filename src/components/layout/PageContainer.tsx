import { ReactNode } from 'react';
import styles from './PageContainer.module.css';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={`${styles.container} ${className ?? ''}`} role="main">
      {children}
    </main>
  );
}
