# Skill: Legibilidad Visual, Landmarks y Navegación Espacial

> Fuente: "Level Design: In Pursuit of Better Levels" — Secciones 5, 6 y 7

## Cuándo Usar Este Skill

Cuando el ArtDirector diseña layouts de aldea, define paletas por zona, crea assets visuales, o necesita asegurar que el jugador no se pierda visualmente.

## Principio Central

> La legibilidad permite discernir elementos clave sin fatiga visual. El exceso de detalle o "ruido visual" es el enemigo de la jugabilidad.

## Reglas de Readability (Legibilidad)

### Jerarquía de Contraste

El fondo SIEMPRE debe ser menos llamativo que los elementos interactivos:

| Capa                         | Saturación        | Detalle        | Ejemplo Valhalla                         |
| ---------------------------- | ----------------- | -------------- | ---------------------------------------- |
| **Fondo/terrain**            | Baja (desaturado) | Mínimo         | Nieve, tierra, hierba (tonos apagados)   |
| **Edificios (interactivos)** | Media-Alta        | Medio          | Siluetas distintas, colores funcionales  |
| **UI/HUD**                   | Máxima            | Alto contraste | Botones Viking Gold, alertas Fire Orange |
| **Efectos/feedback**         | Máxima + brillo   | Partículas     | Upgrade completado, recurso recolectado  |

**REGLA:** Si un edificio se confunde con el terreno, es un fallo de readability. Aumentar contraste.

### Control de Ruido Visual

| Zona                 | Regla                                         | Ejemplo                              |
| -------------------- | --------------------------------------------- | ------------------------------------ |
| Suelo del grid       | Limpio, pattern sutil y repetitivo            | Textura de nieve/tierra uniforme     |
| Bordes de mapa       | Detalle decorativo permitido (no interactivo) | Montañas, bosque denso, mar          |
| Zona de construcción | CERO decoración que compita con edificios     | Solo grid visible + edificios        |
| UI overlay           | Mínimo necesario, transparencia en reposo     | Barras de recurso semi-transparentes |

### Parallax y Profundidad

Para dar sensación de profundidad en vista isométrica:

| Plano            | Movimiento al scroll | Contenido                      |
| ---------------- | -------------------- | ------------------------------ |
| **Primer plano** | Rápido (1:1)         | Edificios, personajes, UI      |
| **Plano medio**  | Moderado (0.5:1)     | Árboles lejanos, colinas       |
| **Fondo**        | Lento (0.2:1)        | Montañas, aurora boreal, cielo |

## Sistema de Landmarks

Los landmarks son anclas psicológicas que evitan desorientación. En un city builder con zoom, son CRÍTICOS.

### Clasificación

| Tipo      | Escala               | Visible Desde     | Ejemplo Valhalla                                                             |
| --------- | -------------------- | ----------------- | ---------------------------------------------------------------------------- |
| **Micro** | Detalle pequeño      | Solo zoom cercano | Runa en el suelo, cráneo en estaca                                           |
| **Meso**  | Edificio/zona        | Zoom medio        | Lumber Mill (silueta triangular), Steel Mine (silueta cuadrada con chimenea) |
| **Macro** | Estructura dominante | Cualquier zoom    | Great Hall (siempre el edificio más grande y centrado)                       |

### Reglas de Landmarks

| Regla                                 | Descripción                                      | Validación                                |
| ------------------------------------- | ------------------------------------------------ | ----------------------------------------- |
| Great Hall = Macro landmark           | Siempre visible, siempre el más grande           | Verificar a zoom mínimo                   |
| Cada tipo de edificio = Meso landmark | Silueta ÚNICA por tipo (no por nivel)            | Test de silueta a 64px                    |
| Decoraciones = Micro landmarks        | Permiten personalización y orientación local     | Opcionales pero recomendados              |
| No repetir sin variación              | Dos edificios iguales juntos = "Similarity Trap" | Verificar que levels visualmente difieren |

### Similarity Trap (Trampa de Similitud)

> En zonas repetitivas, el jugador pierde orientación. Se DEBE implementar variación visual.

| Problema                          | Solución                                                         |
| --------------------------------- | ---------------------------------------------------------------- |
| 3 Lumber Mills iguales en fila    | Progresión visual por nivel (Lv1 ≠ Lv2 ≠ Lv3)                    |
| Varias zonas de terreno idénticas | Area Landmarking: variación en textura de suelo por zona         |
| Aldea "toda igual" en zoom out    | Macro landmark (Great Hall) + distribución desigual de edificios |

## Comunicación de Continuidad

Para indicar que hay "más juego" fuera de la vista actual:

| Técnica                   | Cómo                                        | Ejemplo                                         |
| ------------------------- | ------------------------------------------- | ----------------------------------------------- |
| **Luz/Glow**              | Resplandor sutil desde borde de pantalla    | Zona nueva desbloqueada brilla                  |
| **Elementos incompletos** | Camino que continúa fuera del frame visible | Camino que se corta en el borde invita a scroll |
| **Audio directo**         | Sonido que viene de dirección específica    | Construcción sonando fuera de vista             |

## Output Esperado

```markdown
## 👁️ Visual Readability Spec: [Zona/Feature]

### Jerarquía de Contraste

| Capa | Tratamiento |
| ---- | ----------- |

### Landmarks

| Tipo | Elemento | Propósito |
| ---- | -------- | --------- |

### Similarity Trap Check

- [ ] No hay 2+ edificios idénticos sin variación visual
- [ ] Cada zona tiene identidad visual propia
- [ ] Macro landmark visible a cualquier zoom

### Parallax Layers

| Plano | Contenido | Ratio |
| ----- | --------- | ----- |
```
