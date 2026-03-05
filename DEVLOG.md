# 📜 AI Game Studio - Bitácora de Desarrollo (Development Log)

Este documento sirve como registro histórico (changelog narrativo) de todas las acciones, decisiones y evoluciones del estudio. Su objetivo es mantener el contexto del proyecto para que cualquier agente (humano o IA) pueda retomar el trabajo en cualquier momento.

> **⚠️ REGLA PARA TODOS LOS AGENTES:**
> Cada vez que completes una tarea significativa (crear un documento, diseñar una mecánica, generar código), **DEBES** añadir una entrada al final de este archivo explicando qué hiciste y por qué.

---

## 📅 Historial de Progreso

### [2026-02-20] - Migración a Arquitectura Declarativa y Project Valhalla

**Autor:** `@producer`, `@gamedesign`, `@archivist`, `@qa`, `@release`, `@developer`, `@artdirector` (Coordinado por Orchestrator)

1.  **Fundación del Estudio:**
    - Se eliminó el sistema anterior basado en código TypeScript imperativo.
    - Se adoptó una arquitectura declarativa basada en agentes Markdown (`.github/agents/`).
    - Se definieron las Reglas Globales y Plantillas de Issues.

2.  **Project Valhalla (Idea Original):**
    - `@producer` propuso un juego de estrategia vikingo tipo _Clash of Clans_.
    - **Visión:** Mitología nórdica, gestión de recursos, PvP asimétrico.

3.  **Diseño y Economía:**
    - `@gamedesign` definió la economía inicial (Madera, Acero, Runas).
    - Se diseñaron los primeros 3 niveles del Gran Salón, Aserradero y Mina.
    - `@qa` detectó un **Soft-Lock** grave en la economía inicial (coste cruzado de recursos).
    - `@gamedesign` aplicó un fix: Cambiamos costes a solo Madera y añadimos producción pasiva al Gran Salón.

4.  **Documentación (GDD):**
    - `@archivist` consolidó todo en la carpeta `docs/`.
    - Se creó `docs/economy-and-buildings.md` como referencia unificada.
    - `@release` generó el Roadmap para la v0.1.0 y v1.0.0.

5.  **Evolución Técnica y Artística:**
    - **Nace `@developer`:** Generó `src/config/ResourcesConfig.json` y `BuildingsConfig.json` basados en el GDD. El juego ya tiene datos reales.
    - **Nace `@artdirector`:** Añadió un diagrama Mermaid del Core Loop en `docs/vision.md` para visualizar el flujo de juego.

---

## 🚀 Estado Actual (Snapshot)

- **Proyecto Activo:** Project Valhalla
- **Fase:** Pre-producción / Prototipado de Datos
- **Agentes Activos:** 7 (Producer, GameDesign, Archivist, QA, Release, Developer, ArtDirector)
- **Siguientes Pasos Pendientes:**
  - Prototipar el cliente de juego (Unity/Godot) usando los JSONs generados.

### [2026-02-20] - Implementación de CI/CD completa

**Autor:** `@developer`

1.  **Infraestructura de Automatización:**
    - Se ha implementado `sanity-check.yml` en `.github/workflows/`.
    - Ahora cada Push verifica automáticamente:
      - Validez JSON de los archivos `src/config/*.json`.
      - Links rotos en la documentación `docs/*.md`.
    - Estado: **COMPLETADO**.

### [2025-06-25] - CI/CD Profesional inspirado en Zara Web

**Autor:** `@developer`, `@release`

1.  **Workflows de GitHub Actions (3 ficheros):**
    - `develop-ci.yml` — CI en develop: validación JSON, E2E con Playwright, link-check. Concurrency group.
    - `release-manager.yml` — Release automatizado al merge a main: bump de versión por label (`release:major/minor/patch`), GitHub Release con notas auto-generadas, deploy a GitHub Pages, sync PR main→develop.
    - `release-preview.yml` — Comentario sticky en PRs a main mostrando preview de versión, commits incluidos y checklist.

2.  **Fixes aplicados:**
    - `.npmrc` para evitar registry privado.
    - `package-lock.json` regenerado sin paths locales `.asdf`.
    - `cache-dependency-path` corregido en todos los workflows (apunta a root, no a `client-web/`).

3.  **Labels creados:** `release:major`, `release:minor`, `release:patch`, `skip-release`, `sync`.

### [2025-06-25] - Upgrade del Sistema de Agentes v2.0

**Autor:** `@producer` (decisión estratégica)

Se realizó una reescritura completa de los 7 agentes del estudio para convertirlos en herramientas más potentes y autónomas:

1.  **Agentes Reescritos (`.github/agents/`):**
    - `@producer` — Framework de decisión con scoring ponderado (retention 30%, monetization 25%, dev cost 20%, fun 25%). Análisis de competidores y KPI targets.
    - `@gamedesign` — Fórmulas de balance integradas (curva de costes, curva de tiempos, ratio de producción). Golden Rules: 72h rule, 3:1 sink ratio, first session rule, no dead ends.
    - `@archivist` — Cross-reference automático docs↔JSON configs. Detección de mismatches. Checklist de consistencia.
    - `@qa` — Checklist de Validación de 5 Puntos (soft-lock, inflación, time-wall, dependencia cruzada, FTUE). Simulación hora-por-hora con 4 arquetipos de jugador.
    - `@developer` — Arquitectura target (engine/, components/, hooks/, config/). Coding standards. Política zero `@ts-ignore`. Tipos TypeScript para configs JSON.
    - `@artdirector` — Paleta de colores Valhalla (8 colores hex). Template de arte para IA generativa. Progresión visual por nivel (L1 simple → L10 legendario).
    - `@release` — Proceso GitFlow completo. Pre-release checklist. Integración con workflows de CI/CD. Template de release notes.

2.  **Prompts Reutilizables (`.github/prompts/`):**
    - `new-mechanic` — Pipeline completo para nueva mecánica (6 agentes en cadena).
    - `add-building` — Diseño + implementación end-to-end de nuevo edificio.
    - `balance-audit` — Auditoría QA con simulación de 4 perfiles de jugador.
    - `prepare-release` — Coordinación multi-agente para release.
    - `studio-status` — Reporte de estado del proyecto completo.

3.  **Copilot Instructions (`.github/copilot-instructions.md`):**
    - Contexto global del proyecto para que Copilot entienda la arquitectura.

4.  **Studio Rules actualizado (`.github/instructions/studio-rules.md`):**
    - Pipeline de agentes documentado con tabla de prompts disponibles.

### [2026-02-20] - Unity Integration Layer + Plataforma Target

**Autor:** `@developer`, `@producer`

Se establece **Unity** como el motor target para producción (Play Store + App Store). El web sandbox se mantiene para testing rápido.

1.  **C# Data Models (`src/unity/Models/`):**
    - `ResourceData.cs` — Mapea `ResourcesConfig.json` directamente a C# classes con `[Serializable]`.
    - `BuildingData.cs` — Mapea `BuildingsConfig.json` incluyendo all nested objects (costs, storage, production).
    - `GameState.cs` — Runtime player state: recursos, edificios, timestamps para producción offline.

2.  **Core Game Systems (`src/unity/Core/`):**
    - `ConfigLoader.cs` — Singleton que carga JSON configs desde `Resources/Config/`. Métodos de acceso por ID.
    - `ProductionSystem.cs` — Cálculo de producción total, earnings offline (cap 8h), storage caps. Pure logic sin dependencia de UI.
    - `BuildingSystem.cs` — Ciclo completo de upgrade: validación, deducción de recursos, timer, speed-up con Runas, creación de new game.

3.  **Guía de integración (`docs/unity-guide.md`):**
    - Setup detallado: crear proyecto Unity, importar configs, estructura de carpetas, GameManager de ejemplo.
    - Instrucciones de publicación en Google Play (AAB) y App Store (Xcode archive).
    - Script de sincronización de configs.

4.  **Roadmap actualizado (`docs/roadmap.md`):**
    - Nueva Fase 1.5: Unity Setup (v0.2.0) entre prototipo web y soft launch.

5.  **Documentación actualizada para reflejar plataforma target:**
    - `copilot-instructions.md`, `studio-rules.md`, `developer.agent.md`, `artdirector.agent.md`, `vision.md`, `README.md` — Todos actualizados para dejar claro: web = sandbox, Unity = producción.

### [2026-02-20] - Art Direction + Unity UI Scripts

**Autor:** `@artdirector`, `@developer`

1.  **Art Prompts para Assets (`docs/art/building-prompts.md`):**
    - Prompts Midjourney/DALL-E optimizados para los 3 edificios × 3 niveles (9 prompts de edificios).
    - 5 prompts adicionales: iconos de recursos (madera, acero, runas), botón upgrade, background tile.
    - Especificaciones técnicas: isométrico, 1024×1024, fondo transparente, estilo Clash of Clans.
    - Guía de progresión visual: L1 madera simple → L3 piedra+runas brillantes.

2.  **Unity UI Scripts (`src/unity/UI/`):**
    - `ResourceBarUI.cs` — Barra superior con madera/acero/runas + rate de producción. Flash rojo cuando no puedes pagar.
    - `BuildingCardUI.cs` — Tarjeta de edificio: sprite, nombre, nivel, producción, botón upgrade con coste, timer de construcción con slider, speed-up con runas.
    - `GameHUD.cs` — Controlador principal de UI: conecta ResourceBar + BuildingCards + sistemas de juego. Producción cada segundo, auto-save cada 30s, popup de offline earnings.

---

### [2026-02-21] - Multi-Game + Multi-Engine Restructure

**Autor:** `@developer`, `@producer`

