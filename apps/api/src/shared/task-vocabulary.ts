import { HEX_COLOUR_RE } from './plain-validators';
// ══ A TASKS MODULE'S OWN WORDS FOR STATUS AND PRIORITY ════════════════════
//
// Omar, 2026-11-07, on the task board: "okay the full set is approved". Each
// Tasks module may rename, add, reorder and colour its statuses and its
// priorities. EVERY custom one declares which built-in it COUNTS AS
// (Not started / In progress / Done / Cancelled; Low / Normal / High /
// Critical), and that declaration is the whole safety of the feature:
//
//   · A TaskItem keeps its built-in `status` and `priority` enums. A custom
//     entry is only a nullable REFERENCE (`customStatusId`,
//     `customPriorityId`) on top, and writing it ALSO writes the enum it
//     counts as (resolveTaskWrite below). So Needs Attention, overdue, the
//     wall, sorting, reports, capture and the MCP tools — every consumer that
//     reads the enum — keep working without being told the feature exists.
//   · A space that never opens the settings has no stored vocabulary at all;
//     `vocabularyOf(null)` is the four built-ins in their old order, and no
//     reader changes behaviour (the "no change" half of the ruling).
//
// WHERE IT LIVES: in the module's `config` (key `taskVocabulary`), like the
// asset layouts' status lists and the rating overrides — a module's own
// settings, read with the module, replicated with it. A new table would have
// bought a foreign key and cost a census sweep for two short lists. The cost
// of the choice is that the reference is by id, not by constraint, so THIS
// file is the integrity: a write naming an unknown entry is a 400, and removing
// an entry that tasks still use is a 409 that asks where they go.
//
// ENTRIES. The four built-ins are always present, keyed by their enum names
// (`PENDING`, `HIGH`, ...). They may be renamed, recoloured and reordered but
// never removed. A custom entry has an opaque id minted here. A task on a
// built-in entry has a NULL reference — never a reference to the built-in's
// own entry — so "all existing tasks = their built-in, no custom entry" is
// the state of every row the migration touched.
//
// PURE ON PURPOSE: no Nest, no Prisma. The service reads and writes; this
// decides.

export const BUILT_IN_STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED'] as const;
export const BUILT_IN_PRIORITIES = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'] as const;
export type BuiltInStatus = (typeof BUILT_IN_STATUSES)[number];
export type BuiltInPriority = (typeof BUILT_IN_PRIORITIES)[number];

/// The config key the lists are stored under.
export const VOCABULARY_KEY = 'taskVocabulary';

/// How many entries a list may hold. A board of a hundred statuses is a
/// misuse, and the pickers are a column of rows.
export const MAX_ENTRIES = 24;
export const MAX_NAME = 40;

export interface VocabEntry<B extends string = string> {
  /// The enum name for a built-in; an opaque id for a custom one.
  id: string;
  name: string;
  /// `#RRGGBB`, or null to take the product's own colour for the entry.
  colour: string | null;
  /// The built-in kind it counts as. A built-in counts as itself.
  countsAs: B;
}

export interface TaskVocabulary {
  statuses: VocabEntry<BuiltInStatus>[];
  priorities: VocabEntry<BuiltInPriority>[];
}

