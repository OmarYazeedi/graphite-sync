# Graphite Sync

Graphite Sync connects your Obsidian vaults to a **Graphite** server that you
run yourself. Pull any of your Graphite spaces into a vault as Markdown, edit
them like any other note, and push the changes back through a validate-first
merge: a push either lands completely or changes nothing.

## Features

- **Pull a Space as a folder of notes** — one command turns any Space (tasks,
  notes, calendar, expenses, checklists, and 15+ other module types) into an
  index note plus a note for each module, linked to each other and carrying
  the module’s own tags. This is the default, because it is what makes the
  mirror a vault rather than an archive:

  ```
  Projects/
    Projects.md          index — overview, your prose, links to every module
    Tasks — Backlog.md     one module, one note
    Notes — Journal.md
  ```

- **Or one file per Space** *(Settings → Vault layout)* — the whole Space as
  a single server-canonical `.md`, for a vault kept as an archive rather than
  worked in. Existing notes keep the layout they were pulled with until you
  pull them again.

  Each module note carries the module's own tags as Obsidian properties and
  links back to the index (`space:`), so the graph, backlinks and tag panes
  see your Graphite structure as ordinary vault structure. Every note pushes
  on its own — editing one module never touches another. Rename a module in
  the app and its note is *renamed*, not duplicated; remove a module and its
  note is left alone in the vault, just no longer synced.
- **Pick the destination vault** — pulling asks *which vault* the Space
  lands in. Route different Spaces to different local vaults; the target
  vault's plugin is configured automatically so it can push and pull on its
  own from then on.
- **Validate-first push** *(Push the current file back to Graphite)* — edits go through the server's merge importer.
  Errors come back with line numbers and *nothing* is written; on success
  the file is rewritten to the server's canonical form, so vault and app
  never drift.
- **Sync panel** *(Open the sync panel)* — a sidebar view with your connection status (who you're
  signed in as, server version), and every synced Space with its notes and
  their live state: `✓ in sync`, `● local edits`, or `⚠ file missing` — plus
  **Push / Check** per note and **Pull / Push all / Forget** per Space.
- **Check server** — one click tells you whether a Space changed on the
  server since your last sync, before you decide to pull or push.
- **Selective sync** *(optional)* — a second pull command, *Pull a space into THIS vault, choosing modules*, lets you tick
  exactly which modules travel into the file. Unticked modules never enter
  the vault, and pushes never touch them.
- **Auto-push on save** *(optional, off by default)* — tracked files push a
  couple of seconds after you stop typing.
- **Status bar + test button** — a permanent connection indicator, and a
  one-click "Test connection" in settings (and *Test the server connection* on the palette) that tells you exactly why a
  token or URL doesn't work.
- **Connected devices and servers** *(Settings, at the bottom)* — every
  browser, app and API token signed in to your account, each
  with when the server last saw it in use; and every Graphite server the
  vaults on this computer are set up against, each with when it last
  answered. It is what the servers recorded, not a live view: the plugin
  never shows a device as online or as typing.
- **Freeform notes survive sync** — every pulled note has a marked region
  the sync never regenerates: your own prose lives alongside the mirrored
  data and is kept across pulls and pushes. In the folder layout each module
  note has its own block, so prose sits next to the records it is about.
- **Native tags** — record tags arrive as `#slug` tokens, so Obsidian's
  tag pane reads your Graphite data natively. A module note's own tags are
  its `tags` property: change them in the Properties panel and they reach
  the app on the next push.
- **Records you can link to** — task, reminder, checklist and recipe lines
  carry a block anchor, so any note can link to one
  (`[[Projects/Tasks — Backlog#^…]]`). The index note's **Links** table shows
  how records are joined up, and each end is a real link, so the graph and
  backlinks panes follow them.
- **Links panel** *(Open the links panel)* — a side panel listing the links of
  the record under the cursor. *Link this line to a Graphite record* asks for
  the kind of link first, then the module, then the record, and writes it;
  the server refuses what it does not allow, in its own words.
- **Capture from any note** *(optional, off by default)* — choose a
  **Capture inbox** in settings, then run *Capture tasks from this vault into Graphite*:
  every `- [ ] …` line in a note that is not a synced one becomes a task
  there, with its tags, and the line is marked so capturing again never
  makes it twice. Two more switches, both off by default, capture tagged
  lines that are not tasks — *Capture any tagged line as a note*, and a list
  of tags (`st` takes `#st/IS-07`). Such a line becomes a note in the
  inbox's space. Frontmatter and code blocks are never captured.
- **Create a space from a note** — write a space as markdown (a `# Name`
  heading and `## Module:` sections), run *Create a Graphite space from
  this note*, and it is created in the app and pulled back in as synced
  notes. Nothing is created if the file does not pass the import check —
  the first problem comes back with its line number. Your note is left as
  it is.
- **Add a module** — *Add a module to a Graphite space* asks which space
  (the one the open note is synced to, or a list), which kind of module and
  what to call it. The module is created in the app and its note is pulled
  into the vault.
- **Settings in a note** *(optional, off by default)* — turn on *Keep
  settings in a note* and the settings also live in `Graphite/Sync
  settings.md` as properties: change one there and the settings screen
  follows, and the other way round. To set up another device, copy the note
  into its vault and turn the switch on there. *Write settings to the
  settings note* and *Read settings from the settings note* do either by
  hand. The API token, passwords and the encryption passphrase are never
  written to it.
