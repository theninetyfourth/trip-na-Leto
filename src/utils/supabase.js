const SUPABASE_URL = 'https://zpgvknlfnjuaodfcryph.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwZ3Zrbmxmbmp1YW9kZmNyeXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDAxNzAsImV4cCI6MjA5NTkxNjE3MH0.sNIqyNX3f9QoIEII9PiHUTfq_3gvhVsCEM8wZEZHDoU';
const ROW_ID = 1;

export async function loadFromCloud() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/scheduler_data?id=eq.${ROW_ID}&select=data`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const rows = await res.json();
    if (rows && rows.length > 0 && rows[0].data) {
      return JSON.parse(rows[0].data);
    }
    return null;
  } catch (e) {
    console.error('Load error', e);
    return null;
  }
}

export async function saveToCloud(data) {
  try {
    // Try update first
    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/scheduler_data?id=eq.${ROW_ID}`,
      {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ data: JSON.stringify(data) }),
      }
    );

    // If no row existed, insert
    if (updateRes.status === 404 || updateRes.status === 406) {
      await fetch(`${SUPABASE_URL}/rest/v1/scheduler_data`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ id: ROW_ID, data: JSON.stringify(data) }),
      });
    }
  } catch (e) {
    console.error('Save error', e);
  }
}

export async function ensureRowExists() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/scheduler_data?id=eq.${ROW_ID}&select=id`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const rows = await res.json();
    if (!rows || rows.length === 0) {
      await fetch(`${SUPABASE_URL}/rest/v1/scheduler_data`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ id: ROW_ID, data: JSON.stringify({ people: [], unavailability: {} }) }),
      });
    }
  } catch (e) {
    console.error('Ensure row error', e);
  }
}
