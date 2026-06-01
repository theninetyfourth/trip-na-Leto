import React from 'react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <h1 className={styles.title}>Chorvátsko Trip</h1>
        </div>
        <p className={styles.subtitle}>Obsadené dni</p>
      </div>
    </header>
  );
}
