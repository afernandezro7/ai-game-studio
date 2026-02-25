# 🔧 Stack Técnico — Midgard Online

> Arquitectura completa del sistema: frontend, backend, base de datos, WebSocket y API endpoints.
> Referencia de diseño: [vision.md](vision.md) | Roadmap: [roadmap.md](roadmap.md)

---

## 🏛️ Resumen del Stack

| Capa              | Tecnología                     | Versión Target   | Justificación                                                      |
| ----------------- | ------------------------------ | ---------------- | ------------------------------------------------------------------ |
| **Frontend**      | React + Vite + TypeScript      | React 18, Vite 5 | SPA moderna, HMR rápido, tipado fuerte                             |
| **Backend**       | Node.js + Express + TypeScript | Node 22 LTS      | Ecosistema compartido con frontend, async nativo                   |
| **Base de datos** | PostgreSQL                     | PostgreSQL 16    | Relacional robusto para MMO (aldeas, tropas, mapa)                 |
| **ORM**           | Prisma                         | Prisma 7         | Type-safe, driver adapters, migraciones declarativas, DX excelente |
| **Real-time**     | Socket.io (WebSocket)          | Socket.io 4      | Notificaciones de ataques, chat, eventos en vivo                   |
| **Cache**         | Redis _(Fase 3+)_              | Redis 7          | Sesiones calientes, leaderboard, tick de producción                |
| **Auth**          | JWT + bcrypt                   | -                | Stateless, compatible con múltiples instancias                     |
| **Hosting**       | VPS / DigitalOcean + Docker    | -                | Escalable por servidor de juego, coste controlado                  |

---

## 🗂️ Estructura de Carpetas

```
games/midgard-online/
├── game.json                    # Manifest del juego
├── config/                      # JSON configs (source of truth para game data)
│   ├── BuildingsConfig.json
│   ├── ResourcesConfig.json
│   ├── TroopsConfig.json
│   ├── CombatConfig.json
│   ├── MapConfig.json
│   └── AlliancesConfig.json
├── docs/                        # GDD completo
│   ├── index.md                 # Índice de documentación
│   ├── vision.md
│   ├── economy.md
│   ├── buildings.md
│   ├── troops.md
│   ├── combat.md
│   ├── map.md
│   ├── alliances.md
│   ├── roadmap.md
│   ├── tech-stack.md            # Este archivo
│   └── art/
│       └── style-guide.md
│
├── sandbox-web/                 # React frontend (ES EL JUEGO)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/          # UI components reutilizables
│       │   ├── village/         # Grid de edificios, slots de recursos
│       │   ├── resources/       # Barras y contadores de recursos
│       │   ├── buildings/       # Cards de edificio, panel de upgrade
│       │   ├── troops/          # Panel de cuartel, lista de tropas
│       │   ├── combat/          # Panel de ataque, selector de tropas
│       │   ├── map/             # Vista del mapa mundial
│       │   └── ui/              # Buttons, modals, timers, tooltips
│       ├── hooks/               # Game logic hooks (React Query + custom)
│       │   ├── useResources.ts
│       │   ├── useBuildings.ts
│       │   ├── useTroops.ts
│       │   └── useWebSocket.ts
│       ├── pages/               # Vistas principales
│       │   ├── Village.tsx      # Vista de aldea (principal)
│       │   ├── WorldMap.tsx     # Mapa del mundo
│       │   ├── Alliance.tsx     # Panel de alianza
│       │   └── Auth.tsx         # Login / Registro
│       ├── services/            # API clients + WebSocket
│       │   ├── api.ts           # Axios client base
│       │   ├── villageService.ts
│       │   ├── troopsService.ts
│       │   └── socketService.ts
│       ├── store/               # Estado global (Zustand)
│       │   ├── gameStore.ts     # Estado del juego en tiempo real
│       │   └── authStore.ts
│       └── config/              # JSON game configs cargados
│           └── gameConfigs.ts   # Re-exports de todos los JSONs
│
└── backend/                     # Node.js server
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts             # Entry point + Express setup
        ├── config/              # Server config + JSON game data
        │   ├── database.ts      # Prisma client singleton
        │   ├── gameData.ts      # Carga BuildingsConfig, TroopsConfig, etc.
        │   └── env.ts           # Variables de entorno validadas
        ├── routes/              # REST API endpoints
        │   ├── auth.ts          # POST /auth/register, /auth/login
        │   ├── villages.ts      # GET/POST /villages
        │   ├── buildings.ts     # POST /buildings/upgrade
        │   ├── troops.ts        # POST /troops/train
        │   ├── combat.ts        # POST /combat/attack
        │   ├── map.ts           # GET /map/cells
        │   └── alliances.ts     # GET/POST/PUT /alliances
        ├── services/            # Game logic (sin acceso directo a DB)
        │   ├── productionService.ts   # Tick de producción de recursos
        │   ├── buildingService.ts     # Validación + lógica de upgrade
        │   ├── combatService.ts       # Resolución de combate
        │   ├── travelService.ts       # Cálculo de tiempo de viaje
        │   └── allianceService.ts     # Lógica de alianzas
        ├── ws/                  # WebSocket handlers
        │   ├── socketServer.ts  # Setup de Socket.io
        │   ├── attackNotifier.ts
        │   └── chatHandler.ts
        ├── cron/                # Tareas periódicas (node-cron)
        │   ├── productionTick.ts  # Cada 60s: sumar producción
        │   ├── missionResolver.ts # Cada 5s: revisar tropas en viaje
        │   └── cleanupJobs.ts     # Diario: limpieza de datos antiguos
        ├── middleware/
        │   ├── auth.ts          # Verificación JWT
        │   └── rateLimit.ts     # Rate limiting por usuario
        └── database/
            ├── schema.prisma    # Schema Prisma (source of truth)
            └── migrations/      # Migraciones SQL generadas por Prisma
```

