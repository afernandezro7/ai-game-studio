# 🛠️ Developer Prompts — Midgard Online v0.1.0

> Prompts listos para copiar y pegar a `@developer`. Uno por cada issue/fase.
> Cada prompt referencia el issue de GitHub, los archivos existentes y los criterios de aceptación.

---

## MO-02 — Autenticación: Registro + Login JWT

> **Issue:** [#8](https://github.com/afernandezro7/ai-game-studio/issues/8)
> **Branch:** `feature/MO-02-auth`
> **Depende de:** MO-01 ✅

```
@developer Implement issue #8 [MO-02] Authentication for Midgard Online.

## Context
- Game: Midgard Online (Travian-style browser MMO)
- Branch: feature/MO-02-auth (from develop)
- MANDATORY: Read games/midgard-online/docs/tech-stack.md before writing any code

## What already exists (from MO-01)
- Backend: Express server on port 3001 with placeholder routes in src/routes/auth.ts
- Middleware: src/middleware/auth.ts (placeholder — just calls next())
- Frontend: authStore.ts (Zustand with login/register/logout already wired to api.post)
- Frontend: services/api.ts (Axios with JWT interceptor already configured)
- Frontend: pages/Auth.tsx (placeholder)
- Prisma schema: User model with id, username, email, passwordHash, runes(50), createdAt, lastLogin
- .env has JWT_SECRET and JWT_EXPIRES_IN="7d"
- env.ts validates JWT_SECRET (min 32 chars) and JWT_EXPIRES_IN with Zod

## Tasks

### Backend (games/midgard-online/backend/)

1. **POST /auth/register** (src/routes/auth.ts)
   - Validate body with Zod: { username: 3-20 chars alphanumeric, email: valid email, password: ≥8 chars }
   - Check unique username AND email (return 409 if taken)
   - Hash password with bcryptjs (salt rounds: 12)
   - Create user via Prisma with runes: 50 (default in schema)
   - Generate JWT with payload { userId: user.id, username: user.username } expires in env.JWT_EXPIRES_IN
   - Return { token, user: { id, username, email, runes, createdAt } }
   - ⚠️ Do NOT return password_hash in response

2. **POST /auth/login** (src/routes/auth.ts)
   - Validate body with Zod: { email, password }
   - Find user by email (return 401 "Invalid credentials" if not found)
   - Compare password with bcrypt (return 401 if mismatch)
   - Update lastLogin timestamp
   - Generate JWT (same payload as register)
   - Return { token, user: { id, username, email, runes, createdAt } }

3. **GET /auth/me** (src/routes/auth.ts)
   - Protected by authMiddleware
   - Return { user: { id, username, email, runes, createdAt } }

4. **authMiddleware** (src/middleware/auth.ts)
   - Extract token from "Authorization: Bearer <token>"
   - Verify with jsonwebtoken.verify(token, env.JWT_SECRET)
   - Attach decoded payload to (req as any).user = { userId, username }
   - Return 401 JSON { error: "Unauthorized" } if missing/invalid
   - Create a TypeScript interface for AuthRequest extending Request

### Frontend (games/midgard-online/sandbox-web/)

5. **Auth.tsx** (src/pages/Auth.tsx)
   - Two tabs: Login | Register
   - Login form: email + password + submit button
   - Register form: username + email + password + confirm password + submit
   - Use useAuthStore().login() and .register()
   - Show error messages from API (409, 401)
   - Redirect to "/" after successful auth using react-router navigate
   - Style with CSS Variables from index.css (Nordic theme — use --bg-primary, --text-primary, --accent-gold, etc.)
   - Responsive: centered card on desktop, full-width on mobile

6. **authStore.ts** — Already exists and is correct. Just verify it works with the new API responses.

7. **App.tsx** — Add route protection:
   - If not authenticated, redirect all routes to /auth
   - If authenticated and on /auth, redirect to /

## Acceptance Criteria
- A user can register with email + username + password
- Registered user gets runes: 50 automatically
- A user can login and receive JWT (expires in 7d)
- Protected routes return 401 without token
- Login/Register page is responsive (mobile + desktop)
- Both tsc --noEmit (backend and frontend) pass with zero errors

## Important Rules
- TypeScript strict mode — no `any` except for (req as any).user pattern (create proper AuthRequest type)
- Use Prisma client from src/config/database.ts
- Use env from src/config/env.ts
- All validation with Zod
- Do NOT install new dependencies not already in package.json (bcryptjs, jsonwebtoken, zod are already installed)
- Do NOT modify schema.prisma (User model is already correct)
```

---

## MO-03 — Aldeas: Creación automática + CRUD + Recursos iniciales

> **Issue:** [#9](https://github.com/afernandezro7/ai-game-studio/issues/9)
> **Branch:** `feature/MO-03-villages`
> **Depende de:** MO-02 ✅

```
@developer Implement issue #9 [MO-03] Villages for Midgard Online.

## Context
- Game: Midgard Online (Travian-style browser MMO)
- Branch: feature/MO-03-villages (from develop)
- MANDATORY: Read these files before coding:
  - games/midgard-online/docs/tech-stack.md (DB schema, API endpoints)
  - games/midgard-online/docs/economy.md (starting resources)
  - games/midgard-online/config/ResourcesConfig.json (startingResources values)
  - games/midgard-online/config/MapConfig.json (map zones)

## What already exists (from MO-01 + MO-02)
- Backend: auth system working (register/login/JWT)
- Backend: src/routes/villages.ts (placeholder Router)
- Backend: src/services/villageService placeholder (if created in QA fixes)
- Prisma schema: Village, Resource models already defined
- Frontend: gameStore.ts (Zustand placeholder), pages/Village.tsx (placeholder)

## Tasks

### Backend (games/midgard-online/backend/)

1. **Auto-create village on registration** (modify src/routes/auth.ts POST /register)
   - After creating user, create village + resources in a Prisma transaction:
     a. Generate random name (e.g., "Aldea de {username}")
     b. Assign coordinates in Media zone (distance 80-160 from center 0,0) per MapConfig.json
     c. Ensure coordinates are unique on map_cells
     d. Create village record: { ownerId, name, mapX, mapY, population: 0 }
     e. Create resources record: { villageId, wood: 750, clay: 750, iron: 750, wheat: 750, lastUpdated: now }
     f. Create map_cell record: { x: mapX, y: mapY, cellType: 'player_village', villageId }
   - Starting resources: 750/750/750/750 (from ResourcesConfig.json.startingResources)
   - Runes (50) stay in users table — NOT in resources

2. **GET /villages/:id** (src/routes/villages.ts)
   - Protected by authMiddleware
   - Return village with resources + buildings included
   - Verify the requester owns the village (or allow read for map visibility — decide based on Travian pattern: public basic info, private resources)
   - Apply lazy resource calculation: compute delta since last_updated before returning
   - Response: { village: { id, name, mapX, mapY, population, createdAt, resources: {wood, clay, iron, wheat}, buildings: [...] } }

3. **GET /villages/:id/resources** (src/routes/villages.ts)
   - Protected by authMiddleware
   - Return resources with lazy tick applied (calculate from last_updated)
   - Response: { resources: { wood, clay, iron, wheat, lastUpdated } }

4. **villageService.ts** (src/services/ — implement the actual logic)
   - generateStartingCoordinates(): find valid coords in Media zone
   - createVillageForUser(userId, name?): transaction to create village + resources + map_cell
   - getVillageState(villageId): fetch village with relations, apply lazy tick

### Frontend (games/midgard-online/sandbox-web/)

5. **Village.tsx** (src/pages/Village.tsx)
   - Fetch village data on mount using React Query
   - Show village name, coordinates, basic info
   - If first visit (no village name set by user), show rename prompt/modal
   - Display resources bar (simple for now — will be enhanced in MO-06)

6. **gameStore.ts** (src/store/gameStore.ts)
   - State: currentVillage, resources, buildings
   - Actions: fetchVillage(id), setResources(), setBuildings()
   - Use villageService.ts for API calls

7. **villageService.ts** (src/services/villageService.ts — frontend)
   - getVillage(id): GET /villages/:id
   - getResources(id): GET /villages/:id/resources
   - renameVillage(id, name): (if endpoint added)

## Coordinate Generation Algorithm
```

function generateMediaCoords(): {x, y} {
// Media zone: distance 80-160 from center (0,0) per MapConfig.json
const minDist = 80, maxDist = 160;
const angle = Math.random() _ 2 _ Math.PI;
const dist = minDist + Math.random() _ (maxDist - minDist);
const x = Math.round(Math.cos(angle) _ dist);
const y = Math.round(Math.sin(angle) \* dist);
// Clamp to -200..200 map bounds
return { x: Math.max(-200, Math.min(200, x)), y: Math.max(-200, Math.min(200, y)) };
}
// Retry if coords already taken in map_cells

```

## Acceptance Criteria
- Registering a new user auto-creates a village with 750/750/750/750 resources
- GET /villages/:id returns complete village state in ≤200ms
- Village has customizable name
- Starting coordinates are in Media zone (distance 80-160)
- Both tsc --noEmit pass with zero errors

## Important Rules
- Use Prisma transactions for village creation (user + village + resources + map_cell must all succeed or all fail)
- Runes are on users table, NOT resources table
- Do NOT modify schema.prisma
- Use existing authMiddleware for route protection
```

---

## MO-04 — Producción en tiempo real: Tick loop + Acumulación de recursos

> **Issue:** [#10](https://github.com/afernandezro7/ai-game-studio/issues/10)
> **Branch:** `feature/MO-04-production`
> **Depende de:** MO-03 ✅

```
@developer Implement issue #10 [MO-04] Real-time Production for Midgard Online.

## Context
- Game: Midgard Online (Travian-style browser MMO)
- Branch: feature/MO-04-production (from develop)
- MANDATORY: Read these files before coding:
  - games/midgard-online/docs/tech-stack.md (production architecture section)
  - games/midgard-online/docs/economy.md (production formulas)
  - games/midgard-online/config/ResourcesConfig.json (base rates, storage caps)
  - games/midgard-online/config/BuildingsConfig.json (building production per level)

## What already exists (from MO-01/02/03)
- Backend: cron/productionTick.ts (placeholder with TODO)
- Backend: services/productionService.ts (placeholder)
- Backend: GET /villages/:id/resources (returns resources, lazy tick pending)
- Backend: node-cron is installed, env has PRODUCTION_TICK_INTERVAL_MS=60000
- Backend: Socket.io server running in ws/socketServer.ts
- Frontend: hooks/useResources.ts (placeholder)
- Frontend: store/gameStore.ts (has resources state)

## Key Formulas (from economy.md)
- Production per hour: `base × 1.405^(level-1)`
- Storage cap (Almacén): defined per level in BuildingsConfig.json
- Wheat consumption: population × 0.1/hour (Phase 1: only building population, no troops yet)
- productionStopsOnFullStorage: true — production halts when storage is full

## Tasks

### Backend (games/midgard-online/backend/)

1. **productionService.ts** (src/services/productionService.ts)
   - calculateProduction(village): compute per-resource production rate/hour based on building levels
     - Sum production from all resource buildings (woodcutter → wood, quarry → clay, iron_mine → iron, farm → wheat)
     - Use formula: base × 1.405^(level-1) for each building
     - Read base rates from ResourcesConfig.json via gameData
   - applyTick(village, deltaSeconds):
     - For each resource: newAmount = current + (prodPerHour / 3600) × deltaSeconds
     - Cap at storage capacity: min(newAmount, storageCapByLevel)
     - Storage cap comes from Almacén level (wood/clay/iron) and Granero level (wheat) in BuildingsConfig
     - Calculate wheat consumption: totalPopulation × 0.1 / 3600 × deltaSeconds
     - wheat = max(0, wheat - consumption)
     - If wheat hits 0, flag for future desertion (Phase 2 — just log warning for now)
   - getStorageCap(village): read Almacén and Granero levels → lookup cap from BuildingsConfig

2. **productionTick.ts** (src/cron/productionTick.ts)
   - Use node-cron to schedule every 60 seconds (or use PRODUCTION_TICK_INTERVAL_MS)
   - For each active village (has owner with recent lastLogin — e.g., last 7 days):
     a. Calculate deltaT = now - resources.lastUpdated
     b. Call productionService.applyTick(village, deltaT)
     c. Update resources in DB
     d. Emit Socket.io event `resources:tick` to room `village:${villageId}` with { wood, clay, iron, wheat }
   - Update resources.lastUpdated = now()
   - Log: "Production tick processed N villages"

3. **Lazy calculation in GET /villages/:id/resources** (update src/routes/villages.ts)
   - Before returning resources, calculate delta since lastUpdated and apply tick
   - This ensures accurate data even between cron ticks
   - Update lastUpdated in DB after lazy calculation

4. **Start cron in index.ts**
   - Import and start productionTick after server starts
   - Log: "Production tick scheduler started (every 60s)"

### Frontend (games/midgard-online/sandbox-web/)

5. **useResources.ts** (src/hooks/useResources.ts)
   - React Query: fetch resources from /villages/:id/resources
   - Client-side interpolation: update displayed resources every second based on known production rate
   - Recalculate on `resources:tick` WebSocket event (via useWebSocket or direct socket listener)
   - Expose: { wood, clay, iron, wheat, rates: { woodPerHour, ... }, caps: { woodCap, ... }, isFull: { wood: boolean, ... } }

6. **ResourceBar component** (src/components/resources/ResourceBar.tsx)
   - Horizontal bar showing: 🪵 Wood: 750/1200 (+45/h) | 🧱 Clay: ... | ⛏️ Iron: ... | 🌾 Wheat: ...
   - Progress bar for each resource (current/cap)
   - Show "FULL" badge when resource hits cap
   - Update every second (client-side interpolation)
   - Use CSS Variables from index.css

## Production Architecture (from tech-stack.md)
```

Every 60 seconds (productionTick.ts):

1. For each active village:
   a. deltaT = now - resources.last_updated (seconds)
   b. For each resource:
   - prodPerHour = Σ(building production at current level)
   - newAmount = current + (prodPerHour / 3600) × deltaT
   - capAmount = min(newAmount, storageCapacity)
     c. wheatConsumed = totalPopulation × 0.1/h × deltaT/3600
     d. wheat = max(0, wheat - wheatConsumed)
     e. UPDATE resources

```

## Acceptance Criteria
- All 4 resources produce and accumulate per economy.md formula
- Production stops at 100% storage (productionStopsOnFullStorage)
- Client receives `resources:tick` event and updates without manual polling
- Rates shown in UI match ResourcesConfig.json for each building level
- Lazy calculation on GET returns accurate resources between ticks
- Both tsc --noEmit pass with zero errors

## Important Rules
- The Socket.io event name is `resources:tick` (exactly as in tech-stack.md)
- Read game data from gameData.ts (already loads JSON configs)
- Use Prisma transactions for bulk resource updates
- Do NOT modify schema.prisma
```

---

## MO-05 — Edificios: Upgrade + Cola de construcción + Gran Salón

> **Issue:** [#11](https://github.com/afernandezro7/ai-game-studio/issues/11)
> **Branch:** `feature/MO-05-buildings`
> **Depende de:** MO-04 ✅

```
@developer Implement issue #11 [MO-05] Buildings for Midgard Online.

## Context
- Game: Midgard Online (Travian-style browser MMO)
- Branch: feature/MO-05-buildings (from develop)
- MANDATORY: Read these files before coding:
  - games/midgard-online/docs/tech-stack.md (buildings table, endpoints)
  - games/midgard-online/docs/buildings.md (all building data, costs, times)
  - games/midgard-online/config/BuildingsConfig.json (THE source of truth for costs/times/levels)

## What already exists (from MO-01/02/03/04)
- Backend: src/routes/buildings.ts (placeholder Router)
- Backend: src/services/buildingService.ts (placeholder)
- Backend: cron/missionResolver.ts (placeholder — can be used for build completion check)
- Backend: Production system working, resources accumulating
- Prisma schema: Building model (id, villageId, buildingType, slotIndex, level, upgradeFinishAt)
- Frontend: hooks/useBuildings.ts (placeholder)
- Frontend: components/buildings/ (empty with .gitkeep)

## Phase 1 Buildings (7 buildings, levels 1-10)
1. **Leñador de Yggdrasil** (woodcutter) — produces Wood
2. **Cantera de Midgard** (quarry) — produces Clay
3. **Mina de Hierro Enano** (iron_mine) — produces Iron
4. **Granja de Freya** (farm) — produces Wheat
5. **Gran Salón** (great_hall) — reduces build times by 3%/level
6. **Almacén** (warehouse) — storage cap for Wood/Clay/Iron
7. **Granero** (granary) — storage cap for Wheat

## Tasks

### Backend (games/midgard-online/backend/)

1. **POST /buildings/upgrade** (src/routes/buildings.ts)
   - Body: { villageId, buildingType }
   - Protected by authMiddleware
   - Validate with Zod
   - Verify village belongs to authenticated user
   - Check building exists and get current level
   - Check level < maxLevel (10)
   - Check prerequisites (e.g., barracks needs great_hall level 3 — read from BuildingsConfig.json)
   - Check resources sufficient for next level cost (from BuildingsConfig.json)
   - Check no other building currently upgrading in this village (upgradeFinishAt != null) — v0.1.0 limit: 1 concurrent
   - Deduct resources from village
   - Calculate build time: baseTime × (1 - greatHallLevel × 0.03) — Great Hall reduction
   - Set upgradeFinishAt = now + buildTime
   - Return { building: { id, buildingType, level, upgradeFinishAt }, resourcesAfter: {...} }

2. **DELETE /buildings/upgrade/:id** (src/routes/buildings.ts)
   - Cancel active construction
   - Refund resources (50%? or 100%? — check buildings.md, if not specified use 100%)
   - Set upgradeFinishAt = null
   - Return { building, resourcesAfter }

3. **GET /villages/:id/buildings** (src/routes/buildings.ts or villages.ts)
   - Return all buildings for village with current level + upgradeFinishAt
   - Include calculated stats for current level (from BuildingsConfig)

4. **buildingService.ts** (src/services/buildingService.ts)
   - validateUpgrade(villageId, buildingType): check all preconditions
   - startUpgrade(villageId, buildingType): deduct resources + set timer
   - cancelUpgrade(buildingId): refund + clear timer
   - completeUpgrade(buildingId): increment level, clear timer, update population
   - getUpgradeCost(buildingType, targetLevel): lookup from BuildingsConfig
   - getBuildTime(buildingType, targetLevel, greatHallLevel): base time × (1 - ghLevel × 0.03)

5. **Build completion checker** (src/cron/missionResolver.ts or new cron)
   - Every 5 seconds (MISSION_CHECK_INTERVAL_MS), check for buildings where upgradeFinishAt ≤ now
   - For each: increment level, clear upgradeFinishAt, update village population
   - Emit Socket.io event `building:complete` → `{buildingType, newLevel}` to room `village:${villageId}`

### Frontend (games/midgard-online/sandbox-web/)

6. **useBuildings.ts** (src/hooks/useBuildings.ts)
   - React Query: fetch buildings from /villages/:id/buildings
   - Mutation: upgradeBuilding(buildingType), cancelUpgrade(buildingId)
   - Listen for `building:complete` WebSocket event
   - Expose: buildings[], currentUpgrade (if any), canUpgrade(type): boolean

7. **BuildingCard.tsx** (src/components/buildings/BuildingCard.tsx)
   - Card showing: name, level, current stats, upgrade cost, build time
   - "Upgrade" button — green if affordable, red/disabled if not
   - If upgrading: show countdown timer + progress bar
   - Cost breakdown: Wood icon + amount (green/red based on availability)

8. **BuildingPanel.tsx** (src/components/buildings/BuildingPanel.tsx)
   - Detailed view when clicking a building slot
   - Current level stats vs next level stats (side by side)
   - Full cost table
   - Build time (with Gran Salón reduction shown)
   - All levels table (collapsible)

## Gran Salón Time Reduction
- Formula: `actualTime = baseTime × (1 - greatHallLevel × 0.03)`
- Level 1: -3%, Level 5: -15%, Level 10: -30% max
- Apply to ALL building upgrades in the village

## Acceptance Criteria
- Upgrading a building deducts correct resources from BuildingsConfig.json
- Build timer is accurate to the second
- Gran Salón reduces times by -3%/level (max -30% at Lv10)
- Cannot upgrade if resources insufficient
- Building level increases instantly when timer completes
- Only 1 building in construction at a time (v0.1.0)
- Client receives `building:complete` event
- Both tsc --noEmit pass with zero errors

## Important Rules
- Socket.io event name: `building:complete` (from tech-stack.md)
- All costs/times from BuildingsConfig.json — do NOT hardcode
- Do NOT modify schema.prisma
- Use existing gameData.ts to access BuildingsConfig
```

---

## MO-06 — UI de Aldea: Grid + Barra de Recursos + Panel de Edificio

> **Issue:** [#12](https://github.com/afernandezro7/ai-game-studio/issues/12)
> **Branch:** `feature/MO-06-village-ui`
> **Depende de:** MO-05 ✅

```
@developer Implement issue #12 [MO-06] Village UI for Midgard Online.

## Context
- Game: Midgard Online (Travian-style browser MMO)
- Branch: feature/MO-06-village-ui (from develop)
- MANDATORY: Read these files before coding:
  - games/midgard-online/docs/art/style-guide.md (CSS variables, wireframes, visual language)
  - games/midgard-online/sandbox-web/src/index.css (existing CSS variables)
  - games/midgard-online/config/BuildingsConfig.json (building data for UI)

## What already exists (from MO-01 through MO-05)
- Backend: Full auth, villages, resources, buildings APIs working
- Frontend: ResourceBar component, BuildingCard, BuildingPanel from MO-04/05
- Frontend: All hooks (useResources, useBuildings) working
- Frontend: CSS Variables in index.css (Nordic theme palette)
- Frontend: pages/Village.tsx (basic, needs full UI)
- Frontend: components/ structure with subdirectories

## Tasks — This is a FRONTEND-ONLY issue

### Layout & Navigation

1. **AppLayout.tsx** (src/components/ui/AppLayout.tsx)
   - Header: "Midgard Online" logo text (Cinzel font) + nav tabs: Aldea | Mapa | Alianza
   - Resource bar (from MO-04) pinned below header
   - Main content area
   - Use CSS Grid or Flexbox, NO external layout libraries
   - Use CSS Variables from index.css exclusively

2. **Village.tsx** (src/pages/Village.tsx — full rewrite)
   - Desktop layout: 3 columns
     - Left: Resource fields (4 production buildings)
     - Center: Village center (Gran Salón + infrastructure buildings)
     - Right: Building detail panel (opens on click)
   - Mobile (≤768px): vertical stack, panel opens as bottom sheet modal

### Village Grid

3. **VillageGrid.tsx** (src/components/village/VillageGrid.tsx)
   - 18 building slots:
     - Outer ring: 4 Woodcutter + 4 Quarry + 4 Iron Mine + 6 Farm = 18 resource fields
     - Inner zone: Gran Salón (center) + Warehouse + Granary + empty slots
   - Each slot renders BuildingSlot component
   - Visual states: empty (green border, "+" icon), built (building image placeholder + level badge), upgrading (animated border + timer)

4. **BuildingSlot.tsx** (src/components/village/BuildingSlot.tsx)
   - Props: { slot, building?, onClick }
   - Empty: dashed border, "Build" label, clickable
   - Occupied: building name + level number + icon/emoji placeholder
   - Upgrading: pulsing border animation + countdown overlay

### Building Detail Panel

5. **BuildingDetailPanel.tsx** (src/components/buildings/BuildingDetailPanel.tsx)
   - Opens when clicking a building slot
   - Sections:
     a. Header: Building name (Cinzel font) + level "Lv.3"
     b. Description: thematic Norse flavor text
     c. Current stats (production/hour or storage cap)
     d. Next level preview: stat comparison with arrows
     e. Cost table: resource icons + amounts (green if enough, red if not)
     f. Build time (with Gran Salón reduction note)
     g. "Upgrade" CTA button (--accent-gold background)
     h. All levels table (collapsible accordion)
   - Desktop: fixed panel on right side
   - Mobile: bottom sheet modal (slides up)

### Resource Bar (enhance from MO-04)

6. **ResourceBar.tsx** (src/components/resources/ResourceBar.tsx — enhance)
   - Compact horizontal bar below header
   - Each resource: emoji/SVG icon + current amount + "/" + cap + "(+rate/h)"
   - Visual: progress fill bar behind the numbers
   - "FULL" badge when at cap (pulsing gold)
   - Runas shown separately (premium, gold icon)
   - Updates every 1 second (client interpolation)

### Construction Timer

7. **ConstructionTimer.tsx** (src/components/buildings/ConstructionTimer.tsx)
   - Shows when a building is upgrading
   - Countdown: "02:34:15" format
   - Progress bar (elapsed / total time)
   - "Cancel" button (optional, small, text-only)
   - Appears in both the building slot and the detail panel

### Styling Requirements

- ALL colors from CSS Variables in index.css (--bg-primary, --bg-secondary, --text-primary, --accent-gold, --resource-wood, etc.)
- Fonts: Cinzel for headings, Inter for body, JetBrains Mono for numbers/timers
- NO Tailwind CSS, NO CSS-in-JS, NO styled-components — vanilla CSS only
- Each component gets its own .css file (e.g., VillageGrid.css)
- Responsive breakpoint: 768px
- Animations: CSS transitions/animations only (no framer-motion)
- Contrast: WCAG AA minimum (--text-muted ≥4.6:1 on --bg-primary)

## Acceptance Criteria
- UI uses exactly the hex colors from style-guide.md CSS variables
- Resource bar updates in real-time (1s interpolation)
- Grid shows correct state of each building (level + construction in progress)
- Building panel shows real costs from BuildingsConfig.json
- Playable in desktop Chrome/Firefox and mobile Safari/Chrome
- Contrast WCAG AA: --text-muted ≥4.6:1
- Both tsc --noEmit pass with zero errors

## Important Rules
- This is frontend-only — do NOT modify backend code
- NO new npm dependencies (no Tailwind, no UI library)
- Use existing hooks (useResources, useBuildings) from previous phases
- Every color must come from a CSS variable — no hardcoded hex values
- Component files max 100 lines — extract sub-components as needed
```

---

## MO-07 — WebSocket: Socket.io setup + eventos en tiempo real

> **Issue:** [#13](https://github.com/afernandezro7/ai-game-studio/issues/13)
> **Branch:** `feature/MO-07-websocket`
> **Depende de:** MO-06 ✅

```
@developer Implement issue #13 [MO-07] WebSocket integration for Midgard Online.

## Context
- Game: Midgard Online (Travian-style browser MMO)
- Branch: feature/MO-07-websocket (from develop)
- MANDATORY: Read these files before coding:
  - games/midgard-online/docs/tech-stack.md (WebSocket events table)

## What already exists (from MO-01 through MO-06)
- Backend: ws/socketServer.ts (Socket.io server running, auth placeholder)
- Backend: ws/attackNotifier.ts (placeholder stub)
- Backend: ws/chatHandler.ts (placeholder stub)
- Backend: Production tick emits resources:tick (from MO-04)
- Backend: Build completion emits building:complete (from MO-05)
- Frontend: hooks/useWebSocket.ts (placeholder)
- Frontend: services/socketService.ts (singleton stub)
- Frontend: Socket.io-client installed

## WebSocket Events for v0.1.0 (from tech-stack.md)

| Event | Direction | Payload | Phase |
|-------|-----------|---------|-------|
| `resources:tick` | server→client | `{wood, clay, iron, wheat}` | v0.1.0 |
| `building:complete` | server→client | `{buildingType, newLevel}` | v0.1.0 |
| `join_village` | client→server | `{villageId}` | v0.1.0 |

Future events (stub only, do NOT implement logic):
- `attack:incoming`, `attack:resolved` (v0.2.0)
- `troops:trained` (v0.2.0)
- `alliance:chat`, `alliance:member_attacked` (v0.3.0)

## Tasks

### Backend (games/midgard-online/backend/)

1. **socketServer.ts** (src/ws/socketServer.ts — full implementation)
   - Accept JWT in handshake: `auth: { token }` in socket.handshake
   - Verify JWT using same logic as authMiddleware
   - Reject connection (disconnect) if token invalid
   - On `join_village`: validate user owns village, then socket.join(`village:${villageId}`)
   - On disconnect: cleanup (just log for now)
   - Export `getIO()` function for other modules to emit events
   - TypeScript types for all event payloads

2. **Verify production tick emits correctly** (cron/productionTick.ts)
   - After updating resources, emit to room: `io.to('village:${villageId}').emit('resources:tick', { wood, clay, iron, wheat })`
   - Ensure numbers are rounded to 2 decimal places

3. **Verify build completion emits correctly** (wherever build completion runs)
   - After incrementing level: `io.to('village:${villageId}').emit('building:complete', { buildingType, newLevel })`

4. **attackNotifier.ts** (src/ws/attackNotifier.ts)
   - Stub with exported function signature: `notifyIncomingAttack(villageId, attackData)` → TODO for v0.2.0

5. **chatHandler.ts** (src/ws/chatHandler.ts)
   - Stub with exported function signature: `handleAllianceChat(socket, io)` → TODO for v0.3.0

### Frontend (games/midgard-online/sandbox-web/)

6. **socketService.ts** (src/services/socketService.ts — full implementation)
   - Singleton Socket.io client
   - Connect on init: `io('/', { auth: { token }, transports: ['websocket'] })`
   - Auto-reconnect with exponential backoff (Socket.io default)
   - Methods: connect(token), disconnect(), joinVillage(id), onEvent(name, callback), offEvent(name)
   - Expose connection state: connected, disconnected, reconnecting

7. **useWebSocket.ts** (src/hooks/useWebSocket.ts — full implementation)
   - Connect socket when user is authenticated (read token from authStore)
   - Join village room on mount of VillageView
   - Register listeners:
     - `resources:tick` → update gameStore resources
     - `building:complete` → invalidate buildings query + show toast
   - Cleanup: disconnect on logout, remove listeners on unmount
   - Return: { isConnected, lastTick }

8. **Toast notification system** (src/components/ui/Toast.tsx)
   - Simple notification toast component
   - Shows on `building:complete`: "¡{buildingName} mejorado a Nivel {level}!"
   - Auto-dismiss after 5 seconds
   - Stack multiple toasts
   - Use CSS Variables (--accent-gold background, --bg-primary text)

## Acceptance Criteria
- WebSocket connects after login with JWT authentication
- Resources update in client every 60s via `resources:tick` without manual refresh
- Building completion shows toast notification in <1 second via `building:complete`
- Auto-reconnect if connection drops
- No memory leaks: socket cleanup on component unmount and logout
- Both tsc --noEmit pass with zero errors

## Important Rules
- Event names EXACTLY as in tech-stack.md: `resources:tick`, `building:complete`, `join_village`
- Do NOT use `production:tick` or `building:upgraded` — those are WRONG names
- JWT verification in WebSocket handshake (not just in REST middleware)
- Socket.io rooms follow pattern: `village:${villageId}`
- Do NOT install new dependencies
```

---

## MO-08 — QA E2E + Deploy: Validación final v0.1.0

> **Issue:** [#14](https://github.com/afernandezro7/ai-game-studio/issues/14)
> **Branch:** `feature/MO-08-qa-e2e`
> **Depende de:** MO-07 ✅

```
@developer Implement issue #14 [MO-08] QA E2E + Deploy validation for Midgard Online v0.1.0.

## Context
- Game: Midgard Online (Travian-style browser MMO)
- Branch: feature/MO-08-qa-e2e (from develop)
- MANDATORY: Read these files before coding:
  - games/midgard-online/docs/tech-stack.md
  - games/midgard-online/docs/roadmap.md (Phase 1 criteria)
  - games/midgard-online/docs/qa-audit-report.md (design QA findings)

## What already exists (from MO-01 through MO-07)
- Full stack working: Auth, Villages, Production, Buildings, WebSocket, UI
- Docker Compose for PostgreSQL
- README with quick start

## Tasks

### Backend Tests (Jest + Supertest)

1. **Setup test infrastructure**
   - Install dev dependencies: jest, @jest/globals, ts-jest, supertest, @types/supertest
   - jest.config.ts: preset ts-jest, testEnvironment node
   - Test database: use TEST_DATABASE_URL env variable (separate DB or same with transaction rollback)
   - beforeAll: run Prisma migrations on test DB
   - afterEach: clean relevant tables
   - afterAll: disconnect Prisma

2. **Auth tests** (src/__tests__/auth.test.ts)
   - POST /auth/register: valid → 201 + token + user with runes: 50
   - POST /auth/register: duplicate email → 409
   - POST /auth/register: weak password → 400
   - POST /auth/login: valid → 200 + token
   - POST /auth/login: wrong password → 401
   - GET /auth/me: with token → 200 + user
   - GET /auth/me: without token → 401

3. **Village tests** (src/__tests__/villages.test.ts)
   - Register creates village with 750/750/750/750 resources
   - GET /villages/:id returns complete state
   - Starting coordinates in Media zone (distance 80-160)

4. **Production tests** (src/__tests__/production.test.ts)
   - Tick applies correct delta based on building levels
   - Production stops at storage cap
   - Lazy calculation on GET returns accurate values

5. **Building tests** (src/__tests__/buildings.test.ts)
   - POST /buildings/upgrade: deducts resources, sets timer
   - POST /buildings/upgrade: insufficient resources → 400
   - POST /buildings/upgrade: max level → 400
   - POST /buildings/upgrade: already building → 409
   - Gran Salón reduces build time by 3%/level
   - Build completion increments level

### E2E Tests (Playwright)

6. **Setup Playwright**
   - Install: @playwright/test
   - playwright.config.ts: baseURL http://localhost:5173, webServer scripts for both frontend and backend
   - Projects: Chromium + WebKit

7. **Full flow E2E** (e2e/full-flow.spec.ts)
   - Register new user → lands on Village page
   - See village with resources 750/750/750/750
   - Click Woodcutter slot → see BuildingPanel
   - Click "Upgrade" → resources deducted, timer appears
   - Wait for timer (use short test timer or mock) → level increases
   - Verify production rate changed
   - Mobile viewport (375px): same flow works

### Deploy Validation

8. **Docker Compose verification**
   - docker-compose.yml already exists — verify it works from scratch:
     `docker-compose down -v && docker-compose up -d && sleep 3 && npx prisma migrate deploy`
   - Add npm script: `"db:reset": "docker-compose down -v && docker-compose up -d"`

9. **Production environment**
   - Create .env.example with all required variables (already exists — verify complete)
   - Create .env.production.example with production-ready defaults
   - Verify README.md has complete setup instructions

10. **Version bump**
    - Update games/midgard-online/game.json: set version to "0.1.0"
    - Update package.json files if they have version field

### Scripts to add to package.json(s)

Backend:
- "test": "jest --runInBand"
- "test:watch": "jest --watch"
- "test:coverage": "jest --coverage"

Root or midgard-online level:
- "test:e2e": "playwright test"
- "test:e2e:headed": "playwright test --headed"

## Acceptance Criteria
- 100% backend unit tests pass
- E2E passes in Chromium + WebKit
- 0 console errors in main flow
- Docker Compose works from scratch (clean install)
- README has complete setup instructions
- game.json version = "0.1.0"
- Both tsc --noEmit pass with zero errors
- @qa can approve: "✅ QA APPROVED v0.1.0"

## Important Rules
- Tests must be deterministic — no flaky tests
- Use test database, not dev database
- Clean up test data after each test
- E2E should work with real backend (not mocks)
- Do NOT modify game logic — this is QA only
```

---

## Resumen de Orden de Ejecución

| Orden | Issue     | Branch                     | Scope                           | Dependencia |
| ----- | --------- | -------------------------- | ------------------------------- | ----------- |
| 1     | MO-02 #8  | `feature/MO-02-auth`       | Backend auth + Frontend login   | MO-01 ✅    |
| 2     | MO-03 #9  | `feature/MO-03-villages`   | Village CRUD + auto-creation    | MO-02       |
| 3     | MO-04 #10 | `feature/MO-04-production` | Production tick + resources     | MO-03       |
| 4     | MO-05 #11 | `feature/MO-05-buildings`  | Building upgrade + queue        | MO-04       |
| 5     | MO-06 #12 | `feature/MO-06-village-ui` | Full village UI (frontend only) | MO-05       |
| 6     | MO-07 #13 | `feature/MO-07-websocket`  | WebSocket real-time events      | MO-06       |
| 7     | MO-08 #14 | `feature/MO-08-qa-e2e`     | Tests + deploy validation       | MO-07       |

### Workflow por fase

```
1. git checkout develop && git pull
2. git checkout -b feature/MO-XX-name
3. Run @developer with the prompt above
4. Review output, verify tsc --noEmit on both projects
5. git add -A && git commit && git push
6. Create PR → develop
7. Run @qa for PR review
8. Apply fixes if needed
9. Merge PR, close issue
10. Repeat for next phase
```
