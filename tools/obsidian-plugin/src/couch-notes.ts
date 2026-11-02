/* ══ ROW 2375 · NOTES IN CouchDB, IN OUR OWN FORMAT ═════════════════════
 *
 * R-5255 (Omar 2026-10-10): "one document per file, encrypted like the
 * app’s relay, file names hidden". This is the CouchDB transport of
 * note-sync.ts: it turns a vault file into one sealed document and back,
 * over the client and the document-level sync in couch-client.ts.
 *
 * WHAT THE SERVER HOLDS, AND NOTHING MORE:
 *   graphite-sync       the plain parameters (format, salt, iterations, a
 *                       sealed check) — no path, no content, no secret;
 *   f:<64 hex>          one per file: the id is an HMAC of the path, and
 *                       the only other field is `sealed`, holding the path,
 *                       the modified time, the deleted flag and the bytes —
 *                       or, for a file too large for that, the same seal as
 *                       the one attachment of the document (below).
 *
 * A FILE LARGER THAN A DOCUMENT MAY BE. CouchDB refuses a document body
 * over max_document_size (8,000,000 bytes by default), and a seal is the
 * file plus a third, so a 6 MB video note could never travel. Attachments
 * are not counted against that limit, so a seal over [INLINE_SEAL_MAX]
 * rides as the attachment `sealed` of the document instead of its field: STILL
 * ONE DOCUMENT PER FILE, as R-5255 has it — nothing is split across
 * documents, so nothing can arrive half. The seal is the same seal, opened
 * the same way; only where the server keeps it differs. A later write that
 * fits goes back to the field, and drops the attachment with it.
 *
 * A DELETION IS A SEALED TOMBSTONE, not a CouchDB _deleted: the document
 * stays, its seal says deleted, so a device that never had the file still
 * learns which path to move to the trash, and a file made again later
 * replaces the tombstone by its revision like any other edit.
 *
 * A DATABASE THAT IS NOT OURS IS NEVER WRITTEN. A database holding
 * documents but no parameters document is somebody else (his LiveSync
 * database, most likely, which R-5255 says stays as the way back), and the
 * transport refuses it before it writes anything.
 */

import { CouchClient, CouchDocSync, type CouchDoc } from './couch-client';
import {
  NOTE_DOC_PREFIX, PARAMS_DOC_ID, NoteKey, bytesToBase64, newParams, openFile, openParams, sealFile,
} from './note-crypto';
import type { NoteTransport, OutgoingFile, PushOutcome, RemoteFile, TransportCheck } from './note-sync';

/** One _bulk_docs request carries at most this much sealed text, so a
 *  vault of large attachments goes up in several requests. */
export const PUSH_BATCH_BYTES = 8 * 1024 * 1024;
export const PUSH_BATCH_DOCS = 100;

/** The largest seal kept in the field of its document: under the CouchDB
 *  default max_document_size of 8,000,000 bytes, with room for the rest of
 *  the body. A larger one is the attachment of the document. */
export const INLINE_SEAL_MAX = 6_000_000;
/** The attachment a large seal is kept as. */
export const SEAL_ATTACHMENT = 'sealed';

/** Why a transport could not be opened, said in one sentence. */
export class NoteSyncRefusal extends Error {}

export class CouchNoteTransport implements NoteTransport {
  readonly kind = 'couchdb' as const;
  private docs: CouchDocSync;
  private key: NoteKey | null = null;
  /** Names this database for the sync state: a new salt is a new database,
   *  and nothing remembered about the old one may be trusted. */
  identity = '';

  constructor(private client: CouchClient, private passphrase: string) {
    this.docs = new CouchDocSync(client);
  }

  check(): Promise<TransportCheck> {
    return this.client.check();
  }

  /** Make the database if it is not there, and open it with the
   *  passphrase. Throws NoteSyncRefusal (or CouchError) with a sentence. */
  async open(): Promise<void> {
    if (this.key) return;
    if (!this.passphrase) {
      throw new NoteSyncRefusal('Enter the encryption passphrase in the Graphite Sync settings. Nothing was sent.');
    }
    await this.client.ensureDb();
    let params = await this.client.get(PARAMS_DOC_ID);
    if (!params) {
      const info = await this.client.info();
      if (info && info.docCount > 0) {
        throw new NoteSyncRefusal('This database already holds documents Graphite Sync did not write (a LiveSync database?). '
          + 'Choose a new database name: nothing was written to this one.');
      }
      const made = await newParams(this.passphrase);
      const [w] = await this.docs.push([made.params as unknown as CouchDoc]);
      if (w.ok) {
        this.key = made.key;
        this.identity = made.params.salt;
        return;
      }
      // Another device made it in the same moment: open theirs.
      params = await this.client.get(PARAMS_DOC_ID);
      if (!params) throw new NoteSyncRefusal('The parameters document could not be written or read back.');
    }
    const opened = await openParams(params, this.passphrase);
    if ('problem' in opened) throw new NoteSyncRefusal(opened.problem);
    this.key = opened.key;
    this.identity = String(params.salt);
  }

