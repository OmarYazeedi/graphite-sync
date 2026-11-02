/* ══ ROW 2375 · THE SEAL A NOTE TRAVELS IN ═══════════════════════════════
 *
 * Omar 2026-10-10 (requests R-5255): "Our own format, in a new database on
 * the same CouchDB server: one document per file, encrypted like the app’s
 * relay, file names hidden. Moving is one upload and a check; the old
 * database stays as the way back".
 *
 * LIKE THE APP RELAY, BYTE FOR BYTE. apps/app/lib/hybrid/hybrid_crypto.dart
 * seals with AES-GCM-256 and a fresh random 12-byte nonce, and lays the
 * result out as nonce, then ciphertext, then the 16-byte tag. WebCrypto
 * returns ciphertext followed by the tag, so nonce + that output is the same
 * layout. A seal that does not open (tampered, or another key) opens to null,
 * never to a throw, as HybridCrypto.open does.
 *
 * WHAT DIFFERS FROM THE RELAY, AND WHY. The relay key is 32 random bytes
 * carried by a pairing code. A vault has nothing to carry it in: R-5257 says
 * the secrets are typed on each new device. So the key is derived from his
 * passphrase (PBKDF2-SHA-256, a random salt, an iteration count with a floor)
 * and the derivation gives 64 bytes: the first 32 seal, the second 32 name
 * documents (an HMAC of the path), so every device finds the same document
 * for the same file and the server never reads a file name.
 *
 * The salt, the count and a CHECK (a known phrase sealed under the key) live
 * in one plain document, so a wrong passphrase is told as a wrong passphrase
 * and not as a vault of unreadable notes.
 *
 * WebCrypto only: Obsidian runs on Electron and on the phone webviews, and
 * each has crypto.subtle. No library (R-3916 is about CouchDB kin, but a
 * crypto package would be one more thing in the bundle to trust).
 */

export const NOTE_FORMAT = 'graphite-sync';
export const NOTE_FORMAT_VERSION = 1;
/** The plain document holding what a device needs before it has a key. */
export const PARAMS_DOC_ID = 'graphite-sync';
/** Every note document id starts with this, then 64 hex characters. */
export const NOTE_DOC_PREFIX = 'f:';
export const NOTE_KDF = 'PBKDF2-SHA-256';
/** OWASP 2023 for PBKDF2-SHA-256. Also the floor: a parameters document
 *  asking for fewer is refused, so a server cannot talk a device into a
 *  key that is cheaper to guess. */
export const NOTE_KDF_ITERATIONS = 600_000;
const NONCE_BYTES = 12;
const TAG_BYTES = 16;
const SALT_BYTES = 16;
const CHECK_PHRASE = 'graphite-sync: the passphrase opens this database';

const subtle = (): SubtleCrypto => globalThis.crypto.subtle;
const utf8 = new TextEncoder();
const fromUtf8 = new TextDecoder('utf-8', { fatal: false });

/** A plain ArrayBuffer of exactly these bytes, which every WebCrypto call
 *  takes whatever view the bytes arrived in. */
function buf(u: Uint8Array): ArrayBuffer {
  return u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength) as ArrayBuffer;
}

export function randomBytes(n: number): Uint8Array {
  const out = new Uint8Array(n);
  globalThis.crypto.getRandomValues(out);
  return out;
}

/** Base64 in slices, because String.fromCharCode over a 50 MB spread
 *  overflows the call stack. */
export function bytesToBase64(b: Uint8Array): string {
  let bin = '';
  const STEP = 0x8000;
  for (let i = 0; i < b.length; i += STEP) {
    bin += String.fromCharCode.apply(null, Array.from(b.subarray(i, i + STEP)));
  }
  return btoa(bin);
}

