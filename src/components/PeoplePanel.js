import React, { useState } from 'react';
import styles from './PeoplePanel.module.css';
import { getColorForIndex } from '../utils/colors';

export default function PeoplePanel({ people, selectedPersonId, onSelectPerson, onAddPerson, onRemovePerson }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    const name = inputValue.trim();
    if (!name) { setError('Please enter a name.'); return; }
    if (people.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      setError('Name already exists.');
      return;
    }
    onAddPerson(name);
    setInputValue('');
    setError('');
  }

  return (
    <aside className={styles.panel}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Pridať osobu</h2>
        <form onSubmit={handleAdd} className={styles.addForm}>
          <input
            className={styles.input}
            type="text"
            value={inputValue}
            onChange={e => { setInputValue(e.target.value); setError(''); }}
            placeholder="Full name…"
            maxLength={40}
          />
          <button type="submit" className={styles.addBtn}>Add</button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>

      {people.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Team
            <span className={styles.badge}>{people.length}</span>
          </h2>
          <div className={styles.hint}>
            {selectedPersonId
              ? 'Click dates to toggle unavailability'
              : 'Select a person to mark dates'}
          </div>
          <ul className={styles.list}>
            {people.map((person, idx) => {
              const color = getColorForIndex(idx);
              const isSelected = selectedPersonId === person.id;
              return (
                <li key={person.id}
                  className={`${styles.personItem} ${isSelected ? styles.selected : ''}`}
                  onClick={() => onSelectPerson(isSelected ? null : person.id)}
                >
                  <span
                    className={styles.swatch}
                    style={{ background: color.bg }}
                  />
                  <span className={styles.personName}>{person.name}</span>
                  <button
                    className={styles.removeBtn}
                    onClick={e => { e.stopPropagation(); onRemovePerson(person.id); }}
                    title="Vymazať meno"
                    aria-label={`Remove ${person.name}`}
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {people.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>👥</span>
          <p>Zatiaľ tu nikoho nemáme.<br />Pridajte niekoho.</p>
        </div>
      )}
    </aside>
  );
}
