/* ══ NOTE PAGES · SENDING A WHOLE NOTE ═══════════════════════════════════════
 *
 * Omar 2026-11-07, "the full set is approved": a captured task used to say
 * "Captured from <note>" and the note itself never reached Graphite. A note
 * can now be sent as a PAGE - the whole text, kept in step with the vault,
 * shown read-only in the Notes module with the tasks captured from it
 * beneath. Obsidian owns the text; nothing here writes to the vault.
 *
 * WHAT MAKES A NOTE A PAGE, and it is the person's doing either way:
 *   · it holds a Graphite routing heading (`## Weekly >> IS-07 Station`) -
 *     they already told Graphite where this note's lines go; or
 *   · it sits in a folder they listed under "Folders whose notes become
 *     pages". The list is empty by default (RU-035: this sends note text off
 *     the machine, so it is off until it is set).
 *
 * THEIR OWN SWITCH (Omar 2026-11-07, "Own switch, still needs a space"): pages
 * are sent only while "Send notes to Graphite as pages" is on, which is off
 * until turned on (RU-035), AND the vault is bound to a space. A capture inbox
 * is not needed: a page never touches it.
 *
 * WHERE: a page folder can name the Notes module its pages are filed in (Omar
 * 2026-11-07, "One choice per page folder"). With none named the server files
 * in the bound space's first Notes module.
 *
 * WHEN: a minute after the note stops changing - capture's own quiet-wait
 * (`autoCaptureDelay`) - and never while it is open in the editor. A capture
 * sends the page first and names it, so the tasks it makes link to the page.
 *
 * THIS FILE IMPORTS NOTHING FROM OBSIDIAN. The plugin hands it a PageHost,
 * the same seam note-sync and the tick use, so the rules are testable
 * without an app around them.
 */
import { frontmatterRange } from './routing';

/** The folders the person listed: comma- or line-separated, no slashes at the ends. */
export function parseFolders(setting: string): string[] {
  return (setting ?? '').split(/[,\n]/)
    .map((f) => f.trim().replace(/^\/+|\/+$/g, ''))
    .filter(Boolean);
}

/** Is [path] in a listed folder - the folder itself or anything beneath it? */
export function inPageFolder(path: string, setting: string): boolean {
  return parseFolders(setting).some((f) => path.startsWith(`${f}/`));
}

