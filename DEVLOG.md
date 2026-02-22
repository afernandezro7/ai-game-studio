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

_Fin del registro actual. Añade nuevas entradas debajo._
