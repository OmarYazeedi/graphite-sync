/* ══ OC4 — ITALIC UNTIL APPROVED ═══════════════════════════════════════════
 *
 * Omar, 2026-09-22: an agent may write into a note unattended, but "it will
 * always be in italic font style… asks for approval… once granted or
 * modified then approved it will create the entries in graphite and
 * finalize the edit in obsidian md". 2026-09-23: approve by "command, panel,
 * un-italicise, checkbox".
 *
 * A PROPOSAL THAT LOOKS LIKE A RECORD IS THE WHOLE RISK. So the state of a
 * line is decided here, in one place, from the line alone:
 *
 *   - [ ] *chase the seal kit* | lp: p_7f3a     PROPOSED   italic, unticked
 *   - [x] *chase the seal kit* | lp: p_7f3a     APPROVED   the tick gesture
 *   - [ ] chase the seal kit | lp: p_7f3a       APPROVED   un-italicised
 *   - [ ] chase the seal kit* | lp: p_7f3a      UNREADABLE half an edit — wait
 *   - [ ] chase the seal kit | lp: ckz9b7m1     a record   (finalised)
 *
 * The hidden key is the truth and italic is its visible half: italic with no
 * key is his own emphasis and nothing here reads it.
 *
 * A TICK ON AN ITALIC LINE MEANS APPROVE, NEVER DONE. A proposal is not a
 * task yet, so it cannot be finished: the task is created OPEN and the line
 * comes back unticked in finalise's single write.
 *
 * ALL FOUR GESTURES END IN ONE FUNCTION. The command and the panel approve a
 * line whatever it looks like; un-italicising and ticking are read off the
 * line by `readProposal`. Each then hands the same keys to the plugin's one
 * transition, which sends `approvedText` and writes `finalised`.
 *
 * THIS FILE IMPORTS ONLY THE MARKER GRAMMAR AND THE ONE LINE WALK
 * (note-lines.ts), which import nothing, so the
 * API's jest suite can execute it — the only plugin code any test in this
 * repository can run line by line.
 */

import { PROPOSAL_KEY, PROPOSAL_TAIL } from '../../../apps/api/src/spaces/vault-anchor';
import { bodyLines } from './note-lines';

export type ProposalState = 'proposed' | 'approved' | 'unreadable';

export interface ProposalRead {
  key: string;
  state: ProposalState;
  /** How an approved line was approved by its own shape. */
  gesture?: 'tick' | 'upright';
  /** Why a line is unreadable, in words for the panel. */
  reason?: string;
}

const CHECKBOX = /^(\s*[-*+]\s+)\[( |x|X)\](\s+)([\s\S]*)$/;

/** `*words*` or `_words_` at the start of the line's words — a single
 *  delimiter, not bold — and whatever follows it (a `>>`, a tag). */
const ITALIC = /^([*_])(?![*_])(\S(?:[\s\S]*?\S)?)\1(?![*_])([\s\S]*)$/;

/** A lone emphasis delimiter left behind by half an edit. */
const STRAY = /(^|[^*\\])\*(?!\*)|(^|\s)_(?!_)|(?<!_)_(\s|$)/;

/** Split a line's text after its checkbox into its WORDS and its ` | `
 *  fields, which stay outside any italic. */
function split(rest: string): { words: string; fields: string } {
  const bar = rest.indexOf(' | ');
  return bar < 0 ? { words: rest, fields: '' } : { words: rest.slice(0, bar), fields: rest.slice(bar) };
}

/** What this line is, if it is a proposal at all. Null for every other line
 *  — including italic prose, which is his. */
export function readProposal(line: string): ProposalRead | null {
  const m = PROPOSAL_TAIL.exec(line);
  if (!m || m.index === undefined) return null;
  const key = m[1];
  const cb = CHECKBOX.exec(line.slice(0, m.index));
  if (!cb) {
    return { key, state: 'unreadable', reason: 'a proposal is a checkbox line, and this is not one' };
  }
  const { words } = split(cb[4]);
  if (!words.trim()) return { key, state: 'unreadable', reason: 'it says nothing' };
  const ticked = cb[2] !== ' ';
  const italic = ITALIC.exec(words);
  if (italic) {
    if (STRAY.test(italic[3])) {
      return { key, state: 'unreadable', reason: 'an asterisk is left over — finish the edit' };
    }
    return ticked ? { key, state: 'approved', gesture: 'tick' } : { key, state: 'proposed' };
  }
  if (STRAY.test(words)) {
    return { key, state: 'unreadable', reason: 'half italic — finish removing the asterisks, or put them back' };
  }
  return { key, state: 'approved', gesture: 'upright' };
}

/** The line as it will be created and as it will read afterwards, minus the
 *  record id: unticked, upright, no key. This is what is SENT on approval,
 *  so what is created is what the line says at that moment — his edits
 *  included. */
export function approvedText(line: string): string {
  const m = PROPOSAL_TAIL.exec(line);
  const body = m && m.index !== undefined ? line.slice(0, m.index) : line;
  const cb = CHECKBOX.exec(body);
  if (!cb) return body.replace(/\s+$/, '');
  const { words, fields } = split(cb[4]);
  const it = ITALIC.exec(words);
  const plain = it ? `${it[2]}${it[3]}` : words;
  return `${cb[1]}[ ]${cb[3]}${plain}${fields}`.replace(/\s+$/, '');
}

/** FINALISE: one write — italics off, the key swapped for the record id.
 *  The result is byte-identical to a line captured by hand and stamped
 *  (main.ts stampCaptured), so the lifecycle closes with no fifth state. */
export function finalised(line: string, id: string): string {
  return `${approvedText(line)} | lp: ${id}`;
}

/** The shape an agent (or a person) writes a proposal in. The format is the
 *  contract the later server extractor drops into. */
export function proposalLine(words: string, key: string, indent = ''): string {
  if (!PROPOSAL_KEY.test(key)) throw new Error(`not a proposal key: ${key}`);
  const { words: w, fields } = split(words.trim());
  return `${indent}- [ ] *${w.trim()}*${fields} | lp: ${key}`;
}

/** A fresh key: `p_` and eight letters or digits. */
export function newProposalKey(random: () => number = Math.random): string {
  const abc = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = 'p_';
  for (let i = 0; i < 8; i++) s += abc[Math.floor(random() * abc.length)];
  return s;
}

export interface ProposalAt extends ProposalRead { line: number }

/** Every proposal in a note, with its 0-based line — never in the
 *  frontmatter, never inside a fenced code block (a sample of the format in
 *  somebody's documentation is not a proposal). */
export function proposalsIn(lines: readonly string[]): ProposalAt[] {
  const out: ProposalAt[] = [];
  for (const i of bodyLines(lines)) {
    const p = readProposal(lines[i]);
    if (p) out.push({ ...p, line: i });
  }
  return out;
}

/** Where a proposal is NOW. Anchored by its key, never by a line number:
 *  he may have moved it, or written above it, since it was read. */
export function lineOfKey(lines: readonly string[], key: string): number {
  return lines.findIndex((l) => PROPOSAL_TAIL.exec(l)?.[1] === key);
}
