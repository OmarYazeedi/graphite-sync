/* ══ THE GRAPHITE BAR · WHERE A LINE GOES, AS THE SERVER WILL READ IT ══════
 *
 * Assign offers the people of the space a line is going to, and Start a list
 * suggests the space the note already names. Both need the answer the server
 * will give at capture, so this reads the same chain vault-route.ts does, as
 * far as a plugin without the database can:
 *
 *   1  a `>>` token on the line         - [ ] order seals >> IS-12 Station
 *   2  a tag on the line that is a space's tag
 *   3  the section it sits under        ## Weekly >> IS-07 Station
 *   4  the note                         gr_space: / lp_space:
 *   5  the vault's capture inbox
 *
 * NEVER A GUESS. A name that matches no space, or two, is no answer — the
 * chain moves on, exactly as far as the server would, and a picker that
 * cannot tell says so rather than offering the wrong household's people.
 *
 * PURE: no `obsidian`. The plugin's suite drives it through the bundle.
 */

import { readRouteToken, routeTokenText } from '../../../apps/api/src/spaces/vault-anchor';
import { RawSpace, Route, noteSpace, sectionFor, tokenName } from './routing';

const lc = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

export type DestinationVia = 'line' | 'tag' | 'section' | 'note' | 'inbox' | 'none';

export interface Destination {
  route: Route | null;
  /** The module the token named, when it named one. */
  module: string | null;
  via: DestinationVia;
}

/** The one space a token's words name — by token name, path or leaf — or
 *  null when none or several do. */
export function routeNamed(routes: readonly Route[], said: string): Route | null {
  const want = lc(said);
  if (!want) return null;
  const hit = routes.filter((r) =>
    lc(tokenName(r, routes as Route[])) === want
    || lc(r.path.join(' › ')) === want
    || lc(r.path[r.path.length - 1]) === want);
  return hit.length === 1 ? hit[0] : null;
}

const wordsOf = (line: string): string => line.split(/(?<!\\)\|/)[0];

/** What a stretch of text says about where it goes. `refused` is a token the
 *  writer typed that names no space, or two: the server refuses that line
 *  rather than filing it somewhere, so the chain stops there too. `null` is
 *  text that says nothing, and the chain goes on. */
