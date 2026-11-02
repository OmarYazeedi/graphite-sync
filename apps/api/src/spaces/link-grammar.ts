/// ══ R-1159 — THE LINK TYPES, AND WHAT EACH OF THEM CAN REACH ════════════
///
/// Omar, on the shipped rail: "pinning a note works but i dont like the idea
/// of how the linking work, ive seen that you have used the same idea in
/// different places already but how will the user link things with a text
/// field, it should be more initiative, first show available link types then
/// it should show the modules".
///
/// "FIRST SHOW AVAILABLE LINK TYPES" IS NOT A LAYOUT INSTRUCTION. It is a
/// question the product could not answer: available to WHAT? The rail led
/// with a search box precisely because there was nothing else it could lead
/// with — LINK_ROLES is a flat list of names and the only statement
/// of what any of them means is a trailing comment on its own line:
///
///     'proof',        // expense <- document
///     'supply',       // medication/asset <- supply item
///     'checklist-of', // checklist <- task
///
/// Those comments are the grammar. They are also unreadable by the picker,
/// so a person was offered `realises` on a note and `checklist-of` on a
/// medication, and the only way to find the far end was to type at it.
///
/// THIS FILE IS THOSE COMMENTS, PROMOTED. Each role says who may sit at each
/// end, so the rail can show the types a THIS record can actually use, and
/// then the modules that hold what each type reaches. The comments stay
/// where they are — they are how the roles are read in the service — but
/// they are no longer the only copy, and link-grammar.spec.ts holds the two
/// to each other.
///
/// AND SOME TYPES ARE NOT A PERSON'S TO MAKE, which is the sharpest reason
/// the list had to exist at all. `plans`, `nests` and `chain` are the Plan's
/// own grammar: they are written by dragging on the stage, and addPlanLink
/// refuses a cycle with the path named before writing one. The generic
/// POST /links runs no such guard — so the rail was offering, in a dropdown,
/// three roles that could put a plan into a state its own engine exists to
/// prevent. They are declared unoffered here AND refused at that door.
///
/// ══ REGISTER 2519 — THE OBSIDIAN PLUGIN BUNDLES THIS FILE ════════════════
///
/// Omar, 2026-10-07: "i want most or all the work to be done by the plugin
/// on device not to overload the server". So the plugin's link picker reads
/// THIS table, compiled into its bundle the way vault-anchor.ts already is,
/// and the ROLE half of the picker ("which types may this record take")
/// needs no server call and works offline. Only the targets and the write
/// go to the server.
///
/// THAT MAKES THIS FILE A LEAF. It may import only files that import
/// nothing (care-events.ts is pure data), because everything it imports is
/// bundled into the plugin too — a service, Nest or Prisma reached from here
/// would be shipped inside Obsidian. It used to import RecordKind from the
/// kind registry for a type alias nothing read; that alias is gone.
/// plugin-link-grammar.spec.ts holds the import list.

import { CARE_NEVER_SCORED } from '../shared/care-events';

/// ══ THE OWNER-SCOPED KINDS, AS DATA (rows 1754/1837, merge M-S6) ═════════
///
/// A template and an episode are the USER's, not a space's, and either end
/// of a link to one carries one role. They are declared HERE, as plain data,
/// because this file is the leaf the Obsidian plugin bundles (register 2519,
/// plugin-link-grammar.spec): it may import nothing that imports anything.
/// owner-scoped.ts, which reads them with custody's rules, takes them from
/// here — the other way round would pull custody into the plugin.
export const OWNER_SCOPED_KINDS = [
  'checklist-templates',
  'episodes',
] as const;
export type OwnerScopedKind = (typeof OWNER_SCOPED_KINDS)[number];

/** The one role either end may carry — owner-scoped.ts's header says why. */
export const OWNER_SCOPED_ROLE = 'about';

export function isOwnerScopedKind(kind: string): kind is OwnerScopedKind {
  return (OWNER_SCOPED_KINDS as readonly string[]).includes(kind);
}

/// Which end of a link a rule is about.
export type LinkEnd = 'any' | readonly string[];

