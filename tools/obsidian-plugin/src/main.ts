// R-231/R-290: Graphite Sync — the Graphite <-> Obsidian bridge, v2.
// Rides the SAME contracts as the app:
//   Pull  — GET  /api/spaces/:id/export.md  → vault file (server-canonical)
//   Push  — POST /api/spaces/import.md {mode:'merge'} → validate-first;
//           errors surface with line numbers, nothing half-lands.
//
// v2 (R-290): a Sync panel (right sidebar) showing connection + server
// version, per-file sync state (in sync / local edits / server changed /
// file missing), per-row pull/push/check actions, a fuzzy space chooser,
// any number of spaces per vault, and an in-panel explanation of how the
// sync works. Optional auto-push on save (off by default). Each vault has
// its own plugin config (server, token, mappings) — so different vaults
// can sync different spaces, or different servers entirely.
//
// Build: npm install && npm run build → copy manifest.json + main.js into
// <vault>/.obsidian/plugins/graphite-sync/ and enable it.

import {
  App, Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo,
  FileSystemAdapter, FuzzySuggestModal, ItemView, Modal, Notice, Platform,
  Plugin, PluginSettingTab, Setting, TFile, WorkspaceLeaf, requestUrl,
} from 'obsidian';
import { RangeSetBuilder } from '@codemirror/state';
import { FF_ENDS, FF_STARTS, LP_ID_RE, isMarkerHeaderCell, lpHiddenRanges } from './lp-ids';
import { LP_TAIL, PROPOSAL_TAIL } from '../../../apps/api/src/spaces/vault-anchor';
import { sectionNamesModule } from '../../../apps/api/src/spaces/vault-route';
import { finalised, approvedText, lineOfKey, proposalsIn, readProposal } from './proposals';
import {
  RawSpace, Route, buildRoutes, filterRoutes, frontmatterFor, frontmatterRange, insertionFor,
  makeTasks, noteSpace, routable, routeTrigger, sectionFor,
} from './routing';
import {
  mergeTick, tickOf, withTick, type TickState,
} from '../../../apps/api/src/spaces/vault-tick';
import { censusOf, inCensus, localDay, noteDay, type CensusNote } from './census';
import { bodyLines } from './note-lines';
import {
  addTag, asTaskLine, cleanTag, insertBlock, isCaptured, listStart, nextTaskLine, priorityChoices, readField, setField,
} from './toolbar-lines';
import { readDue } from './toolbar-due';
import {
  type ListKind, destinationOf, listTargets, suggestedTarget, targetLabel, targetToken, taskModuleOf,
} from './toolbar-where';
import {
  type ToolbarLists, type ToolbarPerson, TOOLBAR_LISTS_PATH, buildLists, listsFile, readListsFile, sameLists, wordsFromSettings, type ToolbarWords,
} from './toolbar-lists';
import { DueModal, PickModal, type Anchor, type PickItem } from './toolbar-ui';
import { barWanted } from './toolbar-bar';
import { isToolbarFile } from './toolbar-lists';
import { type BarPane, drawBar } from './toolbar-mount';
import {
  AGENT_BRIEF_PATH, ROUTING_LIST_PATH, type RoutingList, agentBriefNote, contractProblems,
  isAgentFile, routingListNote, routingListOf,
} from './agent';
import {
  Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate,
} from '@codemirror/view';
// REGISTER 2519: the links panel and the role-first picker (links.ts says
// how the panel stays out of the way of typing); REGISTER 1527: the version
// handshake.
import { LinkLogFeed, NOT_A_RECORD, RecordRef, Spot, readLinkLog, recordAt, type LinkLog } from './links';
import { LINKS_VIEW, LinksView, pickLink } from './links-panel';
import { Handshake, outdatedSentence, readHandshake } from './handshake';
// THIS DEVICE: the Graphite app on the same device as a place to get spaces
// from, with no server (device-mirror.ts says what is read of what it leaves).
import { lookForMirror, mirrorSentence, mirrorShort, type MirrorLook } from './device-mirror';
export { MIRROR_INDEX, ago, lookForMirror, mirrorSentence, mirrorShort } from './device-mirror';
// THIS COMPUTER: the Graphite app on the same machine as a place to read
// spaces from, with no server (device-door.ts says how it is found).
import {
  doorBase, doorFileCandidates, doorSentence, doorShort, findDoor, type DoorLook,
} from './device-door';
export { DOOR_ENV, doorFileCandidates, findDoor, readDoor } from './device-door';
// The pure halves, exported so the suite can read them off the bundle.
export { isBelow, readHandshake } from './handshake';
export { recordAt, pickerRoles } from './links';
// R-062: the marker readers, exported so the suite can read them off the bundle.
export { lpHiddenRanges, isMarkerHeaderCell } from './lp-ids';
export { Pacer } from './pacer';
export { noteSpace, frontmatterFor, buildRoutes } from './routing';
export { readProposal, finalised, approvedText, proposalLine, proposalsIn } from './proposals';
export { censusOf } from './census';
export { agentBriefNote, contractProblems } from './agent';
// R-8336: a notebook page is its own file; what a vault rename says about it.
import { isPageText, notebookDirOf, pageIdOf, pageRenameOf, setPageFields } from './page-files';
export {
  baseOf, dirOf, isPageText, notebookDirOf, pageFieldsOf, pageIdOf, pageRenameOf, setPageFields,
} from './page-files';
// THE GRAPHITE BAR: what the pickers write and where a line goes, exported for the suite.
export * from './toolbar-lines';
export * from './toolbar-due';
export * from './toolbar-where';
export { BAR_BUTTONS, MOBILE_TARGET_PX } from './toolbar-bar';
export { buildLists, listsFile, readListsFile, sameLists, TOOLBAR_LISTS_PATH, isToolbarFile } from './toolbar-lists';
// R-364: the one module-name table, via the api's committed copy (esbuild
// inlines it at build time). The picker used to lowercase the raw enum — a
// fourth accidental naming table.
import MODULE_NAMES from '../../../apps/api/src/spaces/module-names.json';
// ROW 2376: the throttle the server puts on the last-used stamp of a
// session, so "seen in the last ten minutes" in the device list moves when
// the number on the server does.
import { SESSION_STAMP_EVERY_MS } from '../../../apps/api/src/auth/session-stamp';
// ROW 2375: whole-vault note sync (spec_2375_graphite_sync.md) and the
// settings note. Exported as well, so the tests reach them through the
// bundle Obsidian loads rather than through the source.
import { CouchClient, LIVE_WAIT_MS, LiveFollower, noteLiveBadge, type LiveState } from './couch-client';
import { NOTE_SYNC_KINDS, NOTE_SYNC_LABELS, type NoteSyncKind, type TransportCheck } from './note-sync';
import { SETTINGS_NOTE_PATH, noteMatches, readSettingsNote, settingsNoteText } from './sync-config';
import { PageSync, pageModuleFor, parseFolders } from './pages';
import { CouchNoteTransport } from './couch-notes';
import {
  NoteSyncEngine, emptyNoteSyncState, type NoteBaseStore, type NoteSyncReport, type NoteSyncState,
  type NoteVault,
} from './note-engine';
import { sha256Hex as noteSha } from './note-crypto';
import { carryIds, mergeLines } from './note-merge';
import { Pacer } from './pacer';
import { conflictCopyPath } from './note-engine';
export {
  CouchClient, CouchDocSync, CouchError, LiveFollower, COUCH_DB_NAME, PULL_PAGE,
  LIVE_BACKOFF_FIRST_MS, LIVE_BACKOFF_MAX_MS, noteLiveBadge,
} from './couch-client';
export { NOTE_SYNC_KINDS, NOTE_SYNC_MAX_BYTES, inNoteSyncScope } from './note-sync';
export {
  NOTE_DOC_PREFIX, NOTE_KDF_ITERATIONS, PARAMS_DOC_ID, NoteKey, newParams, openFile, openParams, sealFile,
} from './note-crypto';
export { CouchNoteTransport, INLINE_SEAL_MAX, NoteSyncRefusal, SEAL_ATTACHMENT } from './couch-notes';
export { NoteSyncEngine, conflictCopyPath, emptyNoteSyncState, mergeable } from './note-engine';
export { MERGE_MAX_CELLS, mergeLines, splitLines } from './note-merge';
export { fingerprint, hasRoutingHeading, inPageFolder, isPage, pageModuleFor, parseFolders } from './pages';
export {
  KEPT_OUT, NOTE_KEYS, SECRET_KEYS, SETTINGS_NOTE_PATH, noteMatches, readSettingsNote, settingsNoteText,
} from './sync-config';

const moduleTypeName = (t: string) =>
  (MODULE_NAMES as Record<string, { name: string }>)[t]?.name ?? t;

/** RULED 2026-09-24: the types "Add a module" offers — every type in the
 *  one naming table except the two that belong to a PERSON'S own space.
 *  The server refuses those anywhere else (person-only.ts) and remains
 *  the authority; leaving them out just stops offering a certain refusal. */
export const ADDABLE_MODULE_TYPES: string[] = Object.keys(MODULE_NAMES)
  .filter((t) => t !== 'PERSON_DETAILS' && t !== 'PERSON_ASSIGNED');

const VIEW_TYPE = 'graphite-sync';

/* ══ ROW 2376 — EVERY CONNECTED DEVICE AND SERVER, AND NOTHING LIVE ═══════
 *
 * "the plugin setting shows all connected devices and nas servers". RULED
 * 2026-10-01 ("Only where live"): the settings list every connected device
 * and server; a typing indicator exists only where a live channel does, and
 * on the relay nothing pretends to be live. This plugin has NO live channel
 * of any kind — it asks a server over HTTP when somebody presses something —
 * so there is no typing indicator here and no "online".
 *
 * WHAT "CONNECTED" CAN HONESTLY MEAN, from data that exists:
 *   · DEVICES are the sign-ins and tokens the server holds for this vault's
 *     account — GET /auth/sessions, the list the app shows under "Where am I
 *     signed in?". Each carries the SERVER'S stamp of when it was last used.
 *     That stamp is written at most once per SESSION_STAMP_EVERY_MS, so the
 *     freshest thing it can honestly say is "seen in the last ten minutes".
 *   · SERVERS are the Graphite servers the vaults on this machine are set up
 *     against: the one this vault uses, plus, on a desktop, the one in the
 *     graphite-sync config of every other vault (the same registry the destination picker
 *     reads). A server is described by when it last ANSWERED, never as up.
 */

/** One row of GET /auth/sessions, as the server sends it. */
export interface DeviceEntry {
  id: string;
  userAgent: string;
  createdAt: string | null;
  lastUsedAt: string | null;
  current: boolean;
}

/** The label prefix the server gives a minted API token's session row
 *  (auth.service issueApiToken). */
const API_TOKEN_PREFIX = 'API token: ';
/** The sentence the server sends as a paired watch's user agent. */
const WATCH_LABEL = 'Paired watch';

/** A user-agent string, shrunk to something a person recognises — the same
 *  reading the app's "Where am I signed in?" list makes of it. */
export function deviceName(ua: string): string {
  if (ua.startsWith(API_TOKEN_PREFIX)) {
    return `API token “${ua.slice(API_TOKEN_PREFIX.length)}”`;
  }
  if (ua.startsWith(WATCH_LABEL)) return WATCH_LABEL;
  if (!ua) return 'Unknown device';
  const os = ua.includes('Android') ? 'Android'
    : ua.includes('iPhone') || ua.includes('iPad') ? 'iOS'
      : ua.includes('Windows') ? 'Windows'
        : ua.includes('Mac') ? 'macOS'
          : ua.includes('Linux') ? 'Linux' : '';
  const browser = ua.includes('Edg/') ? 'Edge'
    : ua.includes('Chrome/') ? 'Chrome'
      : ua.includes('Firefox/') ? 'Firefox'
        : ua.includes('Safari/') ? 'Safari' : 'App';
  return os ? `${browser} on ${os}` : browser;
}

/** How long ago, in words a settings row can carry. */
function agoText(ms: number): string {
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
}

/** What a device row says about recency — the server's stamp, read for
 *  what it can prove and no more.
 *
 *  Three cases where the obvious sentence would lie, each refused here:
 *  · a stamp younger than the server's throttle cannot tell "this second"
 *    from "nine minutes ago", so it never says "now" or "online";
 *  · an API token's row is stamped when it is MADE, and the throttle means
 *    no use can be stamped until SESSION_STAMP_EVERY_MS after that — so a
 *    token whose last-used stamp is closer than that to its birth has no
 *    recorded use, and "seen" would credit it with one;
 *  · no stamp at all (a watch token never presented) is said as never, not
 *    as a date. A stamp ahead of this device's clock is clock skew, read as
 *    the freshest case rather than as a time in the future. */
export function lastSeenText(d: DeviceEntry, now: number): string {
  const used = d.lastUsedAt ? Date.parse(d.lastUsedAt) : NaN;
  if (Number.isNaN(used)) return 'no use recorded';
  const made = d.createdAt ? Date.parse(d.createdAt) : NaN;
  if (d.userAgent.startsWith(API_TOKEN_PREFIX) && !Number.isNaN(made)
    && used - made < SESSION_STAMP_EVERY_MS) {
    return `no use recorded since it was made ${agoText(Math.max(0, now - made))}`;
  }
  const ago = now - used;
  if (ago < SESSION_STAMP_EVERY_MS) {
    return `seen in the last ${Math.round(SESSION_STAMP_EVERY_MS / 60000)} minutes`;
  }
  return `last seen ${agoText(ago)}`;
}

/** A server URL as one key: no trailing slash, case-folded host. */
export function serverKey(url: string): string {
  return url.trim().replace(/\/+$/, '').toLowerCase();
}

/** One Graphite server and the vaults on this machine set up against it. */
export interface ServerUse { url: string; vaults: string[]; here: boolean; }

/** Group vault configs by the server they point at, this vault's first. */
export function groupServers(
  configs: { vault: string; url: string; here: boolean }[],
): ServerUse[] {
  const by = new Map<string, ServerUse>();
  for (const c of configs) {
    if (!c.url.trim()) continue;
    const k = serverKey(c.url);
    const s = by.get(k) ?? { url: c.url.trim().replace(/\/+$/, ''), vaults: [], here: false };
    s.vaults.push(c.vault);
    s.here = s.here || c.here;
    by.set(k, s);
  }
  return [...by.values()].sort((a, b) => Number(b.here) - Number(a.here));
}

/** When a server last answered, or did not — a time, never a state. */
export interface ServerCheck { at: number; ok: boolean; detail: string; }

const clock = (at: number) =>
  new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** The sentence under a server's row. */
export function serverCheckText(c: ServerCheck | null | undefined): string {
  if (!c) return 'Not checked yet.';
  return c.ok
    ? `Answered at ${clock(c.at)}${c.detail ? ` · ${c.detail}` : ''}.`
    // Not "did not answer": a rejected token is an answer. The detail says
    // which it was, in the words the status bar already uses.
    : `Checked at ${clock(c.at)}: ${c.detail}.`;
}

interface SpaceInfo { id: string; name: string; }
interface ModuleInfo { id: string; name: string; type: string; }
interface VaultDest { name: string; path: string; current: boolean; }

/** R-379: one note of a folder-layout export, as the server composes it. */
interface ExportedFile {
  path: string;
  markdown: string;
  kind: 'index' | 'module' | 'page';
  moduleId?: string;
  /** R-8336: on `kind: 'page'`, the note this file IS. */
  noteId?: string;
}

interface FileEntry {
  spaceId: string;
  spaceName?: string;
  lastSyncAt?: number;   // last successful pull or push+canonicalize
  lastHash?: string;     // hash of the file content at that moment
  /** R-290: selective sync — only these modules are exported/round-tripped.
   *  Safe because merge-import never deletes what a file omits. */
  moduleIds?: string[];
  moduleCount?: number;  // total modules in the space at pull time (for "3/7")
  /** R-379 folder layout. Absent on files pulled as a single package, which
   *  is what every pre-0.3.0 mapping is — so absence means "one file". */
  role?: 'index' | 'module' | 'page';
  moduleId?: string;
  /** R-8336: a page of a notebook is a file of its own (role 'page'): the note
   *  it IS, and the folder of the notebook it sits in, so a rename in the vault
   *  can be read as a new title (the name) or a new section (the folder). */
  noteId?: string;
  pageDir?: string;
  folder?: string;
  /** FINDING 119: set only when this space's folder was asked for by name,
   *  because the default one belongs to another space. Asked again on every
   *  pull and every check, so the folder stays this space's. */
  folderAsked?: string;
}

interface LpSettings {
  /** Where this vault gets Graphite: a server (the default, and every
   *  vault made before this existed), or the Graphite app on this device,
   *  which writes the notes into the vault itself. */
  source: 'server' | 'device' | 'computer';
  /** 'computer' asks the Graphite app on this computer through the loopback door
   *  it leaves (device-door.ts); the address and key are read from the file it
   *  leaves each time, because both change when the app restarts. */
  serverUrl: string;
  token: string;
  /** vault file path -> synced space. */
  files: Record<string, FileEntry>;
  /** 0.6.1 · LINKING IS ENOUGH (Omar, 2026-11-17: "once the graphite plugin is
   *  installed in obsidian and linked with a key, it should be as simple as
   *  mirror"). On: every space the key can read that this vault has not been
   *  offered yet is pulled in when the connection is checked - the first link
   *  brings them all, and a space made later arrives the next time Obsidian
   *  opens. It only WRITES FILES INTO THIS VAULT; nothing leaves the machine,
   *  and pushing edits back stays the separate auto-push switch (RU-035). A
   *  vault that already chose its spaces by hand, before this existed, keeps
   *  it off until the person turns it on. */
  mirrorAll: boolean;
  /** The ids of the spaces this vault has been offered, so one the person
   *  stopped syncing (or whose pull failed) is not brought back or retried at
   *  every check. "Bring in every space" on the command is the explicit ask
   *  and ignores it. */
  spacesSeen: string[];
  /** ROW 2514 (R-2841): THE TEXT EACH SYNCED NOTE HAD WHEN THE SERVER LAST
   *  WROTE IT — what a pull put in the file, or the canonical text a push
   *  wrote back. Sent as `base` on the next push so the server can tell a
   *  field only the vault changed (written) from one only Graphite changed
   *  (kept) from one both changed (held, and asked about in the app). Kept
   *  apart from `files` because a pull replaces a whole file entry, and
   *  small on purpose: capped, oldest dropped, pruned with the note. Absent
   *  in a data.json from before, and then a note pushes as it always did.
   *  Oldest first, so eviction is a delete from the front. */
  bases: Record<string, string>;
  autoPush: boolean;
  /** Hide the round-trip `lp:` id markers in tracked files (like the app). */
  hideIds: boolean;
  /** R-379: how a pulled space lands in this vault — one package file, or a
   *  folder holding an index note plus one note per module. Per vault, because
   *  it is a vault-shaping decision: the same server can feed a "one file per
   *  space" archive vault and a fully-linked working vault. */
  layout: 'single' | 'folder';
  /** OC2 · R-1391: THIS VAULT'S IDENTITY.
   *
   * Until this the only thing a vault ever said about itself was its
   * folder name — renameable, and shared by every vault called "Notes" on
   * every machine — and the server's wall around a vault would have been
   * keyed on it. So the plugin mints a UUID here the first time it loads,
   * keeps it for good, and sends it on every request (`x-graphite-vault`).
   * The folder name travels as a label and nothing reads it as an id.
   *
   * The capture inbox USED to be a setting beside this one. It moved onto
   * the vault's binding on the server: a request that names its own
   * destination module cannot be walled, and a vault is now walled to the
   * space it is bound to (Omar, 2026-09-23: refuse, and say so). It is
   * still a property of this vault rather than of the account — the
   * binding is per vault — and it is still off until somebody picks one
   * (RU-035).
   */
  vaultId: string;
  /** RULED 2026-09-24 — "Two separate switches". A non-task line with a
   *  tag becomes a NOTE in the inbox's space when EITHER says so: every
   *  tagged line, or one whose tag is on the list. Both off by default. */
  captureAnyTagged: boolean;
  /** Comma-separated; `st` takes `#st` and `#st/IS-07`. */
  captureTags: string;
  /** MEETING-CAPTURE: capture a note by itself once it has sat still, rather
   *  than waiting for the command. Off by default (RU-035): it files into
   *  somebody's workspace with nobody pressing anything. */
  autoCapture: boolean;
  /** NOTE PAGES: the folders whose notes are sent whole, as pages (pages.ts).
   *  Comma-separated. Empty by default (RU-035): it sends note text off the
   *  machine. A note holding a routing heading is a page whatever this says. */
  pageFolders: string;
  /** NOTE PAGES: pages have their own switch (Omar 2026-11-07, "Own switch,
   *  still needs a space"). Off until turned on (RU-035): it sends note text
   *  off the machine. The vault must be bound to a space; a capture inbox is
   *  not needed. A vault that had already listed page folders before this
   *  switch existed keeps sending - naming them was its consent. */
  pagesOn: boolean;
  /** NOTE PAGES: the Notes module chosen for each page folder, by folder.
   *  A folder with no entry files in the bound space's first Notes module. */
  pageModules: Record<string, string>;
  /** NOTE PAGES: each path sent, with the fingerprint of the text last sent -
   *  so an unchanged note is not sent again and a delete is known to matter. */
  pagesSent: Record<string, string>;
  /** OC6: the last status the vault and Graphite AGREED on, per record id —
   *  the base of the three-way merge (vault-tick.ts). Kept here, on the
   *  vault, because it is a fact about this vault's lines: another vault
   *  holding the same record agrees with the app on its own schedule. */
  ticks: Record<string, TickState>;
  /** OC7: send the morning sweep a census of this vault — counts, dates,
   *  tags and links, never text. Off by default (RU-035): it is note
   *  metadata leaving the machine, and nobody has asked for it until the
   *  switch says so. */
  censusOn: boolean;
  /** OC5: publish the agent contract — the routing list and the agent
   *  brief — into Graphite/ in this vault. Off by default (RU-035). */
  agentOn: boolean;
  /** OC5: the folders his agent may read, comma-separated. Empty means
   *  none, and the brief then tells the agent to read nothing. */
  agentFolders: string;
  /** OC5: the closed list as last built from Graphite — the plugin's own
   *  copy, which approval checks. The note in the vault is only its
   *  published face, and anybody can edit a note. */
  routingList: RoutingList | null;
  /** OC3: the spaces the `>>` picker offers, as `GET /spaces` last said.
   *  KEPT so the picker works offline — a token is plain text and resolves
   *  on the server at capture, so nothing is lost by writing without a
   *  connection. Worth nothing if lost; refreshed on every connection. */
  routeCache: RawSpace[];
  /** OC3: space ids most recently routed to, newest first. In one meeting
   *  he routes to the same three spaces over and over, and recency is worth
   *  more than any cleverer ranking. */
  routeRecent: string[];
  /** ROW 2375: whole-vault note sync, and over which transport. Off by
   *  default (RU-035): it sends every note in the vault off the machine. */
  noteSync: NoteSyncKind;
  couchUrl: string;
  couchDb: string;
  couchUser: string;
  /** A secret: never written to the settings note (sync-config.ts). */
  couchPassword: string;
  /** R-5255: the passphrase every note is sealed under. A secret, typed on
   *  each device (R-5257), never written to the settings note. */
  couchPassphrase: string;
  /** What note sync last agreed with the far side: kept by the plugin, not
   *  chosen by a person (note-engine.ts). */
  noteSyncState: NoteSyncState;
  /** His LiveSync runs live in three vaults of four, so live is what a
   *  vault gets once it chooses a transport. */
  liveSync: boolean;
  /** ROW 2375 (R-4650): keep the settings in a note as well, and keep the
   *  two in step. Off until he asks for the note: a plugin that drops a
   *  file into every vault unasked is not one a household installs twice. */
  configFile: boolean;
  /** THE GRAPHITE BAR: show the toolbar row above a note. The buttons are
   *  commands whatever this says, so a phone's own toolbar can hold them. */
  barOn: boolean;
  /** The words a started list's heading is given. */
  barHeading: string;
  /** Write the lists the pickers use into the vault while connected, so a
   *  device with the plugin and no sign-in (a tablet) can use them. Names
   *  only, never a secret. */
  barShare: boolean;
  /** What the pickers offer that only Graphite knows — spaces, people, tags —
   *  as last built while connected (toolbar-lists.ts). Worth nothing if lost. */
  toolbarCache: ToolbarLists | null;
}

/* R-1512 — WHAT A VAULT LOOKS LIKE BEFORE ANYBODY CHANGES A SETTING.
 *
 * He asked for the mirror to "look like a normal vault — natural entries and
 * links an Obsidian user would expect — rather than one page per space",
 * EIGHT DAYS AFTER the folder layout was reported built. It was built, on
 * both sides, and it was `layout: 'single'` by default — so installing the
 * plugin and pulling a space gave him one .md file per space, which is the
 * thing he was asking to stop getting, and the shape he asked for was a
 * dropdown in a settings tab he had no reason to open.
 *
 * A default is an answer to "what did you build this for". This one said
 * "an archive", and he asked for a vault twice. */
const DEFAULTS: LpSettings = {
  source: 'server', serverUrl: '', token: '', files: {}, mirrorAll: true, spacesSeen: [], bases: {}, autoPush: false, hideIds: true,
  layout: 'folder', vaultId: '',
  captureAnyTagged: false, captureTags: '', autoCapture: false, pageFolders: '', pagesOn: false, pageModules: {}, pagesSent: {}, ticks: {}, censusOn: false,
  agentOn: false, agentFolders: '', routingList: null,
  routeCache: [], routeRecent: [],
  noteSync: 'off', couchUrl: '', couchDb: '', couchUser: '', couchPassword: '', liveSync: true,
  couchPassphrase: '', noteSyncState: emptyNoteSyncState(),
  configFile: false,
  barOn: true, barHeading: 'Actions', barShare: true, toolbarCache: null,
};

/** The header the server reads the vault identity from: VAULT_HEADER in
 *  vault-wall.ts, spelled here because importing that file would bundle the
 *  server framework into the plugin. vault-wall.spec holds the two equal. */
const VAULT_HEADER = 'x-graphite-vault';

/** Where a request goes in a vault that reads Graphite from the device: a
 *  port nothing listens on. Nothing is meant to ask in that mode; if some
 *  path forgot to check, it fails at once instead of reaching a server the
 *  vault was once set to. */
const NO_SERVER = 'http://127.0.0.1:1';
/** Where a request to the app on this computer goes when the app has left no
 *  door: a port nothing listens on, so it fails at once and the connection
 *  check has already said why in words. */
const NO_DOOR = 'http://127.0.0.1:1';

/** A version-4 UUID. `crypto.randomUUID` where the runtime has it, and the
 *  same 122 random bits by hand where it does not (an older mobile
 *  WebView), so no vault is ever left without an identity. */
export function mintVaultId(): string {
  const c: Crypto = globalThis.crypto;
  if (typeof c.randomUUID === 'function') return c.randomUUID();
  const b = c.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** What GET /mirror/vault/:id answers. */
interface VaultBinding {
  bound: boolean;
  label?: string;
  root?: { id: string; name: string; open: boolean };
  inbox?: { id: string; name: string; spaceName: string } | null;
  inboxCleared?: boolean;
  /** "All my spaces" (Omar, 2026-11-17): the person's own switch, held on the
   *  binding. Absent from a server that predates it, which reads as off. */
  allSpaces?: boolean;
}

/** The marker a captured line carries — THE pattern vault-capture.ts reads on
 *  the server, imported rather than copied (R-1517: a copy that did not know
 *  about the block anchor would restamp `| lp: t1 ^t1` as a second marker). */
const CAPTURE_MARKER = LP_TAIL;

/** R-062: a line as the INSTALLED server reads it. A `| gr: <id>` marker is
 *  sent as the `| lp: <id>` it is, because a v0.1.0 server knows only lp and
 *  would take a gr line for one nobody captured — and make a second task for
 *  it. The file itself is not touched. Same length, so every offset holds. */
export function asServerSpelling(line: string): string {
  const m = CAPTURE_MARKER.exec(line);
  if (!m) return line;
  return line.slice(0, m.index) + m[0].replace(/^(\s*\|\s*)gr:/, '$1lp:') + line.slice(m.index + m[0].length);
}

/** A line capture may send: a task line. */
const CAPTURE_TASK_LINE = /^\s*[-*]\s+\[( |x|X)\]\s*\S/;
/** …or, when a tagged-line switch is on, any line carrying a tag. The
 *  server decides which tags the switches take; this only avoids sending
 *  lines that could not possibly qualify. */
const CAPTURE_TAGGED_LINE = /(^|\s)#[\p{L}\p{N}_/-]+/u;
/** …or a plain bullet, which counts only under a heading that names a module. */
const CAPTURE_BULLET = /^\s*[-*+]\s+\S/;

/** R-1227: the 0-based indexes of the lines worth sending to capture.
 *
 *  Never the FRONTMATTER (a note's properties are not its content) and
 *  never inside a FENCED CODE BLOCK — a `- [ ]` in a code sample is an
 *  example of a task, and capturing it files somebody's documentation into
 *  their inbox. Never a blank line: the server refuses a batch holding one. */
export function captureCandidates(lines: string[], tagged = false): number[] {
  // RULED 2026-11-07: a plain bullet is a candidate when the heading it sits
  // under NAMES A MODULE (`## Meeting >> Work / Thread`) — the server decides
  // whether that module is a Notes one, and files it there or leaves it as
  // prose. The heading is the nearest one above, the same reading as
  // sectionFor, kept as a running value because this walks every line.
  let heading: string | undefined;
  // OC4: A PROPOSAL IS NOT A CAPTURE CANDIDATE. Only approval sends it,
  // and without its key. The server refuses one anyway; not sending it is
  // what keeps a scan from reporting the agent's suggestions as refusals.
  return bodyLines(lines).filter((i) => {
    if (/^#{1,6}\s/.test(lines[i].trim())) { heading = lines[i]; return false; }
    return !PROPOSAL_TAIL.test(lines[i])
      && (CAPTURE_TASK_LINE.test(lines[i])
        || (tagged && CAPTURE_TAGGED_LINE.test(lines[i]))
        || (CAPTURE_BULLET.test(lines[i]) && sectionNamesModule(heading)));
  });
}

/** OC6: every two-way box in a note — a task line carrying a hidden id,
 *  outside the frontmatter and any code block. */
export function tickLines(text: string): Array<{ at: number; id: string; state: TickState }> {
  const lines = text.split('\n');
  const out: Array<{ at: number; id: string; state: TickState }> = [];
  for (const at of bodyLines(lines)) {
    const t = tickOf(lines[at]);
    if (t) out.push({ at, ...t });
  }
  return out;
}

/** Point a captured line at the task the server says it made.
 *
 *  R-1227: A LINE THAT ALREADY CARRIES A MARKER GETS THE NEW ONE. The server
 *  re-captures a line whose task was deleted — its comment says a line
 *  pointing at a deleted task "is a line that will never be captured again,
 *  which is how a vault quietly stops working" — and answers with the NEW
 *  task's id. This used to skip any line that already had a marker, so the
 *  stale id stayed, the server found it still missing on the next run, and
 *  made ANOTHER task. Every capture made one more duplicate of every line
 *  whose task had ever been deleted. */
export function stampCaptured(line: string, id: string): string {
  return CAPTURE_MARKER.test(line)
    ? line.replace(CAPTURE_MARKER, ` | lp: ${id}`)
    : `${line.replace(/\s+$/, '')} | lp: ${id}`;
}

/* ── the freeform block (R-128 / R-379) ───────────────────────────────────
 * The ONE region of a synced note that belongs to the user rather than to
 * the server. Everything else is regenerated on every sync; this block is
 * carried across, both on the way in (a pull must not wipe prose written
 * here) and after a push (the canonical text the server hands back holds
 * only the placeholder).
 *
 * The in-app mirror has always done this (MarkdownService.FF_START/FF_END —
 * the same two literals, which this build cannot import). The plugin did
 * NOT: it overwrote the file with the server's export on every pull and
 * every push-canonicalize, so anything written in the block was gone at the
 * next sync. That is silent data loss on the one line of the file that
 * invites you to write. */
/** R-062: where the first of the spellings occurs at or after `from`. The
 *  block is READ in either; the text kept is put back into the server's
 *  fresh export in whichever spelling THAT used (the server still writes lp). */
function firstOf(text: string, marks: readonly string[], from: number): { at: number; len: number } | null {
  let best: { at: number; len: number } | null = null;
  for (const m of marks) {
    const at = text.indexOf(m, from);
    if (at >= 0 && (!best || at < best.at)) best = { at, len: m.length };
  }
  return best;
}

export function keepFreeform(old: string | null, fresh: string): string {
  if (!old) return fresh;
  // R-8336: the file of a page is the text of the page and has no freeform block of
  // the server's; a page that quotes the two markers must not have them read as
  // one, here or at any of the places that compare the splice with the file.
  if (isPageText(fresh)) return fresh;
  const a = firstOf(old, FF_STARTS, 0);
  if (!a) return fresh;
  const b = firstOf(old, FF_ENDS, a.at + a.len);
  if (!b) return fresh;
  const kept = old.slice(a.at + a.len, b.at);
  const fa = firstOf(fresh, FF_STARTS, 0);
  if (!fa) return fresh;
  const fb = firstOf(fresh, FF_ENDS, fa.at + fa.len);
  if (!fb) return fresh;
  return fresh.slice(0, fa.at + fa.len) + kept + fresh.slice(fb.at);
}

/* ── id-marker hiding (R-361) ─────────────────────────────────────────────
 * Exports carry per-record anchors — ` | lp: <id>` suffixes and
 * `<!-- lp: <id> -->` comments — that the merge importer needs but no
 * human should have to read. In tracked files we hide them in the editor
 * (revealed only on the line the cursor is on, so they stay inspectable
 * and deletable) and strip them from reading view. The FILE is untouched:
 * pushes still carry every id.
 *
 * R-1524: the RULE moved to ./lp-ids.ts, which imports nothing — not
 * `obsidian`, not `@codemirror/*` — so apps/api's jest suite can hold it
 * against markdown the SERVER actually emits. It also grew the half R-361
 * never had: eleven module types export as a TABLE whose last column is
 * headed `lp`, and none of that matched the inline regex, so a supply list
 * or an events table read as a wall of serial numbers. */

let gPlugin: GraphitePlugin | null = null;

function buildHideDecos(view: EditorView): DecorationSet {
  const p = gPlugin;
  const file = p?.app.workspace.getActiveFile();
  if (!p?.settings.hideIds || !file || !p.settings.files[file.path]) {
    return Decoration.none;
  }
  const b = new RangeSetBuilder<Decoration>();
  const sel = view.state.selection.main;
  const selFrom = view.state.doc.lineAt(sel.from).number;
  const selTo = view.state.doc.lineAt(sel.to).number;
  // THE WHOLE DOCUMENT, not the visible ranges. A table column can only
  // be recognised from the header line above it, and the header is very
  // often scrolled off the top of a long table — which is precisely when
  // the ids are in the way.
  const doc = view.state.doc.toString();
  for (const r of lpHiddenRanges(doc)) {
    const line = view.state.doc.lineAt(r.from).number;
    if (line >= selFrom && line <= selTo) continue; // active line: reveal
    b.add(r.from, r.to, Decoration.replace({}));
  }
  return b.finish();
}

const lpHideExtension = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) { this.decorations = buildHideDecos(view); }
    update(u: ViewUpdate) {
      if (u.docChanged || u.selectionSet || u.viewportChanged) {
        this.decorations = buildHideDecos(u.view);
      }
    }
  },
  { decorations: (v) => v.decorations },
);

