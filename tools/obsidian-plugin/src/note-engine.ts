/* ══ ROW 2375 · THE ENGINE: THE VAULT ON ONE SIDE, A TRANSPORT ON THE OTHER
 *
 * Written once, over note-sync.ts, so it never learns whether the far side
 * is a CouchDB server or Graphite own sync (R-4819). One run is: take what
 * arrived, then send what changed here; and if a send found the far side had
 * moved, take again and send again, once.
 *
 * THE RULES IT HOLDS, each from his settings or his words:
 *   - only what inNoteSyncScope allows travels (no dot-files, no .obsidian);
 *   - a file over 50 MB is refused and said, never sent (his LiveSync
 *     setting, measured);
 *   - a deletion from another device moves the file to the vault trash,
 *     never deletes it (his trashInsteadDelete);
 *   - BOTH SIDES CHANGED ONE FILE (R-5254, 2026-10-10: "keep both where it
 *     does: edits to the same lines write the other version beside the note
 *     as a conflict copy and say so"): where the two sides changed
 *     DIFFERENT lines of a note, both edits are kept in it (note-merge.ts)
 *     and it is said; where they touched the same lines — or the version
 *     both last agreed is not here to merge from — the other version is
 *     written beside the file as a conflict copy, this version goes up, and
 *     it is said.
 *
 * WHAT IT REMEMBERS (NoteSyncState, kept in the plugin data, never in the
 * settings note): the cursor, and per path the version and the SHA-256 of
 * the bytes last agreed with the far side. A file whose bytes still hash to
 * that is unchanged here; anything else changed. And, for a note, the TEXT
 * last agreed (the merge's base) in a NoteBaseStore kept beside the plugin,
 * outside the vault and outside anything note sync carries.
 */

import { sha256Hex } from './note-crypto';
import { mergeLines } from './note-merge';
import {
  NOTE_SYNC_MAX_BYTES, inNoteSyncScope, type NoteTransport, type OutgoingFile, type RemoteFile,
} from './note-sync';

/** The vault as the engine sees it. main.ts gives it Obsidian; the tests
 *  give it the harness vault through the same adapter. */
export interface NoteVault {
  list(): Promise<Array<{ path: string; mtime: number; size: number }>>;
  read(path: string): Promise<Uint8Array | null>;
  write(path: string, content: Uint8Array, mtime: number): Promise<void>;
  /** Into the vault trash, never gone. */
  trash(path: string): Promise<void>;
  /** The file at `from` now lives at `to`, bytes untouched. Optional: a
   *  vault without it takes a move as a deletion and a new file. */
  rename?(from: string, to: string): Promise<void>;
}

/** The text last agreed per note — what a merge starts from. main.ts keeps
 *  it in the plugin's own folder; the tests in memory. Absent, every
 *  both-sides change keeps both, as before. */
export interface NoteBaseStore {
  get(path: string): Promise<Uint8Array | null>;
  put(path: string, content: Uint8Array): Promise<void>;
  drop(path: string): Promise<void>;
}

/** A note is text a person writes line by line: only those are merged. An
 *  attachment that changed on both sides always keeps both. */
export const mergeable = (path: string) => /\.(md|txt)$/i.test(path);

const utf8 = (bytes: Uint8Array): string | null => {
  try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { return null; }
};

export interface SyncedRecord {
  version: string;
  /** SHA-256 of the bytes last agreed; empty for a file agreed deleted. */
  hash: string;
}

export interface NoteSyncState {
  /** Which far side this state is about. A different one starts afresh. */
  target: string;
  cursor: string | null;
  files: Record<string, SyncedRecord>;
}

export const emptyNoteSyncState = (target = ''): NoteSyncState => ({ target, cursor: null, files: {} });

export interface NoteSyncReport {
  received: string[];
  sent: string[];
  trashed: string[];
  conflicts: Array<{ path: string; copy: string }>;
  /** Renamed on another device: moved here as one move, not a trashed file
   *  and a new one. */
  moved: Array<{ from: string; to: string }>;
  /** Changed on both sides in different places: both edits kept in it. */
  merged: string[];
  /** Edited here and deleted there (or the reverse): the edit is kept. */
  kept: string[];
  refused: Array<{ path: string; reason: string }>;
  unreadable: number;
}

const ZERO = (): NoteSyncReport => ({ received: [], sent: [], trashed: [], conflicts: [], moved: [], merged: [], kept: [], refused: [], unreadable: 0 });

const pad = (n: number) => String(n).padStart(2, '0');

/** Beside the file, named so a person sees what it is and when:
 *  "Plans (conflict 2026-10-11 1432).md". */
export function conflictCopyPath(path: string, at: Date, taken: (p: string) => boolean): string {
  const slash = path.lastIndexOf('/');
  const dir = path.slice(0, slash + 1);
  const name = path.slice(slash + 1);
  const dot = name.lastIndexOf('.');
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : '';
  const stamp = `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())} ${pad(at.getHours())}${pad(at.getMinutes())}`;
  for (let n = 1; ; n++) {
    const p = `${dir}${stem} (conflict ${stamp}${n > 1 ? ` ${n}` : ''})${ext}`;
    if (!taken(p)) return p;
  }
}