  private async opened(): Promise<NoteKey> {
    await this.open();
    return this.key!;
  }

  async pull(cursor: string | null): Promise<{ files: RemoteFile[]; cursor: string; more: boolean; unreadable: number }> {
    const key = await this.opened();
    const page = await this.docs.pull(cursor);
    const files: RemoteFile[] = [];
    let unreadable = 0;
    for (const d of page.docs) {
      if (!d.id.startsWith(NOTE_DOC_PREFIX)) continue;
      let sealed = d.doc && typeof d.doc.sealed === 'string' ? d.doc.sealed : null;
      // A seal too large for its document is the document's attachment.
      if (!sealed && hasSealAttachment(d.doc)) {
        sealed = await this.client.attachment(d.id, SEAL_ATTACHMENT, d.rev);
      }
      if (!sealed) continue; // removed by hand on the server: nothing to say which file
      const body = await openFile(key, sealed);
      // A seal that opens but sits under another id was moved there by
      // something other than a device: it is not believed.
      if (!body || (await key.idFor(body.path)) !== d.id) { unreadable += 1; continue; }
      // Row 2375: CouchDB's OWN conflicts. Two servers replicating, each
      // having taken an edit, leave the document with two leaves; CouchDB
      // picks one and the other waits in _conflicts, invisible to a reader
      // that does not ask. Each losing leaf is opened the same way and
      // handed to the engine beside the winner, so nothing written is lost.
      const others: NonNullable<RemoteFile['others']> = [];
      for (const rev of d.conflicts) {
        const leaf = await this.client.getRev(d.id, rev);
        let s = leaf && typeof leaf.sealed === 'string' ? leaf.sealed : null;
        if (!s && hasSealAttachment(leaf)) s = await this.client.attachment(d.id, SEAL_ATTACHMENT, rev);
        const o = s ? await openFile(key, s) : null;
        if (!o || o.path !== body.path) { unreadable += 1; continue; }
        others.push({ path: o.path, content: o.content, mtime: o.mtime, deleted: o.deleted, version: rev });
      }
      files.push({
        path: body.path, content: body.content, mtime: body.mtime, deleted: body.deleted, version: d.rev,
        ...(others.length ? { others } : {}),
      });
    }
    return { files, cursor: page.since, more: page.more, unreadable };
  }

  async push(files: OutgoingFile[]): Promise<PushOutcome[]> {
    const key = await this.opened();
    const out: PushOutcome[] = [];
    let batch: Array<{ doc: CouchDoc; path: string }> = [];
    let bytes = 0;
    const flush = async () => {
      if (!batch.length) return;
      const res = await this.docs.push(batch.map((b) => b.doc));
      res.forEach((r, i) => {
        const path = batch[i].path;
        if (r.ok) out.push({ path, ok: true, version: r.rev });
        else if (r.conflict) out.push({ path, ok: false, conflict: true });
        else out.push({ path, ok: false, conflict: false, reason: `the CouchDB server refused it (${r.reason})` });
      });
      batch = [];
      bytes = 0;
    };
    for (const f of files) {
      const sealed = await sealFile(key, { path: f.path, mtime: f.mtime, deleted: f.deleted, content: f.content });
      const doc: CouchDoc = sealed.length > INLINE_SEAL_MAX
        ? {
          _id: await key.idFor(f.path),
          _attachments: {
            [SEAL_ATTACHMENT]: {
              content_type: 'text/plain',
              data: bytesToBase64(new TextEncoder().encode(sealed)),
            },
          },
        }
        : { _id: await key.idFor(f.path), sealed };
      if (f.base) doc._rev = f.base;
      if (batch.length && (bytes + sealed.length > PUSH_BATCH_BYTES || batch.length >= PUSH_BATCH_DOCS)) await flush();
      batch.push({ doc, path: f.path });
      bytes += sealed.length;
    }
    await flush();
    return out;
  }

  /** Row 2375: the losing leaves of [path] are ended (each its own
   *  _deleted revision), so CouchDB stops holding the conflict. Called
   *  only after the engine has kept them as conflict copies. */
  async settle(path: string, versions: string[]): Promise<void> {
    if (!versions.length) return;
    const key = await this.opened();
    const id = await key.idFor(path);
    await this.docs.push(versions.map((rev) => ({ _id: id, _rev: rev, _deleted: true }) as CouchDoc));
  }

  wait(cursor: string | null, ms: number): Promise<boolean> {
    return this.docs.wait(cursor, ms);
  }
}


/** Whether a pulled document keeps its seal as its attachment. */
function hasSealAttachment(doc: CouchDoc | null): boolean {
  const atts = doc?._attachments;
  return !!atts && typeof atts === 'object' && SEAL_ATTACHMENT in (atts as Record<string, unknown>);
}
