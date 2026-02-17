import { ProducerAgent } from "../agents/producer.agent"
import { ArchivistAgent } from "../agents/archivist.agent"
import { AgentOutput, AgentName, StudioPhase } from "./types"
import { MemoryService, StudioMemory } from "../memory/memory.service"

export class Orchestrator {
  private memory: StudioMemory

  constructor() {
    this.memory = MemoryService.load()
  }

  async run(input: string): Promise<void> {
    const activeAgent = this.memory.activeAgent

    let result: AgentOutput

    switch (activeAgent) {
      case "producer":
        const producer = new ProducerAgent()
        result = await producer.run(input, JSON.stringify(this.memory, null, 2))
        break

      case "archivist":
        const archivist = new ArchivistAgent()
        result = await archivist.run(input, JSON.stringify(this.memory, null, 2))
        break

      default:
        throw new Error(`Unknown agent: ${activeAgent}`)
    }

    this.processResult(result)
  }

  private processResult(result: AgentOutput) {
    console.log("=== AGENT RESULT ===")
    console.log(result)

    // Actualizamos fase según el agente activo
    switch (this.memory.activeAgent) {
      case "producer":
        this.memory.activePhase = StudioPhase.STUDIO_SETUP
        break
      case "archivist":
        this.memory.activePhase = StudioPhase.KNOWLEDGE_PREPARATION
        break
      case "gamedesign":
        this.memory.activePhase = StudioPhase.GAME_DESIGN
        break
      case "qa":
        this.memory.activePhase = StudioPhase.QA_REVIEW
        break
      case "release":
        this.memory.activePhase = StudioPhase.RELEASE
        break
    }

    // Evitar duplicados en decisiones
    if (!this.memory.decisions.includes(result.objective)) {
      this.memory.decisions.push(result.objective)
    }

    this.memory.currentTasks = result.tasks
    this.memory.lastStatus = result.status

    // TRANSICIÓN AL SIGUIENTE AGENTE
    this.memory.activeAgent = this.resolveNextAgent(result)

    MemoryService.save(this.memory)

    console.log("=== MEMORY UPDATED ===")
    console.log("Next active agent:", this.memory.activeAgent)
  }


  private resolveNextAgent(result: AgentOutput): AgentName {
    switch (this.memory.activeAgent) {
      case "producer":
        return "archivist"

      case "archivist":
        return "gamedesign"

      case "gamedesign":
        return "qa"

      case "qa":
        return "release"

      case "release":
        return "release" // última fase, se mantiene

      default:
        return this.memory.activeAgent
    }
  }

}
