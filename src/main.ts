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
  App, FileSystemAdapter, FuzzySuggestModal, ItemView, Modal, Notice, Plugin,
  PluginSettingTab, Setting, TFile, WorkspaceLeaf, requestUrl,
} from 'obsidian';

const VIEW_TYPE = 'graphite-sync';

interface SpaceInfo { id: string; name: string; }
interface ModuleInfo { id: string; name: string; type: string; }
interface VaultDest { name: string; path: string; current: boolean; }

interface FileEntry {
  spaceId: string;
  spaceName?: string;
  lastSyncAt?: number;   // last successful pull or push+canonicalize
  lastHash?: string;     // hash of the file content at that moment
  /** R-290: selective sync — only these modules are exported/round-tripped.
   *  Safe because merge-import never deletes what a file omits. */
  moduleIds?: string[];
  moduleCount?: number;  // total modules in the space at pull time (for "3/7")
}

interface LpSettings {
  serverUrl: string;
  token: string;
  /** vault file path -> synced space. */
  files: Record<string, FileEntry>;
  autoPush: boolean;
}

const DEFAULTS: LpSettings = { serverUrl: '', token: '', files: {}, autoPush: false };

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
  /** True while the plugin itself writes a vault file (canonicalize/pull),
   *  so the auto-push modify handler must not re-trigger. */
  private writingBack = false;
  private pushTimers: Record<string, number> = {};
  lastMe: { name?: string; email?: string } | null = null;
  lastHealth: { version?: string } | null = null;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new LpSettingTab(this.app, this));
    this.registerView(VIEW_TYPE, (leaf) => new LpSyncView(leaf, this));
    this.addRibbonIcon('refresh-cw', 'Graphite sync', () => this.openPanel());

    this.statusEl = this.addStatusBarItem();
    this.setStatus('…', 'checking');
    window.setTimeout(() => void this.checkConnection(false), 800);

    this.addCommand({ id: 'lp-open-panel', name: 'Open the sync panel', callback: () => this.openPanel() });
    this.addCommand({ id: 'lp-pull-space', name: 'Pull a space (pick destination vault)', callback: () => this.chooseAndPull() });
    this.addCommand({ id: 'lp-pull-selective', name: 'Pull a space into THIS vault, choosing modules', callback: () => this.chooseAndPullSelective() });
    this.addCommand({ id: 'lp-push-file', name: 'Push the current file back to Graphite', callback: () => this.pushCurrent() });
    this.addCommand({ id: 'lp-test-connection', name: 'Test the server connection', callback: () => this.checkConnection(true) });

    // Auto-push (R-290, off by default): tracked files push ~2.5s after the
    // last edit. The writingBack guard keeps canonicalize writes silent.
    this.registerEvent(this.app.vault.on('modify', (f) => {
      if (!this.settings.autoPush || this.writingBack) return;
      if (!(f instanceof TFile) || !this.settings.files[f.path]) return;
      window.clearTimeout(this.pushTimers[f.path]);
      this.pushTimers[f.path] = window.setTimeout(() => void this.pushFile(f.path), 2500);
    }));
  }

  async onunload() {
    Object.values(this.pushTimers).forEach((t) => window.clearTimeout(t));
  }

  api(path: string) {
    return `${this.settings.serverUrl.replace(/\/+$/, '')}/api${path}`;
  }
  get headers() {
    return { Authorization: `Bearer ${this.settings.token}` };
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
    if (!this.settings.serverUrl || !this.settings.token) {
      this.lastMe = null; this.lastHealth = null;
      this.setStatus('not configured', 'bad');
      if (loud) new Notice('Graphite: set the server URL and API token in settings first.');
      this.refreshPanel();
      return false;
    }
    this.setStatus('…', 'checking');
    try {
      const [me, health] = await Promise.all([
        requestUrl({ url: this.api('/auth/me'), headers: this.headers }),
        requestUrl({ url: this.api('/health') }).catch(() => null),
      ]);
      this.lastMe = me.json;
      this.lastHealth = health?.json ?? null;
      const who = this.lastMe?.name ?? this.lastMe?.email ?? 'connected';
      this.setStatus(who, 'ok');
      if (loud) new Notice(`Graphite: connected as ${who}.`);
      this.refreshPanel();
      void this.reportVault();
      return true;
    } catch (e: any) {
      this.lastMe = null;
      const status = e?.status ?? '';
      const why = status === 401 ? 'token rejected (expired or revoked?)' : `unreachable (${status || e})`;
      this.setStatus(why, 'bad');
      if (loud) new Notice(`Graphite: ${why}`);
      this.refreshPanel();
      return false;
    }
  }

  /** R-305: tell the server which vault this plugin lives in, so the app's
   *  mirror settings can offer a dropdown of real vaults instead of a typed
   *  folder. Fire-and-forget: older servers without the endpoint 404 and
   *  nothing changes. */
  async reportVault() {
    try {
      await requestUrl({
        url: this.api('/mirror/vaults'),
        method: 'POST',
        contentType: 'application/json',
        body: JSON.stringify({ name: this.app.vault.getName() }),
        headers: this.headers,
        throw: false,
      });
    } catch { /* best-effort */ }
  }

  async fetchSpaces(): Promise<SpaceInfo[]> {
    const res = await requestUrl({ url: this.api('/spaces'), headers: this.headers });
    return (res.json as any[]).map((s) => ({ id: s.id, name: s.name }));
  }

  /** Default flow (R-290 simplification per Omar): whole-space sync, and
   *  the pull asks WHICH VAULT the space lands in. */
  async chooseAndPull() {
    if (!(await this.checkConnection(false))) {
      new Notice('Graphite: no connection — check the server URL and token in settings.');
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
    if (!(await this.checkConnection(false))) {
      new Notice('Graphite: no connection — check the server URL and token in settings.');
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

  /** Desktop only: every vault Obsidian knows about, current one first,
   *  read from the app-level vault registry (obsidian.json). */
  listVaults(): VaultDest[] {
    const req = (window as any).require;
    const cur = this.app.vault.adapter instanceof FileSystemAdapter
      ? this.app.vault.adapter.getBasePath() : '';
    if (!req) return cur ? [{ name: 'This vault', path: cur, current: true }] : [];
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
    } catch { /* sandboxed / mobile — current vault only */ }
    return cur ? [{ name: 'This vault', path: cur, current: true }] : [];
  }

  /** Pull a space into a DIFFERENT vault: write the .md into that vault's
   *  folder and seed its own plugin config (mapping + credentials) so its
   *  Graphite Sync instance can push/pull natively from there. */
  async pullToVault(space: SpaceInfo, dest: VaultDest) {
    try {
      const md = await requestUrl({ url: this.exportUrl(space.id), headers: this.headers });
      const req = (window as any).require;
      const fs = req('fs'); const p = req('path');
      const fileName = `${space.name.replace(/[\\/:*?"<>|]/g, '_')}.md`;
      fs.writeFileSync(p.join(dest.path, fileName), md.text, 'utf8');
      const plugDir = p.join(dest.path, '.obsidian', 'plugins', 'graphite-sync');
      fs.mkdirSync(plugDir, { recursive: true });
      const dataPath = p.join(plugDir, 'data.json');
      let data: any = {};
      try { data = JSON.parse(fs.readFileSync(dataPath, 'utf8')); } catch { /* fresh */ }
      if (!data.serverUrl) data.serverUrl = this.settings.serverUrl;
      if (!data.token) data.token = this.settings.token;
      data.files = data.files ?? {};
      data.files[fileName] = {
        spaceId: space.id, spaceName: space.name,
        lastSyncAt: Date.now(), lastHash: hash(md.text),
      };
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
      new Notice(`Graphite: pulled "${space.name}" into vault "${dest.name}". If that vault is open now, reload its Graphite Sync plugin to pick up the mapping.`, 9000);
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

  /** moduleIds: undefined = keep the file's stored filter (plain re-pull);
   *  null = explicit "all modules" (clears the filter); array = subset. */
  async pullSpace(space: SpaceInfo, moduleIds?: string[] | null, moduleCount?: number) {
    const fileName = `${space.name.replace(/[\\/:*?"<>|]/g, '_')}.md`;
    const prev = this.settings.files[fileName];
    const effective = moduleIds === undefined ? prev?.moduleIds
      : moduleIds === null ? undefined : moduleIds;
    try {
      const md = await requestUrl({ url: this.exportUrl(space.id, effective), headers: this.headers });
      this.writingBack = true;
      try {
        const existing = this.app.vault.getAbstractFileByPath(fileName);
        if (existing instanceof TFile) await this.app.vault.modify(existing, md.text);
        else await this.app.vault.create(fileName, md.text);
      } finally {
        this.writingBack = false;
      }
      this.settings.files[fileName] = {
        spaceId: space.id, spaceName: space.name,
        lastSyncAt: Date.now(), lastHash: hash(md.text),
        moduleIds: effective,
        moduleCount: moduleCount ?? prev?.moduleCount,
      };
      await this.saveSettings();
      this.refreshPanel();
      const scope = effective?.length ? ` (${effective.length} module${effective.length === 1 ? '' : 's'})` : '';
      new Notice(`Graphite: pulled "${space.name}"${scope}.`);
    } catch (e) {
      new Notice(`Graphite: pull failed — ${e}`);
    }
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

  async pushFile(path: string) {
    const entry = this.settings.files[path];
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!entry || !(file instanceof TFile)) return;
    try {
      const markdown = await this.app.vault.read(file);
      const res = await requestUrl({
        url: this.api('/spaces/import.md'),
        method: 'POST',
        headers: { ...this.headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown, mode: 'merge', targetSpaceId: entry.spaceId }),
      });
      const report = res.json;
      if (report.blocked || (report.errors?.length ?? 0) > 0) {
        const first = report.errors?.[0];
        new Notice(`Graphite: import blocked — ${first ? `line ${first.line}: ${first.message}` : 'see the app'}. Nothing was changed.`);
        return;
      }
      // Canonicalize: the server's view becomes the file (same contract as
      // the in-app mirror), scoped to the file's module filter if it has one.
      const md = await requestUrl({ url: this.exportUrl(entry.spaceId, entry.moduleIds), headers: this.headers });
      this.writingBack = true;
      try { await this.app.vault.modify(file, md.text); } finally { this.writingBack = false; }
      entry.lastSyncAt = Date.now();
      entry.lastHash = hash(md.text);
      await this.saveSettings();
      this.refreshPanel();
      new Notice(`Graphite: pushed "${entry.spaceName ?? path}" and canonicalized.`);
    } catch (e) {
      new Notice(`Graphite: push failed — ${e}`);
    }
  }

  /** Local state of a tracked file, no network involved. */
  async fileState(path: string): Promise<'in-sync' | 'local-edits' | 'missing'> {
    const entry = this.settings.files[path];
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return 'missing';
    const content = await this.app.vault.read(file);
    return hash(content) === entry?.lastHash ? 'in-sync' : 'local-edits';
  }

  /** On-demand server check: has the space changed since our last sync? */
  async serverState(path: string): Promise<'server-changed' | 'server-unchanged' | 'error'> {
    const entry = this.settings.files[path];
    if (!entry) return 'error';
    try {
      const md = await requestUrl({ url: this.exportUrl(entry.spaceId, entry.moduleIds), headers: this.headers });
      return hash(md.text) === entry.lastHash ? 'server-unchanged' : 'server-changed';
    } catch {
      return 'error';
    }
  }

  async forget(path: string) {
    delete this.settings.files[path];
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
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
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
      cls: 'lp-picker-hint',
    });
    for (const m of this.modules) {
      new Setting(contentEl)
        .setName(m.name)
        .setDesc(m.type.toLowerCase().replace(/_/g, ' '))
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
    this.contentEl.addClass('lp-sync-view');
    await this.plugin.checkConnection(false); // triggers render via refreshPanel
    this.render();
  }

  render() {
    const el = this.contentEl;
    el.empty();

    // ── Header + actions ──────────────────────────────────────────────
    const head = el.createDiv({ cls: 'lp-sync-head' });
    head.createEl('h4', { text: 'Graphite sync' });
    const actions = head.createDiv({ cls: 'lp-sync-actions' });
    actions.createEl('button', { text: 'Pull a space…' })
      .addEventListener('click', () => void this.plugin.chooseAndPull());
    actions.createEl('button', { text: 'Refresh' })
      .addEventListener('click', () => void this.plugin.checkConnection(false));

    // ── Connection ────────────────────────────────────────────────────
    const conn = el.createDiv({ cls: 'lp-sync-section' });
    conn.createEl('div', { text: 'CONNECTION', cls: 'lp-sync-label' });
    const me = this.plugin.lastMe;
    const health = this.plugin.lastHealth;
    if (!this.plugin.settings.serverUrl || !this.plugin.settings.token) {
      conn.createDiv({ text: 'Not configured — set the server URL and API token in the plugin settings.', cls: 'lp-sync-bad' });
    } else if (me) {
      conn.createDiv({ text: `🟢 Connected as ${me.name ?? me.email} · ${this.plugin.settings.serverUrl}` });
      conn.createDiv({ text: `Server version ${health?.version ?? 'unknown'}`, cls: 'lp-sync-dim' });
    } else {
      conn.createDiv({ text: `🔴 Not connected · ${this.plugin.settings.serverUrl}`, cls: 'lp-sync-bad' });
      conn.createDiv({ text: 'Use Refresh (or fix the token in settings).', cls: 'lp-sync-dim' });
    }

    // ── Synced files ──────────────────────────────────────────────────
    const filesSec = el.createDiv({ cls: 'lp-sync-section' });
    filesSec.createEl('div', { text: 'SYNCED FILES', cls: 'lp-sync-label' });
    const paths = Object.keys(this.plugin.settings.files);
    if (paths.length === 0) {
      filesSec.createDiv({ text: 'Nothing synced into this vault yet — use "Pull a space…".', cls: 'lp-sync-dim' });
    }
    for (const path of paths) {
      const entry = this.plugin.settings.files[path];
      const row = filesSec.createDiv({ cls: 'lp-sync-row' });
      const top = row.createDiv({ cls: 'lp-sync-row-top' });
      top.createEl('b', { text: entry.spaceName ?? entry.spaceId });
      const stateEl = top.createEl('span', { text: '…', cls: 'lp-sync-state' });
      const scope = entry.moduleIds?.length
        ? ` · ${entry.moduleIds.length}${entry.moduleCount ? `/${entry.moduleCount}` : ''} modules`
        : ' · whole space';
      row.createDiv({ text: `${path} · synced ${relTime(entry.lastSyncAt)}${scope}`, cls: 'lp-sync-dim' });
      void this.plugin.fileState(path).then((s) => {
        stateEl.setText(
          s === 'in-sync' ? '✓ in sync' :
          s === 'local-edits' ? '● local edits' : '⚠ file missing');
        stateEl.addClass(`lp-state-${s}`);
      });
      const btns = row.createDiv({ cls: 'lp-sync-row-btns' });
      const mk = (label: string, fn: () => void) =>
        btns.createEl('button', { text: label }).addEventListener('click', fn);
      mk('Pull', () => void this.plugin.pullSpace({ id: entry.spaceId, name: entry.spaceName ?? path.replace(/\.md$/, '') }));
      mk('Push', () => void this.plugin.pushFile(path));
      mk('Check server', () => void this.plugin.serverState(path).then((s) => {
        new Notice(
          s === 'server-changed' ? 'Server has NEW changes since your last sync — Pull to get them.' :
          s === 'server-unchanged' ? 'Server matches your last sync.' :
          'Could not reach the server.');
      }));
      mk('Forget', () => void this.plugin.forget(path));
    }

    // ── How this sync works ───────────────────────────────────────────
    const how = el.createDiv({ cls: 'lp-sync-section' });
    how.createEl('div', { text: 'HOW THIS SYNC WORKS', cls: 'lp-sync-label' });
    const auto = this.plugin.settings.autoPush;
    const ul = how.createEl('ul', { cls: 'lp-sync-how' });
    for (const line of [
      `Mode: ${auto ? 'AUTO-PUSH — tracked files push ~2.5s after you stop editing.' : 'MANUAL — you decide when to Pull and Push (auto-push can be enabled in settings).'}`,
      'Pull writes the server’s canonical export of a space into this vault as one .md file.',
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
    new Setting(containerEl)
      .setName('Server URL')
      .setDesc('e.g. https://graphite.omaryazeedi.com')
      .addText((t) => t.setValue(this.plugin.settings.serverUrl).onChange(async (v) => {
        this.plugin.settings.serverUrl = v.trim();
        await this.plugin.saveSettings();
      }));
    new Setting(containerEl)
      .setName('API token')
      .setDesc('Generate one in the app: Settings → Where am I signed in? → Generate API token.')
      .addText((t) => t.setValue(this.plugin.settings.token).onChange(async (v) => {
        this.plugin.settings.token = v.trim();
        await this.plugin.saveSettings();
      }));
    new Setting(containerEl)
      .setName('Connection')
      .setDesc('Verifies the URL + token against the server and shows who you are signed in as.')
      .addButton((b) => b.setButtonText('Test connection').setCta().onClick(async () => {
        await this.plugin.checkConnection(true);
      }));
    new Setting(containerEl)
      .setName('Auto-push on save')
      .setDesc('Push tracked files ~2.5s after you stop editing. Off = manual pushes only.')
      .addToggle((t) => t.setValue(this.plugin.settings.autoPush).onChange(async (v) => {
        this.plugin.settings.autoPush = v;
        await this.plugin.saveSettings();
        this.plugin.refreshPanel();
      }));
  }
}
