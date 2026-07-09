/**
 * TypeScript types for a Context Pack, kept aligned with
 * schema/context-pack.schema.json (the source of truth).
 */

export type ContextPackCategory =
  | "general"
  | "coding"
  | "research"
  | "writing"
  | "design";

export type WorkPhase = "research" | "plan" | "implement";

export type TrustGrade = "primary" | "reputable" | "community" | "unverified";

export type AssistantType =
  | "coding"
  | "research"
  | "writing"
  | "design"
  | "planning"
  | "debugging"
  | "general";

export interface Evidence {
  claim: string;
  source?: string | null;
}

export interface Decision {
  id?: string;
  title: string;
  body?: string | null;
  rationale?: string | null;
  tradeoffs?: string | null;
  outcome?: string | null;
  evidence?: Evidence[];
}

export interface Source {
  id?: string;
  label: string;
  url: string;
  trust_grade?: TrustGrade;
  bound_claim?: string | null;
}

export interface Prompt {
  id?: string;
  text: string;
  tool?: string | null;
}

export interface VersionEntry {
  label: string;
  status: string;
  summary?: string | null;
}

export interface RecommendedAssistant {
  type: AssistantType;
  reason: string;
}

export interface ContextPack {
  /** The Context Pack format version this document targets, e.g. "0.1". */
  spec_version: string;
  generated_at?: string;
  category?: ContextPackCategory;
  task?: string;
  work_phase?: WorkPhase;
  project_summary: string;
  current_direction?: string | null;
  decisions?: Decision[];
  sources?: Source[];
  prompts?: Prompt[];
  constraints?: string[];
  boundaries?: string[];
  what_to_avoid?: string[];
  open_questions?: string[];
  next_steps?: string[];
  version_history?: VersionEntry[];
  definition_of_done?: string | null;
  recommended_assistant?: RecommendedAssistant;
}

/** Target an exporter renders for. */
export type ExportTarget = "chatgpt" | "claude" | "cursor" | "codex";
