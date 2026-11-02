/* ══ ONE CARE EVENT, AND THE CONFIGURATIONS THAT OFFER IT ══════════════════
 *
 * R-1267 ("expand the medical area to include things for babies, such as
 * breast feeding, duration and time, as well as diaper changing"), R-1268
 * ("also you can fork some for elderly") and R-1270 ("i think a period is
 * like a silent health episode").
 *
 * S-162 F1 ruled the shape: ONE CARE-EVENT PRIMITIVE, with infant and
 * elderly as CONFIGURATIONS, not two modules. So there is one model, one
 * record kind, and one view; what changes between a baby's module and a
 * grandparent's is which kinds the form offers.
 *
 * WHAT MAKES THIS ONE PRIMITIVE AND NOT A PILE OF TRACKERS. Every one of
 * them is the same four facts: WHO it is about, WHAT happened, WHEN it
 * started, and — for the ones that last — when it stopped. A feed is a span.
 * A nappy is a moment. A period is a span that happens to be long. The
 * differences that look like different features are a duration and a detail
 * string, which is why the register's own gaps note says the workaround
 * today is "a Measurements module with custom kinds".
 *
 * A SPAN WITH NO END IS RUNNING, and that is F3's timer ("a running timer,
 * for the 4am feed") with no extra machinery: start the event, and the thing
 * that ends it is the same record being closed. Nothing polls, nothing is
 * stored twice, and an app that dies at 4:07am has not lost the feed.
 *
 * A PERIOD IS AN EPISODE AND NOT A TRACKER (R-1270). It is declared here,
 * beside the feeds and the nappies, because that is the whole content of his
 * sentence: it needs no bespoke shape, no cycle prediction and no calendar
 * of its own — it is a health event with a span, and the product already
 * knows what one of those is.
 */

/** Does this kind take a moment, or a span? */
export type CareShape = 'moment' | 'span';

/** Which form offers it. `both` is everything a household tracks for
 *  anybody — the general case the two configurations sit inside. */
export type CareConfig = 'infant' | 'elderly' | 'both';

export interface CareEventKind {
  /** The stored value. Lowercase, hyphenated, never shown to a reader. */
  kind: string;
  /** What a person calls it. */
  label: string;
  shape: CareShape;
  config: CareConfig;
  /**
   * What the free `detail` column means for this kind, or null where it
   * means nothing. Declared because "a string whose meaning depends on the
   * row" is the thing a reader cannot check — the form needs a label for
   * it and the exporter needs to know whether to print it.
   */
  detail: string | null;
  /**
   * ROWS 1004 / 1005 (S-162 F1/F2) — THE DETAIL IS A TYPE, NOT A NOTE, for
   * the kinds where the study named its values: a nappy is "wet, dirty or
   * both", and a feed's side is left, right or both. Null where the detail
   * is genuinely free ("How much was eaten", "What it is").
   *
   * DECLARED, so the form offers them as taps rather than a text field — a
   * 4am thumb does not type — and the door refuses anything else, because
   * "wet", "Wet " and "wee" stored side by side is three answers to one
   * question and no count of wet nappies can be read off them.
   */
  choices: readonly string[] | null;
  /**
   * REGISTER 1894 (Omar, 2026-10-07) — THE ONE SEX THIS KIND CAN BE ABOUT,
   * or null where it is everybody. DECLARED ON EVERY KIND, null included,
   * so the subject rule is a column of the table and not machinery one kind
   * carries alone (care-events.spec holds every row to the same keys). His words: "it should able to distinguish
   * between male or female users and pets is is specific to female users".
   *
   * Judged against the SUBJECT's recorded sex (Person.sex), and only a
   * RECORDED one refuses: a subject nobody has recorded is offered the kind,
   * because a carer who needs the option and cannot find it has no way to
   * learn the reason is a blank field on somebody's profile.
   */
  onlyFor: 'female' | 'male' | null;
  /** What the door says when [onlyFor] refuses. Declared, not composed, so
   *  the app's offline door says the same words (care_vocabulary_test). */
  onlyForRefusal: string | null;
  /**
   * REGISTER 1894 — NEVER ABOUT THE PERSON LOGGING IT. Set to the sentence
   * the door answers with. A period is "an episode kind, held by the person,
   * reachable only through the episode service" (Omar, 2026-09-29), and the
   * care log keeps its period kind only "for a carer logging somebody they
   * look after" (2026-10-07) — so somebody logging their OWN is sent to the
   * place it is kept.
   */
  notOfSelf: string | null;
  /** Why this kind is in the list, where that is not obvious. */
  why?: string;
}

