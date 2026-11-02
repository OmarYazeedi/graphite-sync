/* ══ REGISTER 2519 — LINKS IN OBSIDIAN: THE PANEL AND THE PICKER ═════════════
 *
 * Omar, 2026-10-07: "i want most or all the work to be done by the plugin on
 * device not to overload the server ehich option is best , and will it make
 * the plugin and obsidian feel slow or sluggish" — filed as his ruling, read
 * as ROUTE B (the links panel and the role-first picker, on the plugin as it
 * stands, no server change), PLUS THE GRAMMAR BUNDLED, PLUS THE HANDSHAKE.
 *
 * THE ROLE HALF IS COMPUTED HERE. link-grammar.ts is the server's own file,
 * bundled, so "which types may this record take" is answered on the device,
 * instantly and offline. Only the targets (which real records a chosen type
 * can reach) and the write go to the server.
 *
 * THE PANEL IS THE ONE PLACE THIS COULD MAKE OBSIDIAN SLOW, so the ruling
 * names four conditions and LinkLogFeed below is all four:
 *   1. it asks for a link log ONLY while the panel is open;
 *   2. DEBOUNCED on cursor movement — a cursor that keeps moving asks
 *      nothing, and typing is a cursor that keeps moving;
 *   3. an answer still in flight when the cursor has moved on is CANCELLED:
 *      it is dropped, never drawn and never cached (Obsidian's requestUrl
 *      cannot abort a socket, so the cancel is of the answer, not the wire);
 *   4. CACHED per record for the session, and NEVER BLOCKING TYPING — the
 *      cursor hook only resets a timer, a cached log is drawn at once and
 *      refreshed behind it.
 *
 * WHICH LINES ARE RECORDS. A line is a record when it carries the record
 * marker (` | lp: <id>`). Its KIND is not on the line, so it is read from
 * where the line sits, and only where that is certain:
 *   · a note the plugin does not sync — the line was CAPTURED, and capture
 *     makes a task of a task line and a note of any other line;
 *   · a synced MODULE note (the folder layout) of a type that writes its
 *     records as list lines — vault-anchor's ANCHORED_IN, the server's own
 *     list of them, read backwards from the note's `module:` property.
 * Anything else — a table row, a one-file package, an index note — is said
 * to be out of reach rather than guessed at. The note-per-entry mirror
 * (register 2518) makes every record addressable when it lands.
 *
 * IMPORTS ONLY THE SERVER'S GRAMMARS and the plugin's own note walk, so the
 * test suite can drive it without Obsidian.
 */

import { ANCHORED_IN, LP_TAIL, PROPOSAL_TAIL } from '../../../apps/api/src/spaces/vault-anchor';
import { taskBox } from '../../../apps/api/src/spaces/vault-tick';
import { LINK_GRAMMAR, rolesFor } from '../../../apps/api/src/spaces/link-grammar';
import { bodyLines } from './note-lines';

/** One record a line stands for. `words` is the line as a person reads it. */
export interface RecordRef { kind: string; id: string; words: string }

/** Where the cursor is: on a record, or not — and then why not. */
export type Spot = { rec: RecordRef } | { none: string };

/** How a line sits in the vault, as far as the plugin knows. */
export interface LinePlace {
  /** Synced by this plugin. Absent for any other note. */
  synced?: { role?: 'index' | 'module' };
}

/** Said when the cursor is on nothing the panel can address. */
export const NOT_A_RECORD = 'Put the cursor on a line Graphite knows: a captured line, or a line of a synced module note.';
export const OUT_OF_REACH = 'This line is a record, but not one this panel can reach yet. Table rows and one-file packages are not addressable by line.';

/** The record kind each list-line module type writes, read backwards off
 *  the server table. Never a second table. */
const LIST_LINE_KIND: Record<string, string> = Object.fromEntries(
  Object.entries(ANCHORED_IN).map(([kind, type]) => [type, kind]),
);

/** The module type a synced module note declares in its properties. */
export function noteModuleType(lines: readonly string[]): string | null {
  if (lines[0]?.trim() !== '---') return null;
  for (let i = 1; i < Math.min(lines.length, 60); i++) {
    const t = lines[i].trim();
    if (t === '---') return null;
    const m = /^module:\s*([A-Za-z_]+)\s*$/.exec(t);
    if (m) return m[1].toUpperCase();
  }
  return null;
}

/** The line as a person reads it: no bullet, no box, no marker. */
export function lineWords(line: string): string {
  return line.replace(LP_TAIL, '').replace(/^\s*[-*+]\s+(\[.\]\s*)?/, '').trim();
}

