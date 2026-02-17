import { Agent, AgentOutput } from "../core/types"
import { openai } from "../config/openai"

export class GameDesignAgent implements Agent {
    name: "gamedesign" = "gamedesign"

    async run(input: string, context: string): Promise<AgentOutput> {
        const systemPrompt = `
You are Agent_GameDesign, responsible for designing the AI mobile game.
Produce only structured JSON:
{ "phase": "...", "objective": "...", "tasks": [...], "status": "...", "nextAction": "..." }
Focus on gameplay structure, core mechanics, and objectives.
Max 3 tasks per output.
`

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.3,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "system", content: `Studio Context:\n${context}` },
                { role: "user", content: input }
            ]
        })

        const content = response.choices[0].message.content

        if (!content) throw new Error("GameDesign returned empty response")

        try {
            const parsed: AgentOutput = JSON.parse(content)
            return parsed
        } catch {
            console.error("Invalid JSON from GameDesign:", content)
            throw new Error("GameDesign did not return valid JSON")
        }
    }
}
