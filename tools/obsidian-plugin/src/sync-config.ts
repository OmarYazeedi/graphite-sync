/* ══ ROW 2375 · THE SETTINGS NOTE ═══════════════════════════════════════
 *
 * Omar 2026-10-06 (requests R-4650): Graphite Sync "will also be able to
 * read and store all of its config in an md file for easy config and
 * restore . the md file is in addtionn to the normal ui".
 *
 * So the settings a person chooses live in a note as properties, one per
 * line, and the settings screen and the note are two faces of one set of
 * values: change either and the other follows. The note is an ordinary
 * note, so Obsidian's Properties panel edits it too, and it travels to a new
 * device like any other.
 *
 * WHAT IT CARRIES is declared once, below, with each key's kind — and what
 * it does NOT carry is declared too, each with its reason, so the next key
 * added to the settings has to be put on one list or the other (the plugin
 * test holds the two lists against the defaults).
 */

export const SETTINGS_NOTE_PATH = 'Graphite/Sync settings.md';

type Kind =
  | { kind: 'bool' }
  | { kind: 'text' }
  | { kind: 'url' }
  | { kind: 'choice'; options: readonly string[] };

export interface NoteKey {
  key: string;
  kind: Kind;
  /** What the key is, in the words the note itself prints beside it. */
  label: string;
}

/** Every setting a person chooses, in the order the note lists them. */
export const NOTE_KEYS: readonly NoteKey[] = [
  { key: 'serverUrl', kind: { kind: 'url' }, label: 'Graphite server' },
  { key: 'layout', kind: { kind: 'choice', options: ['folder', 'single'] }, label: 'How a pulled space lands' },
  { key: 'hideIds', kind: { kind: 'bool' }, label: 'Hide sync ids' },
  { key: 'autoPush', kind: { kind: 'bool' }, label: 'Auto-push on save' },
  { key: 'captureAnyTagged', kind: { kind: 'bool' }, label: 'Capture any tagged line as a note' },
  { key: 'captureTags', kind: { kind: 'text' }, label: 'Tags that capture a line' },
  { key: 'censusOn', kind: { kind: 'bool' }, label: 'Send the vault census' },
  { key: 'agentOn', kind: { kind: 'bool' }, label: 'Publish the agent contract' },
  { key: 'agentFolders', kind: { kind: 'text' }, label: 'Folders the agent may read' },
  { key: 'noteSync', kind: { kind: 'choice', options: ['off', 'couchdb'] }, label: 'Note sync' },
  { key: 'couchUrl', kind: { kind: 'url' }, label: 'CouchDB server' },
  { key: 'couchDb', kind: { kind: 'text' }, label: 'CouchDB database' },
  { key: 'couchUser', kind: { kind: 'text' }, label: 'CouchDB user' },
  { key: 'liveSync', kind: { kind: 'bool' }, label: 'Live sync' },
];

/** SECRETS: never written to the note, and not read from it. The note
 *  syncs to every device and his vaults sit in OneDrive, so a secret in it
 *  is a secret in places nobody chose. Ruled by Omar 2026-10-10 (requests
 *  R-5257): "Never: the note carries every other setting, and the two or
 *  three secrets are typed on each new device". */
export const SECRET_KEYS: readonly string[] = ['token', 'couchPassword', 'couchPassphrase'];

/** Kept by the plugin, not chosen by a person — each with why it stays out. */
export const KEPT_OUT: Readonly<Record<string, string>> = {
  vaultId: 'the vault identity: a copied note must not make two vaults one to the server',
  configFile: 'the switch for this note itself',
  files: 'which notes are synced spaces, kept by the plugin as it pulls',
  ticks: 'the last agreed state of each captured line',
  routingList: 'the plugin copy of the routing list',
  routeCache: 'the spaces the route picker last saw',
  routeRecent: 'the spaces most recently routed to',
  noteSyncState: 'what note sync last agreed with its server, kept per device',
};

const KNOWN = new Map(NOTE_KEYS.map((k) => [k.key, k]));

/* A string is written bare when YAML (and Obsidian) would read it back as
 * the same string, and JSON-quoted otherwise. */
const BARE = /^[A-Za-z0-9_./@+-][A-Za-z0-9 _./:@,+()-]*$/;
function writeValue(v: unknown): string {
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  const s = String(v ?? '');
  if (s === '') return '""';
  if (BARE.test(s) && !s.includes(': ') && !/^(true|false|null|yes|no|~)$/i.test(s) && s === s.trim()) return s;
  return JSON.stringify(s);
}

