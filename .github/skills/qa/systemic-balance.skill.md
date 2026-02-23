# Skill: Validación de Balance Sistémico y Colapso Estratégico

> Fuente: "Characteristics of Games" (Elias, Garfield, Gutschera) — Capítulos 4 y 5

## Cuándo Usar Este Skill

Cuando QA valida el balance de un sistema nuevo (edificio, tropa, mecánica PvP) o audita el estado general de la economía.

## Principio Central

> El balance ideal mantiene la tensión entre snowball y catch-up. Un exceso de snowball termina el juego emocionalmente antes que matemáticamente. Un exceso de catch-up invalida las decisiones del jugador hábil.

## Checklist de Balance Sistémico (4 puntos)

### 1. Detección de Snowball 🏔️

```
¿Una ventaja temprana genera ventaja acumulativa inevitable?
→ Simular: Jugador A tiene 20% más recursos en Day 1.
   ¿En Day 7 la brecha es > 50%? → SNOWBALL detectado
→ Verificar: ¿Hay rendimientos decrecientes en niveles altos?
→ FAIL si: La brecha CRECE exponencialmente sin ceiling
```

### 2. Detección de Catch-up Excesivo 🪃

```
¿Un jugador que juega bien puede ser alcanzado por uno que juega peor?
→ Simular: Jugador A óptimo vs Jugador B casual. Day 7.
   ¿La diferencia es < 10%? → CATCH-UP excesivo
→ Verificar: ¿Los bonuses de catch-up tienen límite temporal?
→ FAIL si: No importa cuándo empiezas, todos llegan igual
```

### 3. Power Score Audit ⚖️

Para cada opción del mismo tier, calcular:

```
Power_Score = (output_per_hour / cost) * (1 / build_time_hours)
```

| Resultado                          | Diagnóstico          | Severidad                  |
| ---------------------------------- | -------------------- | -------------------------- |
| Power Score > 2× promedio del tier | **Overpowered (OP)** | 🔴 BLOCKER                 |
| Power Score > 1.5× promedio        | **Muy Fuerte**       | 🟡 MAJOR — watchlist       |
| Power Score 0.7×–1.3× promedio     | **Balanceado**       | ✅ PASS                    |
| Power Score < 0.5× promedio        | **Muy Débil**        | 🟡 MAJOR — buff o eliminar |

### 4. Eliminación Lógica Check 🧟

```
¿Puede un jugador quedar en estado de "muerto viviente"?
→ Verificar: Tras perder un raid, ¿puede reconstruir?
→ Verificar: ¿Hay producción pasiva mínima SIEMPRE activa?
→ Verificar: ¿El escudo post-ataque da tiempo suficiente para reconstruir?
→ FAIL si: Un jugador atacado repetidamente no tiene ruta de recuperación
```

## Validación de Indeterminación

| Check                                  | Criterio                                                  | PASS/FAIL |
| -------------------------------------- | --------------------------------------------------------- | --------- |
| ¿La producción base es determinística? | Sí — city builder core no debería tener RNG en producción |           |
| ¿El combate tiene varianza controlada? | Sí — ±10-20% es tensión, ±50% es frustración              |           |
| ¿El loot tiene tabla publicada?        | Las probabilidades deben ser transparentes (o deducibles) |           |
| ¿La habilidad puede mitigar el azar?   | Siempre — puro RNG = no es un juego                       |           |

## Validación de Heurísticas

Para cada sistema, verificar que el jugador tiene heurísticas funcionales:

| Heurística        | Tipo        | Claridad | Riqueza | Satisfacción | Poder | Veredicto |
| ----------------- | ----------- | -------- | ------- | ------------ | ----- | --------- |
| Barra de recursos | Posicional  | ✅/❌    | ✅/❌   | ✅/❌        | ✅/❌ |           |
| Misión sugerida   | Direccional | ✅/❌    | ✅/❌   | ✅/❌        | ✅/❌ |           |
| Ranking PvP       | Posicional  | ✅/❌    | ✅/❌   | ✅/❌        | ✅/❌ |           |

**REGLA:** Si una heurística falla en Claridad o Poder, es un bug de UX. Si falla en Riqueza o Satisfacción, es un issue de diseño.

## Escenario de Simulación: Kingmaking

> Kingmaking: jugador sin opciones de ganar decide quién gana entre los demás.

Para sistemas multijugador, simular:

- ¿Un jugador eliminado puede atacar a un contendiente específico para hacerle perder?
- ¿Las acciones del último lugar afectan desproporcionadamente al primero?
- Si sí → diseñar restricciones post-eliminación (cooldowns, targets aleatorios)

## Output Esperado

```markdown
## ⚖️ Systemic Balance Audit: [Sistema/Versión]

### Snowball/Catch-up

| Fuerza | Detectado? | Severidad | Fix Propuesto |
| ------ | ---------- | --------- | ------------- |

### Power Score por Tier

| Tier | Opción | Power Score | vs Promedio | Status |
| ---- | ------ | ----------- | ----------- | ------ |

### Eliminación Lógica: [PASS/FAIL]

### Heurísticas: [X/Y pasan las 4 validaciones]

### Kingmaking Risk: [Bajo/Medio/Alto]

### Veredicto: [BALANCED / NEEDS TUNING / BLOCKER]
```
