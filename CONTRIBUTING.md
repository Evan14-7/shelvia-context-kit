# Contributing to Shelvia Context Kit

Thanks for your interest. This project is the open **format** for Context Packs
plus a small, pure toolkit around it. Contributions that keep it small, clean,
and dependency-light are very welcome.

> Maintenance note: this is maintained by a small team on a best-effort basis.
> Issues are read; responses may take time. Please keep pull requests focused.

## What belongs here

- The Context Pack JSON Schema and (soon) TypeScript types.
- Markdown templates and example packs.
- Documentation.
- **Pure** tooling: validators, renderers, and exporters that take a pack in and
  produce text out — no side effects.

## What does NOT belong here

To stay safe and useful, this repo never contains:

- Application, server, database, authentication, billing, or API code.
- Any network calls, environment variables, or secrets.
- Ingestion, source-detection, review/governance, or AI-provider logic (that is
  the hosted product, not the format).

If a change needs any of the above, it belongs in a different project.

## Proposing a schema change

The format follows **one schema, many renderers**. If a tool needs data the
schema does not carry, that is a *schema proposal*, not a template hack.

1. Open an issue describing the field, why it is needed, and an example.
2. If accepted, the change lands with a `spec_version` bump and a `CHANGELOG.md`
   entry. Nested objects use `additionalProperties: false`, so new fields are
   explicit and validated.

## Running the checks

```bash
npm install
npm run check:json          # every JSON file parses (no dependencies)
npm run validate:examples   # examples conform to the schema (uses ajv)
npm test                    # both of the above
```

Every example pack must validate against `schema/context-pack.schema.json`. If
you add or change a field, update `docs/format.md` and the examples in the same
change.

## Style

- No emojis in files unless a template explicitly calls for them.
- Keep dependencies out of the core. The validator uses `ajv`; do not add more
  without a strong reason.
- Prefer editing an existing file over adding a new one.

## Reporting security issues

Do not open a public issue for vulnerabilities. See [`SECURITY.md`](SECURITY.md).

## License

By contributing, you agree that your contributions are licensed under the
project's [MIT License](LICENSE).
