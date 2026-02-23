# Skill: Pacing y Estructura de Progresión

> Fuente: "Level Design Book" — Sección 4 (Estructura y Metodología)

## Cuándo Usar Este Skill

Cuando el GameDesign Agent diseña la progresión general del juego, el flujo de una sesión, o la estructura de zonas/fases.

## Principio Central

> La elección entre linealidad y no linealidad no es estética; es una decisión de ingeniería sobre el control del pacing (ritmo). Sacrificamos libertad a cambio de control dramático, o viceversa.

## Modelos de Progresión

| Modelo                  | Control del Diseñador                     | Libertad del Jugador               | Cuándo Usar                     | Riesgo                                |
| ----------------------- | ----------------------------------------- | ---------------------------------- | ------------------------------- | ------------------------------------- |
| **Lineal**              | 100% — arco dramático garantizado         | Mínima                             | Tutoriales, campañas narrativas | Sensación de "raíles" asfixiantes     |
| **Semi-lineal**         | Alto — bottlenecks sincronizan al jugador | Moderada (exploración entre hitos) | City builders con milestones    | Balance entre libertad y guía         |
| **Sandbox / No-lineal** | Mínimo — emergente                        | Máxima                             | Modo libre, endgame             | QA nightmare: infinitas permutaciones |

### Aplicación a Valhalla (City Builder)

Valhalla es **semi-lineal por naturaleza**:

- **Bottlenecks (cuellos de botella):** El Great Hall actúa como bottleneck. Subir su nivel desbloquea nuevos edificios. Esto SINCRONIZA al jugador con el contenido previsto.
- **Libertad entre bottlenecks:** Dentro de un nivel de Great Hall, el jugador elige LIBREMENTE qué edificios construir/mejorar primero.
- **Progresión:** Great Hall Lv1 → Lv2 → Lv3... cada uno es un "capítulo" del juego.

```
[Tutorial Lineal] → [Great Hall Lv1: libertad limitada] → [Bottleneck: upgrade GH]
→ [Great Hall Lv2: más opciones] → [Bottleneck] → [Great Hall Lv3: sandbox parcial]
→ ... → [Endgame: sandbox total con PvP/clanes]
```

**REGLA:** Cada nivel de Great Hall DEBE configurarse en `BuildingsConfig.json` con:

- `unlocks`: array de building IDs que se desbloquean
- `requirements`: recursos + tiempo + nivel previo

## Pirámide de Freytag (Arco Dramático)

Gustav Freytag (1863) definió la estructura dramática que sigue siendo el estándar industrial:

```
          CLÍMAX
           /\
          /  \
   RISING/    \FALLING
  ACTION/      \ACTION
       /        \
      /          \
EXPOSITION    RESOLUTION
```

### Mapeo a Sesiones de Juego

| Fase Freytag       | En una sesión típica (10-15 min)                             | Config Valhalla                                       |
| ------------------ | ------------------------------------------------------------ | ----------------------------------------------------- |
| **Exposition**     | Jugador entra, ve su aldea, recolecta recursos acumulados    | Login reward, producción offline                      |
| **Rising Action**  | Empieza upgrades, lee misiones, planifica                    | Múltiples acciones disponibles                        |
| **Clímax**         | Momento de máxima tensión: upgrade caro, batalla, desbloqueo | Gran upgrade o evento de combate                      |
| **Falling Action** | Resolución del clímax, ver resultados                        | Animación de upgrade completado, rewards              |
| **Resolution**     | Cierre satisfactorio, set up para la próxima sesión          | "Vuelve en 2h para recolectar" / daily reward preview |

**REGLA:** Una sesión que es TODA clímax agota. Una sesión SIN clímax aburre. El balance es:

- ~20% Exposition
- ~30% Rising Action
- ~15% Clímax
- ~20% Falling Action
- ~15% Resolution

## Bottlenecks: Diseño de Cuellos de Botella

Los bottlenecks son los puntos de sincronización del jugador con el contenido diseñado.

### Reglas para Bottlenecks en Valhalla

| Regla                    | Descripción                                                   | Validación                                     |
| ------------------------ | ------------------------------------------------------------- | ---------------------------------------------- |
| Siempre tiene recompensa | Superar un bottleneck abre contenido NUEVO y emocionante      | Verificar `unlocks` no está vacío              |
| Nunca es solo un muro    | El bottleneck debe sentirse como un logro, no como un castigo | QA valida que el tiempo de espera es razonable |
| Comunica progreso        | El jugador SABE qué le espera al otro lado                    | UI muestra preview de lo que se desbloquea     |
| Escalado gradual         | Cada bottleneck es un poco más difícil que el anterior        | Verificar curva de costes en BuildingsConfig   |

## Contenido Emergente en Sandbox

Cuando el jugador entra en fase sandbox (endgame), el contenido "gratuito" emerge de los sistemas:

| Sistema Emergente   | Cómo Genera Contenido                 | Requisito                         |
| ------------------- | ------------------------------------- | --------------------------------- |
| PvP / Raiding       | Jugadores crean desafíos entre sí     | Sistemas de combate + matchmaking |
| Clanes              | Dinámicas sociales, guerras de clanes | Social systems config             |
| Economía de mercado | Trading entre jugadores               | Market system                     |
| Personalización     | Cada aldea es única                   | Building placement freedom        |

**REGLA:** El sandbox NO reemplaza al contenido diseñado. Es un COMPLEMENTO para el endgame.

## Output Esperado

Al diseñar la progresión de una nueva fase:

```markdown
## 📈 Estructura de Progresión: [Fase/Feature]

### Modelo: [Lineal / Semi-lineal / Sandbox]

### Bottlenecks

| #   | Trigger | Recompensa | Tiempo estimado |
| --- | ------- | ---------- | --------------- |

### Arco Dramático de Sesión

| Fase | Duración | Actividad |
| ---- | -------- | --------- |

### Contenido Emergente (si aplica)

| Sistema | Tipo de emergencia |
| ------- | ------------------ |
```
