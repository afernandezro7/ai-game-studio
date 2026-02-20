# AI Game Studio — Copilot Instructions

## Project Overview

This is **AI Game Studio**, a multi-agent system for designing mobile strategy games (Clash of Clans / Rise of Kingdoms style). The active project is **Project Valhalla** — a Norse mythology themed city builder.

## Platform Strategy

- **Target platforms**: Unity, Godot, Unreal, or any game engine that can consume JSON/YAML
- **`src/config/` is the REAL product** — engine-agnostic JSON configs that define the entire game
- **`client-web/` is a SANDBOX** — a React prototype ONLY for rapid testing and visualization. It is NOT the final game.
- The configs must be designed to be importable by any engine. No web-specific logic in the data layer.

## Architecture

- **Agents** (`.github/agents/`): 7 specialized AI agents that collaborate following the pipeline: Producer → GameDesign → Archivist → QA → Developer → ArtDirector → Release
- **Game Design Document** (`docs/`): The source of truth for all game mechanics, economy, and vision
- **Game Configs** (`src/config/`): Engine-agnostic JSON files derived from the GDD — these ARE the game data, portable to Unity/Godot/any engine
- **Web Sandbox** (`client-web/`): React + Vite prototype for rapid testing and visualization — NOT the final game client
- **DevLog** (`DEVLOG.md`): Narrative changelog — every significant action MUST be logged here

## Key Rules

1. **Documentation First**: No mechanic exists until it's in `docs/`. No code exists without a JSON config.
2. **Deterministic Design**: All game values must be explicit numbers (costs, times, rates). No vague descriptions.
3. **Agent Pipeline**: Ideas flow Producer → GameDesign → Archivist → QA → Developer → ArtDirector → Release. Don't skip steps.
4. **DEVLOG**: After completing any significant task, append an entry to `DEVLOG.md`.

## File Relationships

```
docs/economy.md          → src/config/ResourcesConfig.json → ANY engine reads it
docs/economy-and-buildings.md → src/config/BuildingsConfig.json → ANY engine reads it
docs/vision.md           → Reference for all agents
docs/roadmap.md          → Release planning
client-web/              → Web SANDBOX for testing (not the final game)
```

## Current State

- **Version**: Check `package.json`
- **Phase**: Pre-production / Data Prototyping
- **Buildings**: Great Hall, Lumber Mill, Steel Mine (3 levels each)
- **Resources**: Wood (Yggdrasil), Steel (Dwarf), Runes (premium)
- **Pending**: Troops, Combat, Defenses, Clans (see `docs/roadmap.md`)
