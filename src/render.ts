/**
 * Render a Context Pack to clean Markdown. Deterministic and lossless within
 * the pack: it only transforms fields that are present, never invents facts.
 * Shared section helpers are exported for the per-tool exporters to reuse.
 */

import type { ContextPack, Decision, Source } from "./types.js";

/** Defence-in-depth per-field length ceiling, enforced at render time. */
export const FIELD_MAX = 4000;

/**
 * Neutralize ONE Context Pack field for safe embedding in rendered Markdown or
 * tool-instruction output. Two guarantees:
 *   1. No line breaks. Every CR/LF, NEL (U+0085), line/paragraph separator
 *      (U+2028/U+2029) and C0/C1 control (incl. NUL) collapses to a single
 *      space, so a value can never span lines - and therefore can never START
 *      a new line-leading Markdown structure.
 *   2. No leading block token. If the trimmed value itself begins with a
 *      Markdown block marker (ATX heading, blockquote, list bullet, ordered
 *      list, fenced code, thematic/setext rule, table pipe, or an HTML "<"),
 *      it is backslash-escaped so it renders as literal text even when placed
 *      at column 0 (e.g. as a section value).
 * Idempotent: sanitizeField(sanitizeField(x)) === sanitizeField(x).
 * A no-op on clean single-line text under the ceiling.
 */
export function sanitizeField(input: unknown): string {
  if (input == null) return "";
  let s = String(input);
  // (1) Collapse every line-break / separator / control run to a single space:
  //     \x00-\x1F = C0 controls (CR, LF, TAB, NUL, ...); \x7F = DEL;
  //     \x80-\x9F = C1 controls (incl. NEL \x85); \u2028 = LS; \u2029 = PS.
  s = s.replace(/[\x00-\x1F\x7F-\x9F\u2028\u2029]+/g, " ").trim();
  // (2) Escape a leading block-structural token so it cannot open a structure.
  s = s.replace(
    /^(#{1,6}(?=\s|$)|>|[-+*](?=\s|$)|\d+[.)](?=\s)|`{3,}|~{3,}|<|\||-{3,}|_{3,}|={2,}(?=\s|$)|\*{3,})/,
    "\\$&"
  );
  // (3) Defence-in-depth length ceiling.
  if (s.length > FIELD_MAX) s = s.slice(0, FIELD_MAX);
  return s;
}

/**
 * Return a structurally identical pack with EVERY string field neutralized via
 * sanitizeField. Centralized here so no renderer or exporter can accidentally
 * bypass it: each entry point sanitizes the whole pack once, so every current
 * and future field is covered automatically. Non-string values pass through.
 */
export function sanitizePack<T>(value: T): T {
  if (typeof value === "string") return sanitizeField(value) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => sanitizePack(v)) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = sanitizePack(v);
    return out as T;
  }
  return value;
}

