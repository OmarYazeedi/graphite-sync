/* ══ THE GRAPHITE BAR · WRITING THE LINE GRAMMAR ONTO A LINE ═══════════════
 *
 * Omar, 2026-11-07, on the canvas "Task board and Obsidian toolbar": "the full
 * set is approved". The bar's buttons write the grammar the capture door
 * already reads (vault-suffix.ts) onto the line under the cursor, so a note
 * means the same thing whether the line was typed with a pen on a tablet or
 * picked with a mouse: the words, then `| key: value` fields, then — once it
 * is captured — the `| lp:` marker, which these functions never move or edit.
 *
 * A PICKER WRITES TEXT, NOT STATE. Nothing is held in the plugin about a line;
 * the line is the whole record until the next capture reads it.
 *
 * PURE: no `obsidian`, no editor. The plugin's suite drives it through the
 * bundle.
 */

import { BuiltInPriority, DEFAULT_PRIORITY_NAMES } from '../../../apps/api/src/shared/task-vocabulary';

/** A checkbox line, the shape taskBox reads on the server. */
const TASK_LINE = /^(\s*)[-*]\s+\[([ xX-])\]\s?(.*)$/;
/** A plain bullet or numbered line, which a task may be made from. */
const BULLET = /^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/;
/** Split a line into its words and its `|` parts. An escaped pipe is words. */
const PIPE = /(?<!\\)\|/;
/** The marker a captured line carries (its block anchor rides inside it). */
const MARKER_PART = /^(?:lp|gr)\s*:/i;

export const PRIORITIES = ['low', 'normal', 'high', 'critical'] as const;
export type Priority = (typeof PRIORITIES)[number];

/** A row of the Priority picker: what it shows, what it writes, a hint. */
export interface PriorityChoice { label: string; value: string; hint?: string }

/** The rows of the Priority picker. With no words of the module's own, the
 *  four built-in levels; with them, the module's list in its order — each
 *  written as its name, which the capture door reads against that module's
 *  words before the built-ins. A custom word says what it counts as. A name
 *  with a bar in it is written escaped, so it stays one word on the line. */
export function priorityChoices(
  words?: { priorities: { name: string; countsAs: string }[] } | null,
): PriorityChoice[] {
  const list = words?.priorities ?? [];
  if (!list.length) {
    return PRIORITIES.map((p) => ({
      label: p[0].toUpperCase() + p.slice(1), value: p, hint: p === 'normal' ? 'default' : undefined,
    }));
  }
  return list.map((w) => {
    const builtIn = DEFAULT_PRIORITY_NAMES[w.countsAs as BuiltInPriority] ?? w.countsAs;
    const same = w.name.toLowerCase() === builtIn.toLowerCase();
    return {
      label: w.name,
      value: w.name.replace(/\|/g, '\\|'),
      hint: same ? (w.countsAs === 'NORMAL' ? 'default' : undefined) : `counts as ${builtIn}`,
    };
  });
}

export function isTaskLine(line: string): boolean {
  return TASK_LINE.test(line);
}

/** Is this line already a record in Graphite? Its fields are read from the
 *  app now; a picker would write onto a line the next capture skips. */
export function isCaptured(line: string): boolean {
  return line.split(PIPE).slice(1).some((p) => MARKER_PART.test(p.trim()));
}

/** The line a Task press leaves the cursor on. A blank line becomes an open
 *  task; a bullet or a sentence becomes one with its words kept; a task is
 *  left as it is (the caller starts a new line below it instead). */
export function asTaskLine(line: string): string {
  if (TASK_LINE.test(line)) return line;
  const bullet = BULLET.exec(line);
  if (bullet) return `${bullet[1]}- [ ] ${bullet[2]}`;
  const indent = /^\s*/.exec(line)![0];
  return `${indent}- [ ] ${line.slice(indent.length)}`;
}

/** A new task line below [line], at the same indentation. */
export function nextTaskLine(line: string): string {
  return `${/^\s*/.exec(line)![0]}- [ ] `;
}

interface Parts { words: string; fields: string[] }

function partsOf(line: string): Parts {
  const [first, ...rest] = line.split(PIPE);
  return { words: first.replace(/\s+$/, ''), fields: rest.map((p) => p.trim()).filter(Boolean) };
}

const join = ({ words, fields }: Parts): string => [words, ...fields].join(' | ');

const keyOf = (part: string): string | null =>
  /^([A-Za-z][A-Za-z0-9_-]*)\s*:/.exec(part)?.[1].toLowerCase() ?? null;

/** The value a line carries for [key], or null. The first one wins, as the
 *  grammar reads it. */
export function readField(line: string, key: string): string | null {
  for (const part of partsOf(line).fields) {
    if (keyOf(part) === key.toLowerCase()) return part.slice(part.indexOf(':') + 1).trim();
  }
  return null;
}

/** Put `| key: value` on a line. A field the line already has is replaced in
 *  place; a new one goes after the others and before the `| lp:` marker. The
 *  words, the tags and every other part are left exactly as written. */
export function setField(line: string, key: string, value: string): string {
  const parts = partsOf(line);
  const k = key.toLowerCase();
  const at = parts.fields.findIndex((p) => keyOf(p) === k);
  const next = `${key}: ${value}`;
  if (at >= 0) parts.fields[at] = next;
  else {
    const marker = parts.fields.findIndex((p) => MARKER_PART.test(p));
    parts.fields.splice(marker < 0 ? parts.fields.length : marker, 0, next);
  }
  return join(parts);
}

/** A tag as the grammar spells it: no `#`, no blanks, letters, digits, `_`,
 *  `-` and `/`. Null for a word that has nothing a tag could be (`#12` is an
 *  order number, vault-tags.ts). */
export function cleanTag(raw: string): string | null {
  const t = raw.trim().replace(/^#+/, '').replace(/\s+/g, '-').replace(/[^\p{L}\p{N}_/-]/gu, '');
  return /[\p{L}_/-]/u.test(t) ? t : null;
}

/** Add `#tag` at the end of the line's words, before any field. A line that
 *  already carries the tag (any case) is returned as it was. */
export function addTag(line: string, tag: string): string {
  const t = cleanTag(tag);
  if (!t) return line;
  const parts = partsOf(line);
  const have = parts.words.match(/(?:^|\s)#[\p{L}\p{N}_/-]+/gu) ?? [];
  if (have.some((h) => h.trim().slice(1).toLowerCase() === t.toLowerCase())) return line;
  parts.words = `${parts.words} #${t}`;
  return join(parts);
}

/** The heading and first line a "Start a list" writes. */
export function listStart(words: string, token: string, kind: 'tasks' | 'notes'): string[] {
  const heading = words.trim() || 'Actions';
  return [`## ${heading} ${token}`, kind === 'tasks' ? '- [ ] ' : '- '];
}

/** Insert [block] at [line]: over a blank line, else below the line with one
 *  blank line between. Returns the new lines and the cursor, which sits at the
 *  end of the block's last line. */
export function insertBlock(
  lines: readonly string[], line: number, block: readonly string[],
): { lines: string[]; cursor: { line: number; ch: number } } {
  const out = [...lines];
  let at = line;
  if (!(out[line] ?? '').trim()) out.splice(line, 1, ...block);
  else {
    out.splice(line + 1, 0, '', ...block);
    at = line + 2;
  }
  return {
    lines: out,
    cursor: { line: at + block.length - 1, ch: block[block.length - 1].length },
  };
}
