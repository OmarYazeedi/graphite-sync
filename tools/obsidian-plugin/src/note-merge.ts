/* ══ ROW 2375 · MERGING EDITS THAT DO NOT OVERLAP (R-5254) ════════════════
 *
 * Omar 2026-10-10 (requests R-5254): "keep both where it does: edits to the
 * same lines write the other version beside the note as a conflict copy and
 * say so". So where the two sides changed DIFFERENT lines of one note, both
 * edits are kept IN the note; only where they touched the same lines does
 * the conflict copy of the other version appear beside it.
 *
 * A three-way merge over lines, from the version both sides last agreed
 * (the base) to each side's version now. Pure: text in, text or nothing out.
 *
 * IT REFUSES RATHER THAN GUESSES, three ways, and each falls back to the
 * conflict copy, which loses nothing:
 *   - two changes to the same base lines that are not the same change;
 *   - two changes that TOUCH (one ends where the other begins) — they are
 *     neighbouring lines, and a merge there is where a sentence gets split;
 *   - a middle too long to diff here (MERGE_MAX_CELLS), after the lines the
 *     three share at the start and the end are set aside.
 */

import { LP_ID_RE } from './lp-ids';

/** The largest middle (base lines × side lines) diffed. Ordinary notes
 *  differ by a few lines near each other and never come near it; a note
 *  rewritten throughout on both sides gets the conflict copy instead. */
export const MERGE_MAX_CELLS = 4_000_000;

/** A run of base lines [from, to) replaced by [lines]. */
interface Hunk { from: number; to: number; lines: string[] }

/** Lines with their endings kept, so the merge writes back exactly the
 *  bytes it was given wherever nothing changed. */
export function splitLines(text: string): string[] {
  const out: string[] = [];
  let at = 0;
  for (;;) {
    const nl = text.indexOf('\n', at);
    if (nl < 0) { if (at < text.length) out.push(text.slice(at)); return out; }
    out.push(text.slice(at, nl + 1));
    at = nl + 1;
  }
}

/** The changes from [a] to [b] as hunks over [a], or null when the middle
 *  is too long to diff. Common prefix and suffix are set aside first, then
 *  a longest-common-subsequence table over what is left. */
function hunks(a: string[], b: string[]): Hunk[] | null {
  let pre = 0;
  while (pre < a.length && pre < b.length && a[pre] === b[pre]) pre++;
  let suf = 0;
  while (suf < a.length - pre && suf < b.length - pre
    && a[a.length - 1 - suf] === b[b.length - 1 - suf]) suf++;
  const A = a.slice(pre, a.length - suf);
  const B = b.slice(pre, b.length - suf);
  const n = A.length;
  const m = B.length;
  if (n === 0 && m === 0) return [];
  if ((n + 1) * (m + 1) > MERGE_MAX_CELLS) return null;
  // lcs[i][j] = longest common subsequence of A[i..] and B[j..].
  const w = m + 1;
  const lcs = new Uint32Array((n + 1) * w);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i * w + j] = A[i] === B[j]
        ? lcs[(i + 1) * w + j + 1] + 1
        : Math.max(lcs[(i + 1) * w + j], lcs[i * w + j + 1]);
    }
  }
  const out: Hunk[] = [];
  let i = 0;
  let j = 0;
  let open: Hunk | null = null;
  const close = () => { if (open) { out.push(open); open = null; } };
  while (i < n || j < m) {
    if (i < n && j < m && A[i] === B[j]) { close(); i++; j++; continue; }
    if (!open) open = { from: pre + i, to: pre + i, lines: [] };
    if (j < m && (i >= n || lcs[i * w + j + 1] >= lcs[(i + 1) * w + j])) {
      open.lines.push(B[j]); j++;
    } else {
      i++; open.to = pre + i;
    }
  }
  close();
  return out;
}

const same = (x: Hunk, y: Hunk) =>
  x.from === y.from && x.to === y.to && x.lines.length === y.lines.length
  && x.lines.every((l, k) => l === y.lines[k]);

/** Two hunks that change the same base lines, or meet. */
const touch = (x: Hunk, y: Hunk, adjacentOk: boolean) => {
  if (!adjacentOk) return x.from <= y.to && y.from <= x.to;
  // Only a shared base line is a clash. Two changes that merely meet at a
  // boundary have an order that is not a guess — except two insertions at
  // the very same point, whose order is.
  if (x.from < y.to && y.from < x.to) return true;
  return x.from === x.to && y.from === y.to && x.from === y.from;
};