/// The words the product shipped with. A module with nothing stored reads
/// exactly this, so the default is a fact of this file rather than a row.
export const DEFAULT_STATUS_NAMES: Record<BuiltInStatus, string> = {
  PENDING: 'Not started',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
  CANCELLED: 'Cancelled',
};
export const DEFAULT_PRIORITY_NAMES: Record<BuiltInPriority, string> = {
  LOW: 'Low',
  NORMAL: 'Normal',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export function defaultVocabulary(): TaskVocabulary {
  return {
    statuses: BUILT_IN_STATUSES.map((s) => ({
      id: s, name: DEFAULT_STATUS_NAMES[s], colour: null, countsAs: s,
    })),
    priorities: BUILT_IN_PRIORITIES.map((p) => ({
      id: p, name: DEFAULT_PRIORITY_NAMES[p], colour: null, countsAs: p,
    })),
  };
}

export type ListKind = 'statuses' | 'priorities';

const BUILT_INS: Record<ListKind, readonly string[]> = {
  statuses: BUILT_IN_STATUSES,
  priorities: BUILT_IN_PRIORITIES,
};

export const isBuiltInId = (kind: ListKind, id: string) =>
  BUILT_INS[kind].includes(id);

const HEX = HEX_COLOUR_RE;
const CUSTOM_ID = /^[A-Za-z0-9_-]{4,40}$/;

/// What a module reads: its stored lists, each one repaired so a reader never
/// has to guess — a stored list missing a built-in gets the built-in back,
/// and a malformed entry is dropped. A reader is never an error.
export function vocabularyOf(config: unknown): TaskVocabulary {
  const stored = (config as Record<string, unknown> | null | undefined)?.[VOCABULARY_KEY];
  const out = defaultVocabulary();
  if (!stored || typeof stored !== 'object') return out;
  for (const kind of ['statuses', 'priorities'] as const) {
    const raw = (stored as Record<string, unknown>)[kind];
    if (!Array.isArray(raw)) continue;
    const seen = new Set<string>();
    const kept: VocabEntry[] = [];
    for (const e of raw) {
      const entry = normaliseEntry(kind, e);
      if (!entry || seen.has(entry.id)) continue;
      seen.add(entry.id);
      kept.push(entry);
    }
    for (const d of out[kind]) if (!seen.has(d.id)) kept.push(d);
    (out as unknown as Record<string, VocabEntry[]>)[kind] = kept;
  }
  return out;
}

function normaliseEntry(kind: ListKind, e: unknown): VocabEntry | null {
  if (!e || typeof e !== 'object') return null;
  const { id, name, colour, countsAs } = e as Record<string, unknown>;
  if (typeof id !== 'string' || typeof name !== 'string' || !name.trim()) return null;
  const builtIn = isBuiltInId(kind, id);
  if (!builtIn && !CUSTOM_ID.test(id)) return null;
  const counts = builtIn ? id : countsAs;
  if (typeof counts !== 'string' || !isBuiltInId(kind, counts)) return null;
  return {
    id,
    name: name.trim().slice(0, MAX_NAME),
    colour: typeof colour === 'string' && HEX.test(colour) ? colour.toUpperCase() : null,
    countsAs: counts,
  };
}

export class VocabularyRefusal extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VocabularyRefusal';
  }
}

let mintCounter = 0;
/// A fresh opaque id. Random, not sequential, so two devices adding an entry
/// at once do not mint the same one.
export function mintEntryId(): string {
  mintCounter += 1;
  return `v${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}${mintCounter.toString(36)}`;
}

