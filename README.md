# 🧠 AI Game Studio – Multi-Agent System (Declarative Approach)

## 🎯 Objetivo

Construir un sistema de agentes de IA que colaboren para crear juegos móviles tipo:

- Clash of Clans
- Rise of Kingdoms

## 🎮 Prototipo Jugable

Puedes probar la última versión del juego aquí:  
👉 **[Jugar Ahora](https://afernandezro7.github.io/ai-game-studio/)**  
_(Actualizado automáticamente con cada commit a `main`)_

El sistema debe ser:

- Determinista
- Escalable
- Basado en Agentes Declarativos (Markdown)

---

# 🏗️ Arquitectura (Nuevo Enfoque)

Hemos migrado de un sistema basado en código TypeScript (Orchestrator + APIs) a un sistema **Declarativo** basado en GitHub Copilot y archivos Markdown.

## Flujo principal

```
Usuario (Tú) → Copilot Chat (@agente) → Lee .agent.md + .instructions.md → Genera Markdown / Issues
```

## Organigrama de agentes

```
Producer → GameDesign → Archivist → QA → Release
```

---

# 🧠 Agentes (Ubicados en `.github/agents/`)

## 1. Producer (`@producer`)

- Define objetivos y visión comercial.
- Crea Pitches de juegos.
- Marca dirección.

## 2. GameDesign (`@gamedesign`)

- Diseña mecánicas deterministas.
- Define economía y balanceo.
- Estructura el juego.

## 3. Archivist (`@archivist`)

- Construye base de conocimiento (GDD).
- Organiza decisiones.
- Documenta.

## 4. QA (`@qa`)

- Valida coherencia matemática.
- Detecta exploits en la economía.

## 5. Release (`@release`)

- Prepara notas de versión.
- Define roadmap de lanzamiento.

---

# 🧾 Formato de salida y Memoria

- **Memoria:** La memoria del estudio ahora reside en los archivos Markdown generados (GDD) y en los GitHub Issues.
- **Plantillas:** Se utilizan plantillas en `.github/ISSUE_TEMPLATE/` para estandarizar la comunicación entre agentes.

---

# 🚀 Cómo usar este estudio

Abre el chat de tu asistente de IA (ej. GitHub Copilot) y utiliza los agentes:

1. **Empezar un proyecto:**

   > "Actúa como el agente `@producer` y propón un nuevo juego de estrategia basado en la mitología nórdica."

2. **Diseñar mecánicas:**

   > "Actúa como el agente `@gamedesign` y diseña la economía inicial para el juego propuesto por el Producer."

3. **Documentar:**
   > "Actúa como el agente `@archivist` y crea el documento GDD inicial con la información generada hasta ahora."

---

**Esto ya no es un experimento.
Es un estudio de videojuegos declarativo.**