export interface RoleGrammar {
  /// The household's words for this type. The picker's first screen is a
  /// list of these, so they are phrases rather than the wire name: nobody
  /// has ever wanted to make a `checklist-of`.
  label: string;
  /// The kinds that may sit at the NEAR end — the record whose rail is open.
  from: LinkEnd;
  /// The kinds that may sit at the FAR end — what the picker then shows.
  to: LinkEnd;
  /// Kinds the far end never reaches even when `to` is 'any' — the same
  /// list the door refuses (link-role-ends), so the picker does not offer
  /// a link the server will turn down.
  notTo?: readonly string[];
  /// Kinds the NEAR end never is even when `from` is 'any' — the same list
  /// the door refuses (link-role-ends' notFrom). Register 853: a document's
  /// rail does not offer "Proved by", because a document is the proof.
  notFrom?: readonly string[];
  /// Is this a type a PERSON picks? False for the ones the product writes
  /// on their behalf, where offering it by hand would either duplicate a
  /// mechanism or bypass a guard.
  offered: boolean;
  /// Why not, for the ones that are not. Read by nobody at runtime and by
  /// everybody who wonders where `chain` went.
  unofferedBecause?: string;
}

/// THE PLAN'S OWN GRAMMAR. Written by the stage, guarded by addPlanLink's
/// cycle check, and refused at the generic link door — see links.service.
export const PLAN_ROLES: readonly string[] = ['plans', 'nests', 'chain'];

/// Every role in LINK_ROLES, with both its ends. A WHOLE-LIST table: a role
/// added to the vocabulary and not here is a role the picker cannot offer
/// and nobody would notice, which is the shape of every gap this lane has
/// spent the week repairing.
export const LINK_GRAMMAR: Record<string, RoleGrammar> = {
  about: {
    label: 'Related to',
    from: 'any',
    to: 'any',
    offered: true,
  },
  mirrors: {
    // R-1156's counterpart. A person CAN say two records are the same
    // entry — the bridges write it automatically, and saying so by hand is
    // the same statement.
    label: 'The same entry as',
    from: 'any',
    to: 'any',
    offered: true,
  },
  assigned: {
    label: 'Assigned to',
    from: 'any',
    to: ['people'],
    offered: true,
  },
  at: {
    // R-223/R-499: a place is a LOCATION reference and there is one home
    // for it. The picker therefore shows Places and Lists, not a map.
    label: 'Happens at',
    from: 'any',
    to: ['references'],
    offered: true,
  },
  costs: {
    // W10: money has one home, so the far end is always a ledger row.
    label: 'Cost',
    from: 'any',
    to: ['expenses'],
    offered: true,
  },
  realises: {
    // An ACTUAL figure settling a PLANNED one, in whole or in part. Both
    // ends are ledger rows, which is why it must not be offered from a
    // note — and was.
    label: 'Settles the planned',
    from: ['expenses'],
    to: ['expenses'],
    offered: true,
  },
  proof: {
    label: 'Proved by',
    from: 'any',
    // Register 853: Documents is a terminal — see link-role-ends.
    notFrom: ['documents'],
    to: ['documents'],
    offered: true,
  },
  supply: {
    // D9: what restocks this. A course and an asset are the two things
    // that run out.
    label: 'Restocked by',
    from: ['medications', 'assets'],
    to: ['supplies'],
    offered: true,
  },
  'checklist-of': {
    // R-473: direction is task → its checklist.
    label: 'Broken down into',
    from: ['tasks'],
    to: ['checklist-items'],
    offered: true,
  },
  needs: {
    label: 'Needs',
    from: ['events', 'visits'],
    to: ['checklist-items', 'supplies'],
    offered: true,
  },
  tracks: {
    // The streak engine's subject: what this goal or habit is counting.
    label: 'Tracks',
    from: ['goals', 'habits'],
    to: 'any',
    // Rows 1008/1009 (S-162 F7): a care record is never a streak's subject.
    notTo: CARE_NEVER_SCORED,
    offered: true,
  },
  follow: {
    // ROW 1782 (TETHER), arrived from another lane in the same week as this
    // table. A derived entry points at the one it came from — a task made
    // from a template, an expense split out of another — and the direction
    // is DERIVED -> SOURCE, because the copy is what knows.
    //
    // OFFERED, and the phrase is the household's rather than the wire
    // name: "where did this come from" is a question a person asks, and
    // lineageFor is a reader that already answers it. Any kind may be
    // derived from any kind, so neither end narrows.
    label: 'Came from',
    from: 'any',
    to: 'any',
    offered: true,
  },
  schedules: {
    label: 'Schedules',
    from: ['modules'],
    to: ['modules'],
    offered: false,
    unofferedBecause:
      'MODULE WIRING, NOT A RECORD\'S BUSINESS. A calendar shows a tasks '
      + 'module as a live view; the pair is chosen in the calendar\'s own '
      + 'settings, where the thing being wired is on screen.',
  },
  views: {
    label: 'Views',
    from: ['modules'],
    to: ['modules'],
    offered: false,
    unofferedBecause:
      'THE SAME AS `schedules`: a table views a module, and the binding is '
      + 'made in the table, not on a record\'s rail.',
  },
  plans: {
    label: 'On the plan',
    from: ['modules'],
    to: 'any',
    offered: false,
    unofferedBecause:
      'THE PLAN\'S OWN MEMBERSHIP. It carries lane and order on its config '
      + 'and is written by putting something on the stage; a hand-made one '
      + 'would arrive in no lane and at no position.',
  },
  nests: {
    label: 'Inside',
    from: 'any',
    to: 'any',
    offered: false,
    unofferedBecause:
      'PART OF THE PLAN\'S DAG. addPlanLink refuses a cycle with the path '
      + 'named ("that would make X wait for itself"); the generic link door '
      + 'runs no such guard, so offering it here would let a person put a '
      + 'plan into the state its own engine exists to prevent.',
  },
  chain: {
    label: 'Then',
    from: 'any',
    to: 'any',
    offered: false,
    unofferedBecause:
      'THE SAME DAG, and worse: a chain also carries a type, a gap and a '
      + 'direction (R-1155) that a bare role picker has nowhere to ask '
      + 'for. It is made by dragging on the stage, where the two ends are '
      + 'visible and the gap is what you just dragged.',
  },
  recipe: {
    // REGISTER 1884: the written form of MealSlot.recipeId (raw-refs.ts).
    label: 'Cooked from',
    from: ['meal-slots'],
    to: ['recipes'],
    offered: false,
    unofferedBecause:
      'A JOIN, NOT A LINK A PERSON DRAWS. It is the meal slot\'s own recipe '
      + 'column, written by the slot\'s recipe picker and kept equal to it '
      + 'by join-links.ts; a slot is cooked from one recipe, so a second one '
      + 'drawn on the rail would be a second answer to a question the form '
      + 'already asks. The generic link door refuses it.',
  },
  appears: {
    // REGISTER 759 (R-4654): an entry shown in another module of its space.
    label: 'Also in',
    from: ['modules'],
    to: 'any',
    offered: false,
    unofferedBecause:
      'MADE FROM THE ENTRY, NOT THE RAIL. Adding an entry to another module '
      + 'asks two things a link picker cannot: that the module is in the '
      + 'entry\'s own space, and that its shape can show the kind '
      + '(appearances.ts). The generic link door refuses it.',
  },
};

