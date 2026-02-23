# Skill: Validación de Elegancia y Desafío No-Trivial

> Fuente: "Fundamentals of Game Design" (Ernest Adams) — Capítulos 1-2

## Cuándo Usar Este Skill

Cuando QA valida una mecánica nueva o audita una versión pre-release, verificando que cada elemento del juego cumple con los estándares de diseño centrado en el jugador.

## Principio Central

> Cada acción del jugador debe estar vinculada a un desafío no-trivial. Las "features gratuitas" diluyen la elegancia. El jugador NO es el oponente del diseñador.

## Checklist de Elegancia (3 puntos)

### 1. Feature Gratuita Check 🎁

```
¿Cada feature/mecánica tiene un desafío vinculado?
→ Listar todas las acciones disponibles para el jugador
→ Cada una DEBE clasificarse en: Económico, Lógica, Conflicto, Exploración, Coordinación
→ FAIL si: Una acción no tiene categoría de desafío = feature gratuita
→ Severidad: 🟡 MAJOR — eliminar o vincular a desafío
```

### 2. Deber de Entretener Check 🎭

```
¿El feature divierte al JUGADOR (no al diseñador)?
→ Preguntar: ¿Cuál es el "momento divertido" concreto de esta mecánica?
→ Si no se puede articular en 1 frase → el feature no tiene claridad de propósito
→ FAIL si: La justificación es "es interesante técnicamente" o "a mí me gusta"
→ Severidad: 🟡 MAJOR — redesignar con foco en jugador
```

### 3. Elegancia Check (Economía + Presentación) 💎

```
¿Las mecánicas subyacentes y la presentación están alineadas?
→ Verificar: ¿La UI comunica correctamente el estado de la economía?
→ Verificar: ¿Los números en config producen el "feel" que la presentación promete?
→ FAIL si: La UI dice una cosa y la mecánica hace otra
→ Severidad: 🔴 BLOCKER — desalineamiento economía/presentación confunde al jugador
```

## Mapeo de Desafíos por Sistema

Template para auditar que TODO el juego tiene desafíos vinculados:

| Sistema      | Acción del Jugador            | Categoría Desafío  | ¿No-Trivial?         | Status |
| ------------ | ----------------------------- | ------------------ | -------------------- | ------ |
| Construcción | Elegir qué edificio construir | Económico + Lógica | ✅ Trade-off         | PASS   |
| Recolección  | Tap para recolectar           | Coordinación       | ❌ Trivial           | REVIEW |
| Upgrades     | Decidir qué mejorar primero   | Económico + Lógica | ✅ Trade-off         | PASS   |
| Defensa      | Posicionar torres (futuro)    | Conflicto + Lógica | ✅ Decisión espacial | PASS   |

**REGLA:** Si > 30% de las acciones son triviales, el juego tiene un problema de profundidad.

## Validación del Círculo Mágico

| Check                                               | Criterio                                                           | PASS/FAIL |
| --------------------------------------------------- | ------------------------------------------------------------------ | --------- |
| ¿Las notificaciones respetan el tiempo del jugador? | No más de 3 push/día. No FOMO agresivo                             |           |
| ¿La sesión tiene cierre natural?                    | El jugador puede parar sin sentir castigo                          |           |
| ¿Las mecánicas de retención son justas?             | Incentivos positivos (daily reward), no castigos (perder progreso) |           |
| ¿El IAP es cosmético/acelerador, NO pay-to-win?     | Verificar: ¿Se puede progresar sin gastar?                         |           |

## Escenarios de Empatía

Simular estos perfiles para verificar los Deberes del Diseñador:

| Perfil                | Pregunta de Empatía                   | Qué Validar                          |
| --------------------- | ------------------------------------- | ------------------------------------ |
| Niño 12 años          | ¿Entiende las mecánicas sin leer?     | Tutorial covert funcional            |
| Adulto 45 años casual | ¿Puede jugar 5 min y sentir progreso? | Session loop satisfactorio           |
| Hardcore gamer        | ¿Hay profundidad para 6 meses?        | Endgame y meta-strategy              |
| Jugador impaciente    | ¿Puede skipear y avanzar?             | No hay muros de tutorial obligatorio |

## Output Esperado

```markdown
## 💎 Elegance Validation: [Feature/Versión]

### Feature Gratuita Check

| Acción | Categoría Desafío | ¿No-Trivial? | Status |
| ------ | ----------------- | ------------ | ------ |

- Triviales detectadas: [N] de [Total] ([%])

### Deber de Entretener

| Feature | Momento Divertido (1 frase) | Status |
| ------- | --------------------------- | ------ |

### Elegancia (Economía ↔ Presentación)

| Sistema | Alineado? | Desalineamiento |
| ------- | --------- | --------------- |

### Círculo Mágico: [4/4 PASS / N FAIL]

### Veredicto: [ELEGANT / NEEDS WORK / BROKEN]
```