1.  **Arquitectura Multi-Juego:**
    - Nuevo directorio `games/` — cada juego es un subfolder con su propio `game.json`, configs, docs y código por motor.
    - Project Valhalla migrado a `games/valhalla/` con estructura: `config/`, `docs/`, `roblox/`, `unity/`.
    - `game.json` actualizado con soporte multi-motor: `engines.roblox` (active) + `engines.unity` (planned).

2.  **Agentes Específicos por Motor:**
    - `@developer` convertido en **router/arquitecto** — delega a agentes especializados.
    - `@developer-roblox` — Nuevo agente para Luau, Roblox Studio MCP, DataStoreService, RemoteEvents.
    - `@developer-unity` — Nuevo agente para C#, ScriptableObjects, mobile optimization.
    - La arquitectura permite añadir `@developer-godot` en el futuro sin acoplamiento.

3.  **Roblox Luau Scripts (`games/valhalla/roblox/src/`):**
    - `ConfigLoader.luau` — Carga JSON configs desde StringValues en ServerStorage.
    - `ProductionSystem.luau` — Producción de recursos en tiempo real, offline earnings (cap 8h), storage caps.
    - `BuildingSystem.luau` — Upgrades, validación de costes, timers, speed-up con Runas.
    - `GameServer.luau` — Script principal del servidor: DataStoreService, RemoteEvents, tick loop (1s), auto-save (60s).
    - `GameClient.luau` — UI completa: barra de recursos, tarjetas de edificios, popup de ganancias offline.

4.  **Actualización de Agentes Core:**
    - Todos los agentes (`@producer`, `@gamedesign`, `@archivist`, `@qa`, `@artdirector`) actualizados con rutas `games/<game-id>/`.
    - Rutas antiguas (`src/config/`, `docs/`) eliminadas de todos los agentes.
    - `copilot-instructions.md` reescrito para reflejar la nueva arquitectura.

5.  **Integración Roblox Studio MCP:**
    - MCP `robloxstudio-mcp` configurado en VS Code para comunicación directa con Roblox Studio.
    - `@developer-roblox` documenta workflow completo: create_object → set_script_source → start_playtest → validate.
    - Objetivo: desarrollo con mínima interacción humana.

---

### [2026-02-23] - Midgard Online: Concepto Aprobado por Producer

**Autor:** `@producer`

1.  **Análisis de Mercado Completado:**
    - Se evaluaron 5 competidores directos (Travian, Tribal Wars, Ikariam, OGame, Grepolis).
    - Oportunidad identificada: todos los competidores usan tech de 2004-2010. Stack moderno (React + Node.js + WebSocket) como diferenciador clave.
    - Temática nórdica en pico de resonancia cultural (Vikings, God of War, AC Valhalla).

2.  **Vision Document Creado (`games/midgard-online/docs/vision.md`):**
    - Core Loop definido: Producir → Construir → Entrenar → Atacar → Saquear → Expandir.
    - X-Factor Score: **17/20** (aprobado, umbral 12/20).
    - Producer Score: **75.5%** (aprobado, umbral 70%).

3.  **KPIs Target Definidos:**
    - Retención: D1 35%, D7 18%, D30 10%.
    - Monetización: ARPDAU $0.08, Conversion 3%, LTV $8.
    - Modelo F2P ético: Runas de Odín como premium currency, nunca pay-to-win.

4.  **Roadmap en 4 Fases:**
    - Fase 1 (v0.1.0): Fundación — recursos y edificios de producción.
    - Fase 2 (v0.2.0): Combate — tropas, PvP, mapa del mundo.
    - Fase 3 (v0.3.0): Social — alianzas, chat, diplomacia, segunda aldea.
    - Fase 4 (v1.0.0): Monetización & Polish — premium currency, Battle Pass, onboarding.

5.  **Siguiente Paso:** `@gamedesign` debe diseñar el sistema de recursos y edificios de producción (Paso 2 del pipeline-playbook).

---

### [2026-02-23] - Midgard Online: Sistema de Recursos y Edificios Completo (Paso 2)

**Autor:** `@gamedesign`

1.  **Sistema de 4 Recursos Diseñado:**
    - Madera (Viðr), Arcilla (Leir), Hierro (Járn), Trigo (Korn).
    - Asimetría intencional: Hierro produce 17% menos (base 25/h vs 30/h) — se convierte en recurso estratégico.
    - Trigo es recurso de mantenimiento: consumido por población y tropas cada hora.
    - Distribución Travian-style: 4-4-4-6 campos por aldea (18 resource slots).

2.  **7 Edificios con Tablas de Balance (Niveles 1-10):**
    - **Campos de recursos:** Leñador de Yggdrasil, Cantera de Midgard, Mina de Hierro Enano, Granja de Freya.
    - **Infraestructura:** Gran Salón (reduce -3% tiempo/nivel, desbloquea edificios), Almacén (cap W/C/I), Granero (cap Trigo).
    - Cada tabla incluye: 4 costes, tiempo de construcción, producción/h, población.

3.  **Fórmulas Explícitas:**
    - Producción: `base × 1.405^(nivel-1)` — ×21.3 de L1 a L10.
    - Costes: `base × 1.585^(nivel-1)` — ×63.1 de L1 a L10 (costes crecen 3× más rápido que producción).
    - Tiempo: `base × 1.55^(nivel-1)` — L1=3m a L10=2h35m para campos.
    - Gran Salón: -3% por nivel (máx -30% a L10).

4.  **Análisis de Progresión:**
    - Day 1: 6+ acciones en primeros 25 min. Campos L1-2.
    - Day 3-5: Todos los campos L5 (~16h de build time).
    - Day 25-40: Todos los campos L10 (~112h con GS L10).
    - Balance de trigo: Se vuelve negativo a ~2,000 tropas — intencional, fuerza multi-aldea.

5.  **Archivos Creados:**
    - `games/midgard-online/docs/economy.md` — Sistema económico completo.
    - `games/midgard-online/docs/buildings.md` — Tablas de todos los edificios.
    - `games/midgard-online/config/ResourcesConfig.json` — JSON config de recursos.
    - `games/midgard-online/config/BuildingsConfig.json` — JSON config de 7 edificios × 10 niveles.

6.  **Siguiente Paso:** `@archivist` debe integrar en documentación oficial. `@qa` debe validar balance, soft-locks, y progresión temporal.

---

### [2026-02-23] - Paso 3: Tropas y Sistema de Combate — Midgard Online

**Autor:** `@gamedesign`
**Pipeline:** Paso 3 de `pipeline-playbook.md`

1.  **8 Tropas Nórdicas Diseñadas:**
    - **Infantería (Cuartel):** Bóndi (ATK 40, raider económico), Berserker (ATK 80, ofensivo), Skjaldmær (DEF 65/50, defensora), Huskarl (DEF 80/40, élite defensivo).
    - **Caballería (Establo):** Ulfhednar (ATK 100, vel 14, raider élite), Valkyria (DEF cab 70, contra-raids).
    - **Asedio (Taller):** Ariete de Jörmungandr (reduce muralla), Catapulta de Surtr (destruye edificios).
    - Consumo de trigo consistente con `economy.md`: básico=1, pesado=2, cab=3, asedio=4.

2.  **3 Edificios Militares (Niveles 1-10):**
    - **Cuartel:** GS L5 → -5% entreno/nivel → desbloquea Bóndi(L1), Berserker(L3), Skjaldmær(L5), Huskarl(L7).
    - **Establo:** GS L7 + Cuartel L3 → -5% entreno/nivel → desbloquea Ulfhednar(L1), Valkyria(L5).
    - **Taller:** GS L10 + Cuartel L5 → -5% entreno/nivel → desbloquea Ariete(L1), Catapulta(L5).

3.  **Muralla (10 niveles):**
    - GS L3 requerido. +8% defensa/nivel (max +80% a L10). DEF base 20→300.
    - Pop = 0 (no consume trigo). Inversión defensiva más eficiente del juego.
    - Arcilla como coste principal (alineado con economy.md: arcilla = construcción defensiva).

4.  **Sistema de Combate Completo:**
    - **Fórmula:** ATK total vs DEF ponderada por ratio inf/cab del atacante.
    - **Pérdidas:** Exponente 1.5 — victoria aplastante = pocas bajas, victoria ajustada = sangrienta.
    - **Muralla:** Multiplica DEF × (1 + nivel × 0.08). Arietes reducen nivel efectivo.
    - **Misiones:** Ataque, Raid (ATK×0.5, max 10% bajas), Asedio (destruye edificios), Refuerzo.

5.  **2 Simulaciones de Combate:**
    - 50 Berserkers + 5 Arietes vs 30 Huskarl + Muralla L3 → Atacante gana con 75.5% pérdidas. Saquea 360 recursos.
    - 30 Ulfhednar vs aldea sin defensores + Muralla L2 → Pierde 1 jinete, saquea 2,320 recursos.

6.  **Archivos Creados/Actualizados:**
    - `games/midgard-online/docs/troops.md` — 8 tropas con stats, costes, desbloqueos, comparativas.
    - `games/midgard-online/docs/combat.md` — Fórmulas, muralla, simulaciones, reglas especiales.
    - `games/midgard-online/config/TroopsConfig.json` — JSON config de 8 tropas.
    - `games/midgard-online/config/CombatConfig.json` — JSON config de combate + muralla.
    - `games/midgard-online/config/BuildingsConfig.json` — Actualizado a v0.2.0 con 4 edificios militares.

7.  **Siguiente Paso:** `@archivist` debe integrar tropas y combate en documentación GDD. `@qa` debe validar: fórmula de combate, balance entre tropas, ausencia de estrategia dominante, y consistencia de trigo con economy.md.

---

### [2026-02-23] - Paso 4: Mapa del Mundo y Sistema de Alianzas (Midgard Online)

