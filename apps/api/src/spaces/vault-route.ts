/* ══ OC3 — WHICH SPACE A LINE GOES TO, ANSWERED INSIDE THE WALL ════════════
 *
 * Omar, 2026-09-22: "a dropdown of the tree, subtree and its modules, so
 * that we reduce the reliance on the model". Ruled 2026-09-23: "a note
 * naming a space outside its vault's bound subtree is REFUSED, and the
 * answer names the space it would not reach."
 *
 * THE CHAIN, first answer wins (docs/OBSIDIAN_ROUTING.md §10):
 *
 *   1  a token on the line        - [ ] order seals >> IS-12 Station
 *   2  a tag on the line          - [ ] order seals #st/IS-12
 *   3  the section it sits under  ## Weekly >> IS-07 Station   (or its tag,
 *                                  or a heading that IS a space's name)
 *   4  the note                   lp_space: IS-07 Station
 *   —  nothing                    the caller's fallback, said as unrouted
 *
 * The agent's answer from a closed list (6) is OC5's and arrives as a token
 * it wrote, so it is row 1 by the time it gets here. A hidden picked id (1
 * in the design) is deliberately not built: a token survives a rename only
 * by name, which §8 scenario 6 accepts — a stale name is refused and named,
 * never matched to a different space.
 *
 * NEVER A GUESS. A token or a `lp_space:` he TYPED that matches nothing, or
 * matches two spaces, is refused and the line stays uncaptured: a line filed
 * in the wrong space is worse than one filed nowhere, because the second is
 * visible. A TAG or a HEADING that matches nothing is not an error — most
 * tags are not space tags and most headings are not space names — so those
 * fall through to the next row instead.
 *
 * THE WALL IS AN ARGUMENT AND IT IS REQUIRED. This file cannot reach a space
 * the caller did not hand it, so whoever computes the wall decides the
 * boundary, in one place. Today that is every live space with a module the
 * caller may file into (MirrorService.vaultWall); OC2's vault binding
 * narrows it to the bound subtree without this file changing.
 *
 * PURE: no prisma, no service. The decisions are here and testable; the
 * queries are the caller's.
 */

import { RouteToken, readRouteToken } from './vault-anchor';
import { VAULT_TAG, isTagToken } from './vault-tags';

export interface WallModule { id: string; type: string; name: string }

export interface WallSpace {
  id: string;
  name: string;
  /** Names from the top of the tree down to this space, inclusive. */
  path: string[];
  /** Space.tags, as stored. */
  tags: string[];
  /** In MODULE_PICK_ORDER, so the first of a type is the one a line of that
   *  type lands in when no module is named. */
  modules: WallModule[];
}

export interface RouteHints {
  /** The `>>` token on the line itself. */
  token: RouteToken | null;
  /** The line's own tags, without `#`. */
  tags: string[];
  /** The raw heading line the line sits under, if any. */
  section?: string | null;
  /** The note's `lp_space:` frontmatter value, if any. */
  note?: string | null;
}

export type RouteVia = 'token' | 'tag' | 'section' | 'note';

export type RouteAnswer =
  | { kind: 'routed'; space: WallSpace; module: WallModule; via: RouteVia }
  | { kind: 'unrouted' }
  | { kind: 'refused'; via: RouteVia; message: string };

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const fullPath = (s: WallSpace) => s.path.join(' › ');

type Match =
  | { kind: 'one'; space: WallSpace }
  | { kind: 'none' }
  | { kind: 'many'; spaces: WallSpace[] };

/** A name or a ` › ` path, matched without case or extra spaces. An exact
 *  match wins; otherwise a UNIQUE prefix, so `>> is-12` reaches "IS-12
 *  Station" — but only when nothing else starts the same way. */
export function matchSpace(said: string, wall: readonly WallSpace[], prefix = true): Match {
  const want = norm(said);
  if (!want) return { kind: 'none' };
  const key = want.includes('›') ? (s: WallSpace) => norm(fullPath(s)) : (s: WallSpace) => norm(s.name);
  const exact = wall.filter((s) => key(s) === want);
  if (exact.length === 1) return { kind: 'one', space: exact[0] };
  if (exact.length > 1) return { kind: 'many', spaces: exact };
  if (!prefix) return { kind: 'none' };
  const starts = wall.filter((s) => key(s).startsWith(want));
  if (starts.length === 1) return { kind: 'one', space: starts[0] };
  return starts.length ? { kind: 'many', spaces: starts } : { kind: 'none' };
}

