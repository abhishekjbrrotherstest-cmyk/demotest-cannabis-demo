/**
 * Store hours are seeded as store_hours rows:
 *   { day_of_week: 0 (Sunday) — 6 (Saturday), open_time: '10:00:00', close_time: '19:00:00' }
 * Returns true if the store is currently open (ignores holiday hours).
 */
export function isStoreOpenNow(hours = []) {
  if (!Array.isArray(hours) || hours.length === 0) return false;
  const now = new Date();
  const entry = hours.find((h) => Number(h.day_of_week) === now.getDay());
  if (!entry || !entry.open_time || !entry.close_time) return false;

  const nowHM = now.toTimeString().slice(0, 5); // 'HH:MM' (24h, zero-padded)
  const open = String(entry.open_time).slice(0, 5);
  const close = String(entry.close_time).slice(0, 5);
  return nowHM >= open && nowHM < close;
}