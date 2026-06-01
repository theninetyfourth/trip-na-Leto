import React, { useState, useEffect, useCallback } from 'react';
import styles from './App.module.css';
import Header from './components/Header';
import PeoplePanel from './components/PeoplePanel';
import Calendar from './components/Calendar';
import Legend from './components/Legend';
import { getInitialState, saveData } from './utils/storage';

let nextId = 1;

function App() {
  const [state, setState] = useState(() => {
    const initial = getInitialState();
    // Determine next ID safely
    if (initial.people.length > 0) {
      nextId = Math.max(...initial.people.map(p => p._id || 1)) + 1;
    }
    return initial;
  });

  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  // Persist on every state change
  useEffect(() => {
    saveData(state);
  }, [state]);

  // Deselect person if they're removed
  useEffect(() => {
    if (selectedPersonId && !state.people.find(p => p.id === selectedPersonId)) {
      setSelectedPersonId(null);
    }
  }, [state.people, selectedPersonId]);

  const handleAddPerson = useCallback((name) => {
    const id = `person_${nextId++}`;
    setState(prev => ({
      ...prev,
      people: [...prev.people, { id, name, _id: nextId }],
      unavailability: { ...prev.unavailability, [id]: [] },
    }));
  }, []);

  const handleRemovePerson = useCallback((personId) => {
    setState(prev => {
      const newUnavail = { ...prev.unavailability };
      delete newUnavail[personId];
      return {
        ...prev,
        people: prev.people.filter(p => p.id !== personId),
        unavailability: newUnavail,
      };
    });
  }, []);

  const handleDateClick = useCallback((dateKey) => {
    if (!selectedPersonId) return;
    setState(prev => {
      const currentDates = prev.unavailability[selectedPersonId] || [];
      const isMarked = currentDates.includes(dateKey);
      const newDates = isMarked
        ? currentDates.filter(d => d !== dateKey)
        : [...currentDates, dateKey];
      return {
        ...prev,
        unavailability: {
          ...prev.unavailability,
          [selectedPersonId]: newDates,
        },
      };
    });
  }, [selectedPersonId]);

  const handlePrevMonth = useCallback(() => {
    setView(v => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { ...v, month: v.month - 1 };
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setView(v => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { ...v, month: v.month + 1 };
    });
  }, []);

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <div className={styles.layout}>
          <PeoplePanel
            people={state.people}
            selectedPersonId={selectedPersonId}
            onSelectPerson={setSelectedPersonId}
            onAddPerson={handleAddPerson}
            onRemovePerson={handleRemovePerson}
          />
          <div className={styles.calendarArea}>
            <Calendar
              year={view.year}
              month={view.month}
              people={state.people}
              unavailability={state.unavailability}
              selectedPersonId={selectedPersonId}
              onDateClick={handleDateClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
            <Legend
              people={state.people}
              unavailability={state.unavailability}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