/* ══ OC4 — APPROVAL STATE, VISIBLE AT A GLANCE ═════════════════════════════
 *
 * Italic is the contract he was promised, and the markdown already draws
 * it. This adds the half italic cannot carry: WHICH STATE a proposal is in.
 * A proposed line sits on an amber wash with a "proposed" tag; one he has
 * approved (ticked, or un-italicised) and that is waiting to be created
 * reads "approving"; one the plugin cannot read exactly reads "unreadable"
 * and is never applied. A record has none of these.
 *
 * NOT GATED TO SYNCED NOTES, unlike the id hiding above: proposals live in
 * daily and meeting notes, which the plugin does not sync. The key is
 * hidden everywhere but the cursor's line, where it stays inspectable and
 * deletable — deleting the line is a complete answer to a proposal.
 */
function buildProposalDecos(view: EditorView): DecorationSet {
  const b = new RangeSetBuilder<Decoration>();
  const doc = view.state.doc;
  const sel = view.state.selection.main;
  const selFrom = doc.lineAt(sel.from).number;
  const selTo = doc.lineAt(sel.to).number;
  const lines = doc.toString().split('\n');
  for (const p of proposalsIn(lines)) {
    const line = doc.line(p.line + 1);
    b.add(line.from, line.from, Decoration.line({
      class: `gr-proposal gr-proposal-${p.state}`,
      attributes: { 'data-gr-state': p.state === 'approved' ? 'approving' : p.state },
    }));
    if (line.number >= selFrom && line.number <= selTo) continue;
    const m = PROPOSAL_TAIL.exec(line.text);
    if (m && m.index !== undefined) {
      b.add(line.from + m.index, line.from + line.text.length, Decoration.replace({}));
    }
  }
  return b.finish();
}

const proposalExtension = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) { this.decorations = buildProposalDecos(view); }
    update(u: ViewUpdate) {
      if (u.docChanged || u.selectionSet) this.decorations = buildProposalDecos(u.view);
    }
  },
  { decorations: (v) => v.decorations },
);

/* REGISTER 2519: the links panel follows the cursor. This hook only hands
 * the editor state to the feed, which resets a timer and returns; the line
 * is not even read until the cursor has been still (links.ts). */
const linksCursorExtension = ViewPlugin.fromClass(
  class {
    update(u: ViewUpdate) {
      if (u.selectionSet || u.docChanged) gPlugin?.cursorMovedIn(u.view);
    }
  },
);

/** OB-2: the sentences a push report carries that a person should read, in the
 *  words of the importer, cut to three. Its top-level warnings (a link row it
 *  held, a link it could not apply) and the warnings of each module section
 *  (a rule it could not read, a line it would not read because it had no id), then a
 *  held-link count in plain words when no sentence already says held. Empty
 *  when the importer had nothing to say, so a clean push stays one notice. */
function importerSaid(report: any): string[] {
  const out: string[] = [];
  const add = (s: unknown) => {
    const t = typeof s === 'string' ? s.trim() : '';
    if (t && !out.includes(t)) out.push(t);
  };
  for (const w of report?.warnings ?? []) add(w);
  for (const sec of report?.sections ?? []) for (const w of sec?.warnings ?? []) add(w);
  const held = Number(report?.linksHeld) || 0;
  if (held > 0 && !out.some((s) => /held/i.test(s))) {
    add(`${held} link row${held === 1 ? '' : 's'} deleted here ${held === 1 ? 'was' : 'were'} held, not removed — break a link in the app.`);
  }
  const shown = out.slice(0, 3).map((s) => (s.length > 220 ? `${s.slice(0, 217)}…` : s));
  if (out.length > 3) shown.push(`…and ${out.length - 3} more.`);
  return shown;
}

/** ROW 2514: the limits of the base store. A base is a whole note, kept so the
 *  next push can say what the note looked like when the server last wrote
 *  it; a vault of thousands of notes must not turn data.json into a copy of
 *  the vault. Past either cap the oldest bases go, and a note without one
 *  pushes as it did before bases existed. */
const BASE_MAX_NOTES = 400;
const BASE_MAX_CHARS = 4_000_000;
const BASE_MAX_ONE = 400_000;

/** Put one base in, newest last, and evict from the front past the caps. A
 *  note too large to keep has no base, and loses any older one: a stale
 *  base is worse than none, it would name the wrong text as last seen. */
/** FINDING 119: whether a DIFFERENT space already syncs into [folder] in this
 *  vault. Case-insensitive, because two of the three platforms are. */
function folderHeldByAnother(files: Record<string, FileEntry>, folder: string, spaceId: string): boolean {
  const lower = folder.toLowerCase();
  return Object.values(files).some((e) => e.spaceId !== spaceId && e.folder?.toLowerCase() === lower);
}

/** FINDING 119: the name a space takes when its own is a neighbour's — the
 *  name, and the end of its id, which does not change when it is renamed. */
function distinctFolder(name: string, spaceId: string): string {
  return `${name} (${spaceId.slice(-6)})`;
}

/** FINDING 119: the note a package-layout space is pulled into: `<name>.md`,
 *  or `<name> (<end of id>).md` when another space holds that name. */
