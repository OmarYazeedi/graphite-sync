# Graphite Sync for Obsidian

Two-way bridge between your Obsidian vaults and a self-hosted **Graphite**
(Life Planner) server. Pull any of your Spaces into a vault as clean
Markdown, edit it like any other note, and push it back through a
validate-first merge — nothing ever half-lands.

## Features

- **Pull a Space as Markdown** — one command turns any Space (tasks, notes,
  calendar, expenses, checklists, and 15+ other module types) into a single
  server-canonical `.md` file in your vault.
- **Pick the destination vault** — pulling asks *which vault* the Space
  lands in. Route different Spaces to different local vaults; the target
  vault's plugin is configured automatically so it can push and pull on its
  own from then on.
- **Validate-first push** — edits go through the server's merge importer.
  Errors come back with line numbers and *nothing* is written; on success
  the file is rewritten to the server's canonical form, so vault and app
  never drift.
- **Sync panel** — a sidebar view with your connection status (who you're
  signed in as, server version), and every synced file with its live state:
  `✓ in sync`, `● local edits`, or `⚠ file missing` — plus per-file
  **Pull / Push / Check server / Forget** actions.
- **Check server** — one click tells you whether a Space changed on the
  server since your last sync, before you decide to pull or push.
- **Selective sync** *(optional)* — a second pull command lets you tick
  exactly which modules travel into the file. Unticked modules never enter
  the vault, and pushes never touch them.
- **Auto-push on save** *(optional, off by default)* — tracked files push a
  couple of seconds after you stop typing.
- **Status bar + test button** — a permanent connection indicator, and a
  one-click "Test connection" in settings that tells you exactly why a
  token or URL doesn't work.
- **Freeform notes survive sync** — every pulled file has a marked region
  the sync never regenerates: your own prose lives alongside the mirrored
  data and is kept across pulls and pushes.
- **Native tags** — record tags arrive as `#slug` tokens, so Obsidian's
  tag pane reads your Graphite data natively.
- **Any number of Spaces, any number of vaults** — every vault keeps its
  own server, token, and file mappings, fully independent.

## Requirements

[Graphite](https://findgraphite.com) is a self-hostable life/work planner (spaces of
tasks, notes, calendars, expenses and more) with Markdown export/import at
its core. This plugin is its Obsidian bridge.

- A running Graphite (Life Planner) server you control.
- An **API token**: in the app go to *Settings → Where am I signed in? →
  Generate API token*, and paste it into the plugin settings together with
  your server URL. Tokens are listed and revocable in the app at any time.

## Quick start

1. Install and enable the plugin, open its settings.
2. Enter your server URL and an API token, hit **Test connection**.
3. Run **Pull a space (pick destination vault)** from the command palette
   (or the ribbon icon → *Pull a space…*).
4. Edit the pulled file, then **Push the current file back** — or switch on
   auto-push and forget about it.

## How the sync works

Pull writes the server's canonical export of a Space into the vault. Push
sends your edited file through a validate-first merge: the server only
touches records present in the file (absence never deletes — deletions are
explicit), and on success the file is canonicalized back. The sync panel's
state badges are computed from content hashes, so "in sync" means the file
is byte-identical to the last agreed state.

## Security notes

- The API token is stored in the vault's plugin data (`data.json`), like
  other Obsidian plugin credentials — treat shared vault folders
  accordingly, and revoke tokens from the app whenever in doubt.
- The plugin talks only to the server URL you configure. No third-party
  services, no telemetry.

## Development

```
npm install
npm run build
```

Copy `manifest.json`, `main.js` and `styles.css` into
`<vault>/.obsidian/plugins/<plugin-id>/` and enable the plugin.