**Autor:** `@gamedesign`

1.  **Mapa del Mundo — Grid 401×401:**
    - Coordenadas de (-200, -200) a (200, 200) = 160.801 celdas.
    - **5 tipos de celda:** vacía, aldea_jugador, oasis, aldea_NPC (Natar), yggdrasil (centro).
    - **4 zonas radiales:** Centro (0-30, conflicto), Interior (30-80, competitiva), Media (80-160, spawn de jugadores), Borde (160-200, expansión).
    - Fórmula de distancia: `d = √((x₂-x₁)² + (y₂-y₁)²)`.
    - Tiempo de viaje: `t = d / velocidad_grupo` (velocidad limitada por tropa más lenta).

2.  **Sistema de Oasis (7 tipos):**
    - **Comunes (75%):** +25% Madera, +25% Arcilla, +25% Hierro, +25% Trigo.
    - **Raros (20%):** +25% Madera & +25% Trigo, +25% Arcilla & +25% Hierro.
    - **Muy raro (5%):** +50% Trigo.
    - ~4.800 oasis en el mapa. Defendidos por fauna (Lobo ATK 20, Jabalí ATK 15, Oso ATK 40, Troll ATK 60, Dragón ATK 100).
    - Claim: máx distancia 7 celdas. Oasis por aldea basados en nivel de GS: 0 (L1-4), 1 (L5-7), 2 (L8-9), 3 (L10).

3.  **Colonización — Nueva Aldea:**
    - **Requisitos:** Gran Salón L10 + Almacén L10 + Granero L10 + Residencia L1.
    - **Colono (Landnámsmaður):** Tropa civil. Velocidad 4, ATK/DEF 0, coste 16.000 recursos, 3h 20m.
    - Se necesitan 3 colonos (48.000 recursos total) para fundar una aldea nueva.
    - **Residencia:** Nuevo edificio, 10 niveles. Reduce coste del Colono -5%/nivel (máx -45% en L10).
    - Colonización es hito de ~Día 25 del servidor.

4.  **Sistema de Alianzas:**
    - **Máximo 60 miembros.** Creación gratuita por cualquier jugador sin alianza.
    - **4 roles:** Jarl (líder, 1), Thane (oficial senior, máx 3), Hirdman (oficial, máx 10), Karl (miembro).
    - **Matriz de permisos:** Invitar, expulsar, diplomacia, editar perfil, enviar broadcast, gestionar foro.
    - **4 estados diplomáticos:** Aliado (máx 3), No-Agresión (máx 5), Neutral, Enemigo.
    - Cooldowns: romper alianza 48h, romper NAP 24h.

5.  **Rankings y Comunicación:**
    - Rankings individuales (población, atacante, defensor, saqueador) y de alianza (población total, territorio).
    - Chat de alianza + foro interno + mensajes broadcast + notificaciones automáticas.
    - Sucesión: si Jarl inactivo 7 días → Thane más antiguo asciende.

6.  **Archivos Creados/Actualizados:**
    - `games/midgard-online/docs/map.md` — Diseño completo del mapa, oasis, colonización, zonas.
    - `games/midgard-online/docs/alliances.md` — Sistema de alianzas, roles, diplomacia, rankings.
    - `games/midgard-online/config/MapConfig.json` — Grid, celdas, oasis, fauna, zonas, spawn, colonización.
    - `games/midgard-online/config/AlliancesConfig.json` — Roles, permisos, diplomacia, rankings, comunicación.
    - `games/midgard-online/config/TroopsConfig.json` — Actualizado a v0.2.0 con Colono (Landnámsmaður).
    - `games/midgard-online/config/BuildingsConfig.json` — Actualizado a v0.3.0 con Residencia (10 niveles).

7.  **Siguiente Paso:** `@archivist` debe integrar mapa y alianzas en documentación GDD. `@qa` debe validar: consistencia de oasis con economía, balance de colonización, fórmulas de viaje con velocidades de tropas, y permisos de roles.

### [2026-02-23] - Revisión QA Paso 4: 3 Fixes (Map + Alliances)

**Autor:** `@gamedesign` (en respuesta a revisión de `@qa`)

1.  **P1 (ALTO) — Inner zone spawn fix:**
    - `MapConfig.json`: Inner zone cambiada a `playerSpawn: true` con `spawnPriority: "overflow"`.
    - `map.md`: Tabla de zonas actualizada — Interior ahora dice "Overflow spawn + expansión". Algoritmo de spawn aclara que Interior es overflow con prioridad secundaria.

2.  **P2 (MEDIO) — Fórmula Residencia corregida:**
    - `map.md`: Fórmula cambiada de `residencia_level × 0.05` a `(residencia_level - 1) × 0.05`. Anotación corregida: `[L1=0%, L2=-5%, L10=-45%]`.

3.  **P3 (MEDIO) — Coordination bonus definido:**
    - `AlliancesConfig.json`: `coordinationBonus` expandido de `true` a objeto con `attackBonusPercent: 10` y `earlyWarningMinutes: 30`.
    - `alliances.md`: Nueva sección "Bonus de Coordinación contra Enemigos Declarados" — +10% ATK total + 30m aviso anticipado de movimientos. Nota: el bonus es simétrico (el enemigo también lo recibe).

---

_Fin del registro actual. Añade nuevas entradas debajo._

### [2026-02-23] - Archivist Paso 5: GDD Completo de Midgard Online

**Autor:** @archivist

3 nuevos documentos creados: roadmap.md, tech-stack.md, index.md.
6 documentos verificados sin mismatches contra configs JSON.
Siguiente paso: @qa auditar documentacion completa.

### [2026-02-23] - Archivist Paso 5: GDD Completo de Midgard Online

**Autor:** `@archivist`

**Resultado:** GDD completo — 9 de 9 documentos creados o verificados.

1. **Documentos Verificados (sin mismatches vs. configs):** economy.md, buildings.md, troops.md, combat.md, map.md, alliances.md

2. **Documentos Creados:**
   - `roadmap.md` — 4 fases (v0.1.0–v1.0.0), features P0/P1, criterios de aceptacion, player journey
   - `tech-stack.md` — React/Node.js/PostgreSQL/Socket.io, esquema DB 11 tablas, API REST endpoints, logica de produccion por tick
   - `index.md` — Indice navegable, resumen de todos los sistemas, verificacion de consistencia

3. **Siguiente Paso:** `@qa` debe ejecutar auditoria completa de documentacion.

### [2026-02-23] - QA Paso 6: Auditoría Completa de Midgard Online

**Autor:** `@qa`

**Resultado:** ⚠️ NEEDS REVISION — 6 PASS, 2 WARNING, 0 BLOCKER

1. **Checks Ejecutados:**
   - ✅ 5-Point Validation Checklist (soft-lock, inflation, time walls, cross-resource, FTUE)
   - ✅ Soft-Lock Deep Analysis — F2P path always recoverable
   - ✅ Inflation Check — Cost exponent 1.585 > Production exponent 1.405 (3× scarcity)
   - ⚠️ Exploit Check — Missing: anti-multi-account rules + morale system for anti-grief
   - ✅ Wheat Balance — Buildings never cause deficit; troops create healthy late-game pressure
   - ⚠️ Combat Balance — Skjaldmær dominates ALL defense categories; Valkyria is dead content
   - ✅ Temporal Progression — Day 1/7/14/30 matches Travian benchmarks, no dead zones
   - ✅ Elegance Validation — 0% parasitic features, strong Norse theme, ethical monetization

2. **Issues Encontrados:**
   - **Valkyria Balance:** Skjaldmær superior en DEF inf (0.155 vs 0.118) Y DEF cav (0.119 vs 0.081). Fix propuesto: Valkyria → DEF inf 40 / DEF cav 95 / cost 800 / wheat 2
   - **Anti-Grief:** Sin sistema de moral (veteranos pueden griefear indefinidamente a novatos). Fix propuesto: morale = min(100, defPop/atkPop × 100), mínimo 33%
   - **Multi-Account:** Sin reglas anti-farm en configs. Fix propuesto: cooldown 60m mismo target, max 3 raids/día/target

3. **Herramientas Usadas:** Simulación Python con datos de los 6 configs JSON. Day 1 sim: 12 builds en 57min. Combat sim: 50 Berserkers vs 30 Huskarl + Wall L3 validado.

4. **Herramientas Usadas:** Simulación Python con datos de los 6 configs JSON. Day 1 sim: 12 builds en 57min. Combat sim: 50 Berserkers vs 30 Huskarl + Wall L3 validado.

5. **Reporte completo:** `games/midgard-online/docs/qa-audit-report.md` — contiene todas las tablas, simulaciones, y fixes propuestos con números.

6. **Siguiente Paso:** `@gamedesign` debe corregir stats de Valkyria y diseñar sistema de moral + anti-exploit.

### [2026-02-23] - QA Audit Fixes: Valkyria + Moral + Anti-Exploit (Midgard Online)

**Autor:** `@gamedesign` (en respuesta a QA Audit)

1.  **QA-001 — Rebalance Valkyria:**
    - DEF inf: 50 → 40, DEF cab: 70 → 95, Coste: 870 → 800, Trigo: 3/h → 2/h.
    - Ahora es especialista anti-caballería pura (DEF cab 95, la más alta). Vulnerable a infantería (DEF inf 40).
    - Triángulo estratégico: Infantería > Valkyria > Caballería > Infantería.
    - Actualizada en TroopsConfig.json + troops.md (tabla resumen, sección detallada, tablas de eficiencia, tabla de trigo).

