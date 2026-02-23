# Skill: Diseño Centrado en el Jugador y Taxonomía de Desafíos

> Fuente: "Fundamentals of Game Design" (Ernest Adams) — Capítulos 1-2

## Cuándo Usar Este Skill

Cuando el GameDesign Agent crea una nueva mecánica, define un desafío, o necesita validar que el diseño sirve al jugador y no al ego del diseñador.

## Principio Central

> "Tú no eres tu jugador." El diseño es una disciplina de servicio. Cualquier visión artística que obstaculice el flujo debe sacrificarse en favor de la jugabilidad.

## Los Dos Deberes del Diseñador

TODO agente de AI Game Studio DEBE respetar estos deberes en cada decisión:

| Deber                   | Definición                                             | Pregunta de Validación                                                     |
| ----------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| **Deber de Entretener** | La función primaria es el deleite del usuario          | "¿Esto es divertido para el JUGADOR o solo para mí como diseñador?"        |
| **Deber de Empatizar**  | Habitar la mente del jugador para anticipar sus deseos | "¿Puedo listar 3 preferencias de mi audiencia que contradigan mis gustos?" |

### Anti-Patterns del Diseñador Egocéntrico

| Anti-Pattern                   | Señal                                      | Consecuencia                                     |
| ------------------------------ | ------------------------------------------ | ------------------------------------------------ |
| "Es cool porque a mí me gusta" | El diseñador no puede justificar con datos | Feature que no resuena con la audiencia target   |
| "El jugador es mi oponente"    | Dificultad punitiva sin fairness           | Frustración → churn                              |
| "Quiero que sea arte primero"  | Estética bloquea gameplay                  | Producto bonito pero no jugable                  |
| "La audiencia entenderá"       | No se testea con usuarios reales           | Mecánicas incomprensibles para el público target |

## Taxonomía de Desafíos

Toda mecánica DEBE clasificarse en una o más categorías de desafío. Esto asegura que el diseño tiene propósito y no es una "feature gratuita":

| Categoría               | Definición                               | Ejemplo Valhalla                                  | Prioridad                       |
| ----------------------- | ---------------------------------------- | ------------------------------------------------- | ------------------------------- |
| **Económico**           | Gestión de flujos, recursos, estabilidad | Core loop: producir, gastar, upgradar             | 🔴 PRIMARY — es un city builder |
| **Lógica/Estrategia**   | Planificación, optimización, decisiones  | ¿Qué edificio construyo primero? ¿Dónde lo pongo? | 🔴 PRIMARY                      |
| **Conflicto/Defensa**   | Proteger unidades o territorio           | Defender aldea de raids, posicionar defensas      | 🟡 SECONDARY (futuro PvP)       |
| **Exploración**         | Descubrir relaciones y rutas             | Tech tree, combos de edificios, sinergias         | 🟡 SECONDARY                    |
| **Coordinación Física** | Velocidad de reacción, precisión motriz  | Tap para recolectar, drag para posicionar         | 🟢 MINIMAL — es mobile casual   |
| **Sigilo**              | Evitar detección                         | N/A para city builder                             | ⚫ NO APLICA                    |

**REGLA:** Si una mecánica nueva no encaja en ninguna categoría de desafío, es una "feature gratuita" que diluye la elegancia del sistema. Eliminarla o repensar.

### Mapeo Desafío→Acción

Cada desafío DEBE tener una acción vinculada no-trivial:

```markdown
| Desafío            | Acción del Jugador                         | ¿Es No-Trivial?                 |
| ------------------ | ------------------------------------------ | ------------------------------- |
| Gestionar recursos | Elegir qué upgradar con recursos limitados | ✅ Hay trade-off                |
| Defender aldea     | Posicionar defensas estratégicamente       | ✅ Hay decisión espacial        |
| Recolectar recurso | Tap botón de collect                       | ❌ Trivial — necesita más depth |
```

## Elegancia = Economía Interna + Presentación

El estándar de oro de Adams:

| Componente           | Definición                                          | Ejemplo                                                           |
| -------------------- | --------------------------------------------------- | ----------------------------------------------------------------- |
| **Economía Interna** | Las mecánicas subyacentes (balance, flujos, reglas) | BuildingsConfig.json, curvas de coste                             |
| **Presentación**     | Interfaz y estética (cómo se comunica al jugador)   | UI, feedback visual, audio, art style                             |
| **Elegancia**        | La síntesis perfecta de ambas                       | Mecánica sólida + presentación clara = juego "que se siente bien" |

**REGLA:** Si la economía funciona pero la presentación confunde → fallo de UI/UX (@artdirector). Si la presentación es bella pero la economía está rota → fallo de diseño (@gamedesign). Ambos deben estar alineados.

## Gestión del Círculo Mágico

> El círculo mágico es la frontera entre la realidad y la ficción del juego. Solo existe si el jugador acepta voluntariamente las reglas.

### Para Valhalla esto significa:

| Aspecto                      | Implementación                                                                                                                                           |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Significancia artificial** | Los recursos (Wood, Steel, Runes) tienen valor SOLO dentro del juego. NO presionar al jugador fuera del círculo (notificaciones agresivas, FOMO extremo) |
| **Consentimiento**           | El jugador elige jugar. Respetar su tiempo = respetar el círculo                                                                                         |
| **Efimeridad**               | Cada sesión tiene inicio y cierre natural. No forzar sesiones interminables                                                                              |

## Output Esperado

Al diseñar cualquier mecánica nueva:

```markdown
## 🎮 Player-Centric Design: [Mecánica]

### Deberes

- Deber de Entretener: [cómo esta mecánica divierte]
- Deber de Empatizar: [qué quiere el jugador de esto]

### Categoría de Desafío: [Económico/Lógica/Conflicto/etc.]

### Acción Vinculada: [qué hace el jugador — debe ser no-trivial]

### Elegancia Check

- Economía Interna: [funciona? datos?]
- Presentación: [se comunica claramente?]
- Síntesis: [✅ Elegante / ❌ Desalineado — especificar lado roto]
```