function singleFileFor(files: Record<string, FileEntry>, space: { id: string; name: string }): string {
  const stem = space.name.replace(/[\\/:*?"<>|]/g, '_');
  const plain = `${stem}.md`;
  const held = Object.entries(files).some(([p, e]) => e.spaceId !== space.id && p.toLowerCase() === plain.toLowerCase());
  return held ? `${distinctFolder(stem, space.id)}.md` : plain;
}

function putBase(bases: Record<string, string>, path: string, text: string): void {
  delete bases[path];
  if (text.length > BASE_MAX_ONE) return;
  bases[path] = text;
  const keys = Object.keys(bases);
  let total = keys.reduce((n, k) => n + bases[k].length, 0);
  while (keys.length > 1 && (keys.length > BASE_MAX_NOTES || total > BASE_MAX_CHARS)) {
    const oldest = keys.shift() as string;
    total -= bases[oldest].length;
    delete bases[oldest];
  }
}

type HeldField = { kind: string; label?: string; field: string };

/** ROW 2514: the fields a push held, from the importer answer. A link row
 *  held (kind link) is another thing, counted by linksHeld and said by
 *  importerSaid, so it is not counted here as well. */
function heldFieldsOf(report: any): HeldField[] {
  const list = Array.isArray(report?.conflicts) ? report.conflicts : [];
  return list.filter((c: any) => c && typeof c === 'object' && c.kind !== 'link');
}

/** The notice lines for held fields, in plain words: how many, which three,
 *  and that the decision is in the app. The note keeps the app value
 *  meanwhile because a push writes the server text back over the file. */
function heldFieldsSaid(held: HeldField[]): string[] {
  if (!held.length) return [];
  const n = held.length;
  const out = [`${n} field${n === 1 ? '' : 's'} held — changed here and in the app. Decide in the Graphite app; this note keeps the app value for now.`];
  for (const c of held.slice(0, 3)) {
    const who = String(c.label ?? '').trim();
    out.push(`${who ? `${who.length > 60 ? `${who.slice(0, 57)}…` : who} — ` : ''}${c.field}`);
  }
  if (n > 3) out.push(`…and ${n - 3} more.`);
  return out;
}

/** djb2 — cheap content fingerprint, only ever compared to itself. */
function hash(s: string): string {
  let x = 5381;
  for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) | 0;
  return (x >>> 0).toString(36);
}

function relTime(ms?: number): string {
  if (!ms) return 'never';
  const d = Date.now() - ms;
  if (d < 60_000) return 'just now';
  if (d < 3_600_000) return `${Math.floor(d / 60_000)} min ago`;
  if (d < 86_400_000) return `${Math.floor(d / 3_600_000)} h ago`;
  return `${Math.floor(d / 86_400_000)} d ago`;
}

export default class GraphitePlugin extends Plugin {
  settings: LpSettings = DEFAULTS;
  private statusEl: HTMLElement | null = null;
  /** Above zero while the plugin itself writes a vault file
   *  (canonicalize, pull, capture's stamp, finalise), so the modify handlers
   *  must not treat its own write as his edit.
   *
   *  R-1386: A COUNTER, NOT A FLAG. Two writes overlap the moment anything
   *  writes on its own — finalise runs off a modify event while a capture
   *  may be stamping — and a flag the first one clears in its `finally`
   *  would leave the second one's write looking like a person's edit. */
  private writingBack = 0;
  /** Whether this vault captures: bound on the server WITH an inbox, as the
   *  server last said (OC2 moved the inbox off this file at the M-S2 merge).
   *  Held in memory only, refreshed by every binding read, and false until
   *  one answers, so no tick reaches a server before capture is known on. */
  captureOn = false;
  /** Whether this vault is bound to a space, as the server last said - the
   *  half of captureOn that pages need (they never touch the inbox). */
  vaultBound = false;
  /** OC4: per-note timers for the two gestures read off a line. */
  private gestureTimers: Record<string, number> = {};
  /** How long a note must sit still before a tick or an un-italicised line
   *  is taken as an approval — long enough to finish removing an asterisk. */
  gestureDelay = 2500;
  /** Said once per session, not on every keystroke. */
  private toldNoInbox = false;
  private pushTimers: Record<string, number> = {};
  /** FINDING 120: THE PATHS A PUSH IS IN FLIGHT FOR. A second push of the
   *  same note while one is running read the same file, sent the same new
   *  sections without ids, and made every one of them twice. The second
   *  asks to run again instead (the value is how it was asked), once the
   *  first has written the ids back, and sends what the file says by then. */
  private pushing = new Map<string, true>();
  private pushAgain = new Map<string, { auto?: boolean; force?: boolean } | undefined>();
  lastMe: { name?: string; email?: string } | null = null;
  lastHealth: { version?: string } | null = null;

  /** R-1500: what the LAST vault report was told.
   *
   *  null   — not tried yet, or it worked.
   *  'gated' — the server refused it because this account is not the
   *            instance operator, which is a settled decision and not a
   *            fault (mirror.controller's RequireOperator, and the reason
   *            is in its margin: the vault dropdown is an operator's own
   *            configuration screen and a tenant-supplied name on it is a
   *            confusion channel).
   *  'failed' — anything else: an older server with no endpoint, a dead
   *            connection, a rejected token.
   *
   *  IT IS REMEMBERED RATHER THAN ANNOUNCED. This runs on every connection
   *  check, so a Notice here would be a popup every few minutes about a
   *  decision that is not going to change. The panel is where a person
   *  looks when they are wondering, and that is where it goes. */
  vaultReport: null | 'gated' | 'failed' = null;

  /** ROW 2376: this vault's server, as of the last connection check. */
  lastCheck: ServerCheck | null = null;
  /** ROW 2376: other servers' answers, by serverKey, from a Check press. */
  serverChecks: Record<string, ServerCheck> = {};
  /** ROW 2376: the account's devices as the server last listed them, and
   *  when. null with a report is a list that could not be had — said as
   *  that, never as an empty list, which would read "no other devices". */
  devices: DeviceEntry[] | null = null;
  devicesReport: null | 'old-server' | 'refused' | 'failed' | 'device' | 'computer' = null;

  /** REGISTER 1527: what the server said about the oldest plugin it
   *  accepts, read off GET /health. null until a server has answered. */
  handshake: Handshake | null = null;
  /** The /health call in flight, so a write made before the startup check
   *  has answered waits for that one call instead of making a second. */
  private healthAsk: Promise<{ json: any } | null> | null = null;
  /** An automatic write refused for being out of date says so once. */
  private toldOutdated = false;

  /** REGISTER 2519: the link log of the record under the cursor. */
  feed!: LinkLogFeed;
  linksViews = new Set<LinksView>();
  /** How long the cursor must be still before the panel asks, and how long
   *  an answer counts as fresh. Fields, so a test can shorten them. */
  linksDebounce = 300;
  linksFresh = 30_000;

  async onload() {
    await this.loadSettings();
    gPlugin = this;
    // R-361: hide lp id markers — editor (live preview/source) + reading view.
    this.registerEditorExtension(lpHideExtension);
    this.registerEditorExtension(proposalExtension);
    // OC3: `>>` at the cursor.
    this.registerEditorSuggest(new RouteSuggest(this.app, this));
    // OC4: reading view — the key hidden and the state marked, in any note.
    this.registerMarkdownPostProcessor((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const hits: Text[] = [];
      let n: Node | null;
      while ((n = walker.nextNode())) {
        if (n.nodeValue && PROPOSAL_TAIL.test(n.nodeValue)) hits.push(n as Text);
      }
      for (const t of hits) {
        t.nodeValue = t.nodeValue!.replace(PROPOSAL_TAIL, '');
        t.parentElement?.closest('li')?.addClass('gr-proposal');
      }
    });
    this.registerMarkdownPostProcessor((el, ctx) => {
      if (!this.settings.hideIds || !this.settings.files[ctx.sourcePath]) return;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let n: Node | null;
      while ((n = walker.nextNode())) {
        if (n.nodeValue && LP_ID_RE.test(n.nodeValue)) {
          n.nodeValue = n.nodeValue.replace(LP_ID_RE, '');
        }
        LP_ID_RE.lastIndex = 0;
      }
      // R-1524: reading view renders the table as a <table>, so the ids
      // are no longer in a text node that a regex can reach — they are a
      // COLUMN. Found by its header, removed from every row, and left
      // alone in any table that is not the mirror's.
      for (const table of Array.from(el.querySelectorAll('table'))) {
        const heads = Array.from(table.querySelectorAll('th'));
        // The LAST header only: a person's own column headed `gr` earlier in
        // the table is theirs, and must not stop the mirror's from hiding.
        const at = heads.length - 1;
        if (at < 0 || !isMarkerHeaderCell(heads[at].textContent ?? '')) continue;
        for (const row of Array.from(table.querySelectorAll('tr'))) {
          const cells = Array.from(row.children) as HTMLElement[];
          if (cells.length === heads.length) cells[at].remove();
        }
      }
    });
    this.addSettingTab(new LpSettingTab(this.app, this));
    this.registerView(VIEW_TYPE, (leaf) => new LpSyncView(leaf, this));

    /* ══ REGISTER 2519 · THE LINKS PANEL AND THE ROLE-FIRST PICKER ═════ */
    const self = this;
    this.feed = new LinkLogFeed((r) => this.fetchLinkLog(r), () => this.refreshLinks(), {
      get debounceMs() { return self.linksDebounce; },
      get freshMs() { return self.linksFresh; },
      now: () => Date.now(),
      setTimeout: (fn, ms) => window.setTimeout(fn, ms),
      clearTimeout: (t) => window.clearTimeout(t as number),
    });
    this.registerView(LINKS_VIEW, (leaf) => new LinksView(leaf, this));
    this.registerEditorExtension(linksCursorExtension);
    this.registerEvent(this.app.workspace.on('file-open', () => this.nudgeLinks()));
    this.addCommand({ id: 'lp-open-links', name: 'Open the links panel', callback: () => void this.openLinks() });
    this.addCommand({
      id: 'lp-link-line',
      name: 'Link this line to a Graphite record',
      editorCallback: (editor: Editor) => {
        const file = this.app.workspace.getActiveFile();
        const spot = this.spotIn(file?.path ?? null, editor.getValue().split('\n'), editor.getCursor().line);
        if (!('rec' in spot)) { new Notice(`Graphite: ${spot.none}`); return; }
        pickLink(this, spot.rec);
      },
    });
    this.addRibbonIcon('refresh-cw', 'Graphite sync', () => this.openPanel());

    this.statusEl = this.addStatusBarItem();
    this.setStatus('…', 'checking');
    // 0.6.9: NOTHING RUNS AGAINST THE SERVER WHILE OBSIDIAN IS STILL OPENING.
    // The first check waits for the workspace to be laid out (the vault's files
    // are indexed by then), and only then for its short delay.
    this.app.workspace.onLayoutReady(() => {
      window.setTimeout(() => void this.checkConnection(false), this.startupDelayMs);
    });

    this.addCommand({ id: 'lp-open-panel', name: 'Open the sync panel', callback: () => this.openPanel() });
    this.addCommand({ id: 'lp-pull-all', name: 'Bring in every space', callback: () => void this.mirrorEverySpace(true) });
    this.addCommand({ id: 'lp-pull-space', name: 'Pull a space (pick destination vault)', callback: () => this.chooseAndPull() });
    this.addCommand({ id: 'lp-pull-selective', name: 'Pull a space into THIS vault, choosing modules', callback: () => this.chooseAndPullSelective() });
    this.addCommand({ id: 'lp-push-file', name: 'Push the current file back to Graphite', callback: () => this.pushCurrent() });
    this.addCommand({ id: 'lp-test-connection', name: 'Test the server connection', callback: () => this.checkConnection(true) });
    // RULED 2026-09-24 (R-1525): add a MODULE — a command with a type picker.
    this.addCommand({
      id: 'lp-add-module',
      name: 'Add a module to a Graphite space',
      callback: () => void this.chooseAndAddModule(),
    });
    // R-1525: bring a SPACE into existence from a note.
    this.addCommand({
      id: 'lp-create-space',
      name: 'Create a Graphite space from this note',
      callback: () => void this.createSpaceFromNote(),
    });
    // R-1227: capture from ANY note, not just a mirrored one.
    this.addCommand({
      id: 'lp-capture-vault',
      name: 'Capture tasks from this vault into Graphite',
      callback: () => void this.captureVault(),
    });
    // OC6: the boxes of captured lines, both ways, without capturing.
    this.addCommand({
      id: 'lp-sync-ticks',
      name: 'Sync ticks between this vault and Graphite',
      callback: () => void this.syncTicks(),
    });
    // OC5: the agent contract, on its command and every hour while open.
    this.addCommand({
      id: 'lp-publish-agent',
      name: 'Publish the routing list and agent brief for your agent',
      callback: () => void this.publishAgentContract({ loud: true }),
    });
    this.registerInterval(window.setInterval(() => {
      if (this.settings.agentOn) void this.publishAgentContract();
    }, 3_600_000));
    // OC7: the census, on its command and every six hours while open.
    this.addCommand({
      id: 'lp-send-census',
      name: 'Send the vault census to the morning sweep',
      callback: () => void this.reportCensus({ loud: true }),
    });
    this.registerInterval(window.setInterval(() => {
      if (this.settings.censusOn) void this.reportCensus();
    }, 6 * 3_600_000));
    // OC6: a note opened is a note looked at — bring its boxes up to date
    // first. An edit that moves a box is sent shortly after. Both only once
    // capture is on: no inbox, no stamped lines, nothing to keep. The inbox
    // lives on the binding of the vault now (captureOn).
    this.registerEvent(this.app.workspace.on('file-open', (f) => {
      if (!this.captureOn || !(f instanceof TFile)) return;
      if (this.settings.files[f.path]) return;
      void this.app.vault.read(f).then((text) => {
        if (tickLines(text).length) void this.syncTicks([f], { quiet: true });
      });
    }));
    this.registerEvent(this.app.vault.on('modify', (f) => {
      if (!this.captureOn || this.writingBack > 0) return;
      if (!(f instanceof TFile) || this.settings.files[f.path]) return;
      void this.app.vault.read(f).then((text) => this.tickSoon(f, text));
    }));
    // MEETING-CAPTURE: "Capture automatically". A note written here, or one
    // that sync brings in from another device (a tablet in a meeting), is
    // captured once it has sat still, so a line is never stamped while it
    // is still being written. Same gates as the command: an inbox, never a
    // synced note, never the plugin's own write.
    const captureSoon = (f: unknown) => {
      if (!this.settings.autoCapture || !this.captureOn || this.writingBack > 0) return;
      if (!(f instanceof TFile) || f.extension !== 'md') return;
      if (this.settings.files[f.path] || isAgentFile(f.path) || f.path === SETTINGS_NOTE_PATH) return;
      this.autoCaptureSoon(f);
    };
    this.registerEvent(this.app.vault.on('modify', captureSoon));
    this.registerEvent(this.app.vault.on('create', captureSoon));
    // NOTE PAGES: a note that is a page is sent whole, on the same quiet-wait
    // (pages.ts says what makes one and when it goes).
    this.pages = new PageSync({
      on: () => this.settings.pagesOn && this.vaultBound && !this.offServer,
      folders: () => this.settings.pageFolders,
      moduleFor: (p) => pageModuleFor(p, this.settings.pageFolders, this.settings.pageModules),
      vaultName: () => this.app.vault.getName(),
      excluded: (p) => !!this.settings.files[p] || isAgentFile(p) || p === SETTINGS_NOTE_PATH || p.startsWith('.'),
      isOpen: (p) => this.app.workspace.getActiveFile()?.path === p,
      read: async (p) => {
        const f = this.app.vault.getAbstractFileByPath(p);
        return f instanceof TFile ? this.app.vault.read(f) : null;
      },
      send: async (method, body) => {
        const q = method === 'DELETE' ? `?path=${encodeURIComponent(String(body.path))}` : '';
        const res = await requestUrl({
          url: this.api(`/mirror/pages${q}`), method, headers: this.headers, throw: false,
          ...(method === 'PUT' ? { contentType: 'application/json', body: JSON.stringify(body) } : {}),
        });
        return { status: res.status, message: (res.json as { message?: string } | null)?.message };
      },
      sent: this.settings.pagesSent,
      save: () => this.saveSettings(),
      say: (m) => void new Notice(m, 10000),
      delay: () => this.autoCaptureDelay,
      // 0.6.9: the plugin's OWN writes (a pull, a canonicalising push) are not
      // the person's edits. Without this every note a pull created was looked
      // at as a page candidate - a read of each - before its tracking was
      // written, since the file exists a moment before its entry does.
      watch: (ev, cb) => this.registerEvent(this.app.vault.on(ev as 'modify', (...a: any[]) => {
        // Only a modify or create: a person deleting or moving a page note
        // while a pull runs is still theirs to be heard.
        if (this.writingBack > 0 && (ev === 'modify' || ev === 'create')) return;
        cb(...a);
      })),
      setTimeout: (fn, ms) => window.setTimeout(fn, ms),
      clearTimeout: (t) => window.clearTimeout(t as number),
    });
    this.pages.register();

    /* ══ OC3 — ROUTE A LINE (palette and a bindable hotkey) ══════════════
     * The same list and the same insert as `>>`, for a phone, or for a
     * person who would rather bind a key than type two characters. */
    this.addCommand({
      id: 'lp-route-line',
      name: 'Route this line to a Graphite space',
      editorCallback: (editor: Editor) => {
        void this.refreshRoutes();
        new RouteModal(this.app, this, (r) => this.insertRoute(editor, r, editor.getCursor().line)).open();
      },
    });
    // RULED 2026-09-24: plain bullets become tasks, by a command, no model.
    this.addCommand({
      id: 'lp-make-tasks',
      name: 'Make these tasks',
      editorCallback: (editor: Editor) => this.makeTasksIn(editor),
    });
    this.registerBarCommands();
    // The lists a connected device wrote, read by one with no sign-in: on
    // load, when the file arrives or changes, and again whenever a picker
    // opens (barLists), because a synced file does not always raise an event.
    void this.adoptToolbarLists();
    // The bar follows the panes: a note opening, a pane moving, a layout
    // change. Drawing is idempotent, so any of them may call it.
    this.registerEvent(this.app.workspace.on('active-leaf-change', () => this.syncBars()));
    this.registerEvent(this.app.workspace.on('layout-change', () => this.syncBars()));
    this.registerEvent(this.app.workspace.on('file-open', () => this.syncBars()));
    this.app.workspace.onLayoutReady(() => this.syncBars());
    const adopt = (f: unknown) => { if ((f as { path?: string } | null)?.path === TOOLBAR_LISTS_PATH) void this.adoptToolbarLists(); };
    this.registerEvent(this.app.vault.on('modify', adopt));
    this.registerEvent(this.app.vault.on('create', adopt));
    this.registerInterval(window.setInterval(() => void this.publishToolbarLists(), 3_600_000));
    /* ══ OC4 — APPROVE: the command (two of them) and the panel ════════ */
    this.addCommand({
      id: 'lp-approve-line',
      name: 'Approve the proposal on this line',
      editorCallback: (editor: Editor) => {
        const file = this.app.workspace.getActiveFile();
        const p = readProposal(editor.getLine(editor.getCursor().line));
        if (!file || !p) { new Notice('Graphite: there is no proposal on this line.'); return; }
        void this.approveProposals(file, [p.key]);
      },
    });
    this.addCommand({
      id: 'lp-approve-note',
      name: 'Approve every proposal in this note',
      callback: () => {
        const file = this.app.workspace.getActiveFile();
        if (!file) { new Notice('Graphite: open the note first.'); return; }
        void this.approveProposals(file, 'all');
      },
    });
    // OC4: the other two gestures — a tick, or the italics removed — are
    // read off the note once it sits still. Never on a synced note (its
    // proposals are refused), never on the plugin's own write.
    this.registerEvent(this.app.vault.on('modify', (f) => {
      if (this.writingBack > 0 || !(f instanceof TFile) || this.settings.files[f.path]) return;
      if (f.extension !== 'md') return;
      window.clearTimeout(this.gestureTimers[f.path]);
      this.gestureTimers[f.path] = window.setTimeout(
        () => void this.approveGestures(f), this.gestureDelay);
    }));

    // Auto-push (R-290, off by default): tracked files push ~2.5s after the
    // last edit. The writingBack guard keeps canonicalize writes silent.
    this.registerEvent(this.app.vault.on('modify', (f) => {
      if (!this.settings.autoPush || this.writingBack > 0) return;
      if (!(f instanceof TFile) || !this.settings.files[f.path]) return;
      // Row 1515: an index note auto-pushes too, for its links table.
      this.schedulePush(f.path);
    }));

    /* ══ ROW 2375 · THE SETTINGS NOTE (R-4650) ══════════════════════════
     * "read and store all of its config in an md file for easy config and
     * restore . the md file is in addtionn to the normal ui". Read once the
     * vault is ready (it may have changed while Obsidian was closed, by
     * sync), and again whenever it is edited and then left still. */
    this.addCommand({
      id: 'lp-write-settings-note',
      name: 'Write settings to the settings note',
      callback: () => void this.writeSettingsNote({ loud: true }),
    });
    this.addCommand({
      id: 'lp-read-settings-note',
      name: 'Read settings from the settings note',
      callback: () => void this.readSettingsNoteIn({ loud: true }),
    });
    this.registerEvent(this.app.vault.on('modify', (f) => {
      if (this.writingBack > 0 || !(f instanceof TFile) || f.path !== SETTINGS_NOTE_PATH) return;
      if (!this.settings.configFile) return;
      window.clearTimeout(this.settingsNoteTimer);
      this.settingsNotePending = true;
      this.settingsNoteTimer = window.setTimeout(() => {
        this.settingsNotePending = false;
        void this.readSettingsNoteIn({ loud: false });
      }, this.settingsNoteDelay);
    }));
    /* ══ ROW 2375 · NOTES TRAVEL ══════════════════════════════════════
     * A change anywhere in the vault is sent once the vault sits still;
     * the command runs it at once and says what moved. Nothing happens
     * while note sync is off. */
    this.addCommand({
      id: 'lp-sync-notes-now',
      name: 'Sync notes now',
      callback: () => void this.syncNotesNow({ loud: true }),
    });
    // 0.6.9: not for the plugin's own writes (a pull writing a space is not a
    // change to send; it re-armed the timer once per file).
    this.registerEvent(this.app.vault.on('modify', () => { if (!this.writingBack) this.noteSyncSoon(); }));
    this.registerEvent(this.app.vault.on('create', () => { if (!this.writingBack) this.noteSyncSoon(); }));
    // ROW 2514: a note deleted or renamed here has no file at the old path,
    // so its base goes (the entry stays, as it always has, shown as missing).
    this.registerEvent(this.app.vault.on('delete', (f: unknown) => {
      const gone = (f as { path?: string } | null)?.path;
      // R-8336: a tracked page's file deleted by the person. The base stays
      // (the entry does, shown as missing) until the page is dealt with.
      if (gone && this.writingBack === 0 && this.settings.files[gone]?.role === 'page') {
        this.pageVanished(gone);
        this.noteSyncSoon();
        return;
      }
      if (gone && this.settings.bases[gone] !== undefined) {
        delete this.settings.bases[gone];
        void this.saveSettings();
      }
      this.noteSyncSoon();
    }));
    this.registerEvent(this.app.vault.on('rename', (f: unknown, from: string) => {
      // R-8336: a page's file renamed or moved by the person: its title or its
      // section changed, and the tracking and base move with the file.
      const to = (f as { path?: string } | null)?.path;
      if (this.writingBack === 0 && typeof from === 'string' && to && this.settings.files[from]?.role === 'page') {
        void this.pageRenamed(from, to);
        this.noteSyncSoon();
        return;
      }
      if (typeof from === 'string' && this.settings.bases[from] !== undefined) {
        delete this.settings.bases[from];
        void this.saveSettings();
      }
      this.noteSyncSoon();
    }));
    const ws = this.app.workspace as { onLayoutReady?: (fn: () => void) => void };
    if (typeof ws.onLayoutReady === 'function') {
      ws.onLayoutReady(() => void this.openSettingsNote());
    } else {
      await this.openSettingsNote();
    }
  }

  /** ROW 2375: until the note has been read at start-up, no save may write
   *  it — a save from before would overwrite what sync brought in while
   *  Obsidian was closed with what this device had before. */
  private settingsNoteOpen = false;
  private settingsNoteTimer = 0;
  /** An edit to the note that has not been read yet. Until it is, no save
   *  writes the note: a census or a tick saving the settings in those two
   *  seconds would otherwise put the old value back over his edit. */
  private settingsNotePending = false;
  /** How long the settings note must sit still before an edit is read —
   *  long enough to finish typing a value. */
  settingsNoteDelay = 2500;

  private async openSettingsNote() {
    if (this.settings.configFile && this.app.vault.getAbstractFileByPath(SETTINGS_NOTE_PATH)) {
      await this.readSettingsNoteIn({ loud: false });
    }
    this.settingsNoteOpen = true;
    // Note sync starts once the settings are what the note says.
    this.restartNoteSync();
  }

  /** The settings note sync depends on, as one string to compare. */
  private noteSyncSignature(): string {
    const s = this.settings;
    return JSON.stringify([s.noteSync, s.couchUrl, s.couchDb, s.couchUser, s.couchPassword, s.couchPassphrase, s.liveSync]);
  }

  /** Take the settings the note sets. A refused line keeps its setting and
   *  is said, with its line number; the rest applies. The note is not
   *  rewritten here, so an edit he is still making is never fought. */
  async readSettingsNoteIn(opts: { loud: boolean }): Promise<boolean> {
    const file = this.app.vault.getAbstractFileByPath(SETTINGS_NOTE_PATH);
    if (!(file instanceof TFile)) {
      if (opts.loud) new Notice(`Graphite: there is no settings note at ${SETTINGS_NOTE_PATH}.`);
      return false;
    }
    const { values, problems } = readSettingsNote(await this.app.vault.read(file));
    const before = this.noteSyncSignature();
    Object.assign(this.settings, values);
    await this.saveData(this.settings);
    if (this.settingsNoteOpen && this.noteSyncSignature() !== before) this.restartNoteSync();
    if (problems.length) {
      new Notice(`Graphite: the settings note was read, except:\n${problems.join('\n')}`, 12000);
    } else if (opts.loud) {
      new Notice('Graphite: settings read from the settings note.');
    }
    this.refreshPanel();
    return true;
  }

  /** Write the settings into the note, keeping whatever else it holds. */
  async writeSettingsNote(opts: { loud?: boolean } = {}) {
    if (!opts.loud && this.settingsNotePending) return;
    const file = this.app.vault.getAbstractFileByPath(SETTINGS_NOTE_PATH);
    const before = file instanceof TFile ? await this.app.vault.read(file) : null;
    if (before !== null && noteMatches(this.settings as unknown as Record<string, unknown>, before)) {
      if (opts.loud) new Notice('Graphite: the settings note already says what the settings do.');
      return;
    }
    await this.writeOwnNote(SETTINGS_NOTE_PATH,
      settingsNoteText(this.settings as unknown as Record<string, unknown>, before));
    if (opts.loud) new Notice(`Graphite: settings written to ${SETTINGS_NOTE_PATH}.`);
  }

  /** The switch in the settings screen. On with a note already there is a
   *  RESTORE: the note is read in, not overwritten. */
  async keepSettingsNote(on: boolean) {
    this.settings.configFile = on;
    if (on && this.app.vault.getAbstractFileByPath(SETTINGS_NOTE_PATH)) {
      await this.readSettingsNoteIn({ loud: true });
    }
    await this.saveSettings();
  }

  /** ROW 2375: the CouchDB server note sync would use, as set. */
  couchClient(): CouchClient {
    return new CouchClient(
      { url: this.settings.couchUrl, db: this.settings.couchDb, user: this.settings.couchUser, password: this.settings.couchPassword },
      (r) => requestUrl(r),
    );
  }

  /** The last test of the note-sync server, for the settings screen. */
  noteSyncCheck: TransportCheck | null = null;

  async testNoteSync(): Promise<TransportCheck> {
    this.noteSyncCheck = await this.couchClient().check();
    new Notice(`Graphite: ${this.noteSyncCheck.detail}`, 8000);
    return this.noteSyncCheck;
  }

  /* ══ ROW 2375 · NOTES TRAVEL (R-5255, R-5254) ════════════════════════
   * One run of the engine over the CouchDB transport: take what arrived,
   * send what changed. Run by the command, shortly after a vault change,
   * and by live sync whenever the server says something arrived. Off sends
   * nothing and asks nothing (RU-035). */

  /** The vault as note-engine.ts sees it: bytes in, bytes out, deletions
   *  to the vault trash. */
  noteVault(): NoteVault {
    const vault = this.app.vault;
    const fileAt = (p: string) => {
      const f = vault.getAbstractFileByPath(p);
      return f instanceof TFile ? f : null;
    };
    return {
      list: async () => vault.getFiles().map((f) => ({ path: f.path, mtime: f.stat?.mtime ?? 0, size: f.stat?.size ?? 0 })),
      read: async (p) => {
        const f = fileAt(p);
        return f ? new Uint8Array(await vault.readBinary(f)) : null;
      },
      write: async (p, content, mtime) => {
        const data = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength) as ArrayBuffer;
        const opts = mtime ? { mtime } : undefined;
        const f = fileAt(p);
        if (f) { await vault.modifyBinary(f, data, opts); return; }
        const dir = p.split('/').slice(0, -1);
        for (let i = 1; i <= dir.length; i++) {
          const d = dir.slice(0, i).join('/');
          if (!vault.getAbstractFileByPath(d)) await vault.createFolder(d);
        }
        await vault.createBinary(p, data, opts);
      },
      trash: async (p) => {
        const f = fileAt(p);
        if (f) await vault.trash(f, false);
      },
      // Row 2375: a rename from another device is a move here. vault.rename,
      // not fileManager.renameFile: the notes that linked to it were updated
      // on the device that renamed it and arrive as their own edits, so
      // rewriting them here as well would make a second, competing edit.
      rename: async (from, to) => {
        const f = fileAt(from);
        if (!f) return;
        const dir = to.split('/').slice(0, -1);
        for (let i = 1; i <= dir.length; i++) {
          const d = dir.slice(0, i).join('/');
          if (!vault.getAbstractFileByPath(d)) await vault.createFolder(d);
        }
        await vault.rename(f, to);
      },
    };
  }

  /** ROW 2375 (R-5254): the text each note last agreed with [target] — the
   *  base a merge starts from — kept in this plugin's own folder inside the
   *  config directory: on this device only, never in the vault's notes and
   *  never carried by note sync (which keeps out every dot-folder). One file
   *  per note, named by the SHA-256 of the target and path, so no note's
   *  name is written there. */
  noteBases(target: string): NoteBaseStore | null {
    const adapter = this.app.vault.adapter as unknown as {
      exists?(p: string): Promise<boolean>;
      readBinary?(p: string): Promise<ArrayBuffer>;
      writeBinary?(p: string, data: ArrayBuffer): Promise<void>;
      mkdir?(p: string): Promise<void>;
      remove?(p: string): Promise<void>;
    };
    if (!adapter.exists || !adapter.readBinary || !adapter.writeBinary || !adapter.mkdir || !adapter.remove) {
      return null; // no place to keep a base: every both-sides change keeps both
    }
    const configDir = (this.app.vault as unknown as { configDir?: string }).configDir ?? '.obsidian';
    const dir = `${configDir}/plugins/${this.manifest?.id ?? 'graphite-sync'}/sync-base`;
    const fileOf = async (p: string) =>
      `${dir}/${await noteSha(new TextEncoder().encode(`${target}\n${p}`))}`;
    return {
      get: async (p) => {
        const f = await fileOf(p);
        return (await adapter.exists!(f)) ? new Uint8Array(await adapter.readBinary!(f)) : null;
      },
      put: async (p, content) => {
        if (!(await adapter.exists!(dir))) await adapter.mkdir!(dir);
        const data = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength) as ArrayBuffer;
        await adapter.writeBinary!(await fileOf(p), data);
      },
      drop: async (p) => {
        const f = await fileOf(p);
        if (await adapter.exists!(f)) await adapter.remove!(f);
      },
    };
  }

  /** Two engines writing one vault is how notes are lost: while LiveSync
   *  is on in this vault, note sync does not start. */
  liveSyncPluginOn(): boolean {
    const plugins = (this.app as unknown as { plugins?: { enabledPlugins?: Set<string> } }).plugins;
    return !!plugins?.enabledPlugins?.has('obsidian-livesync');
  }

  private noteSyncRunning: Promise<NoteSyncReport | null> | null = null;
  private noteSyncAgain = false;
  noteSyncTimer = 0;
  /** How long the vault must sit still after a change before it is sent. */
  noteSyncDelay = 2000;
  /** How long one live long-poll waits; a test shortens it. */
  liveWaitMs = LIVE_WAIT_MS;
  /** ROWS 2375/2376: the live loop's own badge, beside the server's. Made
   *  the first time live sync starts, so a vault that never turns it on
   *  carries none. */
  private noteStatusEl: HTMLElement | null = null;
  private setNoteBadge(state: LiveState | 'off', detail?: string) {
    if (state === 'off' && !this.noteStatusEl) return;
    this.noteStatusEl ??= this.addStatusBarItem();
    this.noteStatusEl.setText(noteLiveBadge(state, detail));
  }
  /** The last thing note sync said, for the settings screen. */
  noteSyncLast = '';
  private follower: LiveFollower | null = null;

  /** Run note sync now. Null when it is off, refused, or failed (each said);
   *  otherwise what moved. A run asked for while one is going runs once
   *  more after it, never beside it. */
  async syncNotesNow(opts: { loud?: boolean } = {}): Promise<NoteSyncReport | null> {
    if (this.settings.noteSync === 'off') {
      if (opts.loud) new Notice('Graphite: note sync is off. Choose a server under Note sync in the settings.');
      return null;
    }
    if (this.noteSyncRunning) {
      this.noteSyncAgain = true;
      return this.noteSyncRunning;
    }
    this.noteSyncRunning = this.noteSyncOnce(opts);
    try {
      let r = await this.noteSyncRunning;
      while (this.noteSyncAgain) {
        this.noteSyncAgain = false;
        this.noteSyncRunning = this.noteSyncOnce({});
        r = await this.noteSyncRunning;
      }
      return r;
    } finally {
      this.noteSyncRunning = null;
    }
  }

  private async noteSyncOnce(opts: { loud?: boolean }): Promise<NoteSyncReport | null> {
    const say = (text: string, ms = 8000) => { this.noteSyncLast = text; new Notice(`Graphite: ${text}`, ms); };
    if (this.liveSyncPluginOn()) {
      say('note sync did not start, because LiveSync is on in this vault. Turn LiveSync off first: two sync engines in one vault lose notes.', 12000);
      return null;
    }
    const s = this.settings;
    const transport = new CouchNoteTransport(this.couchClient(), s.couchPassphrase);
    try {
      await transport.open();
    } catch (e) {
      say((e as Error).message, 12000);
      return null;
    }
    // A different server, database or database identity is a fresh start:
    // nothing agreed with another far side holds here.
    const target = `${s.couchUrl.trim().replace(/\/+$/, '')}|${s.couchDb}|${transport.identity}`;
    if (s.noteSyncState.target !== target) s.noteSyncState = emptyNoteSyncState(target);
    const engine = new NoteSyncEngine(
      transport, this.noteVault(), s.noteSyncState, undefined, this.noteBases(target));
    let report: NoteSyncReport;
    try {
      report = await engine.run();
    } catch (e) {
      say(`note sync stopped: ${(e as Error).message}`, 12000);
      return null;
    } finally {
      // What was agreed before a failure stays agreed.
      await this.saveData(this.settings);
    }
    for (const c of report.conflicts) {
      say(`${c.path} was changed on this device and on another. Both are kept: the other version is beside it as ${c.copy}.`, 15000);
    }
    for (const m of report.merged) {
      say(`${m} was changed on this device and on another, in different places. Both edits are kept in it.`, 12000);
    }
    for (const r of report.refused) say(`${r.path} was not synced: ${r.reason}.`, 12000);
    for (const k of report.kept) say(`${k} was deleted on one device and edited on another; the edited version is kept.`, 12000);
    if (report.unreadable) {
      say(`${report.unreadable} document${report.unreadable === 1 ? '' : 's'} in the database could not be opened with this passphrase and ${report.unreadable === 1 ? 'was' : 'were'} left alone.`, 12000);
    }
    const moved = report.received.length + report.sent.length + report.trashed.length + report.moved.length;
    if (opts.loud || moved) {
      // Row 2375: a rename from another device is said as one.
      const renamed = report.moved.length ? ` ${report.moved.length} renamed,` : '';
      this.noteSyncLast = `notes synced: ${report.received.length} received, ${report.sent.length} sent,${renamed} ${report.trashed.length} moved to the trash.`;
      if (opts.loud) new Notice(`Graphite: ${this.noteSyncLast}`);
    }
    return report;
  }

  /** A vault change: sent once the vault has been still for a moment. */
  noteSyncSoon() {
    if (this.settings.noteSync === 'off') return;
    window.clearTimeout(this.noteSyncTimer);
    this.noteSyncTimer = window.setTimeout(() => void this.syncNotesNow(), this.noteSyncDelay);
  }

  /** Live sync on or off, to match the settings. Called at start-up and
   *  whenever a note-sync setting changes. */
  restartNoteSync() {
    this.follower?.stop();
    this.follower = null;
    this.liveRun = null;
    const s = this.settings;
    if (s.noteSync !== 'couchdb' || !s.liveSync || !s.couchPassphrase || this.liveSyncPluginOn()) {
      this.setNoteBadge('off');
      return;
    }
    const transport = new CouchNoteTransport(this.couchClient(), s.couchPassphrase);
    const started = Symbol('live');
    this.liveRun = started;
    this.setNoteBadge('syncing');
    // A first run, then wait from where it left off.
    void this.syncNotesNow().then(() => {
      if (this.liveRun !== started) return;
      this.follower = new LiveFollower(transport, {
        since: this.settings.noteSyncState.cursor,
        onChange: async () => {
          await this.syncNotesNow();
          return this.settings.noteSyncState.cursor;
        },
        onState: (state, detail) => {
          if (this.liveRun === started) this.setNoteBadge(state, detail);
        },
        waitMs: this.liveWaitMs,
      });
      void this.follower.run();
    });
  }
  private liveRun: symbol | null = null;

  async onunload() {
    this.follower?.stop();
    this.follower = null;
    this.liveRun = null;
    window.clearTimeout(this.noteSyncTimer);
    Object.values(this.pushTimers).forEach((t) => window.clearTimeout(t));
    Object.values(this.tickTimers).forEach((t) => window.clearTimeout(t));
    Object.values(this.gestureTimers).forEach((t) => window.clearTimeout(t));
  }

  /* ══ THIS DEVICE ═════════════════════════════════════════════════════════
   *
   * One switch, `source`, says whether this vault gets Graphite from a server
   * or from the Graphite app on the same device. On a device nothing is
   * asked of anything: the app writes the notes into the vault when it is
   * opened and takes in what the vault changed (device-mirror.ts says what
   * this plugin reads of that). So no request is ever made in this mode, and
   * what needs a server is stopped HERE, with a sentence, by `needsServer` —
   * a person never reads a raw failure from a call that was never going to
   * be made. */

  /* ══ THIS COMPUTER ═══════════════════════════════════════════════════════
   *
   * One switch, `source`, decides where every request goes, and everything
   * below it asks `endpoint()` instead of reading the server settings. So
   * the Graphite app on this computer answers the calls a server answers
   * (the allowlist is on its side), and what it does not answer is stopped
   * HERE, with a sentence, by `needsServer` — a person never reads a raw
   * 404 from a route the app was never going to have. */

  get onDevice(): boolean { return this.settings.source === 'device'; }

  get onComputer(): boolean { return this.settings.source === 'computer'; }

  /** Neither a device nor a computer asks a server: what needs one stops. */
  get offServer(): boolean { return this.onDevice || this.onComputer; }

  /** What the vault last said the app left in it. Null until looked at. */
  mirrorLook: MirrorLook | null = null;

  /** Look in the vault for what the app wrote. Reads files and nothing else. */
  async lookAtMirror(): Promise<MirrorLook> {
    const a = this.app.vault.adapter;
    this.mirrorLook = await lookForMirror({
      list: (dir) => a.list(dir),
      read: (path) => a.read(path),
      mtime: async (path) => (await a.stat(path))?.mtime ?? null,
    });
    return this.mirrorLook;
  }

  private doorSeen: { at: number; look: DoorLook } | null = null;

  /** The door of the app, found in the file it leaves. Kept for a few seconds so
   *  a burst of requests reads the file once; `fresh` always reads it, and a
   *  connection check does, because that is where a restarted app is
   *  noticed. A phone has no app and no files to read. */
  doorLook(fresh = false): DoorLook {
    if (!Platform.isDesktopApp) return { ok: false, why: 'phone' };
    const now = Date.now();
    if (!fresh && this.doorSeen && now - this.doorSeen.at < 3000) return this.doorSeen.look;
    const look = this.readDoorFile();
    this.doorSeen = { at: now, look };
    return look;
  }

  private readDoorFile(): DoorLook {
    const req = (window as any).require;
    if (!req) return { ok: false, why: 'phone' };
    try {
      const fs = req('fs'); const p = req('path');
      const proc = (globalThis as any).process;
      return findDoor(
        doorFileCandidates(proc?.env ?? {}, proc?.platform ?? '', (...a: string[]) => p.join(...a)),
        (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } },
      );
    } catch {
      return { ok: false, why: 'unreadable' };
    }
  }

  /** Where requests go and the key they carry, or null when there is
   *  nowhere to send them. A device has no server to send anything to. */
  endpoint(): { base: string; token: string } | null {
    if (this.onDevice) return null;
    if (this.onComputer) {
      const look = this.doorLook();
      return look.ok ? { base: doorBase(look.door), token: look.door.key } : null;
    }
    if (!this.settings.serverUrl || !this.settings.token) return null;
    return { base: this.settings.serverUrl.replace(/\/+$/, ''), token: this.settings.token };
  }

  /** Whether there is somewhere to ask. */
  get configured(): boolean { return this.endpoint() !== null; }

  /** What to say when there is not: a short form for the status bar and the
   *  sentence for a Notice. */
  notConfigured(): { short: string; long: string } {
    if (this.onDevice) {
      return {
        short: mirrorShort(this.mirrorLook),
        long: 'this vault reads Graphite from the Graphite app on this device, which writes the '
          + 'notes into the vault itself. There is nothing to pull or push here.',
      };
    }
    if (this.onComputer) {
      const look = this.doorLook();
      const why = look.ok ? 'no-file' : look.why;
      return { short: doorShort(why), long: doorSentence(why) };
    }
    return { short: 'not configured', long: 'set the server URL and API token in settings first.' };
  }

  /** Said when a connection check fails, for the pull and add commands. */
  noConnectionNote(): string {
    return this.onDevice
      ? `Graphite: ${this.notConfigured().long}`
      : this.onComputer
      ? `Graphite: no connection — ${this.notConfigured().long}`
      : 'Graphite: no connection — check the server URL and token in settings.';
  }

  /** A feature that needs a server, asked for while this vault reads from
   *  the Graphite app on this device or computer. True means it was said and the
   *  caller stops. Said once a session when `loud` is false, for the ones that run
   *  on their own (a ticked box, a census). */
  needsServer(what: string, loud = true): boolean {
    if (!this.offServer) return false;
    if (loud || !this.toldDevice.has(what)) {
      new Notice(`Graphite: ${what} needs a Graphite server. The Graphite app on this `
        + (this.onComputer
          ? 'computer does not do it for a notes app yet, so nothing was changed.'
          : 'device does not do it for a notes app, so nothing was changed.'), 10000);
      this.toldDevice.add(what);
    }
    return true;
  }
  private toldDevice = new Set<string>();
  /** The app on this computer said it lets notes apps read and not change.
   *  Remembered so an auto-push does not say it again on every edit. */
  computerReadOnly = false;

  api(path: string) {
    const base = this.onDevice
      ? NO_SERVER
      : this.onComputer
      ? (this.endpoint()?.base ?? NO_DOOR)
      : this.settings.serverUrl.replace(/\/+$/, '');
    return `${base}/api${path}`;
  }
  get headers() {
    // OC2: EVERY request says which vault it came from. The server walls a
    // request that carries this to the vault's bound space, and refuses one
    // from a vault that is not bound — so a write cannot slip past the wall
    // by being sent from a code path that forgot to ask.
    return {
      Authorization: `Bearer ${this.onDevice ? '' : this.onComputer ? (this.endpoint()?.token ?? '') : this.settings.token}`,
      [VAULT_HEADER]: this.settings.vaultId,
    };
  }

  private setStatus(text: string, kind: 'ok' | 'bad' | 'checking') {
    const dot = kind === 'ok' ? '🟢' : kind === 'bad' ? '🔴' : '⏳';
    this.statusEl?.setText(`Graphite ${dot} ${text}`);
  }

  async openPanel() {
    let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false)!;
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
  }

  refreshPanel() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      (leaf.view as LpSyncView).render();
    }
  }

  /** Pings /auth/me (+ /health for the server version). Updates the status
   *  bar and panel; loud=true also raises a Notice. */
  async checkConnection(loud: boolean): Promise<boolean> {
    // On a device there is nothing to connect to: the check is a look at what
    // the app left in the vault.
    if (this.onDevice) {
      this.lastMe = null; this.lastHealth = null;
      this.setStatus('…', 'checking');
      let look: MirrorLook;
      try { look = await this.lookAtMirror(); } catch {
        this.lastCheck = { at: Date.now(), ok: false, detail: 'could not read this vault' };
        this.setStatus('could not read this vault', 'bad');
        if (loud) new Notice('Graphite: this vault could not be read.');
        this.refreshPanel();
        return false;
      }
      const said = mirrorSentence(look, Date.now(), Platform.isMobile);
      this.lastCheck = { at: Date.now(), ok: look.folders.length > 0, detail: said };
      this.setStatus(mirrorShort(look), look.folders.length ? 'ok' : 'bad');
      if (loud) new Notice(`Graphite: ${said}`, 12000);
      this.refreshPanel();
      // A device is not a server: the callers of a check that go on to ask a
      // server stop here, and say the notes are the app's to write.
      return false;
    }
    // The app on this computer may have restarted since the last look: its
    // port and key are new every time, so a check reads the file again.
    if (this.onComputer) {
      this.doorLook(true);
      this.computerReadOnly = false;
    }
    if (!this.configured) {
      this.lastMe = null; this.lastHealth = null; this.lastCheck = null;
      const say = this.notConfigured();
      this.setStatus(say.short, 'bad');
      if (loud) new Notice(`Graphite: ${say.long}`, this.onComputer ? 12000 : undefined);
      this.refreshPanel();
      return false;
    }
    this.setStatus('…', 'checking');
    try {
      const [me, health] = await Promise.all([
        requestUrl({ url: this.api('/auth/me'), headers: this.headers }),
        this.askHealth(),
      ]);
      this.lastMe = me.json;
      this.lastHealth = health?.json ?? null;
      const who = this.onComputer
        ? 'this computer'
        : this.lastMe?.name ?? this.lastMe?.email ?? 'connected';
      this.lastCheck = {
        at: Date.now(), ok: true,
        detail: [
          this.lastHealth?.version ? `Graphite ${this.lastHealth.version}` : '',
          this.onComputer ? 'read from this computer, no server' : `signed in as ${who}`,
        ].filter(Boolean).join(' · '),
      };
      if (this.handshake?.outdated) {
        // REGISTER 1527: connected and readable, but every write waits for
        // an update. The status bar is where that is said first.
        this.lastCheck.detail = `${this.lastCheck.detail} · update Graphite Sync (this server accepts ${this.handshake.floor} or newer)`;
        this.setStatus('update Graphite Sync', 'bad');
        if (loud) new Notice(outdatedSentence(this.handshake, 'written'), 12000);
      } else {
        this.setStatus(who, 'ok');
        if (loud) {
          new Notice(this.onComputer
            ? 'Graphite: connected to the Graphite app on this computer.'
            : `Graphite: connected as ${who}.`);
        }
      }
      this.refreshPanel();
      this.refreshLinks();
      void this.reportVault();
      // Whether capture is on is the binding, so it is read where the
      // connection is: the tick events wait on it.
      void this.fetchBinding().catch(() => undefined);
      if (this.settings.censusOn) void this.reportCensus();
      void this.publishToolbarListsSoon();
      // OC5 refreshes the routes itself, so it is either/or, not both.
      if (this.settings.agentOn) void this.publishAgentContract();
      else void this.refreshRoutes();
      // Linking is enough: whatever space the key can read and this vault has
      // not been offered comes in now.
      window.clearTimeout(this.mirrorTimer);
      this.mirrorTimer = window.setTimeout(() => void this.mirrorEverySpace(false), this.firstMirrorDelayMs);
      return true;
    } catch (e: any) {
      this.lastMe = null;
      const status = e?.status ?? '';
      // The file named a port and nothing answered on it: the app is closed
      // (it removes the file when it closes cleanly, so this is a crash or a
      // kill). Said as that, not as a socket error.
      const why = this.onComputer
        ? status === 401 ? 'Graphite did not accept the key; choose This computer again' : doorShort('refused')
        : status === 401 ? 'token rejected (expired or revoked?)' : `unreachable (${status || e})`;
      this.lastCheck = { at: Date.now(), ok: false, detail: why };
      this.setStatus(why, 'bad');
      if (loud) new Notice(`Graphite: ${this.onComputer && status !== 401 ? doorSentence('refused') : why}`);
      this.refreshPanel();
      return false;
    }
  }

  /* ══ REGISTER 1527 · THE VERSION HANDSHAKE ═══════════════════════════════
   * One call at startup: the GET /health the connection check makes anyway
   * carries the oldest plugin the server accepts (handshake.ts). */

  /** GET /health, shared by whoever asks while it is in flight. Reading it
   *  also records the handshake. */
  askHealth(): Promise<{ json: any } | null> {
    if (!this.healthAsk) {
      this.healthAsk = requestUrl({ url: this.api('/health') })
        .then((res) => {
          this.handshake = readHandshake(res.json, this.manifest.version);
          return res;
        })
        .catch(() => null)
        .finally(() => { this.healthAsk = null; });
    }
    return this.healthAsk;
  }

  /** May this plugin write to Graphite? Asks /health only if no answer has
   *  come yet (a write made before the startup check returned). A server
   *  that cannot be reached is not a refusal here: the write itself fails
   *  and says so. `loud` false is an automatic write, said once. */
  async writeAllowed(what: string, loud = true): Promise<boolean> {
    if (!this.handshake) await this.askHealth();
    if (!this.handshake?.outdated) return true;
    if (loud || !this.toldOutdated) new Notice(outdatedSentence(this.handshake, what), 12000);
    this.toldOutdated = true;
    return false;
  }

  /** The sentence the panels show while this plugin is out of date. */
  outdatedNote(): string | null {
    return this.handshake?.outdated ? outdatedSentence(this.handshake, 'written') : null;
  }

  /* ══ REGISTER 2519 · THE LINKS PANEL ═════════════════════════════════════ */

  async openLinks() {
    let leaf = this.app.workspace.getLeavesOfType(LINKS_VIEW)[0];
    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false)!;
      await leaf.setViewState({ type: LINKS_VIEW, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
  }

  refreshLinks() {
    for (const v of this.linksViews) v.render();
  }

  /** Which record a line of a note stands for (links.ts recordAt). */
  spotIn(path: string | null, lines: string[], at: number): Spot {
    const entry = path ? this.settings.files[path] : undefined;
    return recordAt(lines, at, entry ? { synced: { role: entry.role } } : {});
  }

  /** The cursor hook. With no panel open this returns before touching the
   *  editor; with one open it hands the feed a way to find the line later. */
  cursorMovedIn(view: EditorView) {
    if (!this.feed?.isOpen) return;
    const path = this.app.workspace.getActiveFile()?.path ?? null;
    const state = view.state;
    this.feed.moved(() => this.spotIn(path, state.doc.toString().split('\n'),
      state.doc.lineAt(state.selection.main.head).number - 1));
  }

  /** The same, for a cursor somewhere a test (or a note switch) names. */
  cursorAt(path: string | null, text: string, line: number) {
    this.feed.moved(() => this.spotIn(path, text.split('\n'), line));
  }

  /** A note was switched to, or the panel opened: ask about where the
   *  cursor is now, through the same debounce. */
  nudgeLinks() {
    if (!this.feed?.isOpen) return;
    const ed = (this.app.workspace as any).activeEditor?.editor as Editor | undefined;
    const path = this.app.workspace.getActiveFile()?.path ?? null;
    this.feed.moved((): Spot => ed
      ? this.spotIn(path, ed.getValue().split('\n'), ed.getCursor().line)
      : { none: NOT_A_RECORD });
  }

  /** GET the link log of one record — grouped by module, as the server
   *  answers it, and refused if it arrives in any other shape. */
  async fetchLinkLog(r: RecordRef): Promise<LinkLog> {
    if (this.onDevice) {
      throw new Error('link history needs a Graphite server');
    }
    if (this.onComputer) {
      throw new Error('the Graphite app on this computer does not keep link history for a notes app yet');
    }
    const res = await requestUrl({
      url: this.api(`/records/${r.kind}/${encodeURIComponent(r.id)}/links`),
      headers: this.headers, throw: false,
    });
    if (res.status === 404) throw new Error('the server does not know this record, or is older than the link log');
    if (res.status >= 300) throw new Error(`the server answered ${res.status}`);
    const log = readLinkLog(res.json);
    if (!log) throw new Error('the server answered in a shape this plugin cannot read');
    return log;
  }

  /** R-305: tell the server which vault this plugin lives in, so the app's
   *  mirror settings can offer a dropdown of real vaults instead of a typed
   *  folder.
   *
   *  ── R-1500: FIRE-AND-FORGET BECAME FIRE-AND-REMEMBER ────────────────
   *
   *  `throw: false` STAYS, and it is right: an older server with no
   *  endpoint answers 404 and nothing is wrong. What was wrong is that the
   *  answer was never LOOKED AT. The route was later gated to the instance
   *  operator — deliberately, and mirror.controller carries the argument —
   *  so an ordinary account's plugin now posts, is refused 403, and returns
   *  as though it had worked. Its vault never appears in the app's
   *  dropdown, and the plugin's own controller comment says the shape of
   *  it: "swallowed with no signal on either side".
   *
   *  A person watching that has no way to tell a refusal from a server
   *  that has not noticed them yet, so they wait for something that is
   *  never coming. This is the same confident silence the rest of this
   *  product keeps being repaired for.
   *
   *  STILL NOT AN ERROR AND STILL NOT A POPUP. Being refused is a correct
   *  outcome for a non-operator; what it is not is an invisible one. */
  async reportVault() {
    // The app on this device has no folder dropdown of vaults to put this
    // one in, so there is nothing to report and nothing to say.
    if (this.offServer) { this.vaultReport = null; this.refreshPanel(); return; }
    try {
      const name = this.app.vault.getName();
      // ── 2026-11-07: THEIR OWN LIST FIRST, THEN THE OLD OPERATOR ROUTE ───
      //
      //  Omar: "all my vaults" - the app lists the vaults a person has
      //  reported, with this plugin version and when each was last seen.
      //  POST /mirror/vaults/mine is open to any signed-in account, so it is
      //  asked FIRST and its answer is the answer. A report by an operator on
      //  it still reaches the mirror-folder dropdown in the app (the dropdown
      //  reads what an operator reported), so nothing is asked twice.
      //
      //  A server from before that route answers 404, and only then is the
      //  old operator route tried, exactly as it was - with no version in
      //  the body, because that server never heard of one. throw: false
      //  stays on both: a refusal is read from the status, never thrown.
      const mine = await requestUrl({
        url: this.api('/mirror/vaults/mine'),
        method: 'POST',
        contentType: 'application/json',
        body: JSON.stringify({ name, pluginVersion: this.manifest?.version }),
        headers: this.headers,
        throw: false,
      });
      const res = mine.status !== 404 ? mine : await requestUrl({
        url: this.api('/mirror/vaults'),
        method: 'POST',
        contentType: 'application/json',
        body: JSON.stringify({ name }),
        headers: this.headers,
        throw: false,
      });
      this.vaultReport =
        res.status === 403 ? 'gated' : res.status >= 400 ? 'failed' : null;
    } catch {
      this.vaultReport = 'failed';
    }
    this.refreshPanel();
  }

  /** ROW 2376: ask the server which devices and tokens this account has.
   *  Asked when the settings tab opens — where a person looks — rather than
   *  on every connection check, which runs on its own every few minutes. */
  async fetchDevices(): Promise<void> {
    if (this.offServer) {
      this.devices = null; this.devicesReport = this.onComputer ? 'computer' : 'device';
      return;
    }
    if (!this.settings.serverUrl || !this.settings.token) {
      this.devices = null; this.devicesReport = null;
      return;
    }
    try {
      const res = await requestUrl({
        url: this.api('/auth/sessions'), headers: this.headers, throw: false,
      });
      if (res.status < 300 && Array.isArray(res.json)) {
        this.devices = (res.json as any[]).map((d) => ({
          id: String(d?.id ?? ''),
          userAgent: typeof d?.userAgent === 'string' ? d.userAgent : '',
          createdAt: typeof d?.createdAt === 'string' ? d.createdAt : null,
          lastUsedAt: typeof d?.lastUsedAt === 'string' ? d.lastUsedAt : null,
          current: d?.current === true,
        }));
        this.devicesReport = null;
        return;
      }
      this.devices = null;
      this.devicesReport = res.status === 404 ? 'old-server'
        : res.status === 401 || res.status === 403 ? 'refused' : 'failed';
    } catch {
      this.devices = null;
      this.devicesReport = 'failed';
    }
  }

  /** ROW 2376: every Graphite server the vaults on this machine point at.
   *  On a phone, or with no readable vault registry, that is this vault's
   *  own server — Obsidian shows a plugin no other vault there. */
  serversOnThisMachine(): ServerUse[] {
    // A vault that reads from the app on this device has no server of its
    // own to list.
    const configs: { vault: string; url: string; here: boolean }[] = this.offServer
      ? [] : [{ vault: 'This vault', url: this.settings.serverUrl, here: true }];
    if (Platform.isDesktopApp) {
      const req = (window as any).require;
      if (req) {
        try {
          const fs = req('fs'); const p = req('path');
          for (const v of this.listVaults()) {
            if (v.current) continue;
            try {
              const data = JSON.parse(fs.readFileSync(
                p.join(v.path, '.obsidian', 'plugins', 'graphite-sync', 'data.json'), 'utf8'));
              if (typeof data?.serverUrl === 'string') {
                configs.push({ vault: v.name, url: data.serverUrl, here: false });
              }
            } catch { /* that vault has no Graphite Sync config */ }
          }
        } catch { /* no filesystem after all: this vault only */ }
      }
    }
    return groupServers(configs);
  }

  /** ROW 2376: one press, one unauthenticated /health — a server another
   *  vault uses has no token of THIS vault's to present, and needs none to
   *  say whether it answers. */
  async checkServer(url: string): Promise<void> {
    const at = Date.now();
    try {
      const res = await requestUrl({
        url: `${url.replace(/\/+$/, '')}/api/health`, throw: false,
      });
      const v = (res.json as any)?.version;
      this.serverChecks[serverKey(url)] = res.status < 300
        ? { at, ok: true, detail: v ? `Graphite ${v}` : '' }
        : { at, ok: false, detail: `answered ${res.status}` };
    } catch (e: any) {
      this.serverChecks[serverKey(url)] = { at, ok: false, detail: `unreachable (${e?.status ?? e})` };
    }
  }

  /* ══ R-1227 · CAPTURE FROM ANY NOTE ═══════════════════════════════════
   *
   * "graphite should be able to grab things from my obsidian notes" — a
   * `- [ ] chase pump seal #st/IS-07` line ANYWHERE in the vault becomes a
   * task, with its tags, deduped by stamping the id back into the line.
   *
   * THE PLUGIN DOES NOT DECIDE WHAT A TASK LINE IS. It sends raw lines and
   * the server parses them — one opinion about the grammar, on the side
   * that also has to store the result. What the plugin owns is the two
   * things only it can do: reading the vault, and writing the stamp back.
   *
   * MIRRORED FILES ARE SKIPPED. A tracked note is already the server's own
   * export; its task lines are records that exist, and capturing them
   * would make a second copy of every task in the vault.
   */
  /** MEETING-CAPTURE: how long a note must sit still before it captures by
   *  itself. A field so a test can shorten it. */
  autoCaptureDelay = 60_000;
  /** NOTE PAGES: whole notes sent to Graphite (pages.ts). */
  pages!: PageSync;
  private autoCaptureTimers: Record<string, number> = {};

  private autoCaptureSoon(file: TFile) {
    window.clearTimeout(this.autoCaptureTimers[file.path]);
    this.autoCaptureTimers[file.path] = window.setTimeout(() => {
      // Open in the editor means still being written: look again later,
      // rather than stamping the line under the cursor.
      if (this.app.workspace.getActiveFile()?.path === file.path) {
        this.autoCaptureSoon(file);
        return;
      }
      delete this.autoCaptureTimers[file.path];
      void this.captureVault({ only: [file], quiet: true });
    }, this.autoCaptureDelay);
  }

  /** `only`: just these notes (auto-capture); the command reads the whole
   *  vault. `quiet`: a capture nobody asked for does not say "nothing new". */
  async captureVault(opts: { only?: TFile[]; quiet?: boolean } = {}) {
    if (this.needsServer('Capturing tasks from notes', !opts.quiet)) return;
    // OC2: THE INBOX IS THE BINDING'S. Asked once, before the vault is read:
    // a vault that is not bound, or has no inbox, would have every batch
    // refused for the same reason, and the reason is the useful part.
    let binding: VaultBinding | null;
    try {
      binding = await this.fetchBinding();
    } catch (e: any) {
      new Notice(`Graphite: nothing was captured — the server could not be asked about this `
        + `vault (${e?.message ?? e}). Check the connection, then capture again.`, 12000);
      return;
    }
    if (binding === null) {
      new Notice('Graphite: nothing was captured — this server does not know which space a '
        + 'vault is bound to yet. Update the Graphite server, then capture again.', 12000);
      return;
    }
    if (!binding.bound) {
      new Notice('Graphite: this vault is not bound to a space yet, so nothing can be captured. '
        + 'Choose its space in the Graphite Sync settings.', 12000);
      return;
    }
    if (!binding.inbox) {
      new Notice('Pick a capture inbox in the Graphite Sync settings first.');
      return;
    }
    // REGISTER 1527: an out-of-date plugin does not capture.
    if (!(await this.writeAllowed('captured'))) return;
    // A note deleted or renamed while it waited is not there to read.
    const files = (opts.only ?? this.app.vault.getMarkdownFiles())
      .filter((f) => !opts.only || this.app.vault.getAbstractFileByPath(f.path))
      .filter((f) => !this.settings.files[f.path] && !isAgentFile(f.path));
    let made = 0;
    let lost = 0;
    let refused = 0;
    let why = '';
    let notesMade = 0;
    let unfiled = 0;
    /** OC3: lines that named a place they cannot go, said per line. */
    const routeRefusals: string[] = [];
    /** MEETING-CAPTURE: lines that became records but lost a field on the
     *  way (a name that matched nobody, a date the grammar could not read),
     *  said per line in the words of the server. */
    const lineWarnings: string[] = [];
    const tagList = this.settings.captureTags.split(',').map((t) => t.trim()).filter(Boolean);
    const taggedOn = this.settings.captureAnyTagged || tagList.length > 0;
    for (const file of files) {
      const text = await this.app.vault.read(file);
      const lines = text.split('\n');
      /** 0-based line → the task the server made for it. */
      const stamps = new Map<number, string>();
      // ONLY THE LINES THAT COULD BE CAPTURED, and that is a repair, not an
      // economy. This sent every line of a 200-line slice, blank ones
      // included — and the DTO on the server requires the text of each line to be
      // non-empty under a GLOBAL ValidationPipe, so any slice with a blank
      // line in it (which is every real note) was refused with a 400, and
      // the `continue` below swallowed it. Capture reported "Nothing new to
      // capture" over notes full of task lines.
      // OC3: the heading each line sits under and the note's `lp_space:`,
      // raw. The server decides what they mean, inside the wall.
      const space = noteSpace(lines);
      // MEETING-CAPTURE: the day `due: friday` counts from — the note's,
      // not the day it happens to be captured.
      const today = noteDay(file.path, text, file.stat?.ctime ?? Date.now());
      // NOTE PAGES: a note that is a page is sent first, and the capture names
      // it so the tasks it makes link to it. Null when it is not one, or when
      // the server would not take it - the lines are captured either way.
      const pageRef = await this.pages.beforeCapture(file.path);
      const candidates = captureCandidates(lines, taggedOn).map((i) => {
        const section = sectionFor(lines, i);
        return { text: asServerSpelling(lines[i]), path: file.path, line: i, ...(section ? { section } : {}) };
      });
      // THE CAP IS THE SERVER'S (200 a batch) and this pages to it rather
      // than sending a vault in one request.
      for (let from = 0; from < candidates.length; from += 200) {
        const slice = candidates.slice(from, from + 200);
        const res = await requestUrl({
          // OC2: no module in the path — the server files into the
          // inbox on this vault's binding, inside its wall.
          url: this.api('/mirror/capture'),
          method: 'POST',
          contentType: 'application/json',
          body: JSON.stringify({
            lines: slice, note: file.basename, today,
            ...(taggedOn ? { tagged: { any: this.settings.captureAnyTagged, tags: tagList } } : {}),
            ...(space ? { space } : {}),
            ...(pageRef ? { page: pageRef } : {}),
          }),
          headers: this.headers,
          throw: false,
        });
        if (res.status >= 300) {
          // Said at the end, not swallowed: a refused batch is lines that
          // were not captured, and "nothing new" would be untrue.
          refused++;
          // OC2: the wall's refusal names what it would not reach; a
          // count of refused batches without that sentence is half an answer.
          why = (res.json as any)?.message ?? why;
          continue;
        }
        const created = ((res.json as any)?.created ?? []) as
          { line: number; id: string; kind?: string }[];
        for (const c of created) {
          stamps.set(c.line, c.id);
          if (c.kind === 'note') notesMade++;
          else made++;
        }
        unfiled += ((res.json as any)?.unfiled ?? []).length;
        for (const r of ((res.json as any)?.refused ?? []) as { line: number; message: string }[]) {
          routeRefusals.push(`${file.basename}:${r.line + 1} — ${r.message}`);
        }
        // Only for lines THIS capture made. The server reads every line it is
        // sent, the ones it skips as captured long ago included, and warns
        // about each; said again at every capture, it is noise by the third.
        const madeNow = new Set(created.map((c) => c.line));
        for (const w of ((res.json as any)?.warnings ?? []) as { line: number; message: string }[]) {
          if (madeNow.has(w.line)) lineWarnings.push(`${file.basename}:${w.line + 1} — ${w.message}`);
        }
      }
      if (!stamps.size) continue;
      // ONE WRITE PER FILE, and only when something changed. The writingBack
      // guard is what stops auto-push treating our own stamp as an edit.
      //
      // RE-READ FIRST. The requests above take time, and a person can type
      // in this note meanwhile — writing `lines` back as read would put the
      // file back the way it was and lose what they typed. So the stamps
      // go onto the file as it is NOW: a line still where it was is stamped
      // there, a line that moved is found by its text, and a line that was
      // changed is left alone and counted.
      const current = await this.app.vault.read(file);
      const now = current.split('\n');
      for (const [at, id] of stamps) {
        const was = lines[at];
        const here = now[at] === was ? at : now.indexOf(was);
        if (here < 0) { lost++; continue; }
        now[here] = stampCaptured(now[here], id);
      }
      const next = now.join('\n');
      if (next !== current) {
        this.writingBack++;
        try { await this.app.vault.modify(file, next); }
        finally { this.writingBack--; }
      }
    }
    const said = [
      made ? `${made} task${made === 1 ? '' : 's'}` : '',
      notesMade ? `${notesMade} note${notesMade === 1 ? '' : 's'}` : '',
    ].filter(Boolean).join(' and ');
    if (said) new Notice(`Captured ${said}.`);
    else if (refused) new Notice('Graphite: nothing was captured.');
    else if (!opts.quiet) new Notice('Nothing new to capture.');
    if (unfiled) {
      new Notice(`Graphite: ${unfiled} tagged line${unfiled === 1 ? ' was' : 's were'} not `
        + 'captured — the capture inbox\'s space has no Notes module to put a note in. '
        + 'Add one in the app, then capture again.', 12000);
    }
    if (refused) {
      new Notice(`Graphite: the server refused ${refused} batch${refused === 1 ? '' : 'es'} `
        + 'of lines — nothing in them was captured. Check the connection and the '
        + 'capture inbox in settings, then capture again.'
        + (why ? ` The server said: ${why}` : ''), 12000);
    }
    if (routeRefusals.length) {
      // NAMED, per line, and left uncaptured — a token he typed is an
      // instruction, and nothing is filed somewhere he did not say.
      new Notice(`Graphite: ${routeRefusals.length} line${routeRefusals.length === 1 ? ' was' : 's were'} `
        + `not captured:\n${routeRefusals.slice(0, 6).join('\n')}`, 15000);
    }
    if (lineWarnings.length) {
      // The record exists without the field, so "Captured" alone would
      // tell a person the assignee or the date had landed.
      new Notice(`Graphite: ${lineWarnings.length} captured line${lineWarnings.length === 1 ? '' : 's'} `
        + `did not land as written:\n${lineWarnings.slice(0, 6).join('\n')}`, 15000);
    }
    if (lost) {
      // The task exists and its line could not be marked, so the next
      // capture would make it again. Said, not swallowed.
      new Notice(`Graphite: ${lost} captured line${lost === 1 ? ' was' : 's were'} `
        + 'edited while capturing and could not be marked. Check your inbox for '
        + 'a duplicate after the next capture.', 12000);
    }
    // OC6: and the boxes of everything captured before, both ways.
    await this.syncTicks(files, { quiet: opts.quiet });
    // OC7: and the census, which a capture has just changed.
    if (this.settings.censusOn) await this.reportCensus();
  }

  /* ══ OC6 · THE TICK, BOTH WAYS ═══════════════════════════════════════════
   *
   * Omar 2026-09-24: "Both ways". A list of pending items lives for weeks.
   * Ticking a captured line closes its record, and finishing the record in
   * the app — or somebody sharing the space finishing it — ticks the line.
   *
   * THE BOX AND NOTHING ELSE. Only a task line carrying a hidden id, only in
   * a note this plugin does not track (a mirrored note already round-trips
   * through the importer), and only its checkbox: never the words, never a
   * field. The line is found by its id every time, never by its number.
   *
   * THREE-WAY, against the last status both sides agreed on, which lives in
   * `settings.ticks`. The merge itself is vault-tick.ts, bundled from the
   * server's tree so the two ends cannot disagree about what a box means.
   *
   * WHEN IT RUNS: with every capture, on the command, when a note is opened
   * (so a task finished in the app is ticked by the time he looks), and
   * shortly after a note is edited — but an edit asks the server NOTHING
   * unless a box in it now differs from the agreed status, so typing in a
   * note with stamped lines costs no request. All of it only once a capture
   * inbox is chosen: the lines exist because capture was switched on, and
   * that is the consent this rides on (RU-035).
   */
  tickDelayMs = 1500;
  private tickTimers: Record<string, number> = {};

  /** True when a box in this note has moved since the last agreement — the
   *  test that keeps an ordinary edit from becoming a request. */
  private ticksMoved(text: string): boolean {
    return tickLines(text).some((t) => this.settings.ticks[t.id] !== t.state);
  }

  async syncTicks(only?: TFile[], opts: { quiet?: boolean } = {}) {
    if (this.needsServer('Keeping a ticked box in step with Graphite', !opts.quiet)) return;
    const files = (only ?? this.app.vault.getMarkdownFiles())
      .filter((f) => !this.settings.files[f.path] && !isAgentFile(f.path));
    /** Every id's box as the vault shows it. A record on two lines (a line
     *  copied into a second note) is one record: if either copy moved off
     *  the agreement, the vault moved. */
    const local = new Map<string, TickState>();
    const where = new Map<string, Set<string>>();
    for (const file of files) {
      for (const t of tickLines(await this.app.vault.read(file))) {
        const had = local.get(t.id);
        if (had === undefined || had === this.settings.ticks[t.id]) local.set(t.id, t.state);
        if (!where.has(t.id)) where.set(t.id, new Set());
        where.get(t.id)!.add(file.path);
      }
    }
    if (!local.size) return;
    // REGISTER 1527: the tick reads the bundled box grammar, so an
    // out-of-date plugin does not send one.
    if (!(await this.writeAllowed('ticked', !opts.quiet))) return;

    const ids = [...local.keys()];
    const remote = new Map<string, TickState>();
    const gone = new Set<string>();
    let unreadable = 0;
    for (let from = 0; from < ids.length; from += 200) {
      const slice = ids.slice(from, from + 200);
      const res = await requestUrl({
        url: this.api('/mirror/ticks/read'), method: 'POST',
        contentType: 'application/json', body: JSON.stringify({ ids: slice }),
        headers: this.headers, throw: false,
      }).catch(() => null);
      if (!res || res.status >= 300) { unreadable += slice.length; continue; }
      for (const t of ((res.json as any)?.ticks ?? []) as { id: string; state: TickState }[]) {
        remote.set(t.id, t.state);
      }
      for (const id of ((res.json as any)?.missing ?? []) as string[]) gone.add(id);
    }

    const agreed = { ...this.settings.ticks };
    const toLine = new Map<string, TickState>();
    const toServer: { id: string; to: TickState; from: TickState }[] = [];
    let clashes = 0;
    for (const [id, mine] of local) {
      // A record deleted, or out of reach, has nothing to agree with. Its
      // line is capture's business: capture makes it again.
      if (gone.has(id)) { delete agreed[id]; continue; }
      const theirs = remote.get(id);
      if (theirs === undefined) continue;
      const m = mergeTick(this.settings.ticks[id], mine, theirs);
      agreed[id] = m.agreed;
      if (m.line) toLine.set(id, m.line);
      if (m.server) toServer.push({ id, to: m.server, from: theirs });
      if (m.clash) clashes++;
    }

    /** A tick that was not written was not agreed: back to the old base. */
    const restore = (id: string) => {
      if (this.settings.ticks[id]) agreed[id] = this.settings.ticks[id];
      else delete agreed[id];
    };
    let closed = 0;
    let refused = 0;
    for (let from = 0; from < toServer.length; from += 200) {
      const slice = toServer.slice(from, from + 200);
      const res = await requestUrl({
        url: this.api('/mirror/ticks'), method: 'POST',
        contentType: 'application/json', body: JSON.stringify({ ticks: slice }),
        headers: this.headers, throw: false,
      }).catch(() => null);
      if (!res || res.status >= 300) {
        // Not written, so not agreed: the old base stays and the next pass
        // tries again.
        for (const t of slice) restore(t.id);
        unreadable += slice.length;
        continue;
      }
      const out = (res.json ?? {}) as {
        applied?: { id: string; state: TickState }[];
        overridden?: { id: string; state: TickState }[];
        refused?: { id: string }[];
        missing?: string[];
      };
      for (const a of out.applied ?? []) {
        closed++;
        agreed[a.id] = a.state;
        // A recurring task rolls forward and stays open: the line follows.
        if (a.state !== local.get(a.id)) toLine.set(a.id, a.state);
      }
      for (const o of out.overridden ?? []) {
        // THE APP WINS the clash that landed between the read and the write.
        clashes++;
        agreed[o.id] = o.state;
        toLine.set(o.id, o.state);
      }
      for (const r of out.refused ?? []) {
        refused++;
        restore(r.id);
      }
      for (const id of out.missing ?? []) delete agreed[id];
    }

    // THE WRITE INTO HIS NOTE: the box, found by id, on the file as it is
    // NOW. A box he changed while this ran is his newer answer and is left
    // alone — the next pass merges it.
    let ticked = 0;
    const touched = new Set<string>();
    for (const id of toLine.keys()) for (const p of where.get(id) ?? []) touched.add(p);
    for (const p of touched) {
      const file = files.find((f) => f.path === p)!;
      const current = await this.app.vault.read(file);
      const lines = current.split('\n');
      for (const t of tickLines(current)) {
        const want = toLine.get(t.id);
        if (want === undefined || t.state === want) continue;
        if (t.state !== local.get(t.id)) { restore(t.id); continue; }
        lines[t.at] = withTick(lines[t.at], want);
        ticked++;
      }
      const next = lines.join('\n');
      if (next !== current) {
        this.writingBack++;
        try { await this.app.vault.modify(file, next); }
        finally { this.writingBack--; }
      }
    }
    this.settings.ticks = agreed;
    await this.saveSettings();

    const said: string[] = [];
    if (ticked) said.push(`${ticked} line${ticked === 1 ? '' : 's'} updated from Graphite`);
    if (closed) said.push(`${closed} tick${closed === 1 ? '' : 's'} sent to Graphite`);
    if (said.length && !opts.quiet) new Notice(`Graphite: ${said.join(', ')}.`);
    if (clashes) {
      // Said even when quiet: the app overrode something he did.
      new Notice(`Graphite: ${clashes} tick${clashes === 1 ? ' was' : 's were'} overridden — `
        + 'the task was cancelled or changed in Graphite, and the line now shows its state '
        + '(a cancelled task shows [-]).', 12000);
    }
    if (refused) {
      new Notice(`Graphite: ${refused} tick${refused === 1 ? '' : 's'} could not be written — `
        + 'your role in that space cannot change those tasks. The lines were left as they are.', 12000);
    }
    if (unreadable) {
      new Notice(`Graphite: could not reach the server for ${unreadable} ticked line`
        + `${unreadable === 1 ? '' : 's'} — nothing was changed for them. They will be tried again.`, 12000);
    }
  }

  /* ══ OC7 · THE VAULT CENSUS ══════════════════════════════════════════════
   *
   * The morning sweep's two vault rules — to-dos nobody filed, meetings with
   * no note — were blind, because Graphite never reads the vault. This sends
   * it what the rules need and nothing else: per note, its path, its day,
   * its task lines counted by state, its tags and its links (census.ts).
   * Never a word of a note, as Omar ruled on 2026-09-23.
   *
   * OFF UNTIL SWITCHED ON (RU-035). Then it is sent when the connection is
   * checked, after a capture, every six hours while Obsidian is open, and on
   * its command. A census that cannot be sent is not papered over: the
   * server's sweep sees no fresh census and says it could not look.
   */
  /** What the last census send came to — shown in the settings tab. */
  censusState: { at: number; notes: number } | 'failed' | 'too-big' | null = null;

  async reportCensus(opts: { loud?: boolean } = {}) {
    if (!this.settings.censusOn) {
      if (opts.loud) new Notice('Graphite: turn on the vault census in the Graphite Sync settings first.');
      return;
    }
    if (this.needsServer('The vault census', !!opts.loud)) return;
    const today = localDay(Date.now());
    const notes: CensusNote[] = [];
    for (const f of this.app.vault.getMarkdownFiles()) {
      // A synced note is Graphite's own export: its lines are records the
      // server already has, and it says nothing a rule needs.
      if (this.settings.files[f.path] || isAgentFile(f.path)) continue;
      const n = censusOf(f.path, await this.app.vault.read(f), f.stat?.ctime ?? Date.now());
      if (inCensus(n, today)) notes.push(n);
    }
    if (notes.length > 2000) {
      // NOT SENT IN PART. Half a census reads as a complete one, and the
      // sweep would report a clean board over the half nobody counted.
      this.censusState = 'too-big';
      new Notice(`Graphite: the vault census is ${notes.length} notes, over the 2000 Graphite `
        + 'takes — it was not sent, and the morning sweep will say it could not look.', 12000);
      return;
    }
    // REGISTER 1527: the census reads the bundled tag grammar.
    if (!(await this.writeAllowed('sent', !!opts.loud))) return;
    const res = await requestUrl({
      url: this.api('/mirror/census'), method: 'PUT', contentType: 'application/json',
      body: JSON.stringify({ vault: this.app.vault.getName(), notes }),
      headers: this.headers, throw: false,
    }).catch(() => null);
    if (!res || res.status >= 300) {
      this.censusState = 'failed';
      if (opts.loud) {
        new Notice('Graphite: the vault census could not be sent — the morning sweep will say '
          + 'it could not look at the vault until one arrives.', 12000);
      }
      return;
    }
    this.censusState = { at: Date.now(), notes: notes.length };
    if (opts.loud) {
      new Notice(`Graphite: vault census sent — ${notes.length} note${notes.length === 1 ? '' : 's'}, `
        + 'counts, dates, tags and links only.');
    }
  }

  /** A note was edited: if a box moved, sync that note shortly. */
  private tickSoon(file: TFile, text: string) {
    if (!this.ticksMoved(text)) return;
    window.clearTimeout(this.tickTimers[file.path]);
    this.tickTimers[file.path] = window.setTimeout(
      () => void this.syncTicks([file], { quiet: true }), this.tickDelayMs);
  }

  /* ══ OC5 · THE AGENT CONTRACT, PUBLISHED ══════════════════════════════════
   *
   * Omar 2026-09-23: "agent now, server later". His agent is a file writer
   * that reads two notes this writes into Graphite/ — the routing list (the
   * closed set it chooses from) and the agent brief (how it must write).
   * It holds no credential and calls nothing: neither note carries the
   * server's address or the token, and agent.test holds both to that.
   *
   * THE RULES PASS RUNS ON A CADENCE AND SAYS WHEN IT COULD NOT LOOK. Every
   * hour while Obsidian is open, on connecting, and on its command, the list
   * is rebuilt from Graphite. When Graphite cannot be reached the old list
   * stands and the note says, at its top, when the refresh failed — an
   * agent reading it knows its list may be missing a space made since.
   */
  agentState: 'published' | 'stale' | null = null;

  async publishAgentContract(opts: { loud?: boolean } = {}) {
    if (!this.settings.agentOn) {
      if (opts.loud) new Notice('Graphite: turn on "Publish the agent contract" in the Graphite Sync settings first.');
      return;
    }
    const at = new Date().toISOString();
    const routed = await this.refreshRoutes();
    let vocabulary: string[] | null = null;
    if (routed) {
      const res = await requestUrl({ url: this.api('/tags'), headers: this.headers, throw: false }).catch(() => null);
      if (res && res.status < 300 && Array.isArray(res.json)) {
        vocabulary = (res.json as { name?: string }[]).map((t) => String(t.name ?? '')).filter(Boolean);
      }
    }
    const before = this.settings.routingList;
    let stale: string | null = null;
    if (routed && vocabulary) {
      const fresh = routingListOf(this.routes(), vocabulary, at);
      // The list's date moves only when the list does, so the note is not
      // rewritten every hour for nothing.
      const same = before && JSON.stringify([before.spaces, before.tags]) === JSON.stringify([fresh.spaces, fresh.tags]);
      this.settings.routingList = same ? before : fresh;
      this.agentState = 'published';
    } else {
      stale = at;
      this.agentState = 'stale';
    }
    await this.saveSettings();
    const list = this.settings.routingList ?? { at, spaces: [], tags: [] };
    const folders = this.settings.agentFolders.split(',').map((f) => f.trim()).filter(Boolean);
    await this.writeOwnNote(ROUTING_LIST_PATH, routingListNote(list, stale));
    await this.writeOwnNote(AGENT_BRIEF_PATH, agentBriefNote(folders));
    if (opts.loud) {
      new Notice(stale
        ? 'Graphite: could not reach Graphite to refresh the routing list — the last one stands, and the note says so.'
        : `Graphite: published the routing list (${list.spaces.length} space${list.spaces.length === 1 ? '' : 's'}, `
          + `${list.tags.length} tag${list.tags.length === 1 ? '' : 's'}) and the agent brief into Graphite/.`, 8000);
    }
  }

  /** Write one of the plugin's own notes, only when it changed. */
  private async writeOwnNote(path: string, text: string) {
    const folder = path.slice(0, path.lastIndexOf('/'));
    if (!this.app.vault.getAbstractFileByPath(folder)) await this.app.vault.createFolder(folder);
    const existing = this.app.vault.getAbstractFileByPath(path);
    this.writingBack++;
    try {
      if (existing instanceof TFile) {
        if ((await this.app.vault.read(existing)) !== text) await this.app.vault.modify(existing, text);
      } else {
        await this.app.vault.create(path, text);
      }
    } finally { this.writingBack--; }
  }

  /* ══ OC4 · THE ONE TRANSITION ALL FOUR APPROVALS CALL ═══════════════════
   *
   * Approve → create → finalise. What is SENT is the line as it reads now,
   * unticked and upright with no key — so his edits are what gets created,
   * and a tick on a proposal makes an OPEN task. What is WRITTEN is one
   * write per note: each approved line's key swapped for its record id,
   * found BY ITS KEY on the file as it is after the request, because he may
   * have typed above it meanwhile. A finalised line is byte-identical to one
   * captured by hand.
   *
   * REFUSED IN A SYNCED NOTE. Everything there outside the freeform block is
   * regenerated from the app on the next pull, so a proposal in one would
   * vanish silently; it is listed as unreadable and never applied.
   */
  async approveProposals(file: TFile, which: string[] | 'all' | 'gestures') {
    if (this.needsServer('Approving a proposal', which !== 'gestures')) return;
    if (this.settings.files[file.path]) {
      new Notice('Graphite: proposals in a synced note are not applied — that note is '
        + 'rewritten from the app on every sync. Move the line to another note.', 10000);
      return;
    }
    // OC2, met at the M-S2 merge: the inbox is on the binding of this vault,
    // so the server is asked, as capture asks, rather than a setting read.
    let binding: VaultBinding | null = null;
    try {
      binding = await this.fetchBinding();
    } catch {
      binding = null;
    }
    if (!binding?.bound || !binding.inbox) {
      if (which !== 'gestures' || !this.toldNoInbox) {
        new Notice('Graphite: this vault is not bound to a space with a capture inbox, so nothing '
          + 'was created. Choose them in the Graphite Sync settings, then approve again.', 10000);
        this.toldNoInbox = true;
      }
      return;
    }
    const lines = (await this.app.vault.read(file)).split('\n');
    const found = proposalsIn(lines).filter((p) => p.state !== 'unreadable' && (
      which === 'all' ? true
        : which === 'gestures' ? p.state === 'approved'
          : which.includes(p.key)));
    if (!found.length) return;
    // OC5 — THE CLOSED LIST, CHECKED WHERE IT CAN BE CROSSED. A proposal
    // naming a space, module or tag the published list does not carry — or
    // asking which space — is held, not sent: the server refuses an unknown
    // space but CREATES an unknown tag, so this is the one place an
    // invented term would otherwise become real without anybody saying so.
    //
    // ONLY ONCE THE CONTRACT IS ON. With no agent contract published there
    // is no closed list to hold a proposal to — whoever wrote it, his
    // approval is his own act, and the server stays the authority on spaces.
    const held = !this.settings.agentOn ? [] : found
      .map((p) => ({ p, why: contractProblems(lines[p.line], this.settings.routingList) }))
      .filter((x) => x.why.length);
    for (const x of held) found.splice(found.indexOf(x.p), 1);
    if (held.length) {
      new Notice([
        `Graphite: ${held.length} proposal${held.length === 1 ? '' : 's'} held — still proposals, nothing created:`,
        ...held.map((x) => `line ${x.p.line + 1}: ${x.why.join('; ')}.`),
      ].join('\n'), 15000);
    }
    if (!found.length) return;
    // REGISTER 1527: an out-of-date plugin does not approve.
    if (!(await this.writeAllowed('approved', which !== 'gestures'))) return;
    const space = noteSpace(lines);
    const res = await requestUrl({
      url: this.api('/mirror/capture'),
      method: 'POST',
      contentType: 'application/json',
      body: JSON.stringify({
        lines: found.map((p) => {
          const section = sectionFor(lines, p.line);
          return { text: approvedText(lines[p.line]), path: file.path, line: p.line, ...(section ? { section } : {}) };
        }),
        note: file.basename,
        ...(space ? { space } : {}),
      }),
      headers: this.headers,
      throw: false,
    });
    if (res.status >= 300) {
      new Notice(`Graphite: approval was refused by the server (${res.status}) — nothing was `
        + 'created and your note is unchanged.', 12000);
      return;
    }
    const keyAt = new Map(found.map((p) => [p.line, p.key]));
    const made = new Map<string, string>();
    for (const c of ((res.json as any)?.created ?? []) as { line: number; id: string }[]) {
      const key = keyAt.get(c.line);
      if (key) made.set(key, c.id);
    }
    const refusedLines = ((res.json as any)?.refused ?? []) as { line: number; message: string }[];
    const now = (await this.app.vault.read(file)).split('\n');
    let lost = 0;
    for (const [key, id] of made) {
      const at = lineOfKey(now, key);
      if (at < 0) { lost++; continue; }
      now[at] = finalised(now[at], id);
    }
    if (made.size) {
      this.writingBack++;
      try { await this.app.vault.modify(file, now.join('\n')); } finally { this.writingBack--; }
    }
    const said = [`Graphite: approved ${made.size} — created in Graphite.`];
    for (const r of refusedLines) said.push(`line ${r.line + 1}: ${r.message} — still a proposal.`);
    if (lost) said.push(`${lost} approved line${lost === 1 ? ' was' : 's were'} deleted while it was created; its record exists.`);
    new Notice(said.join('\n'), refusedLines.length || lost ? 15000 : 4000);
    this.refreshPanel();
  }

  /** The two gestures read off a line: a tick on an italic proposal, or a
   *  proposal with its italics removed. */
  async approveGestures(file: TFile) {
    if (this.writingBack > 0) return;
    const text = await this.app.vault.read(file);
    if (!proposalsIn(text.split('\n')).some((p) => p.state === 'approved')) return;
    await this.approveProposals(file, 'gestures');
  }

  /** The proposals in the note in front of him, for the panel. */
  async activeProposals(): Promise<{ file: TFile; list: ReturnType<typeof proposalsIn>; lines: string[] } | null> {
    const file = this.app.workspace.getActiveFile();
    if (!file || file.extension !== 'md') return null;
    const lines = (await this.app.vault.read(file)).split('\n');
    return { file, list: proposalsIn(lines), lines };
  }

  /* ══ OC3 · THE ROUTE LIST ═════════════════════════════════════════════ */
  /** Fetched with `GET /spaces`, which already carries every space's
   *  parent, tags, state, role and modules — so the picker never asks a
   *  module route for anything. */
  async refreshRoutes(): Promise<boolean> {
    if (!this.configured) return false;
    try {
      const res = await requestUrl({ url: this.api('/spaces'), headers: this.headers, throw: false });
      if (res.status >= 300 || !Array.isArray(res.json)) return false;
      this.settings.routeCache = (res.json as any[]).map((s) => ({
        id: s.id, name: s.name, parentId: s.parentId ?? null, tags: s.tags ?? [],
        status: s.status ?? null, personId: s.personId ?? null, myRole: s.myRole ?? null,
        modules: (s.modules ?? []).map((m: any) => ({ id: m.id, type: m.type, name: m.name })),
      }));
      await this.saveSettings();
      return true;
    } catch {
      // Offline: the cached list stands. A token resolves at capture.
      return false;
    }
  }

  routes(): Route[] {
    return buildRoutes(this.settings.routeCache ?? [], this.settings.routeRecent ?? []);
  }

  /** Write a destination where the cursor is: the note's `lp_space:` in the
   *  frontmatter, otherwise the token at the end of the line's words. */
  insertRoute(editor: Editor, route: Route, line: number, span?: { from: EditorPosition; to: EditorPosition }) {
    const all = this.routes();
    const text = editor.getLine(line);
    const lines = Array.from({ length: Math.min(editor.lineCount(), 400) }, (_, i) => editor.getLine(i));
    const fm = frontmatterRange(lines);
    if (fm && line > fm[0] && line < fm[1]) {
      editor.replaceRange(frontmatterFor(route, all), { line, ch: 0 }, { line, ch: text.length });
    } else if (span) {
      editor.replaceRange(`${insertionFor(route, all)} `, span.from, span.to);
    } else {
      // From the palette: at the end of the line's words, before any field.
      const bar = text.indexOf(' | ');
      const at = bar < 0 ? text.replace(/\s+$/, '').length : bar;
      editor.replaceRange(` ${insertionFor(route, all)}`, { line, ch: at }, { line, ch: at });
    }
    this.settings.routeRecent = [route.spaceId, ...(this.settings.routeRecent ?? []).filter((x) => x !== route.spaceId)].slice(0, 12);
    void this.saveSettings();
  }

  /** RULED 2026-09-24: the selected bullets (or the cursor's) become tasks. */
  makeTasksIn(editor: Editor) {
    const from = editor.getCursor('from').line;
    const to = editor.getCursor('to').line;
    const before = Array.from({ length: to - from + 1 }, (_, i) => editor.getLine(from + i));
    const after = makeTasks(before);
    const changed = after.filter((l, i) => l !== before[i]).length;
    if (!changed) { new Notice('Graphite: no plain bullets here to make into tasks.'); return; }
    editor.replaceRange(after.join('\n'), { line: from, ch: 0 }, { line: to, ch: before[before.length - 1].length });
    new Notice(`Graphite: ${changed} bullet${changed === 1 ? '' : 's'} made into task${changed === 1 ? '' : 's'}. They are captured on the next capture.`);
  }

  /* ══ THE GRAPHITE BAR · EVERY BUTTON IS A COMMAND ═══════════════════════
   *
   * Omar, 2026-11-07: "okay the full set is approved". Task, Due, Assign,
   * Priority, Tag and Send to write the grammar the capture door already reads
   * onto the line under the cursor (toolbar-lines.ts); nothing is held about a
   * line, so the note means the same thing next month. They are registered as
   * commands first and drawn as buttons second, which is what lets a phone or
   * a tablet put them on Obsidian's own mobile toolbar.
   *
   * NOT IN A SYNCED FILE: its lines are regenerated from the app. NOT ON A
   * LINE ALREADY CAPTURED: the app owns its fields now, and the next capture
   * skips it. Both are said, never silently ignored.
   *
   * A command returns its promise so the suite can wait for it; Obsidian
   * ignores what an editor command returns. */
  private registerBarCommands() {
    const bar: [string, string, (e: Editor) => Promise<void> | void][] = [
      ['start-list', 'Start a list', (e) => this.barStartList(e)],
      ['task', 'Task', (e) => this.barTask(e)],
      ['due', 'Due', (e) => this.barDue(e)],
      ['assign', 'Assign', (e) => this.barAssign(e)],
      ['priority', 'Priority', (e) => this.barPriority(e)],
      ['tag', 'Tag', (e) => this.barTag(e)],
      ['send-to', 'Send to', (e) => this.barSendTo(e)],
    ];
    this.addCommand({ id: 'lp-bar-capture-now', name: 'Graphite bar: Capture now', callback: () => this.barCaptureNow() });
    this.addCommand({
      id: 'lp-bar-publish-lists',
      name: 'Publish the picker lists for devices with no sign-in',
      callback: () => this.publishToolbarLists({ loud: true }),
    });
    for (const [id, name, run] of bar) {
      this.addCommand({ id: `lp-bar-${id}`, name: `Graphite bar: ${name}`, editorCallback: (editor: Editor) => run(editor) });
    }
  }

  /** The note of the pane whose button is running, so a bar in a split pane
   *  acts on its own note and not on whichever pane has the cursor. */
  private barFile: TFile | null = null;

  /** Draw the bar in every note that wants one, and take it from the rest.
   *  Idempotent: a pane that has its bar keeps it, so any event may call this. */
  syncBars() {
    for (const leaf of this.app.workspace.getLeavesOfType('markdown')) {
      const view: any = leaf.view;
      const host: HTMLElement | undefined = view?.contentEl;
      if (!host) continue;
      const path: string | undefined = view.file?.path;
      const want = barWanted({
        on: this.settings.barOn, path,
        synced: !!path && !!this.settings.files[path],
        own: !!path && (isAgentFile(path) || isToolbarFile(path) || path === SETTINGS_NOTE_PATH),
      });
      const have = (Array.from(host.children) as HTMLElement[]).filter((c) => c.hasClass?.('gr-bar'));
      if (!want) { have.forEach((b) => b.detach()); continue; }
      have.slice(1).forEach((b) => b.detach());
      if (have.length) continue;
      const pane: BarPane = {
        editor: view.editor,
        getMode: () => view.getMode?.(),
        file: () => (view.file as TFile) ?? null,
      };
      const bar = drawBar(host, pane, { mobile: this.barMobile, run: (id, p) => this.runBar(id, p) });
      // On a desktop the row is above the note; on a phone or tablet it is
      // below, where a thumb is (drawBar appended it).
      if (!this.barMobile && host.firstChild && host.firstChild !== bar) host.insertBefore(bar, host.firstChild);
    }
  }

  /** A press on the bar: the command behind the button, against the pane the
   *  bar belongs to. */
  private async runBar(id: string, pane: BarPane) {
    if (pane.getMode?.() === 'preview') {
      new Notice('Graphite: switch this note to editing to use the bar.');
      return;
    }
    const e = pane.editor;
    this.barFile = pane.file?.() ?? null;
    try {
      switch (id) {
        case 'start-list': await this.barStartList(e); break;
        case 'task': await this.barTask(e); break;
        case 'due': await this.barDue(e); break;
        case 'assign': await this.barAssign(e); break;
        case 'priority': await this.barPriority(e); break;
        case 'tag': await this.barTag(e); break;
        case 'send-to': await this.barSendTo(e); break;
        case 'capture-now': await this.barCaptureNow(); break;
        default: break;
      }
    } finally { this.barFile = null; }
  }

  /** Capture this note now. A device with no sign-in cannot, and says whose
   *  job it is: the PC captures once the sync brings the note over. */
  async barCaptureNow() {
    if (!this.configured) {
      new Notice('Graphite: this device has no sign-in, so your PC captures this note once your sync brings it over.');
      return;
    }
    const file = this.barFile ?? this.app.workspace.getActiveFile();
    await this.captureVault(file instanceof TFile ? { only: [file] } : {});
  }

  /** The note under the cursor as the bar reads it, or null (and said) in a
   *  synced Graphite file. */
  private barNote(editor: Editor): { file: TFile | null; lines: string[]; line: number; day: string } | null {
    const file = this.barFile ?? this.app.workspace.getActiveFile();
    if (file && this.settings.files[file.path]) {
      new Notice('Graphite: the bar does not work in a synced Graphite file — its lines are records, and the app is where they change.');
      return null;
    }
    const lines = Array.from({ length: editor.lineCount() }, (_, i) => editor.getLine(i));
    return {
      file, lines, line: editor.getCursor().line,
      day: noteDay(file?.path ?? '', lines.join('\n'), file?.stat?.ctime ?? Date.now()),
    };
  }

  /** A line a field may be written onto: said, and null, when the app owns it. */
  private barFieldLine(note: { lines: string[]; line: number }): string | null {
    const text = note.lines[note.line] ?? '';
    if (isCaptured(text)) {
      new Notice('Graphite: this line is already in Graphite — change its fields in the app, where the record lives.');
      return null;
    }
    return text;
  }

  /** Put [text] on line [line], leaving the cursor at its end. */
  private barWrite(editor: Editor, line: number, text: string) {
    const old = editor.getLine(line) ?? '';
    editor.replaceRange(text, { line, ch: 0 }, { line, ch: old.length });
    editor.setCursor({ line, ch: text.length });
  }

  /** Where a popover opens: under the cursor, where the editor can say. */
  private barAnchor(editor: Editor): Anchor | null {
    try {
      const cm: any = (editor as any).cm;
      const at = cm?.coordsAtPos?.(editor.posToOffset(editor.getCursor()));
      return at ? { x: at.left, y: at.bottom + 4 } : null;
    } catch { return null; }
  }

  private get barMobile(): boolean { return Platform.isMobile; }

  /** The lists, from the cache; a first use waits for one build. */
  private async barLists(): Promise<ToolbarLists | null> {
    if (!this.configured) await this.adoptToolbarLists();
    else if (!this.settings.toolbarCache) await this.refreshToolbarLists();
    return this.settings.toolbarCache;
  }

  async barTask(editor: Editor) {
    const note = this.barNote(editor);
    if (!note) return;
    const text = note.lines[note.line] ?? '';
    if (/^\s*[-*]\s+\[[ xX-]\]\s?\S/.test(text)) {
      editor.replaceRange(`\n${nextTaskLine(text)}`, { line: note.line, ch: text.length });
      editor.setCursor({ line: note.line + 1, ch: nextTaskLine(text).length });
      return;
    }
    this.barWrite(editor, note.line, asTaskLine(text));
  }

  async barDue(editor: Editor) {
    const note = this.barNote(editor);
    const text = note && this.barFieldLine(note);
    if (!note || text === null) return;
    const line = note.line;
    new DueModal(this.app, this.barMobile, this.barAnchor(editor), {
      noteDay: note.day,
      words: asTaskLine(text).replace(/^\s*[-*]\s+\[[ xX-]\]\s?/, '').split(' | ')[0].replace(/\s*#\S+/g, '').trim(),
      current: readDue(readField(text, 'due')),
      onSet: (value) => this.barWrite(editor, line, setField(asTaskLine(editor.getLine(line) ?? ''), 'due', value)),
    }).open();
  }

  async barAssign(editor: Editor) {
    const note = this.barNote(editor);
    const text = note && this.barFieldLine(note);
    if (!note || text === null) return;
    const lists = await this.barLists();
    const dest = destinationOf(note.lines, note.line, this.routes(), lists?.bound.inboxModuleId ?? null);
    if (!dest.route) {
      new Notice('Graphite: this line does not name a space, and the vault has no capture inbox to fall back on, so there is nobody to offer. Send it somewhere first.');
      return;
    }
    const leaf = dest.route.path[dest.route.path.length - 1];
    const people = lists?.people[dest.route.spaceId] ?? [];
    if (!people.length) {
      new Notice(`Graphite: no people are known for ${leaf} yet. Connect to Graphite once and they are kept.`);
      return;
    }
    const me = this.lastMe?.name;
    const line = note.line;
    new PickModal<ToolbarPerson>(this.app, this.barMobile, this.barAnchor(editor), {
      title: `Assign to someone in ${leaf}`,
      items: people.map((p): PickItem<ToolbarPerson> => ({
        label: p.name, color: p.color ?? '', hint: me && p.name === me ? 'you' : undefined, data: p,
      })),
      writes: (i) => `Writes | assigned: ${i.data.name}`,
      onChoose: (i) => this.barWrite(editor, line, setField(asTaskLine(editor.getLine(line) ?? ''), 'assigned', i.data.name)),
    }).open();
  }

  async barPriority(editor: Editor) {
    const note = this.barNote(editor);
    const text = note && this.barFieldLine(note);
    if (!note || text === null) return;
    const line = note.line;
    const current = readField(text, 'priority')?.replace(/\\\|/g, '|').toLowerCase();
    // IN THE WORDS OF THE MODULE THE LINE IS GOING TO (a Tasks module can name
    // its own priorities): the destination is read as the server will read it.
    const lists = await this.barLists();
    const inbox = lists?.bound.inboxModuleId ?? null;
    const moduleId = taskModuleOf(destinationOf(note.lines, note.line, this.routes(), inbox), inbox);
    const choices = priorityChoices(moduleId ? lists?.words[moduleId] : null);
    new PickModal<string>(this.app, this.barMobile, this.barAnchor(editor), {
      title: 'Priority',
      items: choices.map((c) => ({ label: c.label, hint: c.hint, data: c.value })),
      start: (i) => i.data.replace(/\\\|/g, '|').toLowerCase() === current,
      writes: (i) => `Writes | priority: ${i.data}`,
      onChoose: (i) => this.barWrite(editor, line, setField(asTaskLine(editor.getLine(line) ?? ''), 'priority', i.data)),
    }).open();
  }

  async barTag(editor: Editor) {
    const note = this.barNote(editor);
    const text = note && this.barFieldLine(note);
    if (!note || text === null) return;
    const lists = await this.barLists();
    const tags = lists?.tags ?? [];
    const line = note.line;
    new PickModal<string>(this.app, this.barMobile, this.barAnchor(editor), {
      title: 'Tag',
      filter: true,
      items: tags.map((t) => ({ label: `#${t}`, data: t })),
      extra: (q) => {
        const t = cleanTag(q);
        return t && !tags.some((x) => x.toLowerCase() === t.toLowerCase())
          ? { label: `+ New tag "${t}"`, data: t } : null;
      },
      writes: (i) => `Writes #${i.data} at the end of the words`,
      onChoose: (i) => this.barWrite(editor, line, addTag(asTaskLine(editor.getLine(line) ?? ''), i.data)),
    }).open();
  }

  /** START A LIST. What are you writing, then where it goes, then the heading
   *  the server already routes every line under - `## Actions >> Work / Action
   *  items` - and a first box with the cursor on it. The notes own space is
   *  suggested first, else the capture inbox; a vault with no module of the
   *  kind is told so. Calendar and the rest are shown and marked later. */
  async barStartList(editor: Editor) {
    const note = this.barNote(editor);
    if (!note) return;
    const lists = await this.barLists();
    const line = note.line;
    const kinds: PickItem<ListKind | null>[] = [
      { label: 'A task list', detail: 'Boxes to tick, each one a task', data: 'tasks' },
      { label: 'Notes', detail: 'Plain lines that become notes', data: 'notes' },
      { label: 'Calendar events', hint: 'later', disabled: true, data: null },
      { label: 'Shopping, reminders, expenses', hint: 'later', disabled: true, data: null },
    ];
    new PickModal<ListKind | null>(this.app, this.barMobile, this.barAnchor(editor), {
      title: 'What are you writing?',
      items: kinds,
      onChoose: (k) => { if (k.data) this.barStartWhere(editor, k.data, note.lines, line, lists); },
    }).open();
  }

  private barStartWhere(editor: Editor, kind: ListKind, lines: string[], line: number, lists: ToolbarLists | null) {
    const routes = this.routes();
    const spaces = lists?.spaces ?? this.settings.routeCache;
    const inboxId = lists?.bound.inboxModuleId ?? null;
    const rootId = lists?.bound.rootId ?? null;
    const targets = listTargets(routes, spaces, kind, rootId);
    const noun = kind === 'tasks' ? 'Tasks' : 'Notes';
    if (!targets.length) {
      new Notice(`Graphite: this vault has no ${noun} modules to put a list in. Add one in Graphite, then try again.`);
      return;
    }
    const dest = destinationOf(lines, line, routes, inboxId);
    const first = suggestedTarget(targets, dest, inboxId);
    const rootName = spaces.find((s) => s.id === rootId)?.name;
    const row = (t: typeof targets[number], group: string, hint?: string): PickItem<typeof targets[number]> => ({
      label: targetLabel(t), group, hint, data: t,
    });
    const items = [
      ...(first ? [row(first, 'SUGGESTED', dest.via === 'inbox' || dest.via === 'none' || !dest.route ? 'capture inbox' : "this note's space")] : []),
      ...targets.map((t) => row(t, `ALL ${noun.toUpperCase()} MODULES${rootName ? ` IN ${rootName.toUpperCase()}` : ''}`)),
    ];
    let words = this.settings.barHeading || 'Actions';
    const tidy = (v: string) => v.replace(/[\r\n]+|>>/g, ' ').replace(/\s+/g, ' ').trim() || 'Actions';
    new PickModal<typeof targets[number]>(this.app, this.barMobile, this.barAnchor(editor), {
      title: `${kind === 'tasks' ? 'A task list' : 'Notes'}. Where do these ${kind === 'tasks' ? 'tasks' : 'notes'} go?`,
      filter: true,
      items,
      writes: (i, footer) => `Writes ${listStart(tidy(footer), targetToken(i.data, routes), kind)[0]}`,
      footer: {
        label: 'Heading', value: words,
        onChange: (v) => { words = v; this.settings.barHeading = tidy(v); void this.saveSettings(); },
      },
      onChoose: (i) => {
        const block = listStart(tidy(words), targetToken(i.data, routes), kind);
        const out = insertBlock(lines, line, block);
        const old = editor.getLine(line) ?? '';
        if (!old.trim()) {
          editor.replaceRange(block.join('\n'), { line, ch: 0 }, { line, ch: old.length });
        } else {
          editor.replaceRange(`\n\n${block.join('\n')}`, { line, ch: old.length });
        }
        editor.setCursor(out.cursor);
      },
    }).open();
  }

  async barSendTo(editor: Editor) {
    if (!this.barNote(editor)) return;
    void this.refreshRoutes();
    new RouteModal(this.app, this, (r) => this.insertRoute(editor, r, editor.getCursor().line)).open();
  }

  private listsPublishedAt = 0;

  /** On connecting: publish, but not more than once in ten minutes, so a
   *  flapping connection does not rewrite a file LiveSync is carrying. */
  private async publishToolbarListsSoon() {
    if (Date.now() - this.listsPublishedAt < 600_000) return;
    await this.publishToolbarLists();
  }

  /** Write the lists into the vault (Graphite/Toolbar lists.json) for a
   *  device with no sign-in. Only when connected, only when the lists changed
   *  (so a synced vault is not touched every hour), and when Graphite cannot
   *  be reached the file stands as it was. Names only: toolbar-lists.ts has
   *  no field for a token, an address, a vault id or a password. */
  async publishToolbarLists(opts: { loud?: boolean } = {}) {
    if (!this.settings.barShare || !this.configured || this.offServer) {
      if (opts.loud) new Notice('Graphite: the picker lists are written only while connected, with sharing on in the settings.');
      return;
    }
    this.listsPublishedAt = Date.now();
    const before = this.settings.toolbarCache;
    if (!(await this.refreshToolbarLists())) {
      if (opts.loud) new Notice('Graphite: could not reach Graphite to refresh the picker lists, so the file stands as it was.');
      return;
    }
    // Unchanged lists keep their old stamp, so the file's bytes do not move.
    if (before && sameLists(before, this.settings.toolbarCache)) this.settings.toolbarCache = before;
    await this.writeSharedJson(TOOLBAR_LISTS_PATH, listsFile(this.settings.toolbarCache!));
    if (opts.loud) new Notice(`Graphite: wrote the picker lists to ${TOOLBAR_LISTS_PATH} (${this.settings.toolbarCache!.spaces.length} spaces).`);
  }

  /** A plain data file in the vault, written only when it changed. Obsidian
   *  may not index a .json file as a note, so an existing one is found through
   *  the adapter rather than assumed absent. */
  private async writeSharedJson(path: string, text: string) {
    const folder = path.slice(0, path.lastIndexOf('/'));
    if (!this.app.vault.getAbstractFileByPath(folder)) await this.app.vault.createFolder(folder).catch(() => undefined);
    this.writingBack++;
    try {
      const existing = this.app.vault.getAbstractFileByPath(path);
      if (existing instanceof TFile) {
        if ((await this.app.vault.read(existing)) !== text) await this.app.vault.modify(existing, text);
        return;
      }
      const had = await this.app.vault.adapter.read(path).catch(() => null);
      if (had === text) return;
      if (had !== null) await this.app.vault.adapter.write(path, text);
      else await this.app.vault.create(path, text).catch(() => this.app.vault.adapter.write(path, text));
    } finally { this.writingBack--; }
  }

  /** A device with no sign-in takes the lists a connected one wrote. Never on
   *  a device that has its own server: its lists are its own, and a file from
   *  another machine must not replace them. Only names are copied
   *  (readListsFile), so a hand-edited or hostile file adds nothing else. */
  async adoptToolbarLists(): Promise<boolean> {
    if (this.configured) return false;
    const text = await this.app.vault.adapter.read(TOOLBAR_LISTS_PATH).catch(() => null);
    const lists = text === null ? null : readListsFile(text);
    if (!lists || sameLists(lists, this.settings.toolbarCache)) return false;
    this.settings.toolbarCache = lists;
    this.settings.routeCache = lists.spaces;
    await this.saveSettings();
    return true;
  }

  /** What the pickers offer that only Graphite knows, rebuilt from the server
   *  and kept: the spaces (the `>>` list too), the people of each, the tags in
   *  use and the vault's binding. False when it could not be had — the last
   *  build stands. */
  async refreshToolbarLists(): Promise<boolean> {
    if (!this.configured || this.offServer) return false;
    if (!(await this.refreshRoutes())) return false;
    const spaces = this.settings.routeCache;
    const before = this.settings.toolbarCache;
    let bound = before?.bound ?? { rootId: null, inboxModuleId: null };
    try {
      const b = await this.fetchBinding();
      if (b) bound = { rootId: b.root?.id ?? null, inboxModuleId: b.inbox?.id ?? null };
    } catch { /* the last binding stands */ }
    const people: Record<string, ToolbarPerson[]> = {};
    for (const s of routable(spaces)) {
      const mod = (s.modules ?? []).find((m) => m.type === 'TASKS');
      if (!mod) continue;
      const res = await requestUrl({ url: this.api(`/spaces/modules/${mod.id}/people`), headers: this.headers, throw: false }).catch(() => null);
      if (res && res.status < 300 && Array.isArray(res.json)) {
        people[s.id] = (res.json as any[]).filter((p) => p && typeof p.name === 'string' && p.name)
          .map((p) => ({ name: p.name as string, color: typeof p.color === 'string' ? p.color : null }));
      } else if (before?.people[s.id]) people[s.id] = before.people[s.id];
    }
    let tags = before?.tags ?? [];
    const t = await requestUrl({ url: this.api('/tags'), headers: this.headers, throw: false }).catch(() => null);
    if (t && t.status < 300 && Array.isArray(t.json)) tags = (t.json as { name?: string }[]).map((x) => String(x.name ?? '')).filter(Boolean);
    // A TASKS MODULE'S OWN WORDS for status and priority (names and what each
    // counts as), so the Priority picker can offer them on a tablet with no
    // server. A module that cannot be asked keeps the words it had; a server
    // that does not know the route has none to carry.
    const words: Record<string, ToolbarWords> = {};
    for (const s of routable(spaces)) {
      for (const mod of (s.modules ?? []).filter((m) => m.type === 'TASKS')) {
        const res = await requestUrl({ url: this.api(`/modules/${mod.id}/task-settings`), headers: this.headers, throw: false }).catch(() => null);
        if (res && res.status < 300) {
          const w = wordsFromSettings(res.json);
          if (w) words[mod.id] = w;
        } else if (before?.words?.[mod.id]) words[mod.id] = before.words[mod.id];
      }
    }
    this.settings.toolbarCache = buildLists({
      at: new Date().toISOString(), bound, spaces, people,
      tags: [...tags, ...spaces.flatMap((s) => s.tags ?? [])],
      words,
    });
    await this.saveSettings();
    return true;
  }

  /* ══ R-1525 · CREATE A NEW ENTRY FOR ANYTHING — STARTING WITH A SPACE ═══
   *
   * "if i am in a vault i should be able to see the entities and how they
   * link as well as add to it, modify it, create a new entry for anything".
   * The measurement (plugin-reach.spec) found the plugin a full client for
   * the CONTENTS of spaces and unable to bring a container into existence,
   * and it named the cheapest step: the server has taken `create_new` since
   * the §32.6 package format, and the plugin had only ever sent the other
   * two modes. A space IS a markdown file to the importer.
   *
   * VALIDATE-FIRST, AS EVERYWHERE ELSE. A file the importer cannot read
   * creates nothing and the first error comes back with its line.
   *
   * THE NOTE IS LEFT AS IT IS. It is the person's writing, not a synced
   * note, and nothing here claims it: the new space is pulled into the
   * vault beside it, in this vault's own layout, and the pulled notes are
   * the ones that sync from then on. */
  async createSpaceFromNote() {
    const file = this.app.workspace.getActiveFile();
    if (!file) {
      new Notice('Graphite: open the note you want to make a space from.');
      return;
    }
    if (this.settings.files[file.path]) {
      new Notice('Graphite: this note is already part of a synced space — push it instead.');
      return;
    }
    if (this.needsServer('Making a space from a note')) return;
    const markdown = await this.app.vault.read(file);
    const res = await requestUrl({
      url: this.api('/spaces/import.md'),
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ markdown, mode: 'create_new' }),
      throw: false,
    });
    const report = res.json ?? {};
    if (res.status >= 400) {
      new Notice(`Graphite: the server refused it (${res.status}) — ${report.message ?? 'see the app'}. Nothing was created.`);
      return;
    }
    if (report.blocked || (report.errors?.length ?? 0) > 0 || !report.space?.id) {
      const first = report.errors?.[0];
      new Notice(`Graphite: not created — ${first ? `line ${first.line}: ${first.message}` : 'the file did not pass the import check'}. Nothing was created.`, 12000);
      return;
    }
    const space: SpaceInfo = { id: report.space.id, name: report.space.name };
    new Notice(`Graphite: created "${space.name}". Pulling it in — your note stays as it is.`);
    await this.pullSpace(space);
  }

  /* ══ RULED 2026-09-24 · ADD A MODULE FROM THE VAULT ═══════════════════
   *
   * Omar, choosing between a command and "a new note adopted on push":
   * "Command + type picker". So: which space (the one the open note is
   * synced to, or a picker), which type, what name — then the module is
   * created in the app and the space is pulled, so its new note arrives
   * the way every other note does. No note is ever turned into a module
   * by being written somewhere. */
  async chooseAndAddModule() {
    if (this.needsServer('Adding a module')) return;
    if (!(await this.checkConnection(false))) {
      new Notice(this.noConnectionNote());
      return;
    }
    const pickType = (space: SpaceInfo) => new ModuleTypePicker(this.app, (type) =>
      new ModuleNamePrompt(this.app, moduleTypeName(type),
        (name) => void this.addModule(space, type, name)).open()).open();
    const active = this.app.workspace.getActiveFile();
    const entry = active ? this.settings.files[active.path] : undefined;
    if (entry) {
      pickType({ id: entry.spaceId, name: entry.spaceName ?? entry.spaceId });
      return;
    }
    try {
      new SpacePicker(this.app, await this.fetchSpaces(), pickType).open();
    } catch (e) {
      new Notice(`Graphite: could not list spaces — ${e}`);
    }
  }

  /** Create the module, then pull the space so its note arrives. A blank
   *  name takes the type's own name, as the app does. */
  async addModule(space: SpaceInfo, type: string, name: string) {
    const res = await requestUrl({
      url: this.api(`/spaces/${space.id}/modules`),
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, name: name.trim() || moduleTypeName(type) }),
      throw: false,
    });
    if (res.status >= 400) {
      new Notice(`Graphite: the module was not added (${res.status}) — `
        + `${res.json?.message ?? 'see the app'}. Nothing was changed.`, 10000);
      return;
    }
    new Notice(`Graphite: added ${moduleTypeName(type)} "${name.trim() || moduleTypeName(type)}" to "${space.name}".`);
    await this.pullSpace(space);
  }

  /** R-1227: every Tasks module this account can reach, for the capture
   *  inbox setting. A Tasks module, because that is what the server takes:
   *  mirror.service refuses a capture into any other type, by name. */
  /* ══ OC2 · THIS VAULT'S BINDING ═══════════════════════════════════════
   *
   * The server holds it, keyed by this vault's id and the signed-in
   * account: which space the vault is bound to (its wall), and which Tasks
   * module capture files into. The plugin only asks and asks to change; the
   * server decides, because a wall the plugin enforced would be a wall
   * around the plugin, and the vault is edited by hand. */
  private vaultUrl(rest = '') {
    return this.api(`/mirror/vault/${encodeURIComponent(this.settings.vaultId)}${rest}`);
  }

  /** The binding, or null when the server is too old to know of one. */
  async fetchBinding(): Promise<VaultBinding | null> {
    // A vault is bound to a space on a server. The app on this device has
    // no binding to ask about, which is the same answer an old server gives.
    if (this.offServer) { this.captureOn = false; this.vaultBound = false; return null; }
    const res = await requestUrl({ url: this.vaultUrl(), headers: this.headers, throw: false });
    if (res.status === 404) {
      this.captureOn = false;
      this.vaultBound = false;
      return null;
    }
    if (res.status >= 400) throw new Error(res.json?.message ?? `status ${res.status}`);
    const b = res.json as VaultBinding;
    this.captureOn = !!(b.bound && b.inbox);
    this.vaultBound = !!b.bound;
    this.vaultAllSpaces = !!(b.bound && b.allSpaces);
    return b;
  }

  /** Bind this vault to a space, or unbind it (null). Says what happened,
   *  including an inbox the new wall no longer holds. */
  async bindVault(rootSpaceId: string | null, allSpaces?: boolean): Promise<VaultBinding | null> {
    if (this.needsServer('Binding a vault to a space')) return null;
    const res = rootSpaceId
      ? await requestUrl({
          url: this.vaultUrl(), method: 'PUT', contentType: 'application/json',
          // allSpaces is sent only when it is being changed: a new space for the
          // vault must not quietly turn the switch off (or on).
          body: JSON.stringify({
            rootSpaceId, label: this.app.vault.getName(),
            ...(allSpaces === undefined ? {} : { allSpaces }),
          }),
          headers: this.headers, throw: false,
        })
      : await requestUrl({ url: this.vaultUrl(), method: 'DELETE', headers: this.headers, throw: false });
    if (res.status >= 400) {
      new Notice(`Graphite: the vault was not ${rootSpaceId ? 'bound' : 'unbound'} — `
        + `${res.json?.message ?? `the server refused it (${res.status})`}.`, 12000);
      return null;
    }
    const b = res.json as VaultBinding;
    this.captureOn = !!(b.bound && b.inbox);
    this.vaultBound = !!b.bound;
    this.vaultAllSpaces = !!(b.bound && b.allSpaces);
    if (b.inboxCleared) {
      new Notice('Graphite: the capture inbox was outside the new space, so it was cleared. '
        + 'Pick a new one before capturing.', 12000);
    }
    return b;
  }

  /** Whether the vault's binding says it may write back to every space the
   *  account may write in. Read with the binding. */
  vaultAllSpaces = false;

  /** 0.6.2 · ALL MY SPACES (Omar, 2026-11-17, "All, opt-in switch"). Turns the
   *  vault's wall from "the space it is bound to and what is nested in it"
   *  into "any space this account may write in"; the server's permissions
   *  still decide each write. Off by default, and the switch lives on the
   *  vault's binding on the server, so it needs a bound vault - the bound
   *  space stays where new spaces, captured lines and pages are put. Answers
   *  whether the server now holds what was asked. */
  async setAllSpaces(on: boolean): Promise<boolean> {
    if (this.needsServer('Writing back to every space')) return false;
    const b = await this.fetchBinding().catch(() => null);
    if (!b?.bound || !b.root) {
      new Notice('Graphite: choose this vault\'s space first. "All my spaces" is a choice on a '
        + 'bound vault, and that space is where new spaces and captured lines go.', 12000);
      return false;
    }
    const done = await this.bindVault(b.root.id, on);
    return !!done && !!done.allSpaces === on;
  }

  /** The Tasks modules the server would accept as this vault's inbox. */
  async fetchInboxChoices(): Promise<Array<{ id: string; label: string }>> {
    if (this.offServer) return [];
    const res = await requestUrl({ url: this.vaultUrl('/inboxes'), headers: this.headers, throw: false });
    if (res.status >= 400) return [];
    return res.json as Array<{ id: string; label: string }>;
  }

  /** The Notes modules a page folder may be filed in: the server's list, the
   *  ones the page door would accept. Empty when there is nothing to choose
   *  from - not bound, offline, an older server - and the default still works. */
  async fetchPageModuleChoices(): Promise<Array<{ id: string; label: string }>> {
    if (this.offServer) return [];
    try {
      const res = await requestUrl({ url: this.vaultUrl('/page-modules'), headers: this.headers, throw: false });
      if (res.status >= 400) return [];
      return res.json as Array<{ id: string; label: string }>;
    } catch {
      return [];
    }
  }

  /** Choose (or clear) the capture inbox. */
  async setInbox(moduleId: string | null): Promise<boolean> {
    if (this.needsServer('Choosing a capture inbox')) return false;
    const res = await requestUrl({
      url: this.vaultUrl('/inbox'), method: 'PUT', contentType: 'application/json',
      body: JSON.stringify({ moduleId }), headers: this.headers, throw: false,
    });
    if (res.status >= 400) {
      new Notice(`Graphite: that cannot be the capture inbox — `
        + `${res.json?.message ?? `the server refused it (${res.status})`}.`, 12000);
      return false;
    }
    this.captureOn = !!moduleId;
    return true;
  }

  /** Set while a whole-account pull runs: each space's own "pulled" line gives
   *  way to the one summary, so ten spaces are one notice and not ten. Notes
   *  that were banked or let go still say so. */
  private quietPulls = 0;
  private mirroring = false;
  /** 0.6.9: how long after the layout is ready the first connection check
   *  runs; a test sets it to nothing. */
  startupDelayMs = 800;
  /** 0.6.9: how long the automatic bring-in of every space waits after the
   *  connection check that found it owed, and the rest it takes between one
   *  space and the next. Both are there so Obsidian finishes opening, and
   *  then indexes one space's notes before the next arrive. */
  firstMirrorDelayMs = 3000;
  spaceGapMs = 250;
  private mirrorTimer = 0;

  /** 0.6.1 · LINKING IS ENOUGH. Pulls every space the key can read - the ones
   *  the person owns and the ones shared with them, which is what
   *  `GET /spaces` lists - into this vault, in the vault's layout.
   *
   *  `loud` is the person asking (the command, the settings button): it brings
   *  in every space with no file here, offered before or not. Quiet is the
   *  check that runs when Obsidian opens and when a key is tested: it brings
   *  in the spaces this vault has not been offered, and only while
   *  `mirrorAll` is on. A space is marked offered however its pull went, so a
   *  refusal is said once and not retried at every check; the command is how
   *  it is tried again.
   *
   *  The server's per-space "kept as .md files on the server" switch is a
   *  different thing (the server writing a folder of its own) and is neither
   *  read nor changed here: export.md and export.folder answer for any space
   *  the key can read. */
  async mirrorEverySpace(loud: boolean): Promise<number> {
    if (this.offServer || !this.configured) return 0;
    if (!loud && !this.settings.mirrorAll) return 0;
    // One run at a time. A check that fired the quiet run a moment ago is
    // finished before the person's own ask goes on; a second quiet one is
    // simply not needed.
    if (this.mirroring && !loud) return 0;
    while (this.mirroring) await new Promise((r) => window.setTimeout(r, 50));
    this.mirroring = true;
    let brought = 0;
    const failed: string[] = [];
    try {
      let spaces: SpaceInfo[];
      try {
        spaces = await this.fetchSpaces();
      } catch (e) {
        if (loud) new Notice(`Graphite: could not list your spaces - ${e}`);
        return 0;
      }
      const seen = new Set(this.settings.spacesSeen);
      const todo = spaces.filter((sp) =>
        this.entriesForSpace(sp.id).length === 0 && (loud || !seen.has(sp.id)));
      this.quietPulls++;
      try {
        for (let i = 0; i < todo.length; i++) {
          const sp = todo[i];
          // A rest between spaces: the notes of the last one are indexed, the
          // window is drawn and answers, before the next one's arrive.
          if (i > 0 && this.spaceGapMs > 0) await new Promise((r) => window.setTimeout(r, this.spaceGapMs));
          await this.pullSpace(sp);
          if (this.entriesForSpace(sp.id).length > 0) brought++; else failed.push(sp.name);
        }
      } finally {
        this.quietPulls--;
        // ONE redraw of the panel for the whole run, not one per space: each
        // draw reads and hashes every synced note to say whether it changed.
        this.refreshPanel();
      }
      const next = new Set([...seen, ...spaces.map((sp) => sp.id)]);
      if (next.size !== seen.size) {
        this.settings.spacesSeen = [...next];
        await this.saveSettings();
      }
      if (brought) {
        // READING IS ALL A KEY DOES. What a vault writes back is walled to the
        // space it is bound to (vault-wall.ts: an unbound vault writes
        // nowhere), so a vault nobody has bound says so here, once, rather
        // than letting the first edit find out.
        await this.fetchBinding().catch(() => null);
        new Notice(`Graphite: brought in ${brought} space${brought === 1 ? '' : 's'} from your account.`
          + (this.vaultBound ? '' : ' Edits go back to Graphite once you choose this vault\'s space in the plugin settings.'), 12000);
      } else if (loud && !failed.length) {
        new Notice(todo.length ? 'Graphite: nothing new to bring in.' : 'Graphite: every space you can read is already in this vault.');
      }
      if (failed.length) {
        new Notice(`Graphite: could not bring in ${failed.join(', ')}. "Bring in every space" tries again.`, 12000);
      }
    } finally {
      this.mirroring = false;
    }
    return brought;
  }

  async fetchSpaces(): Promise<SpaceInfo[]> {
    const res = await requestUrl({ url: this.api('/spaces'), headers: this.headers });
    return (res.json as any[]).map((s) => ({ id: s.id, name: s.name }));
  }

  /** Default flow (R-290 simplification per Omar): whole-space sync, and
   *  the pull asks WHICH VAULT the space lands in. */
  async chooseAndPull() {
    if (!(await this.checkConnection(false))) {
      new Notice(this.noConnectionNote());
      return;
    }
    try {
      const spaces = await this.fetchSpaces();
      new SpacePicker(this.app, spaces, (space) => this.chooseDestination(space)).open();
    } catch (e) {
      new Notice(`Graphite: could not list spaces — ${e}`);
    }
  }

  /** Optional flow: selective modules, always into the current vault. */
  async chooseAndPullSelective() {
    // The app on this device or computer exports a whole space; a subset of its
    // modules is the exporter of a server.
    if (this.needsServer('Choosing modules to pull')) return;
    if (!(await this.checkConnection(false))) {
      new Notice(this.noConnectionNote());
      return;
    }
    try {
      const spaces = await this.fetchSpaces();
      new SpacePicker(this.app, spaces, (space) => void this.chooseModules(space)).open();
    } catch (e) {
      new Notice(`Graphite: could not list spaces — ${e}`);
    }
  }

  chooseDestination(space: SpaceInfo) {
    const vaults = this.listVaults();
    if (vaults.length <= 1) {
      void this.pullSpace(space);
      return;
    }
    new VaultPicker(this.app, vaults, (v) => {
      if (v.current) void this.pullSpace(space);
      else void this.pullToVault(space, v);
    }).open();
  }

  /** Every vault Obsidian knows about, current one first, read from the
   *  app-level vault registry (obsidian.json).
   *
   *  R-1527 — DESKTOP WORK INSIDE A PLUGIN THAT IS NOT DESKTOP-ONLY.
   *  The manifest says `isDesktopOnly: false` and that is the truth: pull
   *  and push both go through requestUrl and the vault adapter, and both
   *  work on a phone. Only MULTI-VAULT ROUTING needs a filesystem, because
   *  Obsidian gives a plugin no way to see a vault it is not loaded into.
   *
   *  So the desktop half asks the Obsidian API whether it is on a desktop,
   *  rather than reaching for Node and catching what comes back. Same
   *  outcome on a phone; three differences that matter. A reviewer reading
   *  the source sees the intent instead of an unguarded Node call in a
   *  plugin claiming mobile support — which is one of the two things the
   *  store review can fail this on. Mobile never enters the Node path at
   *  all, instead of entering it and being thrown out of it. And the
   *  fallback stops being an error handler, so a genuine registry fault on
   *  a desktop is no longer indistinguishable from running on a phone. */
  listVaults(): VaultDest[] {
    const cur = this.app.vault.adapter instanceof FileSystemAdapter
      ? this.app.vault.adapter.getBasePath() : '';
    const here = (): VaultDest[] =>
      cur ? [{ name: 'This vault', path: cur, current: true }] : [];
    if (!Platform.isDesktopApp) return here();
    const req = (window as any).require;
    if (!req) return here();
    try {
      const fs = req('fs'); const p = req('path');
      const env = (globalThis as any).process?.env ?? {};
      const candidates: string[] = [];
      if (env.APPDATA) candidates.push(p.join(env.APPDATA, 'obsidian', 'obsidian.json'));
      const home = env.HOME || env.USERPROFILE || '';
      if (home) {
        candidates.push(p.join(home, 'Library', 'Application Support', 'obsidian', 'obsidian.json'));
        candidates.push(p.join(home, '.config', 'obsidian', 'obsidian.json'));
      }
      for (const c of candidates) {
        try {
          const reg = JSON.parse(fs.readFileSync(c, 'utf8'));
          const vaults = Object.values(reg.vaults ?? {}) as { path: string }[];
          const out = vaults
            .filter((v) => { try { return fs.statSync(v.path).isDirectory(); } catch { return false; } })
            .map((v) => ({
              name: p.basename(v.path),
              path: v.path,
              current: p.resolve(v.path) === p.resolve(cur),
            }));
          if (out.length) {
            out.sort((a, b) => Number(b.current) - Number(a.current));
            return out;
          }
        } catch { /* try the next candidate */ }
      }
    } catch { /* no readable registry — offer the current vault only */ }
    return here();
  }

  /** Pull a space into a DIFFERENT vault: write the .md into that vault's
   *  folder and seed its own plugin config (mapping + credentials) so its
   *  Graphite Sync instance can push/pull natively from there. */
  async pullToVault(space: SpaceInfo, dest: VaultDest) {
    // R-1527, and see listVaults: the same guard, said before the work
    // rather than around it. Unreachable on a phone in practice, because
    // listVaults offers one vault there and the picker never opens — but a
    // Node call whose only protection is somewhere else is exactly what the
    // store review reads as a desktop plugin claiming mobile support.
    if (!Platform.isDesktopApp) {
      new Notice('Graphite: pulling into another vault needs the desktop app — Obsidian gives a plugin no filesystem on mobile.', 8000);
      return;
    }
    try {
      const req = (window as any).require;
      const fs = req('fs'); const p = req('path');
      const plugDir = p.join(dest.path, '.obsidian', 'plugins', 'graphite-sync');
      fs.mkdirSync(plugDir, { recursive: true });
      const dataPath = p.join(plugDir, 'data.json');
      let data: any = {};
      try { data = JSON.parse(fs.readFileSync(dataPath, 'utf8')); } catch { /* fresh */ }
      if (this.onComputer) {
        // The other vault finds the app on this computer itself: there is
        // no address or key of ours to hand it.
        if (!data.serverUrl && !data.token) data.source = 'computer';
      } else {
        if (!data.serverUrl) data.serverUrl = this.settings.serverUrl;
        if (!data.token) data.token = this.settings.token;
      }
      data.files = data.files ?? {};

      // R-1512: THE DESTINATION VAULT'S OWN LAYOUT DECIDES THE SHAPE, and
      // this used to be a single file unconditionally — so a vault set to
      // the folder layout got one flat package note pushed into it from
      // here, and then disagreed with itself the next time it pulled that
      // space natively. The layout is per-vault BECAUSE it is a
      // vault-shaping decision; reading it from the destination is what
      // that sentence has to mean when the write comes from outside.
      // Falling back to this vault's setting is for a destination that has
      // no Graphite config yet, which is the common case.
      const layout: 'single' | 'folder' = data.layout ?? this.settings.layout;
      data.layout = layout;

      const stamp = (path: string, text: string, extra: Record<string, unknown>) => {
        data.files[path] = {
          spaceId: space.id, spaceName: space.name,
          lastSyncAt: Date.now(), lastHash: hash(text), ...extra,
        };
        // ROW 2514: that vault keeps the base for this note as well.
        data.bases = data.bases && typeof data.bases === 'object' ? data.bases : {};
        putBase(data.bases, path, text);
      };
      // R-379: the other vault's copy keeps its freeform block too — for
      // every note of a folder, not only for a package file.
      const writeNote = (rel: string, markdown: string): string => {
        const target = p.join(dest.path, rel);
        let existing: string | null = null;
        try { existing = fs.readFileSync(target, 'utf8'); } catch { /* new file */ }
        const text = keepFreeform(existing, markdown);
        fs.writeFileSync(target, text, 'utf8');
        return text;
      };

      let note: string;
      if (layout === 'folder') {
        // FINDING 119: the same rule as a pull here — a folder another space
        // already syncs into in THAT vault is not shared.
        const got = await this.folderExport(
          data.files, space, undefined,
          (Object.values(data.files) as FileEntry[]).find((e) => e.spaceId === space.id)?.folderAsked);
        if (!got) return;
        const { out, asked } = got;
        fs.mkdirSync(p.join(dest.path, out.folder), { recursive: true });
        for (const f of out.files) {
          stamp(f.path, writeNote(f.path, f.markdown), {
            folder: out.folder, ...(asked ? { folderAsked: asked } : {}),
            role: f.kind, moduleId: f.moduleId,
          });
        }
        note = `pulled "${space.name}" into vault "${dest.name}" as a folder of ${out.files.length} notes`;
      } else {
        const md = await requestUrl({ url: this.exportUrl(space.id), headers: this.headers });
        const fileName = singleFileFor(data.files, space);
        stamp(fileName, writeNote(fileName, md.text), {});
        note = `pulled "${space.name}" into vault "${dest.name}"`;
      }
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
      new Notice(`Graphite: ${note}. If that vault is open now, reload its Graphite Sync plugin to pick up the mapping.`, 9000);
    } catch (e) {
      new Notice(`Graphite: pull into "${dest.name}" failed — ${e}`);
    }
  }

  /** R-290: after the space, pick which modules travel (default: all). */
  async chooseModules(space: SpaceInfo) {
    try {
      const res = await requestUrl({ url: this.api(`/spaces/${space.id}`), headers: this.headers });
      const modules: ModuleInfo[] = (res.json.modules ?? []).map((m: any) => ({
        id: m.id, name: m.name, type: m.type,
      }));
      if (modules.length <= 1) {
        void this.pullSpace(space);
        return;
      }
      new ModulePicker(this.app, space, modules, (picked) => {
        // All selected = clear any filter (future modules flow in too).
        const ids = picked.length === modules.length ? null : picked.map((m) => m.id);
        void this.pullSpace(space, ids, modules.length);
      }).open();
    } catch (e) {
      new Notice(`Graphite: could not list the space's modules — ${e}`);
    }
  }

  private exportUrl(spaceId: string, moduleIds?: string[]) {
    const q = moduleIds?.length ? `?modules=${moduleIds.join(',')}` : '';
    return this.api(`/spaces/${spaceId}/export.md${q}`);
  }

  /** R-379: the folder-layout twin of exportUrl — index + one note per
   *  module, as JSON with vault-relative paths. */
  private folderUrl(spaceId: string, moduleIds?: string[], folder?: string) {
    const q = [
      moduleIds?.length ? `modules=${moduleIds.join(',')}` : '',
      // FINDING 119: the folder this space was given when its own name was
      // already another space's.
      folder ? `folder=${encodeURIComponent(folder)}` : '',
    ].filter(Boolean).join('&');
    return this.api(`/spaces/${spaceId}/export.folder${q ? `?${q}` : ''}`);
  }

  /** FINDING 119: ONE SPACE, ONE FOLDER. The server names a space's folder
   *  from the space's name, and two spaces may share a name ("Home" twice, a
   *  household and a trip). Both landed in `Home/`: the second pull wrote over
   *  the first space's notes and re-pointed their tracked paths at itself, so
   *  the first could never be pushed back. The folder a space already has is
   *  asked for again by name; a space new to the vault whose default folder
   *  another space holds asks for its own, `Home (<end of its id>)`; and a
   *  server that does not honour the ask is refused, never shared. Returns
   *  the export to write, or null (said) when there is no free folder. */
  private async folderExport(
    files: Record<string, FileEntry>, space: SpaceInfo, moduleIds: string[] | undefined,
    own: string | undefined,
  ): Promise<{ out: { folder: string; files: ExportedFile[] }; asked?: string } | null> {
    const ask = async (folder?: string) => (await requestUrl({
      url: this.folderUrl(space.id, moduleIds, folder), headers: this.headers,
    })).json as { folder: string; files: ExportedFile[] };
    let out = await ask(own);
    let asked = own;
    if (!own && folderHeldByAnother(files, out.folder, space.id)) {
      asked = distinctFolder(out.folder, space.id);
      out = await ask(asked);
    }
    if (folderHeldByAnother(files, out.folder, space.id)) {
      new Notice(
        `Graphite: another space in this vault already syncs into "${out.folder}/", so "${space.name}" was not pulled — ` +
        'it would have written over those notes. Rename one of the two spaces in Graphite, then pull again.', 12000);
      return null;
    }
    return { out, asked };
  }

  /** Every tracked file belonging to one space, with its path. */
  entriesForSpace(spaceId: string): Array<{ path: string; entry: FileEntry }> {
    return Object.entries(this.settings.files)
      .filter(([, e]) => e.spaceId === spaceId)
      .map(([path, entry]) => ({ path, entry }));
  }

  /** moduleIds: undefined = keep the file's stored filter (plain re-pull);
   *  null = explicit "all modules" (clears the filter); array = subset. */
  async pullSpace(space: SpaceInfo, moduleIds?: string[] | null, moduleCount?: number) {
    if (this.settings.layout === 'folder') {
      return this.pullFolder(space, moduleIds, moduleCount);
    }
    const fileName = singleFileFor(this.settings.files, space);
    const prev = this.settings.files[fileName];
    const effective = moduleIds === undefined ? prev?.moduleIds
      : moduleIds === null ? undefined : moduleIds;
    try {
      const md = await requestUrl({ url: this.exportUrl(space.id, effective), headers: this.headers });
      this.writingBack++;
      let text = md.text;
      let banked: string | null = null;
      try {
        const existing = this.app.vault.getAbstractFileByPath(fileName);
        if (existing instanceof TFile) {
          const old = await this.app.vault.read(existing);
          // R-399: when BOTH sides moved since the last sync, the server may
          // not silently win — the user's version is banked beside the note
          // before the canonical text lands (mirror.service R-127 is the
          // in-app precedent for refusing exactly this overwrite).
          if (this.bothMoved(prev, old, md.text)) {
            banked = await this.bankConflictCopy(fileName, old);
          }
          // R-379: a pull refreshes the records, not the user's prose.
          text = keepFreeform(old, md.text);
          await this.app.vault.modify(existing, text);
        } else await this.app.vault.create(fileName, text);
      } finally {
        this.writingBack--;
      }
      if (banked) {
        new Notice(
          `Graphite: "${fileName}" had local edits AND the space changed in the app — ` +
          `your version is banked as "${banked}". Merge back what you need, then push. ` +
          'Nothing was lost.', 12000);
      }
      this.settings.files[fileName] = {
        spaceId: space.id, spaceName: space.name,
        lastSyncAt: Date.now(), lastHash: hash(text),
        moduleIds: effective,
        moduleCount: moduleCount ?? prev?.moduleCount,
      };
      putBase(this.settings.bases, fileName, text);
      await this.saveSettings();
      if (!this.quietPulls) this.refreshPanel();
      const scope = effective?.length ? ` (${effective.length} module${effective.length === 1 ? '' : 's'})` : '';
      if (!this.quietPulls) new Notice(`Graphite: pulled "${space.name}"${scope}.`);
    } catch (e) {
      new Notice(`Graphite: pull failed — ${e}`);
    }
  }

  /** R-379: pull a space as a FOLDER of notes — the index plus one note per
   *  module, each tracked in its own right so it can be edited, linked and
   *  pushed on its own.
   *
   *  Three things this does that a plain "write the files" loop would not:
   *
   *  • FREEFORM SURVIVES. Every note is re-read before it is overwritten and
   *    the user's block is carried into the new text (keepFreeform above).
   *  • A RENAMED MODULE MOVES, it does not fork. A module renamed in the app
   *    changes the note's filename; matching the previous mapping by module
   *    id lets us rename the existing file (through fileManager, so Obsidian
   *    rewrites every wikilink pointing at it) instead of leaving the old
   *    note behind as an orphan next to a new one.
   *  • A REMOVED MODULE IS UNTRACKED, NEVER DELETED. Its note stays in the
   *    vault as an ordinary file and the panel stops claiming it is synced.
   *    Deleting a user's file is not the sync's decision to make. */
  async pullFolder(space: SpaceInfo, moduleIds?: string[] | null, moduleCount?: number) {
    const previous = this.entriesForSpace(space.id);
    const stored = previous.find((p) => p.entry.moduleIds)?.entry.moduleIds;
    const effective = moduleIds === undefined ? stored
      : moduleIds === null ? undefined : moduleIds;
    try {
      const got = await this.folderExport(
        this.settings.files, space, effective, previous.find((p) => p.entry.folderAsked)?.entry.folderAsked);
      if (!got) return;
      const { out, asked } = got;
      const written = new Set<string>();
      // Paths that MOVED rather than went away — a renamed note must not be
      // reported as one the space no longer syncs.
      const renamed = new Set<string>();
      // R-399: notes whose vault edits AND app edits both moved — the user's
      // versions are banked beside them, never silently replaced.
      const banked: string[] = [];
      this.writingBack++;
      // 0.6.9: a space of hundreds of notes is written in slices, not in one
      // run that holds Obsidian's thread (pacer.ts says why).
      const pace = new Pacer();
      try {
        await this.ensureFolder(out.folder);
        for (const f of out.files) {
          await pace.tick();
          // R-8336: a page lives in a folder of its notebook and section, which
          // may not exist yet (or not any more, after a move).
          await this.ensureDirs(f.path);
          // The same note under its old name, if the module or the space was
          // renamed since the last pull. A PAGE is the same page by its note id
          // (it moves when its title or section changed in Graphite) - it must
          // never be taken for the index or for its notebook's own note.
          const was = previous.find((p) => p.path !== f.path && (
            f.kind === 'page'
              ? p.entry.role === 'page' && p.entry.noteId === f.noteId
              : f.kind === 'module'
                ? p.entry.role !== 'page' && p.entry.moduleId === f.moduleId
                : p.entry.role === 'index'));
          if (was) {
            await this.renameTo(was.path, f.path);
            renamed.add(was.path);
          }
          const existing = this.app.vault.getAbstractFileByPath(f.path);
          const old = existing instanceof TFile ? await this.app.vault.read(existing) : null;
          const before =
              previous.find((p) => p.path === f.path)?.entry ?? was?.entry;
          if (old !== null && this.bothMoved(before, old, f.markdown)) {
            banked.push(await this.bankConflictCopy(f.path, old));
          }
          const text = keepFreeform(old, f.markdown);
          if (existing instanceof TFile) await this.app.vault.modify(existing, text);
          else await this.app.vault.create(f.path, text);
          this.settings.files[f.path] = {
            spaceId: space.id, spaceName: space.name, folder: out.folder,
            ...(asked ? { folderAsked: asked } : {}),
            role: f.kind, moduleId: f.moduleId,
            ...(f.kind === 'page'
              ? { noteId: f.noteId, pageDir: notebookDirOf(f.path, f.markdown) } : {}),
            lastSyncAt: Date.now(), lastHash: hash(text),
            moduleIds: effective,
            moduleCount: moduleCount ?? previous[0]?.entry.moduleCount,
          };
          putBase(this.settings.bases, f.path, text);
          written.add(f.path);
        }
      } finally {
        this.writingBack--;
      }
      // Anything this space used to sync and no longer does: let go of it.
      // A note that was RENAMED is not one of them — it is the same note under
      // the name the app now gives it.
      const gone = previous.filter((p) => !written.has(p.path) && !renamed.has(p.path));
      // R-8336: A PAGE THAT IS GONE FROM GRAPHITE TAKES ITS FILE WITH IT - when
      // the file is still exactly what the last sync wrote (nothing of the
      // person's is in it, and Graphite has the page in its Bin), and when the
      // page's notebook is still in scope (a narrowed selection leaves a page
      // out without deleting it). The file goes to the trash the vault
      // is set to use, so it can be put back from there. A file the person
      // changed is theirs: it is let go of, left, and said, as a module note is.
      const trashed: string[] = [];
      const dropped: typeof gone = [];
      this.writingBack++;
      try {
        for (const d of gone) {
          await pace.tick();
          const f = d.entry.role === 'page' ? this.app.vault.getAbstractFileByPath(d.path) : null;
          const inScope = !effective?.length || (d.entry.moduleId !== undefined && effective.includes(d.entry.moduleId));
          if (f instanceof TFile && inScope && hash(await this.app.vault.read(f)) === d.entry.lastHash) {
            try {
              await this.trashFile(f);
              trashed.push(d.path);
              continue;
            } catch { /* could not trash it: fall through and leave it, said below */ }
          }
          dropped.push(d);
        }
      } finally {
        this.writingBack--;
      }
      for (const d of gone) {
        delete this.settings.files[d.path];
        delete this.settings.bases[d.path];
      }
      await this.saveSettings();
      if (!this.quietPulls) this.refreshPanel();
      const scope = effective?.length ? ` (${effective.length} module${effective.length === 1 ? '' : 's'})` : '';
      if (!this.quietPulls) new Notice(`Graphite: pulled "${space.name}"${scope} into ${out.folder}/ — ${out.files.length} note${out.files.length === 1 ? '' : 's'}.`);
      if (trashed.length) {
        new Notice(
          `Graphite: ${trashed.length} page${trashed.length === 1 ? ' was' : 's were'} removed in Graphite, ` +
          `so ${trashed.length === 1 ? 'its file was' : 'their files were'} moved to the trash: ` +
          `${trashed.join(', ')}. Graphite keeps ${trashed.length === 1 ? 'it' : 'them'} in its Bin.`, 12000);
      }
      if (dropped.length) {
        new Notice(
          `Graphite: ${dropped.length} note${dropped.length === 1 ? '' : 's'} ` +
          `no longer belong${dropped.length === 1 ? 's' : ''} to "${space.name}" and ` +
          `${dropped.length === 1 ? 'is' : 'are'} no longer synced — ` +
          `${dropped.map((d) => d.path).join(', ')}. Nothing was deleted; ` +
          'remove them yourself when you are happy.', 12000);
      }
      if (banked.length) {
        new Notice(
          `Graphite: ${banked.length} note${banked.length === 1 ? '' : 's'} had local edits ` +
          'AND app-side changes — your versions are banked beside them: ' +
          `${banked.join(', ')}. Merge back what you need, then push. Nothing was lost.`, 12000);
      }
    } catch (e) {
      new Notice(`Graphite: pull failed — ${e}`);
    }
  }

  /** Obsidian's own trash, as the vault is set to use it (the file manager's),
   *  or the vault's .trash on an Obsidian that has no such call. */
  private async trashFile(file: TFile) {
    const fm = this.app.fileManager as { trashFile?: (f: TFile) => Promise<void> };
    if (typeof fm.trashFile === 'function') await fm.trashFile(file);
    else await this.app.vault.trash(file, false);
  }

  /** Page files deleted in this burst, by path. */
  private vanished = new Set<string>();
  private vanishTimer = 0;

  /** This many page files gone at once is not a person deleting pages: it is a
   *  folder moved, a sync client part-way through, or a drive not mounted. */
  static readonly MASS_DELETE = 5;

  /** R-8336: A PAGE'S FILE WAS DELETED. With auto-push on, the page is deleted
   *  in Graphite a moment later (its Bin keeps it); with it off, the panel
   *  shows the file missing and offers Delete page. Gathered over a second and
   *  a half so a burst can be judged as a burst. */
  private pageVanished(path: string) {
    this.vanished.add(path);
    window.clearTimeout(this.vanishTimer);
    this.vanishTimer = window.setTimeout(() => {
      const paths = [...this.vanished];
      this.vanished.clear();
      if (paths.length >= GraphitePlugin.MASS_DELETE) {
        new Notice(
          `Graphite: ${paths.length} page files disappeared at once, so none were deleted in Graphite. ` +
          'Pull to put them back, or delete the pages you mean in the sync panel.', 12000);
        return;
      }
      if (this.settings.autoPush) for (const p of paths) void this.pushFile(p, { auto: true });
      this.refreshPanel();
    }, 1500);
  }

  /** The deletion a missing page file stands for: the app's ordinary delete,
   *  not forced, so a page other things link to is refused by the same rule the
   *  app keeps and its file comes back on the next Pull. */
  private async deleteGonePage(path: string, entry: FileEntry, opts?: { auto?: boolean }) {
    if (!entry.moduleId || !entry.noteId) return;
    if (!(await this.writeAllowed('deleted', !opts?.auto))) return;
    if (this.onComputer && opts?.auto && this.computerReadOnly) return;
    const title = path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/i, '');
    // A RENAME THE PLUGIN DID NOT SEE (a sync client moved it) is not a
    // deletion: when another file under the notebook's folder says it is this
    // page, the tracking follows that file.
    const dir = entry.pageDir ?? '';
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (!dir || !f.path.startsWith(`${dir}/`) || this.settings.files[f.path]) continue;
      if (pageIdOf(await this.app.vault.read(f)) === entry.noteId) {
        await this.pageRenamed(path, f.path);
        return;
      }
    }
    const res = await requestUrl({
      url: this.api(`/modules/${entry.moduleId}/notes/${entry.noteId}`),
      method: 'DELETE', headers: this.headers, throw: false,
    });
    if (this.onComputer) this.computerReadOnly = res.status === 403;
    if (res.status < 300 || res.status === 404) {
      delete this.settings.files[path];
      delete this.settings.bases[path];
      await this.saveSettings();
      this.refreshPanel();
      new Notice(res.status === 404
        ? `Graphite: "${title}" was already gone from Graphite.`
        : `Graphite: deleted "${title}" in Graphite - it is in the Bin there.`);
    } else if (res.status === 409) {
      new Notice(
        `Graphite: "${title}" is linked from other things, so it stays in Graphite. ` +
        'Pull to put its file back, or erase it in the app if you mean it.', 12000);
    } else {
      new Notice(`Graphite: could not delete "${title}" (${res.status}) - ${res.json?.message ?? 'see the app'}. Nothing was changed.`, 12000);
    }
  }

  /** Every folder on the way to [path], outermost first (R-8336: a page sits two
   *  or three folders deep, and createFolder makes one level). */
  private async ensureDirs(path: string) {
    let at = '';
    for (const part of path.split('/').slice(0, -1)) {
      at = at ? `${at}/${part}` : part;
      await this.ensureFolder(at);
    }
  }

  /** R-8336: A PAGE'S FILE WAS RENAMED OR MOVED IN THE VAULT. The file name is
   *  the page's title and its folder is its section, so this is the person
   *  renaming the page or moving it between sections: the two lines of the
   *  file that say so are rewritten to match, the tracking follows the file
   *  (it would otherwise be left pointing at a path nothing is at), and the
   *  page is pushed like any edit. Obsidian has already rewritten the links to
   *  it in the vault's other files; Graphite rewrites its own on the title
   *  change. Not the plugin's own renames (a pull moving a page that was
   *  renamed in Graphite), which come through with writingBack up. */
  private async pageRenamed(from: string, to: string) {
    const entry = this.settings.files[from];
    if (!entry || entry.role !== 'page' || this.settings.files[to]) return;
    const file = this.app.vault.getAbstractFileByPath(to);
    if (!(file instanceof TFile) || file.extension !== 'md') return;
    const text = await this.app.vault.read(file);
    // Only the file that is still that page: a different file moved onto the
    // path, or the frontmatter edited into something else, is left alone.
    if (pageIdOf(text) !== entry.noteId) return;
    this.settings.files[to] = { ...entry };
    delete this.settings.files[from];
    const base = this.settings.bases[from];
    delete this.settings.bases[from];
    if (base !== undefined) putBase(this.settings.bases, to, base);
    const change = pageRenameOf(from, to, entry.pageDir ?? '');
    if (change) {
      this.writingBack++;
      try {
        await this.app.vault.process(file, (cur) => setPageFields(cur, change));
      } finally { this.writingBack--; }
      if (this.settings.autoPush) this.schedulePush(to);
    }
    await this.saveSettings();
    this.refreshPanel();
  }

  private async ensureFolder(folder: string) {
    if (this.app.vault.getAbstractFileByPath(folder)) return;
    try {
      await this.app.vault.createFolder(folder);
    } catch { /* raced with another writer, or already there */ }
  }

  /** Rename through fileManager so Obsidian rewrites links pointing at it. */
  private async renameTo(from: string, to: string) {
    const file = this.app.vault.getAbstractFileByPath(from);
    if (!(file instanceof TFile)) return;
    if (this.app.vault.getAbstractFileByPath(to)) return; // target exists; leave both
    try {
      await this.app.fileManager.renameFile(file, to);
      delete this.settings.files[from];
      delete this.settings.bases[from];
    } catch { /* keep the old path; the write below creates the new note */ }
  }

  async pushCurrent() {
    const file = this.app.workspace.getActiveFile();
    if (!file) return;
    if (!this.settings.files[file.path]) {
      new Notice('Graphite: this file was not pulled by the plugin — pull first so it knows the space.');
      return;
    }
    await this.pushFile(file.path);
  }

  /** An auto-push of [path] about 2.5 seconds after the last edit. */
  private schedulePush(path: string) {
    window.clearTimeout(this.pushTimers[path]);
    this.pushTimers[path] = window.setTimeout(
      () => void this.pushFile(path, { auto: true }), 2500);
  }

  /** FINDING 120: ONE PUSH PER NOTE AT A TIME. Every way into a push comes
   *  through here (the command, the panel button, the sweep, the auto-push
   *  timer, the conflict dialog), so the guard sits on the door and not on
   *  each caller. A push asked for while one is running is not dropped — the
   *  edits it was asked about may have come after the first read the file —
   *  it runs once more when the first is done. */
  async pushFile(path: string, opts?: { auto?: boolean; force?: boolean }) {
    if (this.pushing.has(path)) {
      this.pushAgain.set(path, opts);
      return;
    }
    this.pushing.set(path, true);
    try {
      await this.pushFileNow(path, opts);
    } finally {
      this.pushing.delete(path);
    }
    if (this.pushAgain.has(path)) {
      const again = this.pushAgain.get(path);
      this.pushAgain.delete(path);
      await this.pushFile(path, again);
    }
  }

  private async pushFileNow(path: string, opts?: { auto?: boolean; force?: boolean }) {
    // On a device a changed note is not pushed anywhere: the app takes it in
    // the next time it is opened, and the panel says so.
    if (this.onDevice) return;
    const entry = this.settings.files[path];
    const file = this.app.vault.getAbstractFileByPath(path);
    // R-8336: THE FILE OF A PAGE IS GONE, so there is nothing to push: the
    // push is the deletion. Explicit (the panel's Delete page), or by itself
    // when auto-push is on.
    if (entry?.role === 'page' && !(file instanceof TFile)) {
      await this.deleteGonePage(path, entry, opts);
      return;
    }
    if (!entry || !(file instanceof TFile)) return;
    // REGISTER 1527: an out-of-date plugin does not push.
    if (!(await this.writeAllowed('pushed', !opts?.auto))) return;
    // The app on this computer said it lets notes apps read and not change:
    // an automatic push stays quiet instead of saying so on every edit.
    if (this.onComputer && opts?.auto && this.computerReadOnly) return;
    // ── R-399: a push may not silently rewrite app-side edits ──────────────
    //
    // update_existing patches every field whose VALUE differs — recency is
    // never consulted (markdown-import has no updatedAt check). So pushing
    // over a space that moved since the last sync writes the vault's older
    // values over the app's newer ones and reports it as a normal update;
    // canonicalize then overwrites the file too, erasing the evidence from
    // both sides. serverState() existed for exactly this question and no
    // write path ever asked it. Now: auto-push HOLDS (a Notice explains),
    // and a manual push asks the human — Pull first (both-moved edits get
    // banked beside the note by the R-399 pull path), push anyway (the
    // app keeps a batch undo server-side), or stop. 'error' deliberately
    // falls through: an unreachable server fails the push itself with its
    // own message moments later.
    // Row 1515: the index note asks this too. It is pushed now (below), and
    // its links table is the one place a removed row deletes something — so
    // a stale index pushed over a link drawn in the app since the last sync
    // would break that link. Held exactly as a stale module note is.
    //
    // ROW 2514 (R-2841): WITH A BASE THE SERVER HOLDS PER FIELD, SO THIS WHOLE-
    // FILE HOLD STANDS DOWN. A push that carries the note as the server last
    // wrote it (this.settings.bases) is judged by the importer one field at a
    // time: a field only the vault changed is written, a field only the app
    // changed is kept (keptNewer), a field BOTH changed is held and asked
    // about in the app, and a link row is held only if the base had it. That
    // is every case this check exists for, decided more finely, so a note
    // the app moved elsewhere lands its own edits instead of being refused
    // whole. A note with NO base (first push, a data.json from before, a base
    // dropped for size) has nothing for the server to compare against, so the
    // old rule stands for it exactly: ask, or hold an auto-push.
    if (!opts?.force && this.settings.bases[path] === undefined) {
      const state = await this.serverState(path);
      if (state === 'server-changed') {
        if (opts?.auto) {
          new Notice(
            `Graphite: auto-push HELD for "${entry.spaceName ?? path}" — the space ` +
            'changed in the app since your last sync. Open the sync panel and ' +
            'Pull (your edits are banked if they collide) or push it yourself.', 12000);
          return;
        }
        new ConflictPushModal(this.app, entry.spaceName ?? path, (choice) => {
          if (choice === 'pull') {
            void this.pullSpace({ id: entry.spaceId, name: entry.spaceName ?? path });
          } else if (choice === 'push') {
            void this.pushFile(path, { force: true });
          }
        }).open();
        return;
      }
    }
    // Row 1515: THE INDEX NOTE IS PUSHED LIKE ANY OTHER NOTE. It holds no
    // records, and it was not pushed for that reason (R-379) — but it holds
    // the space as a whole: its links table and its rulebook. A link added,
    // edited or removed in that table never reached the app, although the
    // table says "delete a row to break that link" (study 2518, Findings 2
    // and 3). The table stays in the index rather than moving into a module
    // note because a link joins two records that need not share a module,
    // so no module note owns it, and the ruled shape is one index note plus
    // one note per module, with nothing else. The server reads an index for
    // its links and posts nothing into the space when nothing changed.
    try {
      const markdown = await this.app.vault.read(file);
      // ── R-389: WHICH MODE A PUSH USES DECIDES WHETHER EDITS EXIST ────────
      //
      // The plugin sent `merge`, and merge is ADD-ONLY by design: a record the
      // file already carries an lp id for is counted as an "update" in the
      // report and left exactly as it was (markdown-import.service emit(): the
      // patch branch is gated on update mode). So changing a task's title in
      // the vault and pushing reported success, wrote nothing, and then
      // canonicalize overwrote the edit with the server's unchanged text. The
      // edit was gone, with a green notice on top of it.
      //
      // `update_existing` is the mode that patches in place — the one the
      // in-app mirror has always used for exactly this file. It needs EDITOR
      // (rank 5) where merge needs CONTRIBUTOR (3), and that gap is real
      // authority, not an accident: a contributor may ADD to a shared space
      // and may not rewrite what others put there. So: ask for the honest mode
      // first, and if this account genuinely lacks the rights, fall back to
      // the one it does have — and SAY which happened, instead of letting a
      // contributor believe their edits landed.
      // ROW 2514: the base goes only with update_existing, the one mode that
      // judges a field against it; merge never changes a record.
      const base = this.settings.bases[path];
      const send = (mode: 'update_existing' | 'merge') => requestUrl({
        url: this.api('/spaces/import.md'),
        method: 'POST',
        headers: { ...this.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdown, mode, targetSpaceId: entry.spaceId,
          ...(mode === 'update_existing' && base !== undefined ? { base } : {}),
        }),
        throw: false,
      });
      let res = await send('update_existing');
      let addOnly = false;
      // A refusal from the app on this computer is its read-only switch, not
      // a role, so the add-only retry is for the refusal of a server alone.
      if (res.status === 403 && !this.onComputer) {
        res = await send('merge');
        addOnly = res.status < 400;
      }
      if (this.onComputer) this.computerReadOnly = res.status === 403;
      if (res.status >= 400) {
        new Notice(`Graphite: push refused (${res.status}) — ${res.json?.message ?? 'see the app'}. Nothing was changed.`);
        return;
      }
      const report = res.json;
      if (report.blocked || (report.errors?.length ?? 0) > 0) {
        const first = report.errors?.[0];
        new Notice(`Graphite: import blocked — ${first ? `line ${first.line}: ${first.message}` : 'see the app'}. Nothing was changed.`);
        return;
      }
      if (addOnly) {
        new Notice(
          'Graphite: your role on this space lets you ADD records but not change existing ones — '
          + 'new lines landed, edits to records that were already there did not.', 12000);
      }
      // OB-2: SAY WHAT THE IMPORTER SAID. It reports a line it declined (a
      // rule it could not read, a service line with no id), a link row it
      // held rather than deleted, and a conflict, and this method read only
      // blocked and errors. The vault saw a green notice and the line was
      // gone from the note after canonicalize, with nothing to say why.
      const said = importerSaid(report);
      // ROW 2514: a field changed here AND in the app is held, not written
      // either way. Said first and in one notice with the importer words, so
      // a held push is one notice and a clean push stays one. Held link rows
      // are the importer own count (linksHeld) and are not in this one.
      const heldFields = heldFieldsSaid(heldFieldsOf(report));
      const bullets = (l: string[]) => l.map((s) => `• ${s}`).join('\n');
      if (heldFields.length) {
        new Notice(
          `Graphite: pushed, but ${heldFields[0]}\n${bullets(heldFields.slice(1))}`
          + (said.length ? `\nThe importer also says:\n${bullets(said)}` : ''), 15000);
      } else if (said.length) {
        new Notice(`Graphite: pushed, and the importer says:\n${bullets(said)}`, 15000);
      }
      // Canonicalize: the server's view becomes the file (same contract as
      // the in-app mirror), scoped to this file — the whole space for a
      // package, one note for a folder-layout note. R-379: the user's
      // freeform block is carried across; the server only ever sends the
      // placeholder, so writing its text raw would erase the prose.
      const fresh = await this.canonicalText(entry);
      if (fresh === null) {
        new Notice('Graphite: pushed, but the server did not return this note — Pull to refresh.');
        return;
      }
      const text = keepFreeform(markdown, fresh);
      // ── FINDING 117: THE CANONICAL TEXT GOES BACK ONLY OVER WHAT WAS SENT ──
      //
      // The file was read once, before the request, and written after it
      // without a second look — and the write is silenced (writingBack), so
      // nothing scheduled a new push. Whatever was typed in the seconds the
      // round trip took was overwritten and nothing ever said so. The check
      // and the write are ONE step now (vault.process runs on the file as it
      // is at that moment): a file that still holds exactly what was pushed
      // takes the canonical text; one that moved on keeps its edit, with the
      // canonical text merged in where the two touched different lines (the
      // ids the server gave a new section must reach the file, or the next
      // push makes it again), and the edit is pushed on its own turn.
      let kept = false;
      this.writingBack++;
      try {
        await this.app.vault.process(file, (current) => {
          if (current === markdown || current === text) return text;
          kept = true;
          const merged = mergeLines(markdown, current, text, { adjacent: true });
          // Typed on the very line the server changed: the words stay the
          // person's, and the id the server gave that line is carried onto
          // them, so the next push updates the task instead of making it again.
          return merged.clean ? merged.text : carryIds(markdown, current, text);
        });
      } finally { this.writingBack--; }
      entry.lastSyncAt = Date.now();
      // The hash and the base name what the SERVER holds, written or not:
      // a file that kept its edit then reads as having local edits, which
      // is true, and the next push sends the right base.
      entry.lastHash = hash(text);
      // ROW 2514: the text just written IS what the server last wrote, so it
      // is the base for the next push. A field held keeps the app value in
      // it, which is why the next push does not open the same hold again.
      putBase(this.settings.bases, path, text);
      await this.saveSettings();
      this.refreshPanel();
      if (kept) {
        if (this.settings.autoPush) this.schedulePush(path);
        new Notice(
          `Graphite: pushed "${entry.spaceName ?? path}". You kept typing while it was pushed, so your note ` +
          `was left as you have it${this.settings.autoPush ? ' and will be pushed again' : ' — push again to send the newer edits'}.`);
      } else {
        new Notice(`Graphite: pushed "${entry.spaceName ?? path}" and canonicalized.`);
      }
    } catch (e) {
      new Notice(`Graphite: push failed — ${e}`);
    }
  }

  /** The server's current text FOR THIS FILE. Null when the file's module is
   *  no longer part of the space (the note is stale — a Pull sorts it out). */
  private async canonicalText(entry: FileEntry): Promise<string | null> {
    if (!entry.role) {
      const md = await requestUrl({
        url: this.exportUrl(entry.spaceId, entry.moduleIds), headers: this.headers,
      });
      return md.text;
    }
    // OB-2 (the first look in a real vault, 2026-10-29): EVERY NOTE IS ASKED
    // AT THE SCOPE IT WAS PULLED WITH. A module note used to ask for its own
    // module only, to keep the answer small, and a module-scoped export
    // leaves out the Links table (a link whose far end is another module is
    // not in that scope). The pull had written the note from the whole
    // export, links included, so the two texts differed by that table: every
    // module note with a link row read as "the app changed this too", an
    // auto-push on it was held for ever, and the push then wrote the scoped
    // text over the note and took its Links table out. The scope the pull
    // used is on the entry (undefined for a whole-space pull), and the note
    // is picked out of the answer by its module id below.
    const scope = entry.moduleIds;
    const res = await requestUrl({
      url: this.folderUrl(entry.spaceId, scope, entry.folderAsked), headers: this.headers,
    });
    const out = res.json as { folder: string; files: ExportedFile[] };
    // R-8336: pages share their notebook's module id, so the module id alone
    // would answer a page with its notebook's note (or the other way about).
    const match = entry.role === 'index'
      ? out.files.find((f) => f.kind === 'index')
      : entry.role === 'page'
        ? out.files.find((f) => f.kind === 'page' && f.noteId === entry.noteId)
        : out.files.find((f) => f.kind !== 'page' && f.moduleId === entry.moduleId);
    return match?.markdown ?? null;
  }

  /** Local state of a tracked file, no network involved. */
  async fileState(path: string): Promise<'in-sync' | 'local-edits' | 'missing'> {
    const entry = this.settings.files[path];
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return 'missing';
    const content = await this.app.vault.read(file);
    return hash(content) === entry?.lastHash ? 'in-sync' : 'local-edits';
  }

  /** On-demand server check: has the space changed since our last sync?
   *
   *  R-379: the question is "would canonicalizing this note change it?", so
   *  the comparison runs the server's text through the same freeform splice a
   *  write would. Comparing the raw export instead would report "server
   *  changed" forever on any note whose freeform block the user has written
   *  in — the server always sends the placeholder back. */
  async serverState(path: string): Promise<'server-changed' | 'server-unchanged' | 'error'> {
    const entry = this.settings.files[path];
    if (!entry) return 'error';
    try {
      const fresh = await this.canonicalText(entry);
      if (fresh === null) return 'server-changed'; // gone from the space
      const file = this.app.vault.getAbstractFileByPath(path);
      const local = file instanceof TFile ? await this.app.vault.read(file) : null;
      return hash(keepFreeform(local, fresh)) === entry.lastHash
        ? 'server-unchanged' : 'server-changed';
    } catch {
      return 'error';
    }
  }

  /** R-399: TRUE when the vault file AND the incoming server text have BOTH
   *  diverged from the last sync point — the case where a plain pull would
   *  make the vault edit silently lose. Same splice discipline as
   *  serverState: the server always sends the freeform placeholder back, so
   *  the incoming text is compared post-splice or a written-in freeform
   *  block would read as an eternal server change. */
  private bothMoved(entry: FileEntry | undefined, old: string | null, incoming: string): boolean {
    if (!entry?.lastHash || old === null) return false;
    const localMoved = hash(old) !== entry.lastHash;
    const serverMoved = hash(keepFreeform(old, incoming)) !== entry.lastHash;
    return localMoved && serverMoved;
  }

  /** R-399: never destroy vault writing. Before the canonical text replaces
   *  a both-moved note, the user's version is copied BESIDE it — an ordinary
   *  untracked file the user merges from and deletes when done. Banking is
   *  the floor, not the ceremony: the pull itself stays one action.
   *
   *  FINDING 118: THE NAME NEVER STANDS FOR TWO VERSIONS, AND A FAILURE IS NOT
   *  "ALREADY BANKED". The copy was named to the minute and every create error
   *  was read as "this exact version is already there", so a second, different
   *  version in the same minute was not written, the pull overwrote the note,
   *  and the notice still named the first copy. A name that is taken holds
   *  this very text (then it is the copy) or another version (then the next
   *  numbered name is tried, the way note sync names its own conflict copies);
   *  a create that fails for any other reason throws, so the pull stops
   *  before it overwrites the note. */
  private async bankConflictCopy(path: string, old: string): Promise<string> {
    const skip = new Set<string>();
    for (let tries = 0; tries < 100; tries++) {
      const bankPath = conflictCopyPath(path, new Date(), (p) => skip.has(p));
      const there = this.app.vault.getAbstractFileByPath(bankPath);
      if (there instanceof TFile) {
        if ((await this.app.vault.read(there)) === old) return bankPath;
        skip.add(bankPath);
        continue;
      }
      try {
        await this.app.vault.create(bankPath, old);
        return bankPath;
      } catch (e) {
        // Raced with a writer that made the name between the look and the
        // create: look again. Anything else is the copy NOT having been made.
        if (this.app.vault.getAbstractFileByPath(bankPath)) continue;
        throw new Error(`could not keep a copy of "${path}" beside it (${e}) — nothing was overwritten`);
      }
    }
    throw new Error(`could not find a free name for a copy of "${path}" — nothing was overwritten`);
  }

  /** R-379: push every note of a space, index last — the index carries no
   *  records, so it is the cheapest one to land after the module notes have
   *  moved the data. Serial, because they all merge into one space.
   *
   *  R-399: the server-changed question is asked ONCE per space, here — a
   *  plain pushFile loop would pop one modal per changed note and run past
   *  them (the modal is fire-and-forget). The sweep stops at the first
   *  changed note; the human's one answer covers the space, and the per-note
   *  pushes run force (the sweep just was the check). */
  async pushSpace(spaceId: string) {
    // Row 1515: the index is pushed too, and LAST: a row of its links table
    // may name a record a module note above has just written back.
    const all = this.entriesForSpace(spaceId);
    const files = [
      ...all.filter((f) => f.entry.role !== 'index'),
      ...all.filter((f) => f.entry.role === 'index'),
    ];
    if (!files.length) {
      new Notice('Graphite: nothing here holds records to push.');
      return;
    }
    // R-5379: ONLY THE NOTES THAT WERE EDITED HERE. Push space forced every
    // note up, the index included, so a link added in a module note was
    // created by that note and then deleted again by the unchanged index,
    // whose links table did not have it yet. A note with no local edits has
    // nothing to say, and pushing it as if it did is how it said something.
    const edited: typeof files = [];
    for (const f of files) {
      if ((await this.fileState(f.path)) === 'local-edits') edited.push(f);
    }
    if (!edited.length) {
      new Notice('Graphite: nothing to push — no note in this space changed since the last sync.');
      return;
    }
    files.splice(0, files.length, ...edited);
    let changed = false;
    for (const f of files) {
      // ROW 2514: a note with a base is judged by the server per field (see
      // pushFile), so only the ones without a base can hold the sweep.
      if (this.settings.bases[f.path] !== undefined) continue;
      if ((await this.serverState(f.path)) === 'server-changed') {
        changed = true;
        break;
      }
    }
    const pushAll = async () => {
      for (const f of files) await this.pushFile(f.path, { force: true });
    };
    if (!changed) return pushAll();
    const name = files[0].entry.spaceName ?? spaceId;
    new ConflictPushModal(this.app, name, (choice) => {
      if (choice === 'pull') void this.pullSpace({ id: spaceId, name });
      else if (choice === 'push') void pushAll();
    }).open();
  }

  async forget(path: string) {
    delete this.settings.files[path];
    delete this.settings.bases[path];
    await this.saveSettings();
    this.refreshPanel();
  }

  /** Stop syncing a whole space. The notes stay in the vault as ordinary
   *  files — forgetting is a mapping change, never a delete. */
  async forgetSpace(spaceId: string) {
    for (const f of this.entriesForSpace(spaceId)) {
      delete this.settings.files[f.path];
      delete this.settings.bases[f.path];
    }
    await this.saveSettings();
    this.refreshPanel();
  }

  async loadSettings() {
    const data = (await this.loadData()) ?? {};
    // v1 migration: files values used to be plain spaceId strings.
    if (data.files) {
      for (const k of Object.keys(data.files)) {
        if (typeof data.files[k] === 'string') data.files[k] = { spaceId: data.files[k] };
      }
    }
    this.settings = { ...DEFAULTS, ...data };
    this.settings.routeCache = Array.isArray(data.routeCache) ? data.routeCache : [];
    this.settings.routeRecent = Array.isArray(data.routeRecent) ? data.routeRecent : [];
    this.settings.spacesSeen = Array.isArray(data.spacesSeen)
      ? data.spacesSeen.filter((x: unknown) => typeof x === 'string') : [];
    // A vault that already has spaces pulled by hand chose them; bringing in
    // the rest unasked would be a surprise. An explicit choice either way
    // is never overridden.
    if (typeof data.mirrorAll !== 'boolean') {
      this.settings.mirrorAll = Object.keys(this.settings.files ?? {}).length === 0;
    }
    // NOTE PAGES: a state of its own, never the one object DEFAULTS holds.
    this.settings.pageModules = {};
    if (data.pageModules && typeof data.pageModules === 'object') {
      for (const [k, v] of Object.entries(data.pageModules)) {
        if (typeof v === 'string' && v) this.settings.pageModules[k] = v;
      }
    }
    // A vault that listed page folders before pages had a switch of their own
    // was already sending them; naming the folders was its consent. An
    // explicit choice, either way, is never overridden.
    if (typeof data.pagesOn !== 'boolean') {
      this.settings.pagesOn = parseFolders(String(data.pageFolders ?? '')).length > 0;
    }
    // ROW 2514: the bases are a store of their own — a copy, text only, and
    // only for notes still tracked (a base for a path nothing syncs any
    // more would be sent for a note that is not that one).
    this.settings.bases = {};
    if (data.bases && typeof data.bases === 'object') {
      for (const [k, v] of Object.entries(data.bases)) {
        if (typeof v === 'string' && this.settings.files[k]) putBase(this.settings.bases, k, v);
      }
    }
    // ROW 2375: a state of its own, never the one object DEFAULTS holds.
    const ns = data.noteSyncState;
    this.settings.noteSyncState = ns && typeof ns === 'object' && ns.files && typeof ns.files === 'object'
      ? { target: String(ns.target ?? ''), cursor: ns.cursor ?? null, files: ns.files }
      : emptyNoteSyncState();
    // OC2: the inbox moved onto the vault's binding on the server; an id
    // left here from before would only mislead a reader of data.json.
    delete (this.settings as any).captureModuleId;
    delete (this.settings as any).captureInboxName;
    // OC2 · R-1391: minted ONCE, the first time this plugin loads in this
    // vault, and never again — a new id is a new vault to the server, with
    // no binding. Saved at once so a crash before the next save cannot
    // mint a second.
    if (!this.settings.vaultId) {
      this.settings.vaultId = mintVaultId();
      await this.saveSettings();
    }
  }
  async saveSettings() {
    await this.saveData(this.settings);
    // ROW 2375: the settings note follows the settings screen, once it has
    // been read at start-up and only while he keeps one.
    if (this.settings.configFile && this.settingsNoteOpen) await this.writeSettingsNote();
  }
}

