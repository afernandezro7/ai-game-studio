# Skill: Game Feel Checklist

> Fuente: "Level Up!" — Secciones 4, 5 y 7 (Tres Cs, Arquitectura de Mundo, Pulido Final)

## Cuándo Usar Este Skill

Cuando QA valida una nueva mecánica, un nuevo edificio, o un cambio en la interacción del jugador.

## Game Feel Validation (Adicional al 5-Point Checklist)

Este checklist se ejecuta DESPUÉS del 5-Point Validation estándar del QA agent.

### 1. Feedback Sensorial Check 🎯

```
¿Cada acción del jugador tiene feedback por al menos 2 canales?

Para cada acción nueva, verificar:
→ Canal Visual: ¿Hay animación/partícula/color change? [Sí/No]
→ Canal Sonoro: ¿Hay sound effect? [Sí/No]
→ Canal Háptico: ¿Hay vibración (si aplica)? [Sí/No]

MÍNIMO 2 de 3. Si solo tiene 1 canal → ⚠️ WARNING: "Feedback débil"
Si tiene 0 canales → ❌ BLOCKED: "Acción sin feedback"
```

### 2. Tres Cs Harmony Check 🎮

```
¿El cambio rompe la armonía Personaje-Cámara-Controles?

→ ¿El personaje se mueve a velocidad coherente con el zoom de cámara?
→ ¿Los controles responden sin lag perceptible? (< 100ms para mobile)
→ ¿La cámara muestra toda la información necesaria para tomar decisiones?

Si alguna C está rota → ❌ BLOCKED
```

### 3. Implicit Teaching Check 📚

```
¿La nueva mecánica se puede entender sin leer un tutorial?

→ ¿Existe un "momento seguro" donde el jugador puede experimentar sin castigo?
→ ¿Los elementos visuales (color, forma, animación) sugieren la función?
→ ¿Se requiere texto explicativo de más de 1 línea? → ⚠️ WARNING

Si el jugador necesita leer un párrafo para entender → ❌ BLOCKED
```

### 4. Pacing Check ⏱️

```
¿El cambio altera el ritmo tensión/liberación del juego?

→ ¿Hay una secuencia de 3+ acciones de alta intensidad sin pausa? → ⚠️ Fatiga
→ ¿Hay una secuencia de 5+ minutos sin ningún feedback de progreso? → ⚠️ Aburrimiento
→ ¿El jugador recibe una micro-recompensa cada 2-3 minutos? → Verificar
```

### 5. Audio Budget Check 🔊

```
¿El elemento tiene sonido asignado?

→ Acción de construcción: [sound_id o "PENDIENTE"]
→ Acción de recolección: [sound_id o "PENDIENTE"]
→ Notificación/Alerta: [sound_id o "PENDIENTE"]

Si la acción es relevante y no tiene sonido → ⚠️ WARNING: "Audio pendiente"
(No bloquea, pero debe trackearse como deuda técnica)
```

## Output Format

```markdown
## 🎮 Game Feel Report: [Qué se validó]

**Verdict:** ✅ FEELS GOOD / ⚠️ NEEDS POLISH / ❌ BROKEN FEEL

### Checks Performed

- [x] Feedback Sensorial — [Visual ✅ / Audio ✅ / Haptic ❌]
- [x] Tres Cs Harmony — [resultado]
- [x] Implicit Teaching — [resultado]
- [x] Pacing — [resultado]
- [x] Audio Budget — [resultado]

### Polish Debt

| Elemento | Canal Faltante | Prioridad |
| -------- | -------------- | --------- |

### Next Step

@[agent] should [action]
```