/** Does the note hold a routing heading, outside frontmatter and code? */
export function hasRoutingHeading(text: string): boolean {
  const lines = text.split('\n');
  const fm = frontmatterRange(lines);
  let fence = false;
  for (let i = fm ? fm[1] + 1 : 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (/^(```|~~~)/.test(t)) { fence = !fence; continue; }
    if (!fence && /^#{1,6}\s.*>>\s*\S/.test(t)) return true;
  }
  return false;
}

/** The Notes module chosen for the folder that holds [path], or undefined for
 *  the default. The LONGEST listed folder holding the note decides, so a
 *  nested folder has a choice of its own; a note in no listed folder (a routing
 *  heading made it a page) has none. A choice for a folder no longer listed is
 *  ignored. */
export function pageModuleFor(
  path: string, setting: string, modules: Record<string, string> | null | undefined,
): string | undefined {
  let best = '';
  for (const f of parseFolders(setting)) {
    if (path.startsWith(`${f}/`) && f.length > best.length) best = f;
  }
  if (!best) return undefined;
  const id = modules?.[best];
  return typeof id === 'string' && id ? id : undefined;
}

export function isPage(path: string, text: string, folders: string): boolean {
  return inPageFolder(path, folders) || hasRoutingHeading(text);
}

/** A short fingerprint of a note's text (cyrb53): enough to tell that it
 *  changed, kept per sent path in the plugin's data instead of the text
 *  itself. Not a security hash and not sent anywhere. */
export function fingerprint(text: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

export interface PageHost {
  /** The pages switch is on and the vault is bound to a space, as the server
   *  last said. A capture inbox is not part of it. */
  on(): boolean;
  folders(): string;
  /** The Notes module chosen for [path]'s folder, if any. */
  moduleFor(path: string): string | undefined;
  vaultName(): string;
  /** A note the plugin must never send: a synced space file, its own notes. */
  excluded(path: string): boolean;
  isOpen(path: string): boolean;
  read(path: string): Promise<string | null>;
  /** A PUT or DELETE to /mirror/pages; the answer's status and message. */
  send(method: 'PUT' | 'DELETE', body: Record<string, unknown>): Promise<{ status: number; message?: string }>;
  /** Paths sent, kept by the plugin across sessions, with the fingerprint of the text last sent. */
  sent: Record<string, string>;
  save(): Promise<void> | void;
  say(msg: string): void;
  delay(): number;
  watch(ev: 'modify' | 'create' | 'rename' | 'delete', cb: (...a: any[]) => void): void;
  setTimeout(fn: () => void, ms: number): unknown;
  clearTimeout(t: unknown): void;
}

export class PageSync {
  private timers = new Map<string, unknown>();
  private flying = new Map<string, Promise<boolean>>();
  /** Said once per path per session, not at every keystroke. */
  private told = new Set<string>();

  constructor(private host: PageHost) {}

  register() {
    const touched = (f: unknown) => {
      const p = (f as { path?: string } | null)?.path;
      if (p && /\.md$/i.test(p)) this.soon(p);
    };
    this.host.watch('modify', touched);
    this.host.watch('create', touched);
    this.host.watch('rename', (f: unknown, from: string) => {
      const p = (f as { path?: string } | null)?.path;
      if (p && /\.md$/i.test(p) && typeof from === 'string') void this.renamed(p, from);
    });
    this.host.watch('delete', (f: unknown) => {
      const p = (f as { path?: string } | null)?.path;
      if (p) void this.deleted(p);
    });
  }

  private eligible(path: string) {
    return this.host.on() && !this.host.excluded(path);
  }

  /** A note changed: send it after it has sat still. */
  soon(path: string) {
    if (!this.eligible(path)) return;
    // Only a note that could be a page waits to be sent. A note in a listed
    // folder is one on its path; any other is one only if it holds a routing
    // heading, which takes a read. Without this every edit of every note
    // armed a wait, and a note left open in the editor re-armed it for good.
    if (inPageFolder(path, this.host.folders())) { this.arm(path); return; }
    void this.host.read(path).then((text) => {
      if (text !== null && hasRoutingHeading(text)) this.arm(path);
      else if (this.timers.has(path)) this.disarm(path);
    });
  }

  private arm(path: string) {
    this.host.clearTimeout(this.timers.get(path));
    this.timers.set(path, this.host.setTimeout(() => {
      // Open in the editor means still being written: look again later.
      if (this.host.isOpen(path)) { this.arm(path); return; }
      this.timers.delete(path);
      void this.send(path);
    }, this.host.delay()));
  }

  /** The note stopped being a page candidate while waiting (its heading was
   *  deleted): the wait goes, and a page already sent stays until it is
   *  deleted or renamed, as before. */
  private disarm(path: string) {
    this.host.clearTimeout(this.timers.get(path));
    this.timers.delete(path);
  }

  /** Send [path] as a page if it is one. True when Graphite holds its
   *  current text afterwards - a capture then names the page. */
  send(path: string, oldPath?: string): Promise<boolean> {
    const running = this.flying.get(path);
    if (running) return running;
    const p = this.sendNow(path, oldPath).finally(() => this.flying.delete(path));
    this.flying.set(path, p);
    return p;
  }

  private async sendNow(path: string, oldPath?: string): Promise<boolean> {
    if (!this.eligible(path)) return false;
    const text = await this.host.read(path);
    if (text === null) return false;
    if (!isPage(path, text, this.host.folders())) return false;
    // The module is part of what was sent: a folder given another module sends
    // its unchanged notes again, once, so the pages move.
    const moduleId = this.host.moduleFor(path);
    const print = fingerprint(text) + (moduleId ? `@${moduleId}` : '');
    const prior = this.host.sent[path] ?? (oldPath ? this.host.sent[oldPath] : undefined);
    if (this.host.sent[path] === print && !oldPath) return true;
    // Back to the default after a chosen module is said, not left out: left out
    // would keep the page where the last send put it.
    const where = moduleId ? { moduleId } : prior?.includes('@') ? { moduleId: null } : {};
    const res = await this.host.send('PUT', {
      path, content: text, vaultName: this.host.vaultName(), ...where,
      ...(oldPath ? { oldPath } : {}),
    });
    if (res.status >= 300) {
      if (!this.told.has(path)) {
        this.told.add(path);
        this.host.say(`Graphite: ${path} was not sent as a page - ${res.message ?? `status ${res.status}`}`);
      }
      return false;
    }
    this.told.delete(path);
    this.host.sent[path] = print;
    if (oldPath) delete this.host.sent[oldPath];
    await this.host.save();
    return true;
  }

  /** The page reference a capture of [path] carries: sent first, then named. */
  async beforeCapture(path: string): Promise<string | null> {
    return (await this.send(path)) ? path : null;
  }

  /** Renamed in the vault: the page moves with it. A note that is no longer
   *  a page where it now sits takes the page away (to the Bin). */
  async renamed(path: string, from: string) {
    if (!this.host.on()) return;
    // Into the vault trash (or any hidden folder) is a delete, as far as a page goes.
    if (this.host.excluded(path)) { await this.deleted(from); return; }
    const was = from in this.host.sent;
    const sent = await this.send(path, was ? from : undefined);
    if (!sent && was) await this.erase(from);
  }

  /** Deleted in the vault. Only a note the plugin has sent is told about:
   *  the path of any other note is nobody's business. */
  async deleted(path: string) {
    if (!(path in this.host.sent)) return;
    await this.erase(path);
  }

  private async erase(path: string) {
    if (!this.host.on()) return;
    const res = await this.host.send('DELETE', { path });
    if (res.status < 300) {
      delete this.host.sent[path];
      await this.host.save();
    } else {
      this.host.say(`Graphite: the page for ${path} was not removed - ${res.message ?? `status ${res.status}`}`);
    }
  }
}