2.  **QA-002 — Sistema de Moral (NUEVO):**
    - `morale = min(100, defPop / atkPop × 100)`, mínimo 33%.
    - Multiplica ATK y loot del atacante. Protege a jugadores pequeños de veteranos.
    - Ejemplo: Pop 2,000 ataca Pop 500 → moral 25% → clamped a 33% → ATK y loot ×0.33.
    - Insertado como Paso 3b en el flujo de combate (combat.md) + sección completa con tabla de referencia.
    - Añadido a CombatConfig.json como sección `morale`.

3.  **QA-003 — Protección Anti-Multi-Account (NUEVO):**
    - Cooldown 60 minutos entre ataques al mismo objetivo (por par aldea→aldea).
    - Máximo 3 raids/día por par aldea atacante → aldea defensora (ventana rodante 24h).
    - Población mínima 50 para ser atacado (protección de novato).
    - Añadido a CombatConfig.json como sección `antiExploit` + combat.md sección completa.

4.  **Archivos Actualizados:**
    - `games/midgard-online/config/TroopsConfig.json` — Valkyria rebalanceada.
    - `games/midgard-online/docs/troops.md` — 6 secciones actualizadas con nuevos stats.
    - `games/midgard-online/config/CombatConfig.json` — v0.2.0 con moral + antiExploit.
    - `games/midgard-online/docs/combat.md` — Paso 3b (moral), edge cases, secciones de moral y anti-exploit.

5.  **Siguiente Paso:** `@archivist` debe integrar cambios en GDD. `@qa` debe re-validar que los 3 fixes resuelven los issues reportados.

### [2026-02-23] - QA Re-Audit: 3 Issues RESUELTOS — ✅ QA APPROVED (Midgard Online)

**Autor:** `@qa`

**Resultado:** ✅ **QA APPROVED** — Los 3 issues del audit original están resueltos.

1. **QA-001 Valkyria Balance → ✅ RESOLVED**
   - Valkyria: DI=40, DC=95, cost=800, wh=2 (antes: DI=50, DC=70, cost=870, wh=3)
   - DC/cost: Valkyria 0.1187 ≈ Skjaldmær 0.1190 (empate funcional)
   - En stats absolutos: Valkyria DC=95 vs Skjaldmær DC=50 → **clara especialista anti-caballería**
   - Decisión estratégica real: "¿Qué tropas trae mi enemigo?" → buen game design

2. **QA-002 Morale System → ✅ RESOLVED**
   - Formula: `min(100, defPop/atkPop × 100)`, mínimo 33%
   - Pop 5000 vs Pop 200 → moral 33% → ATK y loot ×0.33 (protección efectiva)
   - Documentado en CombatConfig.json + combat.md

3. **QA-003 Anti-Exploit → ✅ RESOLVED**
   - Cooldown: 60 min entre raids al mismo target
   - Límite: 3 raids/día/target (ventana 24h)
   - Pop mínima para ser atacado: 50
   - Documentado en CombatConfig.json + combat.md

4. **Cross-validation config ↔ docs:** 0 mismatches.

5. **Siguiente Paso:** Pipeline continúa → `@developer` implementa (PASO 7 del playbook).

---

### [2026-02-24] - Midgard Online: Config Validation & Tech Stack Review

**Autor:** `@developer`

1. **Fase 1 — Validación de JSON Configs:**
   - Se ejecutó validación exhaustiva de los 6 JSON configs en `games/midgard-online/config/` contra la documentación en `games/midgard-online/docs/`.
   - **ResourcesConfig.json** ✅ — 4 recursos, producción base, almacenamiento, fórmulas — todo coincide con `economy.md`.
   - **BuildingsConfig.json** ✅ — 12 edificios × 10 niveles, costes/tiempos/producción — todo coincide con `buildings.md`.
   - **TroopsConfig.json** ✅ — 9 tropas, ATK/DEF/speed/carry/wheat/costes — todo coincide con `troops.md`.
   - **CombatConfig.json** ✅ — Muralla (10 niveles), moral, misiones, anti-exploit — todo coincide con `combat.md`.
   - **MapConfig.json** ✅ — Grid 401×401, celdas, oasis, colonización — coincide con `map.md`.
   - **AlliancesConfig.json** ✅ — 60 miembros, roles, diplomacia, rankings — coincide con `alliances.md`.
   - **Resultado: 0 discrepancias numéricas** entre configs y docs.

2. **Fase 2 — Revisión de tech-stack.md:**
   - `games/midgard-online/docs/tech-stack.md` ya existía con 458 líneas completas.
   - Verificado que incluye: stack completo (React+Vite+TS / Node+Express+TS / PostgreSQL+Prisma / Socket.io / Redis / JWT), estructura de carpetas, esquema de DB (14 tablas), API REST endpoints, eventos WebSocket, diagrama ER Mermaid, seguridad anti-exploit y variables de entorno.
   - No se requiere ninguna modificación — el documento cumple todos los requisitos.

3. **Siguiente Paso:** `@artdirector` debe definir la dirección visual (paleta, wireframes, iconografía) en `games/midgard-online/docs/art/style-guide.md`.

### [2026-02-23] - Art Direction: Midgard Online — Dirección Visual Completa

**Autor:** `@artdirector`
**Juego:** Midgard Online (`games/midgard-online/`)

1. **Archivo creado:** `games/midgard-online/docs/art/style-guide.md` (~700 líneas)

2. **Contenido entregado:**
   - **Paleta de colores completa:** 50+ tokens de color con hex codes — fondos (noche nórdica), recursos (madera/arcilla/hierro/trigo/runas), estados (success/warning/danger/info/premium), CTAs (4 variantes de botón), facciones en mapa (propia/aliado/neutral/enemigo/NPC).
   - **Style guide web:** Tipografía (Cinzel Decorative/Cinzel/Inter/JetBrains Mono), componentes (botones, cards, tablas, resource bar), espaciado, layout 3-column, animaciones y transiciones, responsive breakpoints (4 niveles).
   - **5 wireframes ASCII:** Vista de aldea (anillo exterior + centro), Vista de mapa del mundo (grid coordenadas), Panel de edificio (info + upgrade + tabla niveles), Panel de cuartel (entrenar tropas + cola), Panel de ataque (selección tropas + target + resumen misión).
   - **Iconografía completa:** Iconos para 5 recursos, 14 edificios, 8 tropas, 12 estados/acciones — con descripción visual, silueta, y color identificativo.
   - **Diagramas Mermaid:** Flowchart de navegación (~30 pantallas), sequence diagram de flujos críticos (mejorar edificio, enviar ataque), state machine de edificio.
   - **CSS variables:** Bloque completo de custom properties listo para implementar en React.
   - **AI art prompts:** Templates Midjourney/DALL-E para iconos de edificios y retratos de tropas.
   - **Checklist de implementación:** 16 tareas priorizadas por fase.

3. **Skills aplicados:**
   - `visual-language.skill.md` — Legibilidad, progresión visual por nivel, semáforo de colores funcionales.
   - `readability-landmarks.skill.md` — Jerarquía de contraste (fondo < edificios < UI < feedback), sistema de landmarks (micro/meso/macro).
   - `ui-complexity.skill.md` — 3 capas de información (esencial/interactuar/profundidad), ocultación de reglas, modelo de cámara web.

4. **Siguiente Paso:** `@release` debe preparar el plan de release basándose en la dirección visual, el roadmap y todos los documentos aprobados del pipeline.

### [2026-02-23] - Art Direction: QA Fixes — Observaciones O1-O4

**Autor:** `@artdirector`
**Juego:** Midgard Online (`games/midgard-online/`)

1. **O1 — Progresión visual vs config:** Añadida nota en sección 6.3 indicando que los tiers visuales (Lv1-2, 3-4, etc.) son guía para `@developer` y que un `UIConfig.json` futuro puede formalizar el mapeo nivel→tier visual. No se requiere config JSON para Fase 1-2.

2. **O2 — Contraste WCAG AA:** Fix crítico.
   - `--text-muted` cambiado de `#6b6158` (ratio 3.1:1 — NO pasaba AA) a `#857667` (ratio 4.6:1 — pasa AA).
   - Añadida nueva sección **1.1b Accesibilidad (WCAG 2.1 AA)** con tabla de ratios de contraste para cada token de texto sobre cada fondo, reglas de uso y recomendación de test `axe-core` en CI.
   - CSS variables actualizadas con el nuevo valor.

3. **O3 — Stats de tropas en wireframes:** Añadida nota explícita bajo el wireframe de ataque indicando que los stats son ilustrativos y que la fuente de verdad son `troops.md` y `config/TroopsConfig.json`.

4. **O4 — Wireframe de Alianza:** Añadido nuevo wireframe ASCII **3.6 Vista de Alianza (Fase 3)** con: tabla de miembros (roles, pop, aldeas), panel de diplomacia (aliados/NAP/enemigos con semáforo), tabs internas, panel lateral de info de miembro con acciones.

5. **Siguiente Paso:** `@release` debe preparar el plan de release.

---

### 🔍 Auditoría Completa de Documentación — Midgard Online (@archivist)

**Fecha:** 2026-02-23  
**Agente:** @archivist  
**Alcance:** Revisión cruzada de 9 documentos + 6 JSON configs

#### Archivos Auditados (15)

- **Docs:** vision.md, economy.md, buildings.md, troops.md, combat.md, map.md, alliances.md, roadmap.md, tech-stack.md, index.md
- **Configs:** BuildingsConfig.json, ResourcesConfig.json, TroopsConfig.json, CombatConfig.json, MapConfig.json, AlliancesConfig.json

#### Problemas Encontrados y Corregidos

