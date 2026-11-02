/* ══ R-1513 / R-1514 — ONE TAG GRAMMAR, AND IT ROUND-TRIPS ════════════════
 *
 * S-099 verified three corruptions, and every one of them is a disagreement
 * between two halves of the same seam:
 *
 *   "Order #12 arrived"       → title "Order arrived"    + a tag named "12"
 *   "Buy milk #work/urgent"   → title "Buy milk /urgent" + a tag named "work"
 *   a tag named "meal plan"   → comes back as "meal" plus junk
 *
 * THE FIRST TWO ARE A READER PROBLEM AND THE THIRD IS A WRITER PROBLEM, and
 * that is the shape worth keeping: a grammar is only a grammar if the same
 * rule decides what may be WRITTEN and what will be READ. The importer's
 * `splitTags` matched `#[\p{L}\p{N}_-]+`, the vault-capture path matched
 * `#[\p{L}\p{N}_/-]+`, and the emitter matched nothing at all — it printed
 * `#${name}` for every tag name in the database, including names it could
 * never read back.
 *
 * ── AN ALL-DIGIT TOKEN IS NOT A TAG ─────────────────────────────────────
 *
 * "Order #12 arrived" is the commonest sentence in the product's whole
 * corpus: an order number, an invoice, a flat number, a bus. Nobody who
 * writes it is filing anything, and the cost of treating it as a tag is not
 * a stray tag — it is that `#12` is REMOVED FROM THE TITLE and the record
 * now reads "Order arrived", in Postgres, permanently. A tag can be deleted;
 * a title cannot be un-deleted.
 *
 * At least one non-digit is the whole rule. `#12` is text, `#q1` is a tag,
 * `#2024-review` is a tag.
 *
 * ── A SLASH SURVIVES ────────────────────────────────────────────────────
 *
 * `work/urgent` is how Obsidian spells a sub-tag, and the second half is
 * usually the part that identifies anything: filing `#st/IS-07` under `st`
 * loses the only token that says which job it is. Stored verbatim — nothing
 * here decides what a hierarchy MEANS, which is R-291's question.
 *
 * ── AND A TAG THAT CANNOT BE WRITTEN IS NOT WRITTEN ─────────────────────
 *
 * A tag named "meal plan" has a space in it, so `#meal plan` reads back as
 * `meal` followed by the word "plan" glued onto the title. The emitter used
 * to write it anyway. It asks now, and a name it cannot spell is left out of
 * the line rather than corrupting it.
 *
 * NOTHING HERE RENAMES ANYTHING. S-099 §04 marks slug-validating tag names
 * ALREADY HELD as needing the owner's word, because that rewrites data
 * somebody typed. This is the parser and the printer; the stored names are
 * untouched, and `unwritable()` is how a surface can offer to fix one.
 */

/**
 * The one tag token. Letters, numbers, `_`, `-` and `/`, after a `#` that
 * begins a line or follows whitespace.
 *
 * THE LEADING-BOUNDARY GROUP IS LOAD-BEARING: without it `a#b` and a URL
 * fragment both read as tags. It is captured and put back so the text keeps
 * its spacing when the tag is lifted out.
 */
import { normaliseTagName } from './tag-hierarchy';

export const VAULT_TAG = /(^|\s)#([\p{L}\p{N}_/-]+)/gu;

/** At least one character that is not a digit or a separator. */
const HAS_A_LETTER = /[\p{L}_]/u;

/**
 * Is this token a tag, or is it a number somebody wrote after a hash?
 *
 * Kept separate from the regex because the regex has to MATCH `#12` in order
 * to leave it alone — a pattern that simply did not match it would still
 * work here, but the reason would be invisible at the one place somebody
 * reads to find out why `#12` survives.
 */
export const isTagToken = (slug: string): boolean => HAS_A_LETTER.test(slug);

/**
 * Pull `#tag` tokens out of a line.
 *
 * Returns the cleaned text and the tags found, in the order they appeared.
 * A token that is not a tag is left exactly where it was, spacing and all.
 */
export function parseVaultTags(text: string): { text: string; tags: string[] } {
  const tags: string[] = [];
  const cleaned = text
    .replace(VAULT_TAG, (all, pre: string, slug: string) => {
      if (!isTagToken(slug)) return all;
      // MERGED 2026-09-21 — THROUGH THE HIERARCHY NORMALISER (row 2391).
      // A trailing slash is not a segment: `#st/` is the tag `st`, and a
      // parser that kept the slash wrote a name the emitter would then
      // print as `#st/` and read back as `st` — the same round trip this
      // file exists to close, one character along. normaliseTagName is
      // where that rule lives for every writer at once.
      tags.push(normaliseTagName(slug));
      return pre;
    })
    // Two spaces where a tag used to be is not a sentence somebody wrote.
    .replace(/\s{2,}/g, ' ')
    .trim();
  return { text: cleaned, tags };
}