---

## 🗄️ Esquema de Base de Datos

### Diagrama de Entidades (simplificado)

```mermaid
erDiagram
    USERS ||--o{ VILLAGES : "owns"
    VILLAGES ||--o{ BUILDINGS : "has"
    VILLAGES ||--o{ TROOPS : "stations"
    VILLAGES ||--o{ RESOURCES : "stores"
    USERS ||--o{ ALLIANCE_MEMBERS : "belongs to"
    ALLIANCES ||--o{ ALLIANCE_MEMBERS : "contains"
    ALLIANCES ||--o{ DIPLOMACY : "has relations"
    MISSIONS ||--o{ MISSION_TROOPS : "carries"
    VILLAGES ||--o{ MISSIONS : "origin/target"
    MAP_CELLS ||--o{ VILLAGES : "occupies"
    MAP_CELLS ||--o{ OASIS_CLAIMS : "claimed by"
    VILLAGES ||--o{ OASIS_CLAIMS : "claims"
    VILLAGES ||--o{ REINFORCEMENTS : "hosts"
    USERS ||--o{ REINFORCEMENTS : "owns troops"
```

### Tablas Principales

#### `users`

| Columna         | Tipo         | Descripción                   |
| --------------- | ------------ | ----------------------------- |
| `id`            | UUID PK      | Identificador único           |
| `username`      | VARCHAR(30)  | Único, display name           |
| `email`         | VARCHAR(255) | Único, para login             |
| `password_hash` | VARCHAR(255) | bcrypt hash                   |
| `runes`         | INTEGER      | Moneda premium (default: 50)  |
| `created_at`    | TIMESTAMP    | Fecha de registro             |
| `last_login`    | TIMESTAMP    | Para detección de inactividad |

#### `villages`

| Columna      | Tipo        | Descripción                               |
| ------------ | ----------- | ----------------------------------------- |
| `id`         | UUID PK     |                                           |
| `owner_id`   | UUID FK     | → users.id                                |
| `name`       | VARCHAR(50) | Nombre de la aldea                        |
| `map_x`      | INTEGER     | Coordenada X en el mapa (-200 a 200)      |
| `map_y`      | INTEGER     | Coordenada Y en el mapa (-200 a 200)      |
| `population` | INTEGER     | Suma de population de todos los edificios |
| `created_at` | TIMESTAMP   |                                           |

#### `resources`

| Columna        | Tipo          | Descripción                         |
| -------------- | ------------- | ----------------------------------- |
| `id`           | UUID PK       |                                     |
| `village_id`   | UUID FK       | → villages.id                       |
| `wood`         | DECIMAL(10,2) | Madera almacenada                   |
| `clay`         | DECIMAL(10,2) | Arcilla almacenada                  |
| `iron`         | DECIMAL(10,2) | Hierro almacenado                   |
| `wheat`        | DECIMAL(10,2) | Trigo almacenado                    |
| `last_updated` | TIMESTAMP     | Último tick de producción procesado |

