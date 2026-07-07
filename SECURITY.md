# Security Policy

## Reporting a vulnerability

Please report security issues **privately** — do not open a public issue.

- Preferred: use GitHub's private vulnerability reporting on this repository
  (**Security -> Report a vulnerability**).
- Alternative: email `security@shelvia.net`.

> Maintainer note: confirm the `security@shelvia.net` address is monitored, or
> replace it with your preferred contact before publishing widely.

Please include steps to reproduce, affected files or versions, and the impact
you observed. You will receive an acknowledgement as soon as reasonably possible.

## Scope

This repository is a **format and pure toolkit**. It has no server, database,
authentication, or network calls, so the realistic surface is small:

- **In scope:** a schema or validator flaw that lets an invalid or unsafe pack
  validate; a rendering/exporter flaw that could inject unintended instructions
  into an output file; a supply-chain issue in the dev dependencies used by the
  validation scripts.
- **Out of scope:** anything about the hosted product at Shelvia.net (report
  those through Shelvia.net's own channels), and vulnerabilities in third-party
  AI tools that consume a pack.

## Design intent

A Context Pack is meant to carry only **reviewed, human-approved** content, never
raw chat logs or credentials. The reference package (v0.2) will render packs
through a secret redactor and an instruction-injection check as defense in depth.
Until then, do not place secrets in a pack; the format does not need them.

## Supported versions

The project is pre-1.0. Fixes land on the latest `0.x`. Older `0.x` releases are
not maintained.
