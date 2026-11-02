/* ══ OC7 — THE VAULT CENSUS: WHAT THE MORNING SWEEP MAY KNOW OF A NOTE ═════
 *
 * Omar 2026-09-23: the sweep's vault census keeps "counts and dates only but
 * it need to read tags and links to map things correctly". The sweep's two
 * vault rules ran blind — rule 8 (to-dos nobody filed) was handed nothing,
 * rule 10 (meetings with no note) could see only links made in the app.
 *
 * A NOTE BECOMES: its path, its day, its task lines COUNTED by state, its
 * tags and its link targets. Never a word of what it says — the type below
 * has no field that could carry one, and the server's DTO has none either.
 *
 * ONLY THE NOTES A RULE CAN READ are reported, which is the data-minimising
 * reading of "counts and dates": a note holding an unticked line nobody
 * filed (rule 8's whole input), or one dated inside the last week (rule 10
 * looks for yesterday's note; a week covers a sweep run late). A vault's
 * years of finished daily notes stay on the machine.
 *
 * THIS FILE IMPORTS ONLY THE SERVER'S OWN GRAMMARS — the box, the marker and
 * the tags — so a line the census counts as open is a line capture would
 * read as open, and a tag here is a tag there.
 */

import { LP_TAIL, PROPOSAL_TAIL } from '../../../apps/api/src/spaces/vault-anchor';
import { taskBox } from '../../../apps/api/src/spaces/vault-tick';
import { frontmatterTags, parseVaultTags } from '../../../apps/api/src/spaces/vault-tags';
import { bodyLines } from './note-lines';

export interface CensusNote {
  path: string;
  /** The note's own day, YYYY-MM-DD. */
  date: string;
  /** `proposed` is an agent's italic proposal waiting for approval — a
   *  suggestion, so it is never counted as a to-do he left unfiled. */
  counts: { open: number; captured: number; done: number; cancelled: number; proposed: number };
  tags: string[];
  /** Link targets as written, alias dropped: `Calendar#^e3`, `IS-07 weekly`. */
  links: string[];
}

/** A note dated inside this many days of today is reported whatever it holds. */
export const CENSUS_RECENT_DAYS = 7;

/** A day as YYYY-MM-DD in the machine's own calendar — a daily note is
 *  named for the day he wrote it, not for UTC's. */
export function localDay(ms: number): string {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const WIKI_LINK = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;
const MD_LINK = /\]\(([^)\s]+)\)/g;
const FRONTMATTER_DATE = /^date:\s*["']?(\d{4}-\d{2}-\d{2})/m;
const NAMED_DAY = /(\d{4}-\d{2}-\d{2})/;

/** The note's day: a `date:` it declares, else a day in its name (a daily
 *  note), else the day the file was made. */
function noteDay(path: string, text: string, createdMs: number): string {
  const head = text.startsWith('---') ? text.slice(0, text.indexOf('\n---', 3) + 1) : '';
  const declared = FRONTMATTER_DATE.exec(head);
  if (declared) return declared[1];
  const named = NAMED_DAY.exec(path.split('/').pop() ?? '');
  return named ? named[1] : localDay(createdMs);
}

export function censusOf(path: string, text: string, createdMs: number): CensusNote {
  const lines = text.split('\n');
  const counts = { open: 0, captured: 0, done: 0, cancelled: 0, proposed: 0 };
  const tags = new Set<string>(frontmatterTags(text) ?? []);
  const links = new Set<string>();
  for (const at of bodyLines(lines)) {
    const line = lines[at];
    const box = taskBox(line);
    if (box && PROPOSAL_TAIL.test(line)) counts.proposed++;
    else if (box?.state === 'done') counts.done++;
    else if (box?.state === 'cancelled') counts.cancelled++;
    else if (box) {
      if (LP_TAIL.test(line)) counts.captured++;
      else if (box.rest.trim()) counts.open++;
    }
    for (const t of parseVaultTags(line).tags) tags.add(t);
    for (const m of line.matchAll(WIKI_LINK)) links.add(m[1].trim());
    for (const m of line.matchAll(MD_LINK)) {
      // A web address is somewhere he went, not a note in the vault.
      if (!/^[a-z][a-z0-9+.-]*:/i.test(m[1])) links.add(safeDecode(m[1]));
    }
  }
  return {
    path, date: noteDay(path, text, createdMs), counts,
    tags: [...tags], links: [...links],
  };
}

/** `My%20Note.md` as the vault names it; a malformed escape is kept as typed. */
function safeDecode(s: string): string {
  try { return decodeURI(s); } catch { return s; }
}

/** Does a rule have a reason to read this note? */
export function inCensus(n: CensusNote, today: string): boolean {
  if (n.counts.open > 0) return true;
  const age = (Date.parse(today) - Date.parse(n.date)) / 86_400_000;
  return age >= 0 && age <= CENSUS_RECENT_DAYS;
}
