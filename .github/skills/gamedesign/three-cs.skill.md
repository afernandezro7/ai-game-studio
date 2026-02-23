# Skill: Las Tres Cs (Personaje, Cámara, Controles)

> Fuente: "Level Up!" — Sección 4 (Pilares de la Experiencia)

## Cuándo Usar Este Skill

Cuando el GameDesign agent define un nuevo personaje, cambia la perspectiva de un juego, o diseña un esquema de controles.

## Las Tres Cs — Framework Obligatorio

### 1. Personaje (Character)

Los rasgos del personaje NO son estéticos: son mecánicos.

| Rasgo           | Impacto Mecánico                                                  |
| --------------- | ----------------------------------------------------------------- |
| Tamaño (hitbox) | Determina colisiones, cobertura, y navegación por espacios        |
| Velocidad base  | Define el ritmo del juego y el tamaño de los niveles              |
| Inercia/Peso    | Ligero = ágil, respuesta inmediata. Pesado = momentum, deliberado |
| Capacidades     | Salto, dash, ataque — cada una debe tener valores numéricos       |

**Regla:** Definir SIEMPRE las capacidades como datos numéricos en el GDD:

```
speed: 5.0 units/s
jump_height: 3.2 units
attack_range: 1.5 units
attack_speed: 1.2s cooldown
hitbox: 1.0 x 2.0 units
```

### 2. Cámara (Camera)

La cámara define cómo el jugador percibe el mundo. Elegir una y documentarla:

| Tipo            | Uso Ideal                              | Riesgo                     |
| --------------- | -------------------------------------- | -------------------------- |
| Isométrica      | City builders, strategy (nuestro caso) | Clicking precision         |
| Top-down        | Roguelikes, twin-stick shooters        | Poca profundidad visual    |
| Tercera persona | Action RPG, adventure                  | Cámara mareante si es mala |
| Side-scroll     | Platformers, metroidvanias             | Limitado en 3D             |

**Regla:** En un city builder isométrico (Project Valhalla), la cámara DEBE:

- Permitir zoom in/out con límites definidos (min: 5 units, max: 50 units)
- Permitir rotación (0°, 90°, 180°, 270°) o pan libre
- Nunca ocultar edificios interactuables detrás de otros

### 3. Controles (Controls)

El control es la traducción directa de intención → acción. Cero fricción.

**Para mobile (nuestro target):**

- Tap = seleccionar / ejecutar acción primaria
- Drag = mover cámara / arrastrar edificio
- Pinch = zoom in/out
- Long press = menú contextual / info detallada
- Swipe = acciones rápidas (si aplica)

**Regla:** Cada control debe listarse en una tabla del GDD:

| Input        | Acción                 | Feedback Visual              | Feedback Sonoro |
| ------------ | ---------------------- | ---------------------------- | --------------- |
| Tap edificio | Abrir menú de edificio | Highlight + bounce animation | "pop" sound     |
| Drag vacío   | Pan de cámara          | Parallax del fondo           | Ninguno         |
| Pinch        | Zoom                   | Smooth zoom con ease-out     | Subtle whoosh   |

## Output Esperado

Cuando se define un nuevo personaje o se modifica la interacción, el output DEBE incluir:

```markdown
## 🎮 Tres Cs — [Nombre del Elemento]

### Character

- Speed: X units/s
- Hitbox: X × Y units
- Capabilities: [lista con valores]

### Camera

- Type: [Isométrica/etc]
- Zoom range: [min-max]
- Rotation: [grados o libre]

### Controls

| Input | Action | Visual Feedback | Audio Feedback |
```