/* ══ OC3 · `>>` AT THE CURSOR ═══════════════════════════════════════════
 * A dropdown under the cursor while he writes, filtered as he types, Enter
 * to write the destination into the line. Never in a synced note — its
 * lines are records already, and the app is where they move. */
class RouteSuggest extends EditorSuggest<Route> {
  constructor(app: App, private plugin: GraphitePlugin) {
    super(app);
  }

  onTrigger(cursor: EditorPosition, editor: Editor, file: TFile | null): EditorSuggestTriggerInfo | null {
    if (file && this.plugin.settings.files[file.path]) return null;
    const text = editor.getLine(cursor.line);
    let inFm = false;
    if (cursor.line > 0 && editor.getLine(0).trim() === '---') {
      inFm = true;
      for (let i = 1; i < cursor.line; i++) if (editor.getLine(i).trim() === '---') { inFm = false; break; }
    }
    const t = routeTrigger(text, cursor.ch, inFm);
    if (!t) return null;
    return { start: { line: cursor.line, ch: t.start }, end: cursor, query: t.query };
  }

  getSuggestions(ctx: EditorSuggestContext): Route[] {
    const all = this.plugin.routes();
    if (!all.length) void this.plugin.refreshRoutes();
    return filterRoutes(all, ctx.query, this.plugin.settings.routeRecent).slice(0, 40);
  }

