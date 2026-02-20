# Add New Building

Design and implement a new building for Project Valhalla end-to-end.

## Input

Describe the building concept:

$input

## Pipeline

### 1. @gamedesign — Design Phase

Design this building with:

- 5 levels of progression
- Cost curve following: `cost(level) = base_cost * (level ^ 2.2)`
- Build time curve following: `time(level) = base_time * (level ^ 2.0)`
- Production or effect values for each level
- HP scaling per level
- What Great Hall level is required to unlock each level

Provide a complete Markdown balance table.

### 2. @qa — Validation Phase

Run the 5-Point Validation Checklist on this new building:

- Does adding this building create any soft-lock scenarios?
- Does the production from this building break the economy inflation ratio?
- Are the build times within the mobile-friendly ranges?
- Is Level 1 affordable for a new player?

### 3. @archivist — Documentation Phase

Add this building to `docs/economy-and-buildings.md` with:

- Full balance table
- Description and flavor text
- Cross-references to related systems

### 4. @developer — Implementation Phase

Add this building to `src/config/BuildingsConfig.json`:

- Follow the exact same JSON structure as existing buildings
- Ensure all numbers match the approved design table
- Update `client-web/src/App.tsx` if needed to display the new building

### 5. @artdirector — Visual Phase

Create:

- AI art prompts for each level (1, 3, 5) of the building
- A Mermaid diagram showing how this building connects to the resource flow

### 6. All — Log

Append entry to `DEVLOG.md` describing the new building addition.
