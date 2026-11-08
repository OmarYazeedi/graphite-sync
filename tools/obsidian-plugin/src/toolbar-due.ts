/* ══ THE GRAPHITE BAR · DUE DATES, COUNTED FROM THE NOTE'S DAY ═════════════
 *
 * A day chip sets a date in one tap, counted from the note's own day (the day
 * census.ts `noteDay` reads), never from today: a meeting note from Tuesday
 * is written on Friday, and "Thursday" in it means the Thursday after Tuesday.
 *
 * IT ALWAYS WRITES THE FULL DATE. `| due: friday` is read by the capture door
 * but only against the note's day, so a line that outlives its capture could
 * change meaning; `| due: 2026-11-13` reads the same in Obsidian, in Graphite
 * and on any device, whatever day it is captured.
 *
 * All arithmetic is in UTC on the date alone, so a machine's time zone cannot
 * move a chip.
 */

const DAY = 86_400_000;
const NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];

const ms = (iso: string): number => {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};
const iso = (t: number): string => new Date(t).toISOString().slice(0, 10);

export const addDays = (day: string, n: number): string => iso(ms(day) + n * DAY);
/** 0 is Sunday. */
export const weekday = (day: string): number => new Date(ms(day)).getUTCDay();

export interface DueChip { label: string; sub: string; date: string }

/** `Sat 7 Nov`. */
export function dayLabel(day: string): string {
  const d = new Date(ms(day));
  return `${NAMES[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/** Today and tomorrow, then the next five weekdays, then the Monday after
 *  those. Weekends are not chips (the calendar reaches them). */
export function dueChips(noteDay: string): DueChip[] {
  const short = (day: string) => `${NAMES[weekday(day)]} ${Number(day.slice(8))}`;
  const chips: DueChip[] = [
    { label: 'Today', sub: short(noteDay), date: noteDay },
    { label: 'Tomorrow', sub: short(addDays(noteDay, 1)), date: addDays(noteDay, 1) },
  ];
  let day = addDays(noteDay, 1);
  let n = 0;
  while (n < 5) {
    day = addDays(day, 1);
    const w = weekday(day);
    if (w === 0 || w === 6) continue;
    chips.push({ label: NAMES[w], sub: `${Number(day.slice(8))} ${MONTHS[Number(day.slice(5, 7)) - 1]}`, date: day });
    n++;
  }
  let monday = addDays(day, 1);
  while (weekday(monday) !== 1) monday = addDays(monday, 1);
  chips.push({ label: 'Next week', sub: `Mon ${Number(monday.slice(8))}`, date: monday });
  return chips;
}

export const DUE_TIMES = ['09:00', '12:00', '14:00', '17:00'] as const;

/** `HH:MM`, 00:00 to 23:59. */
export function validTime(t: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
}

/** What goes after `due: `. */
export function dueValue(date: string, time: string | null): string {
  return time ? `${date} ${time}` : date;
}

/** The date and time a line's `due:` value holds, when it is the full spelling. */
export function readDue(value: string | null): { date: string; time: string | null } | null {
  const m = value ? /^(\d{4}-\d{2}-\d{2})(?:\s+(\d{2}:\d{2}))?/.exec(value.trim()) : null;
  return m ? { date: m[1], time: m[2] ?? null } : null;
}

export function monthTitle(year: number, month: number): string {
  return `${FULL_MONTHS[month - 1]} ${year}`;
}

/** The weeks of a month, Monday first; null pads the first and last. */
export function monthGrid(year: number, month: number): (number | null)[][] {
  const lead = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** A month earlier or later than [year]-[month]. */
export function shiftMonth(year: number, month: number, by: number): { year: number; month: number } {
  const t = year * 12 + (month - 1) + by;
  return { year: Math.floor(t / 12), month: (t % 12) + 1 };
}