/** Spaces whose stored tags include any of these, without case or `#`. */
export function matchTags(tags: readonly string[], wall: readonly WallSpace[]): Match {
  const want = new Set(tags.map((t) => norm(t.replace(/^#/, ''))));
  if (!want.size) return { kind: 'none' };
  const hit = wall.filter((s) => s.tags.some((t) => want.has(norm(t.replace(/^#/, '')))));
  if (hit.length === 1) return { kind: 'one', space: hit[0] };
  return hit.length ? { kind: 'many', spaces: hit } : { kind: 'none' };
}

const names = (spaces: readonly WallSpace[]) =>
  spaces.slice(0, 4).map((s) => `"${fullPath(s)}"`).join(', ')
  + (spaces.length > 4 ? ` and ${spaces.length - 4} more` : '');

/** What a refusal says. Each names what was written, because "could not
 *  route" is only actionable if you know which word did not match. */
const refuse = (via: RouteVia, message: string): RouteAnswer => ({ kind: 'refused', via, message });

function fromToken(
  token: RouteToken, via: RouteVia, wall: readonly WallSpace[], moduleType: string,
): RouteAnswer {
  if (!token.space) {
    return refuse(via, 'asks where it goes (`>> ?`) — replace it with a space and capture again');
  }
  const m = matchSpace(token.space, wall);
  if (m.kind === 'none') {
    return refuse(via, `names "${token.space}", which is not a space this vault can reach`);
  }
  if (m.kind === 'many') {
    return refuse(via, `"${token.space}" could be ${names(m.spaces)} — pick one with >>`);
  }
  return withModule(m.space, token.module, via, moduleType);
}

/** The module inside a chosen space. A named module must exist and take
 *  this kind of line; otherwise the first of the line's type. NEVER CREATED
 *  HERE — ruled 2026-09-23 with the wall: a space that lacks the module a
 *  line needs is refused and said, not silently given one. */
function withModule(
  space: WallSpace, named: string | null, via: RouteVia, moduleType: string,
): RouteAnswer {
  const label = moduleType === 'TASKS' ? 'Tasks' : moduleType === 'NOTES' ? 'Notes' : moduleType;
  if (named) {
    const mod = space.modules.find((x) => norm(x.name) === norm(named));
    if (!mod) return refuse(via, `"${space.name}" has no module called "${named}"`);
    if (mod.type !== moduleType) {
      return refuse(via, `"${named}" in "${space.name}" is not a ${label} module`);
    }
    return { kind: 'routed', space, module: mod, via };
  }
  const mod = space.modules.find((x) => x.type === moduleType);
  if (!mod) {
    return refuse(via, `"${space.name}" has no ${label} module — add one, then capture again`);
  }
  return { kind: 'routed', space, module: mod, via };
}

/** A heading's own words, its `>>` and its tags. */
function readHeading(raw: string): { words: string; token: RouteToken | null; tags: string[] } {
  const text = raw.replace(/^\s*#{1,6}\s+/, '');
  const { token, rest } = readRouteToken(text);
  const tags: string[] = [];
  const words = rest.replace(VAULT_TAG, (all, pre: string, slug: string) => {
    if (!isTagToken(slug)) return all;
    tags.push(slug);
    return pre;
  }).replace(/\s+/g, ' ').trim();
  return { words, token, tags };
}

/**
 * Where one line goes. `moduleType` is what the LINE is — a checkbox line
 * is a task, a tagged line is a note — and the space's module of that type
 * receives it.
 */
export function routeLine(
  hints: RouteHints, wall: readonly WallSpace[], moduleType: string,
): RouteAnswer {
  if (hints.token) return fromToken(hints.token, 'token', wall, moduleType);

  const byTag = matchTags(hints.tags, wall);
  if (byTag.kind === 'one') return withModule(byTag.space, null, 'tag', moduleType);
  if (byTag.kind === 'many') {
    return refuse('tag', `its tags name ${names(byTag.spaces)} — keep one, or route it with >>`);
  }

  if (hints.section) {
    const h = readHeading(hints.section);
    if (h.token) return fromToken(h.token, 'section', wall, moduleType);
    const t = matchTags(h.tags, wall);
    if (t.kind === 'one') return withModule(t.space, null, 'section', moduleType);
    if (t.kind === 'many') {
      return refuse('section', `the heading's tags name ${names(t.spaces)} — keep one`);
    }
    // A HEADING THAT IS A SPACE'S NAME, exactly — never a prefix. "## To
    // do" must not reach a space called "To do list" by accident; a heading
    // that merely resembles a name falls through.
    const n = matchSpace(h.words, wall, false);
    if (n.kind === 'one') return withModule(n.space, null, 'section', moduleType);
  }

  if (hints.note && hints.note.trim()) {
    return fromToken({ space: hints.note.trim(), module: null }, 'note', wall, moduleType);
  }
  return { kind: 'unrouted' };
}

/** Is there anything on or around this line that could route it? Asked
 *  first, so a batch with no hint at all never builds a wall. */
export function hasRouteHint(hints: RouteHints): boolean {
  return !!hints.token || hints.tags.length > 0 || !!hints.section?.trim() || !!hints.note?.trim();
}

/**
 * RULED 2026-11-07 — WHERE A PLAIN BULLET GOES: only a section that NAMES A
 * NOTES MODULE (`## Meeting >> Work / Thread`) says its bullets are notes.
 *
 * Omar: "Each line becomes a note" — under a heading routed to a Notes
 * module. The module has to be NAMED. A heading that names only a space
 * (`## Actions >> Work`, or the space's own name, or a tag) does not say
 * what its lines are: a checkbox under it is a task in the space's Tasks
 * module, and a bullet under it is prose, because filing it as a note
 * would be guessing that the writer meant Notes. The bar's Start a list
 * always writes the module, so nothing it makes is left out.
 *
 * Null for everything else — no heading, no token, a space only, a name
 * outside the wall, a Tasks module. NEVER a refusal: most bullets in most
 * notes are prose, and the checkbox lines of the same section are refused
 * and named by their own route.
 */
export function notesSectionTarget(
  section: string | null | undefined, wall: readonly WallSpace[],
): { space: WallSpace; module: WallModule } | null {
  if (!section?.trim()) return null;
  const { token } = readHeading(section);
  if (!token?.space || !token.module) return null;
  const answer = fromToken(token, 'section', wall, 'NOTES');
  return answer.kind === 'routed' ? { space: answer.space, module: answer.module } : null;
}

/** Does this heading name a module, so a bullet under it could be a note?
 *  Asked before the wall is built: a batch whose bullets sit under no such
 *  heading never reads the wall for them. */
export function sectionNamesModule(section: string | null | undefined): boolean {
  if (!section?.trim()) return false;
  const { token } = readHeading(section);
  return !!token?.space && !!token.module;
}
