# Skill: Arquitectura de Mundo y Nivel Design

> Fuente: "Level Up!" — Sección 5 (Interfaz, Niveles y Combate)

## Cuándo Usar Este Skill

Cuando el GameDesign agent diseña un nuevo nivel, mapa, zona de combate, o estructura de mundo.

## Reglas de Nivel Design

### Lenguaje de Señas (Sign Language)

El HUD y los iconos son un sistema de retroalimentación visual. Deben comunicar SIN palabras:

| Elemento          | Qué Comunica                | Regla                                         |
| ----------------- | --------------------------- | --------------------------------------------- |
| Barra de salud    | Estado del jugador/edificio | Color degradado: verde → amarillo → rojo      |
| Iconos de recurso | Tipo y cantidad             | El icono debe ser reconocible a 32px          |
| Indicadores       | Progreso, cooldown, peligro | Usar arcos/barras, nunca solo texto numérico  |
| Tooltips          | Info detallada bajo demanda | Solo en long-press o hover, nunca permanentes |

**Regla:** Si el jugador necesita un tutorial de texto para entender la UI, la UI ha fallado.

### Diseño de Espacios de Combate

Los enemigos NO son solo obstáculos — son herramientas de diseño de niveles:

1. **Sinergia de enemigos:** Combinar tipos que se complementen (tanque que empuja al jugador fuera de cobertura + francotirador estático).
2. **Escalada controlada:** Primero 1 enemigo simple, luego 2 del mismo tipo, luego 1 nuevo + 1 conocido.
3. **Jefe = Examen final:** El boss DEBE testear las habilidades que el nivel enseñó. Nunca introducir mecánicas nuevas en un boss fight.

### Estructura de Mundo

| Patrón       | Uso                                                 |
| ------------ | --------------------------------------------------- |
| Hub & Spoke  | Base central + zonas radiantes (ideal city builder) |
| Lineal       | Narrativa fuerte, pacing controlado                 |
| Open World   | Exploración libre, requiere landmarks fuertes       |
| Metroidvania | Backtracking con nuevas habilidades que desbloquean |

**Para city builders (nuestro caso):** El patrón es **Hub & Spoke**:

- El Hub es la base del jugador (la aldea vikinga)
- Los Spokes son las zonas de ataque, exploración, o recolección

### Métricas Obligatorias (antes de construir)

Definir ANTES de empezar el blockout:

```yaml
grid_size: 1 unit = X metros
building_footprint_min: 2x2 units
building_footprint_max: 4x4 units
path_width_min: 1 unit
camera_zoom_min: 5 units
camera_zoom_max: 50 units
base_area_total: 30x30 units
```

## Output Esperado

```markdown
## 🗺️ Diseño de [Zona / Nivel / Mapa]

### Estructura

- Patrón: Hub & Spoke / Lineal / etc
- Tamaño: X × Y units

### Métricas

| Métrica | Valor |
| ------- | ----- |

### Flow del Jugador

[Descripción paso a paso o flowchart]

### Enemigos / Desafíos

| Enemigo | Posición | Propósito |
| ------- | -------- | --------- |
```
