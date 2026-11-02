/* ══ R-1517 — A RECORD YOU CAN LINK TO FROM ANY NOTE ═══════════════════════
 *
 * "Each record carries an Obsidian block id (^cuid, already a legal anchor
 * verbatim) so a note can link straight to a task or an event."
 *
 * THE ROW'S OWN WARNING DECIDES THE SHAPE. S-099 proposed replacing
 * ` | lp: <id>` with ` ^<id>`, and the row records why that was wrong: the
 * lp marker is what the importer matches a line back to its record by, and
 * taking it away from the four kinds whose round trip works would have
 * turned an edit of those lines into a delete-and-create. So the anchor is
 * ADDED, never substituted: ` | lp: <id> ^<id>`. The marker keeps doing the
 * round trip and the anchor does the addressing, and neither reads the
 * other.
 *
 * WHICH RECORDS. A block id belongs at the end of a BLOCK, and only a list
 * line is a block of its own. A table row is not — one table is one block,
 * so a table-row record can never be anchored, which the row already says
 * ("Table-row records can never be anchored"). The anchored kinds are the
 * list-line kinds that carry a marker; everything else is linked at the
 * level of the note that holds it (vault-links.ts), which is still a real
 * edge in Obsidian's graph.
 *
 * THIS FILE IMPORTS NOTHING, so the Obsidian plugin bundles it rather than
 * keeping a second copy of the grammar. One reader of a marker that is
 * wrong about the anchor turns `| lp: t1 ^t1` into a title.
 */

/* (Below the anchor: OC4's proposal marker and OC3's routing token. Both
 *  are written into a person's own note and read back by the server, so
 *  they live here for the same reason the anchor does.) */

/** The record kinds whose export line carries a block anchor. */
export const BLOCK_ANCHOR_KINDS: readonly string[] = [
  'tasks',
  'reminders',
  'checklist-items',
  'recipes',
];

/** R-1516: the module type that writes each anchored kind as a LIST LINE.
 *  A link may only point at `#^id` when the record really sits in such a
 *  module — anywhere else the line was never written and the link would
 *  resolve to nothing. vault-links-graph.spec holds this to the kinds. */
export const ANCHORED_IN: Readonly<Record<string, string>> = {
  tasks: 'TASKS',
  reminders: 'REMINDERS',
  'checklist-items': 'CHECKLISTS',
  recipes: 'RECIPES',
};

/** What Obsidian accepts after a `^`: letters, digits and dashes. */
const LEGAL_BLOCK_ID = /^[A-Za-z0-9-]+$/;

/** Can this id be written as an anchor verbatim? A cuid always can; a seeded
 *  id with an underscore cannot, and gets no anchor rather than a broken one
 *  that Obsidian would print as text. */
export function isAnchorable(id: string): boolean {
  return LEGAL_BLOCK_ID.test(id);
}

/** The suffix a list line ends with: ` ^<id>`, or nothing. */
export function blockAnchor(id: string): string {
  return isAnchorable(id) ? ` ^${id}` : '';
}

/** The ` | lp: <id>` marker at the end of a line, and the anchor after it if
 *  there is one. Group 1 is the id. */
export const LP_TAIL = /\s*\|\s*lp:\s*([A-Za-z0-9]+)(?:\s+\^[A-Za-z0-9-]+)?\s*$/;

/** The same marker as one pipe-separated part of a line (`lp: t1 ^t1`), which
 *  is how the importer's line parsers see it. Group 1 is the id.
 *
 *  NEVER A PROPOSAL KEY. `lp: p_7f3a` sits in the same slot and is not a
 *  record: read here as an id, a proposal sent to either door would look
 *  like a line whose record had been deleted, and both doors CREATE a record
 *  for one of those. That is the one failure the proposal loop exists to
 *  rule out — something becoming real without his approval. */
export const LP_PART = /^lp:\s*(?!p_)([^\s^]+)(?:\s+\^[A-Za-z0-9-]+)?$/;

