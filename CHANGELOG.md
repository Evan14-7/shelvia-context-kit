# Changelog

All notable changes to Shelvia Context Kit are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project aims to follow [Semantic Versioning](https://semver.org/) once it
reaches 1.0. Until then, `0.x` releases may change the pack shape; each pack
declares the `spec_version` it targets.

## [1.0.0] - 2026-07-09

The repo is now a working toolkit, not just a spec. Everything previously listed
as a v0.2 / v0.3 / v0.4 roadmap item is implemented and tested.

### Added
- `@shelvia/context-pack` npm package (TypeScript, ESM).
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

[1.0.0]: https://github.com/Evan14-7/shelvia-context-kit/releases/tag/v1.0.0
[0.1.0]: https://github.com/Evan14-7/shelvia-context-kit/releases/tag/v0.1.0
