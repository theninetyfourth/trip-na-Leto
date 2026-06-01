import React from 'react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <h1 className={styles.title}>Volunteer Scheduler</h1>
        </div>
        <p className={styles.subtitle}>Track team availability at a glance</p>
      </div>
    </header>
  );
}