  renderSuggestion(r: Route, el: HTMLElement) {
    renderRoute(r, el);
  }

  selectSuggestion(r: Route) {
    const ctx = this.context;
    if (!ctx) return;
    this.plugin.insertRoute(ctx.editor, r, ctx.start.line, { from: ctx.start, to: ctx.end });
  }
}

/** One row of the route list: the path dimmed above the leaf, the tag the
 *  token will use, and the modules a `/` reaches. */
function renderRoute(r: Route, el: HTMLElement) {
  const top = el.createDiv({ cls: 'gr-route' });
  const above = r.path.slice(0, -1).join(' › ');
  if (above) top.createSpan({ text: `${above} › `, cls: 'gr-route-above' });
  top.createSpan({ text: r.module ? `${r.path[r.path.length - 1]} › ${r.module.name}` : r.path[r.path.length - 1], cls: 'gr-route-leaf' });
  if (!r.module && r.tags.length) top.createSpan({ text: `#${r.tags[0]}`, cls: 'gr-route-tag' });
  if (!r.module && r.modules.length > 1) {
    el.createDiv({ text: `${r.modules.map((m) => m.name).join(' · ')} — type / to pick one`, cls: 'gr-route-mods' });
  }
}

/** The palette's version of the same list, with module choices in it. */
class RouteModal extends FuzzySuggestModal<Route> {
  constructor(app: App, private plugin: GraphitePlugin, private onPick: (r: Route) => void) {
    super(app);
    this.setPlaceholder('Route this line to… (a space, or space/module)');
  }
  getItems() {
    const all = this.plugin.routes();
    return [...all, ...all.flatMap((r) => r.modules.length > 1 ? r.modules.map((m) => ({ ...r, module: m })) : [])];
  }
  getItemText(r: Route) {
    return [r.path.join(' › '), r.module?.name, ...r.tags].filter(Boolean).join(' ');
  }
  onChooseItem(r: Route) { this.onPick(r); }
}