export class NoteSyncEngine {
  private report = ZERO();

  constructor(
    private transport: NoteTransport,
    private vault: NoteVault,
    readonly state: NoteSyncState,
    private now: () => Date = () => new Date(),
    private bases: NoteBaseStore | null = null,
  ) {}

  /** The base a later merge starts from: the bytes just agreed, for a note;
   *  nothing for a deletion or an attachment. */
  private async keepBase(path: string, content: Uint8Array | null) {
    if (!this.bases || !mergeable(path)) return;
    if (content) await this.bases.put(path, content);
    else await this.bases.drop(path);
  }

  async run(): Promise<NoteSyncReport> {
    this.report = ZERO();
    await this.receiveAll();
    const moved = await this.sendChanged();
    if (moved) {
      await this.receiveAll();
      await this.sendChanged();
    }
    return this.report;
  }

  private async receiveAll() {
    for (;;) {
      const page = await this.transport.pull(this.state.cursor);
      this.report.unreadable += page.unreadable ?? 0;
      const taken = await this.receiveMoves(page.files);
      for (const f of page.files) {
        if (!taken.has(f)) await this.receive(f);
        if (f.others?.length) await this.keepOthers(f);
      }
      this.state.cursor = page.cursor;
      if (!page.more) break;
    }
  }

  /**
   * RENAMES AS ONE MOVE (row 2375). A rename on another device arrives as
   * two documents — the old path's tombstone and the new path's file, with
   * the same bytes — because a document's id is the HMAC of its path. Taken
   * one at a time they trash the note here and write a copy of it, so the
   * vault trash fills with every note ever renamed and anything that pointed
   * at the old file in this vault's own state is lost. Here a pair is moved
   * instead, when it can only be a move: the old file is unchanged here
   * since it was agreed, the new path is empty here and was never agreed,
   * and the arriving bytes are exactly the old file's.
   *
   * WITHIN ONE PAGE OF THE CHANGES FEED. A device sends both halves in one
   * push, so they arrive together; a pair split across two pages (a vault
   * renaming more than a page of files at once) is taken the old way, a
   * trash and a new file, and nothing is lost either way.
   */
  private async receiveMoves(files: RemoteFile[]): Promise<Set<RemoteFile>> {
    const taken = new Set<RemoteFile>();
    if (!this.vault.rename) return taken;
    const arrivals = new Map<string, RemoteFile[]>();
    for (const f of files) {
      if (f.deleted || !f.content || !inNoteSyncScope(f.path)) continue;
      const rec = this.state.files[f.path];
      if ((rec && rec.hash !== '') || (await this.vault.read(f.path))) continue;
      const h = await sha256Hex(f.content);
      arrivals.set(h, [...(arrivals.get(h) ?? []), f]);
    }
    if (!arrivals.size) return taken;
    for (const gone of files) {
      if (!gone.deleted || !inNoteSyncScope(gone.path)) continue;
      const rec = this.state.files[gone.path];
      if (!rec || rec.hash === '' || rec.version === gone.version) continue;
      const local = await this.vault.read(gone.path);
      if (!local || (await sha256Hex(local)) !== rec.hash) continue;
      const to = arrivals.get(rec.hash)?.shift();
      if (!to) continue;
      await this.vault.rename(gone.path, to.path);
      this.state.files[gone.path] = { version: gone.version, hash: '' };
      this.state.files[to.path] = { version: to.version, hash: rec.hash };
      await this.keepBase(gone.path, null);
      await this.keepBase(to.path, to.content);
      this.report.moved.push({ from: gone.path, to: to.path });
      taken.add(gone).add(to);
    }
    return taken;
  }

