# Skill: Diseño de Sesiones y Unidades Temporales

> Fuente: "Characteristics of Games" (Elias, Garfield, Gutschera) — Capítulo 1

## Cuándo Usar Este Skill

Cuando el GameDesign Agent define la duración de sesiones, ciclos de gameplay, campañas, o cualquier sistema que implique tiempo del jugador.

## Principio Central

> La duración no es un valor absoluto, sino una variable dependiente de los hábitos culturales. Un diseño equilibrado debe alinear la profundidad de las decisiones con su categoría temporal.

## Unidades Temporales del Juego

Todo sistema temporal en Valhalla DEBE mapearse a estas categorías:

| Unidad      | Definición                      | Ejemplo Valhalla                          | Duración Target   |
| ----------- | ------------------------------- | ----------------------------------------- | ----------------- |
| **Átomo**   | Acción mínima significativa     | Tap para recolectar, iniciar construcción | 1-3 segundos      |
| **Juego**   | Ronda completa con resolución   | Completar un upgrade, defender un ataque  | 2-15 minutos      |
| **Sesión**  | Periodo continuo ininterrumpido | Una sentada de juego                      | 5-15 min (mobile) |
| **Campaña** | Secuencia vinculada de juegos   | Progresión Great Hall Lv1→Lv10            | Días a semanas    |
| **Match**   | Serie para filtrar varianza     | Temporada PvP / Guerra de clanes          | 1-4 semanas       |

### Reglas de Alineación Temporal

| Regla                           | Criterio                                                  | Consecuencia si se viola                     |
| ------------------------------- | --------------------------------------------------------- | -------------------------------------------- |
| Átomo < Sesión                  | Toda acción atómica debe completarse dentro de una sesión | Frustración: "No pude hacer nada en 10 min"  |
| Sesión tiene cierre             | Cada sesión debe tener un punto de cierre satisfactorio   | Abandono: "¿Para qué entré?"                 |
| Campaña tiene milestone visible | El jugador debe poder ver su progreso macro               | Desorientación: "¿Estoy avanzando?"          |
| Match tiene reset justo         | Al final de temporada, todos tienen oportunidad fresh     | Desmotivación: "Los veteranos siempre ganan" |

**REGLA CRÍTICA:** Un "juego" (upgrade, batalla) cuya duración exceda la sesión promedio (15 min mobile) generará fatiga. Si un upgrade tarda 8h, el RESULTADO debe ser revisable en una sesión futura de < 30 segundos.

## Heurísticas del Jugador

Las heurísticas son atajos cognitivos que el jugador desarrolla. Deben diseñarse deliberadamente:

| Tipo            | Definición                             | Ejemplo Valhalla                                           | Requisitos                  |
| --------------- | -------------------------------------- | ---------------------------------------------------------- | --------------------------- |
| **Posicional**  | "¿Cómo estoy?" — Evaluar estado actual | Barra de recursos, nivel de aldea, ranking PvP             | UI clara, números visibles  |
| **Direccional** | "¿Qué hago ahora?" — Guía de acción    | Misiones sugeridas, "next upgrade" highlight, daily quests | Sistema de objetivos activo |

### 4 Rasgos de una Buena Heurística

Toda heurística que diseñemos DEBE cumplir:

| Rasgo            | Pregunta de Validación                   | FAIL si...                                    |
| ---------------- | ---------------------------------------- | --------------------------------------------- |
| **Claridad**     | ¿El jugador la entiende en < 5 segundos? | Necesita tutorial para entender un indicador  |
| **Riqueza**      | ¿Aplica a múltiples situaciones?         | Solo sirve para un caso específico            |
| **Satisfacción** | ¿Recompensa al jugador al aplicarla?     | Saber el estado no ayuda a decidir            |
| **Poder**        | ¿Genera impacto real en el resultado?    | El indicador no refleja la realidad del juego |

**Anti-pattern:** Heurísticas oscuras frustran al novato. Heurísticas demasiado simples matan la longevidad del experto.

## Diseño de Audiencia: Sweet Spot de Jugadores

| Modo           | Jugadores     | Sweet Spot                                  | Riesgo                         |
| -------------- | ------------- | ------------------------------------------- | ------------------------------ |
| Solo (PvE)     | 1             | Core loop debe ser suficiente autónomamente | Monotonía sin variedad         |
| Co-op (clanes) | 5-30          | Roles diferenciados, nadie es prescindible  | "Alpha player" dicta todo      |
| PvP            | 1v1 o equipos | Matchmaking justo, tiempo equilibrado       | Snowball mata al perdedor      |
| MMO/Social     | 50+           | Sistemas emergentes, economía player-driven | Interacción individual diluida |

**REGLA:** Cada modo de juego futuro DEBE definir su sweet spot antes de diseñar las mecánicas. Si el sweet spot no está claro, el modo no está listo.

## Output Esperado

```markdown
## ⏱️ Session Design: [Feature/Sistema]

### Mapa Temporal

| Unidad | Implementación | Duración |
| ------ | -------------- | -------- |

### Heurísticas Diseñadas

| Tipo | Indicador | Cumple 4 rasgos? |
| ---- | --------- | ---------------- |

### Sweet Spot de Jugadores: [N] jugadores

### Riesgo principal: [descripción]
```
