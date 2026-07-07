# Shelvia Context Kit

**An open format and toolkit for Context Packs — portable, reviewed project
context for AI tools.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Spec: v0.1](https://img.shields.io/badge/spec-v0.1-informational)
![Status: early](https://img.shields.io/badge/status-v0.1%20early-orange)

Repo: `shelvia-context-kit` · Format: **Context Packs** · Hosted product:
[Shelvia.net](https://shelvia.net)

---

## The problem: AI tools lose your project context

Every time you move work between ChatGPT, Claude, Cursor, or a coding agent, you
re-explain the goal, the decisions, and the constraints from scratch — and the
tool fills the gaps by inventing details you never approved. Your context lives
in scattered chat logs, in a shape the next tool cannot read. So each tool starts
cold, repeats mistakes you already ruled out, and drifts from the direction you
agreed on.

## What a Context Pack is

A **Context Pack** is a single, structured JSON document that captures the
reviewed context of a project so the next tool continues instead of restarting:

- project summary and current direction
- key decisions, each with the *why* (rationale, tradeoffs, outcome, evidence)
- trusted sources, each with a plain trust grade
- constraints, boundaries, and what to avoid
- open questions, next steps, and a definition of done

A pack follows [`schema/context-pack.schema.json`](schema/context-pack.schema.json)
and renders to plain Markdown you can paste into any tool — or to the files
coding tools already read (`CLAUDE.md`, `AGENTS.md`, a Cursor rule).

The rule that keeps it stable: **one schema, many renderers.** The JSON is the
source of truth; every Markdown view is derived from it.

## Who it is for

- **Developers** moving work across multiple AI tools without re-briefing each one.
- **Founders** keeping product context consistent across assistants and sessions.
- **Researchers** carrying sources, claims, and decisions between tools.
- **AI-assisted teams** that need scoped, reviewed context instead of raw chat dumps.
- Anyone **building agents** that need trustworthy, bounded context to act on.

## What is in this repo (v0.1)

```
schema/     context-pack.schema.json    the format (JSON Schema, draft-07)
templates/  project-summary.md, decisions.md, sources.md,
            next-steps.md, risks.md, handoff.md
examples/   basic/context-pack.json + basic/handoff.md (the rendered pack)
docs/       format.md (the spec), relationship-to-shelvia.md
scripts/    check-json, validate-examples (dependency-light checks)
```

## How to use it

1. **Read the spec** — [`docs/format.md`](docs/format.md) explains every field.
2. **Start from the example** — copy
   [`examples/basic/context-pack.json`](examples/basic/context-pack.json) and edit
   it for your project.
3. **Validate it** (Node 18+):
   ```bash
   npm install                 # installs the JSON Schema validator (ajv)
   npm run check:json          # every JSON file parses
   npm run validate:examples   # examples conform to the schema
   ```
   `check:json` needs no dependencies; `validate:examples` uses `ajv`.
4. **Render it** — fill [`templates/handoff.md`](templates/handoff.md) from your
   pack. See [`examples/basic/handoff.md`](examples/basic/handoff.md) for the
   result. A programmatic renderer and TypeScript types land in v0.2 (roadmap).

## Safety, by design

A Context Pack is meant to carry only reviewed, human-approved content — never a
raw chat log. The reference package (v0.2) renders packs through a secret
redactor so API keys never leak into a context file, plus an instruction-injection
check that flags source text reading like commands. See
[`SECURITY.md`](SECURITY.md).

## Relationship to Shelvia

This Kit is open source and standalone. **[Shelvia.net](https://shelvia.net)** is
the hosted product that *produces* trustworthy packs: it imports messy chats,
screenshots, and links, reviews them into memory, and captures results back. The
whole Shelvia product is **not** open source — the Context Pack format is. See
[`docs/relationship-to-shelvia.md`](docs/relationship-to-shelvia.md).

## Roadmap

- **v0.1 — schema, templates, examples** + JSON and schema validation. *(you are here)*
- **v0.2 — reference validator + TypeScript types** (`@shelvia/context-pack`).
- **v0.3 — CLI** (`validate` | `render` | `export`).
- **v0.4 — exporters for Codex / Claude / Cursor / ChatGPT** (`AGENTS.md`,
  `CLAUDE.md`, `.cursor` rules, paste-ready Markdown).

`0.x` may change the pack shape between releases; every pack declares the
`spec_version` it targets so a validator can pick the right rules.

## Contributing and more

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — scope, how to propose a schema change, how to run checks.
- [`SECURITY.md`](SECURITY.md) — how to report a vulnerability.
- [`CHANGELOG.md`](CHANGELOG.md) — what changed, per release.

## License

MIT (suggested). See [`LICENSE`](LICENSE).
