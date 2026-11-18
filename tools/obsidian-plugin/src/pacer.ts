/* ══ PACING · NEVER HOLD OBSIDIAN'S ONE THREAD ═══════════════════════════════
 *
 * Omar, 2026-11-18: "graphite plugin got the obsidian app frozen". Linking a
 * key brings in every space the key can read (0.6.1), and the first version
 * of that wrote every note of every space in one unbroken run of awaits. An
 * await on a vault write gives other CODE the thread back, never the SCREEN:
 * Obsidian draws, takes a keystroke and indexes only between macro tasks, and
 * a run of hundreds of creates is one long task as far as the window is
 * concerned - with every other plugin's `create` handler, the file explorer
 * and the metadata index all working inside it. The bigger the vault, the
 * longer the window stays dead.
 *
 * So work that touches many files is cut into slices: a Pacer is asked
 * `tick()` once per file and, once it has worked for a few milliseconds, sets
 * the thread down for a few more before going on. The numbers are small on
 * purpose - the whole of a large pull still finishes in seconds, and the
 * window answers throughout.
 *
 * THIS FILE IMPORTS NOTHING FROM OBSIDIAN, so a test can drive it with a
 * clock of its own.
 */
export interface PacerClock {
  now(): number;
  sleep(ms: number): Promise<void>;
}

/** Real time, through the window's timer so a macro task really ends. */
export const realClock: PacerClock = {
  now: () => Date.now(),
  sleep: (ms) => new Promise<void>((r) => setTimeout(r, ms)),
};

/** How long a slice of work may run, and how long the thread rests after it. */
export const WORK_MS = 8;
export const REST_MS = 20;

export class Pacer {
  private since: number;
  /** How many times the thread was set down; a test reads it. */
  rests = 0;

  constructor(
    private clock: PacerClock = realClock,
    private workMs = WORK_MS,
    private restMs = REST_MS,
  ) {
    this.since = clock.now();
  }

  /** Call between units of work (one file, one note). Rests when the slice
   *  has run long enough; otherwise returns at once. */
  async tick(): Promise<void> {
    if (this.clock.now() - this.since < this.workMs) return;
    this.rests++;
    await this.clock.sleep(this.restMs);
    this.since = this.clock.now();
  }
}
