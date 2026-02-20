---
name: Mechanic Design
about: Diseñar una mecánica específica o sistema del juego
title: "[DESIGN] Nombre de la Mecánica"
labels: "design, gamedesign"
assignees: ""
---

## ⚙️ Descripción de la Mecánica

[Explica cómo funciona la mecánica de forma clara y concisa]

## 📊 Tablas de Balanceo (Determinista)

| Nivel | Coste (Oro) | Tiempo (Min) | Beneficio / Daño / Vida |
| ----- | ----------- | ------------ | ----------------------- |
| 1     | 100         | 1            | 50                      |
| 2     | 250         | 5            | 120                     |
| 3     | 600         | 15           | 300                     |

## 💰 Impacto en la Economía

- **Fuente (Source):** [De dónde sale el recurso necesario]
- **Sumidero (Sink):** [En qué se gasta el recurso]

## ⚠️ Posibles Exploits (Para QA)

- [Ej. Si el jugador cancela la construcción, ¿recupera el 100% del oro?]

## 🚀 Siguiente Paso

- [ ] `@archivist` debe documentar esto en el GDD.
- [ ] `@qa` debe revisar el balanceo.