#### `buildings`

| Columna             | Tipo        | Descripción                                    |
| ------------------- | ----------- | ---------------------------------------------- |
| `id`                | UUID PK     |                                                |
| `village_id`        | UUID FK     | → villages.id                                  |
| `building_type`     | VARCHAR(30) | ID del edificio (ej: `woodcutter`, `barracks`) |
| `slot_index`        | INTEGER     | Slot en el grid de la aldea (0–37)             |
| `level`             | INTEGER     | Nivel actual (0 = no construido)               |
| `upgrade_finish_at` | TIMESTAMP   | NULL si no en construcción                     |

#### `troops`

| Columna              | Tipo        | Descripción                                    |
| -------------------- | ----------- | ---------------------------------------------- |
| `id`                 | UUID PK     |                                                |
| `village_id`         | UUID FK     | → villages.id (aldea donde están estacionadas) |
| `troop_type`         | VARCHAR(30) | ID de la tropa (ej: `berserker`, `ulfhednar`)  |
| `count`              | INTEGER     | Cantidad de esta tropa en la aldea             |
| `training_finish_at` | TIMESTAMP   | NULL si no en entrenamiento                    |

#### `missions`

| Columna            | Tipo        | Descripción                              |
| ------------------ | ----------- | ---------------------------------------- |
| `id`               | UUID PK     |                                          |
| `attacker_id`      | UUID FK     | → users.id                               |
| `origin_village`   | UUID FK     | → villages.id                            |
| `target_village`   | UUID FK     | → villages.id                            |
| `mission_type`     | VARCHAR(20) | `attack`, `raid`, `siege`, `reinforce`   |
| `depart_at`        | TIMESTAMP   | Hora de salida                           |
| `arrive_at`        | TIMESTAMP   | Hora de llegada (calculada)              |
| `status`           | VARCHAR(20) | `traveling`, `completed`, `returning`    |
| `battle_report_id` | UUID FK     | → battle_reports.id (una vez completada) |

#### `mission_troops`

| Columna          | Tipo        | Descripción            |
| ---------------- | ----------- | ---------------------- |
| `mission_id`     | UUID FK     | → missions.id          |
| `troop_type`     | VARCHAR(30) |                        |
| `count_sent`     | INTEGER     |                        |
| `count_returned` | INTEGER     | NULL hasta que regresa |

#### `battle_reports`

| Columna           | Tipo        | Descripción                             |
| ----------------- | ----------- | --------------------------------------- |
| `id`              | UUID PK     |                                         |
| `mission_id`      | UUID FK     |                                         |
| `winner`          | VARCHAR(10) | `attacker` o `defender`                 |
| `attacker_atk`    | INTEGER     | ATK total del atacante                  |
| `defender_def`    | INTEGER     | DEF efectiva del defensor (con muralla) |
| `loot`            | JSONB       | `{wood, clay, iron, wheat}` saqueado    |
| `attacker_losses` | JSONB       | `{berserker: 12, ulfhednar: 3, ...}`    |
| `defender_losses` | JSONB       |                                         |
| `created_at`      | TIMESTAMP   |                                         |

#### `map_cells`

| Columna      | Tipo        | Descripción                                       |
| ------------ | ----------- | ------------------------------------------------- |
| `x`          | INTEGER     | Coordenada X (-200 a 200)                         |
| `y`          | INTEGER     | Coordenada Y (-200 a 200)                         |
| `cell_type`  | VARCHAR(20) | `empty`, `player_village`, `oasis`, `npc_village` |
| `village_id` | UUID FK     | → villages.id (si cell_type = `player_village`)   |
| `oasis_type` | VARCHAR(30) | ID del tipo de oasis (si cell_type = `oasis`)     |
| PK           |             | `(x, y)` — clave compuesta                        |

#### `alliances`

| Columna       | Tipo         | Descripción        |
| ------------- | ------------ | ------------------ |
| `id`          | UUID PK      |                    |
| `name`        | VARCHAR(30)  | Único              |
| `tag`         | VARCHAR(4)   | Único, ej: `[VKG]` |
| `description` | VARCHAR(500) |                    |
| `leader_id`   | UUID FK      | → users.id         |
| `created_at`  | TIMESTAMP    |                    |