/// Checks a proposed list and returns it clean. Throws VocabularyRefusal with
/// a sentence a person can read: this is the message the settings sheet shows.
export function validateList(
  kind: ListKind, proposed: unknown, mint: () => string = mintEntryId,
): VocabEntry[] {
  const noun = kind === 'statuses' ? 'status' : 'priority';
  if (!Array.isArray(proposed)) {
    throw new VocabularyRefusal(`The ${noun} list must be a list.`);
  }
  if (proposed.length > MAX_ENTRIES) {
    throw new VocabularyRefusal(`A module can hold at most ${MAX_ENTRIES} ${kind}.`);
  }
  const out: VocabEntry[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();
  for (const raw of proposed) {
    if (!raw || typeof raw !== 'object') {
      throw new VocabularyRefusal(`Every ${noun} needs a name and what it counts as.`);
    }
    const r = raw as Record<string, unknown>;
    const name = typeof r.name === 'string' ? r.name.trim() : '';
    if (!name) throw new VocabularyRefusal(`A ${noun} needs a name.`);
    if (name.length > MAX_NAME) {
      throw new VocabularyRefusal(`A ${noun} name is at most ${MAX_NAME} characters.`);
    }
    const key = name.toLocaleLowerCase();
    if (names.has(key)) {
      throw new VocabularyRefusal(`Two ${kind} are both called "${name}". Names must differ.`);
    }
    names.add(key);
    let id = typeof r.id === 'string' && r.id ? r.id : '';
    const builtIn = id !== '' && isBuiltInId(kind, id);
    if (!builtIn) {
      if (id && !CUSTOM_ID.test(id)) throw new VocabularyRefusal(`"${name}" has an id that is not allowed.`);
      if (!id) id = mint();
    }
    if (ids.has(id)) throw new VocabularyRefusal(`"${name}" appears twice.`);
    ids.add(id);
    let countsAs: unknown = builtIn ? id : r.countsAs;
    if (typeof countsAs !== 'string' || !isBuiltInId(kind, countsAs)) {
      throw new VocabularyRefusal(
        `"${name}" must count as one of ${BUILT_INS[kind].map((b) => `${b}`).join(', ')}.`);
    }
    if (builtIn) countsAs = id;
    let colour: string | null = null;
    if (r.colour !== undefined && r.colour !== null) {
      if (typeof r.colour !== 'string' || !HEX.test(r.colour)) {
        throw new VocabularyRefusal(`"${name}" has a colour that is not a #RRGGBB value.`);
      }
      colour = r.colour.toUpperCase();
    }
    out.push({ id, name, colour, countsAs: countsAs as string });
  }
  for (const b of BUILT_INS[kind]) {
    if (!ids.has(b)) {
      throw new VocabularyRefusal(
        `The built-in ${noun} "${kind === 'statuses'
          ? DEFAULT_STATUS_NAMES[b as BuiltInStatus]
          : DEFAULT_PRIORITY_NAMES[b as BuiltInPriority]}" always stays in the list, and can only be renamed.`);
    }
  }
  return out;
}

/// What a save changes for the tasks that exist.
export interface ListImpact {
  /// Custom entries the save drops that tasks still reference.
  removed: { id: string; name: string; tasks: number }[];
  /// Custom entries kept whose built-in kind changed: their tasks' enum is
  /// re-stamped so every enum reader agrees with the new declaration.
  recounted: { id: string; from: string; to: string }[];
}

export function impactOf(
  kind: ListKind, before: VocabEntry[], after: VocabEntry[],
  usage: Record<string, number>,
): ListImpact {
  const kept = new Map(after.map((e) => [e.id, e]));
  const removed: ListImpact['removed'] = [];
  const recounted: ListImpact['recounted'] = [];
  for (const e of before) {
    if (isBuiltInId(kind, e.id)) continue;
    const now = kept.get(e.id);
    if (!now) {
      removed.push({ id: e.id, name: e.name, tasks: usage[e.id] ?? 0 });
    } else if (now.countsAs !== e.countsAs) {
      recounted.push({ id: e.id, from: e.countsAs, to: now.countsAs });
    }
  }
  return { removed, recounted };
}

/// Where a removed entry's tasks go: another entry of the SAME list (its
/// built-in id means "no custom entry"). Throws the sentence for a missing
/// or invalid answer.
export function destinationFor(
  kind: ListKind, removedId: string, answer: unknown, after: VocabEntry[],
): VocabEntry {
  const noun = kind === 'statuses' ? 'status' : 'priority';
  const to = typeof answer === 'string' ? after.find((e) => e.id === answer) : undefined;
  if (!to) {
    throw new VocabularyRefusal(
      `Say where the tasks on the ${noun} being taken out should go: pick another ${noun}.`);
  }
  if (to.id === removedId) {
    throw new VocabularyRefusal(`The tasks cannot go to the ${noun} being taken out.`);
  }
  return to;
}

/// The data a task row takes when it is moved onto `entry`: the enum it
/// counts as, and the reference (null for a built-in).
export function stampFor(kind: ListKind, entry: VocabEntry) {
  const ref = isBuiltInId(kind, entry.id) ? null : entry.id;
  return kind === 'statuses'
    ? { status: entry.countsAs, customStatusId: ref }
    : { priority: entry.countsAs, customPriorityId: ref };
}

/// A task write, reconciled with the module's vocabulary. Called on every
/// create and update of a task, with the body as received.
///
///   · naming a custom entry sets the enum it counts as (the custom entry
///     wins over a `status` sent beside it — it is the more specific answer);
///   · naming ONLY a built-in `status`/`priority` clears the reference: the
///     writer chose a built-in kind (the MCP tools, capture, an older app, a
///     tick), so the task is now simply that;
///   · `customStatusId: null` clears the reference and leaves the enum;
///   · naming an entry the module does not have is a refusal.
///
/// Mutates and returns `data`.
export function resolveTaskWrite<T extends Record<string, any>>(
  vocab: TaskVocabulary, data: T,
): T {
  const lists: [ListKind, 'status' | 'priority', 'customStatusId' | 'customPriorityId'][] = [
    ['statuses', 'status', 'customStatusId'],
    ['priorities', 'priority', 'customPriorityId'],
  ];
  for (const [kind, enumKey, refKey] of lists) {
    const ref = data[refKey];
    if (ref === undefined) {
      if (data[enumKey] !== undefined && data[enumKey] !== null) {
        (data as any)[refKey] = null;
      }
      continue;
    }
    if (ref === null) continue;
    const noun = kind === 'statuses' ? 'status' : 'priority';
    const entry = typeof ref === 'string'
      ? vocab[kind].find((e) => e.id === ref && !isBuiltInId(kind, e.id))
      : undefined;
    if (!entry) {
      throw new VocabularyRefusal(`This module has no ${noun} with that id.`);
    }
    (data as any)[enumKey] = entry.countsAs;
  }
  return data;
}

// ══ A WORD A PERSON TYPED, READ AGAINST A MODULE'S LIST ═══════════════════
//
// The capture door (a `| priority: Waiting on HR` or `| status: Blocked` on a
// line in somebody's note) names an entry by its WORDS. The module's own words
// are asked FIRST — every entry of its list, a renamed built-in included — and
// only then the built-in words, so a module that renamed High to "Urgent"
// still reads `| priority: high`, and a module whose custom entry is called
// "High" gets that entry. Case and spacing do not matter. Null when nothing
// matches: the caller never guesses.

/// The words a built-in goes by when nobody renamed it, beyond its default
/// name: the enum's own spelling, and the American spelling of Cancelled.
const BUILT_IN_WORDS: Record<ListKind, Record<string, string>> = {
  statuses: {
    'pending': 'PENDING', 'not started': 'PENDING',
    'in progress': 'IN_PROGRESS', 'done': 'DONE',
    'cancelled': 'CANCELLED', 'canceled': 'CANCELLED',
  },
  priorities: { 'low': 'LOW', 'normal': 'NORMAL', 'high': 'HIGH', 'critical': 'CRITICAL' },
};

const wordKey = (s: string) => s.trim().replace(/\s+/g, ' ').toLocaleLowerCase();

export interface ResolvedWord {
  /// The built-in kind the word stands for.
  countsAs: string;
  /// The custom entry's id, or null when the word is a built-in (renamed or
  /// not) — the same convention as a task's `customStatusId`.
  customId: string | null;
}

export function resolveWord(vocab: TaskVocabulary, kind: ListKind, said: string): ResolvedWord | null {
  const want = wordKey(said);
  if (!want) return null;
  const own = vocab[kind].find((e) => wordKey(e.name) === want);
  if (own) return { countsAs: own.countsAs, customId: isBuiltInId(kind, own.id) ? null : own.id };
  const builtIn = BUILT_IN_WORDS[kind][want.replace(/_/g, ' ')];
  return builtIn ? { countsAs: builtIn, customId: null } : null;
}
