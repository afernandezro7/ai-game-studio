# 🔍 QA Review — PR #15 (MO-01 Project Setup)

> **Fecha:** 2026-02-24
> **Autor:** `@qa`
> **PR:** [#15](https://github.com/afernandezro7/ai-game-studio/pull/15) (`feature/MO-01-setup` → `develop`)
> **Issue:** [#7 — MO-01 Project Setup](https://github.com/afernandezro7/ai-game-studio/issues/7)
> **Commit revisado:** `aff6b4c7`
> **Archivos cambiados:** 68 (+8908 / -2 líneas)

---

## Veredicto

### ⚠️ REQUEST CHANGES — 3 bloqueantes, 2 menores

El setup es sólido en su conjunto. La estructura de carpetas, el Prisma schema (13 tablas), las CSS variables, Docker, Zod env validation, Socket.io, 7 route stubs y todos los hooks/stores son correctos. Sin embargo, hay 3 discrepancias bloqueantes respecto a las especificaciones de `tech-stack.md` e issue #7 que deben resolverse antes del merge.

---

## Criterios de Aceptación (Issue #7): 6/8 PASS

| #   | Criterio                                   | Estado       | Detalle                                                                          |
| --- | ------------------------------------------ | ------------ | -------------------------------------------------------------------------------- |
| 1   | Frontend React 18 + Vite 5 + TS strict     | ✅ PASS      | `react ^18.3.1`, `vite ^5.4.11`, `tsconfig.json` → `"strict": true`              |
| 2   | Backend Node.js + Express + TS strict      | ✅ PASS      | `express 4.21.1`, `tsconfig.json` → `"strict": true`, target ES2022              |
| 3   | Docker Compose PostgreSQL 16               | ✅ PASS      | `postgres:16-alpine`, user=midgard, pass=midgard_dev, db=midgard_dev, port=5432  |
| 4   | Prisma migrate crea 13 tablas              | ⚠️ VER B-002 | 13 tablas presentes, pero `mission_troops` tiene PK incorrecto                   |
| 5   | Frontend fetch `GET /health`               | ✅ PASS      | Vite proxy `/api → localhost:3001`, endpoint `/api/health` presente y verificado |
| 6   | Todos los archivos compilan sin errores TS | ✅ PASS      | Ambos `tsconfig.json` con `strict: true`, `npx tsc --noEmit` 0 errores           |
| 7   | CSS Variables de style-guide.md            | ✅ PASS      | 165 líneas en `index.css` — paleta completa, spacing, fonts, breakpoints         |
| 8   | 6 JSON configs cargan en ambos lados       | ✅ PASS      | `gameData.ts` (backend, readFileSync) + `gameConfigs.ts` (frontend, Vite import) |

---

## Issues Bloqueantes (🔴)

### B-001 — `.tool-versions`: Node 22.17.1 vs Node 20 LTS

| Campo              | Valor                                                                                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Archivo**        | `.tool-versions`                                                                                                                                                                             |
| **Especificación** | tech-stack.md + issue #7: `Node.js 20 LTS`                                                                                                                                                   |
| **Implementación** | `ivm-node 22.17.1`                                                                                                                                                                           |
| **Impacto**        | Node 22 introduce breaking changes (V8 12.x, `--experimental-require-module`). El stack fue diseñado y testeado para Node 20 LTS. Discrepancia entre runtime de desarrollo y especificación. |

**Fix requerido:** Cambiar `.tool-versions` a `ivm-node 20.18.1` (última LTS 20.x estable).

---

### B-002 — `mission_troops` PK: UUID vs Composite

| Campo              | Valor                                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Archivo**        | `backend/src/database/schema.prisma` (modelo `MissionTroop`)                                                                                                                         |
| **Especificación** | tech-stack.md: tabla puente sin `id` propio. Issue #7: `mission_troops — mission FK, troop_type, count_sent, count_returned`                                                         |
| **Implementación** | `id UUID NOT NULL` como PK (`@id @default(uuid())`)                                                                                                                                  |
| **Impacto**        | Al tener UUID PK sin unique constraint en `(mission_id, troop_type)`, se permite insertar duplicados para la misma misión y tipo de tropa, lo cual es un bug de integridad de datos. |

**Fix requerido (elegir uno):**

1. Eliminar campo `id` y usar `@@id([missionId, troopType])` como composite PK (alineado con tech-stack.md)
2. Mantener UUID PK pero añadir `@@unique([missionId, troopType])` para prevenir duplicados

**Opción 1 recomendada** (consistente con el patrón de las demás tablas puente).

```prisma
// ANTES (actual)
model MissionTroop {
  id            String @id @default(uuid()) @db.Uuid
  missionId     String @map("mission_id") @db.Uuid
  troopType     String @map("troop_type") @db.VarChar(30)
  ...
}

// DESPUÉS (fix)
model MissionTroop {
  missionId     String @map("mission_id") @db.Uuid
  troopType     String @map("troop_type") @db.VarChar(30)
  countSent     Int    @map("count_sent")
  countReturned Int?   @map("count_returned")

  mission Mission @relation(fields: [missionId], references: [id])

  @@id([missionId, troopType])
  @@map("mission_troops")
}
```

---

### B-003 — Prisma 7.4.1 vs 5.x

| Campo              | Valor                                                                                                                                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Archivos**       | `backend/package.json`, `backend/prisma.config.ts`, `backend/src/config/database.ts`                                                                                                                            |
| **Especificación** | tech-stack.md tabla de stack: `Prisma 5 (ORM + migrations)`                                                                                                                                                     |
| **Implementación** | `@prisma/client: 7.4.1`, `prisma: 7.4.1`, `@prisma/adapter-pg`, `pg`                                                                                                                                            |
| **Impacto**        | Prisma 7 cambia fundamentalmente la arquitectura: usa `prisma.config.ts` en vez de inline config, requiere `@prisma/adapter-pg` + `pg` driver, el `datasource` en schema.prisma NO tiene `url`, APIs cambiaron. |

**Nota:** La implementación en `database.ts` es internamente consistente con Prisma 7 (usa `PrismaPg` adapter, `Pool` de `pg`, singleton pattern). El código es correcto para v7. El problema es la discrepancia documental.

**Fix requerido (elegir uno):**

| Opción | Acción                                          | Pros                                        | Contras                                        |
| ------ | ----------------------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| **A**  | Downgrade a Prisma 5 + reescribir `database.ts` | Alineado con docs, más estable              | Requiere cambios en schema + config            |
| **B**  | Actualizar tech-stack.md a Prisma 7             | Código ya listo, usa driver adapter moderno | Rompe spec, necesita aprobación de `@producer` |

**Recomendación:** Opción B — Prisma 7 es mejor técnicamente (driver adapters, TypeScript config), y el código ya lo implementa correctamente. Actualizar `tech-stack.md` línea de Prisma de `5` a `7`.

---

## Issues Menores (🟡)

### M-001 — Faltan archivos del backend: `ws/attackNotifier.ts`, `ws/chatHandler.ts`

| Campo              | Valor                                    |
| ------------------ | ---------------------------------------- |
| **Especificación** | tech-stack.md define 3 archivos en `ws/` |
| **Implementación** | Solo `socketServer.ts` presente          |

**Archivos faltantes:**

```
ws/
├── socketServer.ts      ✅ presente (41 líneas)
├── attackNotifier.ts    ❌ falta
└── chatHandler.ts       ❌ falta
```

**Fix:** Crear placeholders vacíos siguiendo el mismo patrón de los services.

---

### M-002 — Faltan archivos del frontend: `services/villageService.ts`, `services/troopsService.ts`

| Campo              | Valor                                                                            |
| ------------------ | -------------------------------------------------------------------------------- |
| **Especificación** | Issue #7: `src/services/ (api.ts, villageService, troopsService, socketService)` |
| **Implementación** | Solo `api.ts` y `socketService.ts` presentes                                     |

**Archivos faltantes:**

```
services/
├── api.ts              ✅ presente (35 líneas)
├── socketService.ts    ✅ presente (39 líneas)
├── villageService.ts   ❌ falta
└── troopsService.ts    ❌ falta
```

**Fix:** Crear placeholders vacíos.

---

## Verificación Detallada de Componentes

### Backend — Estructura de Carpetas

| Carpeta       | Archivos esperados (tech-stack.md)                        | Archivos presentes | Estado   |
| ------------- | --------------------------------------------------------- | ------------------ | -------- |
| `config/`     | env.ts, database.ts, gameData.ts                          | ✅ 3/3             | ✅ PASS  |
| `routes/`     | auth, villages, buildings, troops, combat, map, alliances | ✅ 7/7             | ✅ PASS  |
| `services/`   | production, building, combat, travel, alliance            | ✅ 5/5             | ✅ PASS  |
| `ws/`         | socketServer, attackNotifier, chatHandler                 | ⚠️ 1/3             | ⚠️ M-001 |
| `cron/`       | productionTick, missionResolver, cleanupJobs              | ✅ 3/3             | ✅ PASS  |
| `middleware/` | auth.ts, rateLimit.ts                                     | ✅ 2/2             | ✅ PASS  |
| `database/`   | schema.prisma, migrations/                                | ✅ 2/2             | ✅ PASS  |

### Frontend — Estructura de Carpetas

| Carpeta       | Archivos esperados (issue #7)                          | Archivos presentes | Estado   |
| ------------- | ------------------------------------------------------ | ------------------ | -------- |
| `components/` | buildings, resources, troops, combat, map, village, ui | ✅ 7/7 (.gitkeep)  | ✅ PASS  |
| `hooks/`      | useResources, useBuildings, useTroops, useWebSocket    | ✅ 4/4             | ✅ PASS  |
| `pages/`      | Village, WorldMap, Alliance, Auth                      | ✅ 4/4             | ✅ PASS  |
| `services/`   | api, socketService, villageService, troopsService      | ⚠️ 2/4             | ⚠️ M-002 |
| `store/`      | gameStore.ts, authStore.ts                             | ✅ 2/2             | ✅ PASS  |
| `config/`     | gameConfigs.ts                                         | ✅ 1/1             | ✅ PASS  |

### Prisma Schema — 13 Tablas

| Tabla              | PK              | Tipos                              | FKs                                    | Índices                         | Estado   |
| ------------------ | --------------- | ---------------------------------- | -------------------------------------- | ------------------------------- | -------- |
| `users`            | UUID            | VARCHAR(30/255), INT, TIMESTAMP    | —                                      | username UNIQUE, email UNIQUE   | ✅       |
| `villages`         | UUID            | VARCHAR(50), INT, TIMESTAMP        | owner→users                            | owner_id, (map_x,map_y)         | ✅       |
| `resources`        | UUID            | DECIMAL(10,2), TIMESTAMP           | village→villages                       | village_id UNIQUE               | ✅       |
| `buildings`        | UUID            | VARCHAR(30), INT, TIMESTAMP?       | village→villages                       | village_id                      | ✅       |
| `troops`           | UUID            | VARCHAR(30), INT, TIMESTAMP?       | village→villages                       | village_id                      | ✅       |
| `missions`         | UUID            | VARCHAR(20), TIMESTAMP, UUID?      | attacker→users, origin/target→villages | attacker_id, (status,arrive_at) | ✅       |
| `mission_troops`   | ⚠️ UUID         | VARCHAR(30), INT, INT?             | mission→missions                       | mission_id                      | ⚠️ B-002 |
| `battle_reports`   | UUID            | VARCHAR(10), INT, JSONB, TIMESTAMP | mission→missions                       | mission_id UNIQUE               | ✅       |
| `map_cells`        | (x,y)           | VARCHAR(20), UUID?, VARCHAR(30)?   | village→villages                       | village_id UNIQUE, cell_type    | ✅       |
| `alliances`        | UUID            | VARCHAR(30/4/500), UUID, TIMESTAMP | leader→users                           | name UNIQUE, tag UNIQUE         | ✅       |
| `alliance_members` | (alliance,user) | VARCHAR(20), TIMESTAMP             | alliance→alliances, user→users         | user_id UNIQUE                  | ✅       |
| `diplomacy`        | (a,b)           | VARCHAR(20), TIMESTAMP             | a→alliances, b→alliances               | —                               | ✅       |
| `oasis_claims`     | (x,y)           | UUID, VARCHAR(30), TIMESTAMP       | village→villages, (x,y)→map_cells      | village_id                      | ✅       |

**`reinforcements` correctamente excluido** (Fase 3) con nota en el schema. ✅

### Docker Compose

```yaml
# Verificado ✅
image: postgres:16-alpine # ✅ PostgreSQL 16
POSTGRES_USER: midgard # ✅ per tech-stack.md
POSTGRES_PASSWORD: midgard_dev # ✅
POSTGRES_DB: midgard_dev # ✅
port: "5432:5432" # ✅
volume: midgard_pgdata # ✅ persistido
```

### .env.example — Variables

| Variable                      | Valor                                                         | vs tech-stack.md | Estado |
| ----------------------------- | ------------------------------------------------------------- | ---------------- | ------ |
| `DATABASE_URL`                | `postgresql://midgard:midgard_dev@localhost:5432/midgard_dev` | ✅ match         | ✅     |
| `JWT_SECRET`                  | placeholder                                                   | ✅               | ✅     |
| `JWT_EXPIRES_IN`              | `7d`                                                          | ✅ match         | ✅     |
| `PORT`                        | `3001`                                                        | ✅ match         | ✅     |
| `NODE_ENV`                    | `development`                                                 | ✅               | ✅     |
| `WS_CORS_ORIGIN`              | `http://localhost:5173`                                       | ✅ match         | ✅     |
| `PRODUCTION_TICK_INTERVAL_MS` | `60000`                                                       | ✅ match         | ✅     |
| `MISSION_CHECK_INTERVAL_MS`   | `5000`                                                        | ✅ match         | ✅     |
| `BEGINNER_SHIELD_HOURS`       | `72`                                                          | ✅ match         | ✅     |

### CSS Variables (index.css — 165 líneas)

| Sección                   | Variables                   | vs style-guide.md                                | Estado |
| ------------------------- | --------------------------- | ------------------------------------------------ | ------ |
| Base UI Colors            | 10 variables                | Todos los hex coinciden                          | ✅     |
| Resource Colors           | 10 variables (5 pares)      | Todos los hex coinciden                          | ✅     |
| Status Colors             | 10 variables (5 pares)      | Todos los hex coinciden                          | ✅     |
| CTA / Button Colors       | 12 variables (4 × 3 states) | Todos los hex coinciden                          | ✅     |
| Faction / Map Colors      | 8 variables                 | Todos los hex coinciden                          | ✅     |
| Spacing                   | 6 variables (xs→2xl)        | ✅                                               | ✅     |
| Typography                | 4 font families             | Cinzel Decorative, Cinzel, Inter, JetBrains Mono | ✅     |
| Layout                    | 4 variables                 | sidebar, context-panel, resource-bar             | ✅     |
| Reset + Base              | box-sizing, body styles     | ✅                                               | ✅     |
| Google Fonts (index.html) | 4 families loaded           | ✅                                               | ✅     |

### Código — Calidad

| Check                          | Estado | Detalle                                                                                                          |
| ------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------- |
| TypeScript strict (backend)    | ✅     | `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`                             |
| TypeScript strict (frontend)   | ✅     | Mismas flags + `jsx: "react-jsx"`                                                                                |
| Path aliases `@/`              | ✅     | Ambos tsconfigs con `"@/*": ["src/*"]`                                                                           |
| Prisma tipos correctos         | ✅     | UUID, DECIMAL(10,2), JSONB, VARCHAR con sizes, TIMESTAMP(3)                                                      |
| No hardcoded values            | ✅     | Port, secrets, intervals todos vienen de env.ts via Zod                                                          |
| Health endpoint                | ✅     | `GET /api/health` → `{ status: "ok", game: "midgard-online", timestamp }`                                        |
| Security middleware            | ✅     | helmet(), cors(), rate limiter in-memory                                                                         |
| API routes match tech-stack.md | ✅     | 7 routers × endpoints correctos (auth: 3, villages: 2, buildings: 2, troops: 2, combat: 4, map: 2, alliances: 7) |
| Services stubs con JSDoc       | ✅     | 5 classes con descripción de responsabilidades                                                                   |
| Vite proxy config              | ✅     | `/api` → `localhost:3001`, `/socket.io` → `ws://localhost:3001`                                                  |
| React Query setup              | ✅     | QueryClient con staleTime 30s, retry 1                                                                           |
| Zustand stores                 | ✅     | gameStore (resources, buildings, troops, villageId) + authStore (token, user, login/register/logout)             |
| DEVLOG entry                   | ✅     | Entrada MO-01 presente con resumen completo                                                                      |
| .gitignore                     | ✅     | node_modules, .env, dist, .prisma cubiertos                                                                      |
| README.md                      | ✅     | Quick start guide (84 líneas)                                                                                    |

---

## Resumen de Acciones

| ID    | Severidad     | Archivo(s)                                   | Acción Requerida                                            |
| ----- | ------------- | -------------------------------------------- | ----------------------------------------------------------- |
| B-001 | 🔴 BLOQUEANTE | `.tool-versions`                             | Cambiar a Node 20 LTS (`ivm-node 20.18.1`)                  |
| B-002 | 🔴 BLOQUEANTE | `schema.prisma`, migration SQL               | `mission_troops` → composite PK `(mission_id, troop_type)`  |
| B-003 | 🔴 BLOQUEANTE | `package.json`, `database.ts`, tech-stack.md | Decidir: downgrade Prisma 5 o actualizar docs a Prisma 7    |
| M-001 | 🟡 MENOR      | `backend/src/ws/`                            | Crear `attackNotifier.ts` y `chatHandler.ts` placeholders   |
| M-002 | 🟡 MENOR      | `sandbox-web/src/services/`                  | Crear `villageService.ts` y `troopsService.ts` placeholders |

---

## Decisión

**⚠️ REQUEST CHANGES** — El PR no puede mergearse hasta resolver los 3 bloqueantes.

### Next Step

`@developer` debe:

1. Resolver B-001, B-002, B-003
2. Crear los 4 placeholders faltantes (M-001, M-002)
3. Regenerar migration (`npx prisma migrate dev --name fix-mission-troops-pk`)
4. Push y solicitar re-review a `@qa`

---

_Generado por `@qa` — 2026-02-24. Verificado contra issue #7 + tech-stack.md + style-guide.md._
