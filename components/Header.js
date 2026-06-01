import React from 'react';
import styles from './Header.module.css';

export default function Header({ saveStatus }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <h1 className={styles.title}>Chorvátsko Trip</h1>
        </div>
        <div className={styles.right}>
          <p className={styles.subtitle}>Track team availability at a glance</p>
          {saveStatus && (
            <span className={`${styles.saveStatus} ${styles[saveStatus]}`}>
              {saveStatus === 'saving' && '⟳ Saving…'}
              {saveStatus === 'saved' && '✓ Saved'}
              {saveStatus === 'error' && '✗ Error saving'}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