#### `alliance_members`

| Columna       | Tipo        | Descripción                        |
| ------------- | ----------- | ---------------------------------- |
| `alliance_id` | UUID FK     | → alliances.id                     |
| `user_id`     | UUID FK     | → users.id                         |
| `role`        | VARCHAR(20) | `jarl`, `thane`, `hirdman`, `karl` |
| `joined_at`   | TIMESTAMP   |                                    |
| PK            |             | `(alliance_id, user_id)`           |

#### `diplomacy`

| Columna         | Tipo        | Descripción                           |
| --------------- | ----------- | ------------------------------------- |
| `alliance_a_id` | UUID FK     | → alliances.id                        |
| `alliance_b_id` | UUID FK     | → alliances.id                        |
| `state`         | VARCHAR(20) | `allied`, `nap`, `neutral`, `enemy`   |
| `changed_at`    | TIMESTAMP   | Para calcular cooldowns de transición |
| PK              |             | `(alliance_a_id, alliance_b_id)`      |

#### `oasis_claims`

> Registra qué aldea ha reclamado cada oasis. Un oasis solo puede ser reclamado por una aldea a la vez.

| Columna      | Tipo        | Descripción                                               |
| ------------ | ----------- | --------------------------------------------------------- |
| `village_id` | UUID FK     | → villages.id (aldea reclamante)                          |
| `oasis_x`    | INTEGER     | Coordenada X del oasis                                    |
| `oasis_y`    | INTEGER     | Coordenada Y del oasis                                    |
| `oasis_type` | VARCHAR(30) | ID del tipo de oasis (ej: `wood_forest`, `golden_plains`) |
| `claimed_at` | TIMESTAMP   | Fecha de reclamación                                      |
| PK           |             | `(oasis_x, oasis_y)` — un oasis solo tiene un dueño       |

#### `reinforcements` _(Fase 3)_

> Tropas estacionadas en una aldea ajena (refuerzos de aliados). Separadas de `troops` para distinguir entre tropas propias y foráneas.

| Columna          | Tipo        | Descripción                                           |
| ---------------- | ----------- | ----------------------------------------------------- |
| `id`             | UUID PK     |                                                       |
| `owner_id`       | UUID FK     | → users.id (dueño de las tropas)                      |
| `origin_village` | UUID FK     | → villages.id (aldea de origen)                       |
| `host_village`   | UUID FK     | → villages.id (aldea donde están estacionadas)        |
| `troop_type`     | VARCHAR(30) | ID de la tropa                                        |
| `count`          | INTEGER     | Cantidad de tropas en refuerzo                        |
| `sent_at`        | TIMESTAMP   |                                                       |
| INDEX            |             | `(host_village)` — para sumar DEF al resolver combate |

---

## 🔌 API Endpoints (REST)

### Autenticación

| Método | Endpoint         | Body                          | Respuesta       |
| ------ | ---------------- | ----------------------------- | --------------- |
| POST   | `/auth/register` | `{username, email, password}` | `{token, user}` |
| POST   | `/auth/login`    | `{email, password}`           | `{token, user}` |
| GET    | `/auth/me`       | —                             | `{user}`        |

### Aldeas

| Método | Endpoint                  | Descripción                           |
| ------ | ------------------------- | ------------------------------------- |
| GET    | `/villages/:id`           | Estado completo de la aldea           |
| GET    | `/villages/:id/resources` | Recursos actuales (con tick aplicado) |

### Edificios

| Método | Endpoint                 | Body                        | Descripción                  |
| ------ | ------------------------ | --------------------------- | ---------------------------- |
| POST   | `/buildings/upgrade`     | `{villageId, buildingType}` | Iniciar construcción/upgrade |
| DELETE | `/buildings/upgrade/:id` | —                           | Cancelar construcción activa |

### Tropas

| Método | Endpoint             | Body                            | Descripción                 |
| ------ | -------------------- | ------------------------------- | --------------------------- |
| POST   | `/troops/train`      | `{villageId, troopType, count}` | Encolar entrenamiento       |
| GET    | `/troops/:villageId` | —                               | Tropas disponibles en aldea |

### Combate