export function base64ToBytes(s: string): Uint8Array | null {
  try {
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

export async function sha256Hex(b: Uint8Array): Promise<string> {
  return hex(new Uint8Array(await subtle().digest('SHA-256', buf(b))));
}

function hex(b: Uint8Array): string {
  let s = '';
  for (const x of b) s += x.toString(16).padStart(2, '0');
  return s;
}

const DERIVED = new Map<string, Promise<NoteKey>>();

/** The key a passphrase opens: one half seals, the other names documents. */
export class NoteKey {
  private constructor(private aes: CryptoKey, private mac: CryptoKey) {}

  /** The passphrase is normalised (NFC) first, so the same words typed on
   *  a Mac and on a phone are the same key.
   *
   *  REMEMBERED FOR THE SESSION. 600,000 rounds take about a second on a
   *  phone, and live sync runs after every change; deriving once per run
   *  would spend that second every time. The passphrase is in memory
   *  already (it is a setting), so keeping the key it derives beside it
   *  holds nothing new. */
  static derive(passphrase: string, salt: Uint8Array, iterations: number): Promise<NoteKey> {
    const id = JSON.stringify([passphrase.normalize('NFC'), bytesToBase64(salt), iterations]);
    let key = DERIVED.get(id);
    if (!key) {
      if (DERIVED.size >= 8) DERIVED.clear();
      key = NoteKey.deriveNow(passphrase, salt, iterations);
      DERIVED.set(id, key);
      key.catch(() => DERIVED.delete(id));
    }
    return key;
  }

  private static async deriveNow(passphrase: string, salt: Uint8Array, iterations: number): Promise<NoteKey> {
    const base = await subtle().importKey('raw', buf(utf8.encode(passphrase.normalize('NFC'))), 'PBKDF2', false, ['deriveBits']);
    const bits = new Uint8Array(await subtle().deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt: buf(salt), iterations }, base, 512));
    const aes = await subtle().importKey('raw', buf(bits.subarray(0, 32)), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
    const mac = await subtle().importKey('raw', buf(bits.subarray(32, 64)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return new NoteKey(aes, mac);
  }

  /** nonce + ciphertext + tag, as the relay lays it out. */
  async seal(clear: Uint8Array): Promise<Uint8Array> {
    const nonce = randomBytes(NONCE_BYTES);
    const box = new Uint8Array(await subtle().encrypt({ name: 'AES-GCM', iv: buf(nonce) }, this.aes, buf(clear)));
    const out = new Uint8Array(NONCE_BYTES + box.length);
    out.set(nonce, 0);
    out.set(box, NONCE_BYTES);
    return out;
  }

  /** The inverse of seal; null when it does not open. */
  async open(raw: Uint8Array): Promise<Uint8Array | null> {
    if (raw.length < NONCE_BYTES + TAG_BYTES) return null;
    try {
      return new Uint8Array(await subtle().decrypt(
        { name: 'AES-GCM', iv: buf(raw.subarray(0, NONCE_BYTES)) }, this.aes, buf(raw.subarray(NONCE_BYTES))));
    } catch {
      return null;
    }
  }

  /** The document a path lives in: the same on every device, and nothing
   *  the server can turn back into the name. */
  async idFor(path: string): Promise<string> {
    const sig = new Uint8Array(await subtle().sign('HMAC', this.mac, buf(utf8.encode(path))));
    return NOTE_DOC_PREFIX + hex(sig);
  }
}

/** The plain parameters document. Nothing in it is secret. */
export interface NoteParams {
  _id: string;
  _rev?: string;
  format: string;
  v: number;
  kdf: string;
  iterations: number;
  salt: string;
  check: string;
}

/** A new database: a fresh salt, the key, and the check sealed under it. */
export async function newParams(passphrase: string): Promise<{ params: NoteParams; key: NoteKey }> {
  const salt = randomBytes(SALT_BYTES);
  const key = await NoteKey.derive(passphrase, salt, NOTE_KDF_ITERATIONS);
  const check = bytesToBase64(await key.seal(utf8.encode(CHECK_PHRASE)));
  return {
    params: {
      _id: PARAMS_DOC_ID, format: NOTE_FORMAT, v: NOTE_FORMAT_VERSION,
      kdf: NOTE_KDF, iterations: NOTE_KDF_ITERATIONS, salt: bytesToBase64(salt), check,
    },
    key,
  };
}

/** Open an existing database with a passphrase: the key, or one sentence
 *  saying why not. */
export async function openParams(doc: Record<string, unknown>, passphrase: string):
  Promise<{ key: NoteKey } | { problem: string }> {
  if (doc.format !== NOTE_FORMAT) {
    return { problem: 'This database was not made by Graphite Sync. Choose a new database name (the LiveSync one stays as it is).' };
  }
  if (doc.v !== NOTE_FORMAT_VERSION || doc.kdf !== NOTE_KDF) {
    return { problem: `This database is in a newer Graphite Sync format (${String(doc.v)}). Update the plugin on this device.` };
  }
  const iterations = Number(doc.iterations);
  if (!Number.isInteger(iterations) || iterations < NOTE_KDF_ITERATIONS) {
    return { problem: 'This database asks for a weaker key than Graphite Sync allows, so nothing was opened or sent.' };
  }
  const salt = base64ToBytes(String(doc.salt ?? ''));
  const check = base64ToBytes(String(doc.check ?? ''));
  if (!salt || salt.length < SALT_BYTES || !check) {
    return { problem: 'The parameters document in this database is damaged, so nothing was opened or sent.' };
  }
  const key = await NoteKey.derive(passphrase, salt, iterations);
  const opened = await key.open(check);
  if (!opened || fromUtf8.decode(opened) !== CHECK_PHRASE) {
    return { problem: 'The encryption passphrase does not open the notes in this database. Nothing was read or sent.' };
  }
  return { key };
}

/* ══ ONE FILE, SEALED ═══════════════════════════════════════════════════
 * Inside the seal: four bytes giving the length of a small JSON header (the
 * path, the modified time, the deleted flag), the header, then the bytes of
 * the file. An attachment is sealed as bytes, not inflated through base64
 * twice. Outside the seal there is nothing but the document id. */

export interface SealedFileBody {
  path: string;
  mtime: number;
  deleted: boolean;
  /** Null for a deletion. */
  content: Uint8Array | null;
}

export async function sealFile(key: NoteKey, f: SealedFileBody): Promise<string> {
  const header = utf8.encode(JSON.stringify({ v: NOTE_FORMAT_VERSION, path: f.path, mtime: f.mtime, deleted: f.deleted }));
  const body = f.deleted || !f.content ? new Uint8Array(0) : f.content;
  const clear = new Uint8Array(4 + header.length + body.length);
  new DataView(clear.buffer).setUint32(0, header.length);
  clear.set(header, 4);
  clear.set(body, 4 + header.length);
  return bytesToBase64(await key.seal(clear));
}

/** The file a sealed body holds, or null when it does not open or does not
 *  parse. */
export async function openFile(key: NoteKey, sealed: string): Promise<SealedFileBody | null> {
  const raw = base64ToBytes(sealed);
  if (!raw) return null;
  const clear = await key.open(raw);
  if (!clear || clear.length < 4) return null;
  const len = new DataView(clear.buffer, clear.byteOffset, clear.byteLength).getUint32(0);
  if (4 + len > clear.length) return null;
  try {
    const h = JSON.parse(fromUtf8.decode(clear.subarray(4, 4 + len)));
    if (typeof h.path !== 'string') return null;
    const deleted = h.deleted === true;
    return {
      path: h.path,
      mtime: Number(h.mtime) || 0,
      deleted,
      content: deleted ? null : clear.slice(4 + len),
    };
  } catch {
    return null;
  }
}
