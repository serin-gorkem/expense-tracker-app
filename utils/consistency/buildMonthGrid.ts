// utils/consistency/buildMonthGrid.ts

/**
 * Returns weeks for a month.
 * Each week is an array of 7 items (Mon-first).
 * Empty days = null
 */
export function buildMonthGrid(month: Date): (number | null)[][] {
  const year = month.getFullYear();
  const m = month.getMonth();

  const firstDay = new Date(year, m, 1);
  const lastDay = new Date(year, m + 1, 0);

  // JS: Sun=0 → Mon=1 ... we want Mon=0
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = new Array(7).fill(null);

  let day = 1;

  // fill first week
  for (let i = firstWeekday; i < 7; i++) {
    week[i] = day++;
  }
  weeks.push(week);

  // rest weeks
  while (day <= daysInMonth) {
    const w: (number | null)[] = new Array(7).fill(null);
    for (let i = 0; i < 7 && day <= daysInMonth; i++) {
      w[i] = day++;
    }
    weeks.push(w);
  }

  return weeks;
}