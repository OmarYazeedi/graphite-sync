/* ══ THE GRAPHITE BAR · DRAWING THE ROW ════════════════════════════════════
 *
 * BarDesktop and BarTablet, approved by Omar on 2026-11-07. This draws the
 * buttons toolbar-bar.ts lists into an element and hands each press to the
 * plugin. It follows Obsidian's theme through its CSS variables (styles.css,
 * `.gr-bar`), so the row looks like part of the vault it sits in; on a phone or
 * tablet the targets are 44px or more and the row sits below the note, where a
 * thumb is.
 *
 * A press runs the pane's OWN editor, so a bar in a split pane writes into its
 * own note. `mousedown` is cancelled so pressing a button does not take focus
 * from the editor and lose the cursor the button is about to write at.
 */

import { Editor, TFile, setIcon } from 'obsidian';
import { BAR_BUTTONS } from './toolbar-bar';

export interface BarPane {
  editor: Editor;
  /** 'source', 'preview' — a bar writes into an editor, not a rendered note. */
  getMode?: () => string;
  /** The note this pane shows, so a press acts on its own note. */
  file?: () => TFile | null;
}

export interface BarHost {
  mobile: boolean;
  /** Run the command behind a button against this pane. */
  run(id: string, pane: BarPane): void | Promise<void>;
}

export function drawBar(parent: HTMLElement, pane: BarPane, host: BarHost): HTMLElement {
  const bar = parent.createDiv({
    cls: host.mobile ? 'gr-bar gr-bar-mobile' : 'gr-bar',
    attr: { role: 'toolbar', 'aria-label': 'Graphite' },
  });
  bar.createSpan({ text: 'GRAPHITE', cls: 'gr-bar-brand' });
  for (const b of BAR_BUTTONS) {
    const btn = bar.createEl('button', {
      cls: ['gr-bar-btn', b.primary ? 'gr-bar-primary' : '', b.right ? 'gr-bar-right' : ''].filter(Boolean).join(' '),
      attr: { type: 'button', 'aria-label': b.label },
    });
    btn.dataset.id = b.id;
    setIcon(btn.createSpan({ cls: 'gr-bar-icon' }), b.icon);
    btn.createSpan({ text: b.label, cls: 'gr-bar-label' });
    btn.addEventListener('mousedown', (e: Event) => e?.preventDefault?.());
    btn.addEventListener('click', (e: Event) => {
      e?.preventDefault?.();
      void host.run(b.id, pane);
    });
  }
  return bar;
}