export const CARE_EVENT_KINDS: readonly CareEventKind[] = [
  // ── infant ────────────────────────────────────────────────────────────
  {
    kind: 'feed-breast',
    label: 'Breastfeed',
    shape: 'span',
    config: 'infant',
    detail: 'Side',
    choices: ['Left', 'Right', 'Both'],
    onlyFor: null,
    onlyForRefusal: null,
    notOfSelf: null,
    why: 'His words name the two facts: "duration and time". A span carries '
      + 'both, and the side is what a parent actually has to remember.',
  },
  {
    kind: 'feed-bottle',
    label: 'Bottle',
    shape: 'span',
    config: 'infant',
    detail: 'Amount',
    choices: null,
    onlyFor: null,
    onlyForRefusal: null,
    notOfSelf: null,
    why: 'A span like the breast feed rather than a moment, because the two '
      + 'are compared and a list where one has a duration and the other does '
      + 'not cannot be read down a column.',
  },
  {
    kind: 'nappy',
    label: 'Nappy change',
    shape: 'moment',
    config: 'infant',
    detail: 'What was in it',
    choices: ['Wet', 'Dirty', 'Both'],
    onlyFor: null,
    onlyForRefusal: null,
    notOfSelf: null,
    why: 'A moment: it takes as long as it takes and nobody times one. The '
      + 'detail is the thing a health visitor asks about.',
  },
  {
    kind: 'sleep',
    label: 'Sleep',
    shape: 'span',
    config: 'both',
    detail: null,
    choices: null,
    onlyFor: null,
    onlyForRefusal: null,
    notOfSelf: null,
  },

  // ── elderly (R-1268: "you can fork some for elderly") ─────────────────
  //
  // FORKED, NOT DUPLICATED. These are the same primitive with different
  // words; none of them needed a new column, which is the evidence that F1
  // was right to refuse two modules.
  {
    kind: 'meal',
    label: 'Meal',
    shape: 'moment',
    config: 'elderly',
    detail: 'How much was eaten',
    choices: null,
    onlyFor: null,
    onlyForRefusal: null,
    notOfSelf: null,
    why: 'The elderly-care equivalent of a feed, and it is a MOMENT: what is '
      + 'recorded is that a meal happened and how much of it went, not how '
      + 'long it took.',
  },
  {
    kind: 'toilet',
    label: 'Toilet',
    shape: 'moment',
    config: 'elderly',
    detail: 'Notes',
    choices: null,
    onlyFor: null,
    onlyForRefusal: null,
    notOfSelf: null,
    why: 'The nappy, for somebody who would not thank you for calling it '
      + 'one. Same shape, different word — which is what a configuration is.',
  },
  {
    kind: 'turn',
    label: 'Repositioned',
    shape: 'moment',
    config: 'elderly',
    detail: null,
    choices: null,
    onlyFor: null,
    onlyForRefusal: null,
    notOfSelf: null,
    why: 'Pressure care is a clock: the fact that matters is WHEN it last '
      + 'happened, and a carer arriving at a shift needs to read that off a '
      + 'list without asking anybody.',
  },
  {
    kind: 'mood',
    label: 'Mood',
    shape: 'moment',
    config: 'both',
    detail: 'How they seemed',
    choices: null,
    onlyFor: null,
    onlyForRefusal: null,
    notOfSelf: null,
  },

  // ── the silent episode (R-1270) ───────────────────────────────────────
  {
    kind: 'period',
    label: 'Period',
    shape: 'span',
    config: 'both',
    detail: null,
    choices: null,
    onlyFor: 'female',
    onlyForRefusal: 'A period is logged only for somebody recorded as female.',
    notOfSelf: 'Your own period is kept in your Cycle module, not in a care log.',
    why: 'HIS OWN SENTENCE: "a period is like a silent health episode." '
      + 'Since 2026-09-29 a person\'s OWN period is an episode she holds, '
      + 'logged through her Cycle module. This kind stays for the case he '
      + 'kept it for on 2026-10-07 — "a carer logging somebody they look '
      + 'after" — so it is offered only where the subject can have one, and '
      + 'never about the person holding the phone.',
  },
  {
    kind: 'symptom',
    label: 'Symptom',
    shape: 'span',
    config: 'both',
    detail: 'What it is',
    choices: null,
    onlyFor: null,
    onlyForRefusal: null,
    notOfSelf: null,
    why: 'The general episode the period is one instance of — a headache '
      + 'that lasted a day, a cough that lasted a fortnight.',
  },
];

export const CARE_CONFIGS: readonly CareConfig[] = ['infant', 'elderly', 'both'];

/**
 * ══ ROWS 1008 / 1009 (S-162 F7) — A CARE RECORD IS NEVER SCORED ══════════
 *
 * "No gamification ever, because a streak on 'days Dad ate breakfast' would
 * be grotesque", and "the care and cycle work displays what was recorded
 * and offers no clinical judgement". Both are about what the product may DO
 * with a care record, and the one machine in the product that scores a
 * record is the streak engine, reached through the `tracks` link role —
 * whose far end was every record kind, care events included.
 *
 * Today a tracked care event comes back "not recorded", because tracksFor
 * has no branch that reads one. That is an accident of what was built
 * first, not a rule, and the first session to add the branch would put a
 * streak on somebody's meals. So the rule is declared here, by the
 * vocabulary it protects, and the link door reads it.
 *
 * `episodes` joined the linkable vocabulary on 2026-10-07 (rows 1754/1837,
 * "Both join"), and an illness or a recovery is a care record's course: it
 * is declared here too, so the streak's refusal of it is this rule and not
 * only the owner-scoped one that lets it carry `about` alone.
 */