  private async receive(remote: RemoteFile) {
    const path = remote.path;
    // A path the scope rule keeps out is never written, whatever arrives.
    if (!inNoteSyncScope(path)) return;
    const rec = this.state.files[path];
    if (rec && rec.version === remote.version) return; // our own write, coming back
    const local = await this.vault.read(path);
    const localHash = local ? await sha256Hex(local) : '';
    const remoteHash = remote.deleted || !remote.content ? '' : await sha256Hex(remote.content);
    const agree = (hash: string) => { this.state.files[path] = { version: remote.version, hash }; };

    if (localHash === remoteHash) {
      agree(remoteHash);
      await this.keepBase(path, remote.deleted ? null : remote.content ?? null);
      return;
    }
    const changedHere = rec ? localHash !== rec.hash : local !== null;
    if (!changedHere) {
      if (remote.deleted) {
        if (local) { await this.vault.trash(path); this.report.trashed.push(path); }
      } else {
        await this.vault.write(path, remote.content!, remote.mtime);
        this.report.received.push(path);
      }
      agree(remoteHash);
      await this.keepBase(path, remote.deleted ? null : remote.content!);
      return;
    }
    // Both sides moved since they last agreed.
    if (remote.deleted) {
      // Deleted there, edited here: the edit is kept, and goes up over the
      // deletion on this same run.
      agree('');
      this.report.kept.push(path);
      return;
    }
    if (!local) {
      // Deleted here, edited there: the edit comes back.
      await this.vault.write(path, remote.content!, remote.mtime);
      agree(remoteHash);
      this.report.kept.push(path);
      return;
    }
    // R-5254: changed in DIFFERENT lines on the two sides — both edits go
    // into the note here, and the send below carries the merged note up
    // over the far side's version (it was agreed, so it is the base of the
    // send). Only a note with the version both last agreed can be merged.
    const merged = await this.mergeBoth(path, local, remote.content!);
    if (merged) {
      await this.vault.write(path, merged, this.now().getTime());
      agree(remoteHash);
      this.report.merged.push(path);
      return;
    }
    const listed = new Set((await this.vault.list()).map((f) => f.path));
    const copy = conflictCopyPath(path, this.now(), (p) => listed.has(p));
    await this.vault.write(copy, remote.content!, remote.mtime);
    // The far side now holds the other version at remote.version; this
    // version goes up over it, and the other one lives on as the copy.
    agree(remoteHash);
    this.report.conflicts.push({ path, copy });
  }

  /**
   * ROW 2375 — CouchDB's own replication conflicts. The far side chose one
   * version of [remote.path] and is holding others beside it (two servers
   * that each took an edit). Each other version whose bytes are not already
   * the file here is written beside it as a conflict copy and said, exactly
   * as R-5254 keeps both when two devices touched the same lines; only then
   * is the far side told to let them go, so a failure between the two keeps
   * the conflict on the server rather than losing a version.
   */
  private async keepOthers(remote: RemoteFile) {
    const path = remote.path;
    if (!inNoteSyncScope(path)) return;
    const here = await this.vault.read(path);
    const kept = new Set<string>([here ? await sha256Hex(here) : '']);
    for (const o of remote.others ?? []) {
      if (o.deleted || !o.content) continue;
      const h = await sha256Hex(o.content);
      if (kept.has(h)) continue;
      kept.add(h);
      const listed = new Set((await this.vault.list()).map((f) => f.path));
      const copy = conflictCopyPath(path, this.now(), (p) => listed.has(p));
      await this.vault.write(copy, o.content, o.mtime);
      this.report.conflicts.push({ path, copy });
    }
    await this.transport.settle?.(path, (remote.others ?? []).map((o) => o.version));
  }

  /** Both sides' edits in one note, or null where they cannot be kept
   *  apart — no base, not text, or the same lines touched. */
  private async mergeBoth(path: string, local: Uint8Array, remote: Uint8Array): Promise<Uint8Array | null> {
    if (!this.bases || !mergeable(path)) return null;
    const base = await this.bases.get(path);
    const [b, ours, theirs] = [base, local, remote].map((x) => (x ? utf8(x) : null));
    if (b === null || ours === null || theirs === null) return null;
    const r = mergeLines(b, ours, theirs);
    return r.clean ? new TextEncoder().encode(r.text) : null;
  }

  /** Send what changed here. True when the far side had moved under a
   *  send, so the caller takes again before sending again. */
  private async sendChanged(): Promise<boolean> {
    const out: Array<OutgoingFile & { hash: string }> = [];
    const present = new Set<string>();
    for (const f of await this.vault.list()) {
      if (!inNoteSyncScope(f.path)) continue;
      present.add(f.path);
      if (f.size > NOTE_SYNC_MAX_BYTES) {
        this.report.refused.push({ path: f.path, reason: `it is ${(f.size / 1048576).toFixed(1)} MB, over the 50 MB that note sync carries` });
        continue;
      }
      const content = await this.vault.read(f.path);
      if (!content) continue;
      const hash = await sha256Hex(content);
      const rec = this.state.files[f.path];
      if (rec && rec.hash === hash) continue;
      out.push({ path: f.path, content, mtime: f.mtime, deleted: false, base: rec?.version ?? null, hash });
    }
    for (const [path, rec] of Object.entries(this.state.files)) {
      if (present.has(path) || rec.hash === '' || !inNoteSyncScope(path)) continue;
      out.push({ path, content: null, mtime: this.now().getTime(), deleted: true, base: rec.version, hash: '' });
    }
    if (!out.length) return false;
    const byPath = new Map(out.map((f) => [f.path, f]));
    let moved = false;
    for (const r of await this.transport.push(out)) {
      const f = byPath.get(r.path)!;
      if (r.ok) {
        this.state.files[r.path] = { version: r.version, hash: f.hash };
        await this.keepBase(r.path, f.deleted ? null : f.content);
        this.report.sent.push(r.path);
      } else if (r.conflict) {
        moved = true;
      } else {
        this.report.refused.push({ path: r.path, reason: r.reason });
      }
    }
    return moved;
  }
}
