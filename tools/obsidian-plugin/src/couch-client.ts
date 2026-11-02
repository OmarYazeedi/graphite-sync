/* ══ ROW 2375 · A CouchDB CLIENT OF OUR OWN ═════════════════════════════
 *
 * Graphite Sync talks to his CouchDB server the way LiveSync does today
 * (R-4819: "i need both couchdb server and graphite own sync"), and it does
 * so with this file and nothing else: R-3916 bans CouchDB, PouchDB and
 * LiveSync packages by name (conventions.spec, COUCH_KIN), so the client is
 * our own code speaking CouchDB's documented HTTP API.
 *
 * ONLY WHAT NOTE SYNC NEEDS. Who am I (/_session), the database (GET and PUT
 * /{db}), what changed (/{db}/_changes, normal and long-poll), writes that
 * carry the revision they replace (/{db}/_bulk_docs), one document with its
 * conflicts, _local documents, and one attachment's body by revision — the
 * seal of a file too large to sit in its document (couch-notes.ts). No
 * views, no other attachments API, no replication between servers, no admin.
 *
 * FORMAT-BLIND ON PURPOSE. Nothing here knows what a note looks like as a
 * document. That is the specification's Question 1 (our own format in a new
 * database, or LiveSync's in the old one), and both answers sit on top of
 * exactly this client.
 *
 * Every request goes through the `request` function it is given: Obsidian's
 * requestUrl in the plugin (which a CouchDB server's CORS rules do not
 * reach), and a fake CouchDB in the tests.
 */

import type { TransportCheck } from './note-sync';

export interface CouchConfig {
  /** The server, e.g. https://couch.example.com — no database, no path. */
  url: string;
  db: string;
  user: string;
  password: string;
}

/** The slice of the Obsidian requestUrl this client uses. Only the text: the
 *  json getter on a response throws on a body that is not JSON (the HTML
 *  error page of a proxy), so the client parses the text itself and says
 *  what the address answered instead. */
export type CouchRequest = (req: {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  contentType?: string;
  throw: false;
}) => Promise<{ status: number; text: string }>;

export type CouchProblem =
  | 'unreachable' | 'refused' | 'forbidden' | 'no-database'
  | 'bad-name' | 'server' | 'bad-answer' | 'not-set';

/** A failure a person can be told about, by kind. */
export class CouchError extends Error {
  constructor(public kind: CouchProblem, message: string, public status = 0) {
    super(message);
  }
}

/** A CouchDB document as it travels: its id and revision, and anything else. */
export interface CouchDoc {
  _id: string;
  _rev?: string;
  _deleted?: boolean;
  _conflicts?: string[];
  [key: string]: unknown;
}

export interface CouchChange {
  seq: string;
  id: string;
  changes: Array<{ rev: string }>;
  deleted?: boolean;
  doc?: CouchDoc;
}

/* CouchDB's own rule for a database name: a lowercase letter first, then
 * lowercase letters, digits and _ $ ( ) + - /. Checked here so a typo in
 * the settings note is told as a name problem, not as a 400 from the
 * server. */
export const COUCH_DB_NAME = /^[a-z][a-z0-9_$()+/-]*$/;

/** UTF-8 then base64, because btoa alone refuses any character above
 *  U+00FF and a password may hold one. */
function base64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

/** A sequence as CouchDB gives it: a string since 2.0, a number before.
 *  Never parsed or compared — only handed back. */
const seqOf = (s: unknown): string => (typeof s === 'number' ? String(s) : String(s ?? '0'));

export class CouchClient {
  constructor(private cfg: CouchConfig, private request: CouchRequest) {}

  private server(): string {
    return this.cfg.url.trim().replace(/\/+$/, '');
  }

  private dbPath(rest = ''): string {
    return `/${encodeURIComponent(this.cfg.db)}${rest}`;
  }

  private async call(method: string, path: string, body?: unknown): Promise<{ status: number; json: any }> {
    const { status, json } = await this.send(method, path, 'application/json', body);
    if (json === null || typeof json !== 'object') {
      throw new CouchError('bad-answer', 'The address answered, but not as a CouchDB server does.', status);
    }
    return { status, json };
  }

