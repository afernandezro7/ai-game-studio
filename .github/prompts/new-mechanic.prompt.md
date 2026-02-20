# New Mechanic Pipeline

Run the full agent pipeline to design, validate, and implement a new game mechanic.

## Steps

1. **@gamedesign**: Design the mechanic described below with complete balance tables, costs, and timing. Follow the format in your agent instructions. Reference `docs/economy-and-buildings.md` for existing balance.

2. **@qa**: Validate the design using the 5-Point Validation Checklist. Run a Day 1 and Day 7 player simulation. Flag any exploits or soft-locks.

3. **@archivist**: If QA approves, document the new mechanic in the appropriate `docs/` file. Update `docs/index.md`. Verify no contradictions with existing docs.

4. **@developer**: Generate or update the JSON config in `src/config/`. If UI changes are needed, implement them in `client-web/src/`.

5. **@artdirector**: Create a Mermaid diagram showing how this mechanic connects to the core loop. Generate AI art prompts for any new visual elements.

6. **All agents**: Append your work to `DEVLOG.md`.

## Input

Describe the mechanic you want designed:

$input
