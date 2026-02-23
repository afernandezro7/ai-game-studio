# Skill: Pedagogía de Niveles — El Diseño como Proceso Educativo

> Fuente: "Level Design Book" — Sección 2 (Mecanismos de Enseñanza)

## Cuándo Usar Este Skill

Cuando el GameDesign Agent diseña mecánicas nuevas, progresiones, tutoriales, o cualquier sistema que el jugador debe aprender.

## Principio Central

> "Learning is the drug" (Raph Koster). El disfrute lúdico es la recompensa química (dopamina/endorfinas) que el cerebro libera tras dominar una tarea compleja.

Todo nivel/zona/sistema es un **tutor invisible**. El jugador NUNCA debe sentir que está en un tutorial — debe sentir que está jugando.

## Ciclo Pedagógico Maestro

Todo sistema nuevo DEBE pasar por estos 3 pasos, EN ORDEN:

| Fase                           | Qué Ocurre                                                       | Regla para City Builder                                                          |
| ------------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1. **Enseñanza** (Instruction) | Se presenta la mecánica en entorno controlado y sin riesgo       | Primer edificio: coste 0, tiempo 0. El jugador aprende el flujo sin penalización |
| 2. **Prueba** (Testing)        | El jugador aplica el conocimiento para superar un obstáculo real | Segundo edificio: coste real pero bajo. Siente la economía por primera vez       |
| 3. **Recompensa** (Reward)     | El éxito genera satisfacción intrínseca                          | Producción comienza, contador sube, feedback visual + audio                      |

**REGLA:** Nunca saltar la fase 1. Si el jugador no fue enseñado, no puede ser evaluado.

## Skill Gates (Portones de Habilidad)

Son puntos donde el avance es IMPOSIBLE sin demostrar dominio. En un city builder:

| Skill Gate                                    | Qué Demuestra                                 | Ejemplo Valhalla                     |
| --------------------------------------------- | --------------------------------------------- | ------------------------------------ |
| "Construye tu primer edificio"                | Entiende el loop construir→esperar→recolectar | Lumber Mill Lv1                      |
| "Mejora un edificio a Lv2"                    | Entiende upgrades y gestión de recursos       | Cualquier building Lv1→Lv2           |
| "Ten 2 edificios produciendo simultáneamente" | Entiende paralelismo y planificación          | Lumber Mill + Steel Mine             |
| "Desbloquea un nuevo tipo de edificio"        | Entiende progresión y tech tree               | Great Hall Lv2 → desbloquea Barracks |

**REGLA:** Cada skill gate DEBE ser validado en `BuildingsConfig.json` — verificar que los prerrequisitos existen y son alcanzables.

## Tutoriales: Covert > Overt

| Tipo                   | Descripción                        | Ejemplo                                          | Impacto en Retención                          |
| ---------------------- | ---------------------------------- | ------------------------------------------------ | --------------------------------------------- |
| **Overt** (explícito)  | Pop-up con texto instructivo       | "Toca aquí para construir"                       | -Inmersión. Aceptable SOLO en primer contacto |
| **Covert** (implícito) | Enseñanza integrada en el gameplay | Flecha sutil + edificio brillante invita a tocar | +Inmersión. Gold standard                     |

**REGLA para @developer:** Los tutoriales covert deben ser configurables en JSON (no hardcoded). Crear config:

```json
{
  "tutorial_steps": [
    {
      "id": "build_first",
      "type": "covert",
      "trigger": "first_login",
      "highlight_element": "build_button",
      "complete_condition": "building_placed"
    }
  ]
}
```

## Trust Relationship (Vínculo de Confianza)

> Traicionar la confianza del jugador mediante habilidades no enseñadas es un **pecado capital** del diseño.

### Anti-Patterns (PROHIBIDOS)

| Anti-Pattern       | Descripción                        | Ejemplo                                            |
| ------------------ | ---------------------------------- | -------------------------------------------------- |
| Skill no enseñada  | Exigir algo que nunca se introdujo | Pedir "usar hechizos" sin haber desbloqueado magia |
| Dificultad injusta | Spike repentino sin preparación    | Ataque enemigo Lv10 cuando el jugador tiene Lv2    |
| Mecánica oculta    | Sistema crítico no explicado       | Decadencia de edificios que nunca se mencionó      |
| Regla cambiante    | Alterar reglas sin aviso           | Producción que baja sin explicar por qué           |

### Checklist de Confianza (para @qa)

Para cada mecánica nueva, verificar:

- [ ] ¿Fue enseñada antes de ser evaluada?
- [ ] ¿La dificultad escala gradualmente?
- [ ] ¿El jugador puede entender POR QUÉ falló?
- [ ] ¿Hay feedback inmediato del resultado?

## Output Esperado

Cuando diseñes un sistema nuevo, incluir sección:

```markdown
## 🎓 Plan Pedagógico: [Sistema]

### Fase 1 — Enseñanza

- Trigger: [cuándo se activa]
- Método: [overt/covert]
- Coste para el jugador: [0 o mínimo]

### Fase 2 — Prueba

- Primer desafío real: [descripción]
- Skill gate: [qué demuestra]

### Fase 3 — Recompensa

- Feedback: [visual + audio]
- Desbloqueo: [qué se abre]

### Requisitos de Confianza

- [ ] Todas las mecánicas fueron enseñadas previamente
- [ ] No hay spikes de dificultad injustos
```
