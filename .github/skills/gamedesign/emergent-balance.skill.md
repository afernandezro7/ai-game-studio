# Skill: Sistemas Emergentes y Balance Dinámico

> Fuente: "Characteristics of Games" (Elias, Garfield, Gutschera) — Capítulos 4 y 5

## Cuándo Usar Este Skill

Cuando el GameDesign Agent diseña sistemas de combate, PvP, progresión competitiva, economía entre jugadores, o cualquier mecánica donde las interacciones generen resultados no previstos por las reglas básicas.

## Principio Central

> Un juego no es un conjunto de reglas estáticas, sino un ecosistema dinámico. Las propiedades emergentes surgen de la fricción de las reglas en juego — y son estas propiedades las que determinan si el juego es interesante o colapsado.

## Snowball vs Catch-up

Las dos fuerzas fundamentales del balance dinámico:

| Fuerza                       | Definición                                                | Ejemplo Valhalla                                                         | Efecto en Experiencia                                             |
| ---------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **Snowball** (Bola de nieve) | Ventaja temprana genera más ventaja → victoria inevitable | Jugador que farmea 24h tiene aldea invencible, aplasta a todos en PvP    | El juego "termina emocionalmente" mucho antes que matemáticamente |
| **Catch-up** (Recuperación)  | Mecánica que ayuda al rezagado a competir                 | Escudo post-ataque, bonus de producción para niveles bajos, season reset | Las decisiones iniciales del jugador hábil se sienten invalidadas |

### Balance Ideal

```
Snowball ←——— TENSIÓN DRAMÁTICA ———→ Catch-up
                    ↑
              SWEET SPOT
        (ambas fuerzas en tensión)
```

**REGLA:** Todo sistema competitivo DEBE tener AMBAS fuerzas. Documentar explícitamente:

| Sistema     | Mecanismo Snowball                             | Mecanismo Catch-up                            | Ratio Objetivo           |
| ----------- | ---------------------------------------------- | --------------------------------------------- | ------------------------ |
| PvP Raiding | Loot del perdedor fortalece al ganador         | Escudo 8h post-raid, matchmaking por poder    | 60% skill / 40% catch-up |
| Economy     | Más edificios = más producción = más edificios | Rendimientos decrecientes a niveles altos     | Curva logarítmica        |
| Clanes      | Clan grande atrae más miembros                 | Bonuses para clanes pequeños, slots limitados | Top-heavy con floor      |

## Colapso Estratégico

El árbol de decisiones del jugador puede "marchitarse" por desequilibrio:

| Tipo de Colapso      | Señal                              | Ejemplo                                                      | Acción                           |
| -------------------- | ---------------------------------- | ------------------------------------------------------------ | -------------------------------- |
| **Muy Débil**        | Opción que nadie elige             | Un edificio cuyo coste/beneficio es peor que TODOS los demás | Buff o eliminar                  |
| **Muy Fuerte**       | Opción dominante pero no exclusiva | Un edificio claramente mejor pero que no anula a los otros   | Nerf sutil o buff a alternativas |
| **Overpowered (OP)** | Una opción anula TODA otra ruta    | Una estrategia que siempre gana sin counter                  | 🔴 BLOCKER — fix inmediato       |

### Detección de OP en Configs

Para cada building/troop/strategy, calcular el **Power Score**:

```
Power_Score = (output_per_hour / cost) * (1 / build_time_hours)
```

| Resultado                                         | Diagnóstico       | Acción           |
| ------------------------------------------------- | ----------------- | ---------------- |
| Power Score de X es > 2× el promedio de su tier   | Potencialmente OP | Revisar con @qa  |
| Power Score de X es < 0.5× el promedio de su tier | Muy débil         | Buff o rediseñar |
| Todos los Power Scores están entre 0.7× y 1.3×    | Balance saludable | ✅ Aprobar       |

## Subjuegos: Detectar y Diseñar

| Tipo               | Definición                              | Ejemplo Valhalla                                             |
| ------------------ | --------------------------------------- | ------------------------------------------------------------ |
| **Explícito**      | Mini-juego claramente delimitado        | Evento temporal "Raid del Gigante de Hielo"                  |
| **Implícito**      | Dinámica emergente no escrita en reglas | Jugadores haciendo "trade wars" subiendo precios de recursos |
| **Juego Esencial** | Núcleo competitivo puro, sin ornamentos | "City building + resource management" = core de Valhalla     |

**REGLA:** Si un subjuego implícito emerge y es divertido, documentarlo y formalizarlo. Si es tóxico (exploits), cerrarlo con reglas explícitas.

## Indeterminación y Azar

| Elemento               | Azar Necesario    | Azar Actual                  | Ajuste                        |
| ---------------------- | ----------------- | ---------------------------- | ----------------------------- |
| Producción de recursos | Bajo — predecible | Determinístico (100 wood/hr) | ✅ Correcto para city builder |
| Combate PvP            | Medio — tensión   | TBD                          | Añadir varianza ±15% al daño  |
| Loot de raids          | Alto — emoción    | TBD                          | Tabla de drops con raridades  |
| Eventos temporales     | Medio — sorpresa  | TBD                          | Rotación semi-aleatoria       |

**REGLA:** La indeterminación gestionada eleva la rejugabilidad. El azar puro sin gestión (pure RNG wins) arruina la competición. Siempre permitir que la habilidad mitigue el azar.

## Output Esperado

```markdown
## 🔄 Emergent System Design: [Sistema]

### Balance Snowball/Catch-up

| Mecanismo Snowball | Mecanismo Catch-up | Ratio |
| ------------------ | ------------------ | ----- |

### Power Score Audit

| Opción | Power Score | vs Promedio | Status |
| ------ | ----------- | ----------- | ------ |

### Subjuegos Identificados

| Tipo | Descripción | Acción |
| ---- | ----------- | ------ |

### Cuota de Azar

| Elemento | % Azar | Justificación |
| -------- | ------ | ------------- |
```
