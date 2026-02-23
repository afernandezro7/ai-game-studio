# Skill: Lenguaje Visual y Legibilidad

> Fuente: "Level Up!" — Sección 5 (Interfaz, Niveles y Combate) + Sección 7 (Pulido Final)

## Cuándo Usar Este Skill

Cuando el ArtDirector define la identidad visual de un edificio, zona, UI element, o cualquier asset visual.

## Reglas de Lenguaje Visual

### 1. Legibilidad ante Todo

En mobile, la pantalla es pequeña. Si el jugador no puede distinguir un edificio de otro a tamaño de juego (no en zoom), el diseño visual ha fallado.

| Regla                  | Criterio                                                                   |
| ---------------------- | -------------------------------------------------------------------------- |
| Silueta única          | Cada edificio DEBE tener una silueta distinta y reconocible a 64px         |
| Color funcional        | El color comunica función: marrón = wood, plata = steel, púrpura = premium |
| Escala como progresión | Lv1 = modesto y pequeño. Lv10 = épico y grande con efectos                 |
| Iconos a 32px          | Todo icono de recurso/acción debe ser legible a 32x32 pixels               |

### 2. Progresión Visual de Edificios

Cada edificio debe contar visualmente su nivel:

| Level Range | Estilo Visual                                           |
| ----------- | ------------------------------------------------------- |
| Lv 1        | Simple, madera, pequeño, modesto                        |
| Lv 2-3      | Más grande, algo de piedra, decoraciones aparecen       |
| Lv 4-5      | Grande, piedra + madera, elementos brillantes, banderas |
| Lv 6-8      | Épico, elementos mágicos, partículas                    |
| Lv 9-10     | Legendario, aura mítica, silueta única                  |

**Regla:** Un jugador debe poder estimar el nivel de un edificio SOLO mirándolo, sin leer números.

### 3. HUD como Lenguaje de Señas

La UI NO es decoración. Es un sistema de comunicación silencioso:

- **Barra de salud:** Degradado verde → amarillo → rojo. Nunca solo un número.
- **Botones de acción:** Viking Gold (`#DAA520`) para acciones primarias. Gris para deshabilitados.
- **Alertas:** Fire Orange (`#FF4500`) para peligro. Forest Green (`#228B22`) para éxito.
- **Premium:** Deep Purple (`#9370DB`) exclusivamente para elementos de runes/premium.

### 4. Audio Visual Synergy

El ArtDirector coordina con el diseño sonoro para asegurar:

| Evento Visual       | Audio Esperado                      | Regla       |
| ------------------- | ----------------------------------- | ----------- |
| Edificio completado | Sound de construcción satisfactorio | OBLIGATORIO |
| Recurso recolectado | Jingle de monedas/madera            | OBLIGATORIO |
| Upgrade disponible  | Sonido sutil de notificación        | Recomendado |
| Ataque enemigo      | Alarma bélica                       | OBLIGATORIO |

> **Regla de "Level Up!":** El audio es el 50% de la experiencia. Un triple A sin audio se siente como un producto amateur.

### 5. Cinemáticas y Momentos "Wow"

Las cinemáticas y transiciones deben ser:

- **Breves:** < 10 segundos para transiciones, < 30 segundos para narrativa.
- **Significativas:** Solo mostrar si comunican algo nuevo.
- **Saltables:** SIEMPRE permitir skip después del primer visionado.
- **Recompensa visual:** Usar como premio por completar un hito difícil.

## Output Esperado

```markdown
## 🎨 Visual Spec: [Nombre del Asset]

### Silueta

[Descripción o ASCII art]

### Progresión por Nivel

| Nivel | Material | Escala | Efectos Especiales |
| ----- | -------- | ------ | ------------------ |

### Paleta de Color

| Elemento | Hex | Uso |
| -------- | --- | --- |

### Audio Pairing

| Evento | Sound ID | Prioridad |
| ------ | -------- | --------- |
```