| #   | Severidad | Problema                                                                                             | Archivos          | Corrección                               |
| --- | --------- | ---------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------- |
| M1  | ALTA      | Valkyria en index.md tenía stats incorrectos: DEF Inf 50→40, DEF Cab 70→95, Trigo 3→2, Coste 870→800 | index.md          | Alineado con TroopsConfig.json           |
| G1  | MEDIA     | Residencia ausente de buildings.md (tabla Centro y desbloqueos)                                      | buildings.md      | Añadida a tabla Centro + Gran Salón Lv10 |
| G2  | BAJA      | Muralla no aparecía en tabla de desbloqueos del Gran Salón                                           | buildings.md      | Añadida en Gran Salón Lv3                |
| G3  | COSMÉTICA | TroopsConfig cavalry wheatRange decía "3" pero Valkyria consume 2                                    | TroopsConfig.json | Cambiado a "2-3 per troop"               |

#### Verificaciones Pasadas (sin errores)

- Todas las stats de 9 tropas en troops.md coinciden con TroopsConfig.json ✅
- Muralla niveles 1-10 en combat.md coinciden con CombatConfig.json ✅
- Recursos iniciales (750 c/u + 50 runas) consistentes en economy.md y ResourcesConfig.json ✅
- Mapa 401×401 = 160,801 celdas consistente en map.md y MapConfig.json ✅
- Alianzas max 60 miembros consistente en alliances.md y AlliancesConfig.json ✅
- Fórmulas de producción/coste/tiempo consistentes entre economy.md, buildings.md y configs ✅
- Cross-references entre todos los docs funcionan correctamente ✅
- index.md actualizado con nota de auditoría ✅

**Siguiente Paso:** @qa debe validar las correcciones aplicadas.

---

### [2026-02-23] - Release Plan v0.1.0 — Midgard Online Pipeline Completo

**Autor:** `@release`
**Juego:** Midgard Online (`games/midgard-online/`)

#### Pipeline Ejecutado (Pasos 1–9 completos)

El pipeline completo de 9 agentes de Midgard Online ha sido ejecutado exitosamente:

| Paso | Agente         | Entregable                                                                            | Estado |
| ---- | -------------- | ------------------------------------------------------------------------------------- | ------ |
| 1    | `@producer`    | `docs/vision.md` — Análisis de mercado, KPIs, roadmap 4 fases                         | ✅     |
| 2    | `@gamedesign`  | `docs/economy.md`, `docs/buildings.md`, configs ResourcesConfig + BuildingsConfig     | ✅     |
| 3    | `@gamedesign`  | `docs/troops.md`, `docs/combat.md`, configs TroopsConfig + CombatConfig               | ✅     |
| 4    | `@gamedesign`  | `docs/map.md`, `docs/alliances.md`, configs MapConfig + AlliancesConfig               | ✅     |
| 4b   | `@gamedesign`  | QA Fixes: spawn overflow, Residencia L1=0%, coordination bonus definido               | ✅     |
| 5    | `@archivist`   | `docs/roadmap.md`, `docs/tech-stack.md`, `docs/index.md` — GDD completo               | ✅     |
| 6    | `@qa`          | `docs/qa-audit-report.md` — 6 PASS, 2 WARNING. Resultado: NEEDS REVISION              | ✅     |
| 6b   | `@gamedesign`  | Fixes QA: Valkyria rebalance, sistema de moral, anti-exploit                          | ✅     |
| 6c   | `@qa`          | Re-audit: los 3 issues resueltos → **✅ QA APPROVED**                                 | ✅     |
| 7    | `@developer`   | Validación 0 discrepancias configs↔docs. tech-stack.md verificado (458 líneas)        | ✅     |
| 8    | `@artdirector` | `docs/art/style-guide.md` — paleta 50+ tokens, 5 wireframes, iconografía, nav Mermaid | ✅     |
| 8b   | `@artdirector` | Fixes O1-O4: WCAG AA fix, wireframe alianzas, notas de accesibilidad                  | ✅     |
| 9    | `@release`     | Plan de release v0.1.0 + 8 issues GitHub creados                                      | ✅     |

#### Estado del Pre-Release Checklist

**Documentación:**

- [x] `docs/vision.md` ✅
- [x] `docs/economy.md` ✅
- [x] `docs/buildings.md` ✅
- [x] `docs/troops.md` ✅
- [x] `docs/combat.md` ✅
- [x] `docs/map.md` ✅
- [x] `docs/alliances.md` ✅
- [x] `docs/roadmap.md` ✅
- [x] `docs/tech-stack.md` ✅
- [x] `docs/index.md` ✅
- [x] `docs/art/style-guide.md` ✅
- [x] `docs/qa-audit-report.md` ✅

**Configs JSON:**

- [x] `config/ResourcesConfig.json` ✅
- [x] `config/BuildingsConfig.json` ✅
- [x] `config/TroopsConfig.json` ✅
- [x] `config/CombatConfig.json` ✅
- [x] `config/MapConfig.json` ✅
- [x] `config/AlliancesConfig.json` ✅

**QA:** ✅ QA APPROVED (re-audit tras 3 fixes)

#### Issues GitHub Creados para v0.1.0

| Issue | Título                                                            | URL                                                       |
| ----- | ----------------------------------------------------------------- | --------------------------------------------------------- |
| #7    | [MO-01] Project Setup: React + Vite + Node.js + PostgreSQL        | https://github.com/afernandezro7/ai-game-studio/issues/7  |
| #8    | [MO-02] Autenticación: Registro + Login JWT                       | https://github.com/afernandezro7/ai-game-studio/issues/8  |
| #9    | [MO-03] Aldeas: Creación automática + CRUD + recursos iniciales   | https://github.com/afernandezro7/ai-game-studio/issues/9  |
| #10   | [MO-04] Producción en tiempo real: tick loop + acumulación        | https://github.com/afernandezro7/ai-game-studio/issues/10 |
| #11   | [MO-05] Edificios: Upgrade + Cola de construcción + Gran Salón    | https://github.com/afernandezro7/ai-game-studio/issues/11 |
| #12   | [MO-06] UI de Aldea: Grid + Barra de Recursos + Panel de Edificio | https://github.com/afernandezro7/ai-game-studio/issues/12 |
| #13   | [MO-07] WebSocket: Socket.io + eventos production:tick            | https://github.com/afernandezro7/ai-game-studio/issues/13 |
| #14   | [MO-08] QA E2E + Deploy: Validación final de v0.1.0               | https://github.com/afernandezro7/ai-game-studio/issues/14 |

#### Siguiente Paso

`@developer` debe implementar los issues en orden MO-01 → MO-02 → MO-03 → MO-04 → MO-05 → MO-06 → MO-07 → MO-08.

---

### [2026-02-23] - MO-01: Project Setup — Monorepo Scaffolding (Issue #7)

**Autor:** `@developer`

**Resumen:** Scaffolding completo del monorepo para Midgard Online. Ambos proyectos (frontend + backend) compilan sin errores en TypeScript strict mode. Vite dev server arranca correctamente.

1. **Frontend — `sandbox-web/`** (16 archivos creados)
   - Vite 5 + React 18 + TypeScript strict
   - React Router v6 con 4 rutas: `/` (Village), `/map`, `/alliance`, `/auth`
   - Tanstack Query v5 provider en `main.tsx`
   - Zustand stores: `gameStore.ts` (resources/buildings/troops), `authStore.ts` (JWT auth)
   - Axios client con interceptor JWT + Socket.io client singleton
   - 4 hooks placeholder: useResources, useBuildings, useTroops, useWebSocket
   - `gameConfigs.ts` re-exporta los 6 JSON configs
   - `index.css` con TODAS las CSS variables de `style-guide.md` (~70 tokens)
   - Google Fonts: Cinzel, Cinzel Decorative, Inter, JetBrains Mono
   - Vite proxy: `/api` → localhost:3001, `/socket.io` → ws://localhost:3001

2. **Backend — `backend/`** (20 archivos creados)
   - Express + TypeScript strict (ES2022)
   - Zod env validation (DATABASE_URL, JWT_SECRET, PORT, etc.)
   - Prisma client singleton + gameData loader (6 JSON configs)
   - 7 route files: auth, villages, buildings, troops, combat, map, alliances
   - 5 service files: production, building, combat, travel, alliance
   - Socket.io server con auth middleware placeholder
   - 3 cron job placeholders: productionTick, missionResolver, cleanupJobs
   - 2 middleware: JWT auth, rate limiter
   - `.env.example` con todas las variables de tech-stack.md

3. **Prisma Schema** — 13 tablas implementadas:
   - `users`, `villages`, `resources`, `buildings`, `troops`
   - `missions`, `mission_troops`, `battle_reports`
   - `map_cells` (composite PK x,y), `alliances`, `alliance_members`, `diplomacy`, `oasis_claims`
   - `reinforcements` excluida (Fase 3)
   - UUID PKs, relaciones correctas, índices en campos de búsqueda frecuente

4. **Infraestructura:**
   - `docker-compose.yml` — PostgreSQL 16 con volume persistente
   - `.gitignore` — node_modules, .env, dist, .prisma
   - `README.md` — Quick start completo

5. **Verificación:**
   - ✅ `npx tsc --noEmit` — 0 errores en frontend
   - ✅ `npx tsc --noEmit` — 0 errores en backend
   - ✅ `npx prisma generate` — Client generado
   - ✅ `npm run dev` — Vite arranca en localhost:5173

6. **Siguiente Paso:** MO-02 — Auth (registro + login + JWT).

---

### [2026-02-24] - QA Review de PR #15 (MO-01 Project Setup)

**Autor:** `@qa`
**PR:** #15 (`feature/MO-01-setup` → `develop`)
**Veredicto:** ⚠️ REQUEST CHANGES — 3 bloqueantes, 2 menores

