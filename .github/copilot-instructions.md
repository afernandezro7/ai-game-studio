# AI Game Studio — Copilot Instructions

## Project Overview

This is **AI Game Studio**, a multi-agent system for designing strategy games. It supports **multiple games simultaneously**, each in its own `games/<game-id>/` folder.

### Active Games

| Game                 | ID               | Genre                                | Platform                   | Status         |
| -------------------- | ---------------- | ------------------------------------ | -------------------------- | -------------- |
| **Project Valhalla** | `valhalla`       | Mobile City Builder                  | Unity / Roblox             | Pre-production |
| **Midgard Online**   | `midgard-online` | Browser MMO Strategy (Travian-style) | Web (React + Node.js + DB) | Pre-production |

**IMPORTANT:** Always check which game you're working on. Read `games/<game-id>/game.json` for context. Never mix configs or docs between games.

## Multi-Game Architecture

```
games/
├── valhalla/              # Mobile city builder (Unity/Roblox)
│   ├── game.json          # Game manifest
│   ├── config/            # JSON configs (engine-agnostic)
│   ├── docs/              # GDD, economy, vision
│   ├── sandbox-web/       # Web prototype for testing
│   ├── unity/             # Unity project
│   └── roblox/            # Roblox project
│
└── midgard-online/        # Browser MMO strategy
    ├── game.json          # Game manifest
    ├── config/            # JSON configs (game data)
    ├── docs/              # GDD, economy, vision, tech-stack
    ├── sandbox-web/       # React frontend
    └── backend/           # Node.js server + database
```

## Platform Strategy

- **`games/<id>/config/` is the REAL product** — JSON configs that define the entire game data
- **Each game chooses its platform(s)** — web, Unity, Roblox, Godot, etc.
- For **web games** (Midgard Online): the sandbox-web/ IS the game, and backend/ provides persistence and multiplayer
- For **engine games** (Valhalla): sandbox-web/ is for testing only, configs export to the target engine

## Architecture

- **Agents** (`.github/agents/`): 9 specialized AI agents following the pipeline: Producer → GameDesign → Archivist → QA → Developer → ArtDirector → Release
- **Skills** (`.github/skills/`): 28 specialized knowledge files from 5 game design books
- **Instructions** (`.github/instructions/`): Global rules auto-loaded by Copilot for all agents
- **Game Docs** (`games/<id>/docs/`): Source of truth for each game's mechanics, economy, and vision
- **Game Configs** (`games/<id>/config/`): JSON files derived from the GDD
- **DevLog** (`DEVLOG.md`): Narrative changelog — every significant action MUST be logged here

## Key Rules

1. **Documentation First**: No mechanic exists until it's in `games/<id>/docs/`. No code exists without a JSON config.
2. **Deterministic Design**: All game values must be explicit numbers (costs, times, rates). No vague descriptions.
3. **Agent Pipeline**: Ideas flow Producer → GameDesign → Archivist → QA → Developer → ArtDirector → Release. Don't skip steps.
4. **DEVLOG**: After completing any significant task, append an entry to `DEVLOG.md`.
5. **Game Isolation**: Never mix configs, docs, or code between games. Each game is self-contained in `games/<id>/`.

## File Relationships (per game)

```
games/<id>/docs/vision.md      → Reference for all agents
games/<id>/docs/economy.md     → games/<id>/config/ResourcesConfig.json
games/<id>/docs/buildings.md   → games/<id>/config/BuildingsConfig.json
games/<id>/docs/roadmap.md     → Release planning
```

## Current State

### Valhalla (mobile)

- **Phase**: Pre-production / Data Prototyping
- **Buildings**: Great Hall, Lumber Mill, Steel Mine (3 levels each)
- **Resources**: Wood, Steel, Runes (premium)
- **Pending**: Troops, Combat, Defenses, Clans

### Midgard Online (web)

- **Phase**: Pre-production / Pipeline Demo
- **Status**: Game manifest created, awaiting full agent pipeline execution
- **Scope**: Full Travian-style — Resources, Buildings, Troops, Combat, Alliances, Map, Backend + DB
