/* ══ THE GRAPHITE BAR · THE PICKERS' SURFACES ══════════════════════════════
 *
 * Omar, 2026-11-07: "okay the full set is approved". Two surfaces, one list:
 * on a phone or tablet a picker is a bottom sheet (large targets, one hand),
 * on a desktop it is a small popover at the cursor. Both are an Obsidian
 * Modal, so Escape, a tap outside and focus all behave as they do everywhere
 * else in Obsidian; only the placement differs (styles.css, `.gr-sheet-*`).
 *
 * The surfaces choose nothing and write nothing. They hold a state, draw it,
 * and hand the choice to the caller, which writes it onto the line with
 * toolbar-lines.ts. Their state is reachable by method (`choose`, `pickDate`)
 * so the suite can drive a picker without a pointer.
 *
 * The colours are Obsidian's own variables, so the bar and its pickers follow
 * whatever theme the vault wears.
 */

import { App, Modal } from 'obsidian';
import {
  DUE_TIMES, dayLabel, dueChips, dueValue, monthGrid, monthTitle, shiftMonth, validTime,
} from './toolbar-due';

/** Where a popover opens, in client pixels; absent on a phone or when the
 *  editor cannot say. */
export interface Anchor { x: number; y: number }

abstract class BarModal extends Modal {
  constructor(app: App, protected mobile: boolean, private anchor: Anchor | null) {
    super(app);
  }

  /** Called by Obsidian when the modal opens. */
  onOpen() {
    const m: any = this.modalEl;
    m?.addClass?.('gr-sheet');
    m?.addClass?.(this.mobile ? 'gr-sheet-bottom' : 'gr-sheet-pop');
    if (this.mobile) m?.addClass?.('gr-mobile');
    (this.containerEl as any)?.addClass?.(this.mobile ? 'gr-sheet-container' : 'gr-pop-container');
    if (!this.mobile && this.anchor && m?.style) {
      m.style.left = `${Math.max(8, this.anchor.x)}px`;
      m.style.top = `${Math.max(8, this.anchor.y)}px`;
    }
    this.draw();
  }

  /** Draw the state into contentEl again — the surface is small, so it is
   *  redrawn whole after every change. */
  protected redraw() {
    this.contentEl.empty();
    this.draw();
  }

  abstract draw(): void;
}

/** A button a picker draws: `data` is whatever the caller wants back. */
function button(parent: HTMLElement, text: string, cls: string, onClick: () => void): HTMLElement {
  const b = parent.createEl('button', { text, cls });
  b.addEventListener('click', onClick);
  return b;
}

/* ══ A LIST YOU CHOOSE FROM ═════════════════════════════════════════════ */

export interface PickItem<T> {
  /** What the row says. */
  label: string;
  /** Small text on the right: "you", "default", "this note's space". */
  hint?: string;
  /** A colour for a person's initial. */
  color?: string | null;
  /** A heading the row sits under; rows with the same group are adjacent. */
  group?: string;
  /** Shown but not choosable, with `hint` saying why ("later"). */
  disabled?: boolean;
  /** Plain explanation under the label. */
  detail?: string;
  data: T;
}

export interface PickOptions<T> {
  title: string;
  items: PickItem<T>[];
  /** Show a filter box, narrowing the rows by the words typed. */
  filter?: boolean;
  /** A row offered for the text typed when nothing in the list is it: the tag
   *  picker's `+ New tag "h…"`. Null for no row. */
  extra?: (query: string) => PickItem<T> | null;
  /** The line that says what choosing writes: "Writes | priority: high". */
  writes?: (item: PickItem<T>, footer: string) => string;
  /** Words under the list, such as the heading a new list is given. */
  footer?: { label: string; value: string; onChange: (v: string) => void };
  /** The row to start on. */
  start?: (item: PickItem<T>) => boolean;
  onChoose: (item: PickItem<T>) => void;
}

export class PickModal<T> extends BarModal {
  query = '';
  active = 0;
  footerValue: string;

  constructor(app: App, mobile: boolean, anchor: Anchor | null, private opts: PickOptions<T>) {
    super(app, mobile, anchor);
    this.footerValue = opts.footer?.value ?? '';
    const start = opts.items.findIndex((i) => !i.disabled && (opts.start?.(i) ?? false));
    this.active = Math.max(0, start);
  }

