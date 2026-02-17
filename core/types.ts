export type AgentStatus = "pending" | "in_progress" | "done"

export interface AgentOutput {
  phase: StudioPhase
  objective: string
  tasks: string[]
  status: AgentStatus
  nextAction: string
}

export interface Agent {
  name: string
  run(input: string, context?: string): Promise<AgentOutput>
}

export type AgentName =
  | "producer"
  | "archivist"
  | "gamedesign"
  | "qa"
  | "release"

export enum StudioPhase {
  STUDIO_SETUP = "studio_setup",             // Producer
  KNOWLEDGE_PREPARATION = "knowledge_preparation", // Archivist
  GAME_DESIGN = "game_design",               // GameDesign
  QA_REVIEW = "qa_review",                   // QA
  RELEASE = "release"                        // Release/Deployment
}