/** Which record the line at `at` stands for, if the plugin can tell. */
export function recordAt(lines: readonly string[], at: number, place: LinePlace): Spot {
  const line = lines[at];
  if (line === undefined || PROPOSAL_TAIL.test(line)) return { none: NOT_A_RECORD };
  const m = LP_TAIL.exec(line);
  // A synced table row carries its id in a column, not a marker: it IS a
  // record, just not one a line can address, and is said to be.
  if (!m && place.synced && /^\s*\|/.test(line)) return { none: OUT_OF_REACH };
  if (!m || !bodyLines(lines).includes(at)) return { none: NOT_A_RECORD };
  const id = m[1];
  const words = lineWords(line);
  if (!place.synced) {
    // CAPTURED. The server made a task of a task line and a note of any
    // other line (mirror.service captureLines) — the same box reader.
    return { rec: { kind: taskBox(line) ? 'tasks' : 'notes', id, words } };
  }
  if (place.synced.role !== 'module') return { none: OUT_OF_REACH };
  const type = noteModuleType(lines);
  const kind = type ? LIST_LINE_KIND[type] : undefined;
  if (!kind || !/^\s*[-*+]\s/.test(line)) return { none: OUT_OF_REACH };
  return { rec: { kind, id, words } };
}

export const recordKey = (r: RecordRef) => `${r.kind}:${r.id}`;

/* ── the link log, as the server answers it ──────────────────────────────
 * GET /records/:kind/:id/links is GROUPED BY THE MODULE at the other end —
 * `{ total, modules: [{ moduleId, spaceId, kind, name, type, links: [...] }] }`
 * (links.service linkLog). A reader written against a flat list draws
 * nothing from the real answer, which has happened once already; so the
 * shape is checked, and an answer of any other shape is an error, never an
 * empty log. */

export interface LinkEnd { kind: string; id: string; label: string; binned?: boolean }
export interface LinkEntry { id: string; role: string; dir: 'in' | 'out'; via: string; other: LinkEnd }
export interface LinkGroup {
  moduleId: string | null; spaceId: string | null; kind: string | null;
  name: string | null; type: string | null; links: LinkEntry[];
}
export interface LinkLog { total: number; modules: LinkGroup[] }

export function readLinkLog(json: unknown): LinkLog | null {
  const j = json as { total?: unknown; modules?: unknown } | null;
  if (!j || typeof j !== 'object' || Array.isArray(j) || !Array.isArray(j.modules)) return null;
  const modules: LinkGroup[] = [];
  for (const g of j.modules as any[]) {
    if (!g || !Array.isArray(g.links)) return null;
    modules.push({
      moduleId: g.moduleId ?? null, spaceId: g.spaceId ?? null, kind: g.kind ?? null,
      name: g.name ?? null, type: g.type ?? null,
      links: (g.links as any[]).filter((l) => l && l.other).map((l) => ({
        id: String(l.id), role: String(l.role), dir: l.dir === 'in' ? 'in' : 'out',
        via: String(l.via ?? 'link'),
        other: {
          kind: String(l.other.kind), id: String(l.other.id),
          label: String(l.other.label ?? l.other.id), binned: l.other.binned === true,
        },
      })),
    });
  }
  return { total: typeof j.total === 'number' ? j.total : modules.reduce((n, g) => n + g.links.length, 0), modules };
}

/** One link, as a sentence about the record under the cursor. */
export function linkSentence(l: LinkEntry): string {
  const label = LINK_GRAMMAR[l.role]?.label ?? l.role;
  const other = l.other.binned ? `${l.other.label} (in the Bin)` : l.other.label;
  // Out: this record is the near end. In: the other record drew the link.
  return l.dir === 'out' ? `${label}: ${other}` : `${other}, ${label.toLowerCase()} this`;
}

/* ── the picker's first step: computed here, no server ─────────────────── */

export interface RoleChoice { role: string; label: string }

/** The types a person may pick from a record of this kind — the server's
 *  own table, bundled. Unoffered roles (the plan's, the joins) never show. */
export function pickerRoles(kind: string): RoleChoice[] {
  return rolesFor(kind).map((g) => ({ role: g.role, label: g.label }));
}

/** One place a chosen type can reach, as GET link-targets lists it. */
export interface TargetGroup {
  kind: string; label: string; moduleId: string | null; moduleName: string | null;
  spaceName: string | null; records?: { id: string; label: string }[];
}

export function readTargets(json: unknown): TargetGroup[] | null {
  const g = (json as { groups?: unknown } | null)?.groups;
  if (!Array.isArray(g)) return null;
  return g.filter((x) => x && typeof x.kind === 'string').map((x) => ({
    kind: x.kind, label: String(x.label ?? x.kind), moduleId: x.moduleId ?? null,
    moduleName: x.moduleName ?? null, spaceName: x.spaceName ?? null,
    ...(Array.isArray(x.records) ? { records: x.records.map((r: any) => ({ id: String(r.id), label: String(r.label ?? r.id) })) } : {}),
  }));
}

