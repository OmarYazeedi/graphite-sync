/* ══ WHERE THE SERIAL NUMBERS ARE, IN ONE PLACE AND WITH NO DEPENDENCIES ═══
 *
 * R-1524: "currently the markdown file shows with the serial numbering after
 * each line, we talked about the plugin streamlining this and making it
 * similar to the app as the plugin can hide this."
 *
 * R-361 built half of it. `LP_ID_RE` below catches the two INLINE shapes the
 * mirror writes — ` | lp: <id>` at the end of a list line, and an
 * `<!-- lp: <id> -->` comment — and the editor decoration and the reading
 * view both strip them.
 *
 * IT NEVER CAUGHT THE TABLES, which is most of a mirrored space. Eleven
 * module types export as a markdown table whose LAST COLUMN is headed `lp`
 * and holds the record id on every row (apps/api/src/spaces/markdown.service
 * .ts). The header says `lp`, the separator carries a matching `---`, and
 * every row ends in a 25-character cuid. None of it matched the regex, so a
 * supply list or an events table read as a wall of serial numbers in exactly
 * the file the row is about.
 *
 * THIS FILE IMPORTS NOTHING. Not `obsidian`, not `@codemirror/*` — which is
 * what lets apps/api's jest suite hold the rule against markdown the SERVER
 * actually emits, rather than against a sample somebody typed. The plugin
 * has never had a test of any kind; this is the seam that gives it one. */

/** The two inline shapes. Kept exported and unchanged from main.ts so the
 *  existing behaviour is the same function, not a second opinion about it.
 *
 *  R-1517: the list-line shape may end in a block anchor now — ` | lp: t1
 *  ^t1` — and the anchor is hidden WITH the marker. It is plumbing for a
 *  link, not something to read; Obsidian resolves `[[note#^t1]]` from the
 *  file, whatever the editor shows. */
export const LP_ID_RE = /(?: ?\| ?lp: [A-Za-z0-9]+(?: \^[A-Za-z0-9-]+)?)|(?:<!-- lp: \S+ -->)/g;

export interface LpRange {
  from: number;
  to: number;
}

/** Index of every UNESCAPED `|` in a line.
 *
 * markdown.service escapes a pipe inside a cell as `\|` — a title of
 * "soup | stew" would otherwise split the row — so a naive lastIndexOf('|')
 * finds a character that is part of somebody's text and hides the wrong half
 * of the line. */
export function pipePositions(line: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '\\') { i++; continue; }
    if (line[i] === '|') out.push(i);
  }
  return out;
}

/** True when this line is a table header whose LAST column is `lp`.
 *
 * Only the last: the importer destructures a row's cells by POSITION and
 * markdown.service's own comment says appending is the only shape an older
 * file survives, so `lp` is always last and a match anywhere else would be
 * somebody's column called lp, not the mirror's. */
export function isLpHeader(line: string): boolean {
  const pipes = pipePositions(line);
  if (pipes.length < 2) return false;
  const last = line.slice(pipes[pipes.length - 2] + 1, pipes[pipes.length - 1]);
  return last.trim() === 'lp';
}

export function isTableSeparator(line: string): boolean {
  return /^\s*\|[\s\-:|]+\|\s*$/.test(line) && line.includes('-');
}

/** The span of a row's last cell INCLUDING its closing pipe.
 *
 * Hiding the cell alone would leave `| … |  |` — an empty column, which is
 * still a column. Taking the trailing pipe with it leaves a table one column
 * narrower and still well formed, which is what "similar to the app" means
 * here: not a blanked-out box, an absent one. */
export function lastCellSpan(line: string): LpRange | null {
  const pipes = pipePositions(line);
  if (pipes.length < 2) return null;
  return { from: pipes[pipes.length - 2] + 1, to: pipes[pipes.length - 1] + 1 };
}

/** Every span of `doc` that is a Graphite serial number and nothing else.
 *
 * Absolute offsets into `doc`, sorted, non-overlapping — the order
 * RangeSetBuilder requires, said here so the caller does not have to know
 * it. A line that is not part of an `lp` table is untouched, so a table
 * somebody wrote themselves keeps every column it has. */
export function lpHiddenRanges(doc: string): LpRange[] {
  const out: LpRange[] = [];
  for (const m of doc.matchAll(LP_ID_RE)) {
    if (m.index === undefined) continue;
    out.push({ from: m.index, to: m.index + m[0].length });
  }

  const lines: Array<{ text: string; from: number }> = [];
  let at = 0;
  for (const text of doc.split('\n')) {
    lines.push({ text, from: at });
    at += text.length + 1;
  }

  for (let i = 0; i < lines.length; i++) {
    if (!isLpHeader(lines[i].text)) continue;
    // A HEADER WITHOUT A SEPARATOR IS NOT A TABLE. Without this, a single
    // line of prose containing a pipe and the word lp would take its own
    // tail off.
    if (i + 1 >= lines.length || !isTableSeparator(lines[i + 1].text)) continue;
    for (let j = i; j < lines.length; j++) {
      const line = lines[j];
      if (!/^\s*\|/.test(line.text)) break;
      const span = lastCellSpan(line.text);
      if (!span) continue;
      out.push({ from: line.from + span.from, to: line.from + span.to });
    }
  }

  out.sort((a, b) => a.from - b.from || a.to - b.to);
  const merged: LpRange[] = [];
  for (const r of out) {
    const prev = merged[merged.length - 1];
    if (prev && r.from < prev.to) { prev.to = Math.max(prev.to, r.to); continue; }
    merged.push({ ...r });
  }
  return merged;
}
