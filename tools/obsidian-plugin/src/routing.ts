/* ══ OC3 — YOU ROUTE WHILE YOU WRITE: `>>` AT THE CURSOR ═══════════════════
 *
 * Omar, 2026-09-22: "have the plugin active when taking the notes so that
 * with a hotkey or a quick shortcut it brings a dropdown of the tree,
 * subtree and its modules, so that we reduce the reliance on the model and
 * reduce the intervention."
 *
 * WHILE WRITING, NOT A DIALOG AFTERWARDS. Typing `>>` mid-line opens the
 * picker under the cursor; Enter writes the destination into the line and
 * the cursor carries on. The palette command and a bindable hotkey open the
 * same list for a phone, which has no inline suggester worth the name.
 *
 * WHERE THE CURSOR IS, IS THE SCOPE (docs/OBSIDIAN_ROUTING.md §4):
 *   on a line         the token goes on that line — that line goes there
 *   on a heading      the token goes on the heading — the whole section
 *   in frontmatter    `lp_space:` — the whole note
 * Every choice is written into the file. Nothing is held in the plugin's
 * memory, so the note means the same thing when it is reopened next month.
 *
 * WHAT IS INSERTED: the tag the space already carries (`#st/IS-07`), or
 * `>> Space Name` — a path (`>> Work › IS-07 Station`) when two routable
 * spaces share a leaf name, so the token is never ambiguous on the day it is
 * written. A module, chosen with `/` in the query, always goes as a token.
 *
 * THE PICKER CREATES NOTHING. Making a space or a module stays with the two
 * ruled commands ("Create a Graphite space from this note", "Add a
 * module"); a fuzzy box that minted containers would turn routing into
 * provisioning with no review.
 *
 * PURE: no `obsidian`, no editor. The API's jest suite runs it.
 */

import { routeTokenText } from '../../../apps/api/src/spaces/vault-anchor';

/** One space as `GET /spaces` returns it — modules included, so the picker
 *  never asks a module route (plugin-reach.spec pins that it does not). */
export interface RawSpace {
  id: string;
  name: string;
  parentId?: string | null;
  tags?: string[] | null;
  status?: string | null;
  personId?: string | null;
  myRole?: string | null;
  modules?: { id: string; type: string; name: string }[] | null;
}

export interface Route {
  spaceId: string;
  /** Names from the top of the tree to this space. */
  path: string[];
  tags: string[];
  modules: { id: string; type: string; name: string }[];
  /** Set on a module choice (`is07/snag`). */
  module?: { id: string; type: string; name: string };
}

/** Which spaces a line may be routed to: never a PERSON'S space (hidden
 *  from the app's own grid too), never an archived or deleted one, never one
 *  he may only view — a destination he cannot write to is not offered. The
 *  server asks all three again; this only stops offering a refusal. */
export function routable(spaces: readonly RawSpace[]): RawSpace[] {
  return spaces.filter((s) =>
    !s.personId
    && s.status !== 'ARCHIVED' && s.status !== 'DELETED'
    && s.myRole !== 'VIEWER');
}

const lc = (s: string) => s.toLowerCase();

/** The flat list the picker shows: a full path per space, the recently used
 *  first (in the order used), then the rest alphabetically by path. Flat,
 *  because fuzzy search wants a list; a path, because orientation wants a
 *  tree. */
export function buildRoutes(spaces: readonly RawSpace[], recent: readonly string[] = []): Route[] {
  const byId = new Map(spaces.map((s) => [s.id, s]));
  const pathOf = (s: RawSpace): string[] => {
    const out: string[] = [];
    const seen = new Set<string>();
    for (let at: RawSpace | undefined = s; at && !seen.has(at.id); at = at.parentId ? byId.get(at.parentId) : undefined) {
      seen.add(at.id);
      out.unshift(at.name);
    }
    return out;
  };
  const routes = routable(spaces).map((s) => ({
    spaceId: s.id,
    path: pathOf(s),
    tags: (s.tags ?? []).filter(Boolean),
    modules: (s.modules ?? []).filter((m) => m.type === 'TASKS' || m.type === 'NOTES'),
  }));
  const rank = (r: Route) => {
    const i = recent.indexOf(r.spaceId);
    return i < 0 ? Number.MAX_SAFE_INTEGER : i;
  };
  return routes.sort((a, b) =>
    rank(a) - rank(b) || a.path.join(' › ').localeCompare(b.path.join(' › ')));
}

/** Filter by what was typed after `>>`. Every word must appear in the path
 *  or a tag. A `/` moves to the module: `is07/snag` lists IS-07's modules
 *  whose name contains "snag". An empty query shows the five most recent —
 *  two keystrokes for the common case — or everything when none are. */