export type MergeResult = { clean: true; text: string } | { clean: false };

/** Both sides' edits in one text, or { clean: false } where they cannot be
 *  kept apart (the caller writes the conflict copy).
 *
 *  `adjacent: true` keeps both when the two sides changed NEIGHBOURING lines
 *  (a line typed right under one the other side gave an id), which is the
 *  common shape of a push that meets typing and the one thing note sync
 *  deliberately refuses. Off unless asked for. */
export function mergeLines(
  base: string, ours: string, theirs: string, opts: { adjacent?: boolean } = {},
): MergeResult {
  if (ours === theirs) return { clean: true, text: ours };
  if (ours === base) return { clean: true, text: theirs };
  if (theirs === base) return { clean: true, text: ours };
  const b = splitLines(base);
  const mine = hunks(b, splitLines(ours));
  const yours = hunks(b, splitLines(theirs));
  if (!mine || !yours) return { clean: false };
  const all: Hunk[] = [];
  for (const h of mine) {
    const clash = yours.find((y) => touch(h, y, !!opts.adjacent));
    if (clash && !same(h, clash)) return { clean: false };
    all.push(h);
  }
  for (const y of yours) if (!mine.some((h) => same(h, y))) all.push(y);
  all.sort((x, y) => x.from - y.from || x.to - y.to);
  const out: string[] = [];
  let at = 0;
  for (const h of all) {
    out.push(...b.slice(at, h.from), ...h.lines);
    at = h.to;
  }
  out.push(...b.slice(at));
  return { clean: true, text: out.join('') };
}

/* ══ OMAR, 2026-11-09 (typing-on-the-line-being-pushed) ═══════════════════
 *
 * "Keep your typing but carry the server's line id onto it, so no duplicate
 * is made."
 *
 * A push sends a line the app has no id for; the server writes the note back
 * with the line's id on it. If the person typed ON that very line while the
 * request was in flight, the merge above cannot keep both (they changed the
 * same line), so the note is left as typed — and the typed line has no id, so
 * the next push made the task a second time.
 *
 * So the typed line keeps its words and takes the id the server gave the line
 * it was typed over: [pushed] is what was sent, [typed] what the note says
 * now, [canonical] what the server wrote back. Only a line the person
 * REPLACED one-for-one carries an id across, and only when the typed line has
 * no id of its own; anything less certain (a line split, joined or removed)
 * is left exactly as typed. Pure: text in, text out. */
const MARKER_ONLY = new RegExp('^(?:' + LP_ID_RE.source + ')$');
// LP_ID_RE is global: test() on it keeps a position between calls.
const HAS_ID = new RegExp(LP_ID_RE.source);
const eolOf = (line: string) => /\r?\n$/.exec(line)?.[0] ?? '';

export function carryIds(pushed: string, typed: string, canonical: string): string {
  const p = splitLines(pushed);
  const t = splitLines(typed);
  const c = splitLines(canonical);
  const typedHunks = hunks(p, t);
  const canonHunks = hunks(p, c);
  if (!typedHunks || !canonHunks) return typed;
  // The marker the server added to each pushed line: the canonical line is
  // the pushed line's words with the marker after them, nothing else changed.
  const marker = new Map<number, string>();
  for (const h of canonHunks) {
    if (h.to - h.from !== h.lines.length) continue;
    h.lines.forEach((cl, k) => {
      const was = p[h.from + k].replace(/\r?\n$/, '');
      const now = cl.replace(/\r?\n$/, '');
      if (!now.startsWith(was)) return;
      const rest = now.slice(was.length);
      if (rest && MARKER_ONLY.test(rest)) marker.set(h.from + k, rest);
    });
  }
  if (!marker.size) return typed;
  const out = [...t];
  // Hunks are over the pushed text; their replacement lines sit in the typed
  // text shifted by the lines earlier hunks added or removed.
  let shift = 0;
  for (const h of typedHunks) {
    if (h.to - h.from === h.lines.length) {
      h.lines.forEach((tl, k) => {
        const m = marker.get(h.from + k);
        if (!m || HAS_ID.test(tl)) return;
        const body = tl.replace(/\r?\n$/, '');
        out[h.from + k + shift] = body + m + eolOf(tl);
      });
    }
    shift += h.lines.length - (h.to - h.from);
  }
  return out.join('');
}