  /** The rows now showing: the list narrowed by what is typed, then the
   *  offered extra row. */
  rows(): PickItem<T>[] {
    const terms = this.query.toLowerCase().split(/\s+/).filter(Boolean);
    const shown = this.opts.items.filter((i) => {
      const hay = `${i.label} ${i.detail ?? ''}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
    const extra = this.query.trim() ? this.opts.extra?.(this.query) : null;
    return extra ? [...shown, extra] : shown;
  }

  setQuery(q: string) {
    this.query = q;
    this.active = Math.max(0, this.rows().findIndex((r) => !r.disabled));
  }

  /** Choose a row: Enter, a tap, or a test. A disabled row chooses nothing. */
  choose(item: PickItem<T>) {
    if (item.disabled) return;
    this.close();
    this.opts.onChoose(item);
  }

  setFooter(v: string) {
    this.footerValue = v;
    this.opts.footer?.onChange(v);
    this.showWrites();
  }

  /** Enter and the arrows, from anywhere in the modal. */
  private key(e: KeyboardEvent) {
    const rows = this.rows().filter((r) => !r.disabled);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!rows.length) return;
      e.preventDefault();
      const all = this.rows();
      let at = this.active;
      do { at = (at + (e.key === 'ArrowDown' ? 1 : -1) + all.length) % all.length; } while (all[at].disabled);
      this.active = at;
      this.redraw();
    } else if (e.key === 'Enter') {
      const row = this.rows()[this.active];
      if (row && !row.disabled) { e.preventDefault(); this.choose(row); }
    }
  }

  draw() {
    const root = this.contentEl.createDiv({ cls: 'gr-pick' });
    (root as any).addEventListener('keydown', (e: KeyboardEvent) => this.key(e));
    root.createDiv({ text: this.opts.title, cls: 'gr-pick-title' });
    if (this.opts.filter) {
      const input = root.createEl('input', { cls: 'gr-pick-filter', attr: { type: 'text', 'aria-label': 'Filter', value: this.query } }) as HTMLInputElement;
      input.addEventListener('input', () => { this.setQuery(input.value); this.redrawList(); });
      window.setTimeout(() => input.focus?.(), 0);
    }
    this.listEl = root.createDiv({ cls: 'gr-pick-list' });
    this.redrawList();
    if (this.opts.footer) {
      const foot = root.createDiv({ cls: 'gr-pick-footer' });
      foot.createSpan({ text: this.opts.footer.label, cls: 'gr-pick-hint' });
      const f = foot.createEl('input', { cls: 'gr-pick-words', attr: { type: 'text', 'aria-label': this.opts.footer.label, value: this.footerValue } }) as HTMLInputElement;
      f.addEventListener('input', () => this.setFooter(f.value));
      foot.createSpan({ text: 'Enter to insert', cls: 'gr-pick-hint gr-pick-right' });
    }
    if (this.opts.writes) this.writesEl = root.createDiv({ cls: 'gr-pick-writes' });
    this.showWrites();
  }

  private listEl: HTMLElement | null = null;

  private redrawList() {
    const list = this.listEl;
    if (!list) return;
    list.empty();
    let group: string | undefined;
    this.rows().forEach((item, n) => {
      if (item.group !== undefined && item.group !== group) {
        group = item.group;
        list.createDiv({ text: group, cls: 'gr-pick-group' });
      }
      const row = button(list, '', `gr-pick-row${n === this.active ? ' is-active' : ''}${item.disabled ? ' is-disabled' : ''}`, () => this.choose(item));
      if (item.disabled) row.setAttr?.('disabled', 'true');
      if (item.color !== undefined) {
        const av = row.createSpan({ text: (item.label[0] ?? '?').toUpperCase(), cls: 'gr-pick-avatar' });
        if (item.color && (av as any).style) (av as any).style.background = item.color;
      }
      const body = row.createDiv({ cls: 'gr-pick-body' });
      body.createSpan({ text: item.label, cls: 'gr-pick-label' });
      if (item.detail) body.createDiv({ text: item.detail, cls: 'gr-pick-detail' });
      if (item.hint) row.createSpan({ text: item.hint, cls: 'gr-pick-hint gr-pick-right' });
    });
    this.showWrites();
  }

  private writesEl: HTMLElement | null = null;

  /** What choosing the row now under the cursor would write. */
  private showWrites() {
    const row = this.rows()[this.active];
    this.writesEl?.setText(this.opts.writes && row && !row.disabled ? this.opts.writes(row, this.footerValue) : '');
  }
}

/* ══ THE DUE PICKER ═════════════════════════════════════════════════════ */

export class DueModal extends BarModal {
  onOpen() {
    (this.modalEl as any)?.addClass?.('gr-due-modal');
    super.onOpen();
  }

  date: string | null;
  time: string | null;
  /** The month the calendar shows. */
  private view: { year: number; month: number };

  constructor(
    app: App, mobile: boolean, anchor: Anchor | null,
    private opts: {
      /** The note's day, which the chips count from. */
      noteDay: string;
      /** The words of the line, for the heading. */
      words: string;
      /** The due the line already carries. */
      current: { date: string; time: string | null } | null;
      onSet: (value: string) => void;
    },
  ) {
    super(app, mobile, anchor);
    this.date = opts.current?.date ?? null;
    this.time = opts.current?.time ?? null;
    const at = this.date ?? opts.noteDay;
    this.view = { year: Number(at.slice(0, 4)), month: Number(at.slice(5, 7)) };
  }

  pickDate(date: string) {
    this.date = date;
    this.view = { year: Number(date.slice(0, 4)), month: Number(date.slice(5, 7)) };
  }

  pickTime(time: string | null): boolean {
    if (time !== null && !validTime(time)) return false;
    this.time = time;
    return true;
  }

  /** What Set writes after `due: `, or null before a day is chosen. */
  value(): string | null {
    return this.date ? dueValue(this.date, this.time) : null;
  }

  set() {
    const v = this.value();
    if (!v) return;
    this.close();
    this.opts.onSet(v);
  }

  draw() {
    const root = this.contentEl.createDiv({ cls: 'gr-pick gr-due' });
    (root as any).addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); this.set(); } });
    const words = this.opts.words.length > 40 ? `${this.opts.words.slice(0, 39)}…` : this.opts.words;
    root.createDiv({
      text: `Due for "${words}". Counted from this note's date, ${dayLabel(this.opts.noteDay)}.`,
      cls: 'gr-pick-title',
    });
    const chips = root.createDiv({ cls: 'gr-chips' });
    for (const c of dueChips(this.opts.noteDay)) {
      const b = button(chips, '', `gr-chip${this.date === c.date ? ' is-on' : ''}`, () => { this.pickDate(c.date); this.redraw(); });
      b.createSpan({ text: c.label, cls: 'gr-chip-label' });
      b.createSpan({ text: c.sub, cls: 'gr-chip-sub' });
    }
    const both = root.createDiv({ cls: 'gr-due-both' });
    this.drawCalendar(both.createDiv({ cls: 'gr-cal' }));
    this.drawTimes(both.createDiv({ cls: 'gr-times' }));
    const foot = root.createDiv({ cls: 'gr-pick-footer' });
    foot.createSpan({ text: 'Writes', cls: 'gr-pick-hint' });
    foot.createSpan({ text: this.value() ? `| due: ${this.value()}` : 'choose a day', cls: 'gr-pick-writes-inline' });
    const set = button(foot, 'Set', 'gr-pick-set mod-cta', () => this.set());
    if (!this.value()) set.setAttr?.('disabled', 'true');
  }

