var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  ADDABLE_MODULE_TYPES: () => ADDABLE_MODULE_TYPES,
  BAR_BUTTONS: () => BAR_BUTTONS,
  COUCH_DB_NAME: () => COUCH_DB_NAME,
  CouchClient: () => CouchClient,
  CouchDocSync: () => CouchDocSync,
  CouchError: () => CouchError,
  CouchNoteTransport: () => CouchNoteTransport,
  DOOR_ENV: () => DOOR_ENV,
  DUE_TIMES: () => DUE_TIMES,
  INLINE_SEAL_MAX: () => INLINE_SEAL_MAX,
  KEPT_OUT: () => KEPT_OUT,
  LIVE_BACKOFF_FIRST_MS: () => LIVE_BACKOFF_FIRST_MS,
  LIVE_BACKOFF_MAX_MS: () => LIVE_BACKOFF_MAX_MS,
  LiveFollower: () => LiveFollower,
  MERGE_MAX_CELLS: () => MERGE_MAX_CELLS,
  MIRROR_INDEX: () => MIRROR_INDEX,
  MOBILE_TARGET_PX: () => MOBILE_TARGET_PX,
  NOTE_DOC_PREFIX: () => NOTE_DOC_PREFIX,
  NOTE_KDF_ITERATIONS: () => NOTE_KDF_ITERATIONS,
  NOTE_KEYS: () => NOTE_KEYS,
  NOTE_SYNC_KINDS: () => NOTE_SYNC_KINDS,
  NOTE_SYNC_MAX_BYTES: () => NOTE_SYNC_MAX_BYTES,
  NoteKey: () => NoteKey,
  NoteSyncEngine: () => NoteSyncEngine,
  NoteSyncRefusal: () => NoteSyncRefusal,
  PARAMS_DOC_ID: () => PARAMS_DOC_ID,
  PRIORITIES: () => PRIORITIES,
  PULL_PAGE: () => PULL_PAGE,
  Pacer: () => Pacer,
  SEAL_ATTACHMENT: () => SEAL_ATTACHMENT,
  SECRET_KEYS: () => SECRET_KEYS,
  SETTINGS_NOTE_PATH: () => SETTINGS_NOTE_PATH,
  TOOLBAR_LISTS_PATH: () => TOOLBAR_LISTS_PATH,
  addDays: () => addDays,
  addTag: () => addTag,
  agentBriefNote: () => agentBriefNote,
  ago: () => ago,
  approvedText: () => approvedText,
  asServerSpelling: () => asServerSpelling,
  asTaskLine: () => asTaskLine,
  baseOf: () => baseOf,
  buildLists: () => buildLists,
  buildRoutes: () => buildRoutes,
  captureCandidates: () => captureCandidates,
  censusOf: () => censusOf,
  cleanTag: () => cleanTag,
  conflictCopyPath: () => conflictCopyPath,
  contractProblems: () => contractProblems,
  dayLabel: () => dayLabel,
  default: () => GraphitePlugin,
  destinationOf: () => destinationOf,
  deviceName: () => deviceName,
  dirOf: () => dirOf,
  doorFileCandidates: () => doorFileCandidates,
  dueChips: () => dueChips,
  dueValue: () => dueValue,
  emptyNoteSyncState: () => emptyNoteSyncState,
  filterTargets: () => filterTargets,
  finalised: () => finalised,
  findDoor: () => findDoor,
  fingerprint: () => fingerprint,
  frontmatterFor: () => frontmatterFor,
  groupServers: () => groupServers,
  hasRoutingHeading: () => hasRoutingHeading,
  inNoteSyncScope: () => inNoteSyncScope,
  inPageFolder: () => inPageFolder,
  insertBlock: () => insertBlock,
  isBelow: () => isBelow,
  isCaptured: () => isCaptured,
  isMarkerHeaderCell: () => isMarkerHeaderCell,
  isPage: () => isPage,
  isPageText: () => isPageText,
  isTaskLine: () => isTaskLine,
  isToolbarFile: () => isToolbarFile,
  keepFreeform: () => keepFreeform,
  lastSeenText: () => lastSeenText,
  listStart: () => listStart,
  listTargets: () => listTargets,
  listsFile: () => listsFile,
  lookForMirror: () => lookForMirror,
  lpHiddenRanges: () => lpHiddenRanges,
  mergeLines: () => mergeLines,
  mergeable: () => mergeable,
  mintVaultId: () => mintVaultId,
  mirrorSentence: () => mirrorSentence,
  mirrorShort: () => mirrorShort,
  monthGrid: () => monthGrid,
  monthTitle: () => monthTitle,
  newParams: () => newParams,
  nextTaskLine: () => nextTaskLine,
  noteLiveBadge: () => noteLiveBadge,
  noteMatches: () => noteMatches,
  noteSpace: () => noteSpace,
  notebookDirOf: () => notebookDirOf,
  openFile: () => openFile,
  openParams: () => openParams,
  pageFieldsOf: () => pageFieldsOf,
  pageIdOf: () => pageIdOf,
  pageModuleFor: () => pageModuleFor,
  pageRenameOf: () => pageRenameOf,
  parseFolders: () => parseFolders,
  pickerRoles: () => pickerRoles,
  priorityChoices: () => priorityChoices,
  proposalLine: () => proposalLine,
  proposalsIn: () => proposalsIn,
  readDoor: () => readDoor,
  readDue: () => readDue,
  readField: () => readField,
  readHandshake: () => readHandshake,
  readListsFile: () => readListsFile,
  readProposal: () => readProposal,
  readSettingsNote: () => readSettingsNote,
  recordAt: () => recordAt,
  routeNamed: () => routeNamed,
  sameLists: () => sameLists,
  sealFile: () => sealFile,
  serverCheckText: () => serverCheckText,
  serverKey: () => serverKey,
  setField: () => setField,
  setPageFields: () => setPageFields,
  settingsNoteText: () => settingsNoteText,
  shiftMonth: () => shiftMonth,
  splitLines: () => splitLines,
  stampCaptured: () => stampCaptured,
  suggestedTarget: () => suggestedTarget,
  targetLabel: () => targetLabel,
  targetToken: () => targetToken,
  taskModuleOf: () => taskModuleOf,
  tickLines: () => tickLines,
  validTime: () => validTime,
  weekday: () => weekday
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");
var import_state = require("@codemirror/state");

// src/lp-ids.ts
var LP_ID_RE = new RegExp(
  "(?: ?\\| ?lp: [A-Za-z0-9]+(?: \\^[A-Za-z0-9-]+)?)|(?:<!-- lp: \\S+ -->)|(?: ?\\| ?gr: [A-Za-z0-9]+(?: \\^[A-Za-z0-9-]+)?(?=[ \\t]*(?:\\r?\\n|$)))|(?:<!-- gr: \\S+ -->)",
  "g"
);
var FF_STARTS = ["<!-- gr-freeform:start -->", "<!-- lp-freeform:start -->"];
var FF_ENDS = ["<!-- gr-freeform:end -->", "<!-- lp-freeform:end -->"];
function pipePositions(line) {
  const out = [];
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "\\") {
      i++;
      continue;
    }
    if (line[i] === "|") out.push(i);
  }
  return out;
}
function isMarkerHeaderCell(cell) {
  const t = cell.trim();
  return t === "lp" || t === "gr";
}
function isLpHeader(line) {
  const pipes = pipePositions(line);
  if (pipes.length < 2) return false;
  const last = line.slice(pipes[pipes.length - 2] + 1, pipes[pipes.length - 1]);
  return isMarkerHeaderCell(last);
}
function isTableSeparator(line) {
  return /^\s*\|[\s\-:|]+\|\s*$/.test(line) && line.includes("-");
}
function lastCellSpan(line) {
  const pipes = pipePositions(line);
  if (pipes.length < 2) return null;
  return { from: pipes[pipes.length - 2] + 1, to: pipes[pipes.length - 1] + 1 };
}
function lpHiddenRanges(doc) {
  const out = [];
  for (const m of doc.matchAll(LP_ID_RE)) {
    if (m.index === void 0) continue;
    out.push({ from: m.index, to: m.index + m[0].length });
  }
  const lines = [];
  let at = 0;
  for (const text of doc.split("\n")) {
    lines.push({ text, from: at });
    at += text.length + 1;
  }
  for (let i = 0; i < lines.length; i++) {
    if (!isLpHeader(lines[i].text)) continue;
    if (i + 1 >= lines.length || !isTableSeparator(lines[i + 1].text)) continue;
    for (let j = i; j < lines.length; j++) {
      const line = lines[j];
      if (!/^\s*\|/.test(line.text)) break;
      const span = lastCellSpan(line.text);
      if (!span) continue;
      out.push({ from: line.from + span.from, to: line.from + span.to });
    }
  }
  out.sort((a, b) => a.from - b.from || a.to - b.to);
  const merged = [];
  for (const r of out) {
    const prev = merged[merged.length - 1];
    if (prev && r.from < prev.to) {
      prev.to = Math.max(prev.to, r.to);
      continue;
    }
    merged.push({ ...r });
  }
  return merged;
}

// ../../apps/api/src/spaces/vault-anchor.ts
var ANCHORED_IN = {
  tasks: "TASKS",
  reminders: "REMINDERS",
  "checklist-items": "CHECKLISTS",
  recipes: "RECIPES"
};
var LP_TAIL = /\s*\|\s*(?:gr|lp):\s*([A-Za-z0-9]+)(?:\s+\^[A-Za-z0-9-]+)?\s*$/;
var PROPOSAL_KEY = /^p_[A-Za-z0-9]{4,24}$/;
var PROPOSAL_TAIL = /\s*\|\s*(?:gr|lp):\s*(p_[A-Za-z0-9]{4,24})\s*$/;
var ROUTE_TOKEN = /(^|\s)(?:>>|»|≫|》)\s*([^#]*?)\s*(?=\s#|$)/;
function readRouteToken(words) {
  const m = ROUTE_TOKEN.exec(words);
  if (!m || m.index === void 0) return { token: null, rest: words };
  const said = m[2].trim();
  const rest = (words.slice(0, m.index) + m[1] + words.slice(m.index + m[0].length)).replace(/\s+/g, " ").trim();
  if (!said || said === "?") return { token: { space: "", module: null }, rest };
  const slash = said.lastIndexOf(" / ");
  return {
    token: slash > 0 ? { space: said.slice(0, slash).trim(), module: said.slice(slash + 3).trim() || null } : { space: said, module: null },
    rest
  };
}
function routeTokenText(space, module2) {
  return module2 ? `>> ${space} / ${module2}` : `>> ${space}`;
}

// ../../apps/api/src/spaces/tag-hierarchy.ts
var TAG_SEPARATOR = "/";
function normaliseTagName(raw2) {
  return raw2.trim().replace(/^#/, "").split(TAG_SEPARATOR).map((s) => s.trim()).filter((s) => s.length > 0).join(TAG_SEPARATOR);
}

// ../../apps/api/src/spaces/vault-tags.ts
var VAULT_TAG = /(^|\s)#([\p{L}\p{N}_/-]+)/gu;
var HAS_A_LETTER = /[\p{L}_]/u;
var isTagToken = (slug) => HAS_A_LETTER.test(slug);
function parseVaultTags(text) {
  const tags = [];
  const cleaned = text.replace(VAULT_TAG, (all, pre, slug) => {
    if (!isTagToken(slug)) return all;
    tags.push(normaliseTagName(slug));
    return pre;
  }).replace(/\s{2,}/g, " ").trim().replace(/\\#([\p{L}\p{N}_/-]+)/gu, (all, slug) => isTagToken(slug) ? "#" + slug : all);
  return { text: cleaned, tags };
}
function frontmatterTags(text) {
  return frontmatterList(text, "tags")?.values;
}
function frontmatterLines(text) {
  if (!text.trimStart().startsWith("---")) return void 0;
  const start = text.indexOf("---");
  const end = text.indexOf("\n---", start + 3);
  if (end === -1) return void 0;
  const first = text.slice(0, start).split("\n").length;
  return { lines: text.slice(start + 3, end).split("\n"), first };
}
function frontmatterList(text, key) {
  const fm = frontmatterLines(text);
  if (!fm) return void 0;
  const { lines } = fm;
  const at = lines.findIndex((l) => l.startsWith(`${key}:`));
  if (at === -1) return void 0;
  const line = fm.first + at;
  const clean = (v) => v.trim().replace(/^["']|["']$/g, "").replace(/^#/, "").trim();
  const inline = lines[at].slice(key.length + 1).trim();
  if (inline) {
    return { values: inline.replace(/^\[|\]$/g, "").split(",").map(clean).filter(Boolean), line };
  }
  const out = [];
  for (let i = at + 1; i < lines.length; i++) {
    const m = /^\s+-\s*(.*)$/.exec(lines[i]);
    if (!m) break;
    const v = clean(m[1]);
    if (v) out.push(v);
  }
  return { values: out, line };
}

// ../../apps/api/src/spaces/vault-route.ts
function readHeading(raw2) {
  const text = raw2.replace(/^\s*#{1,6}\s+/, "");
  const { token, rest } = readRouteToken(text);
  const tags = [];
  const words = rest.replace(VAULT_TAG, (all, pre, slug) => {
    if (!isTagToken(slug)) return all;
    tags.push(slug);
    return pre;
  }).replace(/\s+/g, " ").trim();
  return { words, token, tags };
}
function sectionNamesModule(section) {
  if (!section?.trim()) return false;
  const { token } = readHeading(section);
  return !!token?.space && !!token.module;
}

// src/note-lines.ts
function bodyLines(lines) {
  const out = [];
  let i = 0;
  if (lines[0]?.trim() === "---") {
    const end = lines.findIndex((l, n) => n > 0 && l.trim() === "---");
    if (end > 0) i = end + 1;
  }
  let fence = null;
  for (; i < lines.length; i++) {
    const t = lines[i].trim();
    const f = /^(```|~~~)/.exec(t);
    if (f) {
      if (fence === null) fence = f[1];
      else if (t.startsWith(fence)) fence = null;
      continue;
    }
    if (fence !== null) continue;
    out.push(i);
  }
  return out;
}

// src/proposals.ts
var CHECKBOX = /^(\s*[-*+]\s+)\[( |x|X)\](\s+)([\s\S]*)$/;
var ITALIC = /^([*_])(?![*_])(\S(?:[\s\S]*?\S)?)\1(?![*_])([\s\S]*)$/;
var STRAY = /(^|[^*\\])\*(?!\*)|(^|\s)_(?!_)|(?<!_)_(\s|$)/;
function split(rest) {
  const bar = rest.indexOf(" | ");
  return bar < 0 ? { words: rest, fields: "" } : { words: rest.slice(0, bar), fields: rest.slice(bar) };
}
function readProposal(line) {
  const m = PROPOSAL_TAIL.exec(line);
  if (!m || m.index === void 0) return null;
  const key = m[1];
  const cb = CHECKBOX.exec(line.slice(0, m.index));
  if (!cb) {
    return { key, state: "unreadable", reason: "a proposal is a checkbox line, and this is not one" };
  }
  const { words } = split(cb[4]);
  if (!words.trim()) return { key, state: "unreadable", reason: "it says nothing" };
  const ticked = cb[2] !== " ";
  const italic = ITALIC.exec(words);
  if (italic) {
    if (STRAY.test(italic[3])) {
      return { key, state: "unreadable", reason: "an asterisk is left over \u2014 finish the edit" };
    }
    return ticked ? { key, state: "approved", gesture: "tick" } : { key, state: "proposed" };
  }
  if (STRAY.test(words)) {
    return { key, state: "unreadable", reason: "half italic \u2014 finish removing the asterisks, or put them back" };
  }
  return { key, state: "approved", gesture: "upright" };
}
function approvedText(line) {
  const m = PROPOSAL_TAIL.exec(line);
  const body = m && m.index !== void 0 ? line.slice(0, m.index) : line;
  const cb = CHECKBOX.exec(body);
  if (!cb) return body.replace(/\s+$/, "");
  const { words, fields } = split(cb[4]);
  const it = ITALIC.exec(words);
  const plain = it ? `${it[2]}${it[3]}` : words;
  return `${cb[1]}[ ]${cb[3]}${plain}${fields}`.replace(/\s+$/, "");
}
function finalised(line, id) {
  return `${approvedText(line)} | lp: ${id}`;
}
function proposalLine(words, key, indent = "") {
  if (!PROPOSAL_KEY.test(key)) throw new Error(`not a proposal key: ${key}`);
  const { words: w, fields } = split(words.trim());
  return `${indent}- [ ] *${w.trim()}*${fields} | lp: ${key}`;
}
function proposalsIn(lines) {
  const out = [];
  for (const i of bodyLines(lines)) {
    const p = readProposal(lines[i]);
    if (p) out.push({ ...p, line: i });
  }
  return out;
}
function lineOfKey(lines, key) {
  return lines.findIndex((l) => PROPOSAL_TAIL.exec(l)?.[1] === key);
}

// src/routing.ts
function routable(spaces) {
  return spaces.filter((s) => !s.personId && s.status !== "ARCHIVED" && s.status !== "DELETED" && s.myRole !== "VIEWER");
}
var lc = (s) => s.toLowerCase();
function buildRoutes(spaces, recent = []) {
  const byId = new Map(spaces.map((s) => [s.id, s]));
  const pathOf = (s) => {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    for (let at = s; at && !seen.has(at.id); at = at.parentId ? byId.get(at.parentId) : void 0) {
      seen.add(at.id);
      out.unshift(at.name);
    }
    return out;
  };
  const routes = routable(spaces).map((s) => ({
    spaceId: s.id,
    path: pathOf(s),
    tags: (s.tags ?? []).filter(Boolean),
    modules: (s.modules ?? []).filter((m) => m.type === "TASKS" || m.type === "NOTES")
  }));
  const rank = (r) => {
    const i = recent.indexOf(r.spaceId);
    return i < 0 ? Number.MAX_SAFE_INTEGER : i;
  };
  return routes.sort((a, b) => rank(a) - rank(b) || a.path.join(" \u203A ").localeCompare(b.path.join(" \u203A ")));
}
function filterRoutes(routes, query, recent = []) {
  const matching = (q) => {
    const terms2 = lc(q).split(/\s+/).filter(Boolean);
    return {
      terms: terms2,
      hit: routes.filter((r) => {
        const hay = lc([r.path.join(" \u203A "), ...r.tags].join(" "));
        return terms2.every((t) => hay.includes(t));
      })
    };
  };
  let slash = query.indexOf("/");
  if (slash >= 0 && matching(query.trim()).hit.length) slash = -1;
  const { terms, hit } = matching(slash < 0 ? query.trim() : query.slice(0, slash));
  if (slash >= 0) {
    const modQ = lc(query.slice(slash + 1).trim());
    return hit.flatMap((r) => r.modules.filter((m) => !modQ || lc(m.name).includes(modQ)).map((m) => ({ ...r, module: m })));
  }
  if (!terms.length && recent.length) {
    const recentHits = hit.filter((r) => recent.includes(r.spaceId)).slice(0, 5);
    if (recentHits.length) return recentHits;
  }
  return hit;
}
function tokenName(route, all) {
  const leaf = route.path[route.path.length - 1];
  const twins = all.filter((r) => r.spaceId !== route.spaceId && lc(r.path[r.path.length - 1]) === lc(leaf));
  return twins.length ? route.path.join(" \u203A ") : leaf;
}
function insertionFor(route, all) {
  if (route.module) return routeTokenText(tokenName(route, all), route.module.name);
  if (route.tags.length) return `#${route.tags[0].replace(/^#/, "")}`;
  return routeTokenText(tokenName(route, all));
}
function frontmatterFor(route, all) {
  return `lp_space: ${tokenName(route, all)}`;
}
function frontmatterRange(lines) {
  if (lines[0]?.trim() !== "---") return null;
  const end = lines.findIndex((l, n) => n > 0 && l.trim() === "---");
  return end > 0 ? [0, end] : null;
}
function routeTrigger(text, ch, inFrontmatter = false) {
  const before = text.slice(0, ch);
  const at = before.lastIndexOf(">>");
  if (at < 0) return null;
  if (!inFrontmatter && (at === 0 || !/\s/.test(before[at - 1]))) return null;
  const query = before.slice(at + 2);
  if (/[|#]/.test(query) || query.includes(">>")) return null;
  return { start: at, query: query.replace(/^\s+/, "") };
}
function sectionFor(lines, line) {
  let fence = false;
  let heading;
  const fm = frontmatterRange(lines);
  for (let i = fm ? fm[1] + 1 : 0; i < line; i++) {
    const t = lines[i].trim();
    if (/^(```|~~~)/.test(t)) {
      fence = !fence;
      continue;
    }
    if (!fence && /^#{1,6}\s/.test(t)) heading = lines[i];
  }
  return heading;
}
function noteSpace(lines) {
  const fm = frontmatterRange(lines);
  if (!fm) return void 0;
  let found;
  for (let i = fm[0] + 1; i < fm[1]; i++) {
    const m = /^(gr|lp)_space:\s*(.+?)\s*$/.exec(lines[i]);
    if (!m) continue;
    const v = m[2].replace(/^["']|["']$/g, "");
    if (m[1] === "gr") return v;
    if (found === void 0) found = v;
  }
  return found;
}
function makeTasks(lines) {
  return lines.map((l) => {
    if (/^\s*[-*+]\s+\[[ xX-]\]/.test(l)) return l;
    const m = /^(\s*)[-*+]\s+(\S.*)$/.exec(l);
    return m ? `${m[1]}- [ ] ${m[2]}` : l;
  });
}

// ../../apps/api/src/spaces/vault-tick.ts
var TICK_BOX = /^(\s*[-*]\s+\[)( |x|X|-)(\].*)$/;
function stateOfMark(mark) {
  if (mark === "-") return "cancelled";
  return mark === " " ? "open" : "done";
}
var MARK = { open: " ", done: "x", cancelled: "-" };
function taskBox(line) {
  const box = TICK_BOX.exec(line);
  if (!box) return null;
  return { state: stateOfMark(box[2]), rest: box[3].slice(1).replace(/^\s+/, "") };
}
function tickOf(line) {
  const box = TICK_BOX.exec(line);
  if (!box) return null;
  const marker = LP_TAIL.exec(line);
  if (!marker) return null;
  return { id: marker[1], state: stateOfMark(box[2]) };
}
function withTick(line, state) {
  const box = TICK_BOX.exec(line);
  if (!box) return line;
  return `${box[1]}${MARK[state]}${box[3]}`;
}
function mergeTick(base, local, remote) {
  if (local === remote) return { agreed: local };
  if (remote === "cancelled" || local === "cancelled") {
    const vaultMoved = base === void 0 ? local !== "open" : local !== base;
    return vaultMoved ? { agreed: remote, line: remote, clash: true } : { agreed: remote, line: remote };
  }
  if (base === local) return { agreed: remote, line: remote };
  if (base === remote) return { agreed: local, server: local };
  if (base === void 0) {
    return local === "done" ? { agreed: "done", server: "done" } : { agreed: "done", line: "done" };
  }
  return { agreed: remote, line: remote, clash: true };
}

// src/census.ts
var CENSUS_RECENT_DAYS = 7;
function localDay(ms2) {
  const d = new Date(ms2);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
var WIKI_LINK = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;
var MD_LINK = /\]\(([^)\s]+)\)/g;
var FRONTMATTER_DATE = /^date:\s*["']?(\d{4}-\d{2}-\d{2})/m;
var NAMED_DAY = /(\d{4}-\d{2}-\d{2})/;
function noteDay(path, text, createdMs) {
  const head = text.startsWith("---") ? text.slice(0, text.indexOf("\n---", 3) + 1) : "";
  const declared = FRONTMATTER_DATE.exec(head);
  if (declared) return declared[1];
  const named = NAMED_DAY.exec(path.split("/").pop() ?? "");
  return named ? named[1] : localDay(createdMs);
}
function censusOf(path, text, createdMs) {
  const lines = text.split("\n");
  const counts = { open: 0, captured: 0, done: 0, cancelled: 0, proposed: 0 };
  const tags = new Set(frontmatterTags(text) ?? []);
  const links = /* @__PURE__ */ new Set();
  for (const at of bodyLines(lines)) {
    const line = lines[at];
    const box = taskBox(line);
    if (box && PROPOSAL_TAIL.test(line)) counts.proposed++;
    else if (box?.state === "done") counts.done++;
    else if (box?.state === "cancelled") counts.cancelled++;
    else if (box) {
      if (LP_TAIL.test(line)) counts.captured++;
      else if (box.rest.trim()) counts.open++;
    }
    for (const t of parseVaultTags(line).tags) tags.add(t);
    for (const m of line.matchAll(WIKI_LINK)) links.add(m[1].trim());
    for (const m of line.matchAll(MD_LINK)) {
      if (!/^[a-z][a-z0-9+.-]*:/i.test(m[1])) links.add(safeDecode(m[1]));
    }
  }
  return {
    path,
    date: noteDay(path, text, createdMs),
    counts,
    tags: [...tags],
    links: [...links]
  };
}
function safeDecode(s) {
  try {
    return decodeURI(s);
  } catch {
    return s;
  }
}
function inCensus(n, today) {
  if (n.counts.open > 0) return true;
  const age = (Date.parse(today) - Date.parse(n.date)) / 864e5;
  return age >= 0 && age <= CENSUS_RECENT_DAYS;
}

// ../../apps/api/src/shared/task-vocabulary.ts
var BUILT_IN_STATUSES = ["PENDING", "IN_PROGRESS", "DONE", "CANCELLED"];
var BUILT_IN_PRIORITIES = ["LOW", "NORMAL", "HIGH", "CRITICAL"];
var DEFAULT_STATUS_NAMES = {
  PENDING: "Not started",
  IN_PROGRESS: "In progress",
  DONE: "Done",
  CANCELLED: "Cancelled"
};
var DEFAULT_PRIORITY_NAMES = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
  CRITICAL: "Critical"
};
function defaultVocabulary() {
  return {
    statuses: BUILT_IN_STATUSES.map((s) => ({
      id: s,
      name: DEFAULT_STATUS_NAMES[s],
      colour: null,
      countsAs: s
    })),
    priorities: BUILT_IN_PRIORITIES.map((p) => ({
      id: p,
      name: DEFAULT_PRIORITY_NAMES[p],
      colour: null,
      countsAs: p
    }))
  };
}

// src/toolbar-lines.ts
var TASK_LINE = /^(\s*)[-*]\s+\[([ xX-])\]\s?(.*)$/;
var BULLET = /^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/;
var PIPE = /(?<!\\)\|/;
var MARKER_PART = /^(?:lp|gr)\s*:/i;
var PRIORITIES = ["low", "normal", "high", "critical"];
function priorityChoices(words) {
  const list = words?.priorities ?? [];
  if (!list.length) {
    return PRIORITIES.map((p) => ({
      label: p[0].toUpperCase() + p.slice(1),
      value: p,
      hint: p === "normal" ? "default" : void 0
    }));
  }
  return list.map((w) => {
    const builtIn = DEFAULT_PRIORITY_NAMES[w.countsAs] ?? w.countsAs;
    const same2 = w.name.toLowerCase() === builtIn.toLowerCase();
    return {
      label: w.name,
      value: w.name.replace(/\|/g, "\\|"),
      hint: same2 ? w.countsAs === "NORMAL" ? "default" : void 0 : `counts as ${builtIn}`
    };
  });
}
function isTaskLine(line) {
  return TASK_LINE.test(line);
}
function isCaptured(line) {
  return line.split(PIPE).slice(1).some((p) => MARKER_PART.test(p.trim()));
}
function asTaskLine(line) {
  if (TASK_LINE.test(line)) return line;
  const bullet = BULLET.exec(line);
  if (bullet) return `${bullet[1]}- [ ] ${bullet[2]}`;
  const indent = /^\s*/.exec(line)[0];
  return `${indent}- [ ] ${line.slice(indent.length)}`;
}
function nextTaskLine(line) {
  return `${/^\s*/.exec(line)[0]}- [ ] `;
}
function partsOf(line) {
  const [first, ...rest] = line.split(PIPE);
  return { words: first.replace(/\s+$/, ""), fields: rest.map((p) => p.trim()).filter(Boolean) };
}
var join = ({ words, fields }) => [words, ...fields].join(" | ");
var keyOf = (part) => /^([A-Za-z][A-Za-z0-9_-]*)\s*:/.exec(part)?.[1].toLowerCase() ?? null;
function readField(line, key) {
  for (const part of partsOf(line).fields) {
    if (keyOf(part) === key.toLowerCase()) return part.slice(part.indexOf(":") + 1).trim();
  }
  return null;
}
function setField(line, key, value) {
  const parts = partsOf(line);
  const k = key.toLowerCase();
  const at = parts.fields.findIndex((p) => keyOf(p) === k);
  const next = `${key}: ${value}`;
  if (at >= 0) parts.fields[at] = next;
  else {
    const marker = parts.fields.findIndex((p) => MARKER_PART.test(p));
    parts.fields.splice(marker < 0 ? parts.fields.length : marker, 0, next);
  }
  return join(parts);
}
function cleanTag(raw2) {
  const t = raw2.trim().replace(/^#+/, "").replace(/\s+/g, "-").replace(/[^\p{L}\p{N}_/-]/gu, "");
  return /[\p{L}_/-]/u.test(t) ? t : null;
}
function addTag(line, tag) {
  const t = cleanTag(tag);
  if (!t) return line;
  const parts = partsOf(line);
  const have = parts.words.match(/(?:^|\s)#[\p{L}\p{N}_/-]+/gu) ?? [];
  if (have.some((h) => h.trim().slice(1).toLowerCase() === t.toLowerCase())) return line;
  parts.words = `${parts.words} #${t}`;
  return join(parts);
}
function listStart(words, token, kind) {
  const heading = words.trim() || "Actions";
  return [`## ${heading} ${token}`, kind === "tasks" ? "- [ ] " : "- "];
}
function insertBlock(lines, line, block) {
  const out = [...lines];
  let at = line;
  if (!(out[line] ?? "").trim()) out.splice(line, 1, ...block);
  else {
    out.splice(line + 1, 0, "", ...block);
    at = line + 2;
  }
  return {
    lines: out,
    cursor: { line: at + block.length - 1, ch: block[block.length - 1].length }
  };
}

// src/toolbar-due.ts
var DAY = 864e5;
var NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var FULL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var ms = (iso2) => {
  const [y, m, d] = iso2.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
var iso = (t) => new Date(t).toISOString().slice(0, 10);
var addDays = (day, n) => iso(ms(day) + n * DAY);
var weekday = (day) => new Date(ms(day)).getUTCDay();
function dayLabel(day) {
  const d = new Date(ms(day));
  return `${NAMES[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}
function dueChips(noteDay2) {
  const short = (day2) => `${NAMES[weekday(day2)]} ${Number(day2.slice(8))}`;
  const chips = [
    { label: "Today", sub: short(noteDay2), date: noteDay2 },
    { label: "Tomorrow", sub: short(addDays(noteDay2, 1)), date: addDays(noteDay2, 1) }
  ];
  let day = addDays(noteDay2, 1);
  let n = 0;
  while (n < 5) {
    day = addDays(day, 1);
    const w = weekday(day);
    if (w === 0 || w === 6) continue;
    chips.push({ label: NAMES[w], sub: `${Number(day.slice(8))} ${MONTHS[Number(day.slice(5, 7)) - 1]}`, date: day });
    n++;
  }
  let monday = addDays(day, 1);
  while (weekday(monday) !== 1) monday = addDays(monday, 1);
  chips.push({ label: "Next week", sub: `Mon ${Number(monday.slice(8))}`, date: monday });
  return chips;
}
var DUE_TIMES = ["09:00", "12:00", "14:00", "17:00"];
function validTime(t) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
}
function dueValue(date, time) {
  return time ? `${date} ${time}` : date;
}
function readDue(value) {
  const m = value ? /^(\d{4}-\d{2}-\d{2})(?:\s+(\d{2}:\d{2}))?/.exec(value.trim()) : null;
  return m ? { date: m[1], time: m[2] ?? null } : null;
}
function monthTitle(year, month) {
  return `${FULL_MONTHS[month - 1]} ${year}`;
}
function monthGrid(year, month) {
  const lead = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
function shiftMonth(year, month, by) {
  const t = year * 12 + (month - 1) + by;
  return { year: Math.floor(t / 12), month: t % 12 + 1 };
}

// src/toolbar-where.ts
var lc2 = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();
function routeNamed(routes, said) {
  const want = lc2(said);
  if (!want) return null;
  const hit = routes.filter((r) => lc2(tokenName(r, routes)) === want || lc2(r.path.join(" \u203A ")) === want || lc2(r.path[r.path.length - 1]) === want);
  return hit.length === 1 ? hit[0] : null;
}
var wordsOf = (line) => line.split(/(?<!\\)\|/)[0];
function fromText(text, routes) {
  const { token } = readRouteToken(text);
  if (token?.space) {
    const route = routeNamed(routes, token.space);
    return route ? { route, module: token.module, via: "line" } : "refused";
  }
  for (const m of text.matchAll(/(?:^|\s)#([\p{L}\p{N}_/-]+)/gu)) {
    const hit = routes.filter((r) => r.tags.some((t) => lc2(t.replace(/^#/, "")) === lc2(m[1])));
    if (hit.length === 1) return { route: hit[0], module: null, via: "tag" };
  }
  return null;
}
function destinationOf(lines, line, routes, inboxModuleId) {
  const refused = { route: null, module: null, via: "none" };
  const own = fromText(wordsOf(lines[line] ?? ""), routes);
  if (own === "refused") return refused;
  if (own) return { route: own.route, module: own.module, via: own.via };
  const heading = sectionFor(lines, line);
  const section = heading ? fromText(heading, routes) : null;
  if (section === "refused") return refused;
  if (section) return { route: section.route, module: section.module, via: "section" };
  const noted = noteSpace(lines);
  if (noted) {
    const note = routeNamed(routes, noted);
    return note ? { route: note, module: null, via: "note" } : refused;
  }
  const inbox = inboxModuleId ? routes.find((r) => r.modules.some((m) => m.id === inboxModuleId)) : null;
  if (inbox) return { route: inbox, module: inbox.modules.find((m) => m.id === inboxModuleId).name, via: "inbox" };
  return { route: null, module: null, via: "none" };
}
function taskModuleOf(dest, inboxModuleId) {
  if (!dest.route) return null;
  if (dest.via === "inbox") return inboxModuleId;
  const tasks = dest.route.modules.filter((m) => m.type === "TASKS");
  if (dest.module) return tasks.find((m) => lc2(m.name) === lc2(dest.module))?.id ?? null;
  return tasks[0]?.id ?? null;
}
var TYPE_OF = { tasks: "TASKS", notes: "NOTES" };
function listTargets(routes, spaces, kind, boundRootId) {
  const parent = new Map(spaces.map((s) => [s.id, s.parentId ?? null]));
  const inside = (id) => {
    if (!boundRootId) return true;
    const seen = /* @__PURE__ */ new Set();
    for (let at = id; at && !seen.has(at); at = parent.get(at)) {
      if (at === boundRootId) return true;
      seen.add(at);
    }
    return false;
  };
  const out = [];
  for (const route of routes) {
    if (!inside(route.spaceId)) continue;
    for (const module2 of route.modules) if (module2.type === TYPE_OF[kind]) out.push({ route, module: module2 });
  }
  return out.sort((a, b) => a.route.path.join(" \u203A ").localeCompare(b.route.path.join(" \u203A ")) || a.module.name.localeCompare(b.module.name));
}
function suggestedTarget(targets, dest, inboxModuleId) {
  if (dest.via !== "inbox" && dest.route) {
    const inSpace = targets.filter((t) => t.route.spaceId === dest.route.spaceId);
    const named = dest.module ? inSpace.find((t) => lc2(t.module.name) === lc2(dest.module)) : null;
    const inbox = inSpace.find((t) => t.module.id === inboxModuleId);
    const pick = named ?? inbox ?? inSpace[0];
    if (pick) return pick;
  }
  return targets.find((t) => t.module.id === inboxModuleId) ?? null;
}
function filterTargets(targets, query) {
  const terms = lc2(query).split(" ").filter(Boolean);
  return targets.filter((t) => {
    const hay = lc2(`${t.route.path.join(" \u203A ")} ${t.module.name}`);
    return terms.every((x) => hay.includes(x));
  });
}
function targetToken(t, routes) {
  return routeTokenText(tokenName(t.route, routes), t.module.name);
}
function targetLabel(t) {
  return `${t.route.path[t.route.path.length - 1]} \u203A ${t.module.name}`;
}

// src/toolbar-lists.ts
var TOOLBAR_LISTS_PATH = "Graphite/Toolbar lists.json";
function isToolbarFile(path) {
  return path === TOOLBAR_LISTS_PATH;
}
var MAX_WORD = 40;
var MAX_WORDS = 24;
function wordsList(v, kinds) {
  if (!Array.isArray(v)) return [];
  const out = [];
  for (const w of v) {
    const name = typeof w?.name === "string" ? w.name.trim().slice(0, MAX_WORD) : "";
    if (!name || typeof w?.countsAs !== "string" || !kinds.includes(w.countsAs)) continue;
    out.push({ name, countsAs: w.countsAs });
    if (out.length >= MAX_WORDS) break;
  }
  return out;
}
function wordsOf2(v) {
  return {
    priorities: wordsList(v?.priorities, BUILT_IN_PRIORITIES),
    statuses: wordsList(v?.statuses, BUILT_IN_STATUSES)
  };
}
function wordsFromSettings(settings) {
  const words = wordsOf2(settings);
  if (!words.priorities.length && !words.statuses.length) return null;
  const shipped = defaultVocabulary();
  const same2 = (a, b) => a.length === b.length && a.every((w, i) => w.name === b[i].name && w.countsAs === b[i].countsAs);
  return same2(words.priorities, shipped.priorities) && same2(words.statuses, shipped.statuses) ? null : words;
}
var str = (v) => typeof v === "string" ? v : "";
var strOrNull = (v) => typeof v === "string" && v ? v : null;
function spaceOf(v) {
  if (!v || typeof v.id !== "string" || typeof v.name !== "string") return null;
  return {
    id: v.id,
    name: v.name,
    parentId: strOrNull(v.parentId),
    tags: Array.isArray(v.tags) ? v.tags.filter((t) => typeof t === "string") : [],
    status: strOrNull(v.status),
    personId: strOrNull(v.personId),
    myRole: strOrNull(v.myRole),
    modules: Array.isArray(v.modules) ? v.modules.filter((m) => m && typeof m.id === "string" && typeof m.type === "string").map((m) => ({ id: m.id, type: m.type, name: str(m.name) })) : []
  };
}
function buildLists(input) {
  const seen = /* @__PURE__ */ new Map();
  for (const t of input.tags) {
    const name = t.replace(/^#/, "").trim();
    if (name && !seen.has(name.toLowerCase())) seen.set(name.toLowerCase(), name);
  }
  return {
    graphite: "toolbar-lists",
    at: input.at,
    bound: { rootId: input.bound.rootId, inboxModuleId: input.bound.inboxModuleId },
    spaces: input.spaces.map((s) => spaceOf(s)).filter((s) => !!s),
    people: Object.fromEntries(Object.entries(input.people).map(([id, ps]) => [
      id,
      ps.map((p) => ({ name: p.name, color: p.color ?? null }))
    ])),
    tags: [...seen.values()].sort((a, b) => a.localeCompare(b)),
    words: Object.fromEntries(Object.entries(input.words ?? {}).map(([id, w]) => [id, wordsOf2(w)]).filter(([, w]) => w.priorities.length || w.statuses.length))
  };
}
function listsFile(lists) {
  return `${JSON.stringify(lists, null, 1)}
`;
}
function readListsFile(text) {
  let raw2;
  try {
    raw2 = JSON.parse(text);
  } catch {
    return null;
  }
  if (!raw2 || raw2.graphite !== "toolbar-lists" || !Array.isArray(raw2.spaces)) return null;
  const people = {};
  for (const [id, ps] of Object.entries(raw2.people ?? {})) {
    if (!Array.isArray(ps)) continue;
    people[id] = ps.filter((p) => p && typeof p.name === "string" && p.name).map((p) => ({ name: p.name, color: strOrNull(p.color) }));
  }
  return buildLists({
    at: str(raw2.at),
    bound: { rootId: strOrNull(raw2.bound?.rootId), inboxModuleId: strOrNull(raw2.bound?.inboxModuleId) },
    spaces: raw2.spaces,
    people,
    tags: Array.isArray(raw2.tags) ? raw2.tags.filter((t) => typeof t === "string") : [],
    words: raw2.words && typeof raw2.words === "object" ? raw2.words : {}
  });
}
function sameLists(a, b) {
  if (!a || !b) return a === b;
  return JSON.stringify({ ...a, at: "" }) === JSON.stringify({ ...b, at: "" });
}

// src/toolbar-ui.ts
var import_obsidian = require("obsidian");
var BarModal = class extends import_obsidian.Modal {
  constructor(app, mobile, anchor) {
    super(app);
    this.mobile = mobile;
    this.anchor = anchor;
  }
  /** Called by Obsidian when the modal opens. */
  onOpen() {
    const m = this.modalEl;
    m?.addClass?.("gr-sheet");
    m?.addClass?.(this.mobile ? "gr-sheet-bottom" : "gr-sheet-pop");
    if (this.mobile) m?.addClass?.("gr-mobile");
    this.containerEl?.addClass?.(this.mobile ? "gr-sheet-container" : "gr-pop-container");
    if (!this.mobile && this.anchor && m?.style) {
      m.style.left = `${Math.max(8, this.anchor.x)}px`;
      m.style.top = `${Math.max(8, this.anchor.y)}px`;
    }
    this.draw();
  }
  /** Draw the state into contentEl again — the surface is small, so it is
   *  redrawn whole after every change. */
  redraw() {
    this.contentEl.empty();
    this.draw();
  }
};
function button(parent, text, cls, onClick) {
  const b = parent.createEl("button", { text, cls });
  b.addEventListener("click", onClick);
  return b;
}
var PickModal = class extends BarModal {
  constructor(app, mobile, anchor, opts) {
    super(app, mobile, anchor);
    this.opts = opts;
    this.footerValue = opts.footer?.value ?? "";
    const start = opts.items.findIndex((i) => !i.disabled && (opts.start?.(i) ?? false));
    this.active = Math.max(0, start);
  }
  query = "";
  active = 0;
  footerValue;
  /** The rows now showing: the list narrowed by what is typed, then the
   *  offered extra row. */
  rows() {
    const terms = this.query.toLowerCase().split(/\s+/).filter(Boolean);
    const shown = this.opts.items.filter((i) => {
      const hay = `${i.label} ${i.detail ?? ""}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
    const extra = this.query.trim() ? this.opts.extra?.(this.query) : null;
    return extra ? [...shown, extra] : shown;
  }
  setQuery(q) {
    this.query = q;
    this.active = Math.max(0, this.rows().findIndex((r) => !r.disabled));
  }
  /** Choose a row: Enter, a tap, or a test. A disabled row chooses nothing. */
  choose(item) {
    if (item.disabled) return;
    this.close();
    this.opts.onChoose(item);
  }
  setFooter(v) {
    this.footerValue = v;
    this.opts.footer?.onChange(v);
    this.showWrites();
  }
  /** Enter and the arrows, from anywhere in the modal. */
  key(e) {
    const rows = this.rows().filter((r) => !r.disabled);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!rows.length) return;
      e.preventDefault();
      const all = this.rows();
      let at = this.active;
      do {
        at = (at + (e.key === "ArrowDown" ? 1 : -1) + all.length) % all.length;
      } while (all[at].disabled);
      this.active = at;
      this.redraw();
    } else if (e.key === "Enter") {
      const row = this.rows()[this.active];
      if (row && !row.disabled) {
        e.preventDefault();
        this.choose(row);
      }
    }
  }
  draw() {
    const root = this.contentEl.createDiv({ cls: "gr-pick" });
    root.addEventListener("keydown", (e) => this.key(e));
    root.createDiv({ text: this.opts.title, cls: "gr-pick-title" });
    if (this.opts.filter) {
      const input = root.createEl("input", { cls: "gr-pick-filter", attr: { type: "text", "aria-label": "Filter", value: this.query } });
      input.addEventListener("input", () => {
        this.setQuery(input.value);
        this.redrawList();
      });
      window.setTimeout(() => input.focus?.(), 0);
    }
    this.listEl = root.createDiv({ cls: "gr-pick-list" });
    this.redrawList();
    if (this.opts.footer) {
      const foot = root.createDiv({ cls: "gr-pick-footer" });
      foot.createSpan({ text: this.opts.footer.label, cls: "gr-pick-hint" });
      const f = foot.createEl("input", { cls: "gr-pick-words", attr: { type: "text", "aria-label": this.opts.footer.label, value: this.footerValue } });
      f.addEventListener("input", () => this.setFooter(f.value));
      foot.createSpan({ text: "Enter to insert", cls: "gr-pick-hint gr-pick-right" });
    }
    if (this.opts.writes) this.writesEl = root.createDiv({ cls: "gr-pick-writes" });
    this.showWrites();
  }
  listEl = null;
  redrawList() {
    const list = this.listEl;
    if (!list) return;
    list.empty();
    let group;
    this.rows().forEach((item, n) => {
      if (item.group !== void 0 && item.group !== group) {
        group = item.group;
        list.createDiv({ text: group, cls: "gr-pick-group" });
      }
      const row = button(list, "", `gr-pick-row${n === this.active ? " is-active" : ""}${item.disabled ? " is-disabled" : ""}`, () => this.choose(item));
      if (item.disabled) row.setAttr?.("disabled", "true");
      if (item.color !== void 0) {
        const av = row.createSpan({ text: (item.label[0] ?? "?").toUpperCase(), cls: "gr-pick-avatar" });
        if (item.color && av.style) av.style.background = item.color;
      }
      const body = row.createDiv({ cls: "gr-pick-body" });
      body.createSpan({ text: item.label, cls: "gr-pick-label" });
      if (item.detail) body.createDiv({ text: item.detail, cls: "gr-pick-detail" });
      if (item.hint) row.createSpan({ text: item.hint, cls: "gr-pick-hint gr-pick-right" });
    });
    this.showWrites();
  }
  writesEl = null;
  /** What choosing the row now under the cursor would write. */
  showWrites() {
    const row = this.rows()[this.active];
    this.writesEl?.setText(this.opts.writes && row && !row.disabled ? this.opts.writes(row, this.footerValue) : "");
  }
};
var DueModal = class extends BarModal {
  constructor(app, mobile, anchor, opts) {
    super(app, mobile, anchor);
    this.opts = opts;
    this.date = opts.current?.date ?? null;
    this.time = opts.current?.time ?? null;
    const at = this.date ?? opts.noteDay;
    this.view = { year: Number(at.slice(0, 4)), month: Number(at.slice(5, 7)) };
  }
  onOpen() {
    this.modalEl?.addClass?.("gr-due-modal");
    super.onOpen();
  }
  date;
  time;
  /** The month the calendar shows. */
  view;
  pickDate(date) {
    this.date = date;
    this.view = { year: Number(date.slice(0, 4)), month: Number(date.slice(5, 7)) };
  }
  pickTime(time) {
    if (time !== null && !validTime(time)) return false;
    this.time = time;
    return true;
  }
  /** What Set writes after `due: `, or null before a day is chosen. */
  value() {
    return this.date ? dueValue(this.date, this.time) : null;
  }
  set() {
    const v = this.value();
    if (!v) return;
    this.close();
    this.opts.onSet(v);
  }
  draw() {
    const root = this.contentEl.createDiv({ cls: "gr-pick gr-due" });
    root.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.set();
      }
    });
    const words = this.opts.words.length > 40 ? `${this.opts.words.slice(0, 39)}\u2026` : this.opts.words;
    root.createDiv({
      text: `Due for "${words}". Counted from this note's date, ${dayLabel(this.opts.noteDay)}.`,
      cls: "gr-pick-title"
    });
    const chips = root.createDiv({ cls: "gr-chips" });
    for (const c of dueChips(this.opts.noteDay)) {
      const b = button(chips, "", `gr-chip${this.date === c.date ? " is-on" : ""}`, () => {
        this.pickDate(c.date);
        this.redraw();
      });
      b.createSpan({ text: c.label, cls: "gr-chip-label" });
      b.createSpan({ text: c.sub, cls: "gr-chip-sub" });
    }
    const both = root.createDiv({ cls: "gr-due-both" });
    this.drawCalendar(both.createDiv({ cls: "gr-cal" }));
    this.drawTimes(both.createDiv({ cls: "gr-times" }));
    const foot = root.createDiv({ cls: "gr-pick-footer" });
    foot.createSpan({ text: "Writes", cls: "gr-pick-hint" });
    foot.createSpan({ text: this.value() ? `| due: ${this.value()}` : "choose a day", cls: "gr-pick-writes-inline" });
    const set = button(foot, "Set", "gr-pick-set mod-cta", () => this.set());
    if (!this.value()) set.setAttr?.("disabled", "true");
  }
  drawCalendar(el) {
    const { year, month } = this.view;
    const head = el.createDiv({ cls: "gr-cal-head" });
    button(head, "\u2039", "gr-cal-nav", () => {
      this.view = shiftMonth(year, month, -1);
      this.redraw();
    }).setAttr?.("aria-label", "Previous month");
    head.createSpan({ text: monthTitle(year, month), cls: "gr-cal-title" });
    button(head, "\u203A", "gr-cal-nav", () => {
      this.view = shiftMonth(year, month, 1);
      this.redraw();
    }).setAttr?.("aria-label", "Next month");
    const grid = el.createDiv({ cls: "gr-cal-grid" });
    for (const d of ["M", "T", "W", "T", "F", "S", "S"]) grid.createSpan({ text: d, cls: "gr-cal-dow" });
    const pad2 = (n) => String(n).padStart(2, "0");
    for (const week of monthGrid(year, month)) {
      for (const day of week) {
        if (day === null) {
          grid.createSpan({ cls: "gr-cal-blank" });
          continue;
        }
        const date = `${year}-${pad2(month)}-${pad2(day)}`;
        const cls = ["gr-cal-day", date === this.date ? "is-on" : "", date === this.opts.noteDay ? "is-today" : ""].filter(Boolean).join(" ");
        button(grid, String(day), cls, () => {
          this.pickDate(date);
          this.redraw();
        });
      }
    }
  }
  drawTimes(el) {
    el.createDiv({ text: "Time", cls: "gr-cal-title" });
    const on = (t) => this.time === t ? " is-on" : "";
    button(el, "No time", `gr-time${on(null)}`, () => {
      this.pickTime(null);
      this.redraw();
    });
    for (const t of DUE_TIMES) button(el, t, `gr-time${on(t)}`, () => {
      this.pickTime(t);
      this.redraw();
    });
    const other = el.createEl("input", {
      cls: "gr-time-other",
      attr: { type: "text", placeholder: "Other, 15:30", "aria-label": "Other time", value: this.time && !DUE_TIMES.includes(this.time) ? this.time : "" }
    });
    other.addEventListener("change", () => {
      if (this.pickTime(other.value.trim() || null)) this.redraw();
    });
  }
};

// src/toolbar-bar.ts
var BAR_BUTTONS = [
  { id: "start-list", label: "Start a list", icon: "list-plus", primary: true },
  { id: "task", label: "Task", icon: "square" },
  { id: "due", label: "Due", icon: "calendar" },
  { id: "assign", label: "Assign", icon: "user" },
  { id: "priority", label: "Priority", icon: "flag" },
  { id: "tag", label: "Tag", icon: "tag" },
  { id: "send-to", label: "Send to", icon: "arrow-right" },
  { id: "capture-now", label: "Capture now", icon: "refresh-cw", right: true, needsServer: true }
];
var MOBILE_TARGET_PX = 44;
function barWanted(opts) {
  return opts.on && !!opts.path && /\.md$/i.test(opts.path) && !opts.synced && !opts.own;
}

// src/toolbar-mount.ts
var import_obsidian2 = require("obsidian");
function drawBar(parent, pane, host) {
  const bar = parent.createDiv({
    cls: host.mobile ? "gr-bar gr-bar-mobile" : "gr-bar",
    attr: { role: "toolbar", "aria-label": "Graphite" }
  });
  bar.createSpan({ text: "GRAPHITE", cls: "gr-bar-brand" });
  for (const b of BAR_BUTTONS) {
    const btn = bar.createEl("button", {
      cls: ["gr-bar-btn", b.primary ? "gr-bar-primary" : "", b.right ? "gr-bar-right" : ""].filter(Boolean).join(" "),
      attr: { type: "button", "aria-label": b.label }
    });
    btn.dataset.id = b.id;
    (0, import_obsidian2.setIcon)(btn.createSpan({ cls: "gr-bar-icon" }), b.icon);
    btn.createSpan({ text: b.label, cls: "gr-bar-label" });
    btn.addEventListener("mousedown", (e) => e?.preventDefault?.());
    btn.addEventListener("click", (e) => {
      e?.preventDefault?.();
      void host.run(b.id, pane);
    });
  }
  return bar;
}

// src/agent.ts
var ROUTING_LIST_PATH = "Graphite/Routing list.md";
var AGENT_BRIEF_PATH = "Graphite/Agent brief.md";
var AGENT_RUNS_FOLDER = "Graphite/Agent runs/";
function isAgentFile(path) {
  return path === ROUTING_LIST_PATH || path === AGENT_BRIEF_PATH || path.startsWith(AGENT_RUNS_FOLDER);
}
function routingListOf(routes, vocabulary, at) {
  const spaces = [...routes].sort((a, b) => a.path.join(" \u203A ").localeCompare(b.path.join(" \u203A "))).map((r) => ({
    token: tokenName(r, routes),
    path: r.path.join(" \u203A "),
    tags: [...r.tags],
    modules: r.modules.map((m) => m.name)
  }));
  const seen = /* @__PURE__ */ new Map();
  for (const t of [...vocabulary, ...routes.flatMap((r) => r.tags)]) {
    const k = t.replace(/^#/, "").toLowerCase();
    if (k && !seen.has(k)) seen.set(k, t.replace(/^#/, ""));
  }
  return { at, spaces, tags: [...seen.values()].sort((a, b) => a.localeCompare(b)) };
}
var lc3 = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();
function contractProblems(line, list) {
  const marker = PROPOSAL_TAIL.exec(line);
  if (!marker || marker.index === void 0) return [];
  const body = line.slice(0, marker.index);
  const bar = body.indexOf(" | ");
  const words = bar < 0 ? body : body.slice(0, bar);
  const fields = bar < 0 ? [] : body.slice(bar + 3).split(" | ").map((f) => f.trim()).filter(Boolean);
  const out = [];
  const { token } = readRouteToken(words);
  const tags = parseVaultTags(words).tags;
  if (!list) {
    if (token || tags.length) out.push("there is no routing list yet \u2014 connect to Graphite so one is published");
    return out;
  }
  const alternatives = fields.filter((f) => !/^[a-z_]+\s*:/i.test(f));
  if (token && (!token.space || alternatives.length)) {
    out.push(token.space ? `it asks which space (${[token.space, ...alternatives].join(" or ")}) \u2014 keep one` : "it asks which space (`>> ?`) \u2014 name one from the routing list");
  }
  if (token && token.space && !alternatives.length) {
    const space = list.spaces.find((s) => lc3(s.token) === lc3(token.space) || lc3(s.path) === lc3(token.space));
    if (!space) out.push(`\`>> ${token.space}\` is not in the routing list`);
    else if (token.module && !space.modules.some((m) => lc3(m) === lc3(token.module))) {
      out.push(`${space.token} has no module "${token.module}" in the routing list`);
    }
  }
  const known = new Set(list.tags.map((t) => t.toLowerCase()));
  for (const t of tags) {
    if (!known.has(t.toLowerCase())) out.push(`#${t} is not in the routing list`);
  }
  if (fields.some((f) => /^assigned\s*:/i.test(f))) {
    out.push("it names a person \u2014 people are not in the routing list, so assign it in Graphite");
  }
  return out;
}
var code = (s) => `\`${s.replace(/`/g, "'")}\``;
function routingListNote(list, stale) {
  const rows = list.spaces.map((s) => `| ${code(`>> ${s.token}`)} | ${s.path} | ${s.tags.map((t) => code(`#${t}`)).join(" ") || "\u2014"} | ${s.modules.join(" \xB7 ") || "\u2014"} |`);
  return [
    "---",
    "graphite: routing-list",
    `generated: ${list.at}`,
    "---",
    "# Routing list",
    "",
    "> Written by the Graphite plugin and rewritten from Graphite \u2014 edits here are lost.",
    "> **This is the closed list.** A space, a module or a tag that is not below is not one",
    "> your agent may write. Read [[Agent brief]] first.",
    ...stale ? [
      "",
      `> **Could not refresh at ${stale}.** Graphite could not be reached, so this is`,
      `> the list from ${list.at}. Spaces made since then are not on it.`
    ] : [],
    "",
    "## Spaces",
    "",
    "| Write | Where it is | Its tags | Its modules |",
    "|---|---|---|---|",
    ...rows.length ? rows : ["| \u2014 | no space you can write to | \u2014 | \u2014 |"],
    "",
    "## Tags",
    "",
    list.tags.length ? list.tags.map((t) => code(`#${t}`)).join(" \xB7 ") : "None yet.",
    "",
    "## The same list, for a program",
    "",
    "```json",
    JSON.stringify({ at: list.at, spaces: list.spaces, tags: list.tags }, null, 1),
    "```",
    ""
  ].join("\n");
}
function agentBriefNote(folders) {
  const where = folders.length ? folders.map((f) => `- \`${f}\``).join("\n") : "- **None yet.** Read nothing until he lists a folder in the Graphite Sync settings.";
  return [
    "---",
    "graphite: agent-brief",
    "---",
    "# Agent brief",
    "",
    "> Written by the Graphite plugin. This is the whole contract between your agent and",
    "> Graphite. Edits here are lost \u2014 change the settings instead.",
    "",
    "## What you are",
    "",
    "- You **write files**. You hold no Graphite login and you make no call to Graphite.",
    "- What you write are **proposals**: nothing becomes a task until he approves it.",
    "- [[Routing list]] is everything you know about Graphite. It is a **closed list**:",
    "  a space, module or tag that is not on it is not one you may write. Never invent",
    "  one, never re-spell one. If nothing fits, leave the line without a destination.",
    "",
    "## Where you may read",
    "",
    where,
    "",
    "- **Never** a note tagged `#private`, or whose frontmatter says `graphite: false`.",
    "- **Never** a note whose frontmatter has `lp_type:` or `gr_type:` \u2014 Graphite rewrites those.",
    "- Never the two files in `Graphite/` except to read them.",
    "",
    "## Two behaviours, read section by section",
    "",
    "A daily note is often a meeting, a to-do list and a thought at once, so decide per section:",
    "",
    "- **Prose is proposed from** \u2014 a meeting or his own thinking alike. Put each proposal",
    "  directly under the paragraph it came from. A small proposal is a good run: one task",
    "  out of six things discussed is right if only one needs doing.",
    "- **Lists are filed as written.** Never rewrite a line he wrote in a list. You may",
    "  propose a plain bullet as a task, or ask where a checkbox line goes \u2014 nothing more.",
    "",
    "## The proposal format, exactly",
    "",
    "```",
    "- [ ] *what needs doing* >> Space token | due: 2026-10-04 | lp: p_k3x9q2m7",
    "```",
    "",
    "- The words in *italic*; nothing else on the line in italic.",
    "- `>> ` and a token copied from the routing list, or no `>>` at all.",
    "- `| due:` only as `YYYY-MM-DD`, and only when the note gives the date. A day like",
    `  "Thursday" counts from the **note's own date**, never from today.`,
    "- `| lp: p_` and eight new lowercase letters or digits \u2014 a new key for every proposal.",
    "- Tags only from the routing list, written `#like/this`.",
    "",
    "## Never guess \u2014 ask",
    "",
    "- **A space:** when two fit, write both \u2014 `>> IS-07 Station | IS-12 Station` \u2014 and he keeps one.",
    "  When none fits, write `>> ?`. A line that asks cannot be approved until he answers.",
    "- **A date:** no date beats a wrong one. Leave `| due:` off.",
    "- **A person:** people are not on the routing list. Never write `| assigned:`; name the",
    "  person in the words if the note does.",
    "",
    "## Say what you skipped",
    "",
    `At the end of every run, write \`${AGENT_RUNS_FOLDER}<date> <time>.md\`: the notes you read,`,
    "the notes you skipped and why (`#private`, outside the folders above, unreadable), and",
    "the proposals you wrote. A run that read nothing says so \u2014 silence is not a clean run.",
    "",
    "## What leaves this machine",
    "",
    "- **The text of every note you read goes to your own model provider** \u2014 whichever",
    "  company runs the model behind this agent. It does not go to Graphite.",
    "- Graphite receives only what he approves, and only when he approves it.",
    "- **These rules are instructions, not code.** The folders above and the `#private`",
    "  veto hold only because you follow them. The closed list is also checked by the",
    "  plugin at approval: a proposal naming anything off the list is held, not created.",
    ""
  ].join("\n");
}

// src/main.ts
var import_view = require("@codemirror/view");

// ../../apps/api/src/shared/care-events.ts
var CARE_NEVER_SCORED = ["care-events", "episodes"];

// ../../apps/api/src/spaces/link-grammar.ts
var OWNER_SCOPED_KINDS = [
  "checklist-templates",
  "episodes"
];
var OWNER_SCOPED_ROLE = "about";
function isOwnerScopedKind(kind) {
  return OWNER_SCOPED_KINDS.includes(kind);
}
var LINK_GRAMMAR = {
  about: {
    label: "Related to",
    from: "any",
    to: "any",
    offered: true
  },
  mirrors: {
    // R-1156's counterpart. A person CAN say two records are the same
    // entry — the bridges write it automatically, and saying so by hand is
    // the same statement.
    label: "The same entry as",
    from: "any",
    to: "any",
    offered: true
  },
  assigned: {
    label: "Assigned to",
    from: "any",
    to: ["people"],
    offered: true
  },
  at: {
    // R-223/R-499: a place is a LOCATION reference and there is one home
    // for it. The picker therefore shows Places and Lists, not a map.
    label: "Happens at",
    from: "any",
    to: ["references"],
    offered: true
  },
  costs: {
    // W10: money has one home, so the far end is always a ledger row.
    label: "Cost",
    from: "any",
    to: ["expenses"],
    offered: true
  },
  realises: {
    // An ACTUAL figure settling a PLANNED one, in whole or in part. Both
    // ends are ledger rows, which is why it must not be offered from a
    // note — and was.
    label: "Settles the planned",
    from: ["expenses"],
    to: ["expenses"],
    offered: true
  },
  proof: {
    label: "Proved by",
    from: "any",
    // Register 853: Documents is a terminal — see link-role-ends.
    notFrom: ["documents"],
    to: ["documents"],
    offered: true
  },
  supply: {
    // D9: what restocks this. A course and an asset are the two things
    // that run out.
    label: "Restocked by",
    from: ["medications", "assets"],
    to: ["supplies"],
    offered: true
  },
  "checklist-of": {
    // R-473: direction is task → its checklist.
    label: "Broken down into",
    from: ["tasks"],
    to: ["checklist-items"],
    offered: true
  },
  needs: {
    label: "Needs",
    from: ["events", "visits"],
    to: ["checklist-items", "supplies"],
    offered: true
  },
  tracks: {
    // The streak engine's subject: what this goal or habit is counting.
    label: "Tracks",
    from: ["goals", "habits"],
    to: "any",
    // Rows 1008/1009 (S-162 F7): a care record is never a streak's subject.
    notTo: CARE_NEVER_SCORED,
    offered: true
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
    label: "Came from",
    from: "any",
    to: "any",
    offered: true
  },
  schedules: {
    label: "Schedules",
    from: ["modules"],
    to: ["modules"],
    offered: false,
    unofferedBecause: "MODULE WIRING, NOT A RECORD'S BUSINESS. A calendar shows a tasks module as a live view; the pair is chosen in the calendar's own settings, where the thing being wired is on screen."
  },
  views: {
    label: "Views",
    from: ["modules"],
    to: ["modules"],
    offered: false,
    unofferedBecause: "THE SAME AS `schedules`: a table views a module, and the binding is made in the table, not on a record's rail."
  },
  plans: {
    label: "On the plan",
    from: ["modules"],
    to: "any",
    offered: false,
    unofferedBecause: "THE PLAN'S OWN MEMBERSHIP. It carries lane and order on its config and is written by putting something on the stage; a hand-made one would arrive in no lane and at no position."
  },
  nests: {
    label: "Inside",
    from: "any",
    to: "any",
    offered: false,
    unofferedBecause: `PART OF THE PLAN'S DAG. addPlanLink refuses a cycle with the path named ("that would make X wait for itself"); the generic link door runs no such guard, so offering it here would let a person put a plan into the state its own engine exists to prevent.`
  },
  chain: {
    label: "Then",
    from: "any",
    to: "any",
    offered: false,
    unofferedBecause: "THE SAME DAG, and worse: a chain also carries a type, a gap and a direction (R-1155) that a bare role picker has nowhere to ask for. It is made by dragging on the stage, where the two ends are visible and the gap is what you just dragged."
  },
  recipe: {
    // REGISTER 1884: the written form of MealSlot.recipeId (raw-refs.ts).
    label: "Cooked from",
    from: ["meal-slots"],
    to: ["recipes"],
    offered: false,
    unofferedBecause: "A JOIN, NOT A LINK A PERSON DRAWS. It is the meal slot's own recipe column, written by the slot's recipe picker and kept equal to it by join-links.ts; a slot is cooked from one recipe, so a second one drawn on the rail would be a second answer to a question the form already asks. The generic link door refuses it."
  },
  appears: {
    // REGISTER 759 (R-4654): an entry shown in another module of its space.
    label: "Also in",
    from: ["modules"],
    to: "any",
    offered: false,
    unofferedBecause: "MADE FROM THE ENTRY, NOT THE RAIL. Adding an entry to another module asks two things a link picker cannot: that the module is in the entry's own space, and that its shape can show the kind (appearances.ts). The generic link door refuses it."
  }
};
var admits = (end, kind) => end === "any" || end.includes(kind);
function rolesFor(kind) {
  return Object.entries(LINK_GRAMMAR).filter(([role, g]) => g.offered && admits(g.from, kind) && !g.notFrom?.includes(kind) && (!isOwnerScopedKind(kind) || role === OWNER_SCOPED_ROLE)).map(([role, g]) => ({ role, ...g }));
}

// src/links.ts
var NOT_A_RECORD = "Put the cursor on a line Graphite knows: a captured line, or a line of a synced module note.";
var OUT_OF_REACH = "This line is a record, but not one this panel can reach yet. Table rows and one-file packages are not addressable by line.";
var LIST_LINE_KIND = Object.fromEntries(
  Object.entries(ANCHORED_IN).map(([kind, type]) => [type, kind])
);
function noteModuleType(lines) {
  if (lines[0]?.trim() !== "---") return null;
  for (let i = 1; i < Math.min(lines.length, 60); i++) {
    const t = lines[i].trim();
    if (t === "---") return null;
    const m = /^module:\s*([A-Za-z_]+)\s*$/.exec(t);
    if (m) return m[1].toUpperCase();
  }
  return null;
}
function lineWords(line) {
  return line.replace(LP_TAIL, "").replace(/^\s*[-*+]\s+(\[.\]\s*)?/, "").trim();
}
function recordAt(lines, at, place) {
  const line = lines[at];
  if (line === void 0 || PROPOSAL_TAIL.test(line)) return { none: NOT_A_RECORD };
  const m = LP_TAIL.exec(line);
  if (!m && place.synced && /^\s*\|/.test(line)) return { none: OUT_OF_REACH };
  if (!m || !bodyLines(lines).includes(at)) return { none: NOT_A_RECORD };
  const id = m[1];
  const words = lineWords(line);
  if (!place.synced) {
    return { rec: { kind: taskBox(line) ? "tasks" : "notes", id, words } };
  }
  if (place.synced.role !== "module") return { none: OUT_OF_REACH };
  const type = noteModuleType(lines);
  const kind = type ? LIST_LINE_KIND[type] : void 0;
  if (!kind || !/^\s*[-*+]\s/.test(line)) return { none: OUT_OF_REACH };
  return { rec: { kind, id, words } };
}
var recordKey = (r) => `${r.kind}:${r.id}`;
function readLinkLog(json) {
  const j = json;
  if (!j || typeof j !== "object" || Array.isArray(j) || !Array.isArray(j.modules)) return null;
  const modules = [];
  for (const g of j.modules) {
    if (!g || !Array.isArray(g.links)) return null;
    modules.push({
      moduleId: g.moduleId ?? null,
      spaceId: g.spaceId ?? null,
      kind: g.kind ?? null,
      name: g.name ?? null,
      type: g.type ?? null,
      links: g.links.filter((l) => l && l.other).map((l) => ({
        id: String(l.id),
        role: String(l.role),
        dir: l.dir === "in" ? "in" : "out",
        via: String(l.via ?? "link"),
        other: {
          kind: String(l.other.kind),
          id: String(l.other.id),
          label: String(l.other.label ?? l.other.id),
          binned: l.other.binned === true
        }
      }))
    });
  }
  return { total: typeof j.total === "number" ? j.total : modules.reduce((n, g) => n + g.links.length, 0), modules };
}
function linkSentence(l) {
  const label = LINK_GRAMMAR[l.role]?.label ?? l.role;
  const other = l.other.binned ? `${l.other.label} (in the Bin)` : l.other.label;
  return l.dir === "out" ? `${label}: ${other}` : `${other}, ${label.toLowerCase()} this`;
}
function pickerRoles(kind) {
  return rolesFor(kind).map((g) => ({ role: g.role, label: g.label }));
}
function readTargets(json) {
  const g = json?.groups;
  if (!Array.isArray(g)) return null;
  return g.filter((x) => x && typeof x.kind === "string").map((x) => ({
    kind: x.kind,
    label: String(x.label ?? x.kind),
    moduleId: x.moduleId ?? null,
    moduleName: x.moduleName ?? null,
    spaceName: x.spaceName ?? null,
    ...Array.isArray(x.records) ? { records: x.records.map((r) => ({ id: String(r.id), label: String(r.label ?? r.id) })) } : {}
  }));
}
function readRows(json) {
  const rows = Array.isArray(json) ? json : Array.isArray(json?.items) ? json.items : null;
  if (!rows) return null;
  return rows.filter((r) => r && r.id != null).map((r) => ({
    id: String(r.id),
    label: String(r.title ?? r.name ?? r.label ?? r.question ?? r.key ?? r.id)
  }));
}
var LinkLogFeed = class {
  constructor(fetchLog, changed, clock2) {
    this.fetchLog = fetchLog;
    this.changed = changed;
    this.clock = clock2;
  }
  open = false;
  spot = null;
  cache = /* @__PURE__ */ new Map();
  timer = null;
  /** The in-flight ask. A newer ask, the panel closing, or the cursor
   *  leaving the record replaces it, and the old answer is then dropped. */
  ticket = 0;
  inFlight = null;
  error = null;
  pendingWhere = null;
  get isOpen() {
    return this.open;
  }
  setOpen(on) {
    this.open = on;
    if (!on) {
      if (this.timer !== null) this.clock.clearTimeout(this.timer);
      this.timer = null;
      this.pendingWhere = null;
      this.cancel();
    }
  }
  /** THE CURSOR HOOK. Synchronous, and it does nothing but reset a timer:
   *  `where` is not even called until the cursor has been still for the
   *  debounce, so a keystroke costs a clearTimeout and a setTimeout. */
  moved(where) {
    if (!this.open) return;
    this.pendingWhere = where;
    if (this.timer !== null) this.clock.clearTimeout(this.timer);
    this.timer = this.clock.setTimeout(() => {
      this.timer = null;
      const w = this.pendingWhere;
      this.pendingWhere = null;
      if (w && this.open) this.settle(w());
    }, this.clock.debounceMs);
  }
  /** After a link is written: that record's log is out of date. */
  invalidate(r) {
    this.cache.delete(recordKey(r));
    const s = this.spot;
    if (this.open && s && "rec" in s && recordKey(s.rec) === recordKey(r)) this.ask(r);
  }
  state() {
    const s = this.spot;
    const key = s && "rec" in s ? recordKey(s.rec) : null;
    const hit = key ? this.cache.get(key) : void 0;
    return {
      spot: s,
      log: hit?.log ?? null,
      refreshing: !!hit && this.inFlight === key,
      loading: !hit && key !== null && this.inFlight === key,
      // With a cached log on screen, an error is "could not refresh" and the
      // stale log stays up; without one, it is all there is to say.
      error: key ? this.error : null
    };
  }
  cancel() {
    this.ticket++;
    this.inFlight = null;
  }
  settle(spot) {
    if (!("rec" in spot)) {
      this.spot = spot;
      this.cancel();
      this.changed();
      return;
    }
    const key = recordKey(spot.rec);
    const was = this.spot && "rec" in this.spot ? recordKey(this.spot.rec) : null;
    this.spot = spot;
    if (key !== was) this.error = null;
    if (this.inFlight === key) {
      this.changed();
      return;
    }
    const hit = this.cache.get(key);
    if (hit && this.clock.now() - hit.at < this.clock.freshMs) {
      this.cancel();
      this.changed();
      return;
    }
    this.ask(spot.rec);
  }
  ask(r) {
    const key = recordKey(r);
    const mine = ++this.ticket;
    this.inFlight = key;
    this.error = null;
    this.changed();
    this.fetchLog(r).then((log) => {
      if (mine !== this.ticket) return;
      this.inFlight = null;
      this.cache.set(key, { log, at: this.clock.now() });
      this.changed();
    }, (e) => {
      if (mine !== this.ticket) return;
      this.inFlight = null;
      this.error = e instanceof Error ? e.message : String(e);
      this.changed();
    });
  }
};

// src/links-panel.ts
var import_obsidian3 = require("obsidian");

// ../../apps/api/src/spaces/module-names.json
var module_names_default = {
  TASKS: {
    name: "Tasks",
    record: "Task",
    records: "Tasks"
  },
  NOTES: {
    name: "Notebook",
    record: "Note",
    records: "Notes"
  },
  CALENDAR: {
    name: "Calendar",
    record: "Event",
    records: "Events"
  },
  SUPPLY: {
    name: "Supplies",
    record: "Supply",
    records: "Supplies"
  },
  RECIPES: {
    name: "Recipes",
    record: "Recipe",
    records: "Recipes"
  },
  MEAL_PLAN: {
    name: "Meal Plan",
    record: "Meal",
    records: "Meals"
  },
  VISITS: {
    name: "Visits",
    record: "Visit",
    records: "Visits"
  },
  CIRCLES: {
    name: "Savings Circle",
    record: "Circle",
    records: "Circles"
  },
  REFERENCE: {
    name: "Lists",
    record: "Item",
    records: "Items"
  },
  WORK_SCHEDULE: {
    name: "Work Schedule",
    record: "Shift",
    records: "Shifts"
  },
  LEAVE: {
    name: "Leave",
    record: "Leave",
    records: "Leave"
  },
  EXPENSES: {
    name: "Budget",
    record: "Entry",
    records: "Entries"
  },
  VOTING: {
    name: "Voting",
    record: "Poll",
    records: "Polls"
  },
  DOCUMENTS: {
    name: "Documents",
    record: "Document",
    records: "Documents"
  },
  HABITS: {
    name: "Habits",
    record: "Habit",
    records: "Habits"
  },
  MEDICATION: {
    name: "Medication",
    record: "Course",
    records: "Courses"
  },
  MEASUREMENTS: {
    name: "Measurements",
    record: "Measurement",
    records: "Measurements"
  },
  TIMELINE: {
    name: "Timeline",
    record: "Entry",
    records: "Entries"
  },
  REMINDERS: {
    name: "Reminders",
    record: "Reminder",
    records: "Reminders"
  },
  CHECKLISTS: {
    name: "Checklists",
    record: "Checklist",
    records: "Checklists"
  },
  ASSETS: {
    name: "Assets",
    record: "Asset",
    records: "Assets"
  },
  COMMENTS: {
    name: "Thread",
    record: "Message",
    records: "Messages"
  },
  TABLES: {
    name: "Tables",
    record: "Row",
    records: "Rows"
  },
  ROTA: {
    name: "Rota",
    record: "Duty",
    records: "Duties"
  },
  PERSON_DETAILS: {
    name: "Person Details",
    record: "Detail",
    records: "Details"
  },
  PERSON_ASSIGNED: {
    name: "Assigned",
    record: "Assigned item",
    records: "Assigned items"
  },
  GOALS: {
    name: "Goals",
    record: "Goal",
    records: "Goals"
  },
  PINS: {
    name: "Places",
    record: "Place",
    records: "Places"
  },
  CUSTOM_FIELDS: {
    name: "Custom Fields",
    record: "Field",
    records: "Fields"
  },
  PLAN: {
    name: "Plan",
    record: "Item",
    records: "Items"
  },
  CARE: {
    name: "Care",
    record: "Care event",
    records: "Care log"
  },
  CYCLE: {
    name: "Cycle",
    record: "Period",
    records: "Periods"
  },
  PREGNANCY: {
    name: "Pregnancy",
    record: "Appointment",
    records: "Appointments"
  },
  JOURNAL: {
    name: "Journal",
    record: "Memory",
    records: "Memories"
  }
};

// src/links-panel.ts
var LINKS_VIEW = "graphite-links";
var typeName = (t) => t && module_names_default[t]?.name || t || "";
var LinksView = class extends import_obsidian3.ItemView {
  constructor(leaf, host) {
    super(leaf);
    this.host = host;
  }
  getViewType() {
    return LINKS_VIEW;
  }
  getDisplayText() {
    return "Graphite links";
  }
  getIcon() {
    return "link";
  }
  async onOpen() {
    this.contentEl.addClass("gr-links-view");
    this.host.linksViews.add(this);
    this.host.feed.setOpen(true);
    this.render();
    this.host.nudgeLinks();
  }
  async onClose() {
    this.host.linksViews.delete(this);
    if (!this.host.linksViews.size) this.host.feed.setOpen(false);
  }
  render() {
    const el = this.contentEl;
    el.empty();
    el.createEl("h4", { text: "Links" });
    const outdated = this.host.outdatedNote();
    if (outdated) el.createDiv({ text: outdated, cls: "gr-links-bad" });
    const s = this.host.feed.state();
    if (!s.spot) {
      el.createDiv({ text: "Move the cursor onto a line to see what it is linked to.", cls: "gr-links-dim" });
      return;
    }
    if (!("rec" in s.spot)) {
      el.createDiv({ text: s.spot.none, cls: "gr-links-dim" });
      return;
    }
    const rec = s.spot.rec;
    const head = el.createDiv({ cls: "gr-links-head" });
    head.createSpan({ text: rec.words || rec.id, cls: "gr-links-record" });
    head.createEl("button", { text: "Link\u2026" }).addEventListener("click", () => pickLink(this.host, rec));
    if (s.loading) {
      el.createDiv({ text: "Reading the link log\u2026", cls: "gr-links-dim" });
      return;
    }
    if (!s.log) {
      el.createDiv({ text: `Could not read the link log: ${s.error ?? "no answer"}.`, cls: "gr-links-bad" });
      return;
    }
    if (s.refreshing) el.createDiv({ text: "Refreshing\u2026", cls: "gr-links-dim" });
    if (s.error) el.createDiv({ text: `Could not refresh: ${s.error}. Showing what was read before.`, cls: "gr-links-bad" });
    if (!s.log.total) {
      el.createDiv({ text: "Nothing is linked to this yet.", cls: "gr-links-dim" });
      return;
    }
    for (const g of s.log.modules) {
      const box = el.createDiv({ cls: "gr-links-group" });
      box.createDiv({
        text: g.name ? `${g.name}${g.type ? ` \xB7 ${typeName(g.type)}` : ""}` : g.kind ?? "Elsewhere",
        cls: "gr-links-module"
      });
      for (const l of g.links) {
        box.createDiv({ text: linkSentence(l), cls: l.other.binned ? "gr-links-row gr-links-binned" : "gr-links-row" });
      }
    }
  }
};
var StepModal = class extends import_obsidian3.FuzzySuggestModal {
  constructor(app, placeholder, items, text, onPick) {
    super(app);
    this.items = items;
    this.text = text;
    this.onPick = onPick;
    this.setPlaceholder(placeholder);
  }
  getItems() {
    return this.items;
  }
  getItemText(t) {
    return this.text(t);
  }
  onChooseItem(t) {
    this.onPick(t);
  }
};
function pickLink(host, rec) {
  const roles = pickerRoles(rec.kind);
  if (!roles.length) {
    new import_obsidian3.Notice("Graphite: nothing can be linked from this kind of record.");
    return;
  }
  new StepModal(
    host.app,
    `Link \u201C${rec.words || rec.id}\u201D as\u2026`,
    roles,
    (r) => r.label,
    (r) => void chooseTarget(host, rec, r)
  ).open();
}
async function chooseTarget(host, rec, role) {
  const res = await (0, import_obsidian3.requestUrl)({
    url: host.api(`/records/${rec.kind}/${encodeURIComponent(rec.id)}/link-targets?role=${encodeURIComponent(role.role)}`),
    headers: host.headers,
    throw: false
  }).catch(() => null);
  const groups = res && res.status < 300 ? readTargets(res.json) : null;
  if (!groups) {
    new import_obsidian3.Notice(`Graphite: could not ask where \u201C${role.label}\u201D can reach${res ? ` (${res.status})` : ""}.`);
    return;
  }
  if (!groups.length) {
    new import_obsidian3.Notice("Graphite: nowhere to link this yet \u2014 no module holds one.");
    return;
  }
  new StepModal(
    host.app,
    `${role.label}\u2026 which module?`,
    groups,
    (g) => g.moduleName ? `${g.moduleName}${g.spaceName ? ` \xB7 ${g.spaceName}` : ""}` : g.label,
    (g) => void chooseRecord(host, rec, role, g)
  ).open();
}
async function chooseRecord(host, rec, role, g) {
  let rows = g.records ?? null;
  if (!rows) {
    const path = g.moduleId ? `/modules/${g.moduleId}/${g.kind}` : `/${g.kind}`;
    const res = await (0, import_obsidian3.requestUrl)({ url: host.api(path), headers: host.headers, throw: false }).catch(() => null);
    rows = res && res.status < 300 ? readRows(res.json) : null;
    if (!rows) {
      new import_obsidian3.Notice(`Graphite: could not read what is in ${g.moduleName ?? g.label}${res ? ` (${res.status})` : ""}.`);
      return;
    }
  }
  const choices = rows.filter((r) => !(r.id === rec.id && g.kind === rec.kind));
  if (!choices.length) {
    new import_obsidian3.Notice(`Graphite: nothing in ${g.moduleName ?? g.label} to link to yet.`);
    return;
  }
  new StepModal(
    host.app,
    `${role.label}\u2026`,
    choices,
    (r) => r.label,
    (r) => void writeLink(host, rec, role, g.kind, r)
  ).open();
}
async function writeLink(host, rec, role, toKind, to) {
  if (!await host.writeAllowed("linked")) return;
  const res = await (0, import_obsidian3.requestUrl)({
    url: host.api("/links"),
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify({ fromKind: rec.kind, fromId: rec.id, toKind, toId: to.id, role: role.role }),
    headers: host.headers,
    throw: false
  }).catch(() => null);
  if (!res || res.status >= 300) {
    const why = res?.json?.message;
    new import_obsidian3.Notice(`Graphite: the link was not made${res ? ` (${res.status})` : ""}${why ? ` \u2014 ${String(why)}` : ""}.`, 1e4);
    return;
  }
  new import_obsidian3.Notice(`Graphite: linked \u2014 ${role.label}: ${to.label}.`);
  host.feed.invalidate(rec);
}

// src/handshake.ts
function versionParts(v) {
  if (typeof v !== "string") return null;
  const m = /^\s*(\d+)\.(\d+)\.(\d+)/.exec(v);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}
function isBelow(mine, floor) {
  const a = versionParts(mine);
  const b = versionParts(floor);
  if (!a || !b) return false;
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] < b[i];
  }
  return false;
}
function readHandshake(health, mine) {
  const said = health?.minPluginVersion;
  const floor = versionParts(said) ? String(said).trim() : null;
  return { mine, floor, outdated: floor !== null && isBelow(mine, floor) };
}
function outdatedSentence(h, what) {
  return `Graphite: update Graphite Sync. This server accepts version ${h.floor} or newer and this is ${h.mine}, so nothing was ${what}. Reading still works; writing waits for the update.`;
}

// src/device-mirror.ts
var MIRROR_INDEX = ".lp-mirror.json";
var SKIP = /* @__PURE__ */ new Set([".obsidian", ".git", ".trash", "node_modules"]);
var DEPTH = 3;
var SLACK_MS = 2e3;
var join2 = (dir, name) => dir ? `${dir}/${name}` : name;
async function lookForMirror(fs) {
  const folders = [];
  const walk = async (dir, depth) => {
    let listing;
    try {
      listing = await fs.list(dir);
    } catch {
      return;
    }
    const indexPath = join2(dir, MIRROR_INDEX);
    if (listing.files.some((f) => f === indexPath)) {
      const found = await readFolder(fs, dir, indexPath);
      if (found) folders.push(found);
    }
    if (depth >= DEPTH) return;
    for (const sub of listing.folders) {
      const name = sub.split("/").pop() ?? sub;
      if (SKIP.has(name)) continue;
      await walk(sub, depth + 1);
    }
  };
  await walk("", 0);
  const wrote = folders.map((f) => f.wroteAt);
  return {
    folders,
    spaces: folders.reduce((n, f) => n + f.spaces, 0),
    notes: folders.reduce((n, f) => n + f.notes, 0),
    changedHere: folders.reduce((n, f) => n + f.changedHere.length, 0),
    wroteAt: wrote.length ? Math.max(...wrote) : null
  };
}
async function readFolder(fs, dir, indexPath) {
  let index;
  try {
    const parsed = JSON.parse(await fs.read(indexPath));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    index = parsed;
  } catch {
    return null;
  }
  const wroteAt = await fs.mtime(indexPath);
  if (wroteAt === null) return null;
  const spaces = /* @__PURE__ */ new Set();
  let notes = 0;
  let missing = 0;
  const changedHere = [];
  for (const [name, space] of Object.entries(index)) {
    if (typeof space !== "string") continue;
    spaces.add(space);
    const path = join2(dir, name);
    const at = await fs.mtime(path);
    if (at === null) {
      missing++;
      continue;
    }
    notes++;
    if (at > wroteAt + SLACK_MS) changedHere.push(path);
  }
  return { dir, spaces: spaces.size, notes, missing, changedHere, wroteAt };
}
var plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
function ago(then, now) {
  const s = Math.max(0, Math.round((now - then) / 1e3));
  if (s < 90) return "just now";
  const m = Math.round(s / 60);
  if (m < 90) return `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 36) return `${h} hours ago`;
  return `${Math.round(h / 24)} days ago`;
}
function mirrorSentence(look, now, mobile) {
  if (!look.folders.length || look.wroteAt === null) {
    return mobile ? "No notes from Graphite are in this vault. Graphite on a phone does not write into an Obsidian vault yet. If a computer keeps this vault in step, set that up in the Graphite app on the computer." : "Graphite has not written notes into this vault. In the Graphite app, go to Settings, Data and server, Data locations, and choose this vault.";
  }
  const wrote = `Graphite wrote ${plural(look.notes, "note")} for ${plural(look.spaces, "space")} here, ${ago(look.wroteAt, now)}.`;
  const tail = look.changedHere > 0 ? `${plural(look.changedHere, "note")} changed here since. Those changes reach Graphite the next time the Graphite app is opened.` : "Changes you make here reach Graphite the next time the Graphite app is opened.";
  return `${wrote} ${tail}`;
}
function mirrorShort(look) {
  if (!look) return "checking";
  if (!look.folders.length) return "no notes from Graphite here";
  return look.changedHere > 0 ? `${look.changedHere} changed here, for Graphite to take` : `${plural(look.spaces, "space")} from this device`;
}

// src/device-door.ts
var DOOR_FILE = "plugin-door.json";
var DOOR_ENV = "GRAPHITE_PLUGIN_DOOR";
function doorFileCandidates(env, platform, join3) {
  const out = [];
  if (env[DOOR_ENV]) out.push(env[DOOR_ENV]);
  const home = env.HOME || env.USERPROFILE || "";
  if (platform === "win32") {
    const roaming = env.APPDATA || (home ? join3(home, "AppData", "Roaming") : "");
    if (roaming) out.push(join3(roaming, "findgraphite.com", "Graphite", DOOR_FILE));
  } else if (platform === "darwin") {
    if (home) {
      out.push(join3(
        home,
        "Library",
        "Containers",
        "com.findgraphite.app",
        "Data",
        "Library",
        "Application Support",
        "com.findgraphite.app",
        DOOR_FILE
      ));
      out.push(join3(home, "Library", "Application Support", "com.findgraphite.app", DOOR_FILE));
    }
  } else {
    const data = env.XDG_DATA_HOME || (home ? join3(home, ".local", "share") : "");
    if (data) out.push(join3(data, "com.findgraphite.app", DOOR_FILE));
  }
  return out;
}
function readDoor(text) {
  let j;
  try {
    j = JSON.parse(text);
  } catch {
    return null;
  }
  if (!j || j.v !== 1 || j.app !== "Graphite") return null;
  const port = j.port;
  const key = j.key;
  if (!Number.isInteger(port) || port < 1024 || port > 65535) return null;
  if (typeof key !== "string" || !/^[A-Za-z0-9_-]{32,128}$/.test(key)) return null;
  return { port, key };
}
function doorBase(door) {
  return `http://127.0.0.1:${door.port}`;
}
function findDoor(candidates, read) {
  for (const path of candidates) {
    const text = read(path);
    if (text === null) continue;
    const door = readDoor(text);
    return door ? { ok: true, door } : { ok: false, why: "unreadable" };
  }
  return { ok: false, why: "no-file" };
}
function doorSentence(why) {
  switch (why) {
    case "phone":
      return "This computer needs Obsidian on a desktop, with the Graphite app on the same computer. On a phone, use Server instead.";
    case "no-file":
      return 'The Graphite app has not been set up to be read on this computer. Open it, go to Settings, Data and server, and turn on "Let the notes plugin read Graphite on this computer".';
    case "unreadable":
      return "The file Graphite leaves for this plugin could not be read. Turn the setting off and on again in the Graphite app (Settings, Data and server).";
    case "refused":
      return "The Graphite app is not running. Open it and try again.";
  }
}
function doorShort(why) {
  return why === "phone" ? "needs the desktop app" : why === "refused" ? "Graphite is not running" : why === "no-file" ? "not turned on in Graphite" : "Graphite file unreadable";
}

// src/pacer.ts
var realClock = {
  now: () => Date.now(),
  sleep: (ms2) => new Promise((r) => setTimeout(r, ms2))
};
var WORK_MS = 8;
var REST_MS = 20;
var Pacer = class {
  constructor(clock2 = realClock, workMs = WORK_MS, restMs = REST_MS) {
    this.clock = clock2;
    this.workMs = workMs;
    this.restMs = restMs;
    this.since = clock2.now();
  }
  since;
  /** How many times the thread was set down; a test reads it. */
  rests = 0;
  /** Call between units of work (one file, one note). Rests when the slice
   *  has run long enough; otherwise returns at once. */
  async tick() {
    if (this.clock.now() - this.since < this.workMs) return;
    this.rests++;
    await this.clock.sleep(this.restMs);
    this.since = this.clock.now();
  }
};

// src/page-files.ts
var PAGE_FILE_TYPE = "notebook_page";
var dirOf = (path) => {
  const i = path.lastIndexOf("/");
  return i < 0 ? "" : path.slice(0, i);
};
var baseOf = (path) => {
  const name = path.slice(path.lastIndexOf("/") + 1);
  return name.replace(/\.md$/i, "");
};
function front(text) {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  if (!text.startsWith(`---${eol}`)) return null;
  const end = text.indexOf(`${eol}---`, 3);
  if (end < 0) return null;
  const after = end + eol.length + 3;
  if (after < text.length && !text.startsWith(eol, after)) return null;
  return { lines: text.slice(3 + eol.length, end).split(eol), eol, rest: text.slice(after) };
}
var keyOf2 = (line) => {
  const i = line.indexOf(":");
  return i > 0 ? line.slice(0, i).trim() : "";
};
var quote = (s) => JSON.stringify(s);
function raw(text, key) {
  const f = front(text);
  if (!f) return void 0;
  const line = f.lines.find((l) => keyOf2(l) === key);
  return line === void 0 ? void 0 : line.slice(line.indexOf(":") + 1).trim();
}
var unquote = (v) => {
  if (v === void 0) return null;
  try {
    const x = JSON.parse(v);
    return typeof x === "string" ? x : null;
  } catch {
    return null;
  }
};
var isPageText = (text) => raw(text, "gr_type") === PAGE_FILE_TYPE;
var pageIdOf = (text) => isPageText(text) ? raw(text, "gr_id") ?? null : null;
function pageFieldsOf(text) {
  return { title: unquote(raw(text, "title")), section: unquote(raw(text, "section")) };
}
function notebookDirOf(path, text) {
  const here = dirOf(path);
  return pageFieldsOf(text).section ? dirOf(here) : here;
}
function setPageFields(text, set) {
  const f = front(text);
  if (!f) return text;
  const lines = [...f.lines];
  const put = (key, value, after) => {
    const at = lines.findIndex((l) => keyOf2(l) === key);
    if (value === null) {
      if (at >= 0) lines.splice(at, 1);
      return;
    }
    const line = `${key}: ${quote(value)}`;
    if (at >= 0) {
      lines[at] = line;
      return;
    }
    const prev = lines.findIndex((l) => keyOf2(l) === after);
    lines.splice(prev >= 0 ? prev + 1 : lines.length, 0, line);
  };
  if (set.title !== void 0) put("title", set.title, "instance_name");
  if (set.section !== void 0) put("section", set.section, "title");
  return `---${f.eol}${lines.join(f.eol)}${f.eol}---${f.rest}`;
}
function pageRenameOf(from, to, notebookDir) {
  const out = {};
  if (baseOf(from) !== baseOf(to)) out.title = baseOf(to);
  const was = dirOf(from);
  const now = dirOf(to);
  if (was !== now) {
    if (now === notebookDir) out.section = null;
    else if (dirOf(now) === notebookDir) out.section = now.slice(now.lastIndexOf("/") + 1);
  }
  return out.title === void 0 && out.section === void 0 ? null : out;
}

// ../../apps/api/src/auth/session-stamp.ts
var SESSION_STAMP_EVERY_MS = 10 * 60 * 1e3;

// src/couch-client.ts
var CouchError = class extends Error {
  constructor(kind, message, status = 0) {
    super(message);
    this.kind = kind;
    this.status = status;
  }
};
var COUCH_DB_NAME = /^[a-z][a-z0-9_$()+/-]*$/;
function base64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
var seqOf = (s) => typeof s === "number" ? String(s) : String(s ?? "0");
var CouchClient = class {
  constructor(cfg, request) {
    this.cfg = cfg;
    this.request = request;
  }
  server() {
    return this.cfg.url.trim().replace(/\/+$/, "");
  }
  dbPath(rest = "") {
    return `/${encodeURIComponent(this.cfg.db)}${rest}`;
  }
  async call(method, path, body) {
    const { status, json } = await this.send(method, path, "application/json", body);
    if (json === null || typeof json !== "object") {
      throw new CouchError("bad-answer", "The address answered, but not as a CouchDB server does.", status);
    }
    return { status, json };
  }
  /** One request, and the failures every answer is read for. The body of
   *  the answer comes back as text and, where it parses, as JSON. */
  async send(method, path, accept, body) {
    if (!this.cfg.url.trim()) throw new CouchError("not-set", "No CouchDB server is set.");
    const headers = { Accept: accept };
    if (this.cfg.user) {
      headers.Authorization = `Basic ${base64(`${this.cfg.user}:${this.cfg.password}`)}`;
    }
    let res;
    try {
      res = await this.request({
        url: this.server() + path,
        method,
        headers,
        ...body === void 0 ? {} : { body: JSON.stringify(body), contentType: "application/json" },
        throw: false
      });
    } catch (e) {
      throw new CouchError("unreachable", `The CouchDB server could not be reached (${e.message}).`);
    }
    let json = null;
    try {
      json = JSON.parse(res.text);
    } catch {
      json = null;
    }
    if (res.status === 401) {
      throw new CouchError("refused", "The CouchDB server refused the user name or password.", 401);
    }
    if (res.status === 403) {
      throw new CouchError("forbidden", `The CouchDB user may not do this${json?.reason ? `: ${json.reason}` : "."}`, 403);
    }
    if (res.status >= 500) {
      throw new CouchError("server", `The CouchDB server failed (${res.status}).`, res.status);
    }
    return { status: res.status, text: res.text, json };
  }
  requireName() {
    if (!COUCH_DB_NAME.test(this.cfg.db)) {
      throw new CouchError("bad-name", `"${this.cfg.db}" is not a CouchDB database name: lowercase letters, digits and _ $ ( ) + - / only, starting with a letter.`);
    }
  }
  /** Who the server says this device is. A wrong password is a 401 with
   *  Basic authentication; an anonymous session answers with no name. */
  async session() {
    const { json } = await this.call("GET", "/_session");
    const ctx = json.userCtx ?? {};
    return { name: typeof ctx.name === "string" ? ctx.name : null, roles: Array.isArray(ctx.roles) ? ctx.roles : [] };
  }
  /** The database, or null when there is none by that name. */
  async info() {
    this.requireName();
    const { status, json } = await this.call("GET", this.dbPath());
    if (status === 404) return null;
    return { docCount: Number(json.doc_count ?? 0), updateSeq: seqOf(json.update_seq) };
  }
  /** Make the database if it is not there. 412 is CouchDB saying it is. */
  async ensureDb() {
    this.requireName();
    const { status, json } = await this.call("PUT", this.dbPath());
    if (status === 201 || status === 202) return "created";
    if (status === 412) return "exists";
    throw new CouchError("bad-answer", `The database could not be made (${json.reason ?? status}).`, status);
  }
  /** What changed after `since`. With `longpollMs`, the server holds the
   *  request until something changes or the time passes. */
  async changes(opts = {}) {
    this.requireName();
    const q = new URLSearchParams();
    q.set("since", opts.since ?? "0");
    if (opts.limit) q.set("limit", String(opts.limit));
    if (opts.docs) {
      q.set("include_docs", "true");
      q.set("conflicts", "true");
    }
    if (opts.longpollMs !== void 0) {
      q.set("feed", "longpoll");
      q.set("timeout", String(opts.longpollMs));
    }
    const { status, json } = await this.call("GET", this.dbPath(`/_changes?${q}`));
    if (status === 404) throw new CouchError("no-database", `There is no database named "${this.cfg.db}" on the CouchDB server.`, 404);
    if (status >= 400 || !Array.isArray(json.results)) {
      throw new CouchError("bad-answer", `The changes feed answered ${status}.`, status);
    }
    return {
      results: json.results.map((r) => ({ ...r, seq: seqOf(r.seq) })),
      lastSeq: seqOf(json.last_seq),
      pending: Number(json.pending ?? 0)
    };
  }
  /** Write several documents. Each carries the revision it replaces (none
   *  for a new one); a stale one comes back as `conflict` and is not
   *  written, while the others are. */
  async bulkDocs(docs) {
    this.requireName();
    const { status, json } = await this.call("POST", this.dbPath("/_bulk_docs"), { docs });
    if (status === 404) throw new CouchError("no-database", `There is no database named "${this.cfg.db}" on the CouchDB server.`, 404);
    if (!Array.isArray(json)) throw new CouchError("bad-answer", `The bulk write answered ${status}.`, status);
    return json;
  }
  /** One document with the revisions it is in conflict with, or null. */
  async get(id) {
    this.requireName();
    const path = id.startsWith("_local/") ? this.dbPath(`/_local/${encodeURIComponent(id.slice(7))}`) : this.dbPath(`/${encodeURIComponent(id)}?conflicts=true`);
    const { status, json } = await this.call("GET", path);
    if (status === 404) return null;
    return json;
  }
  /** The body of attachment [name] on document [id] AT revision [rev], as
   *  text, or null when that revision has none by that name. The revision is
   *  named so the body read is the one the change feed reported, never a
   *  later write's. */
  /** Document [id] AT revision [rev] — a losing leaf CouchDB is holding
   *  beside the winner (row 2375) — or null when there is no such leaf. */
  async getRev(id, rev) {
    this.requireName();
    const { status, json } = await this.call("GET", this.dbPath(`/${encodeURIComponent(id)}?rev=${encodeURIComponent(rev)}`));
    if (status === 404) return null;
    if (status !== 200) throw new CouchError("bad-answer", `The document read answered ${status}.`, status);
    return json;
  }
  async attachment(id, name, rev) {
    this.requireName();
    const path = this.dbPath(`/${encodeURIComponent(id)}/${encodeURIComponent(name)}?rev=${encodeURIComponent(rev)}`);
    const { status, text } = await this.send("GET", path, "*/*");
    if (status === 404) return null;
    if (status !== 200) throw new CouchError("bad-answer", `The attachment read answered ${status}.`, status);
    return text;
  }
  /** The settings screen's question: reachable, signed in, and the
   *  database — said in one sentence, whichever part failed. */
  async check() {
    try {
      const me = await this.session();
      if (!me.name) {
        return { ok: false, detail: "The CouchDB server answered, but not as a signed-in user \u2014 set the user name and password." };
      }
      const db = await this.info();
      if (!db) {
        return { ok: true, detail: `Signed in to CouchDB as ${me.name}. There is no database named "${this.cfg.db}" yet; note sync makes it.` };
      }
      return { ok: true, detail: `Signed in to CouchDB as ${me.name}. "${this.cfg.db}" holds ${db.docCount} document${db.docCount === 1 ? "" : "s"}.` };
    } catch (e) {
      return { ok: false, detail: e.message };
    }
  }
};
var PULL_PAGE = 200;
var CouchDocSync = class {
  constructor(client) {
    this.client = client;
  }
  /** One page of what changed after `since`, with each document. `since`
   *  is handed back for the next call; `more` says to call again now. */
  async pull(since) {
    const page = await this.client.changes({ since, limit: PULL_PAGE, docs: true });
    const docs = page.results.filter((r) => !r.id.startsWith("_design/")).map((r) => ({
      id: r.id,
      rev: r.changes[0]?.rev ?? r.doc?._rev ?? "",
      deleted: r.deleted === true,
      doc: r.doc ?? null,
      conflicts: Array.isArray(r.doc?._conflicts) ? r.doc._conflicts : []
    }));
    return { docs, since: page.lastSeq, more: page.pending > 0 };
  }
  /** Write documents, each with the revision it replaces. A conflict is
   *  reported for that document alone and nothing is overwritten. */
  async push(docs) {
    if (!docs.length) return [];
    const res = await this.client.bulkDocs(docs);
    return docs.map((d) => {
      const r = res.find((x) => x.id === d._id);
      if (r && r.rev && !r.error) return { id: d._id, ok: true, rev: r.rev };
      if (r?.error === "conflict") return { id: d._id, ok: false, conflict: true };
      return { id: d._id, ok: false, conflict: false, reason: r ? `${r.error}: ${r.reason ?? ""}`.trim() : "no answer for this document" };
    });
  }
  /** Live sync's wait: true as soon as anything changes after `since`,
   *  false when `ms` passes with nothing. */
  async wait(since, ms2) {
    const page = await this.client.changes({ since, limit: 1, longpollMs: ms2 });
    return page.results.length > 0;
  }
};
function noteLiveBadge(state, detail) {
  switch (state) {
    case "off":
      return "";
    case "waiting":
      return "Notes \u{1F7E2} live";
    case "syncing":
      return "Notes \u23F3 syncing";
    case "failing":
      return `Notes \u{1F534} can't reach the server, trying again${detail ? ` (${detail})` : ""}`;
  }
}
var LIVE_WAIT_MS = 6e4;
var LIVE_BACKOFF_FIRST_MS = 1e3;
var LIVE_BACKOFF_MAX_MS = 6e4;
var LiveFollower = class {
  constructor(sync, opts) {
    this.sync = sync;
    this.opts = opts;
  }
  stopped = false;
  /** The delays between failed tries, newest last — for the badge and the tests. */
  backoffs = [];
  stop() {
    this.stopped = true;
  }
  async run() {
    const sleep = this.opts.sleep ?? ((ms2) => new Promise((r) => window.setTimeout(r, ms2)));
    let since = this.opts.since;
    let backoff = LIVE_BACKOFF_FIRST_MS;
    while (!this.stopped) {
      try {
        this.opts.onState?.("waiting");
        const arrived = await this.sync.wait(since, this.opts.waitMs ?? LIVE_WAIT_MS);
        if (this.stopped) break;
        if (arrived) {
          this.opts.onState?.("syncing");
          since = await this.opts.onChange(since);
        }
        backoff = LIVE_BACKOFF_FIRST_MS;
      } catch (e) {
        if (this.stopped) break;
        this.opts.onState?.("failing", e.message);
        this.backoffs.push(backoff);
        await sleep(backoff);
        backoff = Math.min(backoff * 2, LIVE_BACKOFF_MAX_MS);
      }
    }
  }
};

// src/note-sync.ts
var NOTE_SYNC_KINDS = ["off", "couchdb"];
var NOTE_SYNC_LABELS = {
  off: "Off",
  couchdb: "A CouchDB server"
};
var NOTE_SYNC_MAX_BYTES = 50 * 1024 * 1024;
function inNoteSyncScope(path) {
  if (!path || path.startsWith("/")) return false;
  const parts = path.split("/");
  return parts.every((p) => p.length > 0 && !p.startsWith("."));
}

// src/sync-config.ts
var SETTINGS_NOTE_PATH = "Graphite/Sync settings.md";
var NOTE_KEYS = [
  { key: "serverUrl", kind: { kind: "url" }, label: "Graphite server" },
  { key: "source", kind: { kind: "choice", options: ["server", "device", "computer"] }, label: "Where Graphite is" },
  { key: "layout", kind: { kind: "choice", options: ["folder", "single"] }, label: "How a pulled space lands" },
  { key: "mirrorAll", kind: { kind: "bool" }, label: "Bring in every space" },
  { key: "hideIds", kind: { kind: "bool" }, label: "Hide sync ids" },
  { key: "autoPush", kind: { kind: "bool" }, label: "Auto-push on save" },
  { key: "captureAnyTagged", kind: { kind: "bool" }, label: "Capture any tagged line as a note" },
  { key: "captureTags", kind: { kind: "text" }, label: "Tags that capture a line" },
  { key: "autoCapture", kind: { kind: "bool" }, label: "Capture automatically" },
  { key: "pagesOn", kind: { kind: "bool" }, label: "Send notes to Graphite as pages" },
  { key: "pageFolders", kind: { kind: "text" }, label: "Folders whose notes become pages" },
  { key: "censusOn", kind: { kind: "bool" }, label: "Send the vault census" },
  { key: "agentOn", kind: { kind: "bool" }, label: "Publish the agent contract" },
  { key: "agentFolders", kind: { kind: "text" }, label: "Folders the agent may read" },
  { key: "barOn", kind: { kind: "bool" }, label: "Show the Graphite bar" },
  { key: "barHeading", kind: { kind: "text" }, label: "Heading words for a started list" },
  { key: "barShare", kind: { kind: "bool" }, label: "Share the picker lists with other devices" },
  { key: "noteSync", kind: { kind: "choice", options: ["off", "couchdb"] }, label: "Note sync" },
  { key: "couchUrl", kind: { kind: "url" }, label: "CouchDB server" },
  { key: "couchDb", kind: { kind: "text" }, label: "CouchDB database" },
  { key: "couchUser", kind: { kind: "text" }, label: "CouchDB user" },
  { key: "liveSync", kind: { kind: "bool" }, label: "Live sync" }
];
var SECRET_KEYS = ["token", "couchPassword", "couchPassphrase"];
var KEPT_OUT = {
  vaultId: "the vault identity: a copied note must not make two vaults one to the server",
  configFile: "the switch for this note itself",
  files: "which notes are synced spaces, kept by the plugin as it pulls",
  spacesSeen: "the spaces this vault has already been offered, so one the person stopped syncing is not brought back: kept per vault",
  bases: "the text each synced note had when the server last wrote it, kept per device so a push can say what changed here",
  ticks: "the last agreed state of each captured line",
  pageModules: "the Notes module chosen for each page folder: module ids belong to one server, so each device keeps its own",
  pagesSent: "each note sent as a page and the fingerprint of the text last sent, kept per device",
  routingList: "the plugin copy of the routing list",
  routeCache: "the spaces the route picker last saw",
  toolbarCache: "the spaces, people and tags the bar pickers last saw",
  routeRecent: "the spaces most recently routed to",
  noteSyncState: "what note sync last agreed with its server, kept per device"
};
var KNOWN = new Map(NOTE_KEYS.map((k) => [k.key, k]));
var BARE = /^[A-Za-z0-9_./@+-][A-Za-z0-9 _./:@,+()-]*$/;
function writeValue(v) {
  if (typeof v === "boolean") return v ? "true" : "false";
  const s = String(v ?? "");
  if (s === "") return '""';
  if (BARE.test(s) && !s.includes(": ") && !/^(true|false|null|yes|no|~)$/i.test(s) && s === s.trim()) return s;
  return JSON.stringify(s);
}
var DEFAULT_BODY = [
  "# Graphite Sync settings",
  "",
  "This note holds this vault\u2019s Graphite Sync settings, as the properties above. Change one here and the plugin takes it; change one in the settings screen and this note follows.",
  "",
  "To set up another device, copy this note to the same place in that vault, then turn on \u201CKeep settings in a note\u201D in the Graphite Sync settings, or run \u201CRead settings from the settings note\u201D.",
  "",
  "The API token, the CouchDB password and the encryption passphrase are not written here. Enter them in the settings screen on each device.",
  ""
].join("\n");
function frontmatter(lines) {
  if (lines[0]?.trim() !== "---") return null;
  for (let i = 1; i < lines.length; i++) if (lines[i].trim() === "---") return { from: 0, to: i };
  return null;
}
function settingsNoteText(settings, previous = null) {
  const props = NOTE_KEYS.map((k) => `${k.key}: ${writeValue(settings[k.key])}`);
  if (previous === null) return ["---", ...props, "---", DEFAULT_BODY].join("\n");
  const lines = previous.split("\n");
  const fm = frontmatter(lines);
  if (!fm) return ["---", ...props, "---", previous].join("\n");
  const foreign = lines.slice(1, fm.to).filter((l) => {
    const m = /^([A-Za-z_][\w-]*)\s*:/.exec(l);
    return !m || !KNOWN.has(m[1]) && !SECRET_KEYS.includes(m[1]) && !(m[1] in KEPT_OUT);
  });
  return ["---", ...props, ...foreign, ...lines.slice(fm.to)].join("\n");
}
function readValue(raw2) {
  const t = raw2.trim();
  if (t.startsWith('"')) {
    try {
      return String(JSON.parse(t));
    } catch {
      return t;
    }
  }
  if (t.length >= 2 && t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1).replace(/''/g, "'");
  return t;
}
function readSettingsNote(text) {
  const values = {};
  const problems = [];
  const lines = text.split("\n");
  const fm = frontmatter(lines);
  if (!fm) {
    problems.push("The note has no properties block (a --- line, the settings, and a --- line) at its top.");
    return { values, problems };
  }
  for (let i = fm.from + 1; i < fm.to; i++) {
    const line = lines[i];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (/^\s/.test(line) || line.startsWith("-")) continue;
    const m = /^([A-Za-z_][\w-]*)\s*:(.*)$/.exec(line);
    if (!m) {
      problems.push(`Line ${i + 1}: not a setting line (name: value).`);
      continue;
    }
    const [, key, raw2] = m;
    if (SECRET_KEYS.includes(key)) {
      problems.push(`Line ${i + 1}: ${key} is a secret and is not read from a note \u2014 enter it in the settings screen.`);
      continue;
    }
    const spec = KNOWN.get(key);
    if (!spec) {
      if (key in KEPT_OUT) problems.push(`Line ${i + 1}: ${key} is not read from a note \u2014 it is ${KEPT_OUT[key]}.`);
      continue;
    }
    const v = readValue(raw2);
    switch (spec.kind.kind) {
      case "bool":
        if (v === "true" || v === "false") values[key] = v === "true";
        else problems.push(`Line ${i + 1}: ${key} is true or false, not "${v}".`);
        break;
      case "choice":
        if (spec.kind.options.includes(v)) values[key] = v;
        else problems.push(`Line ${i + 1}: ${key} is one of ${spec.kind.options.join(", ")}, not "${v}".`);
        break;
      case "url":
        if (v === "" || /^https?:\/\/\S+$/.test(v)) values[key] = v;
        else problems.push(`Line ${i + 1}: ${key} is an address starting http:// or https://, not "${v}".`);
        break;
      default:
        values[key] = v;
    }
  }
  return { values, problems };
}
function noteMatches(settings, text) {
  const { values } = readSettingsNote(text);
  return NOTE_KEYS.every((k) => k.key in values && values[k.key] === settings[k.key]);
}

// src/pages.ts
function parseFolders(setting) {
  return (setting ?? "").split(/[,\n]/).map((f) => f.trim().replace(/^\/+|\/+$/g, "")).filter(Boolean);
}
function inPageFolder(path, setting) {
  return parseFolders(setting).some((f) => path.startsWith(`${f}/`));
}
function hasRoutingHeading(text) {
  const lines = text.split("\n");
  const fm = frontmatterRange(lines);
  let fence = false;
  for (let i = fm ? fm[1] + 1 : 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (/^(```|~~~)/.test(t)) {
      fence = !fence;
      continue;
    }
    if (!fence && /^#{1,6}\s.*>>\s*\S/.test(t)) return true;
  }
  return false;
}
function pageModuleFor(path, setting, modules) {
  let best = "";
  for (const f of parseFolders(setting)) {
    if (path.startsWith(`${f}/`) && f.length > best.length) best = f;
  }
  if (!best) return void 0;
  const id = modules?.[best];
  return typeof id === "string" && id ? id : void 0;
}
function isPage(path, text, folders) {
  return inPageFolder(path, folders) || hasRoutingHeading(text);
}
function fingerprint(text) {
  let h1 = 3735928559, h2 = 1103547991;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
var PageSync = class {
  constructor(host) {
    this.host = host;
  }
  timers = /* @__PURE__ */ new Map();
  flying = /* @__PURE__ */ new Map();
  /** Said once per path per session, not at every keystroke. */
  told = /* @__PURE__ */ new Set();
  register() {
    const touched = (f) => {
      const p = f?.path;
      if (p && /\.md$/i.test(p)) this.soon(p);
    };
    this.host.watch("modify", touched);
    this.host.watch("create", touched);
    this.host.watch("rename", (f, from) => {
      const p = f?.path;
      if (p && /\.md$/i.test(p) && typeof from === "string") void this.renamed(p, from);
    });
    this.host.watch("delete", (f) => {
      const p = f?.path;
      if (p) void this.deleted(p);
    });
  }
  eligible(path) {
    return this.host.on() && !this.host.excluded(path);
  }
  /** A note changed: send it after it has sat still. */
  soon(path) {
    if (!this.eligible(path)) return;
    if (inPageFolder(path, this.host.folders())) {
      this.arm(path);
      return;
    }
    void this.host.read(path).then((text) => {
      if (text !== null && hasRoutingHeading(text)) this.arm(path);
      else if (this.timers.has(path)) this.disarm(path);
    });
  }
  arm(path) {
    this.host.clearTimeout(this.timers.get(path));
    this.timers.set(path, this.host.setTimeout(() => {
      if (this.host.isOpen(path)) {
        this.arm(path);
        return;
      }
      this.timers.delete(path);
      void this.send(path);
    }, this.host.delay()));
  }
  /** The note stopped being a page candidate while waiting (its heading was
   *  deleted): the wait goes, and a page already sent stays until it is
   *  deleted or renamed, as before. */
  disarm(path) {
    this.host.clearTimeout(this.timers.get(path));
    this.timers.delete(path);
  }
  /** Send [path] as a page if it is one. True when Graphite holds its
   *  current text afterwards - a capture then names the page. */
  send(path, oldPath) {
    const running = this.flying.get(path);
    if (running) return running;
    const p = this.sendNow(path, oldPath).finally(() => this.flying.delete(path));
    this.flying.set(path, p);
    return p;
  }
  async sendNow(path, oldPath) {
    if (!this.eligible(path)) return false;
    const text = await this.host.read(path);
    if (text === null) return false;
    if (!isPage(path, text, this.host.folders())) return false;
    const moduleId = this.host.moduleFor(path);
    const print = fingerprint(text) + (moduleId ? `@${moduleId}` : "");
    const prior = this.host.sent[path] ?? (oldPath ? this.host.sent[oldPath] : void 0);
    if (this.host.sent[path] === print && !oldPath) return true;
    const where = moduleId ? { moduleId } : prior?.includes("@") ? { moduleId: null } : {};
    const res = await this.host.send("PUT", {
      path,
      content: text,
      vaultName: this.host.vaultName(),
      ...where,
      ...oldPath ? { oldPath } : {}
    });
    if (res.status >= 300) {
      if (!this.told.has(path)) {
        this.told.add(path);
        this.host.say(`Graphite: ${path} was not sent as a page - ${res.message ?? `status ${res.status}`}`);
      }
      return false;
    }
    this.told.delete(path);
    this.host.sent[path] = print;
    if (oldPath) delete this.host.sent[oldPath];
    await this.host.save();
    return true;
  }
  /** The page reference a capture of [path] carries: sent first, then named. */
  async beforeCapture(path) {
    return await this.send(path) ? path : null;
  }
  /** Renamed in the vault: the page moves with it. A note that is no longer
   *  a page where it now sits takes the page away (to the Bin). */
  async renamed(path, from) {
    if (!this.host.on()) return;
    if (this.host.excluded(path)) {
      await this.deleted(from);
      return;
    }
    const was = from in this.host.sent;
    const sent = await this.send(path, was ? from : void 0);
    if (!sent && was) await this.erase(from);
  }
  /** Deleted in the vault. Only a note the plugin has sent is told about:
   *  the path of any other note is nobody's business. */
  async deleted(path) {
    if (!(path in this.host.sent)) return;
    await this.erase(path);
  }
  async erase(path) {
    if (!this.host.on()) return;
    const res = await this.host.send("DELETE", { path });
    if (res.status < 300) {
      delete this.host.sent[path];
      await this.host.save();
    } else {
      this.host.say(`Graphite: the page for ${path} was not removed - ${res.message ?? `status ${res.status}`}`);
    }
  }
};

// src/note-crypto.ts
var NOTE_FORMAT = "graphite-sync";
var NOTE_FORMAT_VERSION = 1;
var PARAMS_DOC_ID = "graphite-sync";
var NOTE_DOC_PREFIX = "f:";
var NOTE_KDF = "PBKDF2-SHA-256";
var NOTE_KDF_ITERATIONS = 6e5;
var NONCE_BYTES = 12;
var TAG_BYTES = 16;
var SALT_BYTES = 16;
var CHECK_PHRASE = "graphite-sync: the passphrase opens this database";
var subtle = () => globalThis.crypto.subtle;
var utf8 = new TextEncoder();
var fromUtf8 = new TextDecoder("utf-8", { fatal: false });
function buf(u) {
  return u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength);
}
function randomBytes(n) {
  const out = new Uint8Array(n);
  globalThis.crypto.getRandomValues(out);
  return out;
}
function bytesToBase64(b) {
  let bin = "";
  const STEP = 32768;
  for (let i = 0; i < b.length; i += STEP) {
    bin += String.fromCharCode.apply(null, Array.from(b.subarray(i, i + STEP)));
  }
  return btoa(bin);
}
function base64ToBytes(s) {
  try {
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}
async function sha256Hex(b) {
  return hex(new Uint8Array(await subtle().digest("SHA-256", buf(b))));
}
function hex(b) {
  let s = "";
  for (const x of b) s += x.toString(16).padStart(2, "0");
  return s;
}
var DERIVED = /* @__PURE__ */ new Map();
var NoteKey = class _NoteKey {
  constructor(aes, mac) {
    this.aes = aes;
    this.mac = mac;
  }
  /** The passphrase is normalised (NFC) first, so the same words typed on
   *  a Mac and on a phone are the same key.
   *
   *  REMEMBERED FOR THE SESSION. 600,000 rounds take about a second on a
   *  phone, and live sync runs after every change; deriving once per run
   *  would spend that second every time. The passphrase is in memory
   *  already (it is a setting), so keeping the key it derives beside it
   *  holds nothing new. */
  static derive(passphrase, salt, iterations) {
    const id = JSON.stringify([passphrase.normalize("NFC"), bytesToBase64(salt), iterations]);
    let key = DERIVED.get(id);
    if (!key) {
      if (DERIVED.size >= 8) DERIVED.clear();
      key = _NoteKey.deriveNow(passphrase, salt, iterations);
      DERIVED.set(id, key);
      key.catch(() => DERIVED.delete(id));
    }
    return key;
  }
  static async deriveNow(passphrase, salt, iterations) {
    const base = await subtle().importKey("raw", buf(utf8.encode(passphrase.normalize("NFC"))), "PBKDF2", false, ["deriveBits"]);
    const bits = new Uint8Array(await subtle().deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt: buf(salt), iterations },
      base,
      512
    ));
    const aes = await subtle().importKey("raw", buf(bits.subarray(0, 32)), { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
    const mac = await subtle().importKey("raw", buf(bits.subarray(32, 64)), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    return new _NoteKey(aes, mac);
  }
  /** nonce + ciphertext + tag, as the relay lays it out. */
  async seal(clear) {
    const nonce = randomBytes(NONCE_BYTES);
    const box = new Uint8Array(await subtle().encrypt({ name: "AES-GCM", iv: buf(nonce) }, this.aes, buf(clear)));
    const out = new Uint8Array(NONCE_BYTES + box.length);
    out.set(nonce, 0);
    out.set(box, NONCE_BYTES);
    return out;
  }
  /** The inverse of seal; null when it does not open. */
  async open(raw2) {
    if (raw2.length < NONCE_BYTES + TAG_BYTES) return null;
    try {
      return new Uint8Array(await subtle().decrypt(
        { name: "AES-GCM", iv: buf(raw2.subarray(0, NONCE_BYTES)) },
        this.aes,
        buf(raw2.subarray(NONCE_BYTES))
      ));
    } catch {
      return null;
    }
  }
  /** The document a path lives in: the same on every device, and nothing
   *  the server can turn back into the name. */
  async idFor(path) {
    const sig = new Uint8Array(await subtle().sign("HMAC", this.mac, buf(utf8.encode(path))));
    return NOTE_DOC_PREFIX + hex(sig);
  }
};
async function newParams(passphrase) {
  const salt = randomBytes(SALT_BYTES);
  const key = await NoteKey.derive(passphrase, salt, NOTE_KDF_ITERATIONS);
  const check = bytesToBase64(await key.seal(utf8.encode(CHECK_PHRASE)));
  return {
    params: {
      _id: PARAMS_DOC_ID,
      format: NOTE_FORMAT,
      v: NOTE_FORMAT_VERSION,
      kdf: NOTE_KDF,
      iterations: NOTE_KDF_ITERATIONS,
      salt: bytesToBase64(salt),
      check
    },
    key
  };
}
async function openParams(doc, passphrase) {
  if (doc.format !== NOTE_FORMAT) {
    return { problem: "This database was not made by Graphite Sync. Choose a new database name (the LiveSync one stays as it is)." };
  }
  if (doc.v !== NOTE_FORMAT_VERSION || doc.kdf !== NOTE_KDF) {
    return { problem: `This database is in a newer Graphite Sync format (${String(doc.v)}). Update the plugin on this device.` };
  }
  const iterations = Number(doc.iterations);
  if (!Number.isInteger(iterations) || iterations < NOTE_KDF_ITERATIONS) {
    return { problem: "This database asks for a weaker key than Graphite Sync allows, so nothing was opened or sent." };
  }
  const salt = base64ToBytes(String(doc.salt ?? ""));
  const check = base64ToBytes(String(doc.check ?? ""));
  if (!salt || salt.length < SALT_BYTES || !check) {
    return { problem: "The parameters document in this database is damaged, so nothing was opened or sent." };
  }
  const key = await NoteKey.derive(passphrase, salt, iterations);
  const opened = await key.open(check);
  if (!opened || fromUtf8.decode(opened) !== CHECK_PHRASE) {
    return { problem: "The encryption passphrase does not open the notes in this database. Nothing was read or sent." };
  }
  return { key };
}
async function sealFile(key, f) {
  const header = utf8.encode(JSON.stringify({ v: NOTE_FORMAT_VERSION, path: f.path, mtime: f.mtime, deleted: f.deleted }));
  const body = f.deleted || !f.content ? new Uint8Array(0) : f.content;
  const clear = new Uint8Array(4 + header.length + body.length);
  new DataView(clear.buffer).setUint32(0, header.length);
  clear.set(header, 4);
  clear.set(body, 4 + header.length);
  return bytesToBase64(await key.seal(clear));
}
async function openFile(key, sealed) {
  const raw2 = base64ToBytes(sealed);
  if (!raw2) return null;
  const clear = await key.open(raw2);
  if (!clear || clear.length < 4) return null;
  const len = new DataView(clear.buffer, clear.byteOffset, clear.byteLength).getUint32(0);
  if (4 + len > clear.length) return null;
  try {
    const h = JSON.parse(fromUtf8.decode(clear.subarray(4, 4 + len)));
    if (typeof h.path !== "string") return null;
    const deleted = h.deleted === true;
    return {
      path: h.path,
      mtime: Number(h.mtime) || 0,
      deleted,
      content: deleted ? null : clear.slice(4 + len)
    };
  } catch {
    return null;
  }
}

// src/couch-notes.ts
var PUSH_BATCH_BYTES = 8 * 1024 * 1024;
var PUSH_BATCH_DOCS = 100;
var INLINE_SEAL_MAX = 6e6;
var SEAL_ATTACHMENT = "sealed";
var NoteSyncRefusal = class extends Error {
};
var CouchNoteTransport = class {
  constructor(client, passphrase) {
    this.client = client;
    this.passphrase = passphrase;
    this.docs = new CouchDocSync(client);
  }
  kind = "couchdb";
  docs;
  key = null;
  /** Names this database for the sync state: a new salt is a new database,
   *  and nothing remembered about the old one may be trusted. */
  identity = "";
  check() {
    return this.client.check();
  }
  /** Make the database if it is not there, and open it with the
   *  passphrase. Throws NoteSyncRefusal (or CouchError) with a sentence. */
  async open() {
    if (this.key) return;
    if (!this.passphrase) {
      throw new NoteSyncRefusal("Enter the encryption passphrase in the Graphite Sync settings. Nothing was sent.");
    }
    await this.client.ensureDb();
    let params = await this.client.get(PARAMS_DOC_ID);
    if (!params) {
      const info = await this.client.info();
      if (info && info.docCount > 0) {
        throw new NoteSyncRefusal("This database already holds documents Graphite Sync did not write (a LiveSync database?). Choose a new database name: nothing was written to this one.");
      }
      const made = await newParams(this.passphrase);
      const [w] = await this.docs.push([made.params]);
      if (w.ok) {
        this.key = made.key;
        this.identity = made.params.salt;
        return;
      }
      params = await this.client.get(PARAMS_DOC_ID);
      if (!params) throw new NoteSyncRefusal("The parameters document could not be written or read back.");
    }
    const opened = await openParams(params, this.passphrase);
    if ("problem" in opened) throw new NoteSyncRefusal(opened.problem);
    this.key = opened.key;
    this.identity = String(params.salt);
  }
  async opened() {
    await this.open();
    return this.key;
  }
  async pull(cursor) {
    const key = await this.opened();
    const page = await this.docs.pull(cursor);
    const files = [];
    let unreadable = 0;
    for (const d of page.docs) {
      if (!d.id.startsWith(NOTE_DOC_PREFIX)) continue;
      let sealed = d.doc && typeof d.doc.sealed === "string" ? d.doc.sealed : null;
      if (!sealed && hasSealAttachment(d.doc)) {
        sealed = await this.client.attachment(d.id, SEAL_ATTACHMENT, d.rev);
      }
      if (!sealed) continue;
      const body = await openFile(key, sealed);
      if (!body || await key.idFor(body.path) !== d.id) {
        unreadable += 1;
        continue;
      }
      const others = [];
      for (const rev of d.conflicts) {
        const leaf = await this.client.getRev(d.id, rev);
        let s = leaf && typeof leaf.sealed === "string" ? leaf.sealed : null;
        if (!s && hasSealAttachment(leaf)) s = await this.client.attachment(d.id, SEAL_ATTACHMENT, rev);
        const o = s ? await openFile(key, s) : null;
        if (!o || o.path !== body.path) {
          unreadable += 1;
          continue;
        }
        others.push({ path: o.path, content: o.content, mtime: o.mtime, deleted: o.deleted, version: rev });
      }
      files.push({
        path: body.path,
        content: body.content,
        mtime: body.mtime,
        deleted: body.deleted,
        version: d.rev,
        ...others.length ? { others } : {}
      });
    }
    return { files, cursor: page.since, more: page.more, unreadable };
  }
  async push(files) {
    const key = await this.opened();
    const out = [];
    let batch = [];
    let bytes = 0;
    const flush = async () => {
      if (!batch.length) return;
      const res = await this.docs.push(batch.map((b) => b.doc));
      res.forEach((r, i) => {
        const path = batch[i].path;
        if (r.ok) out.push({ path, ok: true, version: r.rev });
        else if (r.conflict) out.push({ path, ok: false, conflict: true });
        else out.push({ path, ok: false, conflict: false, reason: `the CouchDB server refused it (${r.reason})` });
      });
      batch = [];
      bytes = 0;
    };
    for (const f of files) {
      const sealed = await sealFile(key, { path: f.path, mtime: f.mtime, deleted: f.deleted, content: f.content });
      const doc = sealed.length > INLINE_SEAL_MAX ? {
        _id: await key.idFor(f.path),
        _attachments: {
          [SEAL_ATTACHMENT]: {
            content_type: "text/plain",
            data: bytesToBase64(new TextEncoder().encode(sealed))
          }
        }
      } : { _id: await key.idFor(f.path), sealed };
      if (f.base) doc._rev = f.base;
      if (batch.length && (bytes + sealed.length > PUSH_BATCH_BYTES || batch.length >= PUSH_BATCH_DOCS)) await flush();
      batch.push({ doc, path: f.path });
      bytes += sealed.length;
    }
    await flush();
    return out;
  }
  /** Row 2375: the losing leaves of [path] are ended (each its own
   *  _deleted revision), so CouchDB stops holding the conflict. Called
   *  only after the engine has kept them as conflict copies. */
  async settle(path, versions) {
    if (!versions.length) return;
    const key = await this.opened();
    const id = await key.idFor(path);
    await this.docs.push(versions.map((rev) => ({ _id: id, _rev: rev, _deleted: true })));
  }
  wait(cursor, ms2) {
    return this.docs.wait(cursor, ms2);
  }
};
function hasSealAttachment(doc) {
  const atts = doc?._attachments;
  return !!atts && typeof atts === "object" && SEAL_ATTACHMENT in atts;
}

// src/note-merge.ts
var MERGE_MAX_CELLS = 4e6;
function splitLines(text) {
  const out = [];
  let at = 0;
  for (; ; ) {
    const nl = text.indexOf("\n", at);
    if (nl < 0) {
      if (at < text.length) out.push(text.slice(at));
      return out;
    }
    out.push(text.slice(at, nl + 1));
    at = nl + 1;
  }
}
function hunks(a, b) {
  let pre = 0;
  while (pre < a.length && pre < b.length && a[pre] === b[pre]) pre++;
  let suf = 0;
  while (suf < a.length - pre && suf < b.length - pre && a[a.length - 1 - suf] === b[b.length - 1 - suf]) suf++;
  const A = a.slice(pre, a.length - suf);
  const B = b.slice(pre, b.length - suf);
  const n = A.length;
  const m = B.length;
  if (n === 0 && m === 0) return [];
  if ((n + 1) * (m + 1) > MERGE_MAX_CELLS) return null;
  const w = m + 1;
  const lcs = new Uint32Array((n + 1) * w);
  for (let i2 = n - 1; i2 >= 0; i2--) {
    for (let j2 = m - 1; j2 >= 0; j2--) {
      lcs[i2 * w + j2] = A[i2] === B[j2] ? lcs[(i2 + 1) * w + j2 + 1] + 1 : Math.max(lcs[(i2 + 1) * w + j2], lcs[i2 * w + j2 + 1]);
    }
  }
  const out = [];
  let i = 0;
  let j = 0;
  let open = null;
  const close = () => {
    if (open) {
      out.push(open);
      open = null;
    }
  };
  while (i < n || j < m) {
    if (i < n && j < m && A[i] === B[j]) {
      close();
      i++;
      j++;
      continue;
    }
    if (!open) open = { from: pre + i, to: pre + i, lines: [] };
    if (j < m && (i >= n || lcs[i * w + j + 1] >= lcs[(i + 1) * w + j])) {
      open.lines.push(B[j]);
      j++;
    } else {
      i++;
      open.to = pre + i;
    }
  }
  close();
  return out;
}
var same = (x, y) => x.from === y.from && x.to === y.to && x.lines.length === y.lines.length && x.lines.every((l, k) => l === y.lines[k]);
var touch = (x, y, adjacentOk) => {
  if (!adjacentOk) return x.from <= y.to && y.from <= x.to;
  if (x.from < y.to && y.from < x.to) return true;
  return x.from === x.to && y.from === y.to && x.from === y.from;
};
function mergeLines(base, ours, theirs, opts = {}) {
  if (ours === theirs) return { clean: true, text: ours };
  if (ours === base) return { clean: true, text: theirs };
  if (theirs === base) return { clean: true, text: ours };
  const b = splitLines(base);
  const mine = hunks(b, splitLines(ours));
  const yours = hunks(b, splitLines(theirs));
  if (!mine || !yours) return { clean: false };
  const all = [];
  for (const h of mine) {
    const clash = yours.find((y) => touch(h, y, !!opts.adjacent));
    if (clash && !same(h, clash)) return { clean: false };
    all.push(h);
  }
  for (const y of yours) if (!mine.some((h) => same(h, y))) all.push(y);
  all.sort((x, y) => x.from - y.from || x.to - y.to);
  const out = [];
  let at = 0;
  for (const h of all) {
    out.push(...b.slice(at, h.from), ...h.lines);
    at = h.to;
  }
  out.push(...b.slice(at));
  return { clean: true, text: out.join("") };
}
var MARKER_ONLY = new RegExp("^(?:" + LP_ID_RE.source + ")$");
var HAS_ID = new RegExp(LP_ID_RE.source);
var eolOf = (line) => /\r?\n$/.exec(line)?.[0] ?? "";
function carryIds(pushed, typed, canonical) {
  const p = splitLines(pushed);
  const t = splitLines(typed);
  const c = splitLines(canonical);
  const typedHunks = hunks(p, t);
  const canonHunks = hunks(p, c);
  if (!typedHunks || !canonHunks) return typed;
  const marker = /* @__PURE__ */ new Map();
  for (const h of canonHunks) {
    if (h.to - h.from !== h.lines.length) continue;
    h.lines.forEach((cl, k) => {
      const was = p[h.from + k].replace(/\r?\n$/, "");
      const now = cl.replace(/\r?\n$/, "");
      if (!now.startsWith(was)) return;
      const rest = now.slice(was.length);
      if (rest && MARKER_ONLY.test(rest)) marker.set(h.from + k, rest);
    });
  }
  if (!marker.size) return typed;
  const out = [...t];
  let shift = 0;
  for (const h of typedHunks) {
    if (h.to - h.from === h.lines.length) {
      h.lines.forEach((tl, k) => {
        const m = marker.get(h.from + k);
        if (!m || HAS_ID.test(tl)) return;
        const body = tl.replace(/\r?\n$/, "");
        out[h.from + k + shift] = body + m + eolOf(tl);
      });
    }
    shift += h.lines.length - (h.to - h.from);
  }
  return out.join("");
}

// src/note-engine.ts
var mergeable = (path) => /\.(md|txt)$/i.test(path);
var utf82 = (bytes) => {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
};
var emptyNoteSyncState = (target = "") => ({ target, cursor: null, files: {} });
var ZERO = () => ({ received: [], sent: [], trashed: [], conflicts: [], moved: [], merged: [], kept: [], refused: [], unreadable: 0 });
var pad = (n) => String(n).padStart(2, "0");
function conflictCopyPath(path, at, taken) {
  const slash = path.lastIndexOf("/");
  const dir = path.slice(0, slash + 1);
  const name = path.slice(slash + 1);
  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  const stamp = `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())} ${pad(at.getHours())}${pad(at.getMinutes())}`;
  for (let n = 1; ; n++) {
    const p = `${dir}${stem} (conflict ${stamp}${n > 1 ? ` ${n}` : ""})${ext}`;
    if (!taken(p)) return p;
  }
}
var NoteSyncEngine = class {
  constructor(transport, vault, state, now = () => /* @__PURE__ */ new Date(), bases = null) {
    this.transport = transport;
    this.vault = vault;
    this.state = state;
    this.now = now;
    this.bases = bases;
  }
  report = ZERO();
  /** The base a later merge starts from: the bytes just agreed, for a note;
   *  nothing for a deletion or an attachment. */
  async keepBase(path, content) {
    if (!this.bases || !mergeable(path)) return;
    if (content) await this.bases.put(path, content);
    else await this.bases.drop(path);
  }
  async run() {
    this.report = ZERO();
    await this.receiveAll();
    const moved = await this.sendChanged();
    if (moved) {
      await this.receiveAll();
      await this.sendChanged();
    }
    return this.report;
  }
  async receiveAll() {
    for (; ; ) {
      const page = await this.transport.pull(this.state.cursor);
      this.report.unreadable += page.unreadable ?? 0;
      const taken = await this.receiveMoves(page.files);
      for (const f of page.files) {
        if (!taken.has(f)) await this.receive(f);
        if (f.others?.length) await this.keepOthers(f);
      }
      this.state.cursor = page.cursor;
      if (!page.more) break;
    }
  }
  /**
   * RENAMES AS ONE MOVE (row 2375). A rename on another device arrives as
   * two documents — the old path's tombstone and the new path's file, with
   * the same bytes — because a document's id is the HMAC of its path. Taken
   * one at a time they trash the note here and write a copy of it, so the
   * vault trash fills with every note ever renamed and anything that pointed
   * at the old file in this vault's own state is lost. Here a pair is moved
   * instead, when it can only be a move: the old file is unchanged here
   * since it was agreed, the new path is empty here and was never agreed,
   * and the arriving bytes are exactly the old file's.
   *
   * WITHIN ONE PAGE OF THE CHANGES FEED. A device sends both halves in one
   * push, so they arrive together; a pair split across two pages (a vault
   * renaming more than a page of files at once) is taken the old way, a
   * trash and a new file, and nothing is lost either way.
   */
  async receiveMoves(files) {
    const taken = /* @__PURE__ */ new Set();
    if (!this.vault.rename) return taken;
    const arrivals = /* @__PURE__ */ new Map();
    for (const f of files) {
      if (f.deleted || !f.content || !inNoteSyncScope(f.path)) continue;
      const rec = this.state.files[f.path];
      if (rec && rec.hash !== "" || await this.vault.read(f.path)) continue;
      const h = await sha256Hex(f.content);
      arrivals.set(h, [...arrivals.get(h) ?? [], f]);
    }
    if (!arrivals.size) return taken;
    for (const gone of files) {
      if (!gone.deleted || !inNoteSyncScope(gone.path)) continue;
      const rec = this.state.files[gone.path];
      if (!rec || rec.hash === "" || rec.version === gone.version) continue;
      const local = await this.vault.read(gone.path);
      if (!local || await sha256Hex(local) !== rec.hash) continue;
      const to = arrivals.get(rec.hash)?.shift();
      if (!to) continue;
      await this.vault.rename(gone.path, to.path);
      this.state.files[gone.path] = { version: gone.version, hash: "" };
      this.state.files[to.path] = { version: to.version, hash: rec.hash };
      await this.keepBase(gone.path, null);
      await this.keepBase(to.path, to.content);
      this.report.moved.push({ from: gone.path, to: to.path });
      taken.add(gone).add(to);
    }
    return taken;
  }
  async receive(remote) {
    const path = remote.path;
    if (!inNoteSyncScope(path)) return;
    const rec = this.state.files[path];
    if (rec && rec.version === remote.version) return;
    const local = await this.vault.read(path);
    const localHash = local ? await sha256Hex(local) : "";
    const remoteHash = remote.deleted || !remote.content ? "" : await sha256Hex(remote.content);
    const agree = (hash2) => {
      this.state.files[path] = { version: remote.version, hash: hash2 };
    };
    if (localHash === remoteHash) {
      agree(remoteHash);
      await this.keepBase(path, remote.deleted ? null : remote.content ?? null);
      return;
    }
    const changedHere = rec ? localHash !== rec.hash : local !== null;
    if (!changedHere) {
      if (remote.deleted) {
        if (local) {
          await this.vault.trash(path);
          this.report.trashed.push(path);
        }
      } else {
        await this.vault.write(path, remote.content, remote.mtime);
        this.report.received.push(path);
      }
      agree(remoteHash);
      await this.keepBase(path, remote.deleted ? null : remote.content);
      return;
    }
    if (remote.deleted) {
      agree("");
      this.report.kept.push(path);
      return;
    }
    if (!local) {
      await this.vault.write(path, remote.content, remote.mtime);
      agree(remoteHash);
      this.report.kept.push(path);
      return;
    }
    const merged = await this.mergeBoth(path, local, remote.content);
    if (merged) {
      await this.vault.write(path, merged, this.now().getTime());
      agree(remoteHash);
      this.report.merged.push(path);
      return;
    }
    const listed = new Set((await this.vault.list()).map((f) => f.path));
    const copy = conflictCopyPath(path, this.now(), (p) => listed.has(p));
    await this.vault.write(copy, remote.content, remote.mtime);
    agree(remoteHash);
    this.report.conflicts.push({ path, copy });
  }
  /**
   * ROW 2375 — CouchDB's own replication conflicts. The far side chose one
   * version of [remote.path] and is holding others beside it (two servers
   * that each took an edit). Each other version whose bytes are not already
   * the file here is written beside it as a conflict copy and said, exactly
   * as R-5254 keeps both when two devices touched the same lines; only then
   * is the far side told to let them go, so a failure between the two keeps
   * the conflict on the server rather than losing a version.
   */
  async keepOthers(remote) {
    const path = remote.path;
    if (!inNoteSyncScope(path)) return;
    const here = await this.vault.read(path);
    const kept = /* @__PURE__ */ new Set([here ? await sha256Hex(here) : ""]);
    for (const o of remote.others ?? []) {
      if (o.deleted || !o.content) continue;
      const h = await sha256Hex(o.content);
      if (kept.has(h)) continue;
      kept.add(h);
      const listed = new Set((await this.vault.list()).map((f) => f.path));
      const copy = conflictCopyPath(path, this.now(), (p) => listed.has(p));
      await this.vault.write(copy, o.content, o.mtime);
      this.report.conflicts.push({ path, copy });
    }
    await this.transport.settle?.(path, (remote.others ?? []).map((o) => o.version));
  }
  /** Both sides' edits in one note, or null where they cannot be kept
   *  apart — no base, not text, or the same lines touched. */
  async mergeBoth(path, local, remote) {
    if (!this.bases || !mergeable(path)) return null;
    const base = await this.bases.get(path);
    const [b, ours, theirs] = [base, local, remote].map((x) => x ? utf82(x) : null);
    if (b === null || ours === null || theirs === null) return null;
    const r = mergeLines(b, ours, theirs);
    return r.clean ? new TextEncoder().encode(r.text) : null;
  }
  /** Send what changed here. True when the far side had moved under a
   *  send, so the caller takes again before sending again. */
  async sendChanged() {
    const out = [];
    const present = /* @__PURE__ */ new Set();
    for (const f of await this.vault.list()) {
      if (!inNoteSyncScope(f.path)) continue;
      present.add(f.path);
      if (f.size > NOTE_SYNC_MAX_BYTES) {
        this.report.refused.push({ path: f.path, reason: `it is ${(f.size / 1048576).toFixed(1)} MB, over the 50 MB that note sync carries` });
        continue;
      }
      const content = await this.vault.read(f.path);
      if (!content) continue;
      const hash2 = await sha256Hex(content);
      const rec = this.state.files[f.path];
      if (rec && rec.hash === hash2) continue;
      out.push({ path: f.path, content, mtime: f.mtime, deleted: false, base: rec?.version ?? null, hash: hash2 });
    }
    for (const [path, rec] of Object.entries(this.state.files)) {
      if (present.has(path) || rec.hash === "" || !inNoteSyncScope(path)) continue;
      out.push({ path, content: null, mtime: this.now().getTime(), deleted: true, base: rec.version, hash: "" });
    }
    if (!out.length) return false;
    const byPath = new Map(out.map((f) => [f.path, f]));
    let moved = false;
    for (const r of await this.transport.push(out)) {
      const f = byPath.get(r.path);
      if (r.ok) {
        this.state.files[r.path] = { version: r.version, hash: f.hash };
        await this.keepBase(r.path, f.deleted ? null : f.content);
        this.report.sent.push(r.path);
      } else if (r.conflict) {
        moved = true;
      } else {
        this.report.refused.push({ path: r.path, reason: r.reason });
      }
    }
    return moved;
  }
};

// src/main.ts
var moduleTypeName = (t) => module_names_default[t]?.name ?? t;
var ADDABLE_MODULE_TYPES = Object.keys(module_names_default).filter((t) => t !== "PERSON_DETAILS" && t !== "PERSON_ASSIGNED");
var VIEW_TYPE = "graphite-sync";
var API_TOKEN_PREFIX = "API token: ";
var WATCH_LABEL = "Paired watch";
function deviceName(ua) {
  if (ua.startsWith(API_TOKEN_PREFIX)) {
    return `API token \u201C${ua.slice(API_TOKEN_PREFIX.length)}\u201D`;
  }
  if (ua.startsWith(WATCH_LABEL)) return WATCH_LABEL;
  if (!ua) return "Unknown device";
  const os = ua.includes("Android") ? "Android" : ua.includes("iPhone") || ua.includes("iPad") ? "iOS" : ua.includes("Windows") ? "Windows" : ua.includes("Mac") ? "macOS" : ua.includes("Linux") ? "Linux" : "";
  const browser = ua.includes("Edg/") ? "Edge" : ua.includes("Chrome/") ? "Chrome" : ua.includes("Firefox/") ? "Firefox" : ua.includes("Safari/") ? "Safari" : "App";
  return os ? `${browser} on ${os}` : browser;
}
function agoText(ms2) {
  const min = Math.floor(ms2 / 6e4);
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}
function lastSeenText(d, now) {
  const used = d.lastUsedAt ? Date.parse(d.lastUsedAt) : NaN;
  if (Number.isNaN(used)) return "no use recorded";
  const made = d.createdAt ? Date.parse(d.createdAt) : NaN;
  if (d.userAgent.startsWith(API_TOKEN_PREFIX) && !Number.isNaN(made) && used - made < SESSION_STAMP_EVERY_MS) {
    return `no use recorded since it was made ${agoText(Math.max(0, now - made))}`;
  }
  const ago2 = now - used;
  if (ago2 < SESSION_STAMP_EVERY_MS) {
    return `seen in the last ${Math.round(SESSION_STAMP_EVERY_MS / 6e4)} minutes`;
  }
  return `last seen ${agoText(ago2)}`;
}
function serverKey(url) {
  return url.trim().replace(/\/+$/, "").toLowerCase();
}
function groupServers(configs) {
  const by = /* @__PURE__ */ new Map();
  for (const c of configs) {
    if (!c.url.trim()) continue;
    const k = serverKey(c.url);
    const s = by.get(k) ?? { url: c.url.trim().replace(/\/+$/, ""), vaults: [], here: false };
    s.vaults.push(c.vault);
    s.here = s.here || c.here;
    by.set(k, s);
  }
  return [...by.values()].sort((a, b) => Number(b.here) - Number(a.here));
}
var clock = (at) => new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
function serverCheckText(c) {
  if (!c) return "Not checked yet.";
  return c.ok ? `Answered at ${clock(c.at)}${c.detail ? ` \xB7 ${c.detail}` : ""}.` : `Checked at ${clock(c.at)}: ${c.detail}.`;
}
var DEFAULTS = {
  source: "server",
  serverUrl: "",
  token: "",
  files: {},
  mirrorAll: true,
  spacesSeen: [],
  bases: {},
  autoPush: false,
  hideIds: true,
  layout: "folder",
  vaultId: "",
  captureAnyTagged: false,
  captureTags: "",
  autoCapture: false,
  pageFolders: "",
  pagesOn: false,
  pageModules: {},
  pagesSent: {},
  ticks: {},
  censusOn: false,
  agentOn: false,
  agentFolders: "",
  routingList: null,
  routeCache: [],
  routeRecent: [],
  noteSync: "off",
  couchUrl: "",
  couchDb: "",
  couchUser: "",
  couchPassword: "",
  liveSync: true,
  couchPassphrase: "",
  noteSyncState: emptyNoteSyncState(),
  configFile: false,
  barOn: true,
  barHeading: "Actions",
  barShare: true,
  toolbarCache: null
};
var VAULT_HEADER = "x-graphite-vault";
var NO_SERVER = "http://127.0.0.1:1";
var NO_DOOR = "http://127.0.0.1:1";
function mintVaultId() {
  const c = globalThis.crypto;
  if (typeof c.randomUUID === "function") return c.randomUUID();
  const b = c.getRandomValues(new Uint8Array(16));
  b[6] = b[6] & 15 | 64;
  b[8] = b[8] & 63 | 128;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
var CAPTURE_MARKER = LP_TAIL;
function asServerSpelling(line) {
  const m = CAPTURE_MARKER.exec(line);
  if (!m) return line;
  return line.slice(0, m.index) + m[0].replace(/^(\s*\|\s*)gr:/, "$1lp:") + line.slice(m.index + m[0].length);
}
var CAPTURE_TASK_LINE = /^\s*[-*]\s+\[( |x|X)\]\s*\S/;
var CAPTURE_TAGGED_LINE = /(^|\s)#[\p{L}\p{N}_/-]+/u;
var CAPTURE_BULLET = /^\s*[-*+]\s+\S/;
function captureCandidates(lines, tagged = false) {
  let heading;
  return bodyLines(lines).filter((i) => {
    if (/^#{1,6}\s/.test(lines[i].trim())) {
      heading = lines[i];
      return false;
    }
    return !PROPOSAL_TAIL.test(lines[i]) && (CAPTURE_TASK_LINE.test(lines[i]) || tagged && CAPTURE_TAGGED_LINE.test(lines[i]) || CAPTURE_BULLET.test(lines[i]) && sectionNamesModule(heading));
  });
}
function tickLines(text) {
  const lines = text.split("\n");
  const out = [];
  for (const at of bodyLines(lines)) {
    const t = tickOf(lines[at]);
    if (t) out.push({ at, ...t });
  }
  return out;
}
function stampCaptured(line, id) {
  return CAPTURE_MARKER.test(line) ? line.replace(CAPTURE_MARKER, ` | lp: ${id}`) : `${line.replace(/\s+$/, "")} | lp: ${id}`;
}
function firstOf(text, marks, from) {
  let best = null;
  for (const m of marks) {
    const at = text.indexOf(m, from);
    if (at >= 0 && (!best || at < best.at)) best = { at, len: m.length };
  }
  return best;
}
function keepFreeform(old, fresh) {
  if (!old) return fresh;
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
var gPlugin = null;
function buildHideDecos(view) {
  const p = gPlugin;
  const file = p?.app.workspace.getActiveFile();
  if (!p?.settings.hideIds || !file || !p.settings.files[file.path]) {
    return import_view.Decoration.none;
  }
  const b = new import_state.RangeSetBuilder();
  const sel = view.state.selection.main;
  const selFrom = view.state.doc.lineAt(sel.from).number;
  const selTo = view.state.doc.lineAt(sel.to).number;
  const doc = view.state.doc.toString();
  for (const r of lpHiddenRanges(doc)) {
    const line = view.state.doc.lineAt(r.from).number;
    if (line >= selFrom && line <= selTo) continue;
    b.add(r.from, r.to, import_view.Decoration.replace({}));
  }
  return b.finish();
}
var lpHideExtension = import_view.ViewPlugin.fromClass(
  class {
    decorations;
    constructor(view) {
      this.decorations = buildHideDecos(view);
    }
    update(u) {
      if (u.docChanged || u.selectionSet || u.viewportChanged) {
        this.decorations = buildHideDecos(u.view);
      }
    }
  },
  { decorations: (v) => v.decorations }
);
function buildProposalDecos(view) {
  const b = new import_state.RangeSetBuilder();
  const doc = view.state.doc;
  const sel = view.state.selection.main;
  const selFrom = doc.lineAt(sel.from).number;
  const selTo = doc.lineAt(sel.to).number;
  const lines = doc.toString().split("\n");
  for (const p of proposalsIn(lines)) {
    const line = doc.line(p.line + 1);
    b.add(line.from, line.from, import_view.Decoration.line({
      class: `gr-proposal gr-proposal-${p.state}`,
      attributes: { "data-gr-state": p.state === "approved" ? "approving" : p.state }
    }));
    if (line.number >= selFrom && line.number <= selTo) continue;
    const m = PROPOSAL_TAIL.exec(line.text);
    if (m && m.index !== void 0) {
      b.add(line.from + m.index, line.from + line.text.length, import_view.Decoration.replace({}));
    }
  }
  return b.finish();
}
var proposalExtension = import_view.ViewPlugin.fromClass(
  class {
    decorations;
    constructor(view) {
      this.decorations = buildProposalDecos(view);
    }
    update(u) {
      if (u.docChanged || u.selectionSet) this.decorations = buildProposalDecos(u.view);
    }
  },
  { decorations: (v) => v.decorations }
);
var linksCursorExtension = import_view.ViewPlugin.fromClass(
  class {
    update(u) {
      if (u.selectionSet || u.docChanged) gPlugin?.cursorMovedIn(u.view);
    }
  }
);
function importerSaid(report) {
  const out = [];
  const add = (s) => {
    const t = typeof s === "string" ? s.trim() : "";
    if (t && !out.includes(t)) out.push(t);
  };
  for (const w of report?.warnings ?? []) add(w);
  for (const sec of report?.sections ?? []) for (const w of sec?.warnings ?? []) add(w);
  const held = Number(report?.linksHeld) || 0;
  if (held > 0 && !out.some((s) => /held/i.test(s))) {
    add(`${held} link row${held === 1 ? "" : "s"} deleted here ${held === 1 ? "was" : "were"} held, not removed \u2014 break a link in the app.`);
  }
  const shown = out.slice(0, 3).map((s) => s.length > 220 ? `${s.slice(0, 217)}\u2026` : s);
  if (out.length > 3) shown.push(`\u2026and ${out.length - 3} more.`);
  return shown;
}
var BASE_MAX_NOTES = 400;
var BASE_MAX_CHARS = 4e6;
var BASE_MAX_ONE = 4e5;
function folderHeldByAnother(files, folder, spaceId) {
  const lower = folder.toLowerCase();
  return Object.values(files).some((e) => e.spaceId !== spaceId && e.folder?.toLowerCase() === lower);
}
function distinctFolder(name, spaceId) {
  return `${name} (${spaceId.slice(-6)})`;
}
function singleFileFor(files, space) {
  const stem = space.name.replace(/[\\/:*?"<>|]/g, "_");
  const plain = `${stem}.md`;
  const held = Object.entries(files).some(([p, e]) => e.spaceId !== space.id && p.toLowerCase() === plain.toLowerCase());
  return held ? `${distinctFolder(stem, space.id)}.md` : plain;
}
function putBase(bases, path, text) {
  delete bases[path];
  if (text.length > BASE_MAX_ONE) return;
  bases[path] = text;
  const keys = Object.keys(bases);
  let total = keys.reduce((n, k) => n + bases[k].length, 0);
  while (keys.length > 1 && (keys.length > BASE_MAX_NOTES || total > BASE_MAX_CHARS)) {
    const oldest = keys.shift();
    total -= bases[oldest].length;
    delete bases[oldest];
  }
}
function heldFieldsOf(report) {
  const list = Array.isArray(report?.conflicts) ? report.conflicts : [];
  return list.filter((c) => c && typeof c === "object" && c.kind !== "link");
}
function heldFieldsSaid(held) {
  if (!held.length) return [];
  const n = held.length;
  const out = [`${n} field${n === 1 ? "" : "s"} held \u2014 changed here and in the app. Decide in the Graphite app; this note keeps the app value for now.`];
  for (const c of held.slice(0, 3)) {
    const who = String(c.label ?? "").trim();
    out.push(`${who ? `${who.length > 60 ? `${who.slice(0, 57)}\u2026` : who} \u2014 ` : ""}${c.field}`);
  }
  if (n > 3) out.push(`\u2026and ${n - 3} more.`);
  return out;
}
function hash(s) {
  let x = 5381;
  for (let i = 0; i < s.length; i++) x = (x << 5) + x + s.charCodeAt(i) | 0;
  return (x >>> 0).toString(36);
}
function relTime(ms2) {
  if (!ms2) return "never";
  const d = Date.now() - ms2;
  if (d < 6e4) return "just now";
  if (d < 36e5) return `${Math.floor(d / 6e4)} min ago`;
  if (d < 864e5) return `${Math.floor(d / 36e5)} h ago`;
  return `${Math.floor(d / 864e5)} d ago`;
}
var GraphitePlugin = class _GraphitePlugin extends import_obsidian4.Plugin {
  settings = DEFAULTS;
  statusEl = null;
  /** Above zero while the plugin itself writes a vault file
   *  (canonicalize, pull, capture's stamp, finalise), so the modify handlers
   *  must not treat its own write as his edit.
   *
   *  R-1386: A COUNTER, NOT A FLAG. Two writes overlap the moment anything
   *  writes on its own — finalise runs off a modify event while a capture
   *  may be stamping — and a flag the first one clears in its `finally`
   *  would leave the second one's write looking like a person's edit. */
  writingBack = 0;
  /** Whether this vault captures: bound on the server WITH an inbox, as the
   *  server last said (OC2 moved the inbox off this file at the M-S2 merge).
   *  Held in memory only, refreshed by every binding read, and false until
   *  one answers, so no tick reaches a server before capture is known on. */
  captureOn = false;
  /** Whether this vault is bound to a space, as the server last said - the
   *  half of captureOn that pages need (they never touch the inbox). */
  vaultBound = false;
  /** OC4: per-note timers for the two gestures read off a line. */
  gestureTimers = {};
  /** How long a note must sit still before a tick or an un-italicised line
   *  is taken as an approval — long enough to finish removing an asterisk. */
  gestureDelay = 2500;
  /** Said once per session, not on every keystroke. */
  toldNoInbox = false;
  pushTimers = {};
  /** FINDING 120: THE PATHS A PUSH IS IN FLIGHT FOR. A second push of the
   *  same note while one is running read the same file, sent the same new
   *  sections without ids, and made every one of them twice. The second
   *  asks to run again instead (the value is how it was asked), once the
   *  first has written the ids back, and sends what the file says by then. */
  pushing = /* @__PURE__ */ new Map();
  pushAgain = /* @__PURE__ */ new Map();
  lastMe = null;
  lastHealth = null;
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
  vaultReport = null;
  /** ROW 2376: this vault's server, as of the last connection check. */
  lastCheck = null;
  /** ROW 2376: other servers' answers, by serverKey, from a Check press. */
  serverChecks = {};
  /** ROW 2376: the account's devices as the server last listed them, and
   *  when. null with a report is a list that could not be had — said as
   *  that, never as an empty list, which would read "no other devices". */
  devices = null;
  devicesReport = null;
  /** REGISTER 1527: what the server said about the oldest plugin it
   *  accepts, read off GET /health. null until a server has answered. */
  handshake = null;
  /** The /health call in flight, so a write made before the startup check
   *  has answered waits for that one call instead of making a second. */
  healthAsk = null;
  /** An automatic write refused for being out of date says so once. */
  toldOutdated = false;
  /** REGISTER 2519: the link log of the record under the cursor. */
  feed;
  linksViews = /* @__PURE__ */ new Set();
  /** How long the cursor must be still before the panel asks, and how long
   *  an answer counts as fresh. Fields, so a test can shorten them. */
  linksDebounce = 300;
  linksFresh = 3e4;
  async onload() {
    await this.loadSettings();
    gPlugin = this;
    this.registerEditorExtension(lpHideExtension);
    this.registerEditorExtension(proposalExtension);
    this.registerEditorSuggest(new RouteSuggest(this.app, this));
    this.registerMarkdownPostProcessor((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const hits = [];
      let n;
      while (n = walker.nextNode()) {
        if (n.nodeValue && PROPOSAL_TAIL.test(n.nodeValue)) hits.push(n);
      }
      for (const t of hits) {
        t.nodeValue = t.nodeValue.replace(PROPOSAL_TAIL, "");
        t.parentElement?.closest("li")?.addClass("gr-proposal");
      }
    });
    this.registerMarkdownPostProcessor((el, ctx) => {
      if (!this.settings.hideIds || !this.settings.files[ctx.sourcePath]) return;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let n;
      while (n = walker.nextNode()) {
        if (n.nodeValue && LP_ID_RE.test(n.nodeValue)) {
          n.nodeValue = n.nodeValue.replace(LP_ID_RE, "");
        }
        LP_ID_RE.lastIndex = 0;
      }
      for (const table of Array.from(el.querySelectorAll("table"))) {
        const heads = Array.from(table.querySelectorAll("th"));
        const at = heads.length - 1;
        if (at < 0 || !isMarkerHeaderCell(heads[at].textContent ?? "")) continue;
        for (const row of Array.from(table.querySelectorAll("tr"))) {
          const cells = Array.from(row.children);
          if (cells.length === heads.length) cells[at].remove();
        }
      }
    });
    this.addSettingTab(new LpSettingTab(this.app, this));
    this.registerView(VIEW_TYPE, (leaf) => new LpSyncView(leaf, this));
    const self = this;
    this.feed = new LinkLogFeed((r) => this.fetchLinkLog(r), () => this.refreshLinks(), {
      get debounceMs() {
        return self.linksDebounce;
      },
      get freshMs() {
        return self.linksFresh;
      },
      now: () => Date.now(),
      setTimeout: (fn, ms2) => window.setTimeout(fn, ms2),
      clearTimeout: (t) => window.clearTimeout(t)
    });
    this.registerView(LINKS_VIEW, (leaf) => new LinksView(leaf, this));
    this.registerEditorExtension(linksCursorExtension);
    this.registerEvent(this.app.workspace.on("file-open", () => this.nudgeLinks()));
    this.addCommand({ id: "lp-open-links", name: "Open the links panel", callback: () => void this.openLinks() });
    this.addCommand({
      id: "lp-link-line",
      name: "Link this line to a Graphite record",
      editorCallback: (editor) => {
        const file = this.app.workspace.getActiveFile();
        const spot = this.spotIn(file?.path ?? null, editor.getValue().split("\n"), editor.getCursor().line);
        if (!("rec" in spot)) {
          new import_obsidian4.Notice(`Graphite: ${spot.none}`);
          return;
        }
        pickLink(this, spot.rec);
      }
    });
    this.addRibbonIcon("refresh-cw", "Graphite sync", () => this.openPanel());
    this.statusEl = this.addStatusBarItem();
    this.setStatus("\u2026", "checking");
    this.app.workspace.onLayoutReady(() => {
      window.setTimeout(() => void this.checkConnection(false), this.startupDelayMs);
    });
    this.addCommand({ id: "lp-open-panel", name: "Open the sync panel", callback: () => this.openPanel() });
    this.addCommand({ id: "lp-pull-all", name: "Bring in every space", callback: () => void this.mirrorEverySpace(true) });
    this.addCommand({ id: "lp-pull-space", name: "Pull a space (pick destination vault)", callback: () => this.chooseAndPull() });
    this.addCommand({ id: "lp-pull-selective", name: "Pull a space into THIS vault, choosing modules", callback: () => this.chooseAndPullSelective() });
    this.addCommand({ id: "lp-push-file", name: "Push the current file back to Graphite", callback: () => this.pushCurrent() });
    this.addCommand({ id: "lp-test-connection", name: "Test the server connection", callback: () => this.checkConnection(true) });
    this.addCommand({
      id: "lp-add-module",
      name: "Add a module to a Graphite space",
      callback: () => void this.chooseAndAddModule()
    });
    this.addCommand({
      id: "lp-create-space",
      name: "Create a Graphite space from this note",
      callback: () => void this.createSpaceFromNote()
    });
    this.addCommand({
      id: "lp-capture-vault",
      name: "Capture tasks from this vault into Graphite",
      callback: () => void this.captureVault()
    });
    this.addCommand({
      id: "lp-sync-ticks",
      name: "Sync ticks between this vault and Graphite",
      callback: () => void this.syncTicks()
    });
    this.addCommand({
      id: "lp-publish-agent",
      name: "Publish the routing list and agent brief for your agent",
      callback: () => void this.publishAgentContract({ loud: true })
    });
    this.registerInterval(window.setInterval(() => {
      if (this.settings.agentOn) void this.publishAgentContract();
    }, 36e5));
    this.addCommand({
      id: "lp-send-census",
      name: "Send the vault census to the morning sweep",
      callback: () => void this.reportCensus({ loud: true })
    });
    this.registerInterval(window.setInterval(() => {
      if (this.settings.censusOn) void this.reportCensus();
    }, 6 * 36e5));
    this.registerEvent(this.app.workspace.on("file-open", (f) => {
      if (!this.captureOn || !(f instanceof import_obsidian4.TFile)) return;
      if (this.settings.files[f.path]) return;
      void this.app.vault.read(f).then((text) => {
        if (tickLines(text).length) void this.syncTicks([f], { quiet: true });
      });
    }));
    this.registerEvent(this.app.vault.on("modify", (f) => {
      if (!this.captureOn || this.writingBack > 0) return;
      if (!(f instanceof import_obsidian4.TFile) || this.settings.files[f.path]) return;
      void this.app.vault.read(f).then((text) => this.tickSoon(f, text));
    }));
    const captureSoon = (f) => {
      if (!this.settings.autoCapture || !this.captureOn || this.writingBack > 0) return;
      if (!(f instanceof import_obsidian4.TFile) || f.extension !== "md") return;
      if (this.settings.files[f.path] || isAgentFile(f.path) || f.path === SETTINGS_NOTE_PATH) return;
      this.autoCaptureSoon(f);
    };
    this.registerEvent(this.app.vault.on("modify", captureSoon));
    this.registerEvent(this.app.vault.on("create", captureSoon));
    this.pages = new PageSync({
      on: () => this.settings.pagesOn && this.vaultBound && !this.offServer,
      folders: () => this.settings.pageFolders,
      moduleFor: (p) => pageModuleFor(p, this.settings.pageFolders, this.settings.pageModules),
      vaultName: () => this.app.vault.getName(),
      excluded: (p) => !!this.settings.files[p] || isAgentFile(p) || p === SETTINGS_NOTE_PATH || p.startsWith("."),
      isOpen: (p) => this.app.workspace.getActiveFile()?.path === p,
      read: async (p) => {
        const f = this.app.vault.getAbstractFileByPath(p);
        return f instanceof import_obsidian4.TFile ? this.app.vault.read(f) : null;
      },
      send: async (method, body) => {
        const q = method === "DELETE" ? `?path=${encodeURIComponent(String(body.path))}` : "";
        const res = await (0, import_obsidian4.requestUrl)({
          url: this.api(`/mirror/pages${q}`),
          method,
          headers: this.headers,
          throw: false,
          ...method === "PUT" ? { contentType: "application/json", body: JSON.stringify(body) } : {}
        });
        return { status: res.status, message: res.json?.message };
      },
      sent: this.settings.pagesSent,
      save: () => this.saveSettings(),
      say: (m) => void new import_obsidian4.Notice(m, 1e4),
      delay: () => this.autoCaptureDelay,
      // 0.6.9: the plugin's OWN writes (a pull, a canonicalising push) are not
      // the person's edits. Without this every note a pull created was looked
      // at as a page candidate - a read of each - before its tracking was
      // written, since the file exists a moment before its entry does.
      watch: (ev, cb) => this.registerEvent(this.app.vault.on(ev, (...a) => {
        if (this.writingBack > 0 && (ev === "modify" || ev === "create")) return;
        cb(...a);
      })),
      setTimeout: (fn, ms2) => window.setTimeout(fn, ms2),
      clearTimeout: (t) => window.clearTimeout(t)
    });
    this.pages.register();
    this.addCommand({
      id: "lp-route-line",
      name: "Route this line to a Graphite space",
      editorCallback: (editor) => {
        void this.refreshRoutes();
        new RouteModal(this.app, this, (r) => this.insertRoute(editor, r, editor.getCursor().line)).open();
      }
    });
    this.addCommand({
      id: "lp-make-tasks",
      name: "Make these tasks",
      editorCallback: (editor) => this.makeTasksIn(editor)
    });
    this.registerBarCommands();
    void this.adoptToolbarLists();
    this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.syncBars()));
    this.registerEvent(this.app.workspace.on("layout-change", () => this.syncBars()));
    this.registerEvent(this.app.workspace.on("file-open", () => this.syncBars()));
    this.app.workspace.onLayoutReady(() => this.syncBars());
    const adopt = (f) => {
      if (f?.path === TOOLBAR_LISTS_PATH) void this.adoptToolbarLists();
    };
    this.registerEvent(this.app.vault.on("modify", adopt));
    this.registerEvent(this.app.vault.on("create", adopt));
    this.registerInterval(window.setInterval(() => void this.publishToolbarLists(), 36e5));
    this.addCommand({
      id: "lp-approve-line",
      name: "Approve the proposal on this line",
      editorCallback: (editor) => {
        const file = this.app.workspace.getActiveFile();
        const p = readProposal(editor.getLine(editor.getCursor().line));
        if (!file || !p) {
          new import_obsidian4.Notice("Graphite: there is no proposal on this line.");
          return;
        }
        void this.approveProposals(file, [p.key]);
      }
    });
    this.addCommand({
      id: "lp-approve-note",
      name: "Approve every proposal in this note",
      callback: () => {
        const file = this.app.workspace.getActiveFile();
        if (!file) {
          new import_obsidian4.Notice("Graphite: open the note first.");
          return;
        }
        void this.approveProposals(file, "all");
      }
    });
    this.registerEvent(this.app.vault.on("modify", (f) => {
      if (this.writingBack > 0 || !(f instanceof import_obsidian4.TFile) || this.settings.files[f.path]) return;
      if (f.extension !== "md") return;
      window.clearTimeout(this.gestureTimers[f.path]);
      this.gestureTimers[f.path] = window.setTimeout(
        () => void this.approveGestures(f),
        this.gestureDelay
      );
    }));
    this.registerEvent(this.app.vault.on("modify", (f) => {
      if (!this.settings.autoPush || this.writingBack > 0) return;
      if (!(f instanceof import_obsidian4.TFile) || !this.settings.files[f.path]) return;
      this.schedulePush(f.path);
    }));
    this.addCommand({
      id: "lp-write-settings-note",
      name: "Write settings to the settings note",
      callback: () => void this.writeSettingsNote({ loud: true })
    });
    this.addCommand({
      id: "lp-read-settings-note",
      name: "Read settings from the settings note",
      callback: () => void this.readSettingsNoteIn({ loud: true })
    });
    this.registerEvent(this.app.vault.on("modify", (f) => {
      if (this.writingBack > 0 || !(f instanceof import_obsidian4.TFile) || f.path !== SETTINGS_NOTE_PATH) return;
      if (!this.settings.configFile) return;
      window.clearTimeout(this.settingsNoteTimer);
      this.settingsNotePending = true;
      this.settingsNoteTimer = window.setTimeout(() => {
        this.settingsNotePending = false;
        void this.readSettingsNoteIn({ loud: false });
      }, this.settingsNoteDelay);
    }));
    this.addCommand({
      id: "lp-sync-notes-now",
      name: "Sync notes now",
      callback: () => void this.syncNotesNow({ loud: true })
    });
    this.registerEvent(this.app.vault.on("modify", () => {
      if (!this.writingBack) this.noteSyncSoon();
    }));
    this.registerEvent(this.app.vault.on("create", () => {
      if (!this.writingBack) this.noteSyncSoon();
    }));
    this.registerEvent(this.app.vault.on("delete", (f) => {
      const gone = f?.path;
      if (gone && this.writingBack === 0 && this.settings.files[gone]?.role === "page") {
        this.pageVanished(gone);
        this.noteSyncSoon();
        return;
      }
      if (gone && this.settings.bases[gone] !== void 0) {
        delete this.settings.bases[gone];
        void this.saveSettings();
      }
      this.noteSyncSoon();
    }));
    this.registerEvent(this.app.vault.on("rename", (f, from) => {
      const to = f?.path;
      if (this.writingBack === 0 && typeof from === "string" && to && this.settings.files[from]?.role === "page") {
        void this.pageRenamed(from, to);
        this.noteSyncSoon();
        return;
      }
      if (typeof from === "string" && this.settings.bases[from] !== void 0) {
        delete this.settings.bases[from];
        void this.saveSettings();
      }
      this.noteSyncSoon();
    }));
    const ws = this.app.workspace;
    if (typeof ws.onLayoutReady === "function") {
      ws.onLayoutReady(() => void this.openSettingsNote());
    } else {
      await this.openSettingsNote();
    }
  }
  /** ROW 2375: until the note has been read at start-up, no save may write
   *  it — a save from before would overwrite what sync brought in while
   *  Obsidian was closed with what this device had before. */
  settingsNoteOpen = false;
  settingsNoteTimer = 0;
  /** An edit to the note that has not been read yet. Until it is, no save
   *  writes the note: a census or a tick saving the settings in those two
   *  seconds would otherwise put the old value back over his edit. */
  settingsNotePending = false;
  /** How long the settings note must sit still before an edit is read —
   *  long enough to finish typing a value. */
  settingsNoteDelay = 2500;
  async openSettingsNote() {
    if (this.settings.configFile && this.app.vault.getAbstractFileByPath(SETTINGS_NOTE_PATH)) {
      await this.readSettingsNoteIn({ loud: false });
    }
    this.settingsNoteOpen = true;
    this.restartNoteSync();
  }
  /** The settings note sync depends on, as one string to compare. */
  noteSyncSignature() {
    const s = this.settings;
    return JSON.stringify([s.noteSync, s.couchUrl, s.couchDb, s.couchUser, s.couchPassword, s.couchPassphrase, s.liveSync]);
  }
  /** Take the settings the note sets. A refused line keeps its setting and
   *  is said, with its line number; the rest applies. The note is not
   *  rewritten here, so an edit he is still making is never fought. */
  async readSettingsNoteIn(opts) {
    const file = this.app.vault.getAbstractFileByPath(SETTINGS_NOTE_PATH);
    if (!(file instanceof import_obsidian4.TFile)) {
      if (opts.loud) new import_obsidian4.Notice(`Graphite: there is no settings note at ${SETTINGS_NOTE_PATH}.`);
      return false;
    }
    const { values, problems } = readSettingsNote(await this.app.vault.read(file));
    const before = this.noteSyncSignature();
    Object.assign(this.settings, values);
    await this.saveData(this.settings);
    if (this.settingsNoteOpen && this.noteSyncSignature() !== before) this.restartNoteSync();
    if (problems.length) {
      new import_obsidian4.Notice(`Graphite: the settings note was read, except:
${problems.join("\n")}`, 12e3);
    } else if (opts.loud) {
      new import_obsidian4.Notice("Graphite: settings read from the settings note.");
    }
    this.refreshPanel();
    return true;
  }
  /** Write the settings into the note, keeping whatever else it holds. */
  async writeSettingsNote(opts = {}) {
    if (!opts.loud && this.settingsNotePending) return;
    const file = this.app.vault.getAbstractFileByPath(SETTINGS_NOTE_PATH);
    const before = file instanceof import_obsidian4.TFile ? await this.app.vault.read(file) : null;
    if (before !== null && noteMatches(this.settings, before)) {
      if (opts.loud) new import_obsidian4.Notice("Graphite: the settings note already says what the settings do.");
      return;
    }
    await this.writeOwnNote(
      SETTINGS_NOTE_PATH,
      settingsNoteText(this.settings, before)
    );
    if (opts.loud) new import_obsidian4.Notice(`Graphite: settings written to ${SETTINGS_NOTE_PATH}.`);
  }
  /** The switch in the settings screen. On with a note already there is a
   *  RESTORE: the note is read in, not overwritten. */
  async keepSettingsNote(on) {
    this.settings.configFile = on;
    if (on && this.app.vault.getAbstractFileByPath(SETTINGS_NOTE_PATH)) {
      await this.readSettingsNoteIn({ loud: true });
    }
    await this.saveSettings();
  }
  /** ROW 2375: the CouchDB server note sync would use, as set. */
  couchClient() {
    return new CouchClient(
      { url: this.settings.couchUrl, db: this.settings.couchDb, user: this.settings.couchUser, password: this.settings.couchPassword },
      (r) => (0, import_obsidian4.requestUrl)(r)
    );
  }
  /** The last test of the note-sync server, for the settings screen. */
  noteSyncCheck = null;
  async testNoteSync() {
    this.noteSyncCheck = await this.couchClient().check();
    new import_obsidian4.Notice(`Graphite: ${this.noteSyncCheck.detail}`, 8e3);
    return this.noteSyncCheck;
  }
  /* ══ ROW 2375 · NOTES TRAVEL (R-5255, R-5254) ════════════════════════
   * One run of the engine over the CouchDB transport: take what arrived,
   * send what changed. Run by the command, shortly after a vault change,
   * and by live sync whenever the server says something arrived. Off sends
   * nothing and asks nothing (RU-035). */
  /** The vault as note-engine.ts sees it: bytes in, bytes out, deletions
   *  to the vault trash. */
  noteVault() {
    const vault = this.app.vault;
    const fileAt = (p) => {
      const f = vault.getAbstractFileByPath(p);
      return f instanceof import_obsidian4.TFile ? f : null;
    };
    return {
      list: async () => vault.getFiles().map((f) => ({ path: f.path, mtime: f.stat?.mtime ?? 0, size: f.stat?.size ?? 0 })),
      read: async (p) => {
        const f = fileAt(p);
        return f ? new Uint8Array(await vault.readBinary(f)) : null;
      },
      write: async (p, content, mtime) => {
        const data = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength);
        const opts = mtime ? { mtime } : void 0;
        const f = fileAt(p);
        if (f) {
          await vault.modifyBinary(f, data, opts);
          return;
        }
        const dir = p.split("/").slice(0, -1);
        for (let i = 1; i <= dir.length; i++) {
          const d = dir.slice(0, i).join("/");
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
        const dir = to.split("/").slice(0, -1);
        for (let i = 1; i <= dir.length; i++) {
          const d = dir.slice(0, i).join("/");
          if (!vault.getAbstractFileByPath(d)) await vault.createFolder(d);
        }
        await vault.rename(f, to);
      }
    };
  }
  /** ROW 2375 (R-5254): the text each note last agreed with [target] — the
   *  base a merge starts from — kept in this plugin's own folder inside the
   *  config directory: on this device only, never in the vault's notes and
   *  never carried by note sync (which keeps out every dot-folder). One file
   *  per note, named by the SHA-256 of the target and path, so no note's
   *  name is written there. */
  noteBases(target) {
    const adapter = this.app.vault.adapter;
    if (!adapter.exists || !adapter.readBinary || !adapter.writeBinary || !adapter.mkdir || !adapter.remove) {
      return null;
    }
    const configDir = this.app.vault.configDir ?? ".obsidian";
    const dir = `${configDir}/plugins/${this.manifest?.id ?? "graphite-sync"}/sync-base`;
    const fileOf = async (p) => `${dir}/${await sha256Hex(new TextEncoder().encode(`${target}
${p}`))}`;
    return {
      get: async (p) => {
        const f = await fileOf(p);
        return await adapter.exists(f) ? new Uint8Array(await adapter.readBinary(f)) : null;
      },
      put: async (p, content) => {
        if (!await adapter.exists(dir)) await adapter.mkdir(dir);
        const data = content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength);
        await adapter.writeBinary(await fileOf(p), data);
      },
      drop: async (p) => {
        const f = await fileOf(p);
        if (await adapter.exists(f)) await adapter.remove(f);
      }
    };
  }
  /** Two engines writing one vault is how notes are lost: while LiveSync
   *  is on in this vault, note sync does not start. */
  liveSyncPluginOn() {
    const plugins = this.app.plugins;
    return !!plugins?.enabledPlugins?.has("obsidian-livesync");
  }
  noteSyncRunning = null;
  noteSyncAgain = false;
  noteSyncTimer = 0;
  /** How long the vault must sit still after a change before it is sent. */
  noteSyncDelay = 2e3;
  /** How long one live long-poll waits; a test shortens it. */
  liveWaitMs = LIVE_WAIT_MS;
  /** ROWS 2375/2376: the live loop's own badge, beside the server's. Made
   *  the first time live sync starts, so a vault that never turns it on
   *  carries none. */
  noteStatusEl = null;
  setNoteBadge(state, detail) {
    if (state === "off" && !this.noteStatusEl) return;
    this.noteStatusEl ??= this.addStatusBarItem();
    this.noteStatusEl.setText(noteLiveBadge(state, detail));
  }
  /** The last thing note sync said, for the settings screen. */
  noteSyncLast = "";
  follower = null;
  /** Run note sync now. Null when it is off, refused, or failed (each said);
   *  otherwise what moved. A run asked for while one is going runs once
   *  more after it, never beside it. */
  async syncNotesNow(opts = {}) {
    if (this.settings.noteSync === "off") {
      if (opts.loud) new import_obsidian4.Notice("Graphite: note sync is off. Choose a server under Note sync in the settings.");
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
  async noteSyncOnce(opts) {
    const say = (text, ms2 = 8e3) => {
      this.noteSyncLast = text;
      new import_obsidian4.Notice(`Graphite: ${text}`, ms2);
    };
    if (this.liveSyncPluginOn()) {
      say("note sync did not start, because LiveSync is on in this vault. Turn LiveSync off first: two sync engines in one vault lose notes.", 12e3);
      return null;
    }
    const s = this.settings;
    const transport = new CouchNoteTransport(this.couchClient(), s.couchPassphrase);
    try {
      await transport.open();
    } catch (e) {
      say(e.message, 12e3);
      return null;
    }
    const target = `${s.couchUrl.trim().replace(/\/+$/, "")}|${s.couchDb}|${transport.identity}`;
    if (s.noteSyncState.target !== target) s.noteSyncState = emptyNoteSyncState(target);
    const engine = new NoteSyncEngine(
      transport,
      this.noteVault(),
      s.noteSyncState,
      void 0,
      this.noteBases(target)
    );
    let report;
    try {
      report = await engine.run();
    } catch (e) {
      say(`note sync stopped: ${e.message}`, 12e3);
      return null;
    } finally {
      await this.saveData(this.settings);
    }
    for (const c of report.conflicts) {
      say(`${c.path} was changed on this device and on another. Both are kept: the other version is beside it as ${c.copy}.`, 15e3);
    }
    for (const m of report.merged) {
      say(`${m} was changed on this device and on another, in different places. Both edits are kept in it.`, 12e3);
    }
    for (const r of report.refused) say(`${r.path} was not synced: ${r.reason}.`, 12e3);
    for (const k of report.kept) say(`${k} was deleted on one device and edited on another; the edited version is kept.`, 12e3);
    if (report.unreadable) {
      say(`${report.unreadable} document${report.unreadable === 1 ? "" : "s"} in the database could not be opened with this passphrase and ${report.unreadable === 1 ? "was" : "were"} left alone.`, 12e3);
    }
    const moved = report.received.length + report.sent.length + report.trashed.length + report.moved.length;
    if (opts.loud || moved) {
      const renamed = report.moved.length ? ` ${report.moved.length} renamed,` : "";
      this.noteSyncLast = `notes synced: ${report.received.length} received, ${report.sent.length} sent,${renamed} ${report.trashed.length} moved to the trash.`;
      if (opts.loud) new import_obsidian4.Notice(`Graphite: ${this.noteSyncLast}`);
    }
    return report;
  }
  /** A vault change: sent once the vault has been still for a moment. */
  noteSyncSoon() {
    if (this.settings.noteSync === "off") return;
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
    if (s.noteSync !== "couchdb" || !s.liveSync || !s.couchPassphrase || this.liveSyncPluginOn()) {
      this.setNoteBadge("off");
      return;
    }
    const transport = new CouchNoteTransport(this.couchClient(), s.couchPassphrase);
    const started = Symbol("live");
    this.liveRun = started;
    this.setNoteBadge("syncing");
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
        waitMs: this.liveWaitMs
      });
      void this.follower.run();
    });
  }
  liveRun = null;
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
  get onDevice() {
    return this.settings.source === "device";
  }
  get onComputer() {
    return this.settings.source === "computer";
  }
  /** Neither a device nor a computer asks a server: what needs one stops. */
  get offServer() {
    return this.onDevice || this.onComputer;
  }
  /** What the vault last said the app left in it. Null until looked at. */
  mirrorLook = null;
  /** Look in the vault for what the app wrote. Reads files and nothing else. */
  async lookAtMirror() {
    const a = this.app.vault.adapter;
    this.mirrorLook = await lookForMirror({
      list: (dir) => a.list(dir),
      read: (path) => a.read(path),
      mtime: async (path) => (await a.stat(path))?.mtime ?? null
    });
    return this.mirrorLook;
  }
  doorSeen = null;
  /** The door of the app, found in the file it leaves. Kept for a few seconds so
   *  a burst of requests reads the file once; `fresh` always reads it, and a
   *  connection check does, because that is where a restarted app is
   *  noticed. A phone has no app and no files to read. */
  doorLook(fresh = false) {
    if (!import_obsidian4.Platform.isDesktopApp) return { ok: false, why: "phone" };
    const now = Date.now();
    if (!fresh && this.doorSeen && now - this.doorSeen.at < 3e3) return this.doorSeen.look;
    const look = this.readDoorFile();
    this.doorSeen = { at: now, look };
    return look;
  }
  readDoorFile() {
    const req = window.require;
    if (!req) return { ok: false, why: "phone" };
    try {
      const fs = req("fs");
      const p = req("path");
      const proc = globalThis.process;
      return findDoor(
        doorFileCandidates(proc?.env ?? {}, proc?.platform ?? "", (...a) => p.join(...a)),
        (f) => {
          try {
            return fs.readFileSync(f, "utf8");
          } catch {
            return null;
          }
        }
      );
    } catch {
      return { ok: false, why: "unreadable" };
    }
  }
  /** Where requests go and the key they carry, or null when there is
   *  nowhere to send them. A device has no server to send anything to. */
  endpoint() {
    if (this.onDevice) return null;
    if (this.onComputer) {
      const look = this.doorLook();
      return look.ok ? { base: doorBase(look.door), token: look.door.key } : null;
    }
    if (!this.settings.serverUrl || !this.settings.token) return null;
    return { base: this.settings.serverUrl.replace(/\/+$/, ""), token: this.settings.token };
  }
  /** Whether there is somewhere to ask. */
  get configured() {
    return this.endpoint() !== null;
  }
  /** What to say when there is not: a short form for the status bar and the
   *  sentence for a Notice. */
  notConfigured() {
    if (this.onDevice) {
      return {
        short: mirrorShort(this.mirrorLook),
        long: "this vault reads Graphite from the Graphite app on this device, which writes the notes into the vault itself. There is nothing to pull or push here."
      };
    }
    if (this.onComputer) {
      const look = this.doorLook();
      const why = look.ok ? "no-file" : look.why;
      return { short: doorShort(why), long: doorSentence(why) };
    }
    return { short: "not configured", long: "set the server URL and API token in settings first." };
  }
  /** Said when a connection check fails, for the pull and add commands. */
  noConnectionNote() {
    return this.onDevice ? `Graphite: ${this.notConfigured().long}` : this.onComputer ? `Graphite: no connection \u2014 ${this.notConfigured().long}` : "Graphite: no connection \u2014 check the server URL and token in settings.";
  }
  /** A feature that needs a server, asked for while this vault reads from
   *  the Graphite app on this device or computer. True means it was said and the
   *  caller stops. Said once a session when `loud` is false, for the ones that run
   *  on their own (a ticked box, a census). */
  needsServer(what, loud = true) {
    if (!this.offServer) return false;
    if (loud || !this.toldDevice.has(what)) {
      new import_obsidian4.Notice(`Graphite: ${what} needs a Graphite server. The Graphite app on this ` + (this.onComputer ? "computer does not do it for a notes app yet, so nothing was changed." : "device does not do it for a notes app, so nothing was changed."), 1e4);
      this.toldDevice.add(what);
    }
    return true;
  }
  toldDevice = /* @__PURE__ */ new Set();
  /** The app on this computer said it lets notes apps read and not change.
   *  Remembered so an auto-push does not say it again on every edit. */
  computerReadOnly = false;
  api(path) {
    const base = this.onDevice ? NO_SERVER : this.onComputer ? this.endpoint()?.base ?? NO_DOOR : this.settings.serverUrl.replace(/\/+$/, "");
    return `${base}/api${path}`;
  }
  get headers() {
    return {
      Authorization: `Bearer ${this.onDevice ? "" : this.onComputer ? this.endpoint()?.token ?? "" : this.settings.token}`,
      [VAULT_HEADER]: this.settings.vaultId
    };
  }
  setStatus(text, kind) {
    const dot = kind === "ok" ? "\u{1F7E2}" : kind === "bad" ? "\u{1F534}" : "\u23F3";
    this.statusEl?.setText(`Graphite ${dot} ${text}`);
  }
  async openPanel() {
    let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
  }
  refreshPanel() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      leaf.view.render();
    }
  }
  /** Pings /auth/me (+ /health for the server version). Updates the status
   *  bar and panel; loud=true also raises a Notice. */
  async checkConnection(loud) {
    if (this.onDevice) {
      this.lastMe = null;
      this.lastHealth = null;
      this.setStatus("\u2026", "checking");
      let look;
      try {
        look = await this.lookAtMirror();
      } catch {
        this.lastCheck = { at: Date.now(), ok: false, detail: "could not read this vault" };
        this.setStatus("could not read this vault", "bad");
        if (loud) new import_obsidian4.Notice("Graphite: this vault could not be read.");
        this.refreshPanel();
        return false;
      }
      const said = mirrorSentence(look, Date.now(), import_obsidian4.Platform.isMobile);
      this.lastCheck = { at: Date.now(), ok: look.folders.length > 0, detail: said };
      this.setStatus(mirrorShort(look), look.folders.length ? "ok" : "bad");
      if (loud) new import_obsidian4.Notice(`Graphite: ${said}`, 12e3);
      this.refreshPanel();
      return false;
    }
    if (this.onComputer) {
      this.doorLook(true);
      this.computerReadOnly = false;
    }
    if (!this.configured) {
      this.lastMe = null;
      this.lastHealth = null;
      this.lastCheck = null;
      const say = this.notConfigured();
      this.setStatus(say.short, "bad");
      if (loud) new import_obsidian4.Notice(`Graphite: ${say.long}`, this.onComputer ? 12e3 : void 0);
      this.refreshPanel();
      return false;
    }
    this.setStatus("\u2026", "checking");
    try {
      const [me, health] = await Promise.all([
        (0, import_obsidian4.requestUrl)({ url: this.api("/auth/me"), headers: this.headers }),
        this.askHealth()
      ]);
      this.lastMe = me.json;
      this.lastHealth = health?.json ?? null;
      const who = this.onComputer ? "this computer" : this.lastMe?.name ?? this.lastMe?.email ?? "connected";
      this.lastCheck = {
        at: Date.now(),
        ok: true,
        detail: [
          this.lastHealth?.version ? `Graphite ${this.lastHealth.version}` : "",
          this.onComputer ? "read from this computer, no server" : `signed in as ${who}`
        ].filter(Boolean).join(" \xB7 ")
      };
      if (this.handshake?.outdated) {
        this.lastCheck.detail = `${this.lastCheck.detail} \xB7 update Graphite Sync (this server accepts ${this.handshake.floor} or newer)`;
        this.setStatus("update Graphite Sync", "bad");
        if (loud) new import_obsidian4.Notice(outdatedSentence(this.handshake, "written"), 12e3);
      } else {
        this.setStatus(who, "ok");
        if (loud) {
          new import_obsidian4.Notice(this.onComputer ? "Graphite: connected to the Graphite app on this computer." : `Graphite: connected as ${who}.`);
        }
      }
      this.refreshPanel();
      this.refreshLinks();
      void this.reportVault();
      void this.fetchBinding().catch(() => void 0);
      if (this.settings.censusOn) void this.reportCensus();
      void this.publishToolbarListsSoon();
      if (this.settings.agentOn) void this.publishAgentContract();
      else void this.refreshRoutes();
      window.clearTimeout(this.mirrorTimer);
      this.mirrorTimer = window.setTimeout(() => void this.mirrorEverySpace(false), this.firstMirrorDelayMs);
      return true;
    } catch (e) {
      this.lastMe = null;
      const status = e?.status ?? "";
      const why = this.onComputer ? status === 401 ? "Graphite did not accept the key; choose This computer again" : doorShort("refused") : status === 401 ? "token rejected (expired or revoked?)" : `unreachable (${status || e})`;
      this.lastCheck = { at: Date.now(), ok: false, detail: why };
      this.setStatus(why, "bad");
      if (loud) new import_obsidian4.Notice(`Graphite: ${this.onComputer && status !== 401 ? doorSentence("refused") : why}`);
      this.refreshPanel();
      return false;
    }
  }
  /* ══ REGISTER 1527 · THE VERSION HANDSHAKE ═══════════════════════════════
   * One call at startup: the GET /health the connection check makes anyway
   * carries the oldest plugin the server accepts (handshake.ts). */
  /** GET /health, shared by whoever asks while it is in flight. Reading it
   *  also records the handshake. */
  askHealth() {
    if (!this.healthAsk) {
      this.healthAsk = (0, import_obsidian4.requestUrl)({ url: this.api("/health") }).then((res) => {
        this.handshake = readHandshake(res.json, this.manifest.version);
        return res;
      }).catch(() => null).finally(() => {
        this.healthAsk = null;
      });
    }
    return this.healthAsk;
  }
  /** May this plugin write to Graphite? Asks /health only if no answer has
   *  come yet (a write made before the startup check returned). A server
   *  that cannot be reached is not a refusal here: the write itself fails
   *  and says so. `loud` false is an automatic write, said once. */
  async writeAllowed(what, loud = true) {
    if (!this.handshake) await this.askHealth();
    if (!this.handshake?.outdated) return true;
    if (loud || !this.toldOutdated) new import_obsidian4.Notice(outdatedSentence(this.handshake, what), 12e3);
    this.toldOutdated = true;
    return false;
  }
  /** The sentence the panels show while this plugin is out of date. */
  outdatedNote() {
    return this.handshake?.outdated ? outdatedSentence(this.handshake, "written") : null;
  }
  /* ══ REGISTER 2519 · THE LINKS PANEL ═════════════════════════════════════ */
  async openLinks() {
    let leaf = this.app.workspace.getLeavesOfType(LINKS_VIEW)[0];
    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false);
      await leaf.setViewState({ type: LINKS_VIEW, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
  }
  refreshLinks() {
    for (const v of this.linksViews) v.render();
  }
  /** Which record a line of a note stands for (links.ts recordAt). */
  spotIn(path, lines, at) {
    const entry = path ? this.settings.files[path] : void 0;
    return recordAt(lines, at, entry ? { synced: { role: entry.role } } : {});
  }
  /** The cursor hook. With no panel open this returns before touching the
   *  editor; with one open it hands the feed a way to find the line later. */
  cursorMovedIn(view) {
    if (!this.feed?.isOpen) return;
    const path = this.app.workspace.getActiveFile()?.path ?? null;
    const state = view.state;
    this.feed.moved(() => this.spotIn(
      path,
      state.doc.toString().split("\n"),
      state.doc.lineAt(state.selection.main.head).number - 1
    ));
  }
  /** The same, for a cursor somewhere a test (or a note switch) names. */
  cursorAt(path, text, line) {
    this.feed.moved(() => this.spotIn(path, text.split("\n"), line));
  }
  /** A note was switched to, or the panel opened: ask about where the
   *  cursor is now, through the same debounce. */
  nudgeLinks() {
    if (!this.feed?.isOpen) return;
    const ed = this.app.workspace.activeEditor?.editor;
    const path = this.app.workspace.getActiveFile()?.path ?? null;
    this.feed.moved(() => ed ? this.spotIn(path, ed.getValue().split("\n"), ed.getCursor().line) : { none: NOT_A_RECORD });
  }
  /** GET the link log of one record — grouped by module, as the server
   *  answers it, and refused if it arrives in any other shape. */
  async fetchLinkLog(r) {
    if (this.onDevice) {
      throw new Error("link history needs a Graphite server");
    }
    if (this.onComputer) {
      throw new Error("the Graphite app on this computer does not keep link history for a notes app yet");
    }
    const res = await (0, import_obsidian4.requestUrl)({
      url: this.api(`/records/${r.kind}/${encodeURIComponent(r.id)}/links`),
      headers: this.headers,
      throw: false
    });
    if (res.status === 404) throw new Error("the server does not know this record, or is older than the link log");
    if (res.status >= 300) throw new Error(`the server answered ${res.status}`);
    const log = readLinkLog(res.json);
    if (!log) throw new Error("the server answered in a shape this plugin cannot read");
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
    if (this.offServer) {
      this.vaultReport = null;
      this.refreshPanel();
      return;
    }
    try {
      const name = this.app.vault.getName();
      const mine = await (0, import_obsidian4.requestUrl)({
        url: this.api("/mirror/vaults/mine"),
        method: "POST",
        contentType: "application/json",
        body: JSON.stringify({ name, pluginVersion: this.manifest?.version }),
        headers: this.headers,
        throw: false
      });
      const res = mine.status !== 404 ? mine : await (0, import_obsidian4.requestUrl)({
        url: this.api("/mirror/vaults"),
        method: "POST",
        contentType: "application/json",
        body: JSON.stringify({ name }),
        headers: this.headers,
        throw: false
      });
      this.vaultReport = res.status === 403 ? "gated" : res.status >= 400 ? "failed" : null;
    } catch {
      this.vaultReport = "failed";
    }
    this.refreshPanel();
  }
  /** ROW 2376: ask the server which devices and tokens this account has.
   *  Asked when the settings tab opens — where a person looks — rather than
   *  on every connection check, which runs on its own every few minutes. */
  async fetchDevices() {
    if (this.offServer) {
      this.devices = null;
      this.devicesReport = this.onComputer ? "computer" : "device";
      return;
    }
    if (!this.settings.serverUrl || !this.settings.token) {
      this.devices = null;
      this.devicesReport = null;
      return;
    }
    try {
      const res = await (0, import_obsidian4.requestUrl)({
        url: this.api("/auth/sessions"),
        headers: this.headers,
        throw: false
      });
      if (res.status < 300 && Array.isArray(res.json)) {
        this.devices = res.json.map((d) => ({
          id: String(d?.id ?? ""),
          userAgent: typeof d?.userAgent === "string" ? d.userAgent : "",
          createdAt: typeof d?.createdAt === "string" ? d.createdAt : null,
          lastUsedAt: typeof d?.lastUsedAt === "string" ? d.lastUsedAt : null,
          current: d?.current === true
        }));
        this.devicesReport = null;
        return;
      }
      this.devices = null;
      this.devicesReport = res.status === 404 ? "old-server" : res.status === 401 || res.status === 403 ? "refused" : "failed";
    } catch {
      this.devices = null;
      this.devicesReport = "failed";
    }
  }
  /** ROW 2376: every Graphite server the vaults on this machine point at.
   *  On a phone, or with no readable vault registry, that is this vault's
   *  own server — Obsidian shows a plugin no other vault there. */
  serversOnThisMachine() {
    const configs = this.offServer ? [] : [{ vault: "This vault", url: this.settings.serverUrl, here: true }];
    if (import_obsidian4.Platform.isDesktopApp) {
      const req = window.require;
      if (req) {
        try {
          const fs = req("fs");
          const p = req("path");
          for (const v of this.listVaults()) {
            if (v.current) continue;
            try {
              const data = JSON.parse(fs.readFileSync(
                p.join(v.path, ".obsidian", "plugins", "graphite-sync", "data.json"),
                "utf8"
              ));
              if (typeof data?.serverUrl === "string") {
                configs.push({ vault: v.name, url: data.serverUrl, here: false });
              }
            } catch {
            }
          }
        } catch {
        }
      }
    }
    return groupServers(configs);
  }
  /** ROW 2376: one press, one unauthenticated /health — a server another
   *  vault uses has no token of THIS vault's to present, and needs none to
   *  say whether it answers. */
  async checkServer(url) {
    const at = Date.now();
    try {
      const res = await (0, import_obsidian4.requestUrl)({
        url: `${url.replace(/\/+$/, "")}/api/health`,
        throw: false
      });
      const v = res.json?.version;
      this.serverChecks[serverKey(url)] = res.status < 300 ? { at, ok: true, detail: v ? `Graphite ${v}` : "" } : { at, ok: false, detail: `answered ${res.status}` };
    } catch (e) {
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
  autoCaptureDelay = 6e4;
  /** NOTE PAGES: whole notes sent to Graphite (pages.ts). */
  pages;
  autoCaptureTimers = {};
  autoCaptureSoon(file) {
    window.clearTimeout(this.autoCaptureTimers[file.path]);
    this.autoCaptureTimers[file.path] = window.setTimeout(() => {
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
  async captureVault(opts = {}) {
    if (this.needsServer("Capturing tasks from notes", !opts.quiet)) return;
    let binding;
    try {
      binding = await this.fetchBinding();
    } catch (e) {
      new import_obsidian4.Notice(`Graphite: nothing was captured \u2014 the server could not be asked about this vault (${e?.message ?? e}). Check the connection, then capture again.`, 12e3);
      return;
    }
    if (binding === null) {
      new import_obsidian4.Notice("Graphite: nothing was captured \u2014 this server does not know which space a vault is bound to yet. Update the Graphite server, then capture again.", 12e3);
      return;
    }
    if (!binding.bound) {
      new import_obsidian4.Notice("Graphite: this vault is not bound to a space yet, so nothing can be captured. Choose its space in the Graphite Sync settings.", 12e3);
      return;
    }
    if (!binding.inbox) {
      new import_obsidian4.Notice("Pick a capture inbox in the Graphite Sync settings first.");
      return;
    }
    if (!await this.writeAllowed("captured")) return;
    const files = (opts.only ?? this.app.vault.getMarkdownFiles()).filter((f) => !opts.only || this.app.vault.getAbstractFileByPath(f.path)).filter((f) => !this.settings.files[f.path] && !isAgentFile(f.path));
    let made = 0;
    let lost = 0;
    let refused = 0;
    let why = "";
    let notesMade = 0;
    let unfiled = 0;
    const routeRefusals = [];
    const lineWarnings = [];
    const tagList = this.settings.captureTags.split(",").map((t) => t.trim()).filter(Boolean);
    const taggedOn = this.settings.captureAnyTagged || tagList.length > 0;
    for (const file of files) {
      const text = await this.app.vault.read(file);
      const lines = text.split("\n");
      const stamps = /* @__PURE__ */ new Map();
      const space = noteSpace(lines);
      const today = noteDay(file.path, text, file.stat?.ctime ?? Date.now());
      const pageRef = await this.pages.beforeCapture(file.path);
      const candidates = captureCandidates(lines, taggedOn).map((i) => {
        const section = sectionFor(lines, i);
        return { text: asServerSpelling(lines[i]), path: file.path, line: i, ...section ? { section } : {} };
      });
      for (let from = 0; from < candidates.length; from += 200) {
        const slice = candidates.slice(from, from + 200);
        const res = await (0, import_obsidian4.requestUrl)({
          // OC2: no module in the path — the server files into the
          // inbox on this vault's binding, inside its wall.
          url: this.api("/mirror/capture"),
          method: "POST",
          contentType: "application/json",
          body: JSON.stringify({
            lines: slice,
            note: file.basename,
            today,
            ...taggedOn ? { tagged: { any: this.settings.captureAnyTagged, tags: tagList } } : {},
            ...space ? { space } : {},
            ...pageRef ? { page: pageRef } : {}
          }),
          headers: this.headers,
          throw: false
        });
        if (res.status >= 300) {
          refused++;
          why = res.json?.message ?? why;
          continue;
        }
        const created = res.json?.created ?? [];
        for (const c of created) {
          stamps.set(c.line, c.id);
          if (c.kind === "note") notesMade++;
          else made++;
        }
        unfiled += (res.json?.unfiled ?? []).length;
        for (const r of res.json?.refused ?? []) {
          routeRefusals.push(`${file.basename}:${r.line + 1} \u2014 ${r.message}`);
        }
        const madeNow = new Set(created.map((c) => c.line));
        for (const w of res.json?.warnings ?? []) {
          if (madeNow.has(w.line)) lineWarnings.push(`${file.basename}:${w.line + 1} \u2014 ${w.message}`);
        }
      }
      if (!stamps.size) continue;
      const current = await this.app.vault.read(file);
      const now = current.split("\n");
      for (const [at, id] of stamps) {
        const was = lines[at];
        const here = now[at] === was ? at : now.indexOf(was);
        if (here < 0) {
          lost++;
          continue;
        }
        now[here] = stampCaptured(now[here], id);
      }
      const next = now.join("\n");
      if (next !== current) {
        this.writingBack++;
        try {
          await this.app.vault.modify(file, next);
        } finally {
          this.writingBack--;
        }
      }
    }
    const said = [
      made ? `${made} task${made === 1 ? "" : "s"}` : "",
      notesMade ? `${notesMade} note${notesMade === 1 ? "" : "s"}` : ""
    ].filter(Boolean).join(" and ");
    if (said) new import_obsidian4.Notice(`Captured ${said}.`);
    else if (refused) new import_obsidian4.Notice("Graphite: nothing was captured.");
    else if (!opts.quiet) new import_obsidian4.Notice("Nothing new to capture.");
    if (unfiled) {
      new import_obsidian4.Notice(`Graphite: ${unfiled} tagged line${unfiled === 1 ? " was" : "s were"} not captured \u2014 the capture inbox's space has no Notes module to put a note in. Add one in the app, then capture again.`, 12e3);
    }
    if (refused) {
      new import_obsidian4.Notice(`Graphite: the server refused ${refused} batch${refused === 1 ? "" : "es"} of lines \u2014 nothing in them was captured. Check the connection and the capture inbox in settings, then capture again.` + (why ? ` The server said: ${why}` : ""), 12e3);
    }
    if (routeRefusals.length) {
      new import_obsidian4.Notice(`Graphite: ${routeRefusals.length} line${routeRefusals.length === 1 ? " was" : "s were"} not captured:
${routeRefusals.slice(0, 6).join("\n")}`, 15e3);
    }
    if (lineWarnings.length) {
      new import_obsidian4.Notice(`Graphite: ${lineWarnings.length} captured line${lineWarnings.length === 1 ? "" : "s"} did not land as written:
${lineWarnings.slice(0, 6).join("\n")}`, 15e3);
    }
    if (lost) {
      new import_obsidian4.Notice(`Graphite: ${lost} captured line${lost === 1 ? " was" : "s were"} edited while capturing and could not be marked. Check your inbox for a duplicate after the next capture.`, 12e3);
    }
    await this.syncTicks(files, { quiet: opts.quiet });
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
  tickTimers = {};
  /** True when a box in this note has moved since the last agreement — the
   *  test that keeps an ordinary edit from becoming a request. */
  ticksMoved(text) {
    return tickLines(text).some((t) => this.settings.ticks[t.id] !== t.state);
  }
  async syncTicks(only, opts = {}) {
    if (this.needsServer("Keeping a ticked box in step with Graphite", !opts.quiet)) return;
    const files = (only ?? this.app.vault.getMarkdownFiles()).filter((f) => !this.settings.files[f.path] && !isAgentFile(f.path));
    const local = /* @__PURE__ */ new Map();
    const where = /* @__PURE__ */ new Map();
    for (const file of files) {
      for (const t of tickLines(await this.app.vault.read(file))) {
        const had = local.get(t.id);
        if (had === void 0 || had === this.settings.ticks[t.id]) local.set(t.id, t.state);
        if (!where.has(t.id)) where.set(t.id, /* @__PURE__ */ new Set());
        where.get(t.id).add(file.path);
      }
    }
    if (!local.size) return;
    if (!await this.writeAllowed("ticked", !opts.quiet)) return;
    const ids = [...local.keys()];
    const remote = /* @__PURE__ */ new Map();
    const gone = /* @__PURE__ */ new Set();
    let unreadable = 0;
    for (let from = 0; from < ids.length; from += 200) {
      const slice = ids.slice(from, from + 200);
      const res = await (0, import_obsidian4.requestUrl)({
        url: this.api("/mirror/ticks/read"),
        method: "POST",
        contentType: "application/json",
        body: JSON.stringify({ ids: slice }),
        headers: this.headers,
        throw: false
      }).catch(() => null);
      if (!res || res.status >= 300) {
        unreadable += slice.length;
        continue;
      }
      for (const t of res.json?.ticks ?? []) {
        remote.set(t.id, t.state);
      }
      for (const id of res.json?.missing ?? []) gone.add(id);
    }
    const agreed = { ...this.settings.ticks };
    const toLine = /* @__PURE__ */ new Map();
    const toServer = [];
    let clashes = 0;
    for (const [id, mine] of local) {
      if (gone.has(id)) {
        delete agreed[id];
        continue;
      }
      const theirs = remote.get(id);
      if (theirs === void 0) continue;
      const m = mergeTick(this.settings.ticks[id], mine, theirs);
      agreed[id] = m.agreed;
      if (m.line) toLine.set(id, m.line);
      if (m.server) toServer.push({ id, to: m.server, from: theirs });
      if (m.clash) clashes++;
    }
    const restore = (id) => {
      if (this.settings.ticks[id]) agreed[id] = this.settings.ticks[id];
      else delete agreed[id];
    };
    let closed = 0;
    let refused = 0;
    for (let from = 0; from < toServer.length; from += 200) {
      const slice = toServer.slice(from, from + 200);
      const res = await (0, import_obsidian4.requestUrl)({
        url: this.api("/mirror/ticks"),
        method: "POST",
        contentType: "application/json",
        body: JSON.stringify({ ticks: slice }),
        headers: this.headers,
        throw: false
      }).catch(() => null);
      if (!res || res.status >= 300) {
        for (const t of slice) restore(t.id);
        unreadable += slice.length;
        continue;
      }
      const out = res.json ?? {};
      for (const a of out.applied ?? []) {
        closed++;
        agreed[a.id] = a.state;
        if (a.state !== local.get(a.id)) toLine.set(a.id, a.state);
      }
      for (const o of out.overridden ?? []) {
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
    let ticked = 0;
    const touched = /* @__PURE__ */ new Set();
    for (const id of toLine.keys()) for (const p of where.get(id) ?? []) touched.add(p);
    for (const p of touched) {
      const file = files.find((f) => f.path === p);
      const current = await this.app.vault.read(file);
      const lines = current.split("\n");
      for (const t of tickLines(current)) {
        const want = toLine.get(t.id);
        if (want === void 0 || t.state === want) continue;
        if (t.state !== local.get(t.id)) {
          restore(t.id);
          continue;
        }
        lines[t.at] = withTick(lines[t.at], want);
        ticked++;
      }
      const next = lines.join("\n");
      if (next !== current) {
        this.writingBack++;
        try {
          await this.app.vault.modify(file, next);
        } finally {
          this.writingBack--;
        }
      }
    }
    this.settings.ticks = agreed;
    await this.saveSettings();
    const said = [];
    if (ticked) said.push(`${ticked} line${ticked === 1 ? "" : "s"} updated from Graphite`);
    if (closed) said.push(`${closed} tick${closed === 1 ? "" : "s"} sent to Graphite`);
    if (said.length && !opts.quiet) new import_obsidian4.Notice(`Graphite: ${said.join(", ")}.`);
    if (clashes) {
      new import_obsidian4.Notice(`Graphite: ${clashes} tick${clashes === 1 ? " was" : "s were"} overridden \u2014 the task was cancelled or changed in Graphite, and the line now shows its state (a cancelled task shows [-]).`, 12e3);
    }
    if (refused) {
      new import_obsidian4.Notice(`Graphite: ${refused} tick${refused === 1 ? "" : "s"} could not be written \u2014 your role in that space cannot change those tasks. The lines were left as they are.`, 12e3);
    }
    if (unreadable) {
      new import_obsidian4.Notice(`Graphite: could not reach the server for ${unreadable} ticked line${unreadable === 1 ? "" : "s"} \u2014 nothing was changed for them. They will be tried again.`, 12e3);
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
  censusState = null;
  async reportCensus(opts = {}) {
    if (!this.settings.censusOn) {
      if (opts.loud) new import_obsidian4.Notice("Graphite: turn on the vault census in the Graphite Sync settings first.");
      return;
    }
    if (this.needsServer("The vault census", !!opts.loud)) return;
    const today = localDay(Date.now());
    const notes = [];
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (this.settings.files[f.path] || isAgentFile(f.path)) continue;
      const n = censusOf(f.path, await this.app.vault.read(f), f.stat?.ctime ?? Date.now());
      if (inCensus(n, today)) notes.push(n);
    }
    if (notes.length > 2e3) {
      this.censusState = "too-big";
      new import_obsidian4.Notice(`Graphite: the vault census is ${notes.length} notes, over the 2000 Graphite takes \u2014 it was not sent, and the morning sweep will say it could not look.`, 12e3);
      return;
    }
    if (!await this.writeAllowed("sent", !!opts.loud)) return;
    const res = await (0, import_obsidian4.requestUrl)({
      url: this.api("/mirror/census"),
      method: "PUT",
      contentType: "application/json",
      body: JSON.stringify({ vault: this.app.vault.getName(), notes }),
      headers: this.headers,
      throw: false
    }).catch(() => null);
    if (!res || res.status >= 300) {
      this.censusState = "failed";
      if (opts.loud) {
        new import_obsidian4.Notice("Graphite: the vault census could not be sent \u2014 the morning sweep will say it could not look at the vault until one arrives.", 12e3);
      }
      return;
    }
    this.censusState = { at: Date.now(), notes: notes.length };
    if (opts.loud) {
      new import_obsidian4.Notice(`Graphite: vault census sent \u2014 ${notes.length} note${notes.length === 1 ? "" : "s"}, counts, dates, tags and links only.`);
    }
  }
  /** A note was edited: if a box moved, sync that note shortly. */
  tickSoon(file, text) {
    if (!this.ticksMoved(text)) return;
    window.clearTimeout(this.tickTimers[file.path]);
    this.tickTimers[file.path] = window.setTimeout(
      () => void this.syncTicks([file], { quiet: true }),
      this.tickDelayMs
    );
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
  agentState = null;
  async publishAgentContract(opts = {}) {
    if (!this.settings.agentOn) {
      if (opts.loud) new import_obsidian4.Notice('Graphite: turn on "Publish the agent contract" in the Graphite Sync settings first.');
      return;
    }
    const at = (/* @__PURE__ */ new Date()).toISOString();
    const routed = await this.refreshRoutes();
    let vocabulary = null;
    if (routed) {
      const res = await (0, import_obsidian4.requestUrl)({ url: this.api("/tags"), headers: this.headers, throw: false }).catch(() => null);
      if (res && res.status < 300 && Array.isArray(res.json)) {
        vocabulary = res.json.map((t) => String(t.name ?? "")).filter(Boolean);
      }
    }
    const before = this.settings.routingList;
    let stale = null;
    if (routed && vocabulary) {
      const fresh = routingListOf(this.routes(), vocabulary, at);
      const same2 = before && JSON.stringify([before.spaces, before.tags]) === JSON.stringify([fresh.spaces, fresh.tags]);
      this.settings.routingList = same2 ? before : fresh;
      this.agentState = "published";
    } else {
      stale = at;
      this.agentState = "stale";
    }
    await this.saveSettings();
    const list = this.settings.routingList ?? { at, spaces: [], tags: [] };
    const folders = this.settings.agentFolders.split(",").map((f) => f.trim()).filter(Boolean);
    await this.writeOwnNote(ROUTING_LIST_PATH, routingListNote(list, stale));
    await this.writeOwnNote(AGENT_BRIEF_PATH, agentBriefNote(folders));
    if (opts.loud) {
      new import_obsidian4.Notice(stale ? "Graphite: could not reach Graphite to refresh the routing list \u2014 the last one stands, and the note says so." : `Graphite: published the routing list (${list.spaces.length} space${list.spaces.length === 1 ? "" : "s"}, ${list.tags.length} tag${list.tags.length === 1 ? "" : "s"}) and the agent brief into Graphite/.`, 8e3);
    }
  }
  /** Write one of the plugin's own notes, only when it changed. */
  async writeOwnNote(path, text) {
    const folder = path.slice(0, path.lastIndexOf("/"));
    if (!this.app.vault.getAbstractFileByPath(folder)) await this.app.vault.createFolder(folder);
    const existing = this.app.vault.getAbstractFileByPath(path);
    this.writingBack++;
    try {
      if (existing instanceof import_obsidian4.TFile) {
        if (await this.app.vault.read(existing) !== text) await this.app.vault.modify(existing, text);
      } else {
        await this.app.vault.create(path, text);
      }
    } finally {
      this.writingBack--;
    }
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
  async approveProposals(file, which) {
    if (this.needsServer("Approving a proposal", which !== "gestures")) return;
    if (this.settings.files[file.path]) {
      new import_obsidian4.Notice("Graphite: proposals in a synced note are not applied \u2014 that note is rewritten from the app on every sync. Move the line to another note.", 1e4);
      return;
    }
    let binding = null;
    try {
      binding = await this.fetchBinding();
    } catch {
      binding = null;
    }
    if (!binding?.bound || !binding.inbox) {
      if (which !== "gestures" || !this.toldNoInbox) {
        new import_obsidian4.Notice("Graphite: this vault is not bound to a space with a capture inbox, so nothing was created. Choose them in the Graphite Sync settings, then approve again.", 1e4);
        this.toldNoInbox = true;
      }
      return;
    }
    const lines = (await this.app.vault.read(file)).split("\n");
    const found = proposalsIn(lines).filter((p) => p.state !== "unreadable" && (which === "all" ? true : which === "gestures" ? p.state === "approved" : which.includes(p.key)));
    if (!found.length) return;
    const held = !this.settings.agentOn ? [] : found.map((p) => ({ p, why: contractProblems(lines[p.line], this.settings.routingList) })).filter((x) => x.why.length);
    for (const x of held) found.splice(found.indexOf(x.p), 1);
    if (held.length) {
      new import_obsidian4.Notice([
        `Graphite: ${held.length} proposal${held.length === 1 ? "" : "s"} held \u2014 still proposals, nothing created:`,
        ...held.map((x) => `line ${x.p.line + 1}: ${x.why.join("; ")}.`)
      ].join("\n"), 15e3);
    }
    if (!found.length) return;
    if (!await this.writeAllowed("approved", which !== "gestures")) return;
    const space = noteSpace(lines);
    const res = await (0, import_obsidian4.requestUrl)({
      url: this.api("/mirror/capture"),
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify({
        lines: found.map((p) => {
          const section = sectionFor(lines, p.line);
          return { text: approvedText(lines[p.line]), path: file.path, line: p.line, ...section ? { section } : {} };
        }),
        note: file.basename,
        ...space ? { space } : {}
      }),
      headers: this.headers,
      throw: false
    });
    if (res.status >= 300) {
      new import_obsidian4.Notice(`Graphite: approval was refused by the server (${res.status}) \u2014 nothing was created and your note is unchanged.`, 12e3);
      return;
    }
    const keyAt = new Map(found.map((p) => [p.line, p.key]));
    const made = /* @__PURE__ */ new Map();
    for (const c of res.json?.created ?? []) {
      const key = keyAt.get(c.line);
      if (key) made.set(key, c.id);
    }
    const refusedLines = res.json?.refused ?? [];
    const now = (await this.app.vault.read(file)).split("\n");
    let lost = 0;
    for (const [key, id] of made) {
      const at = lineOfKey(now, key);
      if (at < 0) {
        lost++;
        continue;
      }
      now[at] = finalised(now[at], id);
    }
    if (made.size) {
      this.writingBack++;
      try {
        await this.app.vault.modify(file, now.join("\n"));
      } finally {
        this.writingBack--;
      }
    }
    const said = [`Graphite: approved ${made.size} \u2014 created in Graphite.`];
    for (const r of refusedLines) said.push(`line ${r.line + 1}: ${r.message} \u2014 still a proposal.`);
    if (lost) said.push(`${lost} approved line${lost === 1 ? " was" : "s were"} deleted while it was created; its record exists.`);
    new import_obsidian4.Notice(said.join("\n"), refusedLines.length || lost ? 15e3 : 4e3);
    this.refreshPanel();
  }
  /** The two gestures read off a line: a tick on an italic proposal, or a
   *  proposal with its italics removed. */
  async approveGestures(file) {
    if (this.writingBack > 0) return;
    const text = await this.app.vault.read(file);
    if (!proposalsIn(text.split("\n")).some((p) => p.state === "approved")) return;
    await this.approveProposals(file, "gestures");
  }
  /** The proposals in the note in front of him, for the panel. */
  async activeProposals() {
    const file = this.app.workspace.getActiveFile();
    if (!file || file.extension !== "md") return null;
    const lines = (await this.app.vault.read(file)).split("\n");
    return { file, list: proposalsIn(lines), lines };
  }
  /* ══ OC3 · THE ROUTE LIST ═════════════════════════════════════════════ */
  /** Fetched with `GET /spaces`, which already carries every space's
   *  parent, tags, state, role and modules — so the picker never asks a
   *  module route for anything. */
  async refreshRoutes() {
    if (!this.configured) return false;
    try {
      const res = await (0, import_obsidian4.requestUrl)({ url: this.api("/spaces"), headers: this.headers, throw: false });
      if (res.status >= 300 || !Array.isArray(res.json)) return false;
      this.settings.routeCache = res.json.map((s) => ({
        id: s.id,
        name: s.name,
        parentId: s.parentId ?? null,
        tags: s.tags ?? [],
        status: s.status ?? null,
        personId: s.personId ?? null,
        myRole: s.myRole ?? null,
        modules: (s.modules ?? []).map((m) => ({ id: m.id, type: m.type, name: m.name }))
      }));
      await this.saveSettings();
      return true;
    } catch {
      return false;
    }
  }
  routes() {
    return buildRoutes(this.settings.routeCache ?? [], this.settings.routeRecent ?? []);
  }
  /** Write a destination where the cursor is: the note's `lp_space:` in the
   *  frontmatter, otherwise the token at the end of the line's words. */
  insertRoute(editor, route, line, span) {
    const all = this.routes();
    const text = editor.getLine(line);
    const lines = Array.from({ length: Math.min(editor.lineCount(), 400) }, (_, i) => editor.getLine(i));
    const fm = frontmatterRange(lines);
    if (fm && line > fm[0] && line < fm[1]) {
      editor.replaceRange(frontmatterFor(route, all), { line, ch: 0 }, { line, ch: text.length });
    } else if (span) {
      editor.replaceRange(`${insertionFor(route, all)} `, span.from, span.to);
    } else {
      const bar = text.indexOf(" | ");
      const at = bar < 0 ? text.replace(/\s+$/, "").length : bar;
      editor.replaceRange(` ${insertionFor(route, all)}`, { line, ch: at }, { line, ch: at });
    }
    this.settings.routeRecent = [route.spaceId, ...(this.settings.routeRecent ?? []).filter((x) => x !== route.spaceId)].slice(0, 12);
    void this.saveSettings();
  }
  /** RULED 2026-09-24: the selected bullets (or the cursor's) become tasks. */
  makeTasksIn(editor) {
    const from = editor.getCursor("from").line;
    const to = editor.getCursor("to").line;
    const before = Array.from({ length: to - from + 1 }, (_, i) => editor.getLine(from + i));
    const after = makeTasks(before);
    const changed = after.filter((l, i) => l !== before[i]).length;
    if (!changed) {
      new import_obsidian4.Notice("Graphite: no plain bullets here to make into tasks.");
      return;
    }
    editor.replaceRange(after.join("\n"), { line: from, ch: 0 }, { line: to, ch: before[before.length - 1].length });
    new import_obsidian4.Notice(`Graphite: ${changed} bullet${changed === 1 ? "" : "s"} made into task${changed === 1 ? "" : "s"}. They are captured on the next capture.`);
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
  registerBarCommands() {
    const bar = [
      ["start-list", "Start a list", (e) => this.barStartList(e)],
      ["task", "Task", (e) => this.barTask(e)],
      ["due", "Due", (e) => this.barDue(e)],
      ["assign", "Assign", (e) => this.barAssign(e)],
      ["priority", "Priority", (e) => this.barPriority(e)],
      ["tag", "Tag", (e) => this.barTag(e)],
      ["send-to", "Send to", (e) => this.barSendTo(e)]
    ];
    this.addCommand({ id: "lp-bar-capture-now", name: "Graphite bar: Capture now", callback: () => this.barCaptureNow() });
    this.addCommand({
      id: "lp-bar-publish-lists",
      name: "Publish the picker lists for devices with no sign-in",
      callback: () => this.publishToolbarLists({ loud: true })
    });
    for (const [id, name, run] of bar) {
      this.addCommand({ id: `lp-bar-${id}`, name: `Graphite bar: ${name}`, editorCallback: (editor) => run(editor) });
    }
  }
  /** The note of the pane whose button is running, so a bar in a split pane
   *  acts on its own note and not on whichever pane has the cursor. */
  barFile = null;
  /** Draw the bar in every note that wants one, and take it from the rest.
   *  Idempotent: a pane that has its bar keeps it, so any event may call this. */
  syncBars() {
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      const host = view?.contentEl;
      if (!host) continue;
      const path = view.file?.path;
      const want = barWanted({
        on: this.settings.barOn,
        path,
        synced: !!path && !!this.settings.files[path],
        own: !!path && (isAgentFile(path) || isToolbarFile(path) || path === SETTINGS_NOTE_PATH)
      });
      const have = Array.from(host.children).filter((c) => c.hasClass?.("gr-bar"));
      if (!want) {
        have.forEach((b) => b.detach());
        continue;
      }
      have.slice(1).forEach((b) => b.detach());
      if (have.length) continue;
      const pane = {
        editor: view.editor,
        getMode: () => view.getMode?.(),
        file: () => view.file ?? null
      };
      const bar = drawBar(host, pane, { mobile: this.barMobile, run: (id, p) => this.runBar(id, p) });
      if (!this.barMobile && host.firstChild && host.firstChild !== bar) host.insertBefore(bar, host.firstChild);
    }
  }
  /** A press on the bar: the command behind the button, against the pane the
   *  bar belongs to. */
  async runBar(id, pane) {
    if (pane.getMode?.() === "preview") {
      new import_obsidian4.Notice("Graphite: switch this note to editing to use the bar.");
      return;
    }
    const e = pane.editor;
    this.barFile = pane.file?.() ?? null;
    try {
      switch (id) {
        case "start-list":
          await this.barStartList(e);
          break;
        case "task":
          await this.barTask(e);
          break;
        case "due":
          await this.barDue(e);
          break;
        case "assign":
          await this.barAssign(e);
          break;
        case "priority":
          await this.barPriority(e);
          break;
        case "tag":
          await this.barTag(e);
          break;
        case "send-to":
          await this.barSendTo(e);
          break;
        case "capture-now":
          await this.barCaptureNow();
          break;
        default:
          break;
      }
    } finally {
      this.barFile = null;
    }
  }
  /** Capture this note now. A device with no sign-in cannot, and says whose
   *  job it is: the PC captures once the sync brings the note over. */
  async barCaptureNow() {
    if (!this.configured) {
      new import_obsidian4.Notice("Graphite: this device has no sign-in, so your PC captures this note once your sync brings it over.");
      return;
    }
    const file = this.barFile ?? this.app.workspace.getActiveFile();
    await this.captureVault(file instanceof import_obsidian4.TFile ? { only: [file] } : {});
  }
  /** The note under the cursor as the bar reads it, or null (and said) in a
   *  synced Graphite file. */
  barNote(editor) {
    const file = this.barFile ?? this.app.workspace.getActiveFile();
    if (file && this.settings.files[file.path]) {
      new import_obsidian4.Notice("Graphite: the bar does not work in a synced Graphite file \u2014 its lines are records, and the app is where they change.");
      return null;
    }
    const lines = Array.from({ length: editor.lineCount() }, (_, i) => editor.getLine(i));
    return {
      file,
      lines,
      line: editor.getCursor().line,
      day: noteDay(file?.path ?? "", lines.join("\n"), file?.stat?.ctime ?? Date.now())
    };
  }
  /** A line a field may be written onto: said, and null, when the app owns it. */
  barFieldLine(note) {
    const text = note.lines[note.line] ?? "";
    if (isCaptured(text)) {
      new import_obsidian4.Notice("Graphite: this line is already in Graphite \u2014 change its fields in the app, where the record lives.");
      return null;
    }
    return text;
  }
  /** Put [text] on line [line], leaving the cursor at its end. */
  barWrite(editor, line, text) {
    const old = editor.getLine(line) ?? "";
    editor.replaceRange(text, { line, ch: 0 }, { line, ch: old.length });
    editor.setCursor({ line, ch: text.length });
  }
  /** Where a popover opens: under the cursor, where the editor can say. */
  barAnchor(editor) {
    try {
      const cm = editor.cm;
      const at = cm?.coordsAtPos?.(editor.posToOffset(editor.getCursor()));
      return at ? { x: at.left, y: at.bottom + 4 } : null;
    } catch {
      return null;
    }
  }
  get barMobile() {
    return import_obsidian4.Platform.isMobile;
  }
  /** The lists, from the cache; a first use waits for one build. */
  async barLists() {
    if (!this.configured) await this.adoptToolbarLists();
    else if (!this.settings.toolbarCache) await this.refreshToolbarLists();
    return this.settings.toolbarCache;
  }
  async barTask(editor) {
    const note = this.barNote(editor);
    if (!note) return;
    const text = note.lines[note.line] ?? "";
    if (/^\s*[-*]\s+\[[ xX-]\]\s?\S/.test(text)) {
      editor.replaceRange(`
${nextTaskLine(text)}`, { line: note.line, ch: text.length });
      editor.setCursor({ line: note.line + 1, ch: nextTaskLine(text).length });
      return;
    }
    this.barWrite(editor, note.line, asTaskLine(text));
  }
  async barDue(editor) {
    const note = this.barNote(editor);
    const text = note && this.barFieldLine(note);
    if (!note || text === null) return;
    const line = note.line;
    new DueModal(this.app, this.barMobile, this.barAnchor(editor), {
      noteDay: note.day,
      words: asTaskLine(text).replace(/^\s*[-*]\s+\[[ xX-]\]\s?/, "").split(" | ")[0].replace(/\s*#\S+/g, "").trim(),
      current: readDue(readField(text, "due")),
      onSet: (value) => this.barWrite(editor, line, setField(asTaskLine(editor.getLine(line) ?? ""), "due", value))
    }).open();
  }
  async barAssign(editor) {
    const note = this.barNote(editor);
    const text = note && this.barFieldLine(note);
    if (!note || text === null) return;
    const lists = await this.barLists();
    const dest = destinationOf(note.lines, note.line, this.routes(), lists?.bound.inboxModuleId ?? null);
    if (!dest.route) {
      new import_obsidian4.Notice("Graphite: this line does not name a space, and the vault has no capture inbox to fall back on, so there is nobody to offer. Send it somewhere first.");
      return;
    }
    const leaf = dest.route.path[dest.route.path.length - 1];
    const people = lists?.people[dest.route.spaceId] ?? [];
    if (!people.length) {
      new import_obsidian4.Notice(`Graphite: no people are known for ${leaf} yet. Connect to Graphite once and they are kept.`);
      return;
    }
    const me = this.lastMe?.name;
    const line = note.line;
    new PickModal(this.app, this.barMobile, this.barAnchor(editor), {
      title: `Assign to someone in ${leaf}`,
      items: people.map((p) => ({
        label: p.name,
        color: p.color ?? "",
        hint: me && p.name === me ? "you" : void 0,
        data: p
      })),
      writes: (i) => `Writes | assigned: ${i.data.name}`,
      onChoose: (i) => this.barWrite(editor, line, setField(asTaskLine(editor.getLine(line) ?? ""), "assigned", i.data.name))
    }).open();
  }
  async barPriority(editor) {
    const note = this.barNote(editor);
    const text = note && this.barFieldLine(note);
    if (!note || text === null) return;
    const line = note.line;
    const current = readField(text, "priority")?.replace(/\\\|/g, "|").toLowerCase();
    const lists = await this.barLists();
    const inbox = lists?.bound.inboxModuleId ?? null;
    const moduleId = taskModuleOf(destinationOf(note.lines, note.line, this.routes(), inbox), inbox);
    const choices = priorityChoices(moduleId ? lists?.words[moduleId] : null);
    new PickModal(this.app, this.barMobile, this.barAnchor(editor), {
      title: "Priority",
      items: choices.map((c) => ({ label: c.label, hint: c.hint, data: c.value })),
      start: (i) => i.data.replace(/\\\|/g, "|").toLowerCase() === current,
      writes: (i) => `Writes | priority: ${i.data}`,
      onChoose: (i) => this.barWrite(editor, line, setField(asTaskLine(editor.getLine(line) ?? ""), "priority", i.data))
    }).open();
  }
  async barTag(editor) {
    const note = this.barNote(editor);
    const text = note && this.barFieldLine(note);
    if (!note || text === null) return;
    const lists = await this.barLists();
    const tags = lists?.tags ?? [];
    const line = note.line;
    new PickModal(this.app, this.barMobile, this.barAnchor(editor), {
      title: "Tag",
      filter: true,
      items: tags.map((t) => ({ label: `#${t}`, data: t })),
      extra: (q) => {
        const t = cleanTag(q);
        return t && !tags.some((x) => x.toLowerCase() === t.toLowerCase()) ? { label: `+ New tag "${t}"`, data: t } : null;
      },
      writes: (i) => `Writes #${i.data} at the end of the words`,
      onChoose: (i) => this.barWrite(editor, line, addTag(asTaskLine(editor.getLine(line) ?? ""), i.data))
    }).open();
  }
  /** START A LIST. What are you writing, then where it goes, then the heading
   *  the server already routes every line under - `## Actions >> Work / Action
   *  items` - and a first box with the cursor on it. The notes own space is
   *  suggested first, else the capture inbox; a vault with no module of the
   *  kind is told so. Calendar and the rest are shown and marked later. */
  async barStartList(editor) {
    const note = this.barNote(editor);
    if (!note) return;
    const lists = await this.barLists();
    const line = note.line;
    const kinds = [
      { label: "A task list", detail: "Boxes to tick, each one a task", data: "tasks" },
      { label: "Notes", detail: "Plain lines that become notes", data: "notes" },
      { label: "Calendar events", hint: "later", disabled: true, data: null },
      { label: "Shopping, reminders, expenses", hint: "later", disabled: true, data: null }
    ];
    new PickModal(this.app, this.barMobile, this.barAnchor(editor), {
      title: "What are you writing?",
      items: kinds,
      onChoose: (k) => {
        if (k.data) this.barStartWhere(editor, k.data, note.lines, line, lists);
      }
    }).open();
  }
  barStartWhere(editor, kind, lines, line, lists) {
    const routes = this.routes();
    const spaces = lists?.spaces ?? this.settings.routeCache;
    const inboxId = lists?.bound.inboxModuleId ?? null;
    const rootId = lists?.bound.rootId ?? null;
    const targets = listTargets(routes, spaces, kind, rootId);
    const noun = kind === "tasks" ? "Tasks" : "Notes";
    if (!targets.length) {
      new import_obsidian4.Notice(`Graphite: this vault has no ${noun} modules to put a list in. Add one in Graphite, then try again.`);
      return;
    }
    const dest = destinationOf(lines, line, routes, inboxId);
    const first = suggestedTarget(targets, dest, inboxId);
    const rootName = spaces.find((s) => s.id === rootId)?.name;
    const row = (t, group, hint) => ({
      label: targetLabel(t),
      group,
      hint,
      data: t
    });
    const items = [
      ...first ? [row(first, "SUGGESTED", dest.via === "inbox" || dest.via === "none" || !dest.route ? "capture inbox" : "this note's space")] : [],
      ...targets.map((t) => row(t, `ALL ${noun.toUpperCase()} MODULES${rootName ? ` IN ${rootName.toUpperCase()}` : ""}`))
    ];
    let words = this.settings.barHeading || "Actions";
    const tidy = (v) => v.replace(/[\r\n]+|>>/g, " ").replace(/\s+/g, " ").trim() || "Actions";
    new PickModal(this.app, this.barMobile, this.barAnchor(editor), {
      title: `${kind === "tasks" ? "A task list" : "Notes"}. Where do these ${kind === "tasks" ? "tasks" : "notes"} go?`,
      filter: true,
      items,
      writes: (i, footer) => `Writes ${listStart(tidy(footer), targetToken(i.data, routes), kind)[0]}`,
      footer: {
        label: "Heading",
        value: words,
        onChange: (v) => {
          words = v;
          this.settings.barHeading = tidy(v);
          void this.saveSettings();
        }
      },
      onChoose: (i) => {
        const block = listStart(tidy(words), targetToken(i.data, routes), kind);
        const out = insertBlock(lines, line, block);
        const old = editor.getLine(line) ?? "";
        if (!old.trim()) {
          editor.replaceRange(block.join("\n"), { line, ch: 0 }, { line, ch: old.length });
        } else {
          editor.replaceRange(`

${block.join("\n")}`, { line, ch: old.length });
        }
        editor.setCursor(out.cursor);
      }
    }).open();
  }
  async barSendTo(editor) {
    if (!this.barNote(editor)) return;
    void this.refreshRoutes();
    new RouteModal(this.app, this, (r) => this.insertRoute(editor, r, editor.getCursor().line)).open();
  }
  listsPublishedAt = 0;
  /** On connecting: publish, but not more than once in ten minutes, so a
   *  flapping connection does not rewrite a file LiveSync is carrying. */
  async publishToolbarListsSoon() {
    if (Date.now() - this.listsPublishedAt < 6e5) return;
    await this.publishToolbarLists();
  }
  /** Write the lists into the vault (Graphite/Toolbar lists.json) for a
   *  device with no sign-in. Only when connected, only when the lists changed
   *  (so a synced vault is not touched every hour), and when Graphite cannot
   *  be reached the file stands as it was. Names only: toolbar-lists.ts has
   *  no field for a token, an address, a vault id or a password. */
  async publishToolbarLists(opts = {}) {
    if (!this.settings.barShare || !this.configured || this.offServer) {
      if (opts.loud) new import_obsidian4.Notice("Graphite: the picker lists are written only while connected, with sharing on in the settings.");
      return;
    }
    this.listsPublishedAt = Date.now();
    const before = this.settings.toolbarCache;
    if (!await this.refreshToolbarLists()) {
      if (opts.loud) new import_obsidian4.Notice("Graphite: could not reach Graphite to refresh the picker lists, so the file stands as it was.");
      return;
    }
    if (before && sameLists(before, this.settings.toolbarCache)) this.settings.toolbarCache = before;
    await this.writeSharedJson(TOOLBAR_LISTS_PATH, listsFile(this.settings.toolbarCache));
    if (opts.loud) new import_obsidian4.Notice(`Graphite: wrote the picker lists to ${TOOLBAR_LISTS_PATH} (${this.settings.toolbarCache.spaces.length} spaces).`);
  }
  /** A plain data file in the vault, written only when it changed. Obsidian
   *  may not index a .json file as a note, so an existing one is found through
   *  the adapter rather than assumed absent. */
  async writeSharedJson(path, text) {
    const folder = path.slice(0, path.lastIndexOf("/"));
    if (!this.app.vault.getAbstractFileByPath(folder)) await this.app.vault.createFolder(folder).catch(() => void 0);
    this.writingBack++;
    try {
      const existing = this.app.vault.getAbstractFileByPath(path);
      if (existing instanceof import_obsidian4.TFile) {
        if (await this.app.vault.read(existing) !== text) await this.app.vault.modify(existing, text);
        return;
      }
      const had = await this.app.vault.adapter.read(path).catch(() => null);
      if (had === text) return;
      if (had !== null) await this.app.vault.adapter.write(path, text);
      else await this.app.vault.create(path, text).catch(() => this.app.vault.adapter.write(path, text));
    } finally {
      this.writingBack--;
    }
  }
  /** A device with no sign-in takes the lists a connected one wrote. Never on
   *  a device that has its own server: its lists are its own, and a file from
   *  another machine must not replace them. Only names are copied
   *  (readListsFile), so a hand-edited or hostile file adds nothing else. */
  async adoptToolbarLists() {
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
  async refreshToolbarLists() {
    if (!this.configured || this.offServer) return false;
    if (!await this.refreshRoutes()) return false;
    const spaces = this.settings.routeCache;
    const before = this.settings.toolbarCache;
    let bound = before?.bound ?? { rootId: null, inboxModuleId: null };
    try {
      const b = await this.fetchBinding();
      if (b) bound = { rootId: b.root?.id ?? null, inboxModuleId: b.inbox?.id ?? null };
    } catch {
    }
    const people = {};
    for (const s of routable(spaces)) {
      const mod = (s.modules ?? []).find((m) => m.type === "TASKS");
      if (!mod) continue;
      const res = await (0, import_obsidian4.requestUrl)({ url: this.api(`/spaces/modules/${mod.id}/people`), headers: this.headers, throw: false }).catch(() => null);
      if (res && res.status < 300 && Array.isArray(res.json)) {
        people[s.id] = res.json.filter((p) => p && typeof p.name === "string" && p.name).map((p) => ({ name: p.name, color: typeof p.color === "string" ? p.color : null }));
      } else if (before?.people[s.id]) people[s.id] = before.people[s.id];
    }
    let tags = before?.tags ?? [];
    const t = await (0, import_obsidian4.requestUrl)({ url: this.api("/tags"), headers: this.headers, throw: false }).catch(() => null);
    if (t && t.status < 300 && Array.isArray(t.json)) tags = t.json.map((x) => String(x.name ?? "")).filter(Boolean);
    const words = {};
    for (const s of routable(spaces)) {
      for (const mod of (s.modules ?? []).filter((m) => m.type === "TASKS")) {
        const res = await (0, import_obsidian4.requestUrl)({ url: this.api(`/modules/${mod.id}/task-settings`), headers: this.headers, throw: false }).catch(() => null);
        if (res && res.status < 300) {
          const w = wordsFromSettings(res.json);
          if (w) words[mod.id] = w;
        } else if (before?.words?.[mod.id]) words[mod.id] = before.words[mod.id];
      }
    }
    this.settings.toolbarCache = buildLists({
      at: (/* @__PURE__ */ new Date()).toISOString(),
      bound,
      spaces,
      people,
      tags: [...tags, ...spaces.flatMap((s) => s.tags ?? [])],
      words
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
      new import_obsidian4.Notice("Graphite: open the note you want to make a space from.");
      return;
    }
    if (this.settings.files[file.path]) {
      new import_obsidian4.Notice("Graphite: this note is already part of a synced space \u2014 push it instead.");
      return;
    }
    if (this.needsServer("Making a space from a note")) return;
    const markdown = await this.app.vault.read(file);
    const res = await (0, import_obsidian4.requestUrl)({
      url: this.api("/spaces/import.md"),
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ markdown, mode: "create_new" }),
      throw: false
    });
    const report = res.json ?? {};
    if (res.status >= 400) {
      new import_obsidian4.Notice(`Graphite: the server refused it (${res.status}) \u2014 ${report.message ?? "see the app"}. Nothing was created.`);
      return;
    }
    if (report.blocked || (report.errors?.length ?? 0) > 0 || !report.space?.id) {
      const first = report.errors?.[0];
      new import_obsidian4.Notice(`Graphite: not created \u2014 ${first ? `line ${first.line}: ${first.message}` : "the file did not pass the import check"}. Nothing was created.`, 12e3);
      return;
    }
    const space = { id: report.space.id, name: report.space.name };
    new import_obsidian4.Notice(`Graphite: created "${space.name}". Pulling it in \u2014 your note stays as it is.`);
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
    if (this.needsServer("Adding a module")) return;
    if (!await this.checkConnection(false)) {
      new import_obsidian4.Notice(this.noConnectionNote());
      return;
    }
    const pickType = (space) => new ModuleTypePicker(this.app, (type) => new ModuleNamePrompt(
      this.app,
      moduleTypeName(type),
      (name) => void this.addModule(space, type, name)
    ).open()).open();
    const active = this.app.workspace.getActiveFile();
    const entry = active ? this.settings.files[active.path] : void 0;
    if (entry) {
      pickType({ id: entry.spaceId, name: entry.spaceName ?? entry.spaceId });
      return;
    }
    try {
      new SpacePicker(this.app, await this.fetchSpaces(), pickType).open();
    } catch (e) {
      new import_obsidian4.Notice(`Graphite: could not list spaces \u2014 ${e}`);
    }
  }
  /** Create the module, then pull the space so its note arrives. A blank
   *  name takes the type's own name, as the app does. */
  async addModule(space, type, name) {
    const res = await (0, import_obsidian4.requestUrl)({
      url: this.api(`/spaces/${space.id}/modules`),
      method: "POST",
      headers: { ...this.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ type, name: name.trim() || moduleTypeName(type) }),
      throw: false
    });
    if (res.status >= 400) {
      new import_obsidian4.Notice(`Graphite: the module was not added (${res.status}) \u2014 ${res.json?.message ?? "see the app"}. Nothing was changed.`, 1e4);
      return;
    }
    new import_obsidian4.Notice(`Graphite: added ${moduleTypeName(type)} "${name.trim() || moduleTypeName(type)}" to "${space.name}".`);
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
  vaultUrl(rest = "") {
    return this.api(`/mirror/vault/${encodeURIComponent(this.settings.vaultId)}${rest}`);
  }
  /** The binding, or null when the server is too old to know of one. */
  async fetchBinding() {
    if (this.offServer) {
      this.captureOn = false;
      this.vaultBound = false;
      return null;
    }
    const res = await (0, import_obsidian4.requestUrl)({ url: this.vaultUrl(), headers: this.headers, throw: false });
    if (res.status === 404) {
      this.captureOn = false;
      this.vaultBound = false;
      return null;
    }
    if (res.status >= 400) throw new Error(res.json?.message ?? `status ${res.status}`);
    const b = res.json;
    this.captureOn = !!(b.bound && b.inbox);
    this.vaultBound = !!b.bound;
    this.vaultAllSpaces = !!(b.bound && b.allSpaces);
    return b;
  }
  /** Bind this vault to a space, or unbind it (null). Says what happened,
   *  including an inbox the new wall no longer holds. */
  async bindVault(rootSpaceId, allSpaces) {
    if (this.needsServer("Binding a vault to a space")) return null;
    const res = rootSpaceId ? await (0, import_obsidian4.requestUrl)({
      url: this.vaultUrl(),
      method: "PUT",
      contentType: "application/json",
      // allSpaces is sent only when it is being changed: a new space for the
      // vault must not quietly turn the switch off (or on).
      body: JSON.stringify({
        rootSpaceId,
        label: this.app.vault.getName(),
        ...allSpaces === void 0 ? {} : { allSpaces }
      }),
      headers: this.headers,
      throw: false
    }) : await (0, import_obsidian4.requestUrl)({ url: this.vaultUrl(), method: "DELETE", headers: this.headers, throw: false });
    if (res.status >= 400) {
      new import_obsidian4.Notice(`Graphite: the vault was not ${rootSpaceId ? "bound" : "unbound"} \u2014 ${res.json?.message ?? `the server refused it (${res.status})`}.`, 12e3);
      return null;
    }
    const b = res.json;
    this.captureOn = !!(b.bound && b.inbox);
    this.vaultBound = !!b.bound;
    this.vaultAllSpaces = !!(b.bound && b.allSpaces);
    if (b.inboxCleared) {
      new import_obsidian4.Notice("Graphite: the capture inbox was outside the new space, so it was cleared. Pick a new one before capturing.", 12e3);
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
  async setAllSpaces(on) {
    if (this.needsServer("Writing back to every space")) return false;
    const b = await this.fetchBinding().catch(() => null);
    if (!b?.bound || !b.root) {
      new import_obsidian4.Notice(`Graphite: choose this vault's space first. "All my spaces" is a choice on a bound vault, and that space is where new spaces and captured lines go.`, 12e3);
      return false;
    }
    const done = await this.bindVault(b.root.id, on);
    return !!done && !!done.allSpaces === on;
  }
  /** The Tasks modules the server would accept as this vault's inbox. */
  async fetchInboxChoices() {
    if (this.offServer) return [];
    const res = await (0, import_obsidian4.requestUrl)({ url: this.vaultUrl("/inboxes"), headers: this.headers, throw: false });
    if (res.status >= 400) return [];
    return res.json;
  }
  /** The Notes modules a page folder may be filed in: the server's list, the
   *  ones the page door would accept. Empty when there is nothing to choose
   *  from - not bound, offline, an older server - and the default still works. */
  async fetchPageModuleChoices() {
    if (this.offServer) return [];
    try {
      const res = await (0, import_obsidian4.requestUrl)({ url: this.vaultUrl("/page-modules"), headers: this.headers, throw: false });
      if (res.status >= 400) return [];
      return res.json;
    } catch {
      return [];
    }
  }
  /** Choose (or clear) the capture inbox. */
  async setInbox(moduleId) {
    if (this.needsServer("Choosing a capture inbox")) return false;
    const res = await (0, import_obsidian4.requestUrl)({
      url: this.vaultUrl("/inbox"),
      method: "PUT",
      contentType: "application/json",
      body: JSON.stringify({ moduleId }),
      headers: this.headers,
      throw: false
    });
    if (res.status >= 400) {
      new import_obsidian4.Notice(`Graphite: that cannot be the capture inbox \u2014 ${res.json?.message ?? `the server refused it (${res.status})`}.`, 12e3);
      return false;
    }
    this.captureOn = !!moduleId;
    return true;
  }
  /** Set while a whole-account pull runs: each space's own "pulled" line gives
   *  way to the one summary, so ten spaces are one notice and not ten. Notes
   *  that were banked or let go still say so. */
  quietPulls = 0;
  mirroring = false;
  /** 0.6.9: how long after the layout is ready the first connection check
   *  runs; a test sets it to nothing. */
  startupDelayMs = 800;
  /** 0.6.9: how long the automatic bring-in of every space waits after the
   *  connection check that found it owed, and the rest it takes between one
   *  space and the next. Both are there so Obsidian finishes opening, and
   *  then indexes one space's notes before the next arrive. */
  firstMirrorDelayMs = 3e3;
  spaceGapMs = 250;
  mirrorTimer = 0;
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
  async mirrorEverySpace(loud) {
    if (this.offServer || !this.configured) return 0;
    if (!loud && !this.settings.mirrorAll) return 0;
    if (this.mirroring && !loud) return 0;
    while (this.mirroring) await new Promise((r) => window.setTimeout(r, 50));
    this.mirroring = true;
    let brought = 0;
    const failed = [];
    try {
      let spaces;
      try {
        spaces = await this.fetchSpaces();
      } catch (e) {
        if (loud) new import_obsidian4.Notice(`Graphite: could not list your spaces - ${e}`);
        return 0;
      }
      const seen = new Set(this.settings.spacesSeen);
      const todo = spaces.filter((sp) => this.entriesForSpace(sp.id).length === 0 && (loud || !seen.has(sp.id)));
      this.quietPulls++;
      try {
        for (let i = 0; i < todo.length; i++) {
          const sp = todo[i];
          if (i > 0 && this.spaceGapMs > 0) await new Promise((r) => window.setTimeout(r, this.spaceGapMs));
          await this.pullSpace(sp);
          if (this.entriesForSpace(sp.id).length > 0) brought++;
          else failed.push(sp.name);
        }
      } finally {
        this.quietPulls--;
        this.refreshPanel();
      }
      const next = /* @__PURE__ */ new Set([...seen, ...spaces.map((sp) => sp.id)]);
      if (next.size !== seen.size) {
        this.settings.spacesSeen = [...next];
        await this.saveSettings();
      }
      if (brought) {
        await this.fetchBinding().catch(() => null);
        new import_obsidian4.Notice(`Graphite: brought in ${brought} space${brought === 1 ? "" : "s"} from your account.` + (this.vaultBound ? "" : " Edits go back to Graphite once you choose this vault's space in the plugin settings."), 12e3);
      } else if (loud && !failed.length) {
        new import_obsidian4.Notice(todo.length ? "Graphite: nothing new to bring in." : "Graphite: every space you can read is already in this vault.");
      }
      if (failed.length) {
        new import_obsidian4.Notice(`Graphite: could not bring in ${failed.join(", ")}. "Bring in every space" tries again.`, 12e3);
      }
    } finally {
      this.mirroring = false;
    }
    return brought;
  }
  async fetchSpaces() {
    const res = await (0, import_obsidian4.requestUrl)({ url: this.api("/spaces"), headers: this.headers });
    return res.json.map((s) => ({ id: s.id, name: s.name }));
  }
  /** Default flow (R-290 simplification per Omar): whole-space sync, and
   *  the pull asks WHICH VAULT the space lands in. */
  async chooseAndPull() {
    if (!await this.checkConnection(false)) {
      new import_obsidian4.Notice(this.noConnectionNote());
      return;
    }
    try {
      const spaces = await this.fetchSpaces();
      new SpacePicker(this.app, spaces, (space) => this.chooseDestination(space)).open();
    } catch (e) {
      new import_obsidian4.Notice(`Graphite: could not list spaces \u2014 ${e}`);
    }
  }
  /** Optional flow: selective modules, always into the current vault. */
  async chooseAndPullSelective() {
    if (this.needsServer("Choosing modules to pull")) return;
    if (!await this.checkConnection(false)) {
      new import_obsidian4.Notice(this.noConnectionNote());
      return;
    }
    try {
      const spaces = await this.fetchSpaces();
      new SpacePicker(this.app, spaces, (space) => void this.chooseModules(space)).open();
    } catch (e) {
      new import_obsidian4.Notice(`Graphite: could not list spaces \u2014 ${e}`);
    }
  }
  chooseDestination(space) {
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
  listVaults() {
    const cur = this.app.vault.adapter instanceof import_obsidian4.FileSystemAdapter ? this.app.vault.adapter.getBasePath() : "";
    const here = () => cur ? [{ name: "This vault", path: cur, current: true }] : [];
    if (!import_obsidian4.Platform.isDesktopApp) return here();
    const req = window.require;
    if (!req) return here();
    try {
      const fs = req("fs");
      const p = req("path");
      const env = globalThis.process?.env ?? {};
      const candidates = [];
      if (env.APPDATA) candidates.push(p.join(env.APPDATA, "obsidian", "obsidian.json"));
      const home = env.HOME || env.USERPROFILE || "";
      if (home) {
        candidates.push(p.join(home, "Library", "Application Support", "obsidian", "obsidian.json"));
        candidates.push(p.join(home, ".config", "obsidian", "obsidian.json"));
      }
      for (const c of candidates) {
        try {
          const reg = JSON.parse(fs.readFileSync(c, "utf8"));
          const vaults = Object.values(reg.vaults ?? {});
          const out = vaults.filter((v) => {
            try {
              return fs.statSync(v.path).isDirectory();
            } catch {
              return false;
            }
          }).map((v) => ({
            name: p.basename(v.path),
            path: v.path,
            current: p.resolve(v.path) === p.resolve(cur)
          }));
          if (out.length) {
            out.sort((a, b) => Number(b.current) - Number(a.current));
            return out;
          }
        } catch {
        }
      }
    } catch {
    }
    return here();
  }
  /** Pull a space into a DIFFERENT vault: write the .md into that vault's
   *  folder and seed its own plugin config (mapping + credentials) so its
   *  Graphite Sync instance can push/pull natively from there. */
  async pullToVault(space, dest) {
    if (!import_obsidian4.Platform.isDesktopApp) {
      new import_obsidian4.Notice("Graphite: pulling into another vault needs the desktop app \u2014 Obsidian gives a plugin no filesystem on mobile.", 8e3);
      return;
    }
    try {
      const req = window.require;
      const fs = req("fs");
      const p = req("path");
      const plugDir = p.join(dest.path, ".obsidian", "plugins", "graphite-sync");
      fs.mkdirSync(plugDir, { recursive: true });
      const dataPath = p.join(plugDir, "data.json");
      let data = {};
      try {
        data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
      } catch {
      }
      if (this.onComputer) {
        if (!data.serverUrl && !data.token) data.source = "computer";
      } else {
        if (!data.serverUrl) data.serverUrl = this.settings.serverUrl;
        if (!data.token) data.token = this.settings.token;
      }
      data.files = data.files ?? {};
      const layout = data.layout ?? this.settings.layout;
      data.layout = layout;
      const stamp = (path, text, extra) => {
        data.files[path] = {
          spaceId: space.id,
          spaceName: space.name,
          lastSyncAt: Date.now(),
          lastHash: hash(text),
          ...extra
        };
        data.bases = data.bases && typeof data.bases === "object" ? data.bases : {};
        putBase(data.bases, path, text);
      };
      const writeNote = (rel, markdown) => {
        const target = p.join(dest.path, rel);
        let existing = null;
        try {
          existing = fs.readFileSync(target, "utf8");
        } catch {
        }
        const text = keepFreeform(existing, markdown);
        fs.writeFileSync(target, text, "utf8");
        return text;
      };
      let note;
      if (layout === "folder") {
        const got = await this.folderExport(
          data.files,
          space,
          void 0,
          Object.values(data.files).find((e) => e.spaceId === space.id)?.folderAsked
        );
        if (!got) return;
        const { out, asked } = got;
        fs.mkdirSync(p.join(dest.path, out.folder), { recursive: true });
        for (const f of out.files) {
          stamp(f.path, writeNote(f.path, f.markdown), {
            folder: out.folder,
            ...asked ? { folderAsked: asked } : {},
            role: f.kind,
            moduleId: f.moduleId
          });
        }
        note = `pulled "${space.name}" into vault "${dest.name}" as a folder of ${out.files.length} notes`;
      } else {
        const md = await (0, import_obsidian4.requestUrl)({ url: this.exportUrl(space.id), headers: this.headers });
        const fileName = singleFileFor(data.files, space);
        stamp(fileName, writeNote(fileName, md.text), {});
        note = `pulled "${space.name}" into vault "${dest.name}"`;
      }
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
      new import_obsidian4.Notice(`Graphite: ${note}. If that vault is open now, reload its Graphite Sync plugin to pick up the mapping.`, 9e3);
    } catch (e) {
      new import_obsidian4.Notice(`Graphite: pull into "${dest.name}" failed \u2014 ${e}`);
    }
  }
  /** R-290: after the space, pick which modules travel (default: all). */
  async chooseModules(space) {
    try {
      const res = await (0, import_obsidian4.requestUrl)({ url: this.api(`/spaces/${space.id}`), headers: this.headers });
      const modules = (res.json.modules ?? []).map((m) => ({
        id: m.id,
        name: m.name,
        type: m.type
      }));
      if (modules.length <= 1) {
        void this.pullSpace(space);
        return;
      }
      new ModulePicker(this.app, space, modules, (picked) => {
        const ids = picked.length === modules.length ? null : picked.map((m) => m.id);
        void this.pullSpace(space, ids, modules.length);
      }).open();
    } catch (e) {
      new import_obsidian4.Notice(`Graphite: could not list the space's modules \u2014 ${e}`);
    }
  }
  exportUrl(spaceId, moduleIds) {
    const q = moduleIds?.length ? `?modules=${moduleIds.join(",")}` : "";
    return this.api(`/spaces/${spaceId}/export.md${q}`);
  }
  /** R-379: the folder-layout twin of exportUrl — index + one note per
   *  module, as JSON with vault-relative paths. */
  folderUrl(spaceId, moduleIds, folder) {
    const q = [
      moduleIds?.length ? `modules=${moduleIds.join(",")}` : "",
      // FINDING 119: the folder this space was given when its own name was
      // already another space's.
      folder ? `folder=${encodeURIComponent(folder)}` : ""
    ].filter(Boolean).join("&");
    return this.api(`/spaces/${spaceId}/export.folder${q ? `?${q}` : ""}`);
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
  async folderExport(files, space, moduleIds, own) {
    const ask = async (folder) => (await (0, import_obsidian4.requestUrl)({
      url: this.folderUrl(space.id, moduleIds, folder),
      headers: this.headers
    })).json;
    let out = await ask(own);
    let asked = own;
    if (!own && folderHeldByAnother(files, out.folder, space.id)) {
      asked = distinctFolder(out.folder, space.id);
      out = await ask(asked);
    }
    if (folderHeldByAnother(files, out.folder, space.id)) {
      new import_obsidian4.Notice(
        `Graphite: another space in this vault already syncs into "${out.folder}/", so "${space.name}" was not pulled \u2014 it would have written over those notes. Rename one of the two spaces in Graphite, then pull again.`,
        12e3
      );
      return null;
    }
    return { out, asked };
  }
  /** Every tracked file belonging to one space, with its path. */
  entriesForSpace(spaceId) {
    return Object.entries(this.settings.files).filter(([, e]) => e.spaceId === spaceId).map(([path, entry]) => ({ path, entry }));
  }
  /** moduleIds: undefined = keep the file's stored filter (plain re-pull);
   *  null = explicit "all modules" (clears the filter); array = subset. */
  async pullSpace(space, moduleIds, moduleCount) {
    if (this.settings.layout === "folder") {
      return this.pullFolder(space, moduleIds, moduleCount);
    }
    const fileName = singleFileFor(this.settings.files, space);
    const prev = this.settings.files[fileName];
    const effective = moduleIds === void 0 ? prev?.moduleIds : moduleIds === null ? void 0 : moduleIds;
    try {
      const md = await (0, import_obsidian4.requestUrl)({ url: this.exportUrl(space.id, effective), headers: this.headers });
      this.writingBack++;
      let text = md.text;
      let banked = null;
      try {
        const existing = this.app.vault.getAbstractFileByPath(fileName);
        if (existing instanceof import_obsidian4.TFile) {
          const old = await this.app.vault.read(existing);
          if (this.bothMoved(prev, old, md.text)) {
            banked = await this.bankConflictCopy(fileName, old);
          }
          text = keepFreeform(old, md.text);
          await this.app.vault.modify(existing, text);
        } else await this.app.vault.create(fileName, text);
      } finally {
        this.writingBack--;
      }
      if (banked) {
        new import_obsidian4.Notice(
          `Graphite: "${fileName}" had local edits AND the space changed in the app \u2014 your version is banked as "${banked}". Merge back what you need, then push. Nothing was lost.`,
          12e3
        );
      }
      this.settings.files[fileName] = {
        spaceId: space.id,
        spaceName: space.name,
        lastSyncAt: Date.now(),
        lastHash: hash(text),
        moduleIds: effective,
        moduleCount: moduleCount ?? prev?.moduleCount
      };
      putBase(this.settings.bases, fileName, text);
      await this.saveSettings();
      if (!this.quietPulls) this.refreshPanel();
      const scope = effective?.length ? ` (${effective.length} module${effective.length === 1 ? "" : "s"})` : "";
      if (!this.quietPulls) new import_obsidian4.Notice(`Graphite: pulled "${space.name}"${scope}.`);
    } catch (e) {
      new import_obsidian4.Notice(`Graphite: pull failed \u2014 ${e}`);
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
  async pullFolder(space, moduleIds, moduleCount) {
    const previous = this.entriesForSpace(space.id);
    const stored = previous.find((p) => p.entry.moduleIds)?.entry.moduleIds;
    const effective = moduleIds === void 0 ? stored : moduleIds === null ? void 0 : moduleIds;
    try {
      const got = await this.folderExport(
        this.settings.files,
        space,
        effective,
        previous.find((p) => p.entry.folderAsked)?.entry.folderAsked
      );
      if (!got) return;
      const { out, asked } = got;
      const written = /* @__PURE__ */ new Set();
      const renamed = /* @__PURE__ */ new Set();
      const banked = [];
      this.writingBack++;
      const pace = new Pacer();
      try {
        await this.ensureFolder(out.folder);
        for (const f of out.files) {
          await pace.tick();
          await this.ensureDirs(f.path);
          const was = previous.find((p) => p.path !== f.path && (f.kind === "page" ? p.entry.role === "page" && p.entry.noteId === f.noteId : f.kind === "module" ? p.entry.role !== "page" && p.entry.moduleId === f.moduleId : p.entry.role === "index"));
          if (was) {
            await this.renameTo(was.path, f.path);
            renamed.add(was.path);
          }
          const existing = this.app.vault.getAbstractFileByPath(f.path);
          const old = existing instanceof import_obsidian4.TFile ? await this.app.vault.read(existing) : null;
          const before = previous.find((p) => p.path === f.path)?.entry ?? was?.entry;
          if (old !== null && this.bothMoved(before, old, f.markdown)) {
            banked.push(await this.bankConflictCopy(f.path, old));
          }
          const text = keepFreeform(old, f.markdown);
          if (existing instanceof import_obsidian4.TFile) await this.app.vault.modify(existing, text);
          else await this.app.vault.create(f.path, text);
          this.settings.files[f.path] = {
            spaceId: space.id,
            spaceName: space.name,
            folder: out.folder,
            ...asked ? { folderAsked: asked } : {},
            role: f.kind,
            moduleId: f.moduleId,
            ...f.kind === "page" ? { noteId: f.noteId, pageDir: notebookDirOf(f.path, f.markdown) } : {},
            lastSyncAt: Date.now(),
            lastHash: hash(text),
            moduleIds: effective,
            moduleCount: moduleCount ?? previous[0]?.entry.moduleCount
          };
          putBase(this.settings.bases, f.path, text);
          written.add(f.path);
        }
      } finally {
        this.writingBack--;
      }
      const gone = previous.filter((p) => !written.has(p.path) && !renamed.has(p.path));
      const trashed = [];
      const dropped = [];
      this.writingBack++;
      try {
        for (const d of gone) {
          await pace.tick();
          const f = d.entry.role === "page" ? this.app.vault.getAbstractFileByPath(d.path) : null;
          const inScope = !effective?.length || d.entry.moduleId !== void 0 && effective.includes(d.entry.moduleId);
          if (f instanceof import_obsidian4.TFile && inScope && hash(await this.app.vault.read(f)) === d.entry.lastHash) {
            try {
              await this.trashFile(f);
              trashed.push(d.path);
              continue;
            } catch {
            }
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
      const scope = effective?.length ? ` (${effective.length} module${effective.length === 1 ? "" : "s"})` : "";
      if (!this.quietPulls) new import_obsidian4.Notice(`Graphite: pulled "${space.name}"${scope} into ${out.folder}/ \u2014 ${out.files.length} note${out.files.length === 1 ? "" : "s"}.`);
      if (trashed.length) {
        new import_obsidian4.Notice(
          `Graphite: ${trashed.length} page${trashed.length === 1 ? " was" : "s were"} removed in Graphite, so ${trashed.length === 1 ? "its file was" : "their files were"} moved to the trash: ${trashed.join(", ")}. Graphite keeps ${trashed.length === 1 ? "it" : "them"} in its Bin.`,
          12e3
        );
      }
      if (dropped.length) {
        new import_obsidian4.Notice(
          `Graphite: ${dropped.length} note${dropped.length === 1 ? "" : "s"} no longer belong${dropped.length === 1 ? "s" : ""} to "${space.name}" and ${dropped.length === 1 ? "is" : "are"} no longer synced \u2014 ${dropped.map((d) => d.path).join(", ")}. Nothing was deleted; remove them yourself when you are happy.`,
          12e3
        );
      }
      if (banked.length) {
        new import_obsidian4.Notice(
          `Graphite: ${banked.length} note${banked.length === 1 ? "" : "s"} had local edits AND app-side changes \u2014 your versions are banked beside them: ${banked.join(", ")}. Merge back what you need, then push. Nothing was lost.`,
          12e3
        );
      }
    } catch (e) {
      new import_obsidian4.Notice(`Graphite: pull failed \u2014 ${e}`);
    }
  }
  /** Obsidian's own trash, as the vault is set to use it (the file manager's),
   *  or the vault's .trash on an Obsidian that has no such call. */
  async trashFile(file) {
    const fm = this.app.fileManager;
    if (typeof fm.trashFile === "function") await fm.trashFile(file);
    else await this.app.vault.trash(file, false);
  }
  /** Page files deleted in this burst, by path. */
  vanished = /* @__PURE__ */ new Set();
  vanishTimer = 0;
  /** This many page files gone at once is not a person deleting pages: it is a
   *  folder moved, a sync client part-way through, or a drive not mounted. */
  static MASS_DELETE = 5;
  /** R-8336: A PAGE'S FILE WAS DELETED. With auto-push on, the page is deleted
   *  in Graphite a moment later (its Bin keeps it); with it off, the panel
   *  shows the file missing and offers Delete page. Gathered over a second and
   *  a half so a burst can be judged as a burst. */
  pageVanished(path) {
    this.vanished.add(path);
    window.clearTimeout(this.vanishTimer);
    this.vanishTimer = window.setTimeout(() => {
      const paths = [...this.vanished];
      this.vanished.clear();
      if (paths.length >= _GraphitePlugin.MASS_DELETE) {
        new import_obsidian4.Notice(
          `Graphite: ${paths.length} page files disappeared at once, so none were deleted in Graphite. Pull to put them back, or delete the pages you mean in the sync panel.`,
          12e3
        );
        return;
      }
      if (this.settings.autoPush) for (const p of paths) void this.pushFile(p, { auto: true });
      this.refreshPanel();
    }, 1500);
  }
  /** The deletion a missing page file stands for: the app's ordinary delete,
   *  not forced, so a page other things link to is refused by the same rule the
   *  app keeps and its file comes back on the next Pull. */
  async deleteGonePage(path, entry, opts) {
    if (!entry.moduleId || !entry.noteId) return;
    if (!await this.writeAllowed("deleted", !opts?.auto)) return;
    if (this.onComputer && opts?.auto && this.computerReadOnly) return;
    const title = path.slice(path.lastIndexOf("/") + 1).replace(/\.md$/i, "");
    const dir = entry.pageDir ?? "";
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (!dir || !f.path.startsWith(`${dir}/`) || this.settings.files[f.path]) continue;
      if (pageIdOf(await this.app.vault.read(f)) === entry.noteId) {
        await this.pageRenamed(path, f.path);
        return;
      }
    }
    const res = await (0, import_obsidian4.requestUrl)({
      url: this.api(`/modules/${entry.moduleId}/notes/${entry.noteId}`),
      method: "DELETE",
      headers: this.headers,
      throw: false
    });
    if (this.onComputer) this.computerReadOnly = res.status === 403;
    if (res.status < 300 || res.status === 404) {
      delete this.settings.files[path];
      delete this.settings.bases[path];
      await this.saveSettings();
      this.refreshPanel();
      new import_obsidian4.Notice(res.status === 404 ? `Graphite: "${title}" was already gone from Graphite.` : `Graphite: deleted "${title}" in Graphite - it is in the Bin there.`);
    } else if (res.status === 409) {
      new import_obsidian4.Notice(
        `Graphite: "${title}" is linked from other things, so it stays in Graphite. Pull to put its file back, or erase it in the app if you mean it.`,
        12e3
      );
    } else {
      new import_obsidian4.Notice(`Graphite: could not delete "${title}" (${res.status}) - ${res.json?.message ?? "see the app"}. Nothing was changed.`, 12e3);
    }
  }
  /** Every folder on the way to [path], outermost first (R-8336: a page sits two
   *  or three folders deep, and createFolder makes one level). */
  async ensureDirs(path) {
    let at = "";
    for (const part of path.split("/").slice(0, -1)) {
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
  async pageRenamed(from, to) {
    const entry = this.settings.files[from];
    if (!entry || entry.role !== "page" || this.settings.files[to]) return;
    const file = this.app.vault.getAbstractFileByPath(to);
    if (!(file instanceof import_obsidian4.TFile) || file.extension !== "md") return;
    const text = await this.app.vault.read(file);
    if (pageIdOf(text) !== entry.noteId) return;
    this.settings.files[to] = { ...entry };
    delete this.settings.files[from];
    const base = this.settings.bases[from];
    delete this.settings.bases[from];
    if (base !== void 0) putBase(this.settings.bases, to, base);
    const change = pageRenameOf(from, to, entry.pageDir ?? "");
    if (change) {
      this.writingBack++;
      try {
        await this.app.vault.process(file, (cur) => setPageFields(cur, change));
      } finally {
        this.writingBack--;
      }
      if (this.settings.autoPush) this.schedulePush(to);
    }
    await this.saveSettings();
    this.refreshPanel();
  }
  async ensureFolder(folder) {
    if (this.app.vault.getAbstractFileByPath(folder)) return;
    try {
      await this.app.vault.createFolder(folder);
    } catch {
    }
  }
  /** Rename through fileManager so Obsidian rewrites links pointing at it. */
  async renameTo(from, to) {
    const file = this.app.vault.getAbstractFileByPath(from);
    if (!(file instanceof import_obsidian4.TFile)) return;
    if (this.app.vault.getAbstractFileByPath(to)) return;
    try {
      await this.app.fileManager.renameFile(file, to);
      delete this.settings.files[from];
      delete this.settings.bases[from];
    } catch {
    }
  }
  async pushCurrent() {
    const file = this.app.workspace.getActiveFile();
    if (!file) return;
    if (!this.settings.files[file.path]) {
      new import_obsidian4.Notice("Graphite: this file was not pulled by the plugin \u2014 pull first so it knows the space.");
      return;
    }
    await this.pushFile(file.path);
  }
  /** An auto-push of [path] about 2.5 seconds after the last edit. */
  schedulePush(path) {
    window.clearTimeout(this.pushTimers[path]);
    this.pushTimers[path] = window.setTimeout(
      () => void this.pushFile(path, { auto: true }),
      2500
    );
  }
  /** FINDING 120: ONE PUSH PER NOTE AT A TIME. Every way into a push comes
   *  through here (the command, the panel button, the sweep, the auto-push
   *  timer, the conflict dialog), so the guard sits on the door and not on
   *  each caller. A push asked for while one is running is not dropped — the
   *  edits it was asked about may have come after the first read the file —
   *  it runs once more when the first is done. */
  async pushFile(path, opts) {
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
  async pushFileNow(path, opts) {
    if (this.onDevice) return;
    const entry = this.settings.files[path];
    const file = this.app.vault.getAbstractFileByPath(path);
    if (entry?.role === "page" && !(file instanceof import_obsidian4.TFile)) {
      await this.deleteGonePage(path, entry, opts);
      return;
    }
    if (!entry || !(file instanceof import_obsidian4.TFile)) return;
    if (!await this.writeAllowed("pushed", !opts?.auto)) return;
    if (this.onComputer && opts?.auto && this.computerReadOnly) return;
    if (!opts?.force && this.settings.bases[path] === void 0) {
      const state = await this.serverState(path);
      if (state === "server-changed") {
        if (opts?.auto) {
          new import_obsidian4.Notice(
            `Graphite: auto-push HELD for "${entry.spaceName ?? path}" \u2014 the space changed in the app since your last sync. Open the sync panel and Pull (your edits are banked if they collide) or push it yourself.`,
            12e3
          );
          return;
        }
        new ConflictPushModal(this.app, entry.spaceName ?? path, (choice) => {
          if (choice === "pull") {
            void this.pullSpace({ id: entry.spaceId, name: entry.spaceName ?? path });
          } else if (choice === "push") {
            void this.pushFile(path, { force: true });
          }
        }).open();
        return;
      }
    }
    try {
      const markdown = await this.app.vault.read(file);
      const base = this.settings.bases[path];
      const send = (mode) => (0, import_obsidian4.requestUrl)({
        url: this.api("/spaces/import.md"),
        method: "POST",
        headers: { ...this.headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          markdown,
          mode,
          targetSpaceId: entry.spaceId,
          ...mode === "update_existing" && base !== void 0 ? { base } : {}
        }),
        throw: false
      });
      let res = await send("update_existing");
      let addOnly = false;
      if (res.status === 403 && !this.onComputer) {
        res = await send("merge");
        addOnly = res.status < 400;
      }
      if (this.onComputer) this.computerReadOnly = res.status === 403;
      if (res.status >= 400) {
        new import_obsidian4.Notice(`Graphite: push refused (${res.status}) \u2014 ${res.json?.message ?? "see the app"}. Nothing was changed.`);
        return;
      }
      const report = res.json;
      if (report.blocked || (report.errors?.length ?? 0) > 0) {
        const first = report.errors?.[0];
        new import_obsidian4.Notice(`Graphite: import blocked \u2014 ${first ? `line ${first.line}: ${first.message}` : "see the app"}. Nothing was changed.`);
        return;
      }
      if (addOnly) {
        new import_obsidian4.Notice(
          "Graphite: your role on this space lets you ADD records but not change existing ones \u2014 new lines landed, edits to records that were already there did not.",
          12e3
        );
      }
      const said = importerSaid(report);
      const heldFields = heldFieldsSaid(heldFieldsOf(report));
      const bullets = (l) => l.map((s) => `\u2022 ${s}`).join("\n");
      if (heldFields.length) {
        new import_obsidian4.Notice(
          `Graphite: pushed, but ${heldFields[0]}
${bullets(heldFields.slice(1))}` + (said.length ? `
The importer also says:
${bullets(said)}` : ""),
          15e3
        );
      } else if (said.length) {
        new import_obsidian4.Notice(`Graphite: pushed, and the importer says:
${bullets(said)}`, 15e3);
      }
      const fresh = await this.canonicalText(entry);
      if (fresh === null) {
        new import_obsidian4.Notice("Graphite: pushed, but the server did not return this note \u2014 Pull to refresh.");
        return;
      }
      const text = keepFreeform(markdown, fresh);
      let kept = false;
      this.writingBack++;
      try {
        await this.app.vault.process(file, (current) => {
          if (current === markdown || current === text) return text;
          kept = true;
          const merged = mergeLines(markdown, current, text, { adjacent: true });
          return merged.clean ? merged.text : carryIds(markdown, current, text);
        });
      } finally {
        this.writingBack--;
      }
      entry.lastSyncAt = Date.now();
      entry.lastHash = hash(text);
      putBase(this.settings.bases, path, text);
      await this.saveSettings();
      this.refreshPanel();
      if (kept) {
        if (this.settings.autoPush) this.schedulePush(path);
        new import_obsidian4.Notice(
          `Graphite: pushed "${entry.spaceName ?? path}". You kept typing while it was pushed, so your note was left as you have it${this.settings.autoPush ? " and will be pushed again" : " \u2014 push again to send the newer edits"}.`
        );
      } else {
        new import_obsidian4.Notice(`Graphite: pushed "${entry.spaceName ?? path}" and canonicalized.`);
      }
    } catch (e) {
      new import_obsidian4.Notice(`Graphite: push failed \u2014 ${e}`);
    }
  }
  /** The server's current text FOR THIS FILE. Null when the file's module is
   *  no longer part of the space (the note is stale — a Pull sorts it out). */
  async canonicalText(entry) {
    if (!entry.role) {
      const md = await (0, import_obsidian4.requestUrl)({
        url: this.exportUrl(entry.spaceId, entry.moduleIds),
        headers: this.headers
      });
      return md.text;
    }
    const scope = entry.moduleIds;
    const res = await (0, import_obsidian4.requestUrl)({
      url: this.folderUrl(entry.spaceId, scope, entry.folderAsked),
      headers: this.headers
    });
    const out = res.json;
    const match = entry.role === "index" ? out.files.find((f) => f.kind === "index") : entry.role === "page" ? out.files.find((f) => f.kind === "page" && f.noteId === entry.noteId) : out.files.find((f) => f.kind !== "page" && f.moduleId === entry.moduleId);
    return match?.markdown ?? null;
  }
  /** Local state of a tracked file, no network involved. */
  async fileState(path) {
    const entry = this.settings.files[path];
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof import_obsidian4.TFile)) return "missing";
    const content = await this.app.vault.read(file);
    return hash(content) === entry?.lastHash ? "in-sync" : "local-edits";
  }
  /** On-demand server check: has the space changed since our last sync?
   *
   *  R-379: the question is "would canonicalizing this note change it?", so
   *  the comparison runs the server's text through the same freeform splice a
   *  write would. Comparing the raw export instead would report "server
   *  changed" forever on any note whose freeform block the user has written
   *  in — the server always sends the placeholder back. */
  async serverState(path) {
    const entry = this.settings.files[path];
    if (!entry) return "error";
    try {
      const fresh = await this.canonicalText(entry);
      if (fresh === null) return "server-changed";
      const file = this.app.vault.getAbstractFileByPath(path);
      const local = file instanceof import_obsidian4.TFile ? await this.app.vault.read(file) : null;
      return hash(keepFreeform(local, fresh)) === entry.lastHash ? "server-unchanged" : "server-changed";
    } catch {
      return "error";
    }
  }
  /** R-399: TRUE when the vault file AND the incoming server text have BOTH
   *  diverged from the last sync point — the case where a plain pull would
   *  make the vault edit silently lose. Same splice discipline as
   *  serverState: the server always sends the freeform placeholder back, so
   *  the incoming text is compared post-splice or a written-in freeform
   *  block would read as an eternal server change. */
  bothMoved(entry, old, incoming) {
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
  async bankConflictCopy(path, old) {
    const skip = /* @__PURE__ */ new Set();
    for (let tries = 0; tries < 100; tries++) {
      const bankPath = conflictCopyPath(path, /* @__PURE__ */ new Date(), (p) => skip.has(p));
      const there = this.app.vault.getAbstractFileByPath(bankPath);
      if (there instanceof import_obsidian4.TFile) {
        if (await this.app.vault.read(there) === old) return bankPath;
        skip.add(bankPath);
        continue;
      }
      try {
        await this.app.vault.create(bankPath, old);
        return bankPath;
      } catch (e) {
        if (this.app.vault.getAbstractFileByPath(bankPath)) continue;
        throw new Error(`could not keep a copy of "${path}" beside it (${e}) \u2014 nothing was overwritten`);
      }
    }
    throw new Error(`could not find a free name for a copy of "${path}" \u2014 nothing was overwritten`);
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
  async pushSpace(spaceId) {
    const all = this.entriesForSpace(spaceId);
    const files = [
      ...all.filter((f) => f.entry.role !== "index"),
      ...all.filter((f) => f.entry.role === "index")
    ];
    if (!files.length) {
      new import_obsidian4.Notice("Graphite: nothing here holds records to push.");
      return;
    }
    const edited = [];
    for (const f of files) {
      if (await this.fileState(f.path) === "local-edits") edited.push(f);
    }
    if (!edited.length) {
      new import_obsidian4.Notice("Graphite: nothing to push \u2014 no note in this space changed since the last sync.");
      return;
    }
    files.splice(0, files.length, ...edited);
    let changed = false;
    for (const f of files) {
      if (this.settings.bases[f.path] !== void 0) continue;
      if (await this.serverState(f.path) === "server-changed") {
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
      if (choice === "pull") void this.pullSpace({ id: spaceId, name });
      else if (choice === "push") void pushAll();
    }).open();
  }
  async forget(path) {
    delete this.settings.files[path];
    delete this.settings.bases[path];
    await this.saveSettings();
    this.refreshPanel();
  }
  /** Stop syncing a whole space. The notes stay in the vault as ordinary
   *  files — forgetting is a mapping change, never a delete. */
  async forgetSpace(spaceId) {
    for (const f of this.entriesForSpace(spaceId)) {
      delete this.settings.files[f.path];
      delete this.settings.bases[f.path];
    }
    await this.saveSettings();
    this.refreshPanel();
  }
  async loadSettings() {
    const data = await this.loadData() ?? {};
    if (data.files) {
      for (const k of Object.keys(data.files)) {
        if (typeof data.files[k] === "string") data.files[k] = { spaceId: data.files[k] };
      }
    }
    this.settings = { ...DEFAULTS, ...data };
    this.settings.routeCache = Array.isArray(data.routeCache) ? data.routeCache : [];
    this.settings.routeRecent = Array.isArray(data.routeRecent) ? data.routeRecent : [];
    this.settings.spacesSeen = Array.isArray(data.spacesSeen) ? data.spacesSeen.filter((x) => typeof x === "string") : [];
    if (typeof data.mirrorAll !== "boolean") {
      this.settings.mirrorAll = Object.keys(this.settings.files ?? {}).length === 0;
    }
    this.settings.pageModules = {};
    if (data.pageModules && typeof data.pageModules === "object") {
      for (const [k, v] of Object.entries(data.pageModules)) {
        if (typeof v === "string" && v) this.settings.pageModules[k] = v;
      }
    }
    if (typeof data.pagesOn !== "boolean") {
      this.settings.pagesOn = parseFolders(String(data.pageFolders ?? "")).length > 0;
    }
    this.settings.bases = {};
    if (data.bases && typeof data.bases === "object") {
      for (const [k, v] of Object.entries(data.bases)) {
        if (typeof v === "string" && this.settings.files[k]) putBase(this.settings.bases, k, v);
      }
    }
    const ns = data.noteSyncState;
    this.settings.noteSyncState = ns && typeof ns === "object" && ns.files && typeof ns.files === "object" ? { target: String(ns.target ?? ""), cursor: ns.cursor ?? null, files: ns.files } : emptyNoteSyncState();
    delete this.settings.captureModuleId;
    delete this.settings.captureInboxName;
    if (!this.settings.vaultId) {
      this.settings.vaultId = mintVaultId();
      await this.saveSettings();
    }
  }
  async saveSettings() {
    await this.saveData(this.settings);
    if (this.settings.configFile && this.settingsNoteOpen) await this.writeSettingsNote();
  }
};
var RouteSuggest = class extends import_obsidian4.EditorSuggest {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onTrigger(cursor, editor, file) {
    if (file && this.plugin.settings.files[file.path]) return null;
    const text = editor.getLine(cursor.line);
    let inFm = false;
    if (cursor.line > 0 && editor.getLine(0).trim() === "---") {
      inFm = true;
      for (let i = 1; i < cursor.line; i++) if (editor.getLine(i).trim() === "---") {
        inFm = false;
        break;
      }
    }
    const t = routeTrigger(text, cursor.ch, inFm);
    if (!t) return null;
    return { start: { line: cursor.line, ch: t.start }, end: cursor, query: t.query };
  }
  getSuggestions(ctx) {
    const all = this.plugin.routes();
    if (!all.length) void this.plugin.refreshRoutes();
    return filterRoutes(all, ctx.query, this.plugin.settings.routeRecent).slice(0, 40);
  }
  renderSuggestion(r, el) {
    renderRoute(r, el);
  }
  selectSuggestion(r) {
    const ctx = this.context;
    if (!ctx) return;
    this.plugin.insertRoute(ctx.editor, r, ctx.start.line, { from: ctx.start, to: ctx.end });
  }
};
function renderRoute(r, el) {
  const top = el.createDiv({ cls: "gr-route" });
  const above = r.path.slice(0, -1).join(" \u203A ");
  if (above) top.createSpan({ text: `${above} \u203A `, cls: "gr-route-above" });
  top.createSpan({ text: r.module ? `${r.path[r.path.length - 1]} \u203A ${r.module.name}` : r.path[r.path.length - 1], cls: "gr-route-leaf" });
  if (!r.module && r.tags.length) top.createSpan({ text: `#${r.tags[0]}`, cls: "gr-route-tag" });
  if (!r.module && r.modules.length > 1) {
    el.createDiv({ text: `${r.modules.map((m) => m.name).join(" \xB7 ")} \u2014 type / to pick one`, cls: "gr-route-mods" });
  }
}
var RouteModal = class extends import_obsidian4.FuzzySuggestModal {
  constructor(app, plugin, onPick) {
    super(app);
    this.plugin = plugin;
    this.onPick = onPick;
    this.setPlaceholder("Route this line to\u2026 (a space, or space/module)");
  }
  getItems() {
    const all = this.plugin.routes();
    return [...all, ...all.flatMap((r) => r.modules.length > 1 ? r.modules.map((m) => ({ ...r, module: m })) : [])];
  }
  getItemText(r) {
    return [r.path.join(" \u203A "), r.module?.name, ...r.tags].filter(Boolean).join(" ");
  }
  onChooseItem(r) {
    this.onPick(r);
  }
};
var SpacePicker = class extends import_obsidian4.FuzzySuggestModal {
  constructor(app, spaces, onPick) {
    super(app);
    this.spaces = spaces;
    this.onPick = onPick;
    this.setPlaceholder("Pull which space?");
  }
  getItems() {
    return this.spaces;
  }
  getItemText(s) {
    return s.name;
  }
  onChooseItem(s) {
    this.onPick(s);
  }
};
var ConflictPushModal = class extends import_obsidian4.Modal {
  constructor(app, spaceName, onPick) {
    super(app);
    this.spaceName = spaceName;
    this.onPick = onPick;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h3", { text: "The app changed this too" });
    contentEl.createEl("p", {
      text: `"${this.spaceName}" moved in Graphite since your last sync. Pushing now writes this note\u2019s values over the app\u2019s newer edits (the app keeps an undo). Pulling first refreshes the note \u2014 if your edits collide, your version is banked beside it.`,
      cls: "gr-picker-hint"
    });
    new import_obsidian4.Setting(contentEl).addButton((b) => b.setButtonText("Pull first").setCta().onClick(() => {
      this.close();
      this.onPick("pull");
    })).addButton((b) => b.setButtonText("Push anyway").setWarning().onClick(() => {
      this.close();
      this.onPick("push");
    })).addButton((b) => b.setButtonText("Cancel").onClick(() => {
      this.close();
      this.onPick("cancel");
    }));
  }
  onClose() {
    this.contentEl.empty();
  }
};
var ModuleTypePicker = class extends import_obsidian4.FuzzySuggestModal {
  constructor(app, onPick) {
    super(app);
    this.onPick = onPick;
    this.setPlaceholder("Add which kind of module?");
  }
  getItems() {
    return ADDABLE_MODULE_TYPES;
  }
  getItemText(t) {
    return moduleTypeName(t);
  }
  onChooseItem(t) {
    this.onPick(t);
  }
};
var ModuleNamePrompt = class extends import_obsidian4.Modal {
  constructor(app, typeName2, onDone) {
    super(app);
    this.typeName = typeName2;
    this.onDone = onDone;
  }
  name = "";
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h3", { text: `Name the new ${this.typeName} module` });
    new import_obsidian4.Setting(contentEl).setName("Name").addText((t) => t.setPlaceholder(this.typeName).onChange((v) => {
      this.name = v;
    }));
    new import_obsidian4.Setting(contentEl).addButton((b) => b.setButtonText("Cancel").onClick(() => this.close())).addButton((b) => b.setButtonText("Add").setCta().onClick(() => this.submit(this.name)));
  }
  /** What Add does — public so a test can press it. */
  submit(name) {
    this.close();
    this.onDone(name);
  }
  onClose() {
    this.contentEl.empty();
  }
};
var VaultPicker = class extends import_obsidian4.FuzzySuggestModal {
  constructor(app, vaults, onPick) {
    super(app);
    this.vaults = vaults;
    this.onPick = onPick;
    this.setPlaceholder("Into which vault?");
  }
  getItems() {
    return this.vaults;
  }
  getItemText(v) {
    return v.current ? `${v.name} (this vault)` : v.name;
  }
  onChooseItem(v) {
    this.onPick(v);
  }
};
var ModulePicker = class extends import_obsidian4.Modal {
  constructor(app, space, modules, onPick) {
    super(app);
    this.space = space;
    this.modules = modules;
    this.onPick = onPick;
    for (const m of modules) this.checks[m.id] = true;
  }
  checks = {};
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h3", { text: `Sync what from "${this.space.name}"?` });
    contentEl.createEl("p", {
      text: "Unticked modules stay out of the file \u2014 and pushes never touch them.",
      cls: "gr-picker-hint"
    });
    for (const m of this.modules) {
      new import_obsidian4.Setting(contentEl).setName(m.name).setDesc(moduleTypeName(m.type)).addToggle((t) => t.setValue(true).onChange((v) => {
        this.checks[m.id] = v;
      }));
    }
    new import_obsidian4.Setting(contentEl).addButton((b) => b.setButtonText("Cancel").onClick(() => this.close())).addButton((b) => b.setButtonText("Pull").setCta().onClick(() => {
      const picked = this.modules.filter((m) => this.checks[m.id]);
      if (!picked.length) {
        new import_obsidian4.Notice("Pick at least one module.");
        return;
      }
      this.close();
      this.onPick(picked);
    }));
  }
  onClose() {
    this.contentEl.empty();
  }
};
var LpSyncView = class extends import_obsidian4.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "Graphite sync";
  }
  getIcon() {
    return "refresh-cw";
  }
  async onOpen() {
    this.contentEl.addClass("gr-sync-view");
    await this.plugin.checkConnection(false);
    this.render();
  }
  render() {
    const el = this.contentEl;
    el.empty();
    const head = el.createDiv({ cls: "gr-sync-head" });
    head.createEl("h4", { text: "Graphite sync" });
    const actions = head.createDiv({ cls: "gr-sync-actions" });
    if (!this.plugin.onDevice) {
      actions.createEl("button", { text: "Pull a space\u2026" }).addEventListener("click", () => void this.plugin.chooseAndPull());
    }
    actions.createEl("button", { text: this.plugin.onDevice ? "Look again" : "Refresh" }).addEventListener("click", () => void this.plugin.checkConnection(false));
    const conn = el.createDiv({ cls: "gr-sync-section" });
    const onDevice = this.plugin.onDevice;
    conn.createEl("div", { text: onDevice ? "THIS DEVICE" : "CONNECTION", cls: "gr-sync-label" });
    const me = this.plugin.lastMe;
    const health = this.plugin.lastHealth;
    const onComputer = this.plugin.onComputer;
    if (onDevice) {
      const look = this.plugin.mirrorLook;
      if (!look) {
        conn.createDiv({ text: "Looking in this vault\u2026", cls: "gr-sync-dim" });
      } else {
        conn.createDiv({
          text: `${look.folders.length ? "\u{1F7E2}" : "\u{1F534}"} ${mirrorSentence(look, Date.now(), import_obsidian4.Platform.isMobile)}`,
          cls: look.folders.length ? "" : "gr-sync-bad"
        });
        if (look.changedHere > 0) {
          const list = conn.createEl("ul", { cls: "gr-sync-dim" });
          for (const f of look.folders) for (const n of f.changedHere.slice(0, 8)) list.createEl("li", { text: n });
        }
        conn.createDiv({
          text: `Looked ${clock(this.plugin.lastCheck?.at ?? Date.now())}. Nothing is sent from here.`,
          cls: "gr-sync-dim"
        });
      }
    } else if (!this.plugin.configured) {
      conn.createDiv({
        text: onComputer ? this.plugin.notConfigured().long : "Not configured \u2014 set the server URL and API token in the plugin settings.",
        cls: "gr-sync-bad"
      });
    } else if (me) {
      conn.createDiv({
        text: onComputer ? "\u{1F7E2} Connected to the Graphite app on this computer" : `\u{1F7E2} Connected as ${me.name ?? me.email} \xB7 ${this.plugin.settings.serverUrl}`
      });
      const when = this.plugin.lastCheck ? ` \xB7 checked ${clock(this.plugin.lastCheck.at)}` : "";
      conn.createDiv({
        text: `${onComputer ? "Graphite app version" : "Server version"} ${health?.version ?? "unknown"}${when}`,
        cls: "gr-sync-dim"
      });
      const outdated = this.plugin.outdatedNote();
      if (outdated) conn.createDiv({ text: outdated, cls: "gr-sync-bad" });
      if (this.plugin.vaultReport === "gated") {
        conn.createDiv({
          text: "This vault is not offered in the app's mirror-folder dropdown: naming a vault there is an instance-operator setting. Everything else on this panel works normally.",
          cls: "gr-sync-dim"
        });
      } else if (this.plugin.vaultReport === "failed") {
        conn.createDiv({
          text: "This vault could not be reported to the server, so it may not appear in the app's mirror-folder dropdown. An older server does not have that endpoint.",
          cls: "gr-sync-dim"
        });
      }
    } else {
      if (onComputer) {
        conn.createDiv({ text: `\u{1F534} ${this.plugin.lastCheck?.detail ?? "Not connected"} \xB7 this computer`, cls: "gr-sync-bad" });
        conn.createDiv({ text: "Use Refresh once the Graphite app is open.", cls: "gr-sync-dim" });
      } else {
        conn.createDiv({ text: `\u{1F534} Not connected \xB7 ${this.plugin.settings.serverUrl}`, cls: "gr-sync-bad" });
        conn.createDiv({ text: "Use Refresh (or fix the token in settings).", cls: "gr-sync-dim" });
      }
    }
    if (onDevice) {
      const how2 = el.createDiv({ cls: "gr-sync-section" });
      how2.createEl("div", { text: "HOW THIS WORKS", cls: "gr-sync-label" });
      const ul2 = how2.createEl("ul", { cls: "gr-sync-how" });
      for (const line of [
        "The Graphite app writes your spaces into this vault as notes. It does that whenever the app is opened, and nothing runs in the background.",
        "Change a line, tick a box or add a task line in a note here, and the app takes it in the next time it is opened, then writes the note again in its own form.",
        "This plugin only looks. It never sends anything, and it cannot tell whether the app has taken a change in until the app has been opened and has written again.",
        "To choose which vault the app writes into: in the Graphite app, Settings, Data and server, Data locations."
      ]) ul2.createEl("li", { text: line });
      return;
    }
    const props = el.createDiv({ cls: "gr-sync-section" });
    props.createEl("div", { text: "PROPOSALS IN THIS NOTE", cls: "gr-sync-label" });
    const propsBody = props.createDiv();
    propsBody.createDiv({ text: "\u2026", cls: "gr-sync-dim" });
    void this.plugin.activeProposals().then((a) => {
      propsBody.empty();
      if (!a || !a.list.length) {
        propsBody.createDiv({ text: "None. Your agent writes proposals in italic; they wait here until you approve them.", cls: "gr-sync-dim" });
        return;
      }
      const synced = !!this.plugin.settings.files[a.file.path];
      const count = (st) => a.list.filter((p) => p.state === st).length;
      propsBody.createDiv({
        text: `${count("proposed")} proposed \xB7 ${count("approved")} approving \xB7 ${count("unreadable")} unreadable`,
        cls: "gr-sync-dim"
      });
      for (const p of a.list) {
        const row = propsBody.createDiv({ cls: `gr-sync-file gr-proposal-row gr-proposal-${p.state}` });
        const words = approvedText(a.lines[p.line]).replace(/^\s*[-*+]\s+\[[ xX]\]\s+/, "");
        row.createSpan({ text: words });
        row.createEl("span", {
          text: synced ? "unreadable \xB7 synced note" : p.state === "approved" ? "approving" : p.state === "unreadable" ? `unreadable \xB7 ${p.reason}` : "proposed",
          cls: "gr-sync-state"
        });
        if (!synced && p.state !== "unreadable") {
          row.createEl("button", { text: "Approve" }).addEventListener("click", () => void this.plugin.approveProposals(a.file, [p.key]));
        }
      }
      if (!synced && a.list.some((p) => p.state !== "unreadable")) {
        propsBody.createEl("button", { text: "Approve all" }).addEventListener("click", () => void this.plugin.approveProposals(a.file, "all"));
      }
    });
    const filesSec = el.createDiv({ cls: "gr-sync-section" });
    filesSec.createEl("div", { text: "SYNCED SPACES", cls: "gr-sync-label" });
    const paths = Object.keys(this.plugin.settings.files);
    if (paths.length === 0) {
      filesSec.createDiv({ text: 'Nothing synced into this vault yet \u2014 use "Pull a space\u2026".', cls: "gr-sync-dim" });
    }
    const bySpace = /* @__PURE__ */ new Map();
    for (const path of paths) {
      const id = this.plugin.settings.files[path].spaceId;
      (bySpace.get(id) ?? bySpace.set(id, []).get(id)).push(path);
    }
    for (const [spaceId, spacePaths] of bySpace) {
      spacePaths.sort((a, b) => {
        const ra = this.plugin.settings.files[a].role === "index" ? 0 : 1;
        const rb = this.plugin.settings.files[b].role === "index" ? 0 : 1;
        return ra - rb || a.localeCompare(b);
      });
      const head2 = this.plugin.settings.files[spacePaths[0]];
      const name = head2.spaceName ?? spaceId;
      const row = filesSec.createDiv({ cls: "gr-sync-row" });
      const top = row.createDiv({ cls: "gr-sync-row-top" });
      top.createEl("b", { text: name });
      const scope = head2.moduleIds?.length ? `${head2.moduleIds.length}${head2.moduleCount ? `/${head2.moduleCount}` : ""} modules` : "whole space";
      const where = head2.folder ? `${head2.folder}/ \xB7 ${spacePaths.length} notes` : spacePaths[0];
      row.createDiv({
        text: `${where} \xB7 ${scope} \xB7 synced ${relTime(head2.lastSyncAt)}`,
        cls: "gr-sync-dim"
      });
      for (const path of spacePaths) {
        const entry = this.plugin.settings.files[path];
        const line = row.createDiv({ cls: "gr-sync-file" });
        const label = entry.folder ? path.slice(entry.folder.length + 1) : path;
        line.createSpan({ text: entry.role === "index" ? `${label} (index)` : label });
        const stateEl = line.createEl("span", { text: "\u2026", cls: "gr-sync-state" });
        void this.plugin.fileState(path).then((s) => {
          stateEl.setText(
            s === "in-sync" ? "\u2713 in sync" : s === "local-edits" ? "\u25CF local edits" : "\u26A0 file missing"
          );
          stateEl.addClass(`gr-state-${s}`);
        });
        const pushBtn = line.createEl("button", { text: "Push" });
        pushBtn.addEventListener("click", () => void this.plugin.pushFile(path));
        if (entry.role === "page") {
          void this.plugin.fileState(path).then((s) => {
            if (s === "missing") pushBtn.setText("Delete page");
          });
        }
        line.createEl("button", { text: "Check" }).addEventListener("click", () => void this.plugin.serverState(path).then((s) => {
          new import_obsidian4.Notice(
            s === "server-changed" ? "Server has NEW changes since your last sync \u2014 Pull to get them." : s === "server-unchanged" ? "Server matches your last sync." : "Could not reach the server."
          );
        }));
      }
      const btns = row.createDiv({ cls: "gr-sync-row-btns" });
      const mk = (label, fn) => btns.createEl("button", { text: label }).addEventListener("click", fn);
      mk("Pull", () => void this.plugin.pullSpace({ id: spaceId, name }));
      mk("Push all", () => void this.plugin.pushSpace(spaceId));
      mk("Forget", () => void this.plugin.forgetSpace(spaceId));
    }
    const how = el.createDiv({ cls: "gr-sync-section" });
    how.createEl("div", { text: "HOW THIS SYNC WORKS", cls: "gr-sync-label" });
    const auto = this.plugin.settings.autoPush;
    const ul = how.createEl("ul", { cls: "gr-sync-how" });
    const folder = this.plugin.settings.layout === "folder";
    for (const line of [
      `Mode: ${auto ? "AUTO-PUSH \u2014 tracked files push ~2.5s after you stop editing." : "MANUAL \u2014 you decide when to Pull and Push (auto-push can be enabled in settings)."}`,
      `Layout: ${folder ? "FOLDER PER SPACE \u2014 an index note plus one note per module, linked both ways; each note pushes on its own." : "ONE FILE PER SPACE \u2014 the whole space as a single package file (switch to a folder in settings)."}`,
      "Pull writes the server\u2019s canonical export of a space into this vault.",
      "Your \u201C\u{1F4DD} Freeform notes\u201D block is yours: it is carried across every pull and push. Everything outside it is regenerated from the app.",
      "Push sends your edits through the validate-first merge importer: on any error (shown with line numbers) NOTHING lands; on success the file is rewritten to the server\u2019s canonical form.",
      '"\u25CF local edits" = the file changed since the last sync. "Check server" tells you if the space changed on the server side.',
      "Pulling asks which VAULT the space lands in \u2014 pick any local vault, and its own Graphite Sync instance is seeded so pushes work natively from there. This panel lists only the current vault\u2019s files.",
      "Any number of spaces can be pulled into any number of vaults; each vault keeps its own settings and mappings.",
      'Optional: the "choosing modules" command pulls a space with only ticked modules in the file \u2014 unticked ones never enter the vault, and pushes never touch them (absence never deletes on the server).'
    ]) ul.createEl("li", { text: line });
  }
};
var LpSettingTab = class extends import_obsidian4.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const onDevice = this.plugin.onDevice;
    const onComputer = this.plugin.onComputer;
    new import_obsidian4.Setting(containerEl).setName("Where Graphite is").setDesc('A server, or the Graphite app on this device or computer. "This computer" reads the spaces the app holds, with no server and no account: it needs Obsidian on a desktop and the Graphite app open on the same computer, with "Let the notes plugin read Graphite on this computer" turned on in its Settings, Data and server (a phone cannot; use Server). "This device" needs no server and no account: the Graphite app writes your spaces into this vault as notes whenever it is opened, and takes in what you changed here the next time it is opened. Nothing runs in the background, so a change you make here waits for that. In Graphite, choose this vault in Settings, Data and server, Data locations.').addDropdown((d) => d.addOption("server", "Server").addOption("device", "This device").addOption("computer", "This computer").setValue(this.plugin.settings.source).onChange(async (v) => {
      if (v === "computer" && !import_obsidian4.Platform.isDesktopApp) {
        new import_obsidian4.Notice(`Graphite: ${doorSentence("phone")}`, 1e4);
        this.plugin.settings.source = "server";
      } else {
        this.plugin.settings.source = v === "device" ? "device" : v === "computer" ? "computer" : "server";
      }
      await this.plugin.saveSettings();
      this.plugin.computerReadOnly = false;
      await this.plugin.checkConnection(false);
      this.display();
    }));
    if (onDevice) {
      const look = this.plugin.mirrorLook;
      new import_obsidian4.Setting(containerEl).setName("This device").setDesc(look ? mirrorSentence(look, Date.now(), import_obsidian4.Platform.isMobile) : "Looking in this vault for the notes the Graphite app wrote.");
    } else if (onComputer) {
      const look = this.plugin.doorLook(true);
      new import_obsidian4.Setting(containerEl).setName("This computer").setDesc(look.ok ? "Found the Graphite app on this computer. There is no address or token to enter: the app leaves them where this plugin reads them, and they change each time the app starts." : doorSentence(look.why));
    } else {
      new import_obsidian4.Setting(containerEl).setName("Server URL").setDesc("The Graphite server your account is on, e.g. https://graphite.example.com. Only spaces kept on a server can be pulled from it. To read spaces kept on your devices, or shared between them through the relay, choose This device above.").addText((t) => t.setPlaceholder("https://graphite.example.com").setValue(this.plugin.settings.serverUrl).onChange(async (v) => {
        this.plugin.settings.serverUrl = v.trim();
        await this.plugin.saveSettings();
      }));
      new import_obsidian4.Setting(containerEl).setName("API token").setDesc("Generate one in the Graphite app, signed in to that server: Settings \u2192 Where am I signed in? \u2192 Generate API token.").addText((t) => t.setValue(this.plugin.settings.token).onChange(async (v) => {
        this.plugin.settings.token = v.trim();
        await this.plugin.saveSettings();
      }));
    }
    new import_obsidian4.Setting(containerEl).setName("Connection").setDesc(onDevice ? "Looks in this vault for the notes the Graphite app wrote, and says what changed here since." : onComputer ? "Looks for the Graphite app on this computer and asks it who it is." : "Verifies the URL + token against the server and shows who you are signed in as.").addButton((b) => b.setButtonText(onDevice ? "Look again" : "Test connection").setCta().onClick(async () => {
      if (await this.plugin.checkConnection(true) && !onDevice) this.display();
    }));
    if (!onDevice && !onComputer) {
      new import_obsidian4.Setting(containerEl).setName("Bring in every space").setDesc("Once the key is linked, every space you can read is pulled into this vault, and a space made later arrives the next time Obsidian opens. This only writes files here. Edits go back to Graphite when you push them (or with Auto-push below), into the space this vault is bound to.").addToggle((t) => t.setValue(this.plugin.settings.mirrorAll).onChange(async (v) => {
        this.plugin.settings.mirrorAll = v;
        await this.plugin.saveSettings();
      })).addButton((b) => b.setButtonText("Bring in now").onClick(async () => {
        if (await this.plugin.checkConnection(true)) await this.plugin.mirrorEverySpace(true);
      }));
    }
    if (!onDevice) {
      new import_obsidian4.Setting(containerEl).setName("Vault layout").setDesc(`How a pulled space lands here. "Folder per space" writes an index note plus one note per module, linked to each other and carrying the module's own tags \u2014 so a module is a note you can open, link and embed on its own. Existing files keep the layout they were pulled with until you pull them again.`).addDropdown((d) => d.addOption("folder", "Folder per space (one note per module)").addOption("single", "One file per space").setValue(this.plugin.settings.layout).onChange(async (v) => {
        this.plugin.settings.layout = v === "folder" ? "folder" : "single";
        await this.plugin.saveSettings();
        this.plugin.refreshPanel();
      }));
    }
    new import_obsidian4.Setting(containerEl).setName("Hide sync ids").setDesc('Hide the "lp:" id markers the sync uses for matching records. They stay in the file (pushes need them) and reveal themselves on the line you are editing.').addToggle((t) => t.setValue(this.plugin.settings.hideIds).onChange(async (v) => {
      this.plugin.settings.hideIds = v;
      await this.plugin.saveSettings();
    }));
    if (!onDevice) {
      new import_obsidian4.Setting(containerEl).setName("Auto-push on save").setDesc("Push tracked files ~2.5s after you stop editing. Off = manual pushes only.").addToggle((t) => t.setValue(this.plugin.settings.autoPush).onChange(async (v) => {
        this.plugin.settings.autoPush = v;
        await this.plugin.saveSettings();
        this.plugin.refreshPanel();
      }));
    }
    if (onDevice || onComputer) {
      new import_obsidian4.Setting(containerEl).setName("Capture, binding and census").setDesc("These need a Graphite server, so they are off while Graphite is read from this " + (onComputer ? "computer" : "device") + ". Choose Server above to use them.");
    } else {
      const binding = this.plugin.fetchBinding().catch(() => null);
      new import_obsidian4.Setting(containerEl).setName("This vault's space").setDesc("Everything this vault writes to Graphite lands in this space or a space nested inside it \u2014 or nowhere: a note that names a space outside it is refused, and the refusal says which (unless All my spaces, below, is on). Nothing is written until a space is chosen. New spaces and captured lines go here.").addDropdown((d) => {
        d.addOption("", "Not bound \u2014 this vault writes nothing");
        d.setValue("");
        d.onChange(async (v) => {
          await this.plugin.bindVault(v || null);
          this.display();
        });
        this.bindingChoices = Promise.all([binding, this.plugin.fetchSpaces()]).then(([b, spaces]) => {
          for (const s of spaces) d.addOption(s.id, s.name);
          d.setValue(b?.bound && b.root ? b.root.id : "");
        }).catch(() => {
        });
      });
      new import_obsidian4.Setting(containerEl).setName("All my spaces").setDesc("Off: this vault writes only into its space and the spaces inside it. On: your edits go back to every space you are allowed to write in, and Graphite still checks each one. Needs a space chosen above.").addToggle((t) => {
        t.setValue(false);
        t.onChange(async (v) => {
          if (!await this.plugin.setAllSpaces(v)) this.display();
        });
        void binding.then((b) => t.setValue(!!(b?.bound && b.allSpaces))).catch(() => void 0);
      });
      new import_obsidian4.Setting(containerEl).setName("Capture inbox").setDesc('Where "Capture tasks from this vault" files a `- [ ]` line it finds in any note that is not a synced one. The line is marked afterwards, so capturing again never makes it twice. Choose the space this vault is bound to first.').addDropdown((d) => {
        d.addOption("", "Off");
        d.setValue("");
        d.onChange(async (v) => {
          if (!await this.plugin.setInbox(v || null)) this.display();
        });
        this.inboxChoices = binding.then(async (b) => {
          if (!b?.bound) return;
          if (b.inbox) d.addOption(b.inbox.id, `${b.inbox.spaceName} \u203A ${b.inbox.name}`);
          for (const m of await this.plugin.fetchInboxChoices()) {
            if (m.id !== b.inbox?.id) d.addOption(m.id, m.label);
          }
          d.setValue(b.inbox?.id ?? "");
        }).catch(() => {
        });
      });
      new import_obsidian4.Setting(containerEl).setName("Capture any tagged line as a note").setDesc("A line that is not a task but has a #tag becomes a note in the capture inbox's space (its first Notes module), marked so it is never captured twice. Headings and lines of only tags are left alone.").addToggle((t) => t.setValue(this.plugin.settings.captureAnyTagged).onChange(async (v) => {
        this.plugin.settings.captureAnyTagged = v;
        await this.plugin.saveSettings();
      }));
      new import_obsidian4.Setting(containerEl).setName("Capture lines with these tags as notes").setDesc("Comma-separated, e.g. st, mtg. A tag takes everything beneath it: st takes #st/IS-07. Works whether or not the switch above is on.").addText((t) => t.setPlaceholder("st, mtg").setValue(this.plugin.settings.captureTags).onChange(async (v) => {
        this.plugin.settings.captureTags = v;
        await this.plugin.saveSettings();
      }));
      new import_obsidian4.Setting(containerEl).setName("Capture automatically").setDesc("Capture a note a minute after it stops changing, whether you wrote it here or it arrived from another device, so nothing waits for the command. A note open in the editor waits until you leave it. Needs the capture inbox above.").addToggle((t) => t.setValue(this.plugin.settings.autoCapture).onChange(async (v) => {
        this.plugin.settings.autoCapture = v;
        await this.plugin.saveSettings();
      }));
      new import_obsidian4.Setting(containerEl).setName("Send notes to Graphite as pages").setDesc("Off by default. When on, a note in one of the folders below, or one with a routing heading (## Weekly >> Space), is sent to Graphite whole a minute after it stops changing and shown there as a read-only page with the tasks captured from it. This vault must be bound to a space, above; no capture inbox is needed.").addToggle((t) => t.setValue(this.plugin.settings.pagesOn).onChange(async (v) => {
        this.plugin.settings.pagesOn = v;
        await this.plugin.saveSettings();
      }));
      new import_obsidian4.Setting(containerEl).setName("Folders whose notes become pages").setDesc("Comma-separated, e.g. Meetings. Every note in these folders is a page, while the switch above is on. Empty by default. A note with a routing heading is a page whatever this says. Pick the Notes module for each folder below.").addText((t) => t.setPlaceholder("Meetings").setValue(this.plugin.settings.pageFolders).onChange(async (v) => {
        this.plugin.settings.pageFolders = v;
        await this.plugin.saveSettings();
        this.drawPageModules();
      }));
      this.pageRows = containerEl.createDiv();
      this.pageModuleList = this.plugin.fetchPageModuleChoices();
      this.drawPageModules();
      const sent = this.plugin.censusState;
      new import_obsidian4.Setting(containerEl).setName("Send a vault census to the morning sweep").setDesc("Off by default. When on, Graphite is sent \u2014 for each note with an unticked to-do nobody filed, or dated in the last week \u2014 its path, its date, how many task lines it holds in each state, its tags and its links. Never a word of the note. The sweep uses it to find to-dos nobody filed and meetings with no note; without it, the sweep says it could not look at the vault." + (sent === "failed" ? " The last census could not be sent." : sent === "too-big" ? " The last census was too large to send." : sent ? ` Last sent with ${sent.notes} note${sent.notes === 1 ? "" : "s"}.` : "")).addToggle((t) => t.setValue(this.plugin.settings.censusOn).onChange(async (v) => {
        this.plugin.settings.censusOn = v;
        await this.plugin.saveSettings();
        if (v) await this.plugin.reportCensus({ loud: true });
      }));
    }
    const agent = this.plugin.agentState;
    new import_obsidian4.Setting(containerEl).setName("Publish the agent contract").setDesc("Off by default. When on, two notes are written into Graphite/ in this vault: the routing list \u2014 the spaces, modules and tags your own agent may choose from, and nothing else \u2014 and the agent brief, which tells it how to write proposals. Your agent reads them and the folders below; the text of those notes goes to your agent's own model provider, never to Graphite. Graphite receives only what you approve. The brief's rules are instructions to your agent, not code \u2014 except the closed list, which approval checks." + (agent === "stale" ? " The last refresh could not reach Graphite." : "")).addToggle((t) => t.setValue(this.plugin.settings.agentOn).onChange(async (v) => {
      this.plugin.settings.agentOn = v;
      await this.plugin.saveSettings();
      if (v) await this.plugin.publishAgentContract({ loud: true });
    }));
    new import_obsidian4.Setting(containerEl).setName("Show the Graphite bar").setDesc("A row of buttons above a note (below it on a phone or tablet): start a list, task, due, assign, priority, tag, send to, capture now. It is not shown in a note Graphite syncs. Every button is also a command, so you can put them on a phone toolbar and hide the row.").addToggle((t) => t.setValue(this.plugin.settings.barOn).onChange(async (v) => {
      this.plugin.settings.barOn = v;
      await this.plugin.saveSettings();
      this.plugin.syncBars();
    }));
    new import_obsidian4.Setting(containerEl).setName("Share the picker lists with other devices").setDesc("On by default. While connected, the spaces, their Tasks and Notes modules, the people of each space and the tags in use are written to Graphite/Toolbar lists.json in this vault, so a tablet that has the plugin but no sign-in can still offer them in the bar pickers. Names only, never a token, an address or a password.").addToggle((t) => t.setValue(this.plugin.settings.barShare).onChange(async (v) => {
      this.plugin.settings.barShare = v;
      await this.plugin.saveSettings();
      if (v) await this.plugin.publishToolbarLists();
    }));
    new import_obsidian4.Setting(containerEl).setName("Folders your agent may read").setDesc("Comma-separated, e.g. Daily, Meetings. Empty means none: the brief then tells your agent to read nothing. A note tagged #private is never read, whatever folder it is in.").addText((t) => t.setPlaceholder("Daily, Meetings").setValue(this.plugin.settings.agentFolders).onChange(async (v) => {
      this.plugin.settings.agentFolders = v;
      await this.plugin.saveSettings();
      if (this.plugin.settings.agentOn) await this.plugin.publishAgentContract();
    }));
    this.drawNoteSync(containerEl);
    new import_obsidian4.Setting(containerEl).setName("Connected devices and servers").setHeading();
    containerEl.createEl("p", {
      cls: "setting-item-description",
      text: "What the servers last recorded \u2014 not a live view. Graphite Sync asks a server only when you open this tab or press something, so it never shows a device as online or as typing."
    });
    const servers = containerEl.createDiv();
    this.drawServers(servers);
    const devices = containerEl.createDiv();
    this.drawDevices(devices, "asking");
    this.deviceList = this.plugin.fetchDevices().then(() => this.drawDevices(devices, "answered"));
  }
  /* ROW 2375: whole-vault note sync, and the settings note. Since R-5255
   * (2026-10-10) notes travel over a CouchDB server, sealed on this device
   * under a passphrase, in a database of their own. A change to any of
   * these settings restarts note sync, so live sync follows what is set. */
  drawNoteSync(containerEl) {
    const s = this.plugin.settings;
    const save = async () => {
      await this.plugin.saveSettings();
      this.plugin.restartNoteSync();
    };
    new import_obsidian4.Setting(containerEl).setName("Note sync").setHeading();
    new import_obsidian4.Setting(containerEl).setName("Carry this vault between devices").setDesc("Every ordinary file in this vault travels, sealed on this device first, so the server holds neither the notes nor their names. Use a new database, not the LiveSync one: it stays as it is. Hidden files, plugin settings and files over 50 MB never travel.").addDropdown((d) => {
      for (const k of NOTE_SYNC_KINDS) d.addOption(k, NOTE_SYNC_LABELS[k]);
      d.setValue(s.noteSync).onChange(async (v) => {
        s.noteSync = NOTE_SYNC_KINDS.includes(v) ? v : "off";
        await save();
        this.display();
      });
    });
    if (s.noteSync === "couchdb") {
      new import_obsidian4.Setting(containerEl).setName("CouchDB server").setDesc("The address of the server, with no database on the end.").addText((t) => t.setPlaceholder("https://couch.example.com").setValue(s.couchUrl).onChange(async (v) => {
        s.couchUrl = v.trim();
        await save();
      }));
      new import_obsidian4.Setting(containerEl).setName("Database").setDesc("Lowercase letters, digits and _ $ ( ) + - /, starting with a letter.").addText((t) => t.setValue(s.couchDb).onChange(async (v) => {
        s.couchDb = v.trim();
        await save();
      }));
      new import_obsidian4.Setting(containerEl).setName("CouchDB user").addText((t) => t.setValue(s.couchUser).onChange(async (v) => {
        s.couchUser = v.trim();
        await save();
      }));
      new import_obsidian4.Setting(containerEl).setName("CouchDB password").setDesc("Kept on this device only. It is never written to the settings note.").addText((t) => {
        t.inputEl.type = "password";
        t.setValue(s.couchPassword).onChange(async (v) => {
          s.couchPassword = v;
          await save();
        });
      });
      new import_obsidian4.Setting(containerEl).setName("Encryption passphrase").setDesc("Every note is sealed under this before it leaves this device. Type the same passphrase on each device; it is kept on this device only and never written to the settings note. Lose it and the notes in the database cannot be read.").addText((t) => {
        t.inputEl.type = "password";
        t.setValue(s.couchPassphrase).onChange(async (v) => {
          s.couchPassphrase = v;
          await save();
        });
      });
      new import_obsidian4.Setting(containerEl).setName("Live sync").setDesc("Changes travel as they happen, rather than when you ask.").addToggle((t) => t.setValue(s.liveSync).onChange(async (v) => {
        s.liveSync = v;
        await save();
      }));
      new import_obsidian4.Setting(containerEl).setName("Test the CouchDB server").setDesc(this.plugin.noteSyncCheck?.detail ?? "Signs in and looks for the database. Writes nothing.").addButton((b) => b.setButtonText("Test").onClick(async () => {
        await this.plugin.testNoteSync();
        this.display();
      }));
      const last = this.plugin.noteSyncLast;
      new import_obsidian4.Setting(containerEl).setName("Sync notes now").setDesc(last ? last.charAt(0).toUpperCase() + last.slice(1) : "Takes what arrived, sends what changed here, and says what moved.").addButton((b) => b.setButtonText("Sync").onClick(async () => {
        await this.plugin.syncNotesNow({ loud: true });
        this.display();
      }));
    }
    new import_obsidian4.Setting(containerEl).setName("Keep settings in a note").setDesc(`Also keeps these settings in ${SETTINGS_NOTE_PATH}: change one there and it changes here, and the other way round. To set up another device, copy the note into its vault and turn this on there. The API token, the CouchDB password and the encryption passphrase are not written to it.`).addToggle((t) => t.setValue(s.configFile).onChange(async (v) => {
      await this.plugin.keepSettingsNote(v);
      this.display();
    }));
  }
  /** ROW 2376: one row per server, with when it last answered. */
  drawServers(el) {
    el.empty();
    const list = this.plugin.serversOnThisMachine();
    if (this.plugin.offServer) {
      const here = this.plugin.onComputer;
      new import_obsidian4.Setting(el).setName(here ? "Graphite on this computer" : "Graphite on this device").setDesc(here ? `The Graphite app on this computer, no server. ${serverCheckText(this.plugin.lastCheck)}` : this.plugin.lastCheck?.detail ?? "Not looked at yet.").addButton((b) => b.setButtonText("Check").onClick(async () => {
        await this.plugin.checkConnection(false);
        this.drawServers(el);
      }));
    } else if (list.length === 0) {
      new import_obsidian4.Setting(el).setName("Servers").setDesc("No server is set for this vault yet \u2014 fill in the Server URL above.");
      return;
    }
    for (const s of list) {
      const used = s.here ? `Used by this vault${s.vaults.length > 1 ? ` and ${s.vaults.filter((v) => v !== "This vault").join(", ")}` : ""}.` : `Used by ${s.vaults.join(", ")}.`;
      const check = s.here ? this.plugin.lastCheck : this.plugin.serverChecks[serverKey(s.url)];
      const row = new import_obsidian4.Setting(el).setName(s.url).setDesc(`${used} ${serverCheckText(check)}`);
      row.addButton((b) => b.setButtonText("Check").onClick(async () => {
        if (s.here) await this.plugin.checkConnection(false);
        else await this.plugin.checkServer(s.url);
        this.drawServers(el);
      }));
    }
  }
  /** ROW 2376: one row per device or token the server holds for this
   *  vault's account, each with the server's own last-used stamp. */
  drawDevices(el, phase) {
    el.empty();
    const p = this.plugin;
    if (p.offServer) {
      new import_obsidian4.Setting(el).setName("Devices").setDesc(`The Graphite app on this ${p.onComputer ? "computer" : "device"} has no account to sign in to, so there are no sign-ins to list.`);
      return;
    }
    if (!p.settings.serverUrl || !p.settings.token) {
      new import_obsidian4.Setting(el).setName("Devices").setDesc("Set the server URL and API token above to list the devices signed in to your account.");
      return;
    }
    if (phase === "asking") {
      new import_obsidian4.Setting(el).setName("Devices").setDesc("Asking the server\u2026");
      return;
    }
    if (!p.devices) {
      const why = p.devicesReport === "old-server" ? "this server is too old to list them" : p.devicesReport === "refused" ? "the server refused this vault's token" : "the server could not be reached";
      new import_obsidian4.Setting(el).setName("Devices").setDesc(`The devices could not be listed: ${why}.`);
      return;
    }
    const host = p.settings.serverUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    new import_obsidian4.Setting(el).setName("Devices").setDesc(`${host} holds ${p.devices.length} sign-in${p.devices.length === 1 ? "" : "s"} for your account, API tokens included. Each says when the server last saw it in use.`);
    const now = Date.now();
    for (const d of p.devices) {
      const since = d.createdAt ? ` \xB7 since ${new Date(d.createdAt).toLocaleDateString()}` : "";
      new import_obsidian4.Setting(el).setName(`${deviceName(d.userAgent)}${d.current ? " \u2014 this vault's token" : ""}`).setDesc(`${lastSeenText(d, now)}${since}`);
    }
  }
  /** NOTE PAGES: the rows of Notes-module choices, one per listed page folder. */
  pageRows;
  pageModuleList = Promise.resolve([]);
  /** Settles when the module choices have been drawn into the rows. */
  pageModuleChoices = null;
  /** Draw (or redraw) the module row of each listed page folder. The rows draw
   *  at once with the default, and the choices arrive after, as the capture
   *  inbox's do, so the tab opens offline. */
  drawPageModules() {
    const rows = this.pageRows;
    rows.empty();
    const modules = this.plugin.settings.pageModules;
    const pending = [];
    for (const folder of parseFolders(this.plugin.settings.pageFolders)) {
      new import_obsidian4.Setting(rows).setName(`Notes module for ${folder}`).setDesc("Where pages from this folder are filed. Pages already sent move when you change it.").addDropdown((d) => {
        d.addOption("", "First Notes module of the space (default)");
        d.setValue(modules[folder] ?? "");
        d.onChange(async (v) => {
          if (v) modules[folder] = v;
          else delete modules[folder];
          await this.plugin.saveSettings();
        });
        pending.push((list) => {
          for (const m of list) d.addOption(m.id, m.label);
          const chosen = modules[folder];
          if (chosen && !list.some((m) => m.id === chosen)) {
            d.addOption(chosen, "A module that is no longer available");
          }
          d.setValue(chosen ?? "");
        });
      });
    }
    this.pageModuleChoices = this.pageModuleList.then((list) => {
      for (const fill of pending) fill(list);
    }).catch(() => {
    });
  }
  /** The capture inbox's choices, once the server has answered. */
  inboxChoices = null;
  /** ROW 2376: the device list, once the server has answered. */
  deviceList = null;
  /** OC2: the vault's-space choices, once the server has answered. */
  bindingChoices = null;
};
