/// ══ ROW 2391 — SUB-TAGS, AND WHAT A SLASH MEANS ══════════════════════════
///
/// Omar: "the tagging system should go a deep overhauling upgrade, to also
/// allow multiple tags and sub tags… so I tag everything and the app as well
/// as obsidian can link things together."
///
/// MULTIPLE TAGS ALREADY WORK (TagOn is many-to-many). The sub-tag half did
/// not exist, and the reason it has to exist HERE rather than in each caller
/// is that the two halves of the product disagreed about what a nested tag
/// even is: the vault's importer read `#st/apple` as the tag `st` followed by
/// the text `/apple`, while the serializer wrote a tag literally named
/// `st/apple` back out. A round trip through the vault therefore RENAMED the
/// tag and left half of it in the record's title — silently, on the one path
/// that exists so Obsidian and Graphite agree.
///
/// ══ THE SEPARATOR IS THE SLASH, AND IT IS NOT A CHOICE ═══════════════════
/// Obsidian's nested tags are `#parent/child`, and the row's whole point is
/// that the two agree. Nothing here invents a convention; it adopts the one
/// the file format already has.
///
/// ══ THE HIERARCHY IS IN THE NAME, NOT IN A COLUMN ════════════════════════
/// A parent tag is not a row that has to exist: `st/apple` implies `st`
/// whether or not anybody has ever tagged anything with `st` alone. That is
/// how Obsidian behaves, it needs no migration, and it cannot drift out of
/// step with the names people type. The cost is that every question about
/// ancestry is a string question, which is what this file answers, once.

export const TAG_SEPARATOR = '/';

/// The one spelling of a tag name.
///
/// Called on every write path (attach, import) so `#ST/ Apple`, `st//apple`
/// and `st/apple/` are the SAME tag rather than three. Case is deliberately
/// preserved — a household that writes `Home/Bills` gets its capitals back —
/// while the uniqueness constraint stays on the exact name, as it was.
export function normaliseTagName(raw: string): string {
  return raw
    .trim()
    .replace(/^#/, '')
    .split(TAG_SEPARATOR)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .join(TAG_SEPARATOR);
}

/// `st/apple/green` → ['st', 'apple', 'green'].
export function tagSegments(name: string): string[] {
  const clean = normaliseTagName(name);
  return clean ? clean.split(TAG_SEPARATOR) : [];
}

/// The tag one level up, or null at the top. `st/apple` → `st`.
export function tagParent(name: string): string | null {
  const segs = tagSegments(name);
  return segs.length > 1 ? segs.slice(0, -1).join(TAG_SEPARATOR) : null;
}

/// Every tag this one sits under, nearest last: `st/apple/green` → ['st',
/// 'st/apple']. The tag itself is NOT among them.
export function tagAncestors(name: string): string[] {
  const segs = tagSegments(name);
  return segs.slice(0, -1).map((_, i) => segs.slice(0, i + 1).join(TAG_SEPARATOR));
}

/// Is [name] under [ancestor]? SEGMENT-WISE, which is the whole point:
/// `stock/apple` is under `stock`, and `stockings` is not. A prefix test on
/// the raw string gets that wrong, which is the bug this function exists to
/// make impossible.
export function isTagDescendant(name: string, ancestor: string): boolean {
  const a = normaliseTagName(ancestor);
  if (!a) return false;
  const n = normaliseTagName(name);
  return n !== a && n.startsWith(`${a}${TAG_SEPARATOR}`);
}

/// Does this tag answer a search for [q]?
///
/// COMPLETION, NOT SEARCH, and the difference is the row's own clause:
/// "autocomplete completes per segment". A person typing `app` is naming a
/// child and expects `st/apple`; a person typing `ple` is not naming
/// anything — they are in the middle of a word — and a whole-name
/// `contains` offers them `st/apple` anyway. So each SEGMENT is matched by
/// PREFIX, which is what completing a word means.
///
/// The whole name is matched by prefix too, so somebody typing the path
/// `st/ap` still finds `st/apple`.
export function tagMatches(name: string, q: string): boolean {
  const needle = normaliseTagName(q).toLowerCase();
  if (!needle) return true;
  const full = normaliseTagName(name).toLowerCase();
  if (full.startsWith(needle)) return true;
  return tagSegments(full).some((s) => s.startsWith(needle));
}

/// A tag row as every surface reads it: the name plus the two facts that
/// only this file can answer.
export interface TagShape {
  name: string;
  parent: string | null;
  depth: number;
}

export function tagShape(name: string): TagShape {
  const clean = normaliseTagName(name);
  return {
    name: clean,
    parent: tagParent(clean),
    depth: tagSegments(clean).length,
  };
}

/// ══ ROW 2391 — AND A SECOND STORE SPELLS IT THE SAME WAY ════════════════
///
/// Four models carry a `tags String[]` column of their own beside the
/// shared Tag/TagOn vocabulary — Space, ModuleInstance, ReferenceItem and
/// DocumentItem (shared/tag-stores.ts derives them). WHICH STORE WINS IS A
/// RULING AND THIS IS NOT IT. What is not a ruling is whether the two
/// stores spell a tag the same way, and they did not: `attachTag`
/// normalises on every write and every array site took `data.tags`
/// verbatim.
///
/// So `#st/ apple` typed into the module settings sheet became the tag
/// `st/ apple` in the column, while the same typing on a record became
/// `st/apple` in the vocabulary — two spellings of one word, neither
/// rolling up with the other, and nothing able to say they were the same
/// tag.
///
/// THE DOCUMENT IS THE CASE THAT MAKES IT CONCRETE. Row 2054 made
/// DocumentItem.tags a MIRROR of the placements: setTags writes the
/// vocabulary and the column is kept in step for the folder strip, the
/// markdown export and search's arrayTags. The write passed the raw
/// strings to both, so the mirror and the record disagreed the moment
/// somebody typed a space — and the comment above that write says, in its
/// own words, that the next person to find them disagreeing needs to know
/// which to believe.
///
/// Applied at every array-store write, so a future ruling about which
/// store wins is a ruling about ONE spelling rather than a reconciliation.
export function normaliseTagList<T extends readonly string[] | undefined | null>(
  raw: T,
): T extends readonly string[] ? string[] : T {
  if (!Array.isArray(raw)) return raw as any;
  const out: string[] = [];
  const seen = new Set<string>();
  for (const name of raw) {
    const clean = normaliseTagName(String(name ?? ''));
    // A name that is only punctuation is dropped rather than stored as an
    // empty string — attachTag refuses it, and a column that accepts what
    // the vocabulary refuses is the divergence again, one step smaller.
    if (!clean) continue;
    // DEDUPED CASE-INSENSITIVELY, KEEPING THE FIRST SPELLING. Case is
    // preserved by normaliseTagName — a household that writes Home/Bills
    // gets its capitals back — so `Home` and `home` in one list are one
    // tag twice, and which of the two is kept has to be decided here
    // rather than by array order at some later reader.
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
  }
  return out as any;
}
