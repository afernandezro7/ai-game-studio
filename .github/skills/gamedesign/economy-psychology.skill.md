# Skill: Economía, Mecánicas y Psicología del Jugador

> Fuente: "Level Up!" — Sección 6 (Mecánicas, Psicología y Dinámicas Avanzadas)

## Cuándo Usar Este Skill

Cuando el GameDesign agent diseña sistemas de progresión, economías de recursos, o mecánicas de engagement/retención.

## Fundamentos de Mecánicas

### Definición Operativa

Una mecánica es una regla inamovible que, al ser accionada por el jugador, genera experiencia. Las mecánicas NO son ideas vagas:

| ❌ Esto NO es una mecánica        | ✅ Esto SÍ es una mecánica                                   |
| --------------------------------- | ------------------------------------------------------------ |
| "El jugador puede atacar"         | "Ataque cuerpo a cuerpo: 150 DPS, 1.2s cooldown, rango 1.5u" |
| "Los edificios producen recursos" | "Lumber Mill Lv1: 100 wood/h, cap 1200, collect cada 12h"    |
| "El juego tiene progresión"       | "XP curve: level_xp = 100 \* (level ^ 1.8)"                  |

### Profundidad Sistémica

La profundidad viene de combinar mecánicas simples, no de crear mecánicas complejas:

- 3 recursos simples (wood, steel, runes) que interactúan entre sí > 1 recurso complejo con 10 sub-tipos.
- Las mejores mecánicas son "fáciles de aprender, difíciles de dominar."

## Psicología del Jugador

### El Loop de Dopamina

El engagement no es accidental. Se diseña:

```
Acción → Feedback Inmediato → Progreso Visible → Recompensa → Nueva Acción
```

| Fase             | Duración Target | Ejemplo                                              |
| ---------------- | --------------- | ---------------------------------------------------- |
| Micro-loop       | 30 segundos     | Tap edificio → aparece recurso → counter sube        |
| Session-loop     | 5-15 minutos    | Completar upgrade → desbloquear nuevo edificio       |
| Daily-loop       | 1 sesión/día    | Login reward → recolectar recursos → iniciar upgrade |
| Progression-loop | Semanas         | Subir de era → nuevos edificios → nuevo visual       |

### Percepción de Poder

El jugador DEBE sentir que se vuelve más poderoso con el tiempo:

- **Números crecientes:** Los stats deben escalar visiblemente (no +1%, sino +50 DPS).
- **Desbloqueos tangibles:** Nuevos edificios, nuevas tropas, nuevos mapas.
- **Visual escalation:** El building Lv1 se ve modesto; el Lv10 se ve épico.

### Diseño Multijugador (Cuando Aplique)

- La interacción humana introduce variables que pueden romper el balance.
- Todo sistema PvP DEBE simularse con escenarios de "qué pasa si el jugador X tiene 10x más recursos que el jugador Y".
- Matchmaking debe tener en cuenta el poder total, no solo el nivel.

## Anti-Patterns

| Anti-Pattern                    | Por Qué es Malo                                   | Fix                                            |
| ------------------------------- | ------------------------------------------------- | ---------------------------------------------- |
| Pay-to-Win puro                 | Destruye retención de F2P (80%+ de la base)       | Premium = conveniencia, no ventaja competitiva |
| Grinding sin recompensa visible | El jugador no percibe progreso                    | Micro-rewards cada 2-3 minutos                 |
| Inflation sin sinks             | La economía se devalúa, el endgame pierde sentido | Ratio 1:3 (sources:sinks)                      |
| Mecánica huérfana               | No conecta con el core loop                       | Si no afecta al loop, eliminar                 |

## Output Esperado

```markdown
## ⚙️ Sistema: [Nombre]

### Core Loop Connection

[Cómo este sistema alimenta el loop principal]

### Balance Table

| Level | Cost | Time | Output | Power Delta |
| ----- | ---- | ---- | ------ | ----------- |

### Progression Psychology

- Micro-reward cada: X minutos
- Session goal: [qué logra el jugador en 10 min]
- Daily hook: [por qué vuelve mañana]

### Exploit Scenarios

| Escenario | Resultado | Riesgo |
```