const DEFAULT_BODY = [
  '# Graphite Sync settings',
  '',
  'This note holds this vault’s Graphite Sync settings, as the properties above. '
    + 'Change one here and the plugin takes it; change one in the settings screen and this note follows.',
  '',
  'To set up another device, copy this note to the same place in that vault, then turn on '
    + '“Keep settings in a note” in the Graphite Sync settings, or run '
    + '“Read settings from the settings note”.',
  '',
  'The API token, the CouchDB password and the encryption passphrase are not written here. '
    + 'Enter them in the settings screen on each device.',
  '',
].join('\n');

/** Where the frontmatter is: the first line is `---`, and the next `---`
 *  closes it. Null when the note has none. */
function frontmatter(lines: string[]): { from: number; to: number } | null {
  if (lines[0]?.trim() !== '---') return null;
  for (let i = 1; i < lines.length; i++) if (lines[i].trim() === '---') return { from: 0, to: i };
  return null;
}

/** The note for these settings. `previous` keeps whatever the person wrote
 *  below the properties, and any property that is not a setting. */
export function settingsNoteText(settings: Record<string, unknown>, previous: string | null = null): string {
  const props = NOTE_KEYS.map((k) => `${k.key}: ${writeValue(settings[k.key])}`);
  if (previous === null) return ['---', ...props, '---', DEFAULT_BODY].join('\n');
  const lines = previous.split('\n');
  const fm = frontmatter(lines);
  if (!fm) return ['---', ...props, '---', previous].join('\n');
  // Properties that are not settings (his own, or Obsidian ones like tags)
  // stay, after ours.
  const foreign = lines.slice(1, fm.to).filter((l) => {
    const m = /^([A-Za-z_][\w-]*)\s*:/.exec(l);
    return !m || (!KNOWN.has(m[1]) && !SECRET_KEYS.includes(m[1]) && !(m[1] in KEPT_OUT));
  });
  return ['---', ...props, ...foreign, ...lines.slice(fm.to)].join('\n');
}

export interface NoteReading {
  /** The settings the note sets, already of the right type. */
  values: Record<string, string | boolean>;
  /** One sentence per refused line, with its line number. */
  problems: string[];
}

function readValue(raw: string): string {
  const t = raw.trim();
  if (t.startsWith('"')) {
    try { return String(JSON.parse(t)); } catch { return t; }
  }
  if (t.length >= 2 && t.startsWith('\'') && t.endsWith('\'')) return t.slice(1, -1).replace(/''/g, '\'');
  return t;
}

/** The settings a note sets. A line that is wrong is refused with its line
 *  number and the setting keeps its value; the rest of the note applies. */
export function readSettingsNote(text: string): NoteReading {
  const values: Record<string, string | boolean> = {};
  const problems: string[] = [];
  const lines = text.split('\n');
  const fm = frontmatter(lines);
  if (!fm) {
    problems.push('The note has no properties block (a --- line, the settings, and a --- line) at its top.');
    return { values, problems };
  }
  for (let i = fm.from + 1; i < fm.to; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    // The rest of a property of his own that runs over several lines (a
    // list of tags or aliases) — never one of ours, which are one line each.
    if (/^\s/.test(line) || line.startsWith('-')) continue;
    const m = /^([A-Za-z_][\w-]*)\s*:(.*)$/.exec(line);
    if (!m) { problems.push(`Line ${i + 1}: not a setting line (name: value).`); continue; }
    const [, key, raw] = m;
    if (SECRET_KEYS.includes(key)) {
      problems.push(`Line ${i + 1}: ${key} is a secret and is not read from a note — enter it in the settings screen.`);
      continue;
    }
    const spec = KNOWN.get(key);
    if (!spec) {
      if (key in KEPT_OUT) problems.push(`Line ${i + 1}: ${key} is not read from a note — it is ${KEPT_OUT[key]}.`);
      // Any other property is his own (tags, aliases) and is left alone.
      continue;
    }
    const v = readValue(raw);
    switch (spec.kind.kind) {
      case 'bool':
        if (v === 'true' || v === 'false') values[key] = v === 'true';
        else problems.push(`Line ${i + 1}: ${key} is true or false, not "${v}".`);
        break;
      case 'choice':
        if (spec.kind.options.includes(v)) values[key] = v;
        else problems.push(`Line ${i + 1}: ${key} is one of ${spec.kind.options.join(', ')}, not "${v}".`);
        break;
      case 'url':
        if (v === '' || /^https?:\/\/\S+$/.test(v)) values[key] = v;
        else problems.push(`Line ${i + 1}: ${key} is an address starting http:// or https://, not "${v}".`);
        break;
      default:
        values[key] = v;
    }
  }
  return { values, problems };
}

/** Do these settings say the same as the note would? */
export function noteMatches(settings: Record<string, unknown>, text: string): boolean {
  const { values } = readSettingsNote(text);
  return NOTE_KEYS.every((k) => (k.key in values) && values[k.key] === settings[k.key]);
}