1. **Revisión contra Issue #7:** 6/8 criterios de aceptación PASS. Frontend (React 18 + Vite 5 + TS strict), Backend (Express + TS strict), Docker (PostgreSQL 16), CSS Variables (165 líneas), 6 JSON configs cargados en ambos lados — todo correcto.

2. **Bloqueantes encontrados:**
   - **B-001**: `.tool-versions` usa Node 22.17.1 pero tech-stack.md especifica Node 20 LTS
   - **B-002**: `mission_troops` tiene UUID PK en vez de composite PK `(mission_id, troop_type)` como define tech-stack.md
   - **B-003**: Prisma 7.4.1 instalado pero tech-stack.md especifica Prisma 5 — la implementación es internamente consistente con Prisma 7 pero la documentación no se ha actualizado

3. **Menores:**
   - **M-001**: Faltan `ws/attackNotifier.ts` y `ws/chatHandler.ts` (placeholders vacíos)
   - **M-002**: Faltan `services/villageService.ts` y `services/troopsService.ts` en frontend

4. **Lo que está bien:** Prisma schema con 13 tablas correctas (tipos, FKs, índices), estructura de carpetas match, Zod env validation, Socket.io + Vite proxy, rate limiter, CORS + helmet, DEVLOG entry presente.

5. **Siguiente Paso:** `@developer` debe resolver los 3 bloqueantes y 2 menores, luego solicitar re-review a `@qa`.

---

### [2026-02-25] - QA Re-Review de PR #15 — ✅ APPROVED

**Autor:** `@qa`
**PR:** #15 (`feature/MO-01-setup` → `develop`) — commit `3a68b7da`
**Veredicto:** ✅ QA APPROVED — 5/5 issues resueltos, 8/8 criterios PASS

1. **Verificación de fixes (commit `d318f02`):**
   - **B-001** ✅: tech-stack.md actualizado a `Node 22 LTS` — docs y `.tool-versions` alineados
   - **B-002** ✅: `mission_troops` ahora tiene composite PK `(mission_id, troop_type)`, campo `id` eliminado, migration correcta
   - **B-003** ✅: tech-stack.md actualizado a `Prisma 7` — docs y `package.json` alineados
   - **M-001** ✅: `ws/attackNotifier.ts` (24 líneas) y `ws/chatHandler.ts` (14 líneas) creados con tipos Socket.io
   - **M-002** ✅: `services/villageService.ts` (25 líneas) y `services/troopsService.ts` (27 líneas) creados con funciones reales

2. **Decisión del equipo:** Se optó por subir las versiones documentadas (Node 22, Prisma 7) en vez de hacer downgrade. Coherente y justificado.

3. **Report generado:** `games/midgard-online/docs/qa-re-review-pr15-mo01-setup.md`

4. **Siguiente Paso:** Mergear PR #15 a `develop`. Siguiente tarea: MO-02 — Auth (registro + login + JWT).

## [MO-02] Auth — Registro + Login JWT · 2026-02-26

**Issue:** #8 | **Branch:** `feature/MO-02-auth` | **Agent:** @developer

### Archivos implementados

**Backend (`games/midgard-online/backend/`)**

- `src/routes/auth.ts` — POST /auth/register, POST /auth/login, GET /auth/me (con Zod validation, bcryptjs salt 12, JWT sign)
- `src/middleware/auth.ts` — `authMiddleware` completo: extrae Bearer token, verifica JWT, adjunta payload como `AuthRequest`; interfaces `JwtPayload` + `AuthRequest`

**Frontend (`games/midgard-online/sandbox-web/`)**

- `src/pages/Auth.tsx` — Página Login/Register con tabs, validación client-side, manejo de errores 401/409, redirect post-auth con react-router
- `src/pages/Auth.css` — Estilos Nordic con todas las CSS vars (--bg-primary, --accent-gold, --text-primary, etc.), responsive (card centrada en desktop, full-width en mobile)
- `src/App.tsx` — Route guards: si no autenticado → /auth; si autenticado en /auth → /

### Verificación

- `npx tsc --noEmit` backend → 0 errores ✅
- `npx tsc --noEmit` frontend → 0 errores ✅
- Zod valida: username 3-20 alphanum, email válido, password ≥8 chars
- bcryptjs salt rounds: 12
- JWT payload: `{ userId, username }`, expiry desde `env.JWT_EXPIRES_IN` ("7d")
- `passwordHash` nunca expuesto en respuestas
- `runes: 50` por defecto en el User model (schema sin modificar)

### Criterios de aceptación

- ✅ Registro con email + username + password
- ✅ Runes: 50 automáticos al registrar
- ✅ Login retorna JWT (expira en 7d)
- ✅ Rutas protegidas retornan 401 sin token
- ✅ Login/Register responsive (mobile + desktop)
- ✅ tsc clean en backend y frontend

## QA Review — PR #17 (MO-02 Auth) · 2025-07-24

**PR:** #17 | **Issue:** #8 | **Agent:** @qa

### Decisión: ✅ APPROVED

PR #17 revisado contra los 5 criterios de aceptación del issue #8 y las especificaciones de `tech-stack.md`.

### Verificaciones

1. **Criterios de aceptación:** 5/5 PASS — registro, runes 50, JWT 7d, 401 sin token, responsive
2. **Contrato API vs tech-stack.md:** 3/3 MATCH — register, login, /me
3. **Seguridad:** PASS — bcrypt 12 rounds, JWT_SECRET min 32 chars, passwordHash nunca expuesto, "Invalid credentials" genérico
4. **Código:** PASS — tsc clean, CSS vars mapeadas, authStore compatible, Axios interceptor funcional

### Advertencias (no bloqueantes)

- **W-001:** Async handlers sin try-catch (Express 4 no captura promise rejections) → resolver en MO-03+
- **W-002:** Race condition TOCTOU en register (`findFirst` → `create`) → se resuelve con W-001

### Entregables

1. **Review en PR #17:** COMMENT con APPROVE (no se puede hacer APPROVE en PR propia)
2. **Report:** `games/midgard-online/docs/qa-review-pr17-mo02-auth.md`

### Siguiente Paso

Mergear PR #17 a `develop`. Siguiente tarea: MO-03 — Villages (issue #9).

---

## [MO-02] QA Fixes — W-001 + W-002 · 2026-02-26

**PR:** #17 | **Branch:** `feature/MO-02-auth` | **Agent:** @developer

Resueltas las 2 advertencias no bloqueantes del QA review de PR #17.

### W-001 — Async handlers sin try-catch + falta global error handler

- **`backend/src/routes/auth.ts`** — Los 3 handlers (`POST /register`, `POST /login`, `GET /me`) envueltos en `try/catch`. El `catch` llama a `next(err)` para propagar al error handler global.
- **`backend/src/index.ts`** — Añadido global error handler Express (4 parámetros) antes del `listen`. Captura cualquier error no manejado, responde JSON `{ error: "Internal server error" }` con status 500. En desarrollo incluye `details: err.message`.

### W-002 — Race condition P2002 en register

- **`backend/src/routes/auth.ts`** — El `catch` de `POST /register` detecta `err.code === 'P2002'` (Prisma unique constraint violation) y responde 409 `{ error: "Username or email already taken" }` en lugar de dejar que el error burbujee como 500.

### Verificación

- `npx tsc --noEmit` backend → 0 errores ✅

---

## QA Re-Review — PR #17 W-001 + W-002 · 2026-02-26

**PR:** #17 | **Commit:** `e6abaf5c` | **Agent:** @qa

### Decisión: ✅ APPROVED — Advertencias resueltas

Re-verificación de las 2 advertencias del QA review original.

### W-001: Async handlers sin try-catch ✅ RESUELTO

- Los 3 handlers (`register`, `login`, `/me`) ahora tienen **try-catch** con `next(err)` en el catch
- Global error handler añadido en `index.ts` (4 parámetros): loguea `err.message` + `err.stack`, responde `500 { error: "Internal server error" }`
- Sin leak de detalles internos al cliente

### W-002: Race condition TOCTOU en register ✅ RESUELTO

- Catch detecta `Prisma.PrismaClientKnownRequestError` con code `P2002` → responde **409** con mensaje genérico
- Import de `{ Prisma }` desde `@prisma/client` correcto
- Comentario documenta la razón del catch

### Verificación

- `npx tsc --noEmit` backend → 0 errores ✅
- `npx tsc --noEmit` frontend → 0 errores ✅

### Siguiente Paso

Mergear PR #17 a `develop`. Siguiente tarea: MO-03 — Villages (issue #9).

_Fin del registro actual. Añade nuevas entradas debajo._

---

## MO-03 — Villages: Creación Automática + CRUD + Recursos Iniciales · 2026-02-26

**Branch:** `feature/MO-03-villages` | **Issue:** #9 | **Agent:** @developer

### Objetivo

Implementar el sistema de Aldeas para Midgard Online: creación automática al registrarse, estado completo, lazy tick stub de recursos, y renombre de aldea.

### Archivos Creados / Modificados

**Backend:**

- `backend/src/services/villageService.ts` _(nuevo)_ — Lógica de negocio: coordenadas automáticas zona mid (dist 80-160), creación atómica en `prisma.$transaction`, lazy tick stub, `getVillageState`, `getVillageResources`
- `backend/src/routes/villages.ts` _(reemplazado)_ — `GET /:id`, `GET /:id/resources`, `PATCH /:id/name`
- `backend/src/routes/auth.ts` _(modificado)_ — Register con transacción; login y `/me` devuelven `villageId`

**Frontend:**

- `sandbox-web/src/store/authStore.ts` — Añadido `villageId` con persistencia localStorage
- `sandbox-web/src/store/gameStore.ts` — Añadidos `currentVillage`, `fetchVillage`, `refreshResources`
- `sandbox-web/src/pages/Village.tsx` — Página React Query v5 con ResourceBar, RenameModal, banner bienvenida
- `sandbox-web/src/pages/Village.css` — Tema nórdico, responsive

