/* ══ OC5 — YOUR AGENT WRITES PROPOSALS AGAINST A CLOSED LIST ═══════════════
 *
 * Omar 2026-09-23: "agent now, server later". His own agent (Cowork, Claude
 * Code) turns prose into italic proposals. It is a PURE FILE WRITER: it reads
 * the notes he allows and two files this plugin publishes into the vault, and
 * writes proposals in OC4's format. It holds no Graphite credential and makes
 * no API call; only the plugin, on his approval, talks to the server.
 *
 * THE TWO FILES:
 *   · the ROUTING LIST — the spaces, modules and tags he may route to, which
 *     is the CLOSED SET the agent chooses from;
 *   · the AGENT BRIEF — the proposal format, the two behaviours ("prose is
 *     proposed from; lists are filed as written", 2026-09-24), and the rules.
 *
 * A CLOSED LIST MEANS NO GENERATED VOCABULARY. An agent that invents a tag or
 * a space has escaped the contract, and the escape is silent: the server
 * refuses a space or module it cannot find, but it CREATES a tag it has never
 * seen. So the brief is not the only guard — [contractProblems] is asked at
 * approval, and a proposal carrying a term outside the published list is held
 * until he corrects it. Nothing an agent invents becomes real unedited.
 *
 * THIS CYCLE THE AGENT'S OTHER GUARDS ARE INSTRUCTIONS, NOT CODE — which
 * folders it reads, the #private veto — and the brief says so. Note text
 * leaves his machine to the agent's own model provider, never to Graphite,
 * and the brief says that too rather than implying nothing leaves.
 *
 * PURE: no `obsidian`. The plugin's suite drives it through the bundle.
 */

import { PROPOSAL_TAIL, readRouteToken } from '../../../apps/api/src/spaces/vault-anchor';
import { parseVaultTags } from '../../../apps/api/src/spaces/vault-tags';
import { Route, tokenName } from './routing';

/** Where the two files live — the plugin's own, in the vault's Graphite/ folder. */
export const ROUTING_LIST_PATH = 'Graphite/Routing list.md';
export const AGENT_BRIEF_PATH = 'Graphite/Agent brief.md';
/** Where the brief tells the agent to write its run reports. */
export const AGENT_RUNS_FOLDER = 'Graphite/Agent runs/';

/** The plugin's and the agent's own files: never captured, ticked or counted.
 *  The routing list names every tag, and a census that read it would match
 *  every meeting it was published beside. */
export function isAgentFile(path: string): boolean {
  return path === ROUTING_LIST_PATH || path === AGENT_BRIEF_PATH
    || path.startsWith(AGENT_RUNS_FOLDER);
}

export interface RoutingList {
  /** When this list was built from Graphite. */
  at: string;
  spaces: { token: string; path: string; tags: string[]; modules: string[] }[];
  tags: string[];
}

/** The closed set: every routable space (OC3's own filter — never a person,
 *  a closed space, or one he may only view), its modules, and every tag in
 *  his vocabulary or on a space. Spelling kept, compared without case. */