/**
 * Can this stored tag name be written as a bare `#tag` and read back as
 * itself?
 *
 * The round trip is the definition, not a spelling opinion: a name is
 * writable exactly when parsing `#name` returns `name` and nothing else.
 */
export function isWritableTag(name: string): boolean {
  const { text, tags } = parseVaultTags(`#${name}`);
  return text === '' && tags.length === 1 && tags[0] === name;
}

/**
 * The `#tag` for a stored name, or null when it cannot be spelled.
 *
 * NULL RATHER THAN A SLUGGED GUESS. Writing `#meal-plan` for a tag named
 * "meal plan" would put a tag in the vault that does not exist in the
 * product, and the next import would create it — the mirror inventing data
 * and then believing it.
 */
export const vaultTag = (name: string): string | null =>
  isWritableTag(name) ? `#${name}` : null;

/**
 * R-1513: a note's `tags:` PROPERTY, read the way Obsidian writes it.
 *
 * "The tags: property in Obsidian's Properties panel is ERASED on every
 * sync." The exporter writes a module note's own tags as `tags: [a, b]`,
 * and nothing read the key back — so a tag added in the Properties panel
 * lived until the next canonical re-export and was gone. The importer's
 * frontmatter reader cannot help: it takes `key: value` on one line, and
 * the Properties panel writes a BLOCK LIST:
 *
 *     tags:
 *       - home
 *       - chores
 *
 * So this reads the raw header itself, in all three spellings — block
 * list, `[a, "b"]`, and a bare `a, b` — dropping quotes and a leading `#`.
 *
 * UNDEFINED WHEN THE KEY IS ABSENT, AND THAT IS THE DIFFERENCE BETWEEN
 * "no tags" AND "not said". Absence never deletes: a note written before
 * this, or by hand without the key, leaves the module's tags alone. An
 * empty value (`tags:` or `tags: []`) is a person clearing them.
 */
export function frontmatterTags(text: string): string[] | undefined {
  return frontmatterList(text, 'tags')?.values;
}

/**
 * The header's own lines, and the file line the first of them sits on —
 * the raw block the one-line `key: value` reader cannot see into.
 */
function frontmatterLines(text: string): { lines: string[]; first: number } | undefined {
  if (!text.trimStart().startsWith('---')) return undefined;
  const start = text.indexOf('---');
  const end = text.indexOf('\n---', start + 3);
  if (end === -1) return undefined;
  const first = text.slice(0, start).split('\n').length;
  return { lines: text.slice(start + 3, end).split('\n'), first };
}

/**
 * Any LIST property of a note's header, in the three spellings frontmatterTags
 * reads (the tags property was the first; register 1518's rule lists are the
 * second — RU-006). Quotes and a leading `#` are dropped. Undefined when the
 * key is absent; `line` is the file line the key is on, for an error to name.
 */
export function frontmatterList(
  text: string, key: string,
): { values: string[]; line: number } | undefined {
  const fm = frontmatterLines(text);
  if (!fm) return undefined;
  const { lines } = fm;
  const at = lines.findIndex((l) => l.startsWith(`${key}:`));
  if (at === -1) return undefined;
  const line = fm.first + at;
  const clean = (v: string) => v.trim().replace(/^["']|["']$/g, '').replace(/^#/, '').trim();
  const inline = lines[at].slice(key.length + 1).trim();
  if (inline) {
    return { values: inline.replace(/^\[|\]$/g, '').split(',').map(clean).filter(Boolean), line };
  }
  const out: string[] = [];
  for (let i = at + 1; i < lines.length; i++) {
    const m = /^\s+-\s*(.*)$/.exec(lines[i]);
    if (!m) break;
    const v = clean(m[1]);
    if (v) out.push(v);
  }
  return { values: out, line };
}

/**
 * One plain value of a note's header, unquoted — for a key a caller needs
 * with the line it sits on (the importer's own reader keeps no line).
 * Undefined when the key is absent.
 */
export function frontmatterValue(
  text: string, key: string,
): { value: string; line: number } | undefined {
  const fm = frontmatterLines(text);
  if (!fm) return undefined;
  const at = fm.lines.findIndex((l) => l.startsWith(`${key}:`));
  if (at === -1) return undefined;
  const value = fm.lines[at].slice(key.length + 1).trim().replace(/^["']|["']$/g, '');
  return { value, line: fm.first + at };
}

/** The stored names a vault cannot carry, for a surface that offers to fix them. */
export const unwritable = (names: Iterable<string>): string[] =>
  [...names].filter((n) => !isWritableTag(n));
