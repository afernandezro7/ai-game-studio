# Skill: Release Readiness desde Level Up!

> Fuente: "Level Up!" — Sección 8 (Plantillas Operativas) + Sección 7 (Pulido Final)

## Cuándo Usar Este Skill

Cuando el Release Agent evalúa si una versión está lista para publicación.

## Checklist Pre-Release (Derivado de Level Up!)

### 1. Validación de las Tres Cs

Antes de release, verificar que Character, Camera y Controls están completos:

| Criterio                                       | PASS/FAIL |
| ---------------------------------------------- | --------- |
| Character tiene stats definidos en JSON config |           |
| Camera tiene tipo y comportamiento definido    |           |
| Controls mapeados a plataforma target          |           |
| No hay input lag perceptible (>100ms = FAIL)   |           |

### 2. Validación de Game Feel

| Criterio                                              | PASS/FAIL |
| ----------------------------------------------------- | --------- |
| Toda acción del jugador tiene feedback visual + audio |           |
| Las transiciones son suaves (no hay cortes abruptos)  |           |
| Los momentos reward tienen animación especial         |           |

### 3. Validación de Economía

| Criterio                                                 | PASS/FAIL |
| -------------------------------------------------------- | --------- |
| Micro-loop (30s-2min) definido y funcional               |           |
| Session-loop (5-15min) tiene cierre satisfactorio        |           |
| Daily-loop incentiva retorno (no castiga ausencia)       |           |
| No hay dead-ends económicos (siempre hay algo que hacer) |           |

### 4. Validación de Contenido

| Criterio                                                   | PASS/FAIL |
| ---------------------------------------------------------- | --------- |
| GDD actualizado refleja build actual                       |           |
| Todas las strings están en config (no hardcoded)           |           |
| Todos los edificios tienen 3+ levels con progresión visual |           |
| Tutorial enseña sin interrumpir (teaching by playing)      |           |

### 5. Red Flags (bloquean release)

Si alguno de estos existe, el release se BLOQUEA:

- 🔴 Mecánica sin feedback sensorial (acción silenciosa)
- 🔴 Recurso que no se puede gastar (acumulación infinita)
- 🔴 Edificio sin progresión visual entre niveles
- 🔴 Loop económico roto (el jugador se queda sin nada que hacer)
- 🔴 Pay-to-win: ventaja mecánica solo accesible con dinero real

## Output del Release Agent

```markdown
## 🚀 Release Assessment v[X.Y.Z]

### Three Cs: [✅/❌]

### Game Feel: [✅/❌]

### Economy: [✅/❌]

### Content: [✅/❌]

### Red Flags: [0 encontrados / N bloqueantes]

### Decisión: [GO / NO-GO]

### Razón: [explicación breve]
```
