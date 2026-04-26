import { useState } from 'react';
import styles from './ExamplesDrawer.module.css';

interface ExamplesDrawerProps {
  label: string;
  items: string[];
  accent?: 'gold' | 'blue' | 'green';
}

export function ExamplesDrawer({ label, items, accent = 'gold' }: ExamplesDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.trigger} ${styles['accent_' + accent]}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className={styles.triggerIcon}>💡</span>
        <span>{open ? 'Hide ' : 'See '} {label}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>›</span>
      </button>
      {open && (
        <div className={styles.panel}>
          <ul className={styles.list}>
            {items.map((item, i) => (
              <li key={i} className={styles.item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
