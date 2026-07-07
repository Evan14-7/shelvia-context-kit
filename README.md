# Shelvia Context Packs (public preview)

**An open format for handing project context to any AI tool.**

> Preview: this folder is a documentation + format preview. It contains the
> Context Pack **schema, templates, examples, and docs** — no package or CLI
> code yet. The runnable `@shelvia/context-pack` package lands in a later phase.

---

## The problem

Every time you move work between ChatGPT, Claude, Cursor, or a coding agent, you
rebuild context from scratch — and the tool invents details you never approved.

## What a Context Pack is

A small, structured, portable bundle that says: here is the summary, the
decisions and *why*, the trusted sources, the constraints, what to avoid, and
what "done" means — so the next tool continues instead of restarting.

A pack is a single JSON document that follows
[`schema/context-pack.schema.json`](schema/context-pack.schema.json). It renders
to plain Markdown you can paste into any tool, or to the files coding tools
already read (`CLAUDE.md`, `AGENTS.md`, a Cursor rule).

## What is in this preview

```
schema/     context-pack.schema.json   the format
templates/  project-summary.md, decisions.md, sources.md,
            next-steps.md, risks.md, handoff.md
examples/   basic/context-pack.json + basic/handoff.md
docs/       format.md, relationship-to-shelvia.md
```

## Quick look

- Read [`docs/format.md`](docs/format.md) for the section-by-section spec.
- See [`examples/basic/context-pack.json`](examples/basic/context-pack.json) for
  a real pack, and [`examples/basic/handoff.md`](examples/basic/handoff.md) for
  the same pack rendered as a handoff.
- Validate a pack against the schema with any JSON Schema validator, e.g.:

```bash
npx ajv-cli validate -s schema/context-pack.schema.json -d examples/basic/context-pack.json
```

## Who it is for

Developers and teams moving work across multiple AI tools, and anyone building
agents that need scoped, reviewed context instead of a raw chat dump.

## Safety, by design

Packs are meant to be rendered through a secret redactor — your API keys never
leak into a context file — and an instruction-injection check that flags source
text reading like commands. Those utilities ship with the package in a later
phase; the format itself carries only reviewed, human-approved content.

## Relationship to Shelvia

This format is open source and standalone. **[Shelvia.net](https://shelvia.net)**
is the hosted product that *produces* trustworthy packs: it imports messy chats,
screenshots, and links, reviews them into memory, and captures results back. The
whole Shelvia product is **not** open source — the Context Pack format is. See
[`docs/relationship-to-shelvia.md`](docs/relationship-to-shelvia.md).

## License

Suggested: MIT. See [`LICENSE`](LICENSE).