  /** One request, and the failures every answer is read for. The body of
   *  the answer comes back as text and, where it parses, as JSON. */
  private async send(method: string, path: string, accept: string, body?: unknown):
      Promise<{ status: number; text: string; json: any }> {
    if (!this.cfg.url.trim()) throw new CouchError('not-set', 'No CouchDB server is set.');
    const headers: Record<string, string> = { Accept: accept };
    if (this.cfg.user) {
      headers.Authorization = `Basic ${base64(`${this.cfg.user}:${this.cfg.password}`)}`;
    }
    let res: { status: number; text: string };
    try {
      res = await this.request({
        url: this.server() + path,
        method,
        headers,
        ...(body === undefined ? {} : { body: JSON.stringify(body), contentType: 'application/json' }),
        throw: false,
      });
    } catch (e) {
      throw new CouchError('unreachable', `The CouchDB server could not be reached (${(e as Error).message}).`);
    }
    let json: any = null;
    try { json = JSON.parse(res.text); } catch { json = null; }
    if (res.status === 401) {
      throw new CouchError('refused', 'The CouchDB server refused the user name or password.', 401);
    }
    if (res.status === 403) {
      throw new CouchError('forbidden', `The CouchDB user may not do this${json?.reason ? `: ${json.reason}` : '.'}`, 403);
    }
    if (res.status >= 500) {
      throw new CouchError('server', `The CouchDB server failed (${res.status}).`, res.status);
    }
    return { status: res.status, text: res.text, json };
  }

  private requireName() {
    if (!COUCH_DB_NAME.test(this.cfg.db)) {
      throw new CouchError('bad-name', `"${this.cfg.db}" is not a CouchDB database name: lowercase letters, `
        + 'digits and _ $ ( ) + - / only, starting with a letter.');
    }
  }

  /** Who the server says this device is. A wrong password is a 401 with
   *  Basic authentication; an anonymous session answers with no name. */
  async session(): Promise<{ name: string | null; roles: string[] }> {
    const { json } = await this.call('GET', '/_session');
    const ctx = json.userCtx ?? {};
    return { name: typeof ctx.name === 'string' ? ctx.name : null, roles: Array.isArray(ctx.roles) ? ctx.roles : [] };
  }

  /** The database, or null when there is none by that name. */
  async info(): Promise<{ docCount: number; updateSeq: string } | null> {
    this.requireName();
    const { status, json } = await this.call('GET', this.dbPath());
    if (status === 404) return null;
    return { docCount: Number(json.doc_count ?? 0), updateSeq: seqOf(json.update_seq) };
  }

  /** Make the database if it is not there. 412 is CouchDB saying it is. */
  async ensureDb(): Promise<'created' | 'exists'> {
    this.requireName();
    const { status, json } = await this.call('PUT', this.dbPath());
    if (status === 201 || status === 202) return 'created';
    if (status === 412) return 'exists';
    throw new CouchError('bad-answer', `The database could not be made (${json.reason ?? status}).`, status);
  }

  /** What changed after `since`. With `longpollMs`, the server holds the
   *  request until something changes or the time passes. */
  async changes(opts: { since?: string | null; limit?: number; docs?: boolean; longpollMs?: number } = {}):
    Promise<{ results: CouchChange[]; lastSeq: string; pending: number }> {
    this.requireName();
    const q = new URLSearchParams();
    q.set('since', opts.since ?? '0');
    if (opts.limit) q.set('limit', String(opts.limit));
    if (opts.docs) { q.set('include_docs', 'true'); q.set('conflicts', 'true'); }
    if (opts.longpollMs !== undefined) { q.set('feed', 'longpoll'); q.set('timeout', String(opts.longpollMs)); }
    const { status, json } = await this.call('GET', this.dbPath(`/_changes?${q}`));
    if (status === 404) throw new CouchError('no-database', `There is no database named "${this.cfg.db}" on the CouchDB server.`, 404);
    if (status >= 400 || !Array.isArray(json.results)) {
      throw new CouchError('bad-answer', `The changes feed answered ${status}.`, status);
    }
    return {
      results: json.results.map((r: any) => ({ ...r, seq: seqOf(r.seq) })),
      lastSeq: seqOf(json.last_seq),
      pending: Number(json.pending ?? 0),
    };
  }

