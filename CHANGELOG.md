# Changelog

All notable changes to Shelvia Context Kit are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project aims to follow [Semantic Versioning](https://semver.org/) once it
reaches 1.0. Until then, `0.x` releases may change the pack shape; each pack
declares the `spec_version` it targets.

## [Unreleased]

### Planned
- v0.2 — reference validator + TypeScript types (`@shelvia/context-pack`).
- v0.3 — CLI (`validate` | `render` | `export`).
- v0.4 — exporters for Codex / Claude / Cursor / ChatGPT.

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
- Repository hygiene: `README`, `LICENSE` (MIT suggested), `CONTRIBUTING`,
  `SECURITY`, and this changelog.

[Unreleased]: https://github.com/Evan14-7/shelvia-context-kit/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Evan14-7/shelvia-context-kit/releases/tag/v0.1.0
