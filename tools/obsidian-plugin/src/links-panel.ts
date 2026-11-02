/* ══ REGISTER 2519 — THE LINKS PANEL AND THE ROLE-FIRST PICKER, IN OBSIDIAN ══
 *
 * The Obsidian half of links.ts: a side panel that shows the link log of
 * the record under the cursor, and a picker that asks for the TYPE first
 * and then the target (R-1159: "first show available link types then it
 * should show the modules"), in Obsidian's own suggest modal.
 *
 * The first step of the picker asks no server: its list is the bundled
 * link-grammar. The second asks for the targets the chosen type can reach,
 * the third for the records in the chosen module (unless the targets came
 * with them), and committing writes the link. Nothing here decides whether
 * a link is legal — the server refuses what it refuses, and the refusal is
 * said in its own words.
 *
 * Kept out of main.ts so the plugin's entry file only wires it in.
 */

import { App, FuzzySuggestModal, ItemView, Notice, WorkspaceLeaf, requestUrl } from 'obsidian';
import {
  LinkLogFeed, RecordRef, RoleChoice, TargetGroup, linkSentence, pickerRoles,
  readRows, readTargets,
} from './links';
import MODULE_NAMES from '../../../apps/api/src/spaces/module-names.json';

export const LINKS_VIEW = 'graphite-links';

/** What the panel and the picker need from the plugin. */
export interface LinksHost {
  app: App;
  api(path: string): string;
  readonly headers: Record<string, string>;
  feed: LinkLogFeed;
  /** The sentence an out-of-date plugin says, or null. */
  outdatedNote(): string | null;
  writeAllowed(what: string, loud?: boolean): Promise<boolean>;
  linksViews: Set<LinksView>;
  /** Ask the feed about wherever the cursor is now. */
  nudgeLinks(): void;
}

const typeName = (t: string | null) =>
  (t && (MODULE_NAMES as Record<string, { name: string }>)[t]?.name) || t || '';

export class LinksView extends ItemView {
  constructor(leaf: WorkspaceLeaf, private host: LinksHost) {
    super(leaf);
  }
  getViewType() { return LINKS_VIEW; }
  getDisplayText() { return 'Graphite links'; }
  getIcon() { return 'link'; }

  async onOpen() {
    this.contentEl.addClass('gr-links-view');
    this.host.linksViews.add(this);
    // CONDITION 1: the feed asks for nothing until a panel is open.
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
    el.createEl('h4', { text: 'Links' });
    const outdated = this.host.outdatedNote();
    if (outdated) el.createDiv({ text: outdated, cls: 'gr-links-bad' });

    const s = this.host.feed.state();
    if (!s.spot) {
      el.createDiv({ text: 'Move the cursor onto a line to see what it is linked to.', cls: 'gr-links-dim' });
      return;
    }
    if (!('rec' in s.spot)) {
      el.createDiv({ text: s.spot.none, cls: 'gr-links-dim' });
      return;
    }
    const rec = s.spot.rec;
    const head = el.createDiv({ cls: 'gr-links-head' });
    head.createSpan({ text: rec.words || rec.id, cls: 'gr-links-record' });
    head.createEl('button', { text: 'Link…' })
      .addEventListener('click', () => pickLink(this.host, rec));

    if (s.loading) {
      el.createDiv({ text: 'Reading the link log…', cls: 'gr-links-dim' });
      return;
    }
    if (!s.log) {
      el.createDiv({ text: `Could not read the link log: ${s.error ?? 'no answer'}.`, cls: 'gr-links-bad' });
      return;
    }
    if (s.refreshing) el.createDiv({ text: 'Refreshing…', cls: 'gr-links-dim' });
    if (s.error) el.createDiv({ text: `Could not refresh: ${s.error}. Showing what was read before.`, cls: 'gr-links-bad' });
    if (!s.log.total) {
      el.createDiv({ text: 'Nothing is linked to this yet.', cls: 'gr-links-dim' });
      return;
    }
    for (const g of s.log.modules) {
      const box = el.createDiv({ cls: 'gr-links-group' });
      box.createDiv({
        text: g.name ? `${g.name}${g.type ? ` · ${typeName(g.type)}` : ''}` : (g.kind ?? 'Elsewhere'),
        cls: 'gr-links-module',
      });
      for (const l of g.links) {
        box.createDiv({ text: linkSentence(l), cls: l.other.binned ? 'gr-links-row gr-links-binned' : 'gr-links-row' });
      }
    }
  }
}

