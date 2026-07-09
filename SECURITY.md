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

Out of scope:

- issues related to the hosted product at Shelvia.net
- vulnerabilities in third-party AI tools that consume a Context Pack

## Design intent

A Context Pack is meant to carry only reviewed, human-approved project context.

Do not place secrets, credentials, API keys, passwords, tokens, private keys, or raw chat logs in a Context Pack.

## Supported versions

The project is pre-1.0. Fixes land on the latest 0.x version.
Older 0.x versions are not maintained.
