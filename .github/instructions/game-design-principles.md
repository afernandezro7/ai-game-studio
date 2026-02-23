# Principios de Diseño de Juegos — Reglas Derivadas de la Librería del Estudio

> Fuente: Síntesis de "Level Up!" (Scott Rogers) y librería de referencia en `docs/books/`.
> Estas reglas son OBLIGATORIAS para todos los agentes al diseñar, implementar o validar mecánicas.

---

## 1. Las Tres Cs son Ley (Personaje, Cámara, Controles)

Ninguna mecánica se implementa sin definir primero cómo afecta a las Tres Cs:

- **Personaje:** Tamaño, velocidad, inercia y capacidades de colisión determinan la identidad jugable. Los rasgos estéticos DEBEN tener una consecuencia mecánica.
- **Cámara:** La perspectiva es el ojo del jugador. Define la cámara (isométrica, top-down, etc.) y sus límites ANTES de diseñar niveles o UI.
- **Controles:** El esquema de interacción debe eliminar TODA fricción entre la intención del jugador y la acción en pantalla. Incluir siempre las variantes: táctil, controlador, teclado.

> **Regla de Oro:** Si el control es torpe o la cámara marea, el juego será abandonado en los primeros 10 minutos. Da igual la historia o los gráficos.

## 2. GDD = Contrato de Producción

El GDD no es un trámite. Es el mapa que evita el _scope creep_ que quiebra estudios:

- Todo valor DEBE ser un número explícito (coste, tiempo, DPS, HP).
- Si no está en el GDD, no se implementa.
- El GDD debe ser visualmente atractivo — tablas, diagramas, iconos. Un documento feo no se lee.

## 3. Feedback Loop Sensorial Completo

Cada acción del jugador DEBE tener retroalimentación por al menos 2 de estos 3 canales:

| Canal   | Ejemplo                                  |
| ------- | ---------------------------------------- |
| Visual  | Partículas, screen shake, flash de color |
| Sonoro  | Efecto de impacto, jingle de recompensa  |
| Háptico | Vibración del controlador (si aplica)    |

> **Regla:** Nunca dejar un input sin respuesta. Si el jugador toca algo y no pasa nada visible/audible, es un bug de diseño.

## 4. Tensión y Liberación (Pacing)

El juego debe alternar entre momentos de alta intensidad y momentos de calma:

- **Pico:** Combate, jefe, timer, presión de recursos.
- **Valle:** Exploración, decoración de base, narrativa, recompensas.
- Un juego que es SIEMPRE intenso fatiga. Un juego que es SIEMPRE calmado aburre.

## 5. Enseñar sin Decir (Implicit Teaching)

Los niveles y la UI deben enseñar las mecánicas al jugador SIN muros de texto:

1. Introducir la mecánica en un entorno seguro (sin castigo por fallar).
2. Requerir su uso bajo presión (con enemigos o timer).
3. Combinar con mecánicas previas.

> Usar luz, color, geometría y breadcrumbs (coleccionables en el camino) para guiar al jugador.

## 6. Audio = 50% de la Experiencia

El audio NO es un adorno ni lo último que se presupuesta:

- El diseño de sonido da peso físico a objetos virtuales.
- La música debe apoyar la emoción sin estorbar.
- Los sonidos deben ser distintos por tipo de acción (éxito ≠ fallo ≠ peligro).

## 7. Roles Claros = Producción Sana

La ambigüedad en los roles es el cáncer de la producción:

| Rol         | Responsabilidad                              |
| ----------- | -------------------------------------------- |
| Producer    | Visión, viabilidad financiera, cronograma    |
| GameDesign  | Reglas, sistemas, tablas de balance          |
| Archivist   | Documentación como fuente de verdad          |
| QA          | Romper el juego antes que los jugadores      |
| Developer   | Configs JSON y código ejecutable             |
| ArtDirector | Identidad visual, prompts de arte, diagramas |

## 8. Validar Antes de Producir

Ningún concepto entra en producción sin:

1. **Market fit:** ¿Hay mercado para esto?
2. **Core loop definido:** ¿Qué hace el jugador cada 30 segundos?
3. **Narrativa como retención:** Si el jugador no conecta con el mundo, abandona en el primer pico de dificultad.

---

_Estas reglas aplican a TODOS los agentes del estudio. Derivadas de la librería de referencia en `docs/books/`._
