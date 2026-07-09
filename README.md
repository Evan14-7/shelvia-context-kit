# Shelvia Context Kit

**An open format and toolkit for Context Packs — portable, reviewed project
context for AI tools.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Spec: v0.1](https://img.shields.io/badge/spec-v0.1-informational)
![Node: >=18](https://img.shields.io/badge/node-%3E%3D18-informational)

Package: `@shelvia/context-pack` · Format: **Context Packs** · Hosted product:
[Shelvia.net](https://shelvia.net)

---

## The problem: AI tools lose your project context

Every time you move work between ChatGPT, Claude, Cursor, or a coding agent, you
re-explain the goal, the decisions, and the constraints from scratch, and the
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

A pack follows [`schema/context-pack.schema.json`](schema/context-pack.schema.json).
The rule that keeps it stable: **one schema, many renderers.** The JSON is the
source of truth; every Markdown view is derived from it.

## Available now

This repo is a working toolkit, not just a spec:

- **JSON schema** for the Context Pack format (`schema/context-pack.schema.json`).
- **Reusable templates** (`templates/`) and **working examples** (`examples/`).
- **TypeScript types** for a `ContextPack` and its sub-objects.
- **A validator** that returns clear, path-anchored errors.
- **A Markdown renderer** (`renderMarkdown`).
- **Exporters** for **ChatGPT, Claude, Cursor, and Codex** (`CLAUDE.md`,
  `AGENTS.md`, a Cursor rule, or paste-ready Markdown).
- **A CLI** — `validate`, `render`, `export`.
- **CI** that builds, tests, and validates every example on each push.

## Install and use

```bash
npm install          # builds the package (TypeScript -> dist)
npm run build        # compile
npm test             # run the test suite
npm run validate:examples   # every example conforms to the schema
```

### As a library

```ts
import {
  validateContextPack,
  renderMarkdown,
  exportPack,
} from "@shelvia/context-pack";

const pack = JSON.parse(fs.readFileSync("my.pack.json", "utf8"));

const { valid, errors } = validateContextPack(pack);
if (!valid) console.error(errors); // [{ path, message }, ...]

const markdown = renderMarkdown(pack);
const agentsMd = exportPack(pack, "codex"); // "chatgpt" | "claude" | "cursor" | "codex"
```

### From the command line

```bash
npx @shelvia/context-pack validate examples/basic/context-pack.json
npx @shelvia/context-pack render   examples/basic/context-pack.json
npx @shelvia/context-pack export   examples/basic/context-pack.json --target cursor
npx @shelvia/context-pack export   examples/basic/context-pack.json --target codex
```

`validate` exits `0` when the pack is valid and non-zero (with readable errors)
when it is not, so it drops straight into a pre-commit hook or CI.

## Who it is for

- **Developers** moving work across multiple AI tools without re-briefing each one.
- **Founders** keeping product context consistent across assistants and sessions.
- **Researchers** carrying sources, claims, and decisions between tools.
- **AI-assisted teams** that need scoped, reviewed context instead of raw chat dumps.
- Anyone **building agents** that need trustworthy, bounded context to act on.

## Safety

A Context Pack is meant to carry only reviewed, human-approved content, never a
raw chat log. **Do not put secrets, credentials, or API keys in a pack** — the
format does not need them, and exporters copy pack content verbatim. Exporters
never invent facts; they only transform what the pack already contains. See
[`SECURITY.md`](SECURITY.md).

## Relationship to Shelvia

This Kit is open source and standalone. **[Shelvia.net](https://shelvia.net)** is
the hosted product that *produces* trustworthy packs: it imports messy chats,
screenshots, and links, reviews them into memory, and captures results back. The
whole Shelvia product is **not** open source — the Context Pack format is. See
[`docs/relationship-to-shelvia.md`](docs/relationship-to-shelvia.md).

## Versioning

`0.x` of the format may change the pack shape between releases; every pack
declares the `spec_version` it targets so a validator can pick the right rules.

## Contributing and more

- [`docs/format.md`](docs/format.md) — the format spec, field by field.
- [`docs/exporters.md`](docs/exporters.md) — what each exporter produces.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — scope and how to propose a schema change.
- [`SECURITY.md`](SECURITY.md) — how to report a vulnerability.
- [`CHANGELOG.md`](CHANGELOG.md) — what changed, per release.

## License

MIT. See [`LICENSE`](LICENSE).
