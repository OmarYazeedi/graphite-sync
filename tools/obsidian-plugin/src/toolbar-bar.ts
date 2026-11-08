/* ══ THE GRAPHITE BAR · THE ROW ITSELF ═════════════════════════════════════
 *
 * Omar, 2026-11-07: "okay the full set is approved" — BarDesktop and
 * BarTablet. A row of buttons above (or, on a phone or tablet, below) a note
 * that is NOT a synced Graphite file. It is drawn in Obsidian's own colours
 * and every button is also a registered command (`lp-bar-*`), so a phone's
 * own mobile toolbar can hold the same actions.
 *
 * The row only DRAWS. What a button does is the plugin's: it is handed the
 * editor of the pane the row belongs to, so a bar in a split pane writes into
 * its own note, not into whichever pane has the cursor.
 *
 * PURE: no `obsidian`. The plugin's suite drives it through the bundle.
 */

export interface BarButton {
  /** The command id (`lp-bar-<id>`) and the button's key. */
  id: string;
  label: string;
  /** An Obsidian (Lucide) icon name. */
  icon: string;
  /** The accent-coloured button: the one that starts something. */
  primary?: boolean;
  /** Pushed to the right edge, apart from the writing buttons. */
  right?: boolean;
  /** Needs a server (or a PC to say so): Capture now. */
  needsServer?: boolean;
}

/** In the order BarDesktop draws them. */
export const BAR_BUTTONS: readonly BarButton[] = [
  { id: 'start-list', label: 'Start a list', icon: 'list-plus', primary: true },
  { id: 'task', label: 'Task', icon: 'square' },
  { id: 'due', label: 'Due', icon: 'calendar' },
  { id: 'assign', label: 'Assign', icon: 'user' },
  { id: 'priority', label: 'Priority', icon: 'flag' },
  { id: 'tag', label: 'Tag', icon: 'tag' },
  { id: 'send-to', label: 'Send to', icon: 'arrow-right' },
  { id: 'capture-now', label: 'Capture now', icon: 'refresh-cw', right: true, needsServer: true },
];

/** The smallest a target may be on a phone or tablet, in CSS pixels. */
export const MOBILE_TARGET_PX = 44;

/** Should a note get the bar? Not when it is switched off, not in a synced
 *  Graphite file (its lines are records the app owns), not in the plugin's
 *  own files, and not in anything but a note. */
export function barWanted(opts: {
  on: boolean; path: string | null | undefined; synced: boolean; own: boolean;
}): boolean {
  return opts.on && !!opts.path && /\.md$/i.test(opts.path) && !opts.synced && !opts.own;
}
