import { Agent, AgentOutput } from "../core/types"
import { openai } from "../config/openai"

export class ProducerAgent implements Agent {
  name: "producer" = "producer"

  async run(input: string, context: string): Promise<AgentOutput> {
    const systemPrompt = `
You are Agent_Producer, Director of Operations of an AI Game Studio.
Only produce structured JSON:
{ "phase": "...", "objective": "...", "tasks": [...], "status": "...", "nextAction": "..." }
Never include text outside JSON.
Focus on studio setup tasks.
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

    if (!content) throw new Error("Producer returned empty response")

    try {
      const parsed: AgentOutput = JSON.parse(content)
      return parsed
    } catch {
      console.error("Invalid JSON from Producer:", content)
      throw new Error("Producer did not return valid JSON")
    }
  }
}
