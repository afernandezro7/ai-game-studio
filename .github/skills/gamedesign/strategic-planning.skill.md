# Skill: Planificación Estratégica de Contenido

> Fuente: "Level Design: In Pursuit of Better Levels" — Secciones 1 y 3

## Cuándo Usar Este Skill

Cuando el GameDesign Agent planifica una nueva zona, fase de progresión, contenido nuevo, o cualquier adición al juego que requiera organización espacial o temporal.

## Principio Central

> La planificación exhaustiva antes de la implementación es el único mecanismo capaz de mitigar riesgos técnicos y creativos catastróficos. El desarrollo empírico sin hoja de ruta deriva en el "lienzo en blanco" o en retrabajo masivo.

## Matriz de Evaluación Pre-Diseño

ANTES de diseñar tablas de balance o empezar configs, evaluar estos 3 pilares:

| Pilar             | Pregunta Clave                              | Ejemplo Valhalla                                                |
| ----------------- | ------------------------------------------- | --------------------------------------------------------------- |
| **Restricciones** | ¿Qué es obligatorio y no negociable?        | "El edificio DEBE consumir Wood y producir troops"              |
| **Objetivos**     | ¿Qué intención creativa/emocional persigue? | "El jugador debe sentir poder militar creciente"                |
| **Contexto**      | ¿Dónde encaja en la progresión global?      | "Se desbloquea en Great Hall Lv3, tras dominar economía básica" |

**REGLA:** Si algún pilar está vacío, el diseño NO está listo para producción.

## 5 Preguntas Críticas

Antes de diseñar cualquier contenido nuevo, el GameDesign Agent debe responder:

| #   | Pregunta                       | En City Builder                                                     |
| --- | ------------------------------ | ------------------------------------------------------------------- |
| 1   | **¿Ubicación y contexto?**     | ¿En qué zona de la aldea? ¿Qué nivel de Great Hall?                 |
| 2   | **¿Mecánicas existentes?**     | ¿Usa sistemas que ya existen o requiere nuevos?                     |
| 3   | **¿Qué recordará el jugador?** | ¿Cuál es el highlight? El primer ataque, el primer upgrade épico... |
| 4   | **¿Es creíble?**               | ¿Tiene sentido narrativo en mitología nórdica?                      |
| 5   | **¿Es posible?**               | ¿El scope es realista para el estado actual del proyecto?           |

## Critical Path vs Golden Path

| Concepto          | Definición                                                              | Aplicación Valhalla                                                      |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Critical Path** | Ruta más rápida/directa para completar un objetivo                      | Min-maxer: solo upgradea lo necesario para desbloquear el siguiente tier |
| **Golden Path**   | Ruta óptima diseñada — la experiencia que QUEREMOS que tenga el jugador | Explorador: construye variedad, descubre sinergias, disfruta el journey  |

**REGLA:** Ambas rutas DEBEN funcionar. La Critical Path no debe romperse (soft-lock check de QA). La Golden Path debe ser la más recompensada.

### Validación en Config

```json
{
  "progression_paths": {
    "critical_path": {
      "great_hall_lv2": {
        "min_buildings_required": ["lumber_mill_lv1"],
        "min_resources": { "wood": 500 },
        "min_time_hours": 1.5
      }
    },
    "golden_path": {
      "great_hall_lv2": {
        "recommended_buildings": ["lumber_mill_lv2", "steel_mine_lv1"],
        "bonus_for_following": "unlock_decoration_slot",
        "estimated_time_hours": 3
      }
    }
  }
}
```

## Metodología de Blockout en 5 Pasos (Adaptada a City Builder)

| Paso                        | Original (3D Levels)       | Adaptación Valhalla                                       |
| --------------------------- | -------------------------- | --------------------------------------------------------- |
| 1. **Diagrama de Burbujas** | Áreas y conexiones         | Mapa de relaciones: qué edificios dependen de cuáles      |
| 2. **Mapa Detallado**       | Encuentros por sala        | Balance table: costes, tiempos, producción por building   |
| 3. **Blockout Sucio**       | Bloques simples en 3D      | JSON config draft: valores aproximados, probar en sandbox |
| 4. **Ajustes de Mapa**      | Corregir basándose en feel | Ajustar valores tras playtest en web sandbox              |
| 5. **Blockout Final**       | Iteración con feedback     | Config definitivo validado por @qa                        |

**REGLA:** Nunca pulir configs (paso 5) antes de probar el draft (paso 3). Iterar es más barato que redesignar.

## Output Esperado

```markdown
## 📋 Plan Estratégico: [Nombre del Contenido]

### Matriz de Evaluación

| Pilar         | Respuesta |
| ------------- | --------- |
| Restricciones |           |
| Objetivos     |           |
| Contexto      |           |

### 5 Preguntas

1. Ubicación/contexto: [respuesta]
2. Mecánicas: [respuesta]
3. Highlight memorable: [respuesta]
4. Credibilidad narrativa: [respuesta]
5. Viabilidad técnica: [respuesta]

### Rutas de Progresión

- Critical Path: [descripción + tiempo estimado]
- Golden Path: [descripción + tiempo estimado + bonus]

### Estado de Blockout: [Paso 1-5]
```
