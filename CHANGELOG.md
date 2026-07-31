# Changelog

All notable changes to Shelvia Context Kit are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
package follows [Semantic Versioning](https://semver.org/). Note that the npm
**package** version and the Context Pack **`spec_version`** track different
things: the package version tracks the toolkit; `spec_version` (currently `0.1`)
tracks the portable file format, which each pack declares.

## [1.0.1] - 2026-07-29

### Fixed
- `spec_version` is now enforced (`const "0.1"`) — unknown versions are rejected instead of silently validating.
- CLI: `export --target <t> <file>` no longer mistakes the target value for the filename; the file and `--target` are parsed independently (and `--target=<t>` is accepted).
- CLI wrapper sets `process.exitCode` instead of calling `process.exit()`, so a large render/export is fully flushed and never truncated.
- Markdown link labels and destinations are now escaped so a hostile source label/URL can't break out of the link (no-op on clean input).

### Added
- `validateAndExportPack(input, target)` — validate then export in one call, the safe entry point for JS callers (throws a readable error on invalid input).
- Schema `minLength` on required text (evidence claim, recommendation reason, version label/status) so structurally valid but empty content is rejected.

## [1.0.0] - 2026-07-09

The repo is now a working toolkit, not just a spec. Everything previously listed
as a v0.2 / v0.3 / v0.4 roadmap item is implemented and tested.

### Added
- `@shelviahq/context-pack` npm package (TypeScript, ESM).
- TypeScript types for `ContextPack` and its sub-objects (`src/types.ts`).
- `validateContextPack()` — schema-backed validation with clear, path-anchored
  errors (`src/validate.ts`).
- `renderMarkdown()` — the neutral full-pack Markdown renderer (`src/render.ts`).
- Exporters for ChatGPT, Claude, Cursor, and Codex (`src/exporters/*`), plus an
  `exportPack(pack, target)` dispatcher.
- A CLI: `shelvia-context-pack validate | render | export` (`bin/cli.mjs` +
  `src/cli.ts`), exiting non-zero on validation failure.
- A test suite on Node's built-in runner (`test/`), and a second worked example
  (`examples/software-project/context-pack.json`).
- `docs/exporters.md`.
- CI now builds, tests, and validates every example against the shipped
  validator on each push.

### Changed
- `validate:examples` now uses the package's own `validateContextPack()` (it
  dogfoods the shipped code path instead of a separate ajv call).

## [0.1.0] - 2026-07-07

### Added
- Context Pack JSON Schema (`schema/context-pack.schema.json`, draft-07,
  `spec_version` 0.1).
- Markdown templates: `project-summary`, `decisions`, `sources`, `next-steps`,
  `risks`, and a full `handoff` template.
- A worked example: `examples/basic/context-pack.json` and its rendered
  `examples/basic/handoff.md`.
- Documentation: `docs/format.md` (the spec) and
  `docs/relationship-to-shelvia.md` (positioning vs the hosted product).
- Dependency-light checks: `npm run check:json` (zero-dependency JSON parse) and
  `npm run validate:examples` (schema validation via `ajv`).
- Repository hygiene: `README`, `LICENSE` (MIT), `CONTRIBUTING`,
  `SECURITY`, and this changelog.

[1.0.1]: https://github.com/Evan14-7/shelvia-context-kit/releases/tag/v1.0.1
[1.0.0]: https://github.com/Evan14-7/shelvia-context-kit/releases/tag/v1.0.0
[0.1.0]: https://github.com/Evan14-7/shelvia-context-kit/releases/tag/v0.1.0
