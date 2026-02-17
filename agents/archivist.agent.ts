import { Agent, AgentOutput } from "../core/types"
import { openai } from "../config/openai"

export class ArchivistAgent implements Agent {
  name: "archivist" = "archivist"

  async run(input: string, context: string): Promise<AgentOutput> {
    const systemPrompt = `
You are Agent_Archivist, responsible for compiling and organizing the AI game studio knowledge base.
Output only structured JSON:
{ "phase": "...", "objective": "...", "tasks": [...], "status": "...", "nextAction": "..." }
Focus on knowledge preparation, documentation, and structuring information.
Max 3 tasks per output.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: `Studio Context:\n${context}` },
        { role: "user", content: input }
      ]
    })

    const content = response.choices[0].message.content

    if (!content) throw new Error("Archivist returned empty response")

    try {
      const parsed: AgentOutput = JSON.parse(content)
      return parsed
    } catch {
      console.error("Invalid JSON from Archivist:", content)
      throw new Error("Archivist did not return valid JSON")
    }
  }
}
