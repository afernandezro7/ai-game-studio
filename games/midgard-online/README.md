# ⚔️ Midgard Online — Browser MMO Strategy

Norse mythology-themed Travian-style browser MMO. Part of the AI Game Studio multi-game system.

## Tech Stack

| Layer     | Technology                     |
| --------- | ------------------------------ |
| Frontend  | React 18 + Vite 5 + TypeScript |
| Backend   | Node.js + Express + TypeScript |
| Database  | PostgreSQL 16 + Prisma 5       |
| Real-time | Socket.io 4                    |
| Auth      | JWT + bcrypt                   |

## Quick Start

### 1. Start Database

```bash
cd games/midgard-online
docker-compose up -d
```

PostgreSQL will be available at `localhost:5432` (user: `midgard`, password: `midgard_dev`, db: `midgard_dev`).

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

Express API running at `http://localhost:3001`.

### 3. Setup Frontend

```bash
cd sandbox-web
npm install
npm run dev
```

Vite dev server at `http://localhost:5173` with proxy to backend API.

## Project Structure

```
games/midgard-online/
├── config/            # 6 JSON game configs (source of truth)
├── docs/              # Game Design Document
├── sandbox-web/       # React frontend (THE game client)
├── backend/           # Node.js API server
└── docker-compose.yml # PostgreSQL dev database
```

## Game Configs

The 6 JSON configs in `config/` define all game data:

- `BuildingsConfig.json` — 12 buildings × 10 levels
- `ResourcesConfig.json` — 4 resources + premium currency
- `TroopsConfig.json` — 9 troop types
- `CombatConfig.json` — Combat formulas + wall + anti-exploit
- `MapConfig.json` — 401×401 grid world map
- `AlliancesConfig.json` — Alliance system rules

These configs are loaded by both frontend and backend. **Do not modify them directly** — changes flow through the GDD pipeline.

## Documentation

Full GDD at `docs/`:

- [Vision](docs/vision.md) — Game concept and pillars
- [Economy](docs/economy.md) — Resource system
- [Buildings](docs/buildings.md) — All buildings with balance tables
- [Troops](docs/troops.md) — Military units
- [Combat](docs/combat.md) — Combat resolution
- [Map](docs/map.md) — World map system
- [Alliances](docs/alliances.md) — Alliance mechanics
- [Tech Stack](docs/tech-stack.md) — Architecture reference
- [Art Direction](docs/art/style-guide.md) — Visual design guide
