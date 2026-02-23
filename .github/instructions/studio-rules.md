# AI Game Studio - Reglas Globales

## 🎯 Objetivo del Estudio

Somos un estudio de desarrollo de videojuegos impulsado por IA. Nuestro objetivo principal es diseñar, documentar y producir **game data y configs listos para producción** que alimenten juegos móviles de estrategia en **cualquier motor** (Unity, Godot, Unreal), fuertemente inspirados en títulos como **Clash of Clans** y **Rise of Kingdoms**.

> **⚠️ IMPORTANTE**: El prototipo web (`client-web/`) es un SANDBOX de testeo rápido. El producto real son los JSON configs en `src/config/` — diseñados para ser engine-agnostic e importables por Unity, Godot u otro motor.

## 🧠 Principios de Diseño

1. **Determinismo:** Las decisiones de diseño deben ser claras, matemáticas y balanceadas. Nada de "magia", todo debe tener un coste, un tiempo y un beneficio.
2. **Escalabilidad:** Los sistemas (economía, combate, progresión) deben estar diseñados para soportar años de contenido.
3. **Documentación First:** Ninguna mecánica existe si no está documentada por el Archivist.

## 🔄 Flujo de Trabajo (Pipeline de Agentes)

El ciclo de vida de una idea sigue este orden estricto:

```
Producer → GameDesign → Archivist → QA → Developer → ArtDirector → Release
```

1. **@producer:** Define la visión, el público objetivo y los KPIs. Crea el Pitch.
2. **@gamedesign:** Toma el Pitch y diseña las mecánicas con tablas numéricas exactas.
3. **@archivist:** Documenta los diseños en `docs/` y verifica consistencia.
4. **@qa:** Valida con el checklist de 5 puntos. Busca exploits y soft-locks.
5. **@developer:** Implementa configs JSON y código en el prototipo web.
6. **@artdirector:** Crea diagramas Mermaid y prompts de arte para IA generativa.
7. **@release:** Prepara el release, changelog y deploy.

## 📂 Estructura del Proyecto

```
docs/                    → Game Design Document (GDD) — SOURCE OF TRUTH
docs/books/              → Libros de referencia (PDFs) y resúmenes del equipo
src/config/              → Engine-agnostic JSON configs — THE REAL PRODUCT (Unity/Godot/any)
client-web/src/          → Web SANDBOX for rapid testing — NOT the final game
.github/agents/          → Agent definitions (this file's siblings)
.github/instructions/    → Reglas globales que aplican a TODOS los agentes
.github/skills/          → Conocimiento especializado por agente (ver sección abajo)
.github/prompts/         → Reusable workflow prompts (1-click pipelines)
.github/workflows/       → CI/CD automation
DEVLOG.md                → Development log — EVERY action gets logged here
```

## 📚 Sistema de Conocimiento: Instructions + Skills

### Instructions (`.github/instructions/`)

Reglas **globales** que Copilot carga automáticamente para TODOS los agentes. Son principios universales que todo el estudio debe respetar.

| Archivo                     | Contenido                             |
| --------------------------- | ------------------------------------- |
| `studio-rules.md`           | Este archivo — reglas operativas      |
| `game-design-principles.md` | Principios de diseño (de "Level Up!") |

### Skills (`.github/skills/<agente>/`)

Conocimiento **modular y especializado** por agente. Cada skill es un archivo `.skill.md` que el agente lee cuando necesita expertise específico.

| Agente        | Skill                          | Contenido                                    |
| ------------- | ------------------------------ | -------------------------------------------- |
| `producer`    | `concept-validation.skill.md`  | Validación de pitch y concepto               |
| `gamedesign`  | `three-cs.skill.md`            | Framework Character, Camera, Controls        |
| `gamedesign`  | `world-architecture.skill.md`  | Diseño de niveles, sign language, combate    |
| `gamedesign`  | `economy-psychology.skill.md`  | Loops económicos, dopamina, anti-patterns    |
| `qa`          | `game-feel-checklist.skill.md` | Checklist extendido de game feel             |
| `archivist`   | `gdd-standards.skill.md`       | Estándares profesionales de GDD              |
| `developer`   | `config-architecture.skill.md` | Arquitectura config-driven, mapping GDD→JSON |
| `artdirector` | `visual-language.skill.md`     | Lenguaje visual, legibilidad, progresión     |
| `release`     | `release-readiness.skill.md`   | Checklist de release readiness               |

### ¿Cómo agregar un nuevo Skill?

1. El usuario crea un resumen de un libro/recurso en `docs/books/`
2. El asistente transforma el resumen en skills accionables
3. Se crea el archivo `.skill.md` en `.github/skills/<agente>/`
4. Se actualiza el agent `.agent.md` para referenciar el skill
5. Se actualiza esta tabla

## 📜 Reglas Universales para TODOS los agentes

1. **Lee antes de actuar**: Siempre lee los archivos de contexto listados en tu agent file.
2. **Números, no palabras**: "50 DPS con 1.2s cooldown" en vez de "hace bastante daño".
3. **DEVLOG obligatorio**: Al terminar una tarea, añade entrada a `DEVLOG.md`.
4. **Siguiente paso claro**: Indica qué agente debe actuar después y qué debe hacer.
5. **Sin inventar**: No asumas datos. Si no está en docs/ o src/config/, no existe.
6. **Formato Markdown**: Toda comunicación en Markdown estructurado con tablas cuando aplique.

## 🚀 Prompts Disponibles (Workflows rápidos)

| Prompt            | Descripción                                        | Uso                                      |
| ----------------- | -------------------------------------------------- | ---------------------------------------- |
| `new-mechanic`    | Pipeline completo para diseñar una nueva mecánica  | `@workspace /new-mechanic [descripción]` |
| `add-building`    | Diseñar e implementar un nuevo edificio end-to-end | `@workspace /add-building [concepto]`    |
| `balance-audit`   | Auditoría QA completa de la economía actual        | `@workspace /balance-audit`              |
| `prepare-release` | Coordinar un release completo                      | `@workspace /prepare-release`            |
| `studio-status`   | Reporte de estado del estudio y proyecto           | `@workspace /studio-status`              |