class SpacePicker extends FuzzySuggestModal<SpaceInfo> {
  constructor(app: App, private spaces: SpaceInfo[], private onPick: (s: SpaceInfo) => void) {
    super(app);
    this.setPlaceholder('Pull which space?');
  }
  getItems() { return this.spaces; }
  getItemText(s: SpaceInfo) { return s.name; }
  onChooseItem(s: SpaceInfo) { this.onPick(s); }
}

/** R-399: the both-moved choice, made by the human it belongs to. A push
 *  over a space that changed in the app is a choice between two people's
 *  edits — the plugin may present it, never make it. */
class ConflictPushModal extends Modal {
  constructor(
    app: App,
    private spaceName: string,
    private onPick: (choice: 'pull' | 'push' | 'cancel') => void,
  ) {
    super(app);
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h3', { text: 'The app changed this too' });
    contentEl.createEl('p', {
      text:
        `"${this.spaceName}" moved in Graphite since your last sync. ` +
        'Pushing now writes this note’s values over the app’s newer ' +
        'edits (the app keeps an undo). Pulling first refreshes the note — ' +
        'if your edits collide, your version is banked beside it.',
      cls: 'gr-picker-hint',
    });
    new Setting(contentEl)
      .addButton((b) => b.setButtonText('Pull first').setCta()
        .onClick(() => { this.close(); this.onPick('pull'); }))
      .addButton((b) => b.setButtonText('Push anyway').setWarning()
        .onClick(() => { this.close(); this.onPick('push'); }))
      .addButton((b) => b.setButtonText('Cancel')
        .onClick(() => { this.close(); this.onPick('cancel'); }));
  }
  onClose() { this.contentEl.empty(); }
}