  /** Write several documents. Each carries the revision it replaces (none
   *  for a new one); a stale one comes back as `conflict` and is not
   *  written, while the others are. */
  async bulkDocs(docs: CouchDoc[]): Promise<Array<{ id: string; rev?: string; error?: string; reason?: string }>> {
    this.requireName();
    const { status, json } = await this.call('POST', this.dbPath('/_bulk_docs'), { docs });
    if (status === 404) throw new CouchError('no-database', `There is no database named "${this.cfg.db}" on the CouchDB server.`, 404);
    if (!Array.isArray(json)) throw new CouchError('bad-answer', `The bulk write answered ${status}.`, status);
    return json;
  }

  /** One document with the revisions it is in conflict with, or null. */
  async get(id: string): Promise<CouchDoc | null> {
    this.requireName();
    const path = id.startsWith('_local/')
      ? this.dbPath(`/_local/${encodeURIComponent(id.slice(7))}`)
      : this.dbPath(`/${encodeURIComponent(id)}?conflicts=true`);
    const { status, json } = await this.call('GET', path);
    if (status === 404) return null;
    return json as CouchDoc;
  }

  /** The body of attachment [name] on document [id] AT revision [rev], as
   *  text, or null when that revision has none by that name. The revision is
   *  named so the body read is the one the change feed reported, never a
   *  later write's. */
  /** Document [id] AT revision [rev] — a losing leaf CouchDB is holding
   *  beside the winner (row 2375) — or null when there is no such leaf. */
  async getRev(id: string, rev: string): Promise<CouchDoc | null> {
    this.requireName();
    const { status, json } = await this.call('GET', this.dbPath(`/${encodeURIComponent(id)}?rev=${encodeURIComponent(rev)}`));
    if (status === 404) return null;
    if (status !== 200) throw new CouchError('bad-answer', `The document read answered ${status}.`, status);
    return json as CouchDoc;
  }

  async attachment(id: string, name: string, rev: string): Promise<string | null> {
    this.requireName();
    const path = this.dbPath(`/${encodeURIComponent(id)}/${encodeURIComponent(name)}?rev=${encodeURIComponent(rev)}`);
    const { status, text } = await this.send('GET', path, '*/*');
    if (status === 404) return null;
    if (status !== 200) throw new CouchError('bad-answer', `The attachment read answered ${status}.`, status);
    return text;
  }

  /** The settings screen's question: reachable, signed in, and the
   *  database — said in one sentence, whichever part failed. */
  async check(): Promise<TransportCheck> {
    try {
      const me = await this.session();
      if (!me.name) {
        return { ok: false, detail: 'The CouchDB server answered, but not as a signed-in user — set the user name and password.' };
      }
      const db = await this.info();
      if (!db) {
        return { ok: true, detail: `Signed in to CouchDB as ${me.name}. There is no database named "${this.cfg.db}" yet; note sync makes it.` };
      }
      return { ok: true, detail: `Signed in to CouchDB as ${me.name}. "${this.cfg.db}" holds ${db.docCount} document${db.docCount === 1 ? '' : 's'}.` };
    } catch (e) {
      return { ok: false, detail: (e as Error).message };
    }
  }
}

/* ══ DOCUMENT-LEVEL SYNC: what the note format sits on ════════════════════ */

/** A document as the changes feed delivered it. */
export interface PulledDoc {
  id: string;
  rev: string;
  deleted: boolean;
  doc: CouchDoc | null;
  /** Other leaf revisions CouchDB is holding beside the winner. */
  conflicts: string[];
}

export type DocWrite =
  | { id: string; ok: true; rev: string }
  | { id: string; ok: false; conflict: true }
  | { id: string; ok: false; conflict: false; reason: string };

/** How many changes one pull asks for. */
export const PULL_PAGE = 200;

export class CouchDocSync {
  constructor(private client: CouchClient) {}

  /** One page of what changed after `since`, with each document. `since`
   *  is handed back for the next call; `more` says to call again now. */
  async pull(since: string | null): Promise<{ docs: PulledDoc[]; since: string; more: boolean }> {
    const page = await this.client.changes({ since, limit: PULL_PAGE, docs: true });
    const docs = page.results
      .filter((r) => !r.id.startsWith('_design/'))
      .map((r): PulledDoc => ({
        id: r.id,
        rev: r.changes[0]?.rev ?? r.doc?._rev ?? '',
        deleted: r.deleted === true,
        doc: r.doc ?? null,
        conflicts: Array.isArray(r.doc?._conflicts) ? r.doc!._conflicts! : [],
      }));
    return { docs, since: page.lastSeq, more: page.pending > 0 };
  }