### Decisiones Técnicas

- Lazy tick stub: MO-04 implementará producción real. Aquí solo se actualiza `lastUpdated`.
- Coordenadas aleatorias en zona `mid` con reintentos por colisión (P2002).
- Transacción atómica garantiza consistencia usuario+aldea en register.
- `req.params['id'] as string` para satisfacer tipos Express.

### Verificación

- `npx tsc --noEmit` backend → 0 errores ✅
- `npx tsc --noEmit` frontend → 0 errores ✅

### Siguiente Paso

## PR `feature/MO-03-villages` → `develop`. Próxima tarea: MO-04 — Producción de Recursos (tick real).

## QA Post-Merge Review — PR #18 (MO-03 Villages) · 2026-02-26

**PR:** #18 | **Issue:** #9 | **Agent:** @qa  
**Nota:** PR mergeado sin review previo — revisión post-merge.

### Decisión: ✅ APPROVED

### Verificaciones

1. **Criterios de aceptación:** 4/4 PASS — aldea con 750/750/750/750, GET completo, nombre personalizable, coords zona Media
2. **API vs tech-stack.md:** 3/3 MATCH + 1 endpoint extra (PATCH rename)
3. **DB Schema:** 3/3 MATCH — villages, resources, map_cells
4. **Seguridad:** PASS — ownership checks en 3 endpoints, transacción atómica, auth middleware
5. **Economy:** PASS — recursos iniciales = config, runes separadas en users
6. **tsc --noEmit:** PASS — 0 errores backend y frontend

### Advertencias (no bloqueantes)

- **W-003:** Fire-and-forget DB update en `getVillageState` (lastUpdated). → Resolver en MO-04 con `await`.
- **W-004:** `PATCH /villages/:id/name` no documentado en tech-stack.md → Añadir.
- **W-005:** CSS fallbacks divergen de index.css variables → Alinear.

### Entregables

1. **Review en PR #18:** Comment post-merge con aprobación
2. **DEVLOG:** Esta entrada

### ⚠️ Recordatorio de Proceso

Los PRs deben pasar por @qa ANTES de merge. Para MO-04+ mantener: PR → QA review → merge.

### Siguiente Paso

MO-04 — Producción de Recursos. Resolver W-003 al implementar.

---

## [MO-04] Produccion en tiempo real - Tick loop + Acumulacion de recursos

**Fecha:** 2025-07-23
**Rama:** `feature/MO-04-production`
**Issue:** #10

### Resumen

Implementacion completa del sistema de produccion de recursos en tiempo real para Midgard Online. El servidor acumula recursos cada PRODUCTION_TICK_INTERVAL_MS (60s por defecto) con setInterval. El cliente React interpola los valores cada 1s para visualizacion fluida sin sobrecargar la red.

### Backend

- `productionService.ts` - calculateProduction suma productionPerHour por nivel desde BuildingsConfig; getStorageCaps lee capacityPerResource (almacen) y capacityWheat (granero) con fallback a 800; applyTick aplica delta temporal, limita por almacenamiento, consume trigo por poblacion.
- `productionTick.ts` - startProductionTick() con setInterval; consulta aldeas con propietario activo (ultimos 7 dias); actualiza DB y emite resources:tick al room village:{id}.
- `villageService.ts` - integracion con productionService; getVillageResources retorna { resources, rates, caps }; correccion W-003 (fire-and-forget -> await en persist).
- `routes/villages.ts` - GET /:id/resources retorna { resources, rates, caps }.
- `socketServer.ts` - handlers join:village / leave:village para subscripcion a rooms WebSocket.
- `index.ts` - startProductionTick() arranca con el servidor HTTP.

### Frontend

- `socketService.ts` - metodos joinVillage / leaveVillage.
- `useResources.ts` - React Query (60s refetch) + setInterval 1s para interpolacion cliente; listener resources:tick via WebSocket que sincroniza base + invalida query.
- `ResourceBar.tsx` - barra de recursos con 4 recursos, barra de progreso, badge FULL, tasa de produccion (+/-/h), tema nordico.
- `ResourceBar.css` - estilos con CSS vars, responsive (mobile oculta tasa).

### Correcciones incluidas

- W-003: getVillageState y getVillageResources ahora await la persistencia DB.
- Building IDs correctos del config: woodcutter, claypit, ironMine, farm.
- Consumo de trigo usando populationPerHour del ResourcesConfig, no valor hardcodeado.

### TypeScript

tsc --noEmit en backend y frontend: 0 errores.

### Siguiente Paso

@qa revisar implementacion antes de merge a develop. PR no debe mergearse sin aprobacion de @qa.

---

## QA Review — PR #19 (MO-04 Production)

**Fecha:** 2026-02-26
**Reviewer:** @qa
**PR:** #19

### Decisión: ❌ BLOCKED (1 bug, fix trivial)

### Bug encontrado

- **B-001**: WS tick emite rates parciales (4 de 6 campos). El frontend usa `wheatGrossPerHour` y `wheatConsumptionPerHour` para interpolar trigo, pero el WS solo envía `wheatPerHour` (net). Resultado: wheat muestra "NaN" durante ~200ms tras cada tick WS. Fix: añadir 2 campos al emit en `productionTick.ts`.

### Advertencias (no bloqueantes)

- **W-006**: WS room join sin ownership check — cualquier cliente puede escuchar ticks de otras aldeas.
- **W-007**: Flag `productionStopsOnFullStorage` no se lee del config (hardcoded true).
- **W-008**: Tick secuencial O(n) queries — OK pre-producción.
- **W-009**: `applyTick` clampa overcap al cap (relevante cuando exista saqueo).

### Validación

- W-003 (fire-and-forget) RESUELTO ✅
- Production formula matches config ✅
- tsc --noEmit 0 errores ✅
- 5-Point QA Checklist: 5/5 PASS

### Report

`games/midgard-online/docs/qa-review-pr19-mo04-production.md`

### Siguiente Paso

@developer fix B-001 → @qa re-review → merge.

---

## [MO-04] fix(B-001): emit wheatGrossPerHour + wheatConsumptionPerHour en WS tick

**Fecha:** 2026-02-27
**Rama:** `feature/MO-04-production`
**Commit:** `e73b08c`
**Issue:** #10 — Respuesta a QA review PR #19

### Problema

El emit de `resources:tick` en `productionTick.ts` omitía dos campos de rates (`wheatGrossPerHour`, `wheatConsumptionPerHour`). El frontend `useResources.ts` los usa en la interpolación cliente para calcular trigo neto (`gross - consumption`). Al recibirlos como `undefined`, la operación producía `NaN` durante ~200ms cada 60s hasta el siguiente refetch de React Query.

### Fix

`backend/src/cron/productionTick.ts` — añadidos los 2 campos al objeto `rates` del emit:

```ts
wheatGrossPerHour:       rates.wheatGrossPerHour,
wheatConsumptionPerHour: rates.wheatConsumptionPerHour,
```

### Verificación

- `tsc --noEmit` backend: 0 errores
- Campos ya existían en `ProductionRates` (productionService.ts) — sin cambios de tipos necesarios

### Siguiente Paso

@qa re-review PR #19 → merge a develop.

---

## QA Re-Review — PR #19 (MO-04 Production) — B-001 Fix

**Fecha:** 2026-02-27
**Reviewer:** @qa
**PR:** #19 — commit `e73b08c`

### Decisión: ✅ APPROVED

B-001 resuelto: `wheatGrossPerHour` y `wheatConsumptionPerHour` añadidos al emit de `resources:tick` en `productionTick.ts` L90-91. Los 6 campos de `ProductionRates` ahora se emiten completos.

- `tsc --noEmit` backend: 0 errores
- 5/5 criterios de aceptación PASS
- Report actualizado: `games/midgard-online/docs/qa-review-pr19-mo04-production.md`

Warnings pendientes (no bloquean): W-006 (WS ownership), W-007 (config flag), W-008 (tick O(n)), W-009 (overcap).

**Listo para merge a develop.**

---

## [MO-05] Edificios: Upgrade + Cola de construcción + Gran Salón

**Fecha:** 2026-02-27
**Rama:** `feature/MO-05-buildings`
**Issue:** #11

### Resumen

Implementación completa del sistema de gestión de edificios para Midgard Online. Incluye validación de prerrequisitos, cola de construcción (1 concurrente en v0.1.0), reducción de tiempos por Gran Salón (−3%/nivel), reembolso 100% en cancelación, y completado automático via cron cada 5s.

### Backend

- **`buildingService.ts`** — `getUpgradeCost`, `getBuildTime` (con reducción Gran Salón), `getVillageBuildings` (enriquecido con stats del config), `startUpgrade` (valida prerrequisitos + recursos + cola, deduce recursos, establece timer), `cancelUpgrade` (reembolso 100%), `completeUpgrade` (incrementa nivel, actualiza población delta, limpia timer).
- **`routes/buildings.ts`** — `POST /buildings/upgrade` (Zod validation, ownership check), `DELETE /buildings/upgrade/:id` (cancel).
- **`routes/villages.ts`** — nuevo endpoint `GET /villages/:id/buildings` (devuelve buildings enriquecidos con stats de config).
- **`cron/buildingChecker.ts`** — `startBuildingChecker()` con `setInterval` cada `MISSION_CHECK_INTERVAL_MS` (5s); consulta buildings con `upgradeFinishAt ≤ now`; llama `completeUpgrade`; emite `building:complete` al room `village:${id}`.
- **`index.ts`** — `startBuildingChecker()` arranca con el servidor.

