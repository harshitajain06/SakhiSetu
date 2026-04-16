/**
 * India UIP-aligned schedule (MoHFW Universal Immunization Programme).
 * Same templates as Cloud Functions; doc IDs are deterministic for idempotent client/server writes.
 * Verify with state-specific guidelines and official MoHFW updates.
 */
export const VACCINE_TEMPLATES = [
  // Birth
  { vaccineName: 'BCG', recommendedAge: 'At Birth', daysFromDob: 0 },
  { vaccineName: 'OPV-0', recommendedAge: 'At Birth', daysFromDob: 0 },
  { vaccineName: 'Hepatitis B Birth Dose', recommendedAge: 'At Birth', daysFromDob: 0 },
  // 6 weeks
  { vaccineName: 'Pentavalent-1', recommendedAge: '6 weeks', daysFromDob: 42 },
  { vaccineName: 'OPV-1', recommendedAge: '6 weeks', daysFromDob: 42 },
  { vaccineName: 'IPV-1', recommendedAge: '6 weeks', daysFromDob: 42 },
  { vaccineName: 'Rotavirus-1', recommendedAge: '6 weeks', daysFromDob: 42 },
  { vaccineName: 'PCV-1', recommendedAge: '6 weeks', daysFromDob: 42 },
  // 10 weeks
  { vaccineName: 'Pentavalent-2', recommendedAge: '10 weeks', daysFromDob: 70 },
  { vaccineName: 'OPV-2', recommendedAge: '10 weeks', daysFromDob: 70 },
  { vaccineName: 'IPV-2', recommendedAge: '10 weeks', daysFromDob: 70 },
  { vaccineName: 'Rotavirus-2', recommendedAge: '10 weeks', daysFromDob: 70 },
  { vaccineName: 'PCV-2', recommendedAge: '10 weeks', daysFromDob: 70 },
  // 14 weeks
  { vaccineName: 'Pentavalent-3', recommendedAge: '14 weeks', daysFromDob: 98 },
  { vaccineName: 'OPV-3', recommendedAge: '14 weeks', daysFromDob: 98 },
  { vaccineName: 'IPV-3', recommendedAge: '14 weeks', daysFromDob: 98 },
  { vaccineName: 'Rotavirus-3', recommendedAge: '14 weeks', daysFromDob: 98 },
  { vaccineName: 'PCV-3', recommendedAge: '14 weeks', daysFromDob: 98 },
  // 9 months (270 days)
  { vaccineName: 'Measles-1 / MR-1', recommendedAge: '9 months', daysFromDob: 270 },
  // 16–18 months (use 16 months = ~486 days)
  { vaccineName: 'DPT Booster-1', recommendedAge: '16–18 months', daysFromDob: 486 },
  { vaccineName: 'OPV Booster (16–18 m)', recommendedAge: '16–18 months', daysFromDob: 486 },
  { vaccineName: 'IPV Booster', recommendedAge: '16–18 months', daysFromDob: 486 },
  // 18 months
  { vaccineName: 'MMR', recommendedAge: '18 months', daysFromDob: 548 },
  // 5 years
  { vaccineName: 'DT (5 years)', recommendedAge: '5 years', daysFromDob: 1825 },
  { vaccineName: 'OPV Booster (5 years)', recommendedAge: '5 years', daysFromDob: 1825 },
];

export function vaccineDocId(tmpl) {
  const slug = tmpl.vaccineName.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') || 'v';
  return `d${tmpl.daysFromDob}_${slug}`;
}

export function dueDateStringFromDob(dobYyyyMmDd, daysFromDob) {
  const [y, m, d] = dobYyyyMmDd.split('-').map(Number);
  const due = new Date(Date.UTC(y, m - 1, d));
  due.setUTCDate(due.getUTCDate() + daysFromDob);
  return due.toISOString().slice(0, 10);
}

/** Calendar-day diff: due minus today (negative = overdue). Uses local date strings YYYY-MM-DD. */
export function daysUntilDue(dueYmd) {
  const t = new Date();
  const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  const [y1, m1, d1] = todayStr.split('-').map(Number);
  const [y2, m2, d2] = String(dueYmd).slice(0, 10).split('-').map(Number);
  const a = Date.UTC(y1, m1 - 1, d1);
  const b = Date.UTC(y2, m2 - 1, d2);
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

/**
 * @returns {'done'|'overdue'|'dueSoon'|'upcoming'}
 */
export function vaccineStatusCategory(v) {
  if (v.status === 'completed') return 'done';
  const due = String(v.dueDate || '').slice(0, 10);
  if (!due) return 'upcoming';
  const d = daysUntilDue(due);
  if (d < 0) return 'overdue';
  if (d <= 7) return 'dueSoon';
  return 'upcoming';
}
