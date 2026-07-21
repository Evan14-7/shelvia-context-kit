# Exporters

An exporter turns a validated Context Pack into the context file a specific tool
already reads. Every exporter follows two rules:

- **It only transforms the pack.** It never invents facts. Everything in the
  output comes from a field that was present in the pack.
- **One schema, many renderers.** The pack JSON is the source of truth; each
  exporter is a view of it.

Use them from the library or the CLI:

```ts
import { exportPack } from "shelvia-context-pack";
const text = exportPack(pack, "codex");
```

```bash
npx shelvia-context-pack export my.pack.json --target codex
```

## Targets

| Target | Produces | Typical destination |
|---|---|---|
| `chatgpt` | A paste-ready project brief in Markdown | A ChatGPT thread or a Project's custom instructions |
| `claude` | A `CLAUDE.md`-style context file | Claude / Claude Code |
| `cursor` | A Cursor rule with `---` frontmatter | `.cursor/rules/*.mdc` |
| `codex` | An `AGENTS.md`-style file | OpenAI Codex and other AGENTS.md readers |

## What they include

Each exporter draws from the same fields and drops any section the pack does not
carry:

- the current task and (if set) the work phase
- the project summary and current direction
- approved decisions with their rationale
- constraints and boundaries
- what to avoid
- the definition of done
- sources (in the ChatGPT and Claude outputs)

The neutral, full-pack view is `renderMarkdown(pack)` — use it when you just want
the whole pack as clean Markdown rather than a tool-specific file.

## The generic renderer vs. the exporters

- `renderMarkdown` is the complete, tool-neutral document (every section).
- The exporters are shorter and framed for one tool (for example, the Codex
  exporter leads with `# AGENTS.md` and a "How to work in this repo" section;
  the Cursor exporter emits the minimal `.mdc` frontmatter).

If a tool needs a field the schema does not carry, that is a schema proposal (a
`spec_version` bump), not an exporter hack.