const admits = (end: LinkEnd, kind: string): boolean =>
  end === 'any' || end.includes(kind);

/// The types a person may pick FROM a record of this kind.
///
/// Order is the declaration's, which is the order the picker shows: the
/// general ones first, then the ones that only apply to a few kinds.
export function rolesFor(kind: string): Array<RoleGrammar & { role: string }> {
  return Object.entries(LINK_GRAMMAR)
    .filter(([role, g]) => g.offered && admits(g.from, kind)
      && !g.notFrom?.includes(kind)
      // Rows 1754/1837 (R-4727): a template or an episode is offered the
      // one role the door lets it carry (owner-scoped.ts).
      && (!isOwnerScopedKind(kind) || role === OWNER_SCOPED_ROLE))
    .map(([role, g]) => ({ role, ...g }));
}

/// The kinds the picker should then show, for one type.
///
/// `any` is resolved against the caller's list rather than left as a word,
/// because the client would otherwise need its own idea of what "any" is —
/// which is the second copy this file exists to avoid.
export function targetKindsFor(role: string, all: readonly string[]): string[] {
  const g = LINK_GRAMMAR[role];
  if (!g) return [];
  const reach = g.to === 'any' ? [...all] : all.filter((k) => (g.to as readonly string[]).includes(k));
  return reach.filter((k) => !g.notTo?.includes(k)
    && (role === OWNER_SCOPED_ROLE || !isOwnerScopedKind(k)));
}

/// Is this a role the generic link door may write?
export const isPlanRole = (role: string): boolean => PLAN_ROLES.includes(role);
