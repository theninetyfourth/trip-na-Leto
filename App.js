import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './App.module.css';
import Header from './components/Header';
import PeoplePanel from './components/PeoplePanel';
import Calendar from './components/Calendar';
import Legend from './components/Legend';
import { loadFromCloud, saveToCloud, ensureRowExists } from './utils/supabase';

let nextId = 1;

function App() {
  const [state, setState] = useState({ people: [], unavailability: {} });
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const saveTimer = useRef(null);

  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  // Load from cloud on mount
  useEffect(() => {
    async function init() {
      await ensureRowExists();
      const data = await loadFromCloud();
      if (data) {
        setState(data);
        if (data.people.length > 0) {
          nextId = Math.max(...data.people.map((p, i) => i + 1)) + 1;
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  // Poll for changes every 10 seconds so all users see updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await loadFromCloud();
      if (data) {
        setState(prev => {
          // Only update if data actually changed
          if (JSON.stringify(prev) !== JSON.stringify(data)) {
            return data;
          }
          return prev;
        });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Save to cloud with debounce
  const debouncedSave = useCallback((newState) => {
    setSaveStatus('saving');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await saveToCloud(newState);
        setSaveStatus('saved');
      } catch {
        setSaveStatus('error');
      }
    }, 800);
  }, []);

  // Deselect if person removed
  useEffect(() => {
    if (selectedPersonId && !state.people.find(p => p.id === selectedPersonId)) {
      setSelectedPersonId(null);
    }
  }, [state.people, selectedPersonId]);

  const handleAddPerson = useCallback((name) => {
    const id = `person_${Date.now()}_${nextId++}`;
    setState(prev => {
      const newState = {
        ...prev,
        people: [...prev.people, { id, name }],
        unavailability: { ...prev.unavailability, [id]: [] },
      };
      debouncedSave(newState);
      return newState;
    });
  }, [debouncedSave]);

  const handleRemovePerson = useCallback((personId) => {
    setState(prev => {
      const newUnavail = { ...prev.unavailability };
      delete newUnavail[personId];
      const newState = {
        ...prev,
        people: prev.people.filter(p => p.id !== personId),
        unavailability: newUnavail,
      };
      debouncedSave(newState);
      return newState;
    });
  }, [debouncedSave]);

  const handleDateClick = useCallback((dateKey) => {
    if (!selectedPersonId) return;
    setState(prev => {
      const currentDates = prev.unavailability[selectedPersonId] || [];
      const isMarked = currentDates.includes(dateKey);
      const newDates = isMarked
        ? currentDates.filter(d => d !== dateKey)
        : [...currentDates, dateKey];
      const newState = {
        ...prev,
        unavailability: { ...prev.unavailability, [selectedPersonId]: newDates },
      };
      debouncedSave(newState);
      return newState;
    });
  }, [selectedPersonId, debouncedSave]);

  const handlePrevMonth = useCallback(() => {
    setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  }, []);

  const handleNextMonth = useCallback(() => {
    setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });
  }, []);

  if (loading) {
    return (
      <div className={styles.app}>
        <Header />
        <div className={styles.loadingScreen}>
          <div className={styles.spinner} />
          <p>Loading schedule…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Header saveStatus={saveStatus} />
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