  /** Write documents, each with the revision it replaces. A conflict is
   *  reported for that document alone and nothing is overwritten. */
  async push(docs: CouchDoc[]): Promise<DocWrite[]> {
    if (!docs.length) return [];
    const res = await this.client.bulkDocs(docs);
    return docs.map((d): DocWrite => {
      const r = res.find((x) => x.id === d._id);
      if (r && r.rev && !r.error) return { id: d._id, ok: true, rev: r.rev };
      if (r?.error === 'conflict') return { id: d._id, ok: false, conflict: true };
      return { id: d._id, ok: false, conflict: false, reason: r ? `${r.error}: ${r.reason ?? ''}`.trim() : 'no answer for this document' };
    });
  }

  /** Live sync's wait: true as soon as anything changes after `since`,
   *  false when `ms` passes with nothing. */
  async wait(since: string | null, ms: number): Promise<boolean> {
    const page = await this.client.changes({ since, limit: 1, longpollMs: ms });
    return page.results.length > 0;
  }
}

/* ══ LIVE: keep waiting, and keep trying ═════════════════════════════════
 *
 * His LiveSync runs live in three vaults of four. Live here is a loop of
 * long-polls: wait for a change, hand it on, wait again. A failure is not
 * the end of live sync — a phone loses its network on every train — so it
 * waits and tries again, longer each time up to a ceiling, and says which
 * state it is in for the status badge (row 2376: green, yellow, red). */

export type LiveState = 'waiting' | 'syncing' | 'failing';

/** ROWS 2375/2376 — what the status bar says about live note sync, in one
 *  place. 'off' is said by saying nothing: a vault that has not turned live
 *  sync on carries no badge (RU-035 — off is hidden). A failure says that
 *  it is trying again, because the loop is: nothing is lost while it does. */
export function noteLiveBadge(state: LiveState | 'off', detail?: string): string {
  switch (state) {
    case 'off': return '';
    case 'waiting': return 'Notes 🟢 live';
    case 'syncing': return 'Notes ⏳ syncing';
    case 'failing': return `Notes 🔴 can't reach the server, trying again${detail ? ` (${detail})` : ''}`;
  }
}

export interface LiveOptions {
  since: string | null;
  /** Called when something arrived; returns the cursor to wait from next. */
  onChange: (since: string | null) => Promise<string | null>;
  onState?: (s: LiveState, detail?: string) => void;
  waitMs?: number;
  /** Injected so a test does not sleep for a minute. */
  sleep?: (ms: number) => Promise<void>;
}

export const LIVE_WAIT_MS = 60_000;
export const LIVE_BACKOFF_FIRST_MS = 1_000;
export const LIVE_BACKOFF_MAX_MS = 60_000;

export class LiveFollower {
  private stopped = false;
  /** The delays between failed tries, newest last — for the badge and the tests. */
  readonly backoffs: number[] = [];

  constructor(private sync: Pick<CouchDocSync, 'wait'>, private opts: LiveOptions) {}

  stop() { this.stopped = true; }

  async run(): Promise<void> {
    const sleep = this.opts.sleep ?? ((ms: number) => new Promise<void>((r) => window.setTimeout(r, ms)));
    let since = this.opts.since;
    let backoff = LIVE_BACKOFF_FIRST_MS;
    while (!this.stopped) {
      try {
        this.opts.onState?.('waiting');
        const arrived = await this.sync.wait(since, this.opts.waitMs ?? LIVE_WAIT_MS);
        if (this.stopped) break;
        if (arrived) {
          this.opts.onState?.('syncing');
          since = await this.opts.onChange(since);
        }
        backoff = LIVE_BACKOFF_FIRST_MS;
      } catch (e) {
        if (this.stopped) break;
        this.opts.onState?.('failing', (e as Error).message);
        this.backoffs.push(backoff);
        await sleep(backoff);
        backoff = Math.min(backoff * 2, LIVE_BACKOFF_MAX_MS);
      }
    }
  }
}
