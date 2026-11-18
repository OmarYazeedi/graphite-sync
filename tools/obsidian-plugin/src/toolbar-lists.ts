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
import {
  BUILT_IN_PRIORITIES, BUILT_IN_STATUSES, defaultVocabulary,
} from '../../../apps/api/src/shared/task-vocabulary';

export const TOOLBAR_LISTS_PATH = 'Graphite/Toolbar lists.json';

export function isToolbarFile(path: string): boolean {
  return path === TOOLBAR_LISTS_PATH;
}

export interface ToolbarPerson { name: string; color: string | null }

/** One of a Tasks module's own words: its name and the built-in it counts as.
 *  NAMES ONLY — the module's ids and colours are not carried. */
export interface ToolbarWord { name: string; countsAs: string }

/** A Tasks module's statuses and priorities, in its order. */
export interface ToolbarWords { priorities: ToolbarWord[]; statuses: ToolbarWord[] }

const MAX_WORD = 40;
const MAX_WORDS = 24;

/** The words of a list, copied field by field: a name with something in it and
 *  a built-in kind it counts as; anything else is dropped. */
function wordsList(v: unknown, kinds: readonly string[]): ToolbarWord[] {
  if (!Array.isArray(v)) return [];
  const out: ToolbarWord[] = [];
  for (const w of v) {
    const name = typeof w?.name === 'string' ? w.name.trim().slice(0, MAX_WORD) : '';
    if (!name || typeof w?.countsAs !== 'string' || !kinds.includes(w.countsAs)) continue;
    out.push({ name, countsAs: w.countsAs });
    if (out.length >= MAX_WORDS) break;
  }
  return out;
}

function wordsOf(v: any): ToolbarWords {
  return {
    priorities: wordsList(v?.priorities, BUILT_IN_PRIORITIES),
    statuses: wordsList(v?.statuses, BUILT_IN_STATUSES),
  };
}

/** What `GET /modules/:id/task-settings` says, as the file keeps it — or null
 *  when the module uses the built-ins exactly as shipped (nothing to carry). */
export function wordsFromSettings(settings: unknown): ToolbarWords | null {
  const words = wordsOf(settings);
  if (!words.priorities.length && !words.statuses.length) return null;
  const shipped = defaultVocabulary();
  const same = (a: ToolbarWord[], b: ToolbarWord[]) =>
    a.length === b.length && a.every((w, i) => w.name === b[i].name && w.countsAs === b[i].countsAs);
  return same(words.priorities, shipped.priorities) && same(words.statuses, shipped.statuses) ? null : words;
}

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
  /** Tasks modules that name their own statuses or priorities, by module id.
   *  A module using the built-ins as shipped is not here. */
  words: Record<string, ToolbarWords>;
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
  words?: Record<string, ToolbarWords>;
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
    words: Object.fromEntries(Object.entries(input.words ?? {})
      .map(([id, w]): [string, ToolbarWords] => [id, wordsOf(w)])
      .filter(([, w]) => w.priorities.length || w.statuses.length)),
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
    words: raw.words && typeof raw.words === 'object' ? raw.words : {},
  });
}

/** Two builds say the same thing when only their time differs. */
export function sameLists(a: ToolbarLists | null, b: ToolbarLists | null): boolean {
  if (!a || !b) return a === b;
  return JSON.stringify({ ...a, at: '' }) === JSON.stringify({ ...b, at: '' });
}
