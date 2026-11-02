/* ══ OC6 — A CAPTURED LINE'S CHECKBOX AND ITS RECORD MOVE TOGETHER ═════════
 *
 * Omar 2026-09-24, on what ticking a captured line should do: "Both ways".
 * A to-do list or a list of pending items lives for weeks. Ticking a
 * captured line closes its record, and finishing the record in the app —
 * or somebody sharing the space finishing it — ticks the line.
 *
 * STATUS ONLY. The checkbox is two-way and nothing else is: never the
 * words, never a field. And the line is found by its hidden id (the
 * ` | lp: <id>` marker, vault-anchor.ts), never by its line number, so
 * rewriting or moving the line does not break the link.
 *
 * THE MERGE IS THREE-WAY, against the last status both sides agreed on,
 * which the plugin keeps per record. Whichever side moved since then wins,
 * and for done versus not-done the two sides cannot disagree: if both moved
 * since the agreement they moved the same way. The one real clash needs a
 * third state — a line he ticked for a record somebody else CANCELLED in a
 * shared space — and there the app wins and the scan says so. A cancelled
 * record renders as `- [-]`, the common Obsidian convention.
 *
 * THIS FILE IMPORTS ONLY THE MARKER GRAMMAR, so the plugin bundles it the
 * way it bundles vault-anchor.ts rather than keeping a second copy of what
 * a tick is. vault-tick.spec holds the import list to that.
 */

import { LP_TAIL } from './vault-anchor';

/** The three states a box can show. `cancelled` is the app's to set. */
export type TickState = 'open' | 'done' | 'cancelled';

/** A task line's box: the bullet and indent, the mark, and the rest. */
const TICK_BOX = /^(\s*[-*]\s+\[)( |x|X|-)(\].*)$/;

/** What a mark in the box means. */
function stateOfMark(mark: string): TickState {
  if (mark === '-') return 'cancelled';
  return mark === ' ' ? 'open' : 'done';
}

const MARK: Record<TickState, string> = { open: ' ', done: 'x', cancelled: '-' };

/** Any task line's box and the words after it — the ONE reading of the box
 *  that capture (vault-capture.ts) and the tick share, so a mark the tick
 *  writes is a mark capture reads. Null for a line that is not a task. */
export function taskBox(line: string): { state: TickState; rest: string } | null {
  const box = TICK_BOX.exec(line);
  if (!box) return null;
  return { state: stateOfMark(box[2]), rest: box[3].slice(1).replace(/^\s+/, '') };
}

/** A line whose box is two-way: a task line carrying a hidden id. Null for
 *  every other line, including a task line nobody captured — it has no
 *  record to agree with. */
export function tickOf(line: string): { id: string; state: TickState } | null {
  const box = TICK_BOX.exec(line);
  if (!box) return null;
  const marker = LP_TAIL.exec(line);
  if (!marker) return null;
  return { id: marker[1], state: stateOfMark(box[2]) };
}

/** The same line with its box showing `state`. Every other character is
 *  kept, so the write into his note is the box and nothing else. */
export function withTick(line: string, state: TickState): string {
  const box = TICK_BOX.exec(line);
  if (!box) return line;
  return `${box[1]}${MARK[state]}${box[3]}`;
}

/** A task record's status, as a box shows it. IN_PROGRESS is not done, so
 *  it is an empty box — the same reading the exporter gives it. */
export function tickOfStatus(status: string): TickState {
  if (status === 'DONE') return 'done';
  if (status === 'CANCELLED') return 'cancelled';
  return 'open';
}

/** The status a box asks the record to take. Null for a dash: a vault may
 *  close or reopen a record, and nothing in the ruling lets it cancel one. */
export function statusForTick(state: TickState): 'DONE' | 'PENDING' | null {
  if (state === 'done') return 'DONE';
  if (state === 'open') return 'PENDING';
  return null;
}

/** What one record's merge decides.
 *
 *  `agreed`  the status both sides hold once the writes are made — the
 *            plugin's next base. After a write to the server, the server's
 *            answer replaces it (a recurring task rolls and stays open).
 *  `line`    write this into the note's box.
 *  `server`  write this to the record.
 *  `clash`   the app overrode a change made in the vault — said, not
 *            swallowed. */
export interface TickMerge {
  agreed: TickState;
  line?: TickState;
  server?: TickState;
  clash?: true;
}

/**
 * The three-way merge. `base` is the last status both sides agreed on, or
 * undefined for a line stamped before anybody remembered one.
 */
export function mergeTick(
  base: TickState | undefined,
  local: TickState,
  remote: TickState,
): TickMerge {
  if (local === remote) return { agreed: local };

  // A DASH ON EITHER SIDE IS THE APP'S. A cancelled record is written into
  // the line whatever the line says, and a dash typed in the vault is put
  // back to the record's state, because nothing lets a note cancel. It is
  // a clash only when the vault had moved: a line nobody touched following
  // the app is the ordinary direction, not an override.
  if (remote === 'cancelled' || local === 'cancelled') {
    const vaultMoved = base === undefined ? local !== 'open' : local !== base;
    return vaultMoved
      ? { agreed: remote, line: remote, clash: true }
      : { agreed: remote, line: remote };
  }

  // Done versus not-done from here on.
  if (base === local) return { agreed: remote, line: remote };
  if (base === remote) return { agreed: local, server: local };

  // NO AGREEMENT YET. The line was stamped with the record's status when
  // it was captured, so a disagreement means one side finished it since.
  // Reopening is the rarer act; the finish is honoured where it happened.
  if (base === undefined) {
    return local === 'done'
      ? { agreed: 'done', server: 'done' }
      : { agreed: 'done', line: 'done' };
  }

  // Both moved off a cancelled record and disagree. The app wins, as it
  // does in the clash the ruling names.
  return { agreed: remote, line: remote, clash: true };
}
