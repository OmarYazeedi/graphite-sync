/* ══ THE LINK: ONE PASTE INSTEAD OF AN ADDRESS AND A LONG KEY ═══════════════
 *
 * Omar, 2026-11-17: "the obsidian mirror should work once the graphite plugin
 * is installed in obsidian and linked with a key it should be as simple as
 * that". The key is long and the server address is a second thing to type
 * beside it, on every device. The Graphite app, in the window that shows a new
 * key once, can also copy ONE line that holds both: this is that line, and the
 * plugin reads it.
 *
 * It is not a new way to sign in and not a secret of its own: it is the same
 * key the app made, written down together with the address it belongs to, so
 * it is as private as the key is and is revoked the same way (the keys list in
 * the app). Nothing is sent anywhere to read it.
 *
 * The shape is held equal to apps/app/lib/config/plugin_link.dart by a test on
 * each side that reads the same sample line.
 *
 *   graphite-link:v1.<base64url of {"s": "<server address>", "k": "<key>"}>
 */

export const LINK_PREFIX = 'graphite-link:v1.';

/** The six characters of a pairing code (R-521): letters and digits with no 0, O, 1, I or L,
 *  the same alphabet the server draws from (apps/api/src/auth/pairing-code.ts). */
const PAIRING_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** What a person typed, as the code it means, or null when it cannot be one: case, spaces and
 *  the dash they were shown are ignored, nothing else is. */
export function parsePairingCode(text: string): string | null {
  const code = String(text ?? '').toUpperCase().replace(/[\s-]/g, '');
  if (code.length !== 6) return null;
  for (const ch of code) if (!PAIRING_ALPHABET.includes(ch)) return null;
  return code;
}

export interface LinkParts { serverUrl: string; token: string; }

function fromBase64Url(text: string): string | null {
  try {
    const std = text.replace(/-/g, '+').replace(/_/g, '/');
    const padded = std + '='.repeat((4 - (std.length % 4)) % 4);
    const bin = atob(padded);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** The line the app copies, for a test and for a person who wants to make one
 *  by hand. */
export function makeLink(serverUrl: string, token: string): string {
  return LINK_PREFIX + toBase64Url(JSON.stringify({ s: serverUrl, k: token }));
}

/** The address and key a pasted line carries, or null when it is not one. A
 *  line that is not an http(s) address with no name and password in it, or a
 *  key that is empty, short or holds a space, is refused whole: half a link is
 *  worse than none. */
export function parseLink(text: string): LinkParts | null {
  const line = String(text ?? '').trim();
  if (!line.startsWith(LINK_PREFIX)) return null;
  const json = fromBase64Url(line.slice(LINK_PREFIX.length));
  if (json === null) return null;
  let o: unknown;
  try { o = JSON.parse(json); } catch { return null; }
  if (!o || typeof o !== 'object') return null;
  const { s, k } = o as { s?: unknown; k?: unknown };
  if (typeof s !== 'string' || typeof k !== 'string') return null;
  let url: URL;
  try { url = new URL(s); } catch { return null; }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  if (url.username || url.password || !url.hostname) return null;
  if (k.length < 20 || k.length > 4096 || /\s/.test(k)) return null;
  return { serverUrl: s.replace(/\/+$/, ''), token: k };
}
