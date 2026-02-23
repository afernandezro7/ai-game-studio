# Skill: Gestión de Complejidad en Interfaz

> Fuente: "Fundamentals of Game Design" (Ernest Adams) — Capítulo 8 (Interfaz) + Capítulo 3 (Conceptos)

## Cuándo Usar Este Skill

Cuando el ArtDirector diseña UI, define flujos de interacción, o necesita comunicar mecánicas complejas de forma intuitiva.

## Principio Central

> La función del diseño de interfaz es hacer lo complejo intuitivo. La UI es el puente entre la Economía Interna (mecánicas invisibles) y la comprensión del jugador.

## Ocultación de Reglas

> El ordenador oculta las reglas para que el jugador se concentre en decisiones, no en logística.

La UI de Valhalla DEBE ocultar complejidad y mostrar solo lo necesario para decidir:

| Lo que el Config tiene                  | Lo que el jugador VE                                              | Regla                             |
| --------------------------------------- | ----------------------------------------------------------------- | --------------------------------- |
| `production_per_hour: 100`              | Barra de progreso + "+100/hr" texto pequeño                       | Mostrar output, no fórmula        |
| `cost: { wood: 500, steel: 200 }`       | Iconos de recurso con número + color (verde=puedo, rojo=no puedo) | Semáforo visual inmediato         |
| `build_time_seconds: 3600`              | "1h" con barra de progreso animada                                | Tiempo human-readable             |
| `unlock_requirements: [great_hall_lv2]` | Candado con tooltip "Requiere Gran Salón Lv2"                     | Claro, no críptico                |
| `power_score: 1.23`                     | NUNCA se muestra al jugador                                       | Dato interno de balance solamente |

### Regla de 3 Capas de Información

| Capa                       | Visible  | Cuándo                        | Ejemplo                                     |
| -------------------------- | -------- | ----------------------------- | ------------------------------------------- |
| **Capa 1: Esencial**       | Siempre  | En pantalla principal         | Recursos actuales, edificios, nivel         |
| **Capa 2: Al interactuar** | Al tocar | Cuando toca un edificio       | Stats, coste de upgrade, producción         |
| **Capa 3: Profundidad**    | Opcional | Menú de detalles / long-press | Historial de producción, gráficas, fórmulas |

**REGLA:** Si la Capa 1 tiene más de 5 elementos distintos en pantalla, hay ruido visual. Simplificar.

## Modelos de Interacción

| Modelo             | Definición                                            | Uso en Valhalla                                 |
| ------------------ | ----------------------------------------------------- | ----------------------------------------------- |
| **Avatar-Based**   | Jugador proyecta su voluntad a través de un personaje | NO para el core (no hay avatar en city builder) |
| **Multipresencia** | Jugador gestiona múltiples entidades                  | ✅ SÍ — gestión de toda la aldea                |
| **Omnipresente**   | Jugador ve y actúa en todo el mapa                    | ✅ SÍ — zoom out ve toda la aldea               |

### Modelo de Cámara para City Builder

| Parámetro   | Valor                                            | Justificación                                 |
| ----------- | ------------------------------------------------ | --------------------------------------------- |
| Perspectiva | Isométrica                                       | Estándar del género (Clash, Rise of Kingdoms) |
| Zoom        | 2 niveles mín (aldea completa / zoom a edificio) | Funcionalidad > realismo                      |
| Scroll      | Libre con bounds                                 | El jugador explora su aldea                   |
| Rotación    | NO o limitada                                    | Simplifica la gestión espacial mobile         |

## Tipografía y Tamaños de Toque

| Elemento         | Tamaño Mínimo      | Regla                          |
| ---------------- | ------------------ | ------------------------------ |
| Botón de acción  | 44×44 px (iOS HIG) | Estándar Apple, imprescindible |
| Texto de recurso | 14sp mínimo        | Legible sin zoom               |
| Icono de recurso | 24×24 px mínimo    | Distinguible del fondo         |
| Tooltip / info   | 12sp mínimo        | Capa 2 puede ser más pequeña   |

## Disonancia Ludo-Narrativa

> Cuando la narrativa dice una cosa y la mecánica hace otra, se rompe la inmersión.

| Ejemplo de Disonancia                                            | Solución                                |
| ---------------------------------------------------------------- | --------------------------------------- |
| "Eres un jefe vikingo poderoso" pero no puedes mover un edificio | Permitir reposicionar libremente        |
| "Tu aldea fue atacada" pero el jugador no ve daño visual         | Añadir VFX de daño + rebuild            |
| "Los recursos son escasos" pero el jugador tiene 999,999 wood    | Rebalancear sinks o añadir sinks nuevos |

## Output Esperado

```markdown
## 🖥️ UI/UX Spec: [Pantalla/Feature]

### Ocultación de Reglas

| Dato Interno | Presentación al Jugador |
| ------------ | ----------------------- |

### Capas de Información

| Capa | Elementos | ¿Dentro del límite? |
| ---- | --------- | ------------------- |

### Modelo de Interacción: [Multipresencia/Omnipresente]

### Cámara: [Isométrica + params]

### Disonancia Check

- [ ] ¿La narrativa y las mecánicas están alineadas?
- [ ] ¿La UI comunica lo que el sistema realmente hace?
```