/** RULED 2026-09-24: which TYPE of module to add. */
class ModuleTypePicker extends FuzzySuggestModal<string> {
  constructor(app: App, private onPick: (type: string) => void) {
    super(app);
    this.setPlaceholder('Add which kind of module?');
  }
  getItems() { return ADDABLE_MODULE_TYPES; }
  getItemText(t: string) { return moduleTypeName(t); }
  onChooseItem(t: string) { this.onPick(t); }
}

/** RULED 2026-09-24: and what to call it. Blank keeps the type's name. */
class ModuleNamePrompt extends Modal {
  private name = '';
  constructor(app: App, private typeName: string, private onDone: (name: string) => void) {
    super(app);
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h3', { text: `Name the new ${this.typeName} module` });
    new Setting(contentEl)
      .setName('Name')
      .addText((t) => t.setPlaceholder(this.typeName).onChange((v) => { this.name = v; }));
    new Setting(contentEl)
      .addButton((b) => b.setButtonText('Cancel').onClick(() => this.close()))
      .addButton((b) => b.setButtonText('Add').setCta().onClick(() => this.submit(this.name)));
  }
  /** What Add does — public so a test can press it. */
  submit(name: string) {
    this.close();
    this.onDone(name);
  }
  onClose() { this.contentEl.empty(); }
}

/** R-290 (Omar): pick the DESTINATION VAULT for a pulled space. */
class VaultPicker extends FuzzySuggestModal<VaultDest> {
  constructor(app: App, private vaults: VaultDest[], private onPick: (v: VaultDest) => void) {
    super(app);
    this.setPlaceholder('Into which vault?');
  }
  getItems() { return this.vaults; }
  getItemText(v: VaultDest) { return v.current ? `${v.name} (this vault)` : v.name; }
  onChooseItem(v: VaultDest) { this.onPick(v); }
}

/** R-290: checkbox picker — which of the space's modules travel to the
 *  vault. All checked (the default) = the whole space, filter cleared. */
class ModulePicker extends Modal {
  private checks: Record<string, boolean> = {};
  constructor(
    app: App,
    private space: SpaceInfo,
    private modules: ModuleInfo[],
    private onPick: (picked: ModuleInfo[]) => void,
  ) {
    super(app);
    for (const m of modules) this.checks[m.id] = true;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h3', { text: `Sync what from "${this.space.name}"?` });
    contentEl.createEl('p', {
      text: 'Unticked modules stay out of the file — and pushes never touch them.',
      cls: 'gr-picker-hint',
    });
    for (const m of this.modules) {
      new Setting(contentEl)
        .setName(m.name)
        .setDesc(moduleTypeName(m.type))
        .addToggle((t) => t.setValue(true).onChange((v) => { this.checks[m.id] = v; }));
    }
    new Setting(contentEl)
      .addButton((b) => b.setButtonText('Cancel').onClick(() => this.close()))
      .addButton((b) => b.setButtonText('Pull').setCta().onClick(() => {
        const picked = this.modules.filter((m) => this.checks[m.id]);
        if (!picked.length) { new Notice('Pick at least one module.'); return; }
        this.close();
        this.onPick(picked);
      }));
  }
  onClose() { this.contentEl.empty(); }
}

class LpSyncView extends ItemView {
  constructor(leaf: WorkspaceLeaf, private plugin: GraphitePlugin) {
    super(leaf);
  }
  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return 'Graphite sync'; }
  getIcon() { return 'refresh-cw'; }

  async onOpen() {
    this.contentEl.addClass('gr-sync-view');
    await this.plugin.checkConnection(false); // triggers render via refreshPanel
    this.render();
  }

  render() {
    const el = this.contentEl;
    el.empty();

    // ── Header + actions ──────────────────────────────────────────────
    const head = el.createDiv({ cls: 'gr-sync-head' });
    head.createEl('h4', { text: 'Graphite sync' });
    const actions = head.createDiv({ cls: 'gr-sync-actions' });
    // On a device there is nothing to pull: the app writes the notes.
    if (!this.plugin.onDevice) {
      actions.createEl('button', { text: 'Pull a space…' })
        .addEventListener('click', () => void this.plugin.chooseAndPull());
    }
    actions.createEl('button', { text: this.plugin.onDevice ? 'Look again' : 'Refresh' })
      .addEventListener('click', () => void this.plugin.checkConnection(false));

    // ── Connection ────────────────────────────────────────────────────
    const conn = el.createDiv({ cls: 'gr-sync-section' });
    const onDevice = this.plugin.onDevice;
    conn.createEl('div', { text: onDevice ? 'THIS DEVICE' : 'CONNECTION', cls: 'gr-sync-label' });
    const me = this.plugin.lastMe;
    const health = this.plugin.lastHealth;
    const onComputer = this.plugin.onComputer;
    if (onDevice) {
      // Nothing is connected to: the panel says what the app left in this
      // vault, and what happens to a change made here.
      const look = this.plugin.mirrorLook;
      if (!look) {
        conn.createDiv({ text: 'Looking in this vault…', cls: 'gr-sync-dim' });
      } else {
        conn.createDiv({
          text: `${look.folders.length ? '🟢' : '🔴'} ${mirrorSentence(look, Date.now(), Platform.isMobile)}`,
          cls: look.folders.length ? '' : 'gr-sync-bad',
        });
        if (look.changedHere > 0) {
          const list = conn.createEl('ul', { cls: 'gr-sync-dim' });
          for (const f of look.folders) for (const n of f.changedHere.slice(0, 8)) list.createEl('li', { text: n });
        }
        conn.createDiv({
          text: `Looked ${clock(this.plugin.lastCheck?.at ?? Date.now())}. Nothing is sent from here.`,
          cls: 'gr-sync-dim',
        });
      }
    } else if (!this.plugin.configured) {
      conn.createDiv({
        text: onComputer ? this.plugin.notConfigured().long
          : 'Not configured — set the server URL and API token in the plugin settings.',
        cls: 'gr-sync-bad',
      });
    } else if (me) {
      conn.createDiv({
        text: onComputer ? '🟢 Connected to the Graphite app on this computer'
          : `🟢 Connected as ${me.name ?? me.email} · ${this.plugin.settings.serverUrl}`,
      });
      // ROW 2376: "connected" is what the last check found, so it says when.
      const when = this.plugin.lastCheck ? ` · checked ${clock(this.plugin.lastCheck.at)}` : '';
      conn.createDiv({
        text: `${onComputer ? 'Graphite app version' : 'Server version'} ${health?.version ?? 'unknown'}${when}`,
        cls: 'gr-sync-dim',
      });
      // REGISTER 1527: an out-of-date plugin says so where the connection is.
      const outdated = this.plugin.outdatedNote();
      if (outdated) conn.createDiv({ text: outdated, cls: 'gr-sync-bad' });
      // R-1500: whether this vault reached the app's folder dropdown. Said
      // HERE rather than as a Notice, because the connection check runs
      // every few minutes and a popup about a settled permission would be
      // a popup about nothing having changed.
      if (this.plugin.vaultReport === 'gated') {
        conn.createDiv({
          text: 'This vault is not offered in the app\'s mirror-folder '
            + 'dropdown: naming a vault there is an instance-operator '
            + 'setting. Everything else on this panel works normally.',
          cls: 'gr-sync-dim',
        });
      } else if (this.plugin.vaultReport === 'failed') {
        conn.createDiv({
          text: 'This vault could not be reported to the server, so it may '
            + 'not appear in the app\'s mirror-folder dropdown. An older '
            + 'server does not have that endpoint.',
          cls: 'gr-sync-dim',
        });
      }
    } else {
      if (onComputer) {
        conn.createDiv({ text: `🔴 ${this.plugin.lastCheck?.detail ?? 'Not connected'} · this computer`, cls: 'gr-sync-bad' });
        conn.createDiv({ text: 'Use Refresh once the Graphite app is open.', cls: 'gr-sync-dim' });
      } else {
        conn.createDiv({ text: `🔴 Not connected · ${this.plugin.settings.serverUrl}`, cls: 'gr-sync-bad' });
        conn.createDiv({ text: 'Use Refresh (or fix the token in settings).', cls: 'gr-sync-dim' });
      }
    }

    // A device has no pull, no push and no proposals to approve: what is left
    // to say is how the exchange works.
    if (onDevice) {
      const how = el.createDiv({ cls: 'gr-sync-section' });
      how.createEl('div', { text: 'HOW THIS WORKS', cls: 'gr-sync-label' });
      const ul = how.createEl('ul', { cls: 'gr-sync-how' });
      for (const line of [
        'The Graphite app writes your spaces into this vault as notes. It does that whenever the app is opened, and nothing runs in the background.',
        'Change a line, tick a box or add a task line in a note here, and the app takes it in the next time it is opened, then writes the note again in its own form.',
        'This plugin only looks. It never sends anything, and it cannot tell whether the app has taken a change in until the app has been opened and has written again.',
        'To choose which vault the app writes into: in the Graphite app, Settings, Data and server, Data locations.',
      ]) ul.createEl('li', { text: line });
      return;
    }

    // ── OC4: proposals in the note in front of him ────────────────────
    // The fourth gesture, and the place a person LOOKS for what is waiting.
    // Each proposal shows its state in words; approving one here calls the
    // same transition the command, the tick and the un-italicise call.
    const props = el.createDiv({ cls: 'gr-sync-section' });
    props.createEl('div', { text: 'PROPOSALS IN THIS NOTE', cls: 'gr-sync-label' });
    const propsBody = props.createDiv();
    propsBody.createDiv({ text: '…', cls: 'gr-sync-dim' });
    void this.plugin.activeProposals().then((a) => {
      propsBody.empty();
      if (!a || !a.list.length) {
        propsBody.createDiv({ text: 'None. Your agent writes proposals in italic; they wait here until you approve them.', cls: 'gr-sync-dim' });
        return;
      }
      const synced = !!this.plugin.settings.files[a.file.path];
      const count = (st: string) => a.list.filter((p) => p.state === st).length;
      propsBody.createDiv({
        text: `${count('proposed')} proposed · ${count('approved')} approving · ${count('unreadable')} unreadable`,
        cls: 'gr-sync-dim',
      });
      for (const p of a.list) {
        const row = propsBody.createDiv({ cls: `gr-sync-file gr-proposal-row gr-proposal-${p.state}` });
        const words = approvedText(a.lines[p.line]).replace(/^\s*[-*+]\s+\[[ xX]\]\s+/, '');
        row.createSpan({ text: words });
        row.createEl('span', {
          text: synced ? 'unreadable · synced note'
            : p.state === 'approved' ? 'approving' : p.state === 'unreadable' ? `unreadable · ${p.reason}` : 'proposed',
          cls: 'gr-sync-state',
        });
        if (!synced && p.state !== 'unreadable') {
          row.createEl('button', { text: 'Approve' })
            .addEventListener('click', () => void this.plugin.approveProposals(a.file, [p.key]));
        }
      }
      if (!synced && a.list.some((p) => p.state !== 'unreadable')) {
        propsBody.createEl('button', { text: 'Approve all' })
          .addEventListener('click', () => void this.plugin.approveProposals(a.file, 'all'));
      }
    });

    // ── Synced files, grouped by space ────────────────────────────────
    // R-379: a folder-layout space is many files, so the SPACE is the row and
    // its notes are lines under it. A single-file space is the same shape with
    // exactly one line — one way to read the panel, not two.
    const filesSec = el.createDiv({ cls: 'gr-sync-section' });
    filesSec.createEl('div', { text: 'SYNCED SPACES', cls: 'gr-sync-label' });
    const paths = Object.keys(this.plugin.settings.files);
    if (paths.length === 0) {
      filesSec.createDiv({ text: 'Nothing synced into this vault yet — use "Pull a space…".', cls: 'gr-sync-dim' });
    }
    const bySpace = new Map<string, string[]>();
    for (const path of paths) {
      const id = this.plugin.settings.files[path].spaceId;
      (bySpace.get(id) ?? bySpace.set(id, []).get(id)!).push(path);
    }
    for (const [spaceId, spacePaths] of bySpace) {
      // The index note first, then the module notes by name — the order the
      // folder reads in.
      spacePaths.sort((a, b) => {
        const ra = this.plugin.settings.files[a].role === 'index' ? 0 : 1;
        const rb = this.plugin.settings.files[b].role === 'index' ? 0 : 1;
        return ra - rb || a.localeCompare(b);
      });
      const head = this.plugin.settings.files[spacePaths[0]];
      const name = head.spaceName ?? spaceId;
      const row = filesSec.createDiv({ cls: 'gr-sync-row' });
      const top = row.createDiv({ cls: 'gr-sync-row-top' });
      top.createEl('b', { text: name });
      const scope = head.moduleIds?.length
        ? `${head.moduleIds.length}${head.moduleCount ? `/${head.moduleCount}` : ''} modules`
        : 'whole space';
      const where = head.folder ? `${head.folder}/ · ${spacePaths.length} notes` : spacePaths[0];
      row.createDiv({
        text: `${where} · ${scope} · synced ${relTime(head.lastSyncAt)}`,
        cls: 'gr-sync-dim',
      });

      for (const path of spacePaths) {
        const entry = this.plugin.settings.files[path];
        const line = row.createDiv({ cls: 'gr-sync-file' });
        const label = entry.folder ? path.slice(entry.folder.length + 1) : path;
        line.createSpan({ text: entry.role === 'index' ? `${label} (index)` : label });
        const stateEl = line.createEl('span', { text: '…', cls: 'gr-sync-state' });
        void this.plugin.fileState(path).then((s) => {
          stateEl.setText(
            s === 'in-sync' ? '✓ in sync' :
            s === 'local-edits' ? '● local edits' : '⚠ file missing');
          stateEl.addClass(`gr-state-${s}`);
        });
        const pushBtn = line.createEl('button', { text: 'Push' });
        pushBtn.addEventListener('click', () => void this.plugin.pushFile(path));
        // R-8336: a page whose file is gone has nothing to push; the same
        // button is the deletion, and says so.
        if (entry.role === 'page') {
          void this.plugin.fileState(path).then((s) => {
            if (s === 'missing') pushBtn.setText('Delete page');
          });
        }
        line.createEl('button', { text: 'Check' })
          .addEventListener('click', () => void this.plugin.serverState(path).then((s) => {
            new Notice(
              s === 'server-changed' ? 'Server has NEW changes since your last sync — Pull to get them.' :
              s === 'server-unchanged' ? 'Server matches your last sync.' :
              'Could not reach the server.');
          }));
      }

      const btns = row.createDiv({ cls: 'gr-sync-row-btns' });
      const mk = (label: string, fn: () => void) =>
        btns.createEl('button', { text: label }).addEventListener('click', fn);
      mk('Pull', () => void this.plugin.pullSpace({ id: spaceId, name }));
      mk('Push all', () => void this.plugin.pushSpace(spaceId));
      mk('Forget', () => void this.plugin.forgetSpace(spaceId));
    }

    // ── How this sync works ───────────────────────────────────────────
    const how = el.createDiv({ cls: 'gr-sync-section' });
    how.createEl('div', { text: 'HOW THIS SYNC WORKS', cls: 'gr-sync-label' });
    const auto = this.plugin.settings.autoPush;
    const ul = how.createEl('ul', { cls: 'gr-sync-how' });
    const folder = this.plugin.settings.layout === 'folder';
    for (const line of [
      `Mode: ${auto ? 'AUTO-PUSH — tracked files push ~2.5s after you stop editing.' : 'MANUAL — you decide when to Pull and Push (auto-push can be enabled in settings).'}`,
      `Layout: ${folder
        ? 'FOLDER PER SPACE — an index note plus one note per module, linked both ways; each note pushes on its own.'
        : 'ONE FILE PER SPACE — the whole space as a single package file (switch to a folder in settings).'}`,
      'Pull writes the server’s canonical export of a space into this vault.',
      'Your “📝 Freeform notes” block is yours: it is carried across every pull and push. Everything outside it is regenerated from the app.',
      'Push sends your edits through the validate-first merge importer: on any error (shown with line numbers) NOTHING lands; on success the file is rewritten to the server’s canonical form.',
      '"● local edits" = the file changed since the last sync. "Check server" tells you if the space changed on the server side.',
      'Pulling asks which VAULT the space lands in — pick any local vault, and its own Graphite Sync instance is seeded so pushes work natively from there. This panel lists only the current vault’s files.',
      'Any number of spaces can be pulled into any number of vaults; each vault keeps its own settings and mappings.',
      'Optional: the "choosing modules" command pulls a space with only ticked modules in the file — unticked ones never enter the vault, and pushes never touch them (absence never deletes on the server).',
    ]) ul.createEl('li', { text: line });
  }
}

class LpSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: GraphitePlugin) {
    super(app, plugin);
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const onDevice = this.plugin.onDevice;
    const onComputer = this.plugin.onComputer;
    new Setting(containerEl)
      .setName('Where Graphite is')
      .setDesc('A server, or the Graphite app on this device or computer. "This computer" reads the spaces '
        + 'the app holds, with no server and no account: it needs Obsidian on a desktop and the '
        + 'Graphite app open on the same computer, with "Let the notes plugin read Graphite on this '
        + 'computer" turned on in its Settings, Data and server (a phone cannot; use Server). '
        + '"This device" needs no server and no '
        + 'account: the Graphite app writes your spaces into this vault as notes whenever it is opened, '
        + 'and takes in what you changed here the next time it is opened. Nothing runs in the '
        + 'background, so a change you make here waits for that. In Graphite, choose this vault in '
        + 'Settings, Data and server, Data locations.')
      .addDropdown((d) => d
        .addOption('server', 'Server')
        .addOption('device', 'This device')
        .addOption('computer', 'This computer')
        .setValue(this.plugin.settings.source)
        .onChange(async (v) => {
          if (v === 'computer' && !Platform.isDesktopApp) {
            new Notice(`Graphite: ${doorSentence('phone')}`, 10000);
            this.plugin.settings.source = 'server';
          } else {
            this.plugin.settings.source = v === 'device' ? 'device' : v === 'computer' ? 'computer' : 'server';
          }
          await this.plugin.saveSettings();
          this.plugin.computerReadOnly = false;
          await this.plugin.checkConnection(false);
          this.display();
        }));
    if (onDevice) {
      const look = this.plugin.mirrorLook;
      new Setting(containerEl)
        .setName('This device')
        .setDesc(look
          ? mirrorSentence(look, Date.now(), Platform.isMobile)
          : 'Looking in this vault for the notes the Graphite app wrote.');
    } else if (onComputer) {
      const look = this.plugin.doorLook(true);
      new Setting(containerEl)
        .setName('This computer')
        .setDesc(look.ok
          ? 'Found the Graphite app on this computer. There is no address or token to enter: '
            + 'the app leaves them where this plugin reads them, and they change each time the app starts.'
          : doorSentence(look.why));
    } else {
      new Setting(containerEl)
        .setName('Server URL')
        // A space kept on devices, or shared through the relay, is on no
        // server: choose This device above to read those.
        .setDesc('The Graphite server your account is on, e.g. https://graphite.example.com. '
          + 'Only spaces kept on a server can be pulled from it. To read spaces kept on your '
          + 'devices, or shared between them through the relay, choose This device above.')
        .addText((t) => t.setPlaceholder('https://graphite.example.com')
          .setValue(this.plugin.settings.serverUrl).onChange(async (v) => {
          this.plugin.settings.serverUrl = v.trim();
          await this.plugin.saveSettings();
        }));
      new Setting(containerEl)
        .setName('API token')
        .setDesc('Generate one in the Graphite app, signed in to that server: Settings → '
          + 'Where am I signed in? → Generate API token.')
        .addText((t) => t.setValue(this.plugin.settings.token).onChange(async (v) => {
          this.plugin.settings.token = v.trim();
          await this.plugin.saveSettings();
        }));
    }
    new Setting(containerEl)
      .setName('Connection')
      .setDesc(onDevice
        ? 'Looks in this vault for the notes the Graphite app wrote, and says what changed here since.'
        : onComputer
        ? 'Looks for the Graphite app on this computer and asks it who it is.'
        : 'Verifies the URL + token against the server and shows who you are signed in as.')
      .addButton((b) => b.setButtonText(onDevice ? 'Look again' : 'Test connection').setCta().onClick(async () => {
        // MEETING-CAPTURE: the space and inbox lists below were asked of the
        // server when the tab drew, which on first setup was before there
        // was a URL or a token, so they stayed empty until the tab was
        // reopened. A test that connects draws them again; one that fails
        // leaves the tab alone, with what was typed still in view.
        if (await this.plugin.checkConnection(true) && !onDevice) this.display();
      }));
    if (!onDevice && !onComputer) {
      new Setting(containerEl)
        .setName('Bring in every space')
        .setDesc('Once the key is linked, every space you can read is pulled into this vault, and '
          + 'a space made later arrives the next time Obsidian opens. This only writes files '
          + 'here. Edits go back to Graphite when you push them (or with Auto-push below), '
          + 'into the space this vault is bound to.')
        .addToggle((t) => t.setValue(this.plugin.settings.mirrorAll).onChange(async (v) => {
          this.plugin.settings.mirrorAll = v;
          await this.plugin.saveSettings();
        }))
        .addButton((b) => b.setButtonText('Bring in now').onClick(async () => {
          if (await this.plugin.checkConnection(true)) await this.plugin.mirrorEverySpace(true);
        }));
    }
    // A pulled space's layout is the choice of a pull, which a device has none of.
    if (!onDevice) {
      // R-379: the vault-shaping choice. Changing it does not touch what is
      // already synced — pull a space again to move it to the new layout.
      new Setting(containerEl)
        .setName('Vault layout')
        .setDesc('How a pulled space lands here. "Folder per space" writes an index note '
          + 'plus one note per module, linked to each other and carrying the module\'s own '
          + 'tags — so a module is a note you can open, link and embed on its own. '
          + 'Existing files keep the layout they were pulled with until you pull them again.')
        .addDropdown((d) => d
          // R-1512: the default reads first. A dropdown whose first option
          // is not what a fresh vault does is a dropdown that teaches the
          // wrong answer to somebody who never opens it.
          .addOption('folder', 'Folder per space (one note per module)')
          .addOption('single', 'One file per space')
          .setValue(this.plugin.settings.layout)
          .onChange(async (v) => {
            this.plugin.settings.layout = v === 'folder' ? 'folder' : 'single';
            await this.plugin.saveSettings();
            this.plugin.refreshPanel();
          }));
    }
    new Setting(containerEl)
      .setName('Hide sync ids')
      .setDesc('Hide the "lp:" id markers the sync uses for matching records. '
        + 'They stay in the file (pushes need them) and reveal themselves on '
        + 'the line you are editing.')
      .addToggle((t) => t.setValue(this.plugin.settings.hideIds).onChange(async (v) => {
        this.plugin.settings.hideIds = v;
        await this.plugin.saveSettings();
      }));
    if (!onDevice) {
      new Setting(containerEl)
        .setName('Auto-push on save')
        .setDesc('Push tracked files ~2.5s after you stop editing. Off = manual pushes only.')
        .addToggle((t) => t.setValue(this.plugin.settings.autoPush).onChange(async (v) => {
          this.plugin.settings.autoPush = v;
          await this.plugin.saveSettings();
          this.plugin.refreshPanel();
        }));
    }
    if (onDevice || onComputer) {
      // These live on a server: a space the vault is bound to, an inbox, the
      // lines a capture files, the census. The app on this device or computer has no
      // such server, so there is nothing to choose and one line says why.
      new Setting(containerEl)
        .setName('Capture, binding and census')
        .setDesc('These need a Graphite server, so they are off while Graphite is read from this ' + (onComputer ? 'computer' : 'device') + '. '
          + 'Choose Server above to use them.');
    } else {
      // OC2: THE VAULT'S WALL. Omar, 2026-09-22: a vault is "linked to a space
      // with its subtree"; 2026-09-23: a note naming a space outside it is
      // refused, and says so. Unbound by default, and an unbound vault writes
      // nothing — the server refuses it rather than letting it reach every
      // space the account can.
      //
      // Both lists need the server, and a settings tab that waits for a
      // server before it draws is a settings tab that cannot be opened
      // offline. So they draw, and the choices arrive.
      const binding = this.plugin.fetchBinding().catch(() => null);
      new Setting(containerEl)
        .setName('This vault\'s space')
        .setDesc('Everything this vault writes to Graphite lands in this space or a space '
          + 'nested inside it — or nowhere: a note that names a space outside it is refused, '
          + 'and the refusal says which (unless All my spaces, below, is on). Nothing is written '
          + 'until a space is chosen. New spaces and captured lines go here.')
        .addDropdown((d) => {
          d.addOption('', 'Not bound — this vault writes nothing');
          d.setValue('');
          d.onChange(async (v) => {
            if (this.quiet) return;
            await this.plugin.bindVault(v || null);
            this.display();
          });
          this.bindingChoices = Promise.all([binding, this.plugin.fetchSpaces()])
            .then(([b, spaces]) => {
              for (const s of spaces) d.addOption(s.id, s.name);
              this.setQuietly(() => d.setValue(b?.bound && b.root ? b.root.id : ''));
            }).catch(() => { /* offline: the tab still opens */ });
        });
      // 2026-11-17, "All, opt-in switch": the person's own choice to lift the
      // wall. Off for every vault until turned on, and the server is where it
      // is held (the binding), so it is read from there.
      new Setting(containerEl)
        .setName('All my spaces')
        .setDesc('Off: this vault writes only into its space and the spaces inside it. On: your '
          + 'edits go back to every space you are allowed to write in, and Graphite still '
          + 'checks each one. Needs a space chosen above.')
        .addToggle((t) => {
          t.setValue(false);
          t.onChange(async (v) => {
            // 0.6.10: a value the tab itself set is not a choice (see
            // setQuietly), and a value the server already holds needs no write.
            if (this.quiet || v === this.plugin.vaultAllSpaces) return;
            // Refused: the switch goes back to what the server holds. It does
            // NOT redraw the tab - a redraw reads the binding and sets the
            // switch again, which is how a refusal became a loop.
            if (!(await this.plugin.setAllSpaces(v))) this.setQuietly(() => t.setValue(this.plugin.vaultAllSpaces));
          });
          void binding.then((b) => this.setQuietly(() => t.setValue(!!(b?.bound && b.allSpaces)))).catch(() => undefined);
        });
      // R-1227: THE SETTING THE CAPTURE COMMAND ASKED FOR, AND THAT DID NOT
      // EXIST. Off by default: a command that files tasks into somebody's
      // workspace the first time it runs is not a command anybody asked for
      // (RU-035). OC2 moved it onto the binding: the choices are the server's
      // — Tasks modules inside this vault's space, in spaces you own — so the
      // dropdown never offers what the server would then refuse.
      new Setting(containerEl)
        .setName('Capture inbox')
        .setDesc('Where "Capture tasks from this vault" files a `- [ ]` line it finds '
          + 'in any note that is not a synced one. The line is marked afterwards, '
          + 'so capturing again never makes it twice. Choose the space this vault is bound to first.')
        .addDropdown((d) => {
          d.addOption('', 'Off');
          d.setValue('');
          d.onChange(async (v) => {
            if (this.quiet) return;
            if (!(await this.plugin.setInbox(v || null))) this.display();
          });
          this.inboxChoices = binding.then(async (b) => {
            if (!b?.bound) return;
            if (b.inbox) d.addOption(b.inbox.id, `${b.inbox.spaceName} › ${b.inbox.name}`);
            for (const m of await this.plugin.fetchInboxChoices()) {
              if (m.id !== b.inbox?.id) d.addOption(m.id, m.label);
            }
            this.setQuietly(() => d.setValue(b.inbox?.id ?? ''));
          }).catch(() => { /* offline: the tab still opens */ });
        });
      // RULED 2026-09-24: the two switches for tagged lines. Separate, as
      // ruled — either one is enough for a tagged line to become a note.
      new Setting(containerEl)
        .setName('Capture any tagged line as a note')
        .setDesc('A line that is not a task but has a #tag becomes a note in the '
          + 'capture inbox\'s space (its first Notes module), marked so it is never '
          + 'captured twice. Headings and lines of only tags are left alone.')
        .addToggle((t) => t.setValue(this.plugin.settings.captureAnyTagged).onChange(async (v) => {
          this.plugin.settings.captureAnyTagged = v;
          await this.plugin.saveSettings();
        }));
      new Setting(containerEl)
        .setName('Capture lines with these tags as notes')
        .setDesc('Comma-separated, e.g. st, mtg. A tag takes everything beneath it: '
          + 'st takes #st/IS-07. Works whether or not the switch above is on.')
        .addText((t) => t.setPlaceholder('st, mtg').setValue(this.plugin.settings.captureTags)
          .onChange(async (v) => {
            this.plugin.settings.captureTags = v;
            await this.plugin.saveSettings();
          }));
      // MEETING-CAPTURE: the command, run for you. Off by default (RU-035).
      new Setting(containerEl)
        .setName('Capture automatically')
        .setDesc('Capture a note a minute after it stops changing, whether you wrote it '
          + 'here or it arrived from another device, so nothing waits for the command. '
          + 'A note open in the editor waits until you leave it. Needs the capture inbox above.')
        .addToggle((t) => t.setValue(this.plugin.settings.autoCapture).onChange(async (v) => {
          this.plugin.settings.autoCapture = v;
          await this.plugin.saveSettings();
        }));
      // NOTE PAGES: their own switch. Off by default (RU-035). It needs the
      // vault bound to a space, above; it does not need the capture inbox.
      new Setting(containerEl)
        .setName('Send notes to Graphite as pages')
        .setDesc('Off by default. When on, a note in one of the folders below, or one with a '
          + 'routing heading (## Weekly >> Space), is sent to Graphite whole a minute after '
          + 'it stops changing and shown there as a read-only page with the tasks captured '
          + 'from it. This vault must be bound to a space, above; no capture inbox is needed.')
        .addToggle((t) => t.setValue(this.plugin.settings.pagesOn).onChange(async (v) => {
          this.plugin.settings.pagesOn = v;
          await this.plugin.saveSettings();
        }));
      new Setting(containerEl)
        .setName('Folders whose notes become pages')
        .setDesc('Comma-separated, e.g. Meetings. Every note in these folders is a page, '
          + 'while the switch above is on. Empty by default. A note with a routing heading '
          + 'is a page whatever this says. Pick the Notes module for each folder below.')
        .addText((t) => t.setPlaceholder('Meetings').setValue(this.plugin.settings.pageFolders)
          .onChange(async (v) => {
            this.plugin.settings.pageFolders = v;
            await this.plugin.saveSettings();
            this.drawPageModules();
          }));
      // One row per listed folder: the Notes module its pages are filed in.
      this.pageRows = containerEl.createDiv();
      this.pageModuleList = this.plugin.fetchPageModuleChoices();
      this.drawPageModules();
      // OC7: the census. Says exactly what leaves, because the switch is the
      // consent and a consent has to name what it covers.
      const sent = this.plugin.censusState;
      new Setting(containerEl)
        .setName('Send a vault census to the morning sweep')
        .setDesc('Off by default. When on, Graphite is sent — for each note with an '
          + 'unticked to-do nobody filed, or dated in the last week — its path, its date, '
          + 'how many task lines it holds in each state, its tags and its links. Never a '
          + 'word of the note. The sweep uses it to find to-dos nobody filed and meetings '
          + 'with no note; without it, the sweep says it could not look at the vault.'
          + (sent === 'failed' ? ' The last census could not be sent.'
            : sent === 'too-big' ? ' The last census was too large to send.'
            : sent ? ` Last sent with ${sent.notes} note${sent.notes === 1 ? '' : 's'}.` : ''))
        .addToggle((t) => t.setValue(this.plugin.settings.censusOn).onChange(async (v) => {
          this.plugin.settings.censusOn = v;
          await this.plugin.saveSettings();
          if (v) await this.plugin.reportCensus({ loud: true });
        }));
    }
    // OC5: the agent contract. The description is the disclosure: it says
    // where note text goes, rather than implying that nothing leaves.
    const agent = this.plugin.agentState;
    new Setting(containerEl)
      .setName('Publish the agent contract')
      .setDesc('Off by default. When on, two notes are written into Graphite/ in this vault: '
        + 'the routing list — the spaces, modules and tags your own agent may choose from, '
        + 'and nothing else — and the agent brief, which tells it how to write proposals. '
        + 'Your agent reads them and the folders below; the text of those notes goes to '
        + 'your agent\'s own model provider, never to Graphite. Graphite receives only what '
        + 'you approve. The brief\'s rules are instructions to your agent, not code — except '
        + 'the closed list, which approval checks.'
        + (agent === 'stale' ? ' The last refresh could not reach Graphite.' : ''))
      .addToggle((t) => t.setValue(this.plugin.settings.agentOn).onChange(async (v) => {
        this.plugin.settings.agentOn = v;
        await this.plugin.saveSettings();
        if (v) await this.plugin.publishAgentContract({ loud: true });
      }));
    new Setting(containerEl)
      .setName('Show the Graphite bar')
      .setDesc('A row of buttons above a note (below it on a phone or tablet): start a list, task, due, '
        + 'assign, priority, tag, send to, capture now. It is not shown in a note Graphite syncs. Every '
        + 'button is also a command, so you can put them on a phone toolbar and hide the row.')
      .addToggle((t) => t.setValue(this.plugin.settings.barOn).onChange(async (v) => {
        this.plugin.settings.barOn = v;
        await this.plugin.saveSettings();
        this.plugin.syncBars();
      }));
    new Setting(containerEl)
      .setName('Share the picker lists with other devices')
      .setDesc('On by default. While connected, the spaces, their Tasks and Notes modules, the people of '
        + 'each space and the tags in use are written to Graphite/Toolbar lists.json in this vault, so a '
        + 'tablet that has the plugin but no sign-in can still offer them in the bar pickers. Names only, '
        + 'never a token, an address or a password.')
      .addToggle((t) => t.setValue(this.plugin.settings.barShare).onChange(async (v) => {
        this.plugin.settings.barShare = v;
        await this.plugin.saveSettings();
        if (v) await this.plugin.publishToolbarLists();
      }));
    new Setting(containerEl)
      .setName('Folders your agent may read')
      .setDesc('Comma-separated, e.g. Daily, Meetings. Empty means none: the brief then tells '
        + 'your agent to read nothing. A note tagged #private is never read, whatever folder it is in.')
      .addText((t) => t.setPlaceholder('Daily, Meetings').setValue(this.plugin.settings.agentFolders)
        .onChange(async (v) => {
          this.plugin.settings.agentFolders = v;
          await this.plugin.saveSettings();
          if (this.plugin.settings.agentOn) await this.plugin.publishAgentContract();
        }));

    this.drawNoteSync(containerEl);

    // ROW 2376: every connected device and server. LAST, because the device
    // list arrives after the tab is drawn, and a section that grows above
    // other settings moves them out from under a person's pointer.
    new Setting(containerEl).setName('Connected devices and servers').setHeading();
    containerEl.createEl('p', {
      cls: 'setting-item-description',
      text: 'What the servers last recorded — not a live view. Graphite Sync '
        + 'asks a server only when you open this tab or press something, so '
        + 'it never shows a device as online or as typing.',
    });
    const servers = containerEl.createDiv();
    this.drawServers(servers);
    const devices = containerEl.createDiv();
    this.drawDevices(devices, 'asking');
    this.deviceList = this.plugin.fetchDevices().then(() => this.drawDevices(devices, 'answered'));
  }

  /* ROW 2375: whole-vault note sync, and the settings note. Since R-5255
   * (2026-10-10) notes travel over a CouchDB server, sealed on this device
   * under a passphrase, in a database of their own. A change to any of
   * these settings restarts note sync, so live sync follows what is set. */
  drawNoteSync(containerEl: HTMLElement) {
    const s = this.plugin.settings;
    const save = async () => {
      await this.plugin.saveSettings();
      this.plugin.restartNoteSync();
    };
    new Setting(containerEl).setName('Note sync').setHeading();
    new Setting(containerEl)
      .setName('Carry this vault between devices')
      .setDesc('Every ordinary file in this vault travels, sealed on this device first, so the server holds '
        + 'neither the notes nor their names. Use a new database, not the LiveSync one: it stays as it is. '
        + 'Hidden files, plugin settings and files over 50 MB never travel.')
      .addDropdown((d) => {
        for (const k of NOTE_SYNC_KINDS) d.addOption(k, NOTE_SYNC_LABELS[k]);
        d.setValue(s.noteSync).onChange(async (v) => {
          s.noteSync = (NOTE_SYNC_KINDS as readonly string[]).includes(v) ? v as NoteSyncKind : 'off';
          await save();
          this.display();
        });
      });
    if (s.noteSync === 'couchdb') {
      new Setting(containerEl)
        .setName('CouchDB server')
        .setDesc('The address of the server, with no database on the end.')
        .addText((t) => t.setPlaceholder('https://couch.example.com').setValue(s.couchUrl)
          .onChange(async (v) => { s.couchUrl = v.trim(); await save(); }));
      new Setting(containerEl)
        .setName('Database')
        .setDesc('Lowercase letters, digits and _ $ ( ) + - /, starting with a letter.')
        .addText((t) => t.setValue(s.couchDb).onChange(async (v) => { s.couchDb = v.trim(); await save(); }));
      new Setting(containerEl)
        .setName('CouchDB user')
        .addText((t) => t.setValue(s.couchUser).onChange(async (v) => { s.couchUser = v.trim(); await save(); }));
      new Setting(containerEl)
        .setName('CouchDB password')
        .setDesc('Kept on this device only. It is never written to the settings note.')
        .addText((t) => {
          t.inputEl.type = 'password';
          t.setValue(s.couchPassword).onChange(async (v) => { s.couchPassword = v; await save(); });
        });
      new Setting(containerEl)
        .setName('Encryption passphrase')
        .setDesc('Every note is sealed under this before it leaves this device. Type the same passphrase on '
          + 'each device; it is kept on this device only and never written to the settings note. '
          + 'Lose it and the notes in the database cannot be read.')
        .addText((t) => {
          t.inputEl.type = 'password';
          t.setValue(s.couchPassphrase).onChange(async (v) => { s.couchPassphrase = v; await save(); });
        });
      new Setting(containerEl)
        .setName('Live sync')
        .setDesc('Changes travel as they happen, rather than when you ask.')
        .addToggle((t) => t.setValue(s.liveSync).onChange(async (v) => { s.liveSync = v; await save(); }));
      new Setting(containerEl)
        .setName('Test the CouchDB server')
        .setDesc(this.plugin.noteSyncCheck?.detail ?? 'Signs in and looks for the database. Writes nothing.')
        .addButton((b) => b.setButtonText('Test').onClick(async () => {
          await this.plugin.testNoteSync();
          this.display();
        }));
      const last = this.plugin.noteSyncLast;
      new Setting(containerEl)
        .setName('Sync notes now')
        .setDesc(last ? last.charAt(0).toUpperCase() + last.slice(1)
          : 'Takes what arrived, sends what changed here, and says what moved.')
        .addButton((b) => b.setButtonText('Sync').onClick(async () => {
          await this.plugin.syncNotesNow({ loud: true });
          this.display();
        }));
    }
    new Setting(containerEl)
      .setName('Keep settings in a note')
      .setDesc(`Also keeps these settings in ${SETTINGS_NOTE_PATH}: change one there and it changes here, `
        + 'and the other way round. To set up another device, copy the note into its vault and turn this on '
        + 'there. The API token, the CouchDB password and the encryption passphrase are not written to it.')
      .addToggle((t) => t.setValue(s.configFile).onChange(async (v) => {
        await this.plugin.keepSettingsNote(v);
        this.display();
      }));
  }

  /** ROW 2376: one row per server, with when it last answered. */
  drawServers(el: HTMLElement) {
    el.empty();
    const list = this.plugin.serversOnThisMachine();
    if (this.plugin.offServer) {
      const here = this.plugin.onComputer;
      new Setting(el).setName(here ? 'Graphite on this computer' : 'Graphite on this device')
        .setDesc(here
          ? `The Graphite app on this computer, no server. ${serverCheckText(this.plugin.lastCheck)}`
          : this.plugin.lastCheck?.detail ?? 'Not looked at yet.')
        .addButton((b) => b.setButtonText('Check').onClick(async () => {
          await this.plugin.checkConnection(false);
          this.drawServers(el);
        }));
    } else if (list.length === 0) {
      new Setting(el).setName('Servers').setDesc('No server is set for this vault yet — fill in the Server URL above.');
      return;
    }
    for (const s of list) {
      const used = s.here
        ? `Used by this vault${s.vaults.length > 1 ? ` and ${s.vaults.filter((v) => v !== 'This vault').join(', ')}` : ''}.`
        : `Used by ${s.vaults.join(', ')}.`;
      const check = s.here ? this.plugin.lastCheck : this.plugin.serverChecks[serverKey(s.url)];
      const row = new Setting(el).setName(s.url).setDesc(`${used} ${serverCheckText(check)}`);
      row.addButton((b) => b.setButtonText('Check').onClick(async () => {
        if (s.here) await this.plugin.checkConnection(false);
        else await this.plugin.checkServer(s.url);
        this.drawServers(el);
      }));
    }
  }

  /** ROW 2376: one row per device or token the server holds for this
   *  vault's account, each with the server's own last-used stamp. */
  drawDevices(el: HTMLElement, phase: 'asking' | 'answered') {
    el.empty();
    const p = this.plugin;
    if (p.offServer) {
      new Setting(el).setName('Devices')
        .setDesc(`The Graphite app on this ${p.onComputer ? 'computer' : 'device'} has no account to sign in to, so there are no sign-ins to list.`);
      return;
    }
    if (!p.settings.serverUrl || !p.settings.token) {
      new Setting(el).setName('Devices').setDesc('Set the server URL and API token above to list the devices signed in to your account.');
      return;
    }
    if (phase === 'asking') {
      new Setting(el).setName('Devices').setDesc('Asking the server…');
      return;
    }
    if (!p.devices) {
      const why = p.devicesReport === 'old-server'
        ? 'this server is too old to list them'
        : p.devicesReport === 'refused'
          ? 'the server refused this vault\'s token'
          : 'the server could not be reached';
      new Setting(el).setName('Devices').setDesc(`The devices could not be listed: ${why}.`);
      return;
    }
    const host = p.settings.serverUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    new Setting(el).setName('Devices')
      .setDesc(`${host} holds ${p.devices.length} sign-in${p.devices.length === 1 ? '' : 's'} `
        + 'for your account, API tokens included. Each says when the server '
        + 'last saw it in use.');
    const now = Date.now();
    for (const d of p.devices) {
      const since = d.createdAt ? ` · since ${new Date(d.createdAt).toLocaleDateString()}` : '';
      new Setting(el)
        .setName(`${deviceName(d.userAgent)}${d.current ? ' — this vault\'s token' : ''}`)
        .setDesc(`${lastSeenText(d, now)}${since}`);
    }
  }

  /** NOTE PAGES: the rows of Notes-module choices, one per listed page folder. */
  pageRows!: HTMLElement;
  private pageModuleList: Promise<Array<{ id: string; label: string }>> = Promise.resolve([]);
  /** Settles when the module choices have been drawn into the rows. */
  pageModuleChoices: Promise<void> | null = null;

  /** Draw (or redraw) the module row of each listed page folder. The rows draw
   *  at once with the default, and the choices arrive after, as the capture
   *  inbox's do, so the tab opens offline. */
  private drawPageModules() {
    const rows = this.pageRows;
    rows.empty();
    const modules = this.plugin.settings.pageModules;
    const pending: Array<(list: Array<{ id: string; label: string }>) => void> = [];
    for (const folder of parseFolders(this.plugin.settings.pageFolders)) {
      new Setting(rows)
        .setName(`Notes module for ${folder}`)
        .setDesc('Where pages from this folder are filed. Pages already sent move when you change it.')
        .addDropdown((d) => {
          d.addOption('', 'First Notes module of the space (default)');
          d.setValue(modules[folder] ?? '');
          d.onChange(async (v) => {
            if (this.quiet) return;
            if (v) modules[folder] = v; else delete modules[folder];
            await this.plugin.saveSettings();
          });
          pending.push((list) => {
            for (const m of list) d.addOption(m.id, m.label);
            const chosen = modules[folder];
            if (chosen && !list.some((m) => m.id === chosen)) {
              d.addOption(chosen, 'A module that is no longer available');
            }
            this.setQuietly(() => d.setValue(chosen ?? ''));
          });
        });
    }
    this.pageModuleChoices = this.pageModuleList.then((list) => {
      for (const fill of pending) fill(list);
    }).catch(() => { /* offline: the rows keep the default */ });
  }

  /** 0.6.10 · A VALUE THE TAB SETS ITSELF IS NOT A CHOICE. Obsidian's setValue
   *  on a toggle or a dropdown runs the component's onChange, so the choices
   *  that arrive from the server (the binding, the inbox) used to run the very
   *  handlers a person's click runs: All my spaces, read as on, wrote itself
   *  back to the server, and a refusal redrew the tab, which read the binding
   *  and set the switch again - without end, on the one thread the window
   *  runs on. Every set made from code goes through here and handlers return
   *  early while it runs. */
  private quiet = 0;
  setQuietly(fn: () => void) {
    this.quiet++;
    try { fn(); } finally { this.quiet--; }
  }

  /** The capture inbox's choices, once the server has answered. */
  inboxChoices: Promise<void> | null = null;
  /** ROW 2376: the device list, once the server has answered. */
  deviceList: Promise<void> | null = null;
  /** OC2: the vault's-space choices, once the server has answered. */
  bindingChoices: Promise<void> | null = null;
}