### Config mapping

- `mainBuilding` = Gran Salón — `unlocks` define prerrequisitos por nivel
- Reducción de tiempo: `baseTime × (1 - mainBuildingLevel × 0.03)`, tope 30% (Lv.10)
- Reembolso: 100% (no especificado en buildings.md → default 100%)
- IDs usados del config: `mainBuilding`, `warehouse`, `granary`, `woodcutter`, `claypit`, `ironMine`, `farm`

### Frontend

- **`services/buildingService.ts`** (nuevo) — `getBuildings`, `upgradeBuilding`, `cancelBuildingUpgrade`.
- **`hooks/useBuildings.ts`** — React Query fetch + mutations upgrade/cancel + listener `building:complete` WS + `canUpgrade(type)` + `currentUpgrade`.
- **`components/buildings/BuildingCard.tsx`** — tarjeta compacta con countdown timer, barra de progreso, desglose de costes (verde/rojo), botón upgrade/cancel, badge MAX.
- **`components/buildings/BuildingCard.css`** — tema nórdico, animación pulse para construcción activa.
- **`components/buildings/BuildingPanel.tsx`** — panel detallado: stats actual vs siguiente nivel, tabla de costes, tiempo con reducción Gran Salón, tabla de todos los niveles (acordeón).
- **`components/buildings/BuildingPanel.css`** — responsive, bottom sheet en mobile.

### TypeScript

`tsc --noEmit` backend y frontend: **0 errores**.

### Siguiente Paso

@qa revisar implementación antes de merge a `develop`. **PR no debe mergearse sin aprobación de @qa.**

---

## [QA] Review PR #20 — MO-05 Edificios

**Fecha:** 2026-03-05
**Agente:** @qa
**PR:** #20 (`feature/MO-05-buildings` → `develop`)
**Verdict:** ❌ BLOCKED

### Resultado

- `tsc --noEmit` backend + frontend: ✅ 0 errores
- Acceptance criteria: 6/6 correctos en diseño
- 5-Point QA Checklist: PASS (soft-lock, inflation, time walls, cross-resource, FTUE)

### Issues

- **B-002 (BLOQUEANTE):** `createVillageInTx` no crea filas de buildings → `startUpgrade` falla con `"Building 'X' not found in village"` para toda aldea nueva. El sistema de edificios es 100% inutilizable sin building seed.
- **W-010:** `validateUpgrade` throws `"Forbidden: you do not own..."` pero route compara `=== "Forbidden"` → devuelve 500 en lugar de 403.
- **W-011:** BuildingCard muestra tiempo base, sin reducción Gran Salón.
- **W-012:** BuildingPanel stats comparison muestra label en vez de valor del siguiente nivel.
- **W-013:** Progress bar desalineada con Gran Salón activo (base time denominador).
- **W-014:** TOCTOU — SET absoluto vs decrement atómico en startUpgrade/cancelUpgrade.

Warnings pendientes de PRs anteriores: W-004, W-005, W-006, W-007, W-008, W-009.

### Acción

@developer corregir B-002 (añadir building seed). @qa re-valida tras fix.

Informe completo: `games/midgard-online/docs/qa-review-pr20-mo05-buildings.md`

### [2026-03-05] - MO-05 QA Fixes: B-002 + W-010/W-011/W-012/W-013/W-014

**Autor:** `@developer`
**PR:** #20 — `feature/MO-05-buildings` → `develop`

Corregidos todos los issues del QA Report `qa-review-pr20-mo05-buildings.md`.

1. **B-002 (BLOQUEANTE) — Building seed en aldeas nuevas:** `createVillageInTx` crea 21 building rows a Lv.0 (woodcutter×4, claypit×4, ironMine×4, farm×6, mainBuilding, warehouse, granary). Sistema funcional para nuevos jugadores.
2. **W-010 — 500 → 403:** `validateUpgrade` lanza `"Forbidden"` (igual que `cancelUpgrade`) → route handler matchea y devuelve 403.
3. **W-011 — Tiempo efectivo:** `getVillageBuildings` retorna `effectiveBuildTimeSec` con reducción Gran Salón aplicada. `BuildingCard` muestra el tiempo real.
4. **W-012 — Valor siguiente nivel:** `getVillageBuildings` retorna `nextLevelStats`. `BuildingPanel` usa su valor en lugar del label.
5. **W-013 — Progress bar:** Denominador usa `effectiveBuildTimeSec` → barra empieza en 0% con Gran Salón activo.
6. **W-014 — Atómico:** `startUpgrade` usa `{ decrement }`, `cancelUpgrade` usa `{ increment }` en Prisma.

**Verificación:** `tsc --noEmit` backend ✅ + frontend ✅ — 0 errores.

### [2026-03-05] - QA Re-Review PR #20 — MO-05 Edificios ✅ APPROVED

**Autor:** `@qa`
**PR:** #20 — `feature/MO-05-buildings` → `develop`

Re-revisión tras commit `3b67a5b` con fixes de @developer.

**Verificación:**

- **B-002** (BLOQUEANTE): `createVillageInTx` crea 21 building rows a Lv0 — ✅ RESUELTO
- **W-010**: Error message → `"Forbidden"` matchea 403 — ✅ RESUELTO
- **W-011**: `effectiveBuildTimeSec` retornado y mostrado en BuildingCard — ✅ RESUELTO
- **W-012**: `nextLevelStats` retornado y mostrado en BuildingPanel — ✅ RESUELTO
- **W-013**: Progress bar usa `effectiveBuildTimeSec ?? nextLevelTimeSec` — ✅ RESUELTO
- **W-014**: Prisma `decrement`/`increment` atómicos — ✅ RESUELTO
- `tsc --noEmit` backend + frontend: 0 errores

**Resultado:** ✅ QA APPROVED — todos los issues resueltos. Listo para merge.

Informe actualizado: `games/midgard-online/docs/qa-review-pr20-mo05-buildings.md`

_Fin del registro actual. Añade nuevas entradas debajo._

---

### [2026-03-06] - MO-06: Village UI — AppLayout + Grid + Panel de Edificio

**Autor:** `@developer`
**Branch:** `feature/MO-06-village-ui`
**PR:** #21 — `feature/MO-06-village-ui` → `develop` (Closes #12)

Implementación completa de la UI de aldea: layout de 3 columnas en desktop, bottom sheet en mobile, barra de recursos sticky y panel de detalle de edificio con flavor text nórdico.

**Archivos creados (10 nuevos):**

1. `AppLayout.tsx` / `.css` — Layout global con header sticky (logo Cinzel, tabs de navegación) y barra de recursos pinnada (52px + 48px). Consume `useResources` + `useAuthStore`.
2. `ConstructionTimer.tsx` / `.css` — Countdown HH:MM:SS + barra de progreso animada. Modo `compact` para overlay en `BuildingSlot`.
3. `BuildingSlot.tsx` / `.css` — Representación visual de un slot: 3 estados (`--empty` borde verde discontinuo, `--built` relleno, `--upgrading` pulso dorado). Exporta `SLOT_DEFINITIONS` (21 slots: índices 0-17 recurso, 18-20 interior).
4. `VillageGrid.tsx` / `.css` — Organiza slots en 2 zonas (campos de recurso + centro de aldea). Bonus reusable.
5. `BuildingDetailPanel.tsx` / `.css` — Flavor text nórdico por tipo de edificio (13 entradas) + delega el bloque stats/costs a `BuildingPanel`. Desktop: columna derecha fija 320px. Mobile: bottom sheet `position: fixed; height: 70vh` con `slide-up 0.25s`.

**Archivos modificados (4):**

- `ResourceBar.tsx` / `.css` — Nueva prop `runes?: number`; muestra ᚱ con color `--res-premium-light` (dorado) separado por divisor.
- `Village.tsx` — Reescritura completa: 3 columnas via `AppLayout` (Campos / Centro / Panel), `useBuildings` + `useResources`, estado `selectedType`, `buildingByType` Map.
- `Village.css` — Nuevo bloque `.village-layout` CSS Grid 3 columnas; stack vertical en `≤768px`.

**Validación:** `npx tsc --noEmit` → EXIT:0 — 0 errores.

**Pendiente:** ⚠️ @qa debe revisar y aprobar PR #21 antes de merge.

### [2026-03-05] - QA Review PR #21 — MO-06 Village UI ❌ BLOCKED

**Autor:** `@qa`
**PR:** #21 — `feature/MO-06-village-ui` → `develop`

Revisión completa del PR de UI de aldea (15 archivos, +1127/-245 LOC, 0 cambios backend).

**Issue encontrado:**

- **B-003 (BLOQUEANTE):** `Village.tsx:52` — `buildingByType` Map colapsa múltiples slots del mismo tipo (4 woodcutter, 4 claypit, 4 ironMine, 6 farm) en una entrada. Tras upgrade de recurso: timer invisible, cancel inaccesible, level incorrecto. Afecta 18/21 slots.
- **W-015:** VillageGrid.tsx creado pero nunca importado (dead code, 94 LOC).
- **W-016:** AppLayout no pasa `runes` a ResourceBar (feature implementada pero no wired).
- **W-017:** Bottom sheet sin Escape key handler (a11y).

**Compilación:** `tsc --noEmit` frontend → 0 errores.

**Validaciones positivas:** SLOT_DEFINITIONS ↔ backend seed match, props interfaces correctas, FLAVOR dict completo, CSS responsive, z-index correct, sin `any`/`@ts-ignore`.

**Acción:** @developer corregir B-003 (smart selector o buildingBySlot Map). @qa re-valida tras fix.

Informe completo: `games/midgard-online/docs/qa-review-pr21-mo06-village-ui.md`
