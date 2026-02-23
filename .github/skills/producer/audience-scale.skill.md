# Skill: Análisis de Audiencia y Escala

> Fuente: "Characteristics of Games" (Elias, Garfield, Gutschera) — Capítulos 1, 2 y 3

## Cuándo Usar Este Skill

Cuando el Producer evalúa un nuevo modo de juego, define la audiencia target, o necesita decidir sobre features multijugador (clanes, PvP, co-op).

## Principio Central

> El número de participantes determina la topología del juego y la naturaleza de su equilibrio. Cada modo tiene un "sweet spot" donde las mecánicas alcanzan su máxima eficiencia sistémica.

## Framework de Análisis de Audiencia

### Sweet Spot por Modo

Antes de aprobar un feature multijugador, el Producer DEBE evaluar:

| Modo               | Sweet Spot        | Revenue Model                  | Retention Impact                | Riesgo Principal                     |
| ------------------ | ----------------- | ------------------------------ | ------------------------------- | ------------------------------------ |
| **Solo PvE**       | 1 jugador         | Session-based IAP, Battle Pass | Alto D1, medio D30              | Monotonía sin variedad de contenido  |
| **Co-op (Clanes)** | 10-30 activos     | Social stickiness, clan IAP    | Medio D1, alto D30              | Alpha player monopoliza decisiones   |
| **PvP Asimétrico** | 1v1 matchmade     | Competitive IAP, cosmetics     | Bajo D1, variable D30           | Pay-to-win perception destruye trust |
| **PvP Equipos**    | 5v5 a 15v15       | Season pass, rankings          | Bajo D1, alto D30 si balance OK | Kingmaking + toxicidad               |
| **MMO/Social**     | 100+ concurrentes | Economy tax, premium subs      | Varía enormemente               | Interacción individual diluida       |

### Evaluación de Viabilidad

```markdown
## 👥 Audience Assessment: [Modo/Feature]

### Sweet Spot: [N] jugadores

### Revenue Alignment: [modelo de monetización compatible]

### Retention Projection: D1 [%], D7 [%], D30 [%]

### Riesgos de Escala

| Riesgo | Probabilidad | Mitigación |
| ------ | ------------ | ---------- |
```

## Reglas de Infraestructura (Rules Design)

Del libro, reglas clave para el Producer al evaluar complejidad de features:

### Jerarquía de Reglas

| Nivel         | Definición                | Criterio Producer                    |
| ------------- | ------------------------- | ------------------------------------ |
| **1er Orden** | Lo mínimo para jugar      | DEBE caber en 1 pantalla de tutorial |
| **2do Orden** | Excepciones y profundidad | Se descubre jugando, NO en tutorial  |

**REGLA:** Si un feature necesita más de 3 reglas de primer orden, es demasiado complejo para mobile casual. Simplificar o dividir.

### Estándares del Género

| Estándar           | Ejemplo                          | Decisión Producer                     |
| ------------------ | -------------------------------- | ------------------------------------- |
| Tap para construir | Universal en mobile builders     | MANTENER — no reinventar              |
| Grid isométrico    | Clash of Clans, Rise of Kingdoms | MANTENER — audiencia lo espera        |
| Builder queue      | 1 gratis + 2do con gems          | EVALUAR — ¿encaja con nuestro modelo? |
| Shield post-attack | Estándar en PvP builders         | ADOPTAR cuando lancemos PvP           |

**REGLA:** Innovar en mecánicas core = valor diferencial. Innovar en controles/UI estándar = barrera de entrada gratuita. El Producer debe distinguir.

## Condiciones de Victoria (Ortogames)

Para cada modo, definir ANTES de diseñar:

| Pregunta                                | Respuesta Necesaria                                    |
| --------------------------------------- | ------------------------------------------------------ |
| ¿Hay ganador/perdedor? (Ortogame)       | Sí → Definir condición explícita                       |
| ¿Los jugadores definen su propio éxito? | Sí → Definir métricas de progreso personales           |
| ¿Es ambiguo quién va ganando?           | 🔴 Problema → El jugador no puede construir estrategia |

**REGLA:** Si no puedes explicar la condición de victoria en una frase, el modo no está diseñado todavía.

## Decisión Framework Extendido

Añadir al Decision Framework existente del Producer:

| Criterio Nuevo        | Weight | Pregunta                                                           |
| --------------------- | ------ | ------------------------------------------------------------------ |
| Escala adecuada       | 15%    | ¿El sweet spot de jugadores es alcanzable con nuestra base actual? |
| Complejidad de reglas | 10%    | ¿Las reglas de 1er orden son ≤ 3?                                  |
| Kingmaking Risk       | 10%    | ¿Puede un perdedor decidir quién gana? Si sí, ¿hay mitigación?     |