  private drawCalendar(el: HTMLElement) {
    const { year, month } = this.view;
    const head = el.createDiv({ cls: 'gr-cal-head' });
    button(head, '‹', 'gr-cal-nav', () => { this.view = shiftMonth(year, month, -1); this.redraw(); }).setAttr?.('aria-label', 'Previous month');
    head.createSpan({ text: monthTitle(year, month), cls: 'gr-cal-title' });
    button(head, '›', 'gr-cal-nav', () => { this.view = shiftMonth(year, month, 1); this.redraw(); }).setAttr?.('aria-label', 'Next month');
    const grid = el.createDiv({ cls: 'gr-cal-grid' });
    for (const d of ['M', 'T', 'W', 'T', 'F', 'S', 'S']) grid.createSpan({ text: d, cls: 'gr-cal-dow' });
    const pad = (n: number) => String(n).padStart(2, '0');
    for (const week of monthGrid(year, month)) {
      for (const day of week) {
        if (day === null) { grid.createSpan({ cls: 'gr-cal-blank' }); continue; }
        const date = `${year}-${pad(month)}-${pad(day)}`;
        const cls = ['gr-cal-day', date === this.date ? 'is-on' : '', date === this.opts.noteDay ? 'is-today' : '']
          .filter(Boolean).join(' ');
        button(grid, String(day), cls, () => { this.pickDate(date); this.redraw(); });
      }
    }
  }

  private drawTimes(el: HTMLElement) {
    el.createDiv({ text: 'Time', cls: 'gr-cal-title' });
    const on = (t: string | null) => (this.time === t ? ' is-on' : '');
    button(el, 'No time', `gr-time${on(null)}`, () => { this.pickTime(null); this.redraw(); });
    for (const t of DUE_TIMES) button(el, t, `gr-time${on(t)}`, () => { this.pickTime(t); this.redraw(); });
    const other = el.createEl('input', {
      cls: 'gr-time-other',
      attr: { type: 'text', placeholder: 'Other, 15:30', 'aria-label': 'Other time', value: this.time && !(DUE_TIMES as readonly string[]).includes(this.time) ? this.time : '' },
    }) as HTMLInputElement;
    other.addEventListener('change', () => { if (this.pickTime(other.value.trim() || null)) this.redraw(); });
  }
}
