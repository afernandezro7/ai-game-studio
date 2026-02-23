# Skill: Auditoría de Elegancia y Perfil de Jugador

> Fuente: "Fundamentals of Game Design" (Ernest Adams) — Capítulos 1-2 y Conclusión

## Cuándo Usar Este Skill

Cuando el Producer evalúa un feature, revisa el GDD, o necesita decidir si un diseño cumple con los estándares de calidad del estudio.

## Principio Central

> Elegancia es la síntesis brillante entre Economía Interna (mecánicas) y Presentación (interfaz/estética). Sin esta integración, el diseño fracasa como producto coherente y competitivo.

## Auditoría de Elegancia (3 puntos)

Ejecutar para cada feature ANTES de aprobar producción:

### 1. Auditoría del Perfil del Jugador 👤

```
¿Puedo listar 3 preferencias de entretenimiento de mi audiencia target
que contradigan mis gustos personales?

→ SÍ: El equipo tiene empatía con la audiencia. Proceder.
→ NO: STOP. Hacer investigación de usuario antes de diseñar.
```

**Para Valhalla:**
| Audiencia Target | Preferencia que podría contradecir al diseñador |
| --- | --- |
| Casual mobile (25-40 años) | Prefieren sesiones de 5-10 min, no 1h |
| Fans de Clash of Clans | Esperan builder queue, no innovación radical |
| Non-gamers curiosos | Necesitan onboarding extremadamente simple |

### 2. Mapeo Desafío→Acción 🎯

```
¿Cada acción en el GDD está vinculada a un desafío no-trivial?
¿O hay "features gratuitas" que diluyen la elegancia?

→ Listar TODAS las acciones del jugador
→ Cada una DEBE mapear a: Económico, Lógica, Conflicto, Exploración, Coordinación
→ Si una acción no mapea a ningún desafío → es candidata a eliminación
```

### 3. Evaluación de Economía Interna ⚖️

```
¿Los flujos de recursos están definidos con fuentes y sumideros claros?
¿Se previenen estrategias dominantes ANTES del prototipado?

→ Verificar: ¿Hay un diagrama source→sink para cada recurso?
→ Verificar: ¿Se ha calculado si hay una estrategia que domine a todas?
→ Si la respuesta a cualquiera es NO → el feature NO está listo para producción
```

## Framework de Integración

El Producer debe evaluar cómo se integran los 3 pilares:

| Pilar                  | Pregunta                              | Señal de Problema                           |
| ---------------------- | ------------------------------------- | ------------------------------------------- |
| **Estética**           | ¿El arte/audio amplifica la mecánica? | Arte bonito pero la mecánica no se entiende |
| **Tecnología**         | ¿Es implementable con nuestro stack?  | Diseño ambicioso pero irrealizable          |
| **Mercado**            | ¿La audiencia target lo quiere?       | Feature innovador que nadie pidió           |
| **Diseño (pegamento)** | ¿La empatía con el jugador une los 3? | Todo funciona aislado pero no como conjunto |

**REGLA de Adams:** Un enfoque puramente tecnológico o puramente de mercado produce productos subestándar. Solo el Diseño Centrado en el Jugador integra los tres pilares correctamente.

## Ventaja del Computador

Recordar que el medio digital multiplica la inmersión mediante:

| Ventaja                  | Cómo Explotarla en Valhalla                             | Medida                                      |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------- |
| **Ocultación de reglas** | El jugador no necesita saber las fórmulas de producción | Configs complejas → UI simple               |
| **Pacing dinámico**      | Modular intensidad en tiempo real                       | Eventos, daily challenges, notifications    |
| **IA y simulación**      | Mundos que reaccionan                                   | NPC workers, defensas automáticas, raids IA |

## Output Esperado

```markdown
## 🏆 Elegance Audit: [Feature/Versión]

### 1. Perfil del Jugador

- 3 preferencias contradictorias identificadas: [lista]
- Empatía validada: [SÍ/NO]

### 2. Desafío→Acción

| Acción | Desafío Vinculado | ¿No-Trivial? |
| ------ | ----------------- | ------------ |

- Features gratuitas detectadas: [lista o "ninguna"]

### 3. Economía Interna

- Source→Sink definido: [SÍ/NO]
- Estrategia dominante detectada: [SÍ: cuál / NO]

### Elegancia: [✅ Integrada / ❌ Desalineada — pilar roto: X]

### Decisión: [GO / REDESIGN / KILL]
```
