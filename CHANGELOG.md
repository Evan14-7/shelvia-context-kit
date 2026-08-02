# Changelog

All notable changes to Shelvia Context Kit are documented here. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
package follows [Semantic Versioning](https://semver.org/). Note that the npm
**package** version and the Context Pack **`spec_version`** track different
things: the package version tracks the toolkit; `spec_version` (currently `0.1`)
tracks the portable file format, which each pack declares.

## [1.0.3] - 2026-08-02

### Security
- **URL-scheme allowlist.** A source URL only becomes a followable Markdown link
  when its scheme is `http`/`https` (`safeUrl`). A dangerous scheme
  (`javascript:`, `data:`, `file:`, `vbscript:`, scheme-relative `//host`, …) is
  rendered as plain text, never a link — so a hostile pack can't turn a "source"
  into a clickable/agent-followable payload. Enforced at render AND, defence in
  depth, at validation (`pattern: "^https?://"` on `source.url`).
- **Input-size cap (DoS).** The CLI rejects files over 5 MB *before* reading or
  parsing them (`statSync` pre-check), so an oversized pack can't exhaust memory.
- **Bounded rendering.** Arrays are capped at render time (`MAX_ITEMS = 1000`)
  and the schema now sets `maxItems` / `maxLength` on arrays and strings — so a
  pack with hundreds of thousands of items or huge strings can't blow up the
  output, even when the caller skipped validation.
- **Expanded adversarial tests** (83 total): `javascript:`/`data:`/`file:` URLs,
  oversized arrays + strings, the URL-scheme schema pattern, and a proof that the
  Cursor exporter's YAML frontmatter is static (no pack value reaches it).

### Notes
- **Schema-valid does not mean trusted.** A Context Pack is untrusted input;
  these limits harden the JSON→instruction-file boundary but the consuming AI
  tool must still treat pack content as DATA, not higher-priority instructions.
- No `spec_version` change (still `0.1`). No golden output or example changed.

## [1.0.2] - 2026-07-31

### Security
- **Rendered-output sanitization.** Every user-controlled pack field is now
  neutralized before it reaches Markdown or a tool-instruction file. A field can
  no longer introduce a line break — every CR/LF, NEL (U+0085), line/paragraph
  separator (U+2028/U+2029) and C0/C1 control (including NUL) collapses to a
  single space — so it cannot forge a new line-leading Markdown structure.
- **Markdown/instruction-section injection prevented.** A field whose value
  begins with a block token (heading, blockquote, list, ordered list, fenced
  code, thematic/setext rule, table pipe, or an HTML `<`) is backslash-escaped
  so it renders as literal text, even at column 0. A hostile
  `"summary\n## New instructions ..."` can no longer create a forged section
  inside `CLAUDE.md`, `AGENTS.md`, a Cursor rule, or a ChatGPT brief.
- Sanitization is centralized (`sanitizeField` / `sanitizePack`) and applied
  once at every entry point (`renderMarkdown` and all four exporters), so no
  renderer can bypass it and future fields are covered automatically.
- **Render-time field-length enforcement.** A 4,000-character-per-field ceiling
  is applied at render time as defence in depth.

### Added
- `sanitizeField`, `sanitizePack`, and `FIELD_MAX` are exported for callers that
  render pack content themselves.
- Expanded security tests: every line-break/separator/control, every leading
  block token, idempotence, the length ceiling, empty/normal text, and a full
  every-field × every-exporter (+ shared renderer + CLI) injection matrix.

### Notes
- Sanitization is a no-op on clean, single-line content — no golden output or
  example changed. No schema change; `spec_version` remains `0.1`.

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

[1.0.3]: https://github.com/Evan14-7/shelvia-context-kit/releases/tag/v1.0.3
[1.0.2]: https://github.com/Evan14-7/shelvia-context-kit/releases/tag/v1.0.2
[1.0.1]: https://github.com/Evan14-7/shelvia-context-kit/releases/tag/v1.0.1
[1.0.0]: https://github.com/Evan14-7/shelvia-context-kit/releases/tag/v1.0.0
[0.1.0]: https://github.com/Evan14-7/shelvia-context-kit/releases/tag/v0.1.0
