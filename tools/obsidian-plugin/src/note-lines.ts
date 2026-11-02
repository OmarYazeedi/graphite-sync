/* ══ ONE WALK OVER A NOTE'S CONTENT ══════════════════════════════════════════
 *
 * Capture, the tick, the census and the proposal reader all read a note the
 * same way: never its frontmatter (a note's properties are not its content)
 * and never inside a fenced code block (a `- [ ]` in a code sample is an
 * example, not a task). Three copies of this loop had grown in three files;
 * this is the one (RU-006).
 *
 * IMPORTS NOTHING, so every pure plugin module can use it and the API's
 * jest suite can still execute them.
 */

/** The 0-based indexes of a note's CONTENT lines. */
export function bodyLines(lines: readonly string[]): number[] {
  const out: number[] = [];
  let i = 0;
  if (lines[0]?.trim() === '---') {
    const end = lines.findIndex((l, n) => n > 0 && l.trim() === '---');
    if (end > 0) i = end + 1;
  }
  let fence: string | null = null;
  for (; i < lines.length; i++) {
    const t = lines[i].trim();
    const f = /^(```|~~~)/.exec(t);
    if (f) {
      if (fence === null) fence = f[1];
      else if (t.startsWith(fence)) fence = null;
      continue;
    }
    if (fence !== null) continue;
    out.push(i);
  }
  return out;
}