export function filterRoutes(routes: readonly Route[], query: string, recent: readonly string[] = []): Route[] {
  const matching = (q: string) => {
    const terms = lc(q).split(/\s+/).filter(Boolean);
    return {
      terms,
      hit: routes.filter((r) => {
        const hay = lc([r.path.join(' › '), ...r.tags].join(' '));
        return terms.every((t) => hay.includes(t));
      }),
    };
  };
  // A TAG HAS A SLASH IN IT TOO (`st/IS-07`), so the whole query is tried
  // as a space first, and the slash means "module" only when it does not.
  let slash = query.indexOf('/');
  if (slash >= 0 && matching(query.trim()).hit.length) slash = -1;
  const { terms, hit } = matching(slash < 0 ? query.trim() : query.slice(0, slash));
  if (slash >= 0) {
    const modQ = lc(query.slice(slash + 1).trim());
    return hit.flatMap((r) => r.modules
      .filter((m) => !modQ || lc(m.name).includes(modQ))
      .map((m) => ({ ...r, module: m })));
  }
  if (!terms.length && recent.length) {
    const recentHits = hit.filter((r) => recent.includes(r.spaceId)).slice(0, 5);
    if (recentHits.length) return recentHits;
  }
  return hit;
}

/** The name a token uses: the leaf, or the path when another routable
 *  space shares that leaf name. */
export function tokenName(route: Route, all: readonly Route[]): string {
  const leaf = route.path[route.path.length - 1];
  const twins = all.filter((r) => r.spaceId !== route.spaceId && lc(r.path[r.path.length - 1]) === lc(leaf));
  return twins.length ? route.path.join(' › ') : leaf;
}

/** What Enter writes, for a line or a heading. */
export function insertionFor(route: Route, all: readonly Route[]): string {
  if (route.module) return routeTokenText(tokenName(route, all), route.module.name);
  if (route.tags.length) return `#${route.tags[0].replace(/^#/, '')}`;
  return routeTokenText(tokenName(route, all));
}

/** And for the frontmatter: the whole note goes there. */
export function frontmatterFor(route: Route, all: readonly Route[]): string {
  return `lp_space: ${tokenName(route, all)}`;
}

/** The 0-based [open, close] lines of the frontmatter, or null. */
export function frontmatterRange(lines: readonly string[]): [number, number] | null {
  if (lines[0]?.trim() !== '---') return null;
  const end = lines.findIndex((l, n) => n > 0 && l.trim() === '---');
  return end > 0 ? [0, end] : null;
}

export type RouteScope = 'line' | 'section' | 'note';

/** What the cursor's line routes: the note in the frontmatter, a section on
 *  a heading, and otherwise that line. */
export function scopeAt(lines: readonly string[], line: number): RouteScope {
  const fm = frontmatterRange(lines);
  if (fm && line > fm[0] && line < fm[1]) return 'note';
  return /^\s*#{1,6}\s/.test(lines[line] ?? '') ? 'section' : 'line';
}

/**
 * Is the cursor just after a `>>` that should open the picker?
 *
 * Mid-line only, after a space: `>>` at the START of a body line is a
 * nested blockquote, and a picker that opened on it would be a dropdown
 * nobody asked for. In the frontmatter the start of a line is fine. Closed
 * by a `|` or a `#` — the token has ended and a field or a tag has begun.
 */
export function routeTrigger(
  text: string, ch: number, inFrontmatter = false,
): { start: number; query: string } | null {
  const before = text.slice(0, ch);
  const at = before.lastIndexOf('>>');
  if (at < 0) return null;
  if (!inFrontmatter && (at === 0 || !/\s/.test(before[at - 1]))) return null;
  const query = before.slice(at + 2);
  if (/[|#]/.test(query) || query.includes('>>')) return null;
  return { start: at, query: query.replace(/^\s+/, '') };
}

/** The heading a line sits under, raw — what the server reads a section's
 *  route from. Never across a fenced code block's boundary. */
export function sectionFor(lines: readonly string[], line: number): string | undefined {
  let fence = false;
  let heading: string | undefined;
  const fm = frontmatterRange(lines);
  for (let i = fm ? fm[1] + 1 : 0; i < line; i++) {
    const t = lines[i].trim();
    if (/^(```|~~~)/.test(t)) { fence = !fence; continue; }
    if (!fence && /^#{1,6}\s/.test(t)) heading = lines[i];
  }
  return heading;
}

/** The note's `lp_space:`, if the frontmatter names one. */
export function noteSpace(lines: readonly string[]): string | undefined {
  const fm = frontmatterRange(lines);
  if (!fm) return undefined;
  for (let i = fm[0] + 1; i < fm[1]; i++) {
    const m = /^lp_space:\s*(.+?)\s*$/.exec(lines[i]);
    if (m) return m[1].replace(/^["']|["']$/g, '');
  }
  return undefined;
}

/* ══ RULED 2026-09-24 — "MAKE THESE TASKS" ═══════════════════════════════
 *
 * Omar chose "Both": plain bullets in a pending-items list become tasks by a
 * command he runs, and also by the agent proposing them. This is the
 * command — no model. A LIST IS FILED AS WRITTEN: only the bullet changes;
 * the words do not. A checkbox stays a checkbox, a numbered line stays
 * numbered, and prose is not a bullet.
 */
export function makeTasks(lines: readonly string[]): string[] {
  return lines.map((l) => {
    if (/^\s*[-*+]\s+\[[ xX-]\]/.test(l)) return l;
    const m = /^(\s*)[-*+]\s+(\S.*)$/.exec(l);
    return m ? `${m[1]}- [ ] ${m[2]}` : l;
  });
}