function fromText(
  text: string, routes: readonly Route[],
): { route: Route; module: string | null; via: 'line' | 'tag' } | 'refused' | null {
  const { token } = readRouteToken(text);
  if (token?.space) {
    const route = routeNamed(routes, token.space);
    return route ? { route, module: token.module, via: 'line' } : 'refused';
  }
  for (const m of text.matchAll(/(?:^|\s)#([\p{L}\p{N}_/-]+)/gu)) {
    const hit = routes.filter((r) => r.tags.some((t) => lc(t.replace(/^#/, '')) === lc(m[1])));
    if (hit.length === 1) return { route: hit[0], module: null, via: 'tag' };
  }
  return null;
}

/** Where line [line] of a note goes. [inboxModuleId] is the vault's capture
 *  inbox, which is where a line goes when nothing above names a place. */
export function destinationOf(
  lines: readonly string[], line: number, routes: readonly Route[], inboxModuleId: string | null,
): Destination {
  const refused: Destination = { route: null, module: null, via: 'none' };
  const own = fromText(wordsOf(lines[line] ?? ''), routes);
  if (own === 'refused') return refused;
  if (own) return { route: own.route, module: own.module, via: own.via };
  const heading = sectionFor(lines, line);
  const section = heading ? fromText(heading, routes) : null;
  if (section === 'refused') return refused;
  if (section) return { route: section.route, module: section.module, via: 'section' };
  const noted = noteSpace(lines as string[]);
  if (noted) {
    const note = routeNamed(routes, noted);
    return note ? { route: note, module: null, via: 'note' } : refused;
  }
  const inbox = inboxModuleId ? routes.find((r) => r.modules.some((m) => m.id === inboxModuleId)) : null;
  if (inbox) return { route: inbox, module: inbox.modules.find((m) => m.id === inboxModuleId)!.name, via: 'inbox' };
  return { route: null, module: null, via: 'none' };
}

/** The Tasks module a line at [dest] lands in, by id: the vault's inbox when
 *  that is where it falls, else the module the token named, else the first
 *  Tasks module of the space — the server's own order. Null when it cannot be
 *  said (no space, or a named module that is not a Tasks one). */
export function taskModuleOf(dest: Destination, inboxModuleId: string | null): string | null {
  if (!dest.route) return null;
  if (dest.via === 'inbox') return inboxModuleId;
  const tasks = dest.route.modules.filter((m) => m.type === 'TASKS');
  if (dest.module) return tasks.find((m) => lc(m.name) === lc(dest.module!))?.id ?? null;
  return tasks[0]?.id ?? null;
}

/** One module a list may be started for. */
export interface ListTarget {
  route: Route;
  module: { id: string; type: string; name: string };
}

export type ListKind = 'tasks' | 'notes';
const TYPE_OF: Record<ListKind, string> = { tasks: 'TASKS', notes: 'NOTES' };

/** Every module of the kind inside the vault's bound space (the space and
 *  everything under it). With no binding known — offline, or a server too old
 *  to say — every routable space is inside, as it is for the `>>` picker. */
export function listTargets(
  routes: readonly Route[], spaces: readonly RawSpace[], kind: ListKind, boundRootId: string | null,
): ListTarget[] {
  const parent = new Map(spaces.map((s) => [s.id, s.parentId ?? null]));
  const inside = (id: string): boolean => {
    if (!boundRootId) return true;
    const seen = new Set<string>();
    for (let at: string | null | undefined = id; at && !seen.has(at); at = parent.get(at)) {
      if (at === boundRootId) return true;
      seen.add(at);
    }
    return false;
  };
  const out: ListTarget[] = [];
  for (const route of routes) {
    if (!inside(route.spaceId)) continue;
    for (const module of route.modules) if (module.type === TYPE_OF[kind]) out.push({ route, module });
  }
  return out.sort((a, b) =>
    a.route.path.join(' › ').localeCompare(b.route.path.join(' › '))
    || a.module.name.localeCompare(b.module.name));
}

/** The target to put first: the module the note already names, else a module
 *  of the space it names, else the vault's capture inbox. Null when nothing
 *  names one — the list then opens with no suggestion rather than a guess. */
export function suggestedTarget(
  targets: readonly ListTarget[], dest: Destination, inboxModuleId: string | null,
): ListTarget | null {
  if (dest.via !== 'inbox' && dest.route) {
    const inSpace = targets.filter((t) => t.route.spaceId === dest.route!.spaceId);
    const named = dest.module ? inSpace.find((t) => lc(t.module.name) === lc(dest.module!)) : null;
    const inbox = inSpace.find((t) => t.module.id === inboxModuleId);
    const pick = named ?? inbox ?? inSpace[0];
    if (pick) return pick;
  }
  return targets.find((t) => t.module.id === inboxModuleId) ?? null;
}

/** Every word of [query] must appear in the space's path or the module's name. */
export function filterTargets(targets: readonly ListTarget[], query: string): ListTarget[] {
  const terms = lc(query).split(' ').filter(Boolean);
  return targets.filter((t) => {
    const hay = lc(`${t.route.path.join(' › ')} ${t.module.name}`);
    return terms.every((x) => hay.includes(x));
  });
}

/** `>> Work / Action items`, the token a heading carries. */
export function targetToken(t: ListTarget, routes: readonly Route[]): string {
  return routeTokenText(tokenName(t.route, routes as Route[]), t.module.name);
}

/** `Work › Action items` — the space's own name, then the module. */
export function targetLabel(t: ListTarget): string {
  return `${t.route.path[t.route.path.length - 1]} › ${t.module.name}`;
}
