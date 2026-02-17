import { Agent, AgentOutput, StudioPhase } from "../core/types"

export class QAAgent implements Agent {
  name: "qa" = "qa"

  async run(input: string, context?: string): Promise<AgentOutput> {
    return {
      phase: StudioPhase.QA_REVIEW,
      objective: "Perform QA checks on the game design and documentation",
      tasks: [
        "Review game mechanics for consistency",
        "Check documentation completeness",
        "Report inconsistencies or missing information"
      ],
      status: "in_progress",
      nextAction: "Complete QA review tasks"
    }
  }
}