/** One step of the picker: a list, Obsidian's fuzzy filter over it. */
class StepModal<T> extends FuzzySuggestModal<T> {
  constructor(
    app: App, placeholder: string, private items: T[],
    private text: (t: T) => string, private onPick: (t: T) => void,
  ) {
    super(app);
    this.setPlaceholder(placeholder);
  }
  getItems() { return this.items; }
  getItemText(t: T) { return this.text(t); }
  onChooseItem(t: T) { this.onPick(t); }
}

/** STEP ONE — the types this record may take. Computed on the device from
 *  the bundled grammar: no request leaves Obsidian until a type is chosen. */
export function pickLink(host: LinksHost, rec: RecordRef) {
  const roles = pickerRoles(rec.kind);
  if (!roles.length) {
    new Notice('Graphite: nothing can be linked from this kind of record.');
    return;
  }
  new StepModal<RoleChoice>(host.app, `Link “${rec.words || rec.id}” as…`, roles,
    (r) => r.label, (r) => void chooseTarget(host, rec, r)).open();
}

/** STEP TWO — where the chosen type can reach. The server knows which real
 *  modules a person may link into; the device does not. */
async function chooseTarget(host: LinksHost, rec: RecordRef, role: RoleChoice) {
  const res = await requestUrl({
    url: host.api(`/records/${rec.kind}/${encodeURIComponent(rec.id)}/link-targets?role=${encodeURIComponent(role.role)}`),
    headers: host.headers, throw: false,
  }).catch(() => null);
  const groups = res && res.status < 300 ? readTargets(res.json) : null;
  if (!groups) {
    new Notice(`Graphite: could not ask where “${role.label}” can reach${res ? ` (${res.status})` : ''}.`);
    return;
  }
  if (!groups.length) {
    new Notice('Graphite: nowhere to link this yet — no module holds one.');
    return;
  }
  new StepModal<TargetGroup>(host.app, `${role.label}… which module?`, groups,
    (g) => g.moduleName ? `${g.moduleName}${g.spaceName ? ` · ${g.spaceName}` : ''}` : g.label,
    (g) => void chooseRecord(host, rec, role, g)).open();
}

/** STEP THREE — the record itself. */
async function chooseRecord(host: LinksHost, rec: RecordRef, role: RoleChoice, g: TargetGroup) {
  let rows = g.records ?? null;
  if (!rows) {
    // A person or a space is in no module; everything else is. The same
    // two paths the app reads (attributes_sheet).
    const path = g.moduleId ? `/modules/${g.moduleId}/${g.kind}` : `/${g.kind}`;
    const res = await requestUrl({ url: host.api(path), headers: host.headers, throw: false }).catch(() => null);
    rows = res && res.status < 300 ? readRows(res.json) : null;
    if (!rows) {
      new Notice(`Graphite: could not read what is in ${g.moduleName ?? g.label}${res ? ` (${res.status})` : ''}.`);
      return;
    }
  }
  const choices = rows.filter((r) => !(r.id === rec.id && g.kind === rec.kind));
  if (!choices.length) {
    new Notice(`Graphite: nothing in ${g.moduleName ?? g.label} to link to yet.`);
    return;
  }
  new StepModal(host.app, `${role.label}…`, choices, (r) => r.label,
    (r) => void writeLink(host, rec, role, g.kind, r)).open();
}

/** COMMIT — the one write. */
export async function writeLink(
  host: LinksHost, rec: RecordRef, role: RoleChoice, toKind: string, to: { id: string; label: string },
) {
  if (!(await host.writeAllowed('linked'))) return;
  const res = await requestUrl({
    url: host.api('/links'), method: 'POST', contentType: 'application/json',
    body: JSON.stringify({ fromKind: rec.kind, fromId: rec.id, toKind, toId: to.id, role: role.role }),
    headers: host.headers, throw: false,
  }).catch(() => null);
  if (!res || res.status >= 300) {
    const why = (res?.json as { message?: unknown } | undefined)?.message;
    new Notice(`Graphite: the link was not made${res ? ` (${res.status})` : ''}${why ? ` — ${String(why)}` : ''}.`, 10000);
    return;
  }
  new Notice(`Graphite: linked — ${role.label}: ${to.label}.`);
  host.feed.invalidate(rec);
}