/* ══ OC4 — ITALIC UNTIL APPROVED: A PROPOSAL'S MARKER ═════════════════════
 *
 * Omar, 2026-09-22: an agent may write into a note unattended, but "it will
 * always be in italic font style… asks for approval… once granted or
 * modified then approved it will create the entries in graphite and
 * finalize the edit in obsidian md".
 *
 * ITALIC IS THE HALF HE SEES, AND THIS IS THE HALF THE MACHINE READS. A
 * proposal is an italic line ending in ` | lp: p_<key>` — the record marker's
 * own slot, holding a key that is not a record yet. Italic with no marker is
 * his own emphasis and nothing here touches it.
 *
 * THE SAME SLOT, ON PURPOSE. Finalise is then one swap of the value — the
 * key out, the record id in — and the finalised line is the line a capture
 * by hand would have produced, with no fifth state left in the file.
 *
 * ANCHORED BY THE KEY, NEVER BY A LINE NUMBER. He may rewrite the line, move
 * it, or move the note before approving, and what is created is what the
 * line says at approval.
 */

/** `p_` and four to twenty-four letters or digits. Never a cuid (a cuid has
 *  no underscore), so a key and an id cannot be mistaken for each other. */
export const PROPOSAL_KEY = /^p_[A-Za-z0-9]{4,24}$/;

/** The proposal marker at the end of a line. Group 1 is the key. */
export const PROPOSAL_TAIL = /\s*\|\s*lp:\s*(p_[A-Za-z0-9]{4,24})\s*$/;

/** The proposal marker as one pipe-separated part. Group 1 is the key. */
export const PROPOSAL_PART = /^lp:\s*(p_[A-Za-z0-9]{4,24})$/;

/* ══ OC3 — THE ROUTING TOKEN: `>>` ═════════════════════════════════════════
 *
 * Omar, 2026-09-22: "a hotkey or a quick shortcut [that] brings a dropdown
 * of the tree, subtree and its modules, so that we reduce the reliance on
 * the model". The person writing knows which space a sentence belongs to
 * with a certainty no later reader has, so the destination is typed first.
 *
 *   - [ ] order the seal kit >> IS-12 Station
 *   - [ ] order the seal kit >> IS-12 Station / Snagging
 *   - [ ] order the seal kit >> Work › IS-07 Station #urgent
 *   ## Weekly — IS-07 >> IS-07 Station          (the whole section)
 *
 * The token runs from `>>` to the end of the line's words, stopping at a tag.
 * ` / ` names a module; ` › ` is the path the picker writes when two spaces
 * share a leaf name. `>> ?` is a question to the writer and routes nowhere.
 *
 * THE PLUGIN WRITES IT AND THE SERVER READS IT, from this one file, so the
 * two cannot disagree about what a token is.
 */

/** `>>` and what follows it, up to a tag or the end. Group 1 is the words. */
const ROUTE_TOKEN = /(^|\s)>>\s*([^#]*?)\s*(?=\s#|$)/;

export interface RouteToken {
  /** The space, as written: a name, or a path joined by ` › `. Empty when the
   *  writer typed `>>` or `>> ?` — a question, not a destination. */
  space: string;
  /** The module after ` / `, when one is named. */
  module: string | null;
}

/** Find the routing token in a line's WORDS (the part before any ` | `
 *  field). Returns the token and the words without it — a token is where the
 *  line goes, not part of what it says. */
export function readRouteToken(words: string): { token: RouteToken | null; rest: string } {
  const m = ROUTE_TOKEN.exec(words);
  if (!m || m.index === undefined) return { token: null, rest: words };
  const said = m[2].trim();
  const rest = (words.slice(0, m.index) + m[1] + words.slice(m.index + m[0].length))
    .replace(/\s+/g, ' ').trim();
  if (!said || said === '?') return { token: { space: '', module: null }, rest };
  const slash = said.lastIndexOf(' / ');
  return {
    token: slash > 0
      ? { space: said.slice(0, slash).trim(), module: said.slice(slash + 3).trim() || null }
      : { space: said, module: null },
    rest,
  };
}

/** The text the picker inserts for a space with no tag. */
export function routeTokenText(space: string, module?: string | null): string {
  return module ? `>> ${space} / ${module}` : `>> ${space}`;
}