/** A record list route answers a bare array (wire v1) or a page (v2). */
export function readRows(json: unknown): { id: string; label: string }[] | null {
  const rows = Array.isArray(json) ? json
    : Array.isArray((json as { items?: unknown } | null)?.items) ? (json as { items: unknown[] }).items : null;
  if (!rows) return null;
  return (rows as any[]).filter((r) => r && r.id != null).map((r) => ({
    id: String(r.id),
    label: String(r.title ?? r.name ?? r.label ?? r.question ?? r.key ?? r.id),
  }));
}

/* ── THE FOUR CONDITIONS ────────────────────────────────────────────────── */

export interface FeedClock {
  debounceMs: number;
  /** A cached log younger than this is drawn and not asked again. */
  freshMs: number;
  now: () => number;
  setTimeout: (fn: () => void, ms: number) => unknown;
  clearTimeout: (t: unknown) => void;
}

export interface FeedState {
  spot: Spot | null;
  log: LinkLog | null;
  /** A cached log is on screen and a fresher one has been asked for. */
  refreshing: boolean;
  /** Nothing to show yet and an answer is on its way. */
  loading: boolean;
  error: string | null;
}

export class LinkLogFeed {
  private open = false;
  private spot: Spot | null = null;
  private cache = new Map<string, { log: LinkLog; at: number }>();
  private timer: unknown = null;
  /** The in-flight ask. A newer ask, the panel closing, or the cursor
   *  leaving the record replaces it, and the old answer is then dropped. */
  private ticket = 0;
  private inFlight: string | null = null;
  private error: string | null = null;
  private pendingWhere: (() => Spot) | null = null;

  constructor(
    private fetchLog: (r: RecordRef) => Promise<LinkLog>,
    private changed: () => void,
    private clock: FeedClock,
  ) {}

  get isOpen() { return this.open; }

  setOpen(on: boolean) {
    this.open = on;
    if (!on) {
      if (this.timer !== null) this.clock.clearTimeout(this.timer);
      this.timer = null;
      this.pendingWhere = null;
      this.cancel();
    }
  }

  /** THE CURSOR HOOK. Synchronous, and it does nothing but reset a timer:
   *  `where` is not even called until the cursor has been still for the
   *  debounce, so a keystroke costs a clearTimeout and a setTimeout. */
  moved(where: () => Spot): void {
    if (!this.open) return;
    this.pendingWhere = where;
    if (this.timer !== null) this.clock.clearTimeout(this.timer);
    this.timer = this.clock.setTimeout(() => {
      this.timer = null;
      const w = this.pendingWhere;
      this.pendingWhere = null;
      if (w && this.open) this.settle(w());
    }, this.clock.debounceMs);
  }

  /** After a link is written: that record's log is out of date. */
  invalidate(r: RecordRef) {
    this.cache.delete(recordKey(r));
    const s = this.spot;
    if (this.open && s && 'rec' in s && recordKey(s.rec) === recordKey(r)) this.ask(r);
  }

  state(): FeedState {
    const s = this.spot;
    const key = s && 'rec' in s ? recordKey(s.rec) : null;
    const hit = key ? this.cache.get(key) : undefined;
    return {
      spot: s,
      log: hit?.log ?? null,
      refreshing: !!hit && this.inFlight === key,
      loading: !hit && key !== null && this.inFlight === key,
      // With a cached log on screen, an error is "could not refresh" and the
      // stale log stays up; without one, it is all there is to say.
      error: key ? this.error : null,
    };
  }

  private cancel() {
    this.ticket++;
    this.inFlight = null;
  }

  private settle(spot: Spot) {
    if (!('rec' in spot)) {
      this.spot = spot;
      this.cancel();
      this.changed();
      return;
    }
    const key = recordKey(spot.rec);
    const was = this.spot && 'rec' in this.spot ? recordKey(this.spot.rec) : null;
    this.spot = spot;
    if (key !== was) this.error = null;
    if (this.inFlight === key) { this.changed(); return; }
    const hit = this.cache.get(key);
    if (hit && this.clock.now() - hit.at < this.clock.freshMs) {
      this.cancel();
      this.changed();
      return;
    }
    this.ask(spot.rec);
  }

  private ask(r: RecordRef) {
    const key = recordKey(r);
    const mine = ++this.ticket;
    this.inFlight = key;
    this.error = null;
    this.changed(); // the stale log, or "reading", goes up at once
    this.fetchLog(r).then((log) => {
      if (mine !== this.ticket) return; // cancelled: never drawn, never kept
      this.inFlight = null;
      this.cache.set(key, { log, at: this.clock.now() });
      this.changed();
    }, (e: unknown) => {
      if (mine !== this.ticket) return;
      this.inFlight = null;
      this.error = e instanceof Error ? e.message : String(e);
      this.changed();
    });
  }
}
