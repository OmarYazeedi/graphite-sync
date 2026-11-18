// The part of the validators table that needs no framework.
//
// shared/validators.ts imports NestJS and class-validator for its decorators,
// and anything that imports it brings them along. The Obsidian plugin bundles a
// few of this folder's pure modules (task-vocabulary.ts among them) into one
// browser file, and a bundle that reaches NestJS cannot be built: it wants
// Node's `stream` and `util`. So the patterns a pure module needs live here,
// with nothing imported, and validators.ts re-exports them - the table is still
// read from one place (validators-census.spec holds that no other file spells
// the pattern).

/// A tin swatch spelled as a hex colour: #rrggbb.
export const HEX_COLOUR_RE = /^#[0-9a-fA-F]{6}$/;
