/* ══ THE GRAPHITE BAR · THE LISTS THE PICKERS READ ═════════════════════════
 *
 * The pickers offer things only Graphite knows: the spaces and their Tasks
 * and Notes modules, the people of each space, and the tags in use. While the
 * plugin is connected it keeps them (settings.toolbarCache) and, if asked,
 * writes them into the vault as a plain JSON file. That file is how a tablet
 * with the plugin and NO token (Omar's Boox, in meetings, with LiveSync
 * carrying the vault) uses every picker: it reads this file when there is no
 * server.
 *
 * THE FILE CARRIES NAMES, NEVER A SECRET. It is built from the lists alone:
 * it has no field for a token, a server address, a vault id or a password,
 * and what is read back is copied field by field, so an edited or hostile file
 * cannot smuggle anything else into the plugin.
 *
 * IT IS NOT THE AGENT'S ROUTING LIST, ON PURPOSE. That list is read by a third
 * party's model and says, in its brief, that people are not on it. People are
 * on this one, so it is a separate file, a `.json` that Obsidian does not show
 * as a note, so capture and the census, which read notes, never see it;
 * `isToolbarFile` names it for any code that has to tell.
 *
 * PURE: no `obsidian`. The plugin's suite drives it through the bundle.
 */

import { RawSpace } from './routing';

export const TOOLBAR_LISTS_PATH = 'Graphite/Toolbar lists.json';

export function isToolbarFile(path: string): boolean {
  return path === TOOLBAR_LISTS_PATH;
}

export interface ToolbarPerson { name: string; color: string | null }

export interface ToolbarLists {
  graphite: 'toolbar-lists';
  /** When this was built from Graphite. */
  at: string;
  /** The vault's binding: the space it is bound to and its capture inbox. */
  bound: { rootId: string | null; inboxModuleId: string | null };
  /** The routing cache (`GET /spaces`, reduced to what `>>` and the lists use). */
  spaces: RawSpace[];
  /** People a line may be assigned to, by space id. */
  people: Record<string, ToolbarPerson[]>;
  /** Tags in use, without `#`. */
  tags: string[];
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const strOrNull = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);

/** A space as the list keeps it — the routing fields and nothing else. */
function spaceOf(v: any): RawSpace | null {
  if (!v || typeof v.id !== 'string' || typeof v.name !== 'string') return null;
  return {
    id: v.id, name: v.name, parentId: strOrNull(v.parentId),
    tags: Array.isArray(v.tags) ? v.tags.filter((t: unknown): t is string => typeof t === 'string') : [],
    status: strOrNull(v.status), personId: strOrNull(v.personId), myRole: strOrNull(v.myRole),
    modules: Array.isArray(v.modules)
      ? v.modules.filter((m: any) => m && typeof m.id === 'string' && typeof m.type === 'string')
        .map((m: any) => ({ id: m.id as string, type: m.type as string, name: str(m.name) }))
      : [],
  };
}

export function buildLists(input: {
  at: string;
  bound: { rootId: string | null; inboxModuleId: string | null };
  spaces: readonly RawSpace[];
  people: Record<string, readonly ToolbarPerson[]>;
  tags: readonly string[];
}): ToolbarLists {
  const seen = new Map<string, string>();
  for (const t of input.tags) {
    const name = t.replace(/^#/, '').trim();
    if (name && !seen.has(name.toLowerCase())) seen.set(name.toLowerCase(), name);
  }
  return {
    graphite: 'toolbar-lists',
    at: input.at,
    bound: { rootId: input.bound.rootId, inboxModuleId: input.bound.inboxModuleId },
    spaces: input.spaces.map((s) => spaceOf(s)).filter((s): s is RawSpace => !!s),
    people: Object.fromEntries(Object.entries(input.people).map(([id, ps]) => [
      id, ps.map((p) => ({ name: p.name, color: p.color ?? null })),
    ])),
    tags: [...seen.values()].sort((a, b) => a.localeCompare(b)),
  };
}

/** The file's text. Indented one space so a diff in a synced vault is a diff. */
export function listsFile(lists: ToolbarLists): string {
  return `${JSON.stringify(lists, null, 1)}\n`;
}

/** The lists a file holds, copied field by field; null for anything that is
 *  not one. Unknown keys are dropped, never kept. */
export function readListsFile(text: string): ToolbarLists | null {
  let raw: any;
  try { raw = JSON.parse(text); } catch { return null; }
  if (!raw || raw.graphite !== 'toolbar-lists' || !Array.isArray(raw.spaces)) return null;
  const people: Record<string, ToolbarPerson[]> = {};
  for (const [id, ps] of Object.entries(raw.people ?? {})) {
    if (!Array.isArray(ps)) continue;
    people[id] = ps.filter((p: any) => p && typeof p.name === 'string' && p.name)
      .map((p: any) => ({ name: p.name as string, color: strOrNull(p.color) }));
  }
  return buildLists({
    at: str(raw.at),
    bound: { rootId: strOrNull(raw.bound?.rootId), inboxModuleId: strOrNull(raw.bound?.inboxModuleId) },
    spaces: raw.spaces,
    people,
    tags: Array.isArray(raw.tags) ? raw.tags.filter((t: unknown): t is string => typeof t === 'string') : [],
  });
}

/** Two builds say the same thing when only their time differs. */
export function sameLists(a: ToolbarLists | null, b: ToolbarLists | null): boolean {
  if (!a || !b) return a === b;
  return JSON.stringify({ ...a, at: '' }) === JSON.stringify({ ...b, at: '' });
}