- **Note sync** *(off by default; being built)* — carries the whole vault
  between devices through a CouchDB server, in place of LiveSync. Every file
  is sealed on the device (AES-GCM-256, under a key derived from a
  passphrase typed on each device) and stored as one document per file in a
  database of its own, so the server holds neither the notes nor their
  names. Changes go up shortly after the vault sits still, and arrive live
  or on *Sync notes now*. A file deleted on another device moves to the
  vault trash; a file changed on two devices keeps both, the other version
  written beside it as a conflict copy, and says so. Hidden files, plugin
  settings and files over 50 MB never travel. Not yet: merging edits that
  do not overlap, and Graphite own sync as the server.
- **One vault, one space and the spaces under it** *(Settings → This
  vault's space)* — each vault has its own identity and is linked to one
  space with its subtree. Anything the vault writes — a push, a capture, a
  new module — lands inside that subtree or is refused, and the notice says
  why. A vault that is not linked yet writes nothing.
- **Route a line with `>>`** — type `>>` anywhere in a line and pick a space
  (or `space / module`) from the list under the cursor; the same list is on
  *Route this line to a Graphite space* and can be bound to a hotkey. The
  cursor decides the scope: a line, a heading's section, or the whole note
  from its properties. *Make these tasks* turns the selected bullets into
  checkboxes.
- **Proposals you approve** — a line written in italics with a proposal
  marker is a suggestion, not yet yours: it is shown washed and labelled
  until you approve it, and nothing is created in Graphite before then.
  Approve with *Approve the proposal on this line*, *Approve every proposal
  in this note*, the panel, or by ticking or un-italicising the line; what
  is created is the line as you left it.
- **A contract for your own agent** *(optional, off by default)* — if you
  use an AI agent of your own to turn prose into proposals, *Publish the
  routing list and agent brief for your agent* writes two notes into the
  vault's `Graphite/` folder: the closed list of spaces, modules and tags it
  may use, and the format it must write. Graphite never sees your notes for
  this; the list is checked again when you approve.
- **Ticks travel both ways** — once a capture inbox is chosen, ticking a
  captured line finishes its task in Graphite, and finishing the task in
  the app ticks the line. Status only: the words and fields are never
  changed. *Sync ticks between this vault and Graphite* runs it on demand.
- **Vault census for the morning sweep** *(optional, off by default)* —
  *Send the vault census to the morning sweep* sends counts and dates only
  (per note: its path, its date, how many task lines are open, done or
  proposed, its tags and links), never a line's words, so the sweep can
  point out to-dos nobody filed and meetings with no note.
- **Any number of Spaces, any number of vaults** — every vault keeps its
  own server, token, and file mappings, fully independent.

## Requirements

- A running Graphite server you control.
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

## Licence

Proprietary - all rights reserved. The source is published so that it can be
read and reviewed; it may not be copied, modified or redistributed. You may
install and run the plugin, unmodified, against a Graphite server you are
entitled to use. See `LICENSE`.

## Disclosures

What the community-plugin policies ask a plugin to say about itself.

- **An account and a server are required.** The plugin is a client for a
  Graphite server and does nothing without one: you need an account on a
  server you control and an API token from it (see *Requirements*). The
  plugin itself is free to install and use, and shows no ads.
- **Network use.** The plugin talks only to servers whose address you type
  into its settings: your **Graphite server**, for every pull, push, check,
  capture, link and the connection test; and, only if you switch on *Note
  sync*, the **CouchDB server** you enter there. It contacts no other host
  and no third-party service. The settings screen can also ask each Graphite
  server your other vaults use whether it is up (`/health`, no token sent).
- **No telemetry.** Nothing about your use of the plugin is collected or sent
  anywhere but your own servers. The optional *vault census* sends counts and
  dates only, never the words of a line, and only to your Graphite server.
- **Files outside your vault (desktop only).** Obsidian keeps a list of your
  vaults in its own application-data folder. The plugin reads that list to
  offer a vault to pull into, and the settings screen reads the server
  address (never the token) from the Graphite Sync settings of your other
  vaults. When *you* choose to pull a space into a different vault, the
  plugin writes the notes there, and a copy of its settings, including your
  server address and API token, into that vault's
  `.obsidian/plugins/graphite-sync/` folder, so that vault can sync by itself.
  It does none of this unless you pick another vault, and none of it on a
  phone.
- **Your API token** is stored in the vault's plugin data (`data.json`), as
  other plugins store theirs. Treat a shared vault folder accordingly, and
  revoke the token in the app whenever in doubt.
- **Source and licence.** The code is not open source: it is published to be
  read and checked, under an all-rights-reserved licence (above). The
  `main.js` in each release is built from the source in this repository, not
  minified or obfuscated, and the plugin never installs or updates itself.

## Building from source

```
cd tools/obsidian-plugin
npm ci
npm run build       # writes main.js
npm run typecheck
```

`main.js` is an esbuild bundle of `src/main.ts`; building it from this source
gives the file attached to the release. The source imports a few shared
grammar files from `apps/api/src/spaces/`, which this repository carries
alongside it for that reason.

## Support

Questions and problems: open an issue in this repository's *Issues* tab.
