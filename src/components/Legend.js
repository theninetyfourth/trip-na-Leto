import React from 'react';
import styles from './Legend.module.css';
import { getColorForIndex } from '../utils/colors';

export default function Legend({ people, unavailability }) {
  if (people.length === 0) return null;

  return (
    <div className={styles.legend}>
      <h3 className={styles.title}>Legend</h3>
      <div className={styles.items}>
        {people.map((person, idx) => {
          const color = getColorForIndex(idx);
          const count = (unavailability[person.id] || []).length;
          return (
            <div key={person.id} className={styles.item}>
              <span className={styles.swatch} style={{ background: color.bg }} />
              <span className={styles.name}>{person.name}</span>
              {count > 0 && (
                <span className={styles.count} style={{ background: color.bg + '22', color: color.bg }}>
                  {count} day{count !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
