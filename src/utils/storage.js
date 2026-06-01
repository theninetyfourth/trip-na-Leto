const STORAGE_KEY = 'volunteer_scheduler_v1';

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or blocked
  }
}

export function getInitialState() {
  const saved = loadData();
  if (saved) return saved;
  return {
    people: [],
    // unavailability: { "personId": ["YYYY-MM-DD", ...] }
    unavailability: {},
  };
}