export function capitalize(s: string): string {
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** A section: heading + lines. Dropped entirely when it has no lines. */
export function section(heading: string, lines: string[]): string[] {
  const kept = lines.filter((l) => l != null && String(l).trim() !== "");
  if (kept.length === 0) return [];
  return ["", `## ${heading}`, ...kept];
}

export function decisionLines(decisions: Decision[] | undefined): string[] {
  const out: string[] = [];
  for (const d of decisions ?? []) {
    const tail = d.body ? ` — ${d.body}` : "";
    out.push(`- **${d.title}**${tail}`);
    if (d.rationale) out.push(`  - Why: ${d.rationale}`);
    if (d.tradeoffs) out.push(`  - Tradeoff: ${d.tradeoffs}`);
    if (d.outcome) out.push(`  - Outcome: ${d.outcome}`);
    for (const ev of d.evidence ?? []) {
      const src = ev.source ? ` (${ev.source})` : "";
      out.push(`  - Backed by: ${ev.claim}${src}`);
    }
  }
  return out;
}

/** Escape a value used as inline Markdown (e.g. a link label): strip newlines
 *  and backslash-escape structural chars so a hostile label can't break out of
 *  the link. A no-op on clean text. Not a claim of prompt-injection prevention. */
export function mdInline(s: string): string {
  return String(s).replace(/\r?\n/g, " ").replace(/([\\[\]])/g, "\\$1");
}

/** Make a URL safe as a Markdown link destination: drop newlines, and only when
 *  it contains whitespace / parens / angle brackets, wrap it in <> (CommonMark)
 *  so it can't terminate the link early. Clean URLs are emitted unchanged. */
export function mdUrl(u: string): string {
  const s = String(u).replace(/\r?\n/g, "");
  return /[\s()<>]/.test(s) ? `<${s.replace(/[<>]/g, "")}>` : s;
}

export function sourceLines(sources: Source[] | undefined): string[] {
  const out: string[] = [];
  for (const s of sources ?? []) {
    const grade = s.trust_grade ? ` — _${s.trust_grade}_` : "";
    out.push(s.url ? `- [${mdInline(s.label)}](${mdUrl(s.url)})${grade}` : `- ${mdInline(s.label)}${grade}`);
    if (s.bound_claim) out.push(`  - Backs: ${s.bound_claim}`);
  }
  return out;
}

export function bulletLines(items: string[] | undefined): string[] {
  return (items ?? []).map((i) => `- ${i}`);
}

const ASSISTANT_LABEL: Record<string, string> = {
  coding: "Coding assistant",
  research: "Research assistant",
  writing: "Writing assistant",
  design: "Design assistant",
  planning: "Planning assistant",
  debugging: "Debugging assistant",
  general: "General assistant",
};

export function assistantLabel(type: string): string {
  return ASSISTANT_LABEL[type] ?? "General assistant";
}

/**
 * The canonical full-pack Markdown. Every renderer/exporter is a view of the
 * same data; this is the neutral one. Sanitizes the whole pack first so no
 * field can inject a new line or a line-leading Markdown structure.
 */
export function renderMarkdown(raw: ContextPack): string {
  const pack = sanitizePack(raw);
  const lines: string[] = ["# Project Context Pack"];

  if (pack.category && pack.category !== "general") lines.push("", `_Focus: ${capitalize(pack.category)}_`);
  if (pack.task) lines.push("", `_Task: ${pack.task}_`);
  if (pack.work_phase) lines.push("", `> Phase: ${capitalize(pack.work_phase)}`);

  lines.push(
    "",
    "Use this as background when continuing this project in another AI tool. Treat the items below as facts about the project. Do not invent details; ask before changing a major decision."
  );

  lines.push(...section("Project summary", [pack.project_summary]));
  lines.push(...section("Current direction", [pack.current_direction ?? ""]));
  lines.push(...section("Key decisions", decisionLines(pack.decisions)));
  lines.push(...section("Trusted sources", sourceLines(pack.sources)));
  lines.push(
    ...section(
      "Best prompts",
      (pack.prompts ?? []).map((p) => `- ${p.tool ? `_(${p.tool})_ ` : ""}${p.text}`)
    )
  );
  lines.push(...section("Constraints", bulletLines(pack.constraints)));
  lines.push(...section("Boundaries", bulletLines(pack.boundaries)));
  lines.push(...section("What to avoid", bulletLines(pack.what_to_avoid)));
  lines.push(...section("Open questions", bulletLines(pack.open_questions)));
  lines.push(...section("Next steps", bulletLines(pack.next_steps)));
  lines.push(
    ...section(
      "Version history",
      (pack.version_history ?? []).map(
        (v) => `- **${v.label}** _(${v.status})_${v.summary ? ` — ${v.summary}` : ""}`
      )
    )
  );
  lines.push(...section("Definition of done", [pack.definition_of_done ?? ""]));
  if (pack.recommended_assistant) {
    lines.push(
      ...section("Recommended next assistant", [
        `**${assistantLabel(pack.recommended_assistant.type)}** — ${pack.recommended_assistant.reason}`,
      ])
    );
  }

  lines.push(
    "",
    "## How to use this",
    "Continue the project without restarting from zero. Preserve the accepted direction, respect the constraints, and ask before changing a major decision. If you need information that isn't here, say so instead of guessing."
  );

  return lines.join("\n").trim() + "\n";
}
