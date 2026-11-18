/* ── a notebook page is its own file (R-8336) ─────────────────────────────
 *
 * The server's folder export gives every page of a Graphite notebook a file
 * of its own, `<space>/<notebook note>/<section>/<title>.md`, with a small
 * frontmatter (`gr_type: notebook_page`, `gr_id`, `title`, `section`, ...) and
 * then the page's text verbatim (apps/api/src/spaces/notebook-page-file.ts).
 * The file NAME is derived from the title and the FOLDER from the section, so
 * in the vault a rename is a title change and a move between folders is a
 * section change. This file turns the vault's rename into the two frontmatter
 * lines that say so; pushing the file then carries it to Graphite, and the
 * links to the page are rewritten on both sides (Obsidian's fileManager in the
 * vault, the server's rename in Graphite).
 *
 * Imports nothing: no `obsidian`, no `@codemirror/*`, so the tests load it
 * straight from source as well as through the bundle. */

export const PAGE_FILE_TYPE = 'notebook_page';

export const dirOf = (path: string): string => {
  const i = path.lastIndexOf('/');
  return i < 0 ? '' : path.slice(0, i);
};

/** The file's name without its `.md`. */
export const baseOf = (path: string): string => {
  const name = path.slice(path.lastIndexOf('/') + 1);
  return name.replace(/\.md$/i, '');
};

/** The frontmatter block of [text] and where its body starts; null when none. */
function front(text: string): { lines: string[]; eol: string; rest: string } | null {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  if (!text.startsWith(`---${eol}`)) return null;
  const end = text.indexOf(`${eol}---`, 3);
  if (end < 0) return null;
  const after = end + eol.length + 3;
  if (after < text.length && !text.startsWith(eol, after)) return null;
  return { lines: text.slice(3 + eol.length, end).split(eol), eol, rest: text.slice(after) };
}

const keyOf = (line: string): string => {
  const i = line.indexOf(':');
  return i > 0 ? line.slice(0, i).trim() : '';
};

const quote = (s: string): string => JSON.stringify(s);

/** The raw value of a frontmatter key, or undefined. */
function raw(text: string, key: string): string | undefined {
  const f = front(text);
  if (!f) return undefined;
  const line = f.lines.find((l) => keyOf(l) === key);
  return line === undefined ? undefined : line.slice(line.indexOf(':') + 1).trim();
}

const unquote = (v: string | undefined): string | null => {
  if (v === undefined) return null;
  try {
    const x = JSON.parse(v);
    return typeof x === 'string' ? x : null;
  } catch {
    return null;
  }
};

/** Whether [text] is a notebook page's file. */
export const isPageText = (text: string): boolean => raw(text, 'gr_type') === PAGE_FILE_TYPE;

/** The note a page file IS, or null. */
export const pageIdOf = (text: string): string | null =>
  isPageText(text) ? (raw(text, 'gr_id') ?? null) : null;

/** The title and section a page file says (section null when it has none). */
export function pageFieldsOf(text: string): { title: string | null; section: string | null } {
  return { title: unquote(raw(text, 'title')), section: unquote(raw(text, 'section')) };
}

/**
 * The directory of the notebook a page file at [path] is in: one level up when
 * the file says it has a section (the section is the folder it sits in), else
 * the directory itself.
 */
export function notebookDirOf(path: string, text: string): string {
  const here = dirOf(path);
  return pageFieldsOf(text).section ? dirOf(here) : here;
}

/** [text] with its `title:` and/or `section:` lines set; section null removes it.
 *  Everything else, the body included, is left byte for byte. */
export function setPageFields(
  text: string, set: { title?: string; section?: string | null },
): string {
  const f = front(text);
  if (!f) return text;
  const lines = [...f.lines];
  const put = (key: string, value: string | null, after: string) => {
    const at = lines.findIndex((l) => keyOf(l) === key);
    if (value === null) {
      if (at >= 0) lines.splice(at, 1);
      return;
    }
    const line = `${key}: ${quote(value)}`;
    if (at >= 0) { lines[at] = line; return; }
    const prev = lines.findIndex((l) => keyOf(l) === after);
    lines.splice(prev >= 0 ? prev + 1 : lines.length, 0, line);
  };
  if (set.title !== undefined) put('title', set.title, 'instance_name');
  if (set.section !== undefined) put('section', set.section, 'title');
  return `---${f.eol}${lines.join(f.eol)}${f.eol}---${f.rest}`;
}

export interface PageRename {
  title?: string;
  section?: string | null;
}

/**
 * What a vault rename of the page file from [from] to [to] says about the page.
 *
 *  • A different file name is a new title.
 *  • A different folder is a different section: the notebook's own folder is no
 *    section, a folder directly inside it is that section. A move anywhere else
 *    (out of the notebook, or a level deeper) names no section, so the section
 *    is left as it was.
 *
 * Null when the rename changes neither.
 */
export function pageRenameOf(from: string, to: string, notebookDir: string): PageRename | null {
  const out: PageRename = {};
  if (baseOf(from) !== baseOf(to)) out.title = baseOf(to);
  const was = dirOf(from);
  const now = dirOf(to);
  if (was !== now) {
    if (now === notebookDir) out.section = null;
    else if (dirOf(now) === notebookDir) out.section = now.slice(now.lastIndexOf('/') + 1);
  }
  return out.title === undefined && out.section === undefined ? null : out;
}
