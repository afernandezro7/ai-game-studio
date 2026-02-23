# Skill: Prototipado Config-Driven y Validación Espacial

> Fuente: "Level Design: In Pursuit of Better Levels" — Secciones 2, 3 y 4

## Cuándo Usar Este Skill

Cuando el Developer implementa nuevos edificios, grids, zonas, o cualquier sistema que tenga dimensiones espaciales en el juego.

## Principio Central

> La transición del concepto a la forma tangible exige iteración rápida sobre pulido visual. Identificar fallos antes de invertir en arte final.

## Flujo de Prototipado (5 pasos)

| Paso                | Quién                | Acción                              | Artefacto                |
| ------------------- | -------------------- | ----------------------------------- | ------------------------ |
| 1. Diagrama         | @gamedesign          | Define relaciones y dependencias    | Mermaid diagram          |
| 2. Balance Draft    | @gamedesign          | Tabla de valores aproximados        | Markdown tables          |
| 3. **Config Draft** | **@developer**       | Implementa JSON con valores draft   | `*Config.json` (draft)   |
| 4. **Sandbox Test** | **@developer + @qa** | Prueba en web sandbox, recoge datos | Playtest report          |
| 5. **Config Final** | **@developer**       | Ajusta valores, @qa valida final    | `*Config.json` (release) |

**REGLA:** Nunca saltar del paso 2 al paso 5. Siempre pasar por sandbox test.

## Métricas en Config JSON

Todas las dimensiones espaciales DEBEN estar centralizadas, nunca hardcoded en componentes:

### MetricsConfig.json (nuevo)

```json
{
  "grid": {
    "tile_size_px": 64,
    "tile_size_units": 1
  },
  "building_sizes": {
    "small": { "width": 2, "height": 2 },
    "medium": { "width": 3, "height": 3 },
    "large": { "width": 4, "height": 4 },
    "epic": { "width": 5, "height": 5 }
  },
  "interaction_radii": {
    "tap_select": 1.5,
    "buff_aoe": 3,
    "defense_range": 5,
    "alarm_range": 8
  },
  "camera": {
    "min_zoom_visible_tiles": 20,
    "max_zoom_visible_tiles": 8,
    "default_zoom_visible_tiles": 14
  },
  "reference_objects": {
    "viking_npc_height_tiles": 0.5,
    "tree_standard_size_tiles": 1,
    "torch_height_tiles": 0.3
  }
}
```

### Validación de Nuevos Buildings

Cuando @gamedesign envía un nuevo building, el Developer DEBE verificar:

| Check                                         | Cómo Validar                             | Config Reference     |
| --------------------------------------------- | ---------------------------------------- | -------------------- |
| El tamaño del building está en los estándares | `building_sizes[size_category]`          | MetricsConfig.json   |
| El radio de interacción es consistente        | `interaction_radii[type]`                | MetricsConfig.json   |
| Es tocable a zoom normal                      | `tap_select` radius ≥ building width / 2 | MetricsConfig.json   |
| No overlaps con grid estándar                 | Building width/height son enteros        | BuildingsConfig.json |

## Escala de Juego vs Escala Real

> Las proporciones reales aplicadas al juego generan espacios disfuncionales. La funcionalidad de cámara prevalece sobre el realismo.

### Regla para el Developer

```typescript
// CORRECTO: Usar métricas de juego
const BUILDING_SIZE = metricsConfig.building_sizes[building.sizeCategory];

// INCORRECTO: Inventar tamaños "realistas"
const BUILDING_SIZE = { width: 20, height: 15 }; // "como un edificio real"
```

## Backdrop y Rendimiento

> Un backdrop intrincado mejora experiencia pero aumenta carga de trabajo y reduce rendimiento.

| Elemento               | Costo de Render                 | Regla                              |
| ---------------------- | ------------------------------- | ---------------------------------- |
| Terreno base (tiles)   | Bajo                            | Se puede dar detalle               |
| Edificios interactivos | Medio                           | Optimizar sprites por nivel        |
| Decoraciones (props)   | Bajo individual, alto acumulado | Limitar cantidad por zona          |
| Fondo parallax         | Bajo (estático)                 | Solo 2-3 capas máximo              |
| Efectos de partículas  | Alto                            | Solo en eventos, nunca permanentes |

**REGLA:** Si el sandbox baja de 30fps, reducir decoraciones y efectos antes de optimizar edificios.

## Validación de Escala (Audit)

Antes de mergear nuevos assets o tamaños:

```markdown
### Scale Audit: [Building/Asset Name]

| Check                                         | Resultado |
| --------------------------------------------- | --------- |
| ¿Tamaño sigue MetricsConfig?                  | ✅/❌     |
| ¿Viking NPC cabe al lado sin overlap?         | ✅/❌     |
| ¿Se ve bien a zoom mínimo (20 tiles)?         | ✅/❌     |
| ¿Se ve bien a zoom máximo (8 tiles)?          | ✅/❌     |
| ¿No hay reescalado inconsistente con vecinos? | ✅/❌     |
| ¿FPS del sandbox > 30 tras añadirlo?          | ✅/❌     |
```
