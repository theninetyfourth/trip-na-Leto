import React, { useMemo } from 'react';
import styles from './Calendar.module.css';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  isToday,
  toDateKey,
} from '../utils/dateUtils';
import { getColorForPerson } from '../utils/colors';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({
  year,
  month,
  people,
  unavailability,
  selectedPersonId,
  onDateClick,
  onPrevMonth,
  onNextMonth,
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Build a map: dateKey -> list of people who are unavailable
  const unavailMap = useMemo(() => {
    const map = {};
    people.forEach(person => {
      const dates = unavailability[person.id] || [];
      dates.forEach(dateKey => {
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push(person.id);
      });
    });
    return map;
  }, [people, unavailability]);

  function isUnavailableForSelected(dateKey) {
    if (!selectedPersonId) return false;
    return (unavailability[selectedPersonId] || []).includes(dateKey);
  }

  // cells = array of { day: number|null }
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className={styles.wrapper}>
      {/* Navigation */}
      <div className={styles.nav}>
        <button className={styles.navBtn} onClick={onPrevMonth} aria-label="Previous month">
          ‹
        </button>
        <div className={styles.monthLabel}>
          <span className={styles.monthName}>{getMonthName(month)}</span>
          <span className={styles.yearName}>{year}</span>
        </div>
        <button className={styles.navBtn} onClick={onNextMonth} aria-label="Next month">
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className={styles.grid}>
        {DAY_NAMES.map(d => (
          <div key={d} className={styles.dayHeader}>{d}</div>
        ))}

        {cells.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className={styles.emptyCell} />;
          }

          const dateKey = toDateKey(year, month, day);
          const unavailPeople = unavailMap[dateKey] || [];
          const today = isToday(year, month, day);
          const isSelectedUnavail = isUnavailableForSelected(dateKey);
          const isClickable = !!selectedPersonId;

          return (
            <DayCell
              key={dateKey}
              day={day}
              dateKey={dateKey}
              today={today}
              unavailPeople={unavailPeople}
              people={people}
              isSelectedUnavail={isSelectedUnavail}
              isClickable={isClickable}
              selectedPersonId={selectedPersonId}
              onClick={() => isClickable && onDateClick(dateKey)}
            />
          );
        })}
      </div>
    </div>
  );
}

function DayCell({ day, today, unavailPeople, people, isSelectedUnavail, isClickable, selectedPersonId, onClick }) {
  const hasUnavail = unavailPeople.length > 0;

  // Build color strips for unavailable people
  const colors = unavailPeople
    .map(pid => {
      const c = getColorForPerson(people, pid);
      return c ? c.bg : null;
    })
    .filter(Boolean);

  const selectedColor = selectedPersonId ? getColorForPerson(people, selectedPersonId) : null;

  return (
    <div
      className={[
        styles.dayCell,
        today ? styles.today : '',
        isClickable ? styles.clickable : '',
        isSelectedUnavail ? styles.markedUnavail : '',
        hasUnavail && !isSelectedUnavail ? styles.hasOthers : '',
      ].join(' ')}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      aria-pressed={isClickable ? isSelectedUnavail : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={e => e.key === 'Enter' && isClickable && onClick()}
      style={
        isSelectedUnavail && selectedColor
          ? { '--selected-color': selectedColor.bg, '--selected-light': selectedColor.light }
          : {}
      }
    >
      <span className={styles.dayNumber}>{day}</span>

      {/* Color dots for unavailable people */}
      {colors.length > 0 && (
        <div className={styles.colorStrips}>
          {colors.slice(0, 6).map((c, i) => (
            <span
              key={i}
              className={styles.colorDot}
              style={{ background: c }}
            />
          ))}
          {colors.length > 6 && (
            <span className={styles.moreIndicator}>+{colors.length - 6}</span>
          )}
        </div>
      )}

      {/* Hover indicator when a person is selected */}
      {isClickable && !isSelectedUnavail && (
        <span className={styles.hoverMark} style={selectedColor ? { background: selectedColor.bg } : {}} />
      )}
    </div>
  );
}
