/* ══ THIS DEVICE · READING WHAT THE GRAPHITE APP LEFT IN THE VAULT ═════════
 *
 * Omar, 2026-11-04: "the plugin should be able to read the device own
 * graphite database", then: "i dont want it running all the time it should
 * sync when any are opened, thats what the plugin is for". So nothing here
 * listens and nothing asks the app anything. The Graphite app already writes
 * a space as notes into a folder (its mirror), and when the app is opened it
 * writes them again and takes in whatever the vault changed while it was
 * closed. The vault is where the two meet.
 *
 * What the plugin adds is the Obsidian half of the sentence: it looks in the
 * vault for the index the app leaves beside the notes it writes, says when
 * the app last wrote and which notes were changed here since, and says
 * plainly that those changes reach Graphite the next time Graphite is
 * opened. It never says synced, because the plugin cannot know.
 *
 * IMPORTS NOTHING, so the test suite can read it without Obsidian.
 */

/** The index the app writes in every folder it keeps notes in: a JSON map
 *  from a note name, relative to that folder, to the space it belongs to. */
export const MIRROR_INDEX = '.lp-mirror.json';

/** What the vault is asked, by name. Obsidian's vault adapter has these. */
export interface MirrorFs {
  list(dir: string): Promise<{ files: string[]; folders: string[] }>;
  read(path: string): Promise<string>;
  /** Milliseconds since the epoch, or null when there is no such file. */
  mtime(path: string): Promise<number | null>;
}

export interface MirrorFolder {
  /** Vault-relative, '' for the vault root. */
  dir: string;
  spaces: number;
  notes: number;
  /** Named in the index and no longer there. */
  missing: number;
  /** Notes whose last change is later than the app's last write. */
  changedHere: string[];
  /** When the app last wrote this folder. */
  wroteAt: number;
}

export interface MirrorLook {
  folders: MirrorFolder[];
  spaces: number;
  notes: number;
  changedHere: number;
  /** The latest write by the app, or null when it has written nothing here. */
  wroteAt: number | null;
}

/** Folders that are never the app's and are not worth walking. */
const SKIP = new Set(['.obsidian', '.git', '.trash', 'node_modules']);

/** How deep to look for an index. A mirror folder is the vault itself or a
 *  folder in it; a few levels covers a Graphite folder with a space folder
 *  inside it. */
const DEPTH = 3;

/** A change within this long of the app's write is the app's own write. The
 *  app writes the index after the notes, so a note is never later than it by
 *  more than the clock of the disk. */
const SLACK_MS = 2000;

const join = (dir: string, name: string) => (dir ? `${dir}/${name}` : name);

/** Find every folder the app has written notes into, and what is in it. */
export async function lookForMirror(fs: MirrorFs): Promise<MirrorLook> {
  const folders: MirrorFolder[] = [];
  const walk = async (dir: string, depth: number): Promise<void> => {
    let listing: { files: string[]; folders: string[] };
    try { listing = await fs.list(dir); } catch { return; }
    const indexPath = join(dir, MIRROR_INDEX);
    if (listing.files.some((f) => f === indexPath)) {
      const found = await readFolder(fs, dir, indexPath);
      if (found) folders.push(found);
    }
    if (depth >= DEPTH) return;
    for (const sub of listing.folders) {
      const name = sub.split('/').pop() ?? sub;
      if (SKIP.has(name)) continue;
      await walk(sub, depth + 1);
    }
  };
  await walk('', 0);
  const wrote = folders.map((f) => f.wroteAt);
  return {
    folders,
    spaces: folders.reduce((n, f) => n + f.spaces, 0),
    notes: folders.reduce((n, f) => n + f.notes, 0),
    changedHere: folders.reduce((n, f) => n + f.changedHere.length, 0),
    wroteAt: wrote.length ? Math.max(...wrote) : null,
  };
}

async function readFolder(fs: MirrorFs, dir: string, indexPath: string): Promise<MirrorFolder | null> {
  let index: Record<string, unknown>;
  try {
    const parsed = JSON.parse(await fs.read(indexPath));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    index = parsed;
  } catch { return null; }
  const wroteAt = await fs.mtime(indexPath);
  if (wroteAt === null) return null;
  const spaces = new Set<string>();
  let notes = 0;
  let missing = 0;
  const changedHere: string[] = [];
  for (const [name, space] of Object.entries(index)) {
    if (typeof space !== 'string') continue;
    spaces.add(space);
    const path = join(dir, name);
    const at = await fs.mtime(path);
    if (at === null) { missing++; continue; }
    notes++;
    if (at > wroteAt + SLACK_MS) changedHere.push(path);
  }
  return { dir, spaces: spaces.size, notes, missing, changedHere, wroteAt };
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** "3 hours ago", in words a person would say. */
export function ago(then: number, now: number): string {
  const s = Math.max(0, Math.round((now - then) / 1000));
  if (s < 90) return 'just now';
  const m = Math.round(s / 60);
  if (m < 90) return `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 36) return `${h} hours ago`;
  return `${Math.round(h / 24)} days ago`;
}

/** What a person is told. `mobile` is Obsidian on a phone or tablet. Never
 *  says the vault is synced: it says what the app last wrote and what the
 *  vault holds that the app has not seen. */
export function mirrorSentence(look: MirrorLook, now: number, mobile: boolean): string {
  if (!look.folders.length || look.wroteAt === null) {
    return mobile
      ? 'No notes from Graphite are in this vault. Graphite on a phone does not write into an '
        + 'Obsidian vault yet. If a computer keeps this vault in step, set that up in the Graphite app on the computer.'
      : 'Graphite has not written notes into this vault. In the Graphite app, go to Settings, '
        + 'Data and server, Data locations, and choose this vault.';
  }
  const wrote = `Graphite wrote ${plural(look.notes, 'note')} for ${plural(look.spaces, 'space')} here, ${ago(look.wroteAt, now)}.`;
  const tail = look.changedHere > 0
    ? `${plural(look.changedHere, 'note')} changed here since. Those changes reach Graphite the next time the Graphite app is opened.`
    : 'Changes you make here reach Graphite the next time the Graphite app is opened.';
  return `${wrote} ${tail}`;
}

/** The short form for the status bar. */
export function mirrorShort(look: MirrorLook | null): string {
  if (!look) return 'checking';
  if (!look.folders.length) return 'no notes from Graphite here';
  return look.changedHere > 0
    ? `${look.changedHere} changed here, for Graphite to take`
    : `${plural(look.spaces, 'space')} from this device`;
}
