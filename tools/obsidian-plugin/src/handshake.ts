/* ══ REGISTERS 1527 + 2519 — THE VERSION HANDSHAKE ═══════════════════════════
 *
 * Omar, 2026-10-07: "Yes — the server names the oldest plugin it accepts,
 * and an older one refuses to push, capture or approve and says "update
 * Graphite Sync"". On register 2519, the same day: "one call at startup".
 *
 * The plugin bundles the server's grammar files, so the copy inside an
 * installed plugin is only as new as the plugin. The server says, on the
 * GET /health the plugin already makes when it starts, the oldest plugin it
 * accepts (minPluginVersion). Below it, every write to Graphite stops and
 * says so. Reads carry on: a read cannot put a misread line into the data.
 *
 * WHAT IS NOT A FLOOR. A server that says nothing (older than the
 * handshake) or says something that is not a version has stated no floor,
 * and the plugin writes as it always did — the server stays the authority
 * on each write, and refusing on silence would lock every older server out
 * of every newer plugin.
 *
 * IMPORTS NOTHING, so the test suite can read it without Obsidian.
 */

/** `1.2.3` as three numbers, or null when it is not a version. A suffix
 *  (`1.2.3-beta`) is read as its numbers: a pre-release of a version is
 *  treated as that version, which errs towards letting it write. */
export function versionParts(v: unknown): [number, number, number] | null {
  if (typeof v !== 'string') return null;
  const m = /^\s*(\d+)\.(\d+)\.(\d+)/.exec(v);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

/** Is `mine` strictly older than `floor`? False whenever either cannot be
 *  read — see WHAT IS NOT A FLOOR above. */
export function isBelow(mine: unknown, floor: unknown): boolean {
  const a = versionParts(mine);
  const b = versionParts(floor);
  if (!a || !b) return false;
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] < b[i];
  }
  return false;
}

export interface Handshake {
  /** What this plugin is (its manifest). */
  mine: string;
  /** What the server accepts, or null when it stated no floor. */
  floor: string | null;
  /** True when this plugin may not write to that server. */
  outdated: boolean;
}

/** Read the floor off a /health answer. */
export function readHandshake(health: unknown, mine: string): Handshake {
  const said = (health as { minPluginVersion?: unknown } | null)?.minPluginVersion;
  const floor = versionParts(said) ? String(said).trim() : null;
  return { mine, floor, outdated: floor !== null && isBelow(mine, floor) };
}

/** The sentence a refused write says. `what` is the act, in the past
 *  tense: pushed, captured, approved, linked, sent. */
export function outdatedSentence(h: Handshake, what: string): string {
  return `Graphite: update Graphite Sync. This server accepts version ${h.floor} or newer and `
    + `this is ${h.mine}, so nothing was ${what}. Reading still works; writing waits for the update.`;
}
