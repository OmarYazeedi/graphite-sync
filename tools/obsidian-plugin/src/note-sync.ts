/* ══ ROW 2375 · ONE NOTE-SYNC INTERFACE, TWO TRANSPORTS ══════════════════
 *
 * Omar 2026-10-06 (requests R-4650): Graphite Sync replaces LiveSync, "but it
 * will only support the protocol and setting i use so we dontt over develop".
 * And 2026-10-07 (R-4819): "i need both couchdb server and graphite own
 * sync" — so a vault carries its notes over EITHER a CouchDB server or
 * Graphite's own sync, chosen per vault.
 *
 * The vault side is written once, against this file, and never learns which
 * transport it is talking to. The specification is
 * product_review/reports/spec_2375_graphite_sync.md.
 */

/** A vault file as note sync carries it. `content` is null for a deletion. */
export interface VaultFile {
  path: string;
  content: Uint8Array | null;
  mtime: number;
  deleted: boolean;
}

/** A file arriving from the far side, with the version it now has there. */
export interface RemoteFile extends VaultFile {
  version: string;
  /** Row 2375: other versions the far side is holding BESIDE this one — a
   *  CouchDB replication conflict, two servers that each took an edit. The
   *  far side chose `version`; these lost, and are kept here as conflict
   *  copies before the far side is told to let them go (settle). */
  others?: Array<VaultFile & { version: string }>;
}

/** A file leaving this device, with the version it was last agreed at —
 *  null for a file the far side has never had. */
export interface OutgoingFile extends VaultFile {
  base: string | null;
}

/** What the far side did with one outgoing file. A conflict means the far
 *  side moved since `base`: nothing was written, and the engine decides. */
export type PushOutcome =
  | { path: string; ok: true; version: string }
  | { path: string; ok: false; conflict: true }
  | { path: string; ok: false; conflict: false; reason: string };

export interface TransportCheck {
  ok: boolean;
  /** One sentence a person can act on. */
  detail: string;
}

export interface NoteTransport {
  readonly kind: Exclude<NoteSyncKind, 'off'>;
  /** Can this device reach the far side, signed in. */
  check(): Promise<TransportCheck>;
  /** What changed since `cursor` (null: from the beginning). */
  /** `unreadable` counts what arrived and could not be opened (sealed
   *  under another key, or damaged): said, never written into the vault. */
  pull(cursor: string | null): Promise<{ files: RemoteFile[]; cursor: string; more: boolean; unreadable?: number }>;
  push(files: OutgoingFile[]): Promise<PushOutcome[]>;
  /** Let the losing versions of [path] go, once they are kept here. */
  settle?(path: string, versions: string[]): Promise<void>;
  /** Live sync: resolves true when something new has arrived after
   *  `cursor`, false when `ms` passed with nothing. */
  wait(cursor: string | null, ms: number): Promise<boolean>;
}

/** THE TRANSPORTS A VAULT CAN CHOOSE, and only those. `graphite` (his own
 *  sync) joins this list when its server store exists: a choice that
 *  carries nothing is not offered. */
export const NOTE_SYNC_KINDS = ['off', 'couchdb'] as const;
export type NoteSyncKind = (typeof NOTE_SYNC_KINDS)[number];

export const NOTE_SYNC_LABELS: Record<NoteSyncKind, string> = {
  off: 'Off',
  couchdb: 'A CouchDB server',
};

/** The largest file that travels: his LiveSync setting, measured. A larger
 *  one is refused and said, never silently skipped. */
export const NOTE_SYNC_MAX_BYTES = 50 * 1024 * 1024;

/* WHAT TRAVELS. His LiveSync has hidden-file sync, plugin sync and peer to
 * peer all off, in every vault, so "the setting I use" is: every ordinary
 * file in the vault and nothing hidden. A path with any segment starting
 * with a dot is hidden, and that one rule takes in .obsidian (settings and
 * plugins, so plugin sync is out by construction), .trash and every
 * dot-file. */
export function inNoteSyncScope(path: string): boolean {
  if (!path || path.startsWith('/')) return false;
  const parts = path.split('/');
  return parts.every((p) => p.length > 0 && !p.startsWith('.'));
}
