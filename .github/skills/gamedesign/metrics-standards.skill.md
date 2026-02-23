# Skill: Sistema de Métricas y Estándares Espaciales

> Fuente: "Level Design: In Pursuit of Better Levels" — Sección 2 (Métricas) + Sección 4 (Geometría)

## Cuándo Usar Este Skill

Cuando el GameDesign Agent o @developer definen grids, tamaños de edificios, distancias de interacción, o cualquier valor espacial del juego.

## Principio Central

> Las métricas constituyen el lenguaje común entre diseño, arte y programación. Su estandarización previene el retrabajo masivo; un activo de arte creado sin respetar estas medidas es un activo nulo.

## Métricas Estándar para City Builder (Isométrico Mobile)

### Grid y Tiles

| Métrica           | Valor                | Justificación                 |
| ----------------- | -------------------- | ----------------------------- |
| Tile base         | 1x1 (unidad de grid) | Unidad mínima de construcción |
| Edificio pequeño  | 2x2 tiles            | Lumber Mill, Steel Mine       |
| Edificio mediano  | 3x3 tiles            | Barracks, Temple              |
| Edificio grande   | 4x4 tiles            | Great Hall                    |
| Edificio épico    | 5x5 tiles            | Wonder / monumento endgame    |
| Camino principal  | 2 tiles de ancho     | Legible a zoom mínimo         |
| Camino secundario | 1 tile de ancho      | Decorativo                    |

### Distancias de Interacción

| Interacción                | Radio (en tiles) | Propósito                              |
| -------------------------- | ---------------- | -------------------------------------- |
| Tap para seleccionar       | 1.5 tiles        | Tolerancia de dedo gordo en mobile     |
| Área de efecto (buff)      | 3 tiles          | Radio de edificios que buffean vecinos |
| Zona de defensa            | 5 tiles          | Radio de torre defensiva               |
| Visión completa (zoom out) | 20x20 tiles      | Aldea completa visible en pantalla     |

### Escala de Juego vs Escala Real

> Las métricas deben priorizar la funcionalidad de la cámara por sobre el realismo arquitectónico.

| Elemento           | Escala Real | Escala de Juego       | Por Qué                                           |
| ------------------ | ----------- | --------------------- | ------------------------------------------------- |
| Puerta             | 2.1m        | 1x1 tile              | Debe ser claramente tocable                       |
| Viking (personaje) | 1.8m        | 0.5 tiles de alto     | Proporcional al edificio                          |
| Árbol decorativo   | 5-15m varía | 1x1 tile, altura fija | Constante de referencia (ver Regla de Constantes) |
| Great Hall         | ~20m real   | 4x4 tiles             | Domina visualmente la aldea                       |

## Regla de las Constantes

> Un jugador calcula distancias usando objetos de tamaño conocido como referencia.

En Valhalla, las **constantes de referencia** son:

| Constante              | Tamaño Fijo      | Propósito                                  |
| ---------------------- | ---------------- | ------------------------------------------ |
| Viking (NPC caminante) | Siempre igual    | Referencia humana para escala de edificios |
| Árbol de pino estándar | 1x1, altura fija | Referencia de naturaleza                   |
| Antorcha/poste         | Siempre igual    | Referencia small en cualquier zona         |

**REGLA para @artdirector:** Estos 3 elementos NUNCA deben reescalarse. Son anclas de percepción espacial.

## Gym de Validación

Antes de implementar nuevos tamaños de edificios o zonas, validar en el sandbox:

```markdown
### Gym Test: [Nombre del Asset]

| Test                                       | Resultado |
| ------------------------------------------ | --------- |
| ¿Es tocable con un dedo a zoom normal?     | ✅/❌     |
| ¿Se distingue de edificios vecinos a 64px? | ✅/❌     |
| ¿La cámara no clipea con nada?             | ✅/❌     |
| ¿El NPC viking cabe al lado sin overlap?   | ✅/❌     |
| ¿A zoom mínimo sigue siendo identificable? | ✅/❌     |
```

## Config JSON de Métricas

Todas las métricas DEBEN estar centralizadas en config, nunca hardcoded:

```json
{
  "metrics": {
    "grid": { "tile_size_px": 64, "tile_size_units": 1 },
    "buildings": {
      "small": { "tiles": [2, 2] },
      "medium": { "tiles": [3, 3] },
      "large": { "tiles": [4, 4] },
      "epic": { "tiles": [5, 5] }
    },
    "interaction": {
      "tap_radius_tiles": 1.5,
      "buff_radius_tiles": 3,
      "defense_radius_tiles": 5
    },
    "camera": {
      "min_zoom_tiles": [20, 20],
      "max_zoom_tiles": [8, 8]
    }
  }
}
```
