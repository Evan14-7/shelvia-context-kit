# Security Policy

## Reporting a vulnerability

Please report security issues privately. Do not open a public issue.

Preferred: use GitHub's private vulnerability reporting on this repository.

Alternative: email security@shelvia.net.

Please include:

- steps to reproduce
- affected files or versions
- the impact you observed

You will receive an acknowledgement as soon as reasonably possible.

## Scope

This repository is a format and pure toolkit.

It has no server, database, authentication, billing system, hosted app code, or private Shelvia product logic.

In scope:

- schema or validator issues that let an invalid pack validate
- rendering/export issues that could inject unintended instructions into an output file
- supply-chain issues in the dev dependencies used by validation scripts

### Rendered-output injection protection

As of `1.0.2`, every user-controlled pack field is neutralized before it reaches
Markdown or a tool-instruction file (`CLAUDE.md`, `AGENTS.md`, a Cursor rule, a
ChatGPT brief). A field cannot introduce a line break (all CR/LF, NEL, U+2028/
U+2029, and C0/C1 controls collapse to a space) and a value that begins with a
Markdown block token (heading, blockquote, list, fenced code, rule, table pipe,
or an HTML `<`) is escaped to render as literal text. This prevents a hostile
field from forging an extra instruction section in a rendered output. This
protection is not a claim of end-to-end prompt-injection prevention in the AI
tool that ultimately reads the file — packs must still carry only reviewed,
human-approved content.

Out of scope:

- issues related to the hosted product at Shelvia.net
- vulnerabilities in third-party AI tools that consume a Context Pack

## Design intent

A Context Pack is meant to carry only reviewed, human-approved project context.

Do not place secrets, credentials, API keys, passwords, tokens, private keys, or raw chat logs in a Context Pack.

## Supported versions

Two version numbers track different things: the **npm package** (`@shelviahq/context-pack`,
currently `1.0.2`) tracks the toolkit implementation, while the **Context Pack format**
(`spec_version`, currently `0.1`) tracks the portable file format.

Security fixes land on the latest `1.0.x` release. Older releases are not maintained.
