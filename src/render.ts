/**
 * Render a Context Pack to clean Markdown. Deterministic and lossless within
 * the pack: it only transforms fields that are present, never invents facts.
 * Shared section helpers are exported for the per-tool exporters to reuse.
 */

import type { ContextPack, Decision, Source } from "./types.js";

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

export function sourceLines(sources: Source[] | undefined): string[] {
  const out: string[] = [];
  for (const s of sources ?? []) {
    const grade = s.trust_grade ? ` — _${s.trust_grade}_` : "";
    out.push(s.url ? `- [${s.label}](${s.url})${grade}` : `- ${s.label}${grade}`);
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
 * same data; this is the neutral one.
 */
export function renderMarkdown(pack: ContextPack): string {
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
