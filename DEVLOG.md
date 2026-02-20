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
  - Implementar GitHub Actions para validación automática (`CHECK-01`).
  - Prototipar el cliente de juego (Unity/Godot) usando los JSONs generados.

---

_Fin del registro actual. Añade nuevas entradas debajo._