| Método | Endpoint              | Body                                     | Descripción                  |
| ------ | --------------------- | ---------------------------------------- | ---------------------------- |
| POST   | `/combat/send`        | `{originId, targetId, type, troops: {}}` | Enviar misión militar        |
| GET    | `/combat/missions`    | —                                        | Misiones activas del jugador |
| GET    | `/combat/reports`     | —                                        | Historial de reportes        |
| GET    | `/combat/reports/:id` | —                                        | Detalle de un reporte        |

### Mapa

| Método | Endpoint          | Params       | Descripción                      |
| ------ | ----------------- | ------------ | -------------------------------- |
| GET    | `/map/cells`      | `x,y,radius` | Celdas del mapa en un radio dado |
| GET    | `/map/cell/:x/:y` | —            | Detalle de una celda específica  |

### Alianzas

| Método | Endpoint                   | Descripción                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/alliances`               | Listar todas las alianzas  |
| GET    | `/alliances/:id`           | Detalle de una alianza     |
| POST   | `/alliances`               | Crear nueva alianza        |
| POST   | `/alliances/:id/join`      | Solicitar unirse           |
| POST   | `/alliances/:id/invite`    | Invitar jugador            |
| PUT    | `/alliances/:id/diplomacy` | Cambiar estado diplomático |
| DELETE | `/alliances/:id/leave`     | Abandonar alianza          |

---

## 📡 Eventos WebSocket

| Evento (servidor → cliente) | Payload                          | Descripción                        |
| --------------------------- | -------------------------------- | ---------------------------------- |
| `attack:incoming`           | `{attacker, troops, arriveAt}`   | Alerta de ataque entrante          |
| `attack:resolved`           | `{reportId, winner, loot}`       | Combate resuelto                   |
| `building:complete`         | `{buildingType, newLevel}`       | Construcción finalizada            |
| `troops:trained`            | `{troopType, count}`             | Entrenamiento completado           |
| `resources:tick`            | `{wood, clay, iron, wheat}`      | Tick de producción (cada 60s)      |
| `alliance:chat`             | `{playerId, message, timestamp}` | Mensaje de chat de alianza         |
| `alliance:member_attacked`  | `{player, village, attacker}`    | Notif.: miembro de alianza atacado |

---

## ⚙️ Configuración de Entorno

### Variables de Entorno (`.env`)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/midgard_dev"

# Auth
JWT_SECRET="your-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# WebSocket
WS_CORS_ORIGIN="http://localhost:5173"

# Game Config
PRODUCTION_TICK_INTERVAL_MS=60000    # 60 segundos
MISSION_CHECK_INTERVAL_MS=5000       # 5 segundos
BEGINNER_SHIELD_HOURS=72
```

---

## 🏗️ Arquitectura de la Lógica de Producción

El sistema más crítico del juego: **calcular cuántos recursos produce una aldea desde el último tick**.

```
Cada 60 segundos (productionTick.ts):
  1. Para cada aldea activa:
     a. Calcular deltaT = now - resources.last_updated (segundos)
     b. Para cada recurso (wood, clay, iron, wheat):
        - prodPerHour = Σ(building.level × productionPerHour[level]) por tipo
        - newAmount = current + (prodPerHour / 3600) × deltaT
        - capAmount = min(newAmount, storageCapacity)
     c. Calcular consumo de trigo: wheatConsumed = totalTroops × consumption/h × deltaT/3600
     d. wheat_new = max(0, wheat - wheatConsumed)
     e. Si wheat_new === 0: activar deserción proporcional
     f. UPDATE resources SET wood=X, clay=Y, iron=Z, wheat=W, last_updated=NOW()
```

---

## 🔒 Seguridad y Anti-Exploit

| Tipo de Exploit          | Mitigación                                                                   |
| ------------------------ | ---------------------------------------------------------------------------- |
| Overflow de recursos     | `productionStopsOnFullStorage = true`; cap en DB                             |
| Raid doble instantáneo   | Rate limit en POST `/combat/send`; mínimo 30s entre misiones al mismo target |
| Manipulación de timers   | Todos los timers calculados y verificados en el servidor                     |
| Compra de tropas directa | Las Runas no pueden comprarse en el endpoint de tropas                       |
| Saqueo > 50% de recursos | `maxRaidPercent = 50` verificado en `combatService.ts`                       |

---

## 📌 Next Step

> **@artdirector** debe definir el estilo visual (paleta, wireframes, iconografía) en `docs/art/style-guide.md`.

---

_Diseñado por `@producer`. Documentado por `@archivist` — 2026-02-23._