export function routingListOf(routes: readonly Route[], vocabulary: readonly string[], at: string): RoutingList {
  const spaces = [...routes]
    .sort((a, b) => a.path.join(' › ').localeCompare(b.path.join(' › ')))
    .map((r) => ({
      token: tokenName(r, routes as Route[]),
      path: r.path.join(' › '),
      tags: [...r.tags],
      modules: r.modules.map((m) => m.name),
    }));
  const seen = new Map<string, string>();
  for (const t of [...vocabulary, ...routes.flatMap((r) => r.tags)]) {
    const k = t.replace(/^#/, '').toLowerCase();
    if (k && !seen.has(k)) seen.set(k, t.replace(/^#/, ''));
  }
  return { at, spaces, tags: [...seen.values()].sort((a, b) => a.localeCompare(b)) };
}

const lc = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

/** Why a PROPOSAL line may not be approved as written — empty when it may.
 *  Every term it names must be on the list: the `>>` space (by its token or
 *  its path), the module after ` / `, and every tag. A question — `>> ?`, or
 *  two spaces `>> A | B` — is his to answer before anything is created. */
export function contractProblems(line: string, list: RoutingList | null): string[] {
  const marker = PROPOSAL_TAIL.exec(line);
  if (!marker || marker.index === undefined) return [];
  const body = line.slice(0, marker.index);
  const bar = body.indexOf(' | ');
  const words = bar < 0 ? body : body.slice(0, bar);
  const fields = bar < 0 ? [] : body.slice(bar + 3).split(' | ').map((f) => f.trim()).filter(Boolean);
  const out: string[] = [];
  const { token } = readRouteToken(words);
  const tags = parseVaultTags(words).tags;
  if (!list) {
    if (token || tags.length) out.push('there is no routing list yet — connect to Graphite so one is published');
    return out;
  }
  // `>> A | B`: the alternatives ride after the token as fields with no
  // `key:` — a question, and the line would otherwise go to A silently.
  const alternatives = fields.filter((f) => !/^[a-z_]+\s*:/i.test(f));
  if (token && (!token.space || alternatives.length)) {
    out.push(token.space ? `it asks which space (${[token.space, ...alternatives].join(' or ')}) — keep one`
      : 'it asks which space (`>> ?`) — name one from the routing list');
  }
  if (token && token.space && !alternatives.length) {
    const space = list.spaces.find((s) => lc(s.token) === lc(token.space) || lc(s.path) === lc(token.space));
    if (!space) out.push(`\`>> ${token.space}\` is not in the routing list`);
    else if (token.module && !space.modules.some((m) => lc(m) === lc(token.module!))) {
      out.push(`${space.token} has no module "${token.module}" in the routing list`);
    }
  }
  const known = new Set(list.tags.map((t) => t.toLowerCase()));
  for (const t of tags) {
    if (!known.has(t.toLowerCase())) out.push(`#${t} is not in the routing list`);
  }
  if (fields.some((f) => /^assigned\s*:/i.test(f))) {
    out.push('it names a person — people are not in the routing list, so assign it in Graphite');
  }
  return out;
}

const code = (s: string) => `\`${s.replace(/`/g, "'")}\``;

/** The routing list as a note. Tags are written inside code spans, so
 *  Obsidian does not count this file as using them, and no reader of the
 *  vault mistakes it for a note about every tag at once. */
export function routingListNote(list: RoutingList, stale: string | null): string {
  const rows = list.spaces.map((s) =>
    `| ${code(`>> ${s.token}`)} | ${s.path} | ${s.tags.map((t) => code(`#${t}`)).join(' ') || '—'} | ${s.modules.join(' · ') || '—'} |`);
  return [
    '---', 'graphite: routing-list', `generated: ${list.at}`, '---',
    '# Routing list',
    '',
    '> Written by the Graphite plugin and rewritten from Graphite — edits here are lost.',
    '> **This is the closed list.** A space, a module or a tag that is not below is not one',
    '> your agent may write. Read [[Agent brief]] first.',
    ...(stale ? ['', `> **Could not refresh at ${stale}.** Graphite could not be reached, so this is`,
      `> the list from ${list.at}. Spaces made since then are not on it.`] : []),
    '',
    '## Spaces',
    '',
    '| Write | Where it is | Its tags | Its modules |',
    '|---|---|---|---|',
    ...(rows.length ? rows : ['| — | no space you can write to | — | — |']),
    '',
    '## Tags',
    '',
    list.tags.length ? list.tags.map((t) => code(`#${t}`)).join(' · ') : 'None yet.',
    '',
    '## The same list, for a program',
    '',
    '```json',
    JSON.stringify({ at: list.at, spaces: list.spaces, tags: list.tags }, null, 1),
    '```',
    '',
  ].join('\n');
}

/** The agent brief as a note. Every rule here is an instruction to a model,
 *  not code — except the closed list, which approval also checks. */
export function agentBriefNote(folders: readonly string[]): string {
  const where = folders.length
    ? folders.map((f) => `- \`${f}\``).join('\n')
    : '- **None yet.** Read nothing until he lists a folder in the Graphite Sync settings.';
  return [
    '---', 'graphite: agent-brief', '---',
    '# Agent brief',
    '',
    '> Written by the Graphite plugin. This is the whole contract between your agent and',
    '> Graphite. Edits here are lost — change the settings instead.',
    '',
    '## What you are',
    '',
    '- You **write files**. You hold no Graphite login and you make no call to Graphite.',
    '- What you write are **proposals**: nothing becomes a task until he approves it.',
    '- [[Routing list]] is everything you know about Graphite. It is a **closed list**:',
    '  a space, module or tag that is not on it is not one you may write. Never invent',
    '  one, never re-spell one. If nothing fits, leave the line without a destination.',
    '',
    '## Where you may read',
    '',
    where,
    '',
    '- **Never** a note tagged `#private`, or whose frontmatter says `graphite: false`.',
    '- **Never** a note whose frontmatter has `lp_type:` — Graphite rewrites those.',
    '- Never the two files in `Graphite/` except to read them.',
    '',
    '## Two behaviours, read section by section',
    '',
    'A daily note is often a meeting, a to-do list and a thought at once, so decide per section:',
    '',
    '- **Prose is proposed from** — a meeting or his own thinking alike. Put each proposal',
    '  directly under the paragraph it came from. A small proposal is a good run: one task',
    '  out of six things discussed is right if only one needs doing.',
    '- **Lists are filed as written.** Never rewrite a line he wrote in a list. You may',
    '  propose a plain bullet as a task, or ask where a checkbox line goes — nothing more.',
    '',
    '## The proposal format, exactly',
    '',
    '```',
    '- [ ] *what needs doing* >> Space token | due: 2026-10-04 | lp: p_k3x9q2m7',
    '```',
    '',
    '- The words in *italic*; nothing else on the line in italic.',
    '- `>> ` and a token copied from the routing list, or no `>>` at all.',
    '- `| due:` only as `YYYY-MM-DD`, and only when the note gives the date. A day like',
    '  "Thursday" counts from the **note\'s own date**, never from today.',
    '- `| lp: p_` and eight new lowercase letters or digits — a new key for every proposal.',
    '- Tags only from the routing list, written `#like/this`.',
    '',
    '## Never guess — ask',
    '',
    '- **A space:** when two fit, write both — `>> IS-07 Station | IS-12 Station` — and he keeps one.',
    '  When none fits, write `>> ?`. A line that asks cannot be approved until he answers.',
    '- **A date:** no date beats a wrong one. Leave `| due:` off.',
    '- **A person:** people are not on the routing list. Never write `| assigned:`; name the',
    '  person in the words if the note does.',
    '',
    '## Say what you skipped',
    '',
    `At the end of every run, write \`${AGENT_RUNS_FOLDER}<date> <time>.md\`: the notes you read,`,
    'the notes you skipped and why (`#private`, outside the folders above, unreadable), and',
    'the proposals you wrote. A run that read nothing says so — silence is not a clean run.',
    '',
    '## What leaves this machine',
    '',
    '- **The text of every note you read goes to your own model provider** — whichever',
    '  company runs the model behind this agent. It does not go to Graphite.',
    '- Graphite receives only what he approves, and only when he approves it.',
    '- **These rules are instructions, not code.** The folders above and the `#private`',
    '  veto hold only because you follow them. The closed list is also checked by the',
    '  plugin at approval: a proposal naming anything off the list is held, not created.',
    '',
  ].join('\n');
}