export const CARE_NEVER_SCORED: readonly string[] = ['care-events', 'episodes'];

/** The kinds a module in this configuration offers. */
export function careKindsFor(config: string | null | undefined): CareEventKind[] {
  const want = CARE_CONFIGS.includes(config as CareConfig)
    ? (config as CareConfig)
    // AN UNSET CONFIGURATION OFFERS EVERYTHING. A module nobody has
    // configured is not a broken one, and a form with no options in it is
    // how somebody concludes the feature does not work.
    : 'both';
  if (want === 'both') return [...CARE_EVENT_KINDS];
  return CARE_EVENT_KINDS.filter((k) => k.config === want || k.config === 'both');
}

export function careKind(kind: string | null | undefined): CareEventKind | null {
  return CARE_EVENT_KINDS.find((k) => k.kind === kind) ?? null;
}

/** Who a care event would be about, as far as the subject rules ask. */
export interface CareSubject {
  /** Person.sex — 'female', 'male', or null/undefined where nobody said. */
  sex?: string | null;
  /** Is the subject the person doing the logging? */
  isLogger: boolean;
}

/** Does this kind ask anything of its subject at all? Lets the door skip
 *  reading the person for every feed and nappy. */
export function careKindAsksSubject(kind: string | null | undefined): boolean {
  const k = careKind(kind);
  return !!k && (k.onlyFor !== null || k.notOfSelf !== null);
}

/**
 * ══ REGISTER 1894 — CAN THIS KIND BE ABOUT THIS PERSON? ═══════════════════
 *
 * Null when it can; otherwise the sentence the door refuses with. The same
 * answer decides what the form OFFERS (the app's twin, grCareSubjectRefusal),
 * so a kind the form shows is a kind the door takes.
 *
 * AN UNRECORDED SEX OFFERS THE KIND. Only a recorded sex that differs
 * refuses — a missing profile field must not hide a carer's option.
 */
export function careSubjectRefusal(
  kind: string | null | undefined,
  subject: CareSubject,
): string | null {
  const k = careKind(kind);
  if (!k) return null;
  if (k.notOfSelf && subject.isLogger) return k.notOfSelf;
  if (k.onlyFor && subject.sex && subject.sex !== k.onlyFor) {
    return k.onlyForRefusal ?? `${k.label} is not logged for this person.`;
  }
  return null;
}

/** The kinds a module in [config] offers for this subject. */
export function careKindsForSubject(
  config: string | null | undefined,
  subject: CareSubject,
): CareEventKind[] {
  return careKindsFor(config).filter((k) => careSubjectRefusal(k.kind, subject) === null);
}

/**
 * The detail as it should be STORED, or an error sentence.
 *
 * Only a kind that declares choices is checked; for every other kind the
 * detail is free and comes back untouched. A match ignores case and the
 * spaces round it, and answers with the DECLARED spelling, so "left " and
 * "LEFT" are stored as the one word "Left" rather than refused — the door
 * refuses a different answer, not a different keyboard.
 *
 * Null and empty pass: a nappy logged with one tap and no detail is still a
 * nappy change, and forcing a choice would make the one-tap strip a form.
 */
export function careDetail(
  kind: string | null | undefined,
  detail: unknown,
): { ok: true; value: string | null | undefined } | { ok: false; error: string } {
  const choices = careKind(kind)?.choices;
  if (!choices || detail === undefined || detail === null) {
    return { ok: true, value: detail as string | null | undefined };
  }
  const said = String(detail).trim();
  if (said === '') return { ok: true, value: null };
  const hit = choices.find((c) => c.toLowerCase() === said.toLowerCase());
  if (hit) return { ok: true, value: hit };
  return {
    ok: false,
    error: `${careKind(kind)!.label}: ${careKind(kind)!.detail} is one of `
      + `${choices.join(', ')}`,
  };
}

/** Does this kind last? */
export function careSpans(kind: string | null | undefined): boolean {
  return careKind(kind)?.shape === 'span';
}

/**
 * Is this event still running?
 *
 * A SPAN WITH NO END. Only a span can run — a nappy with no end date is not
 * an ongoing nappy, it is a moment, and treating one as running would put a
 * stop button on a record nobody started.
 */
export function careRunning(
  e: { kind?: string | null; endedAt?: Date | null } | null | undefined,
): boolean {
  if (!e) return false;
  return careSpans(e.kind) && e.endedAt == null;
}

/** How long it lasted, in minutes, or null while it is still running. */
export function careMinutes(
  e: { startedAt?: Date | null; endedAt?: Date | null } | null | undefined,
): number | null {
  if (!e?.startedAt || !e.endedAt) return null;
  const ms = e.endedAt.getTime() - e.startedAt.getTime();
  // A NEGATIVE DURATION IS NOT A DURATION. It means somebody typed an end
  // before the start, and answering "-40 minutes" would put that number in
  // a total.
  return ms < 0 ? null : Math.round(ms / 60000);
}
