/* ══ THIS COMPUTER · FINDING THE GRAPHITE APP ══════════════════════════════
 *
 * Omar, 2026-11-04: "the plugin should be able to read the device own
 * graphite database". Almost every store user keeps their spaces on a
 * device, or shares them between devices through a relay a server cannot
 * read, so there is no server for this plugin to ask. The Graphite desktop
 * app can open a door on this computer (Settings, Data and server) and the
 * plugin asks it the same questions it asks a server.
 *
 * HOW IT IS FOUND, WITH NOTHING TO COPY. When the door opens the app writes a
 * small file in its own folder: the port, and a key that is new every time
 * the door opens. The plugin reads that file. The address is not in it — the
 * plugin always dials 127.0.0.1 — so a file somebody planted can only make it
 * talk to this computer.
 *
 * IMPORTS NOTHING, so the test suite can read it without Obsidian.
 */

/** The file the app writes, by this name, in its own folder. */
export const DOOR_FILE = 'plugin-door.json';

/** An environment variable that names the file outright. For a build of the
 *  app that keeps its files somewhere else (the one a developer looks at),
 *  and for the tests; nothing in the product sets it. */
export const DOOR_ENV = 'GRAPHITE_PLUGIN_DOOR';

export interface Door {
  port: number;
  key: string;
}

/** Why there is no door to talk to, in the terms the sentences use. */
export type DoorWhy =
  | 'phone'      // Obsidian on a phone or tablet: no app, no files to read
  | 'no-file'    // the app never opened the door, or has been closed cleanly
  | 'unreadable' // a file is there and is not one of ours
  | 'refused';   // a file is there and nothing answers: the app is not running

/** Where the file is, by platform, in the order to look. `env` is the
 *  process environment and `platform` is `process.platform`. */
export function doorFileCandidates(
  env: Record<string, string | undefined>,
  platform: string,
  join: (...parts: string[]) => string,
): string[] {
  const out: string[] = [];
  if (env[DOOR_ENV]) out.push(env[DOOR_ENV] as string);
  const home = env.HOME || env.USERPROFILE || '';
  if (platform === 'win32') {
    const roaming = env.APPDATA || (home ? join(home, 'AppData', 'Roaming') : '');
    if (roaming) out.push(join(roaming, 'findgraphite.com', 'Graphite', DOOR_FILE));
  } else if (platform === 'darwin') {
    if (home) {
      // The sandboxed app keeps its files in its container; an unsandboxed
      // one in the library itself.
      out.push(join(home, 'Library', 'Containers', 'com.findgraphite.app', 'Data',
        'Library', 'Application Support', 'com.findgraphite.app', DOOR_FILE));
      out.push(join(home, 'Library', 'Application Support', 'com.findgraphite.app', DOOR_FILE));
    }
  } else {
    const data = env.XDG_DATA_HOME || (home ? join(home, '.local', 'share') : '');
    if (data) out.push(join(data, 'com.findgraphite.app', DOOR_FILE));
  }
  return out;
}

/** The door that the text of a file describes, or null when it is not one. The port is
 *  held to the range a program may listen on and the key to a plausible
 *  length, so a file that is something else is "unreadable" rather than a
 *  request sent somewhere odd. */
export function readDoor(text: string): Door | null {
  let j: any;
  try { j = JSON.parse(text); } catch { return null; }
  if (!j || j.v !== 1 || j.app !== 'Graphite') return null;
  const port = j.port;
  const key = j.key;
  if (!Number.isInteger(port) || port < 1024 || port > 65535) return null;
  if (typeof key !== 'string' || !/^[A-Za-z0-9_-]{32,128}$/.test(key)) return null;
  return { port, key };
}

/** The address the plugin dials. Never taken from the file. */
export function doorBase(door: Door): string {
  return `http://127.0.0.1:${door.port}`;
}

export type DoorLook = { ok: true; door: Door } | { ok: false; why: DoorWhy };

/** Look for the door. `read` returns the text of a file or null when it is not
 *  there. The first candidate that exists decides. */
export function findDoor(
  candidates: string[],
  read: (path: string) => string | null,
): DoorLook {
  for (const path of candidates) {
    const text = read(path);
    if (text === null) continue;
    const door = readDoor(text);
    return door ? { ok: true, door } : { ok: false, why: 'unreadable' };
  }
  return { ok: false, why: 'no-file' };
}

/** What a person is told. Plain, and saying what to do. */
export function doorSentence(why: DoorWhy): string {
  switch (why) {
    case 'phone':
      return 'This computer needs Obsidian on a desktop, with the Graphite app on the same computer. '
        + 'On a phone, use Server instead.';
    case 'no-file':
      return 'The Graphite app has not been set up to be read on this computer. Open it, go to '
        + 'Settings, Data and server, and turn on "Let the notes plugin read Graphite on this computer".';
    case 'unreadable':
      return 'The file Graphite leaves for this plugin could not be read. Turn the setting off and on '
        + 'again in the Graphite app (Settings, Data and server).';
    case 'refused':
      return 'The Graphite app is not running. Open it and try again.';
  }
}

/** The short form for the status bar. */
export function doorShort(why: DoorWhy): string {
  return why === 'phone' ? 'needs the desktop app'
    : why === 'refused' ? 'Graphite is not running'
    : why === 'no-file' ? 'not turned on in Graphite'
    : 'Graphite file unreadable';
}
