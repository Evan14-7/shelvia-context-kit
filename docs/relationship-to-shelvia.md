# Relationship to Shelvia

## Short version

- **Shelvia.net** is a hosted product. It is **not** open source.
- **Shelvia Context Kit** is an open format and toolkit — it produces **Context
  Packs**. It **is** open source.

The format is the artifact the product emits. You can use the format with no
Shelvia account, and Shelvia is one (good) way to produce packs — not the only
way.

## Who does what

| | Shelvia.net (hosted) | Shelvia Context Kit (open source) |
|---|---|---|
| Import messy chats, screenshots, links, files | Yes | No |
| Detect which AI a paste came from, extract prompts and links | Yes | No |
| Review captured context into trusted memory | Yes | No |
| De-duplicate, compare, and merge overlapping work | Yes | No |
| Capture results back and verify them | Yes | No |
| The Context Pack schema and types | Uses it | **Defines it** |
| Render a pack to Markdown / CLAUDE.md / AGENTS.md / Cursor | Uses it | **Provides it** |
| Validate a pack | Uses it | **Provides it** |
| Redact secrets before a pack leaves | Uses it | **Provides it** |

In one line: the open project is the **output format plus deterministic
renderers and a validator**. The hosted product is **how a pack gets filled with
reviewed, source-backed, de-duplicated context** — that part stays private.

## Why the split

Making "a Context Pack" something any tool can read spreads a shared vocabulary,
the way an open interchange format does. That is good for everyone and does not
give away the hard part. The value Shelvia sells is not the file format; it is
the trustworthy process that produces a good file.

## What this means for you

- Build on the format freely under its license.
- Generate packs however you like — by hand, from your own tooling, or from
  Shelvia.
- If you want the "messy input in, reviewed pack out" workflow without building
  it yourself, that is what Shelvia.net is for.

## What is intentionally not here

No authentication, database, billing, user data, private routes, internal APIs,
ingestion or detection logic, AI prompts, or production configuration. This repo
is the format and the pure tools around it — nothing that runs the product.
