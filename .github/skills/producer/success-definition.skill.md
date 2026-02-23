# Skill: Definición de Éxito y X-Factor

> Fuente: "Level Design Book" — Sección 3.2 (The X-Factor) + Sección 3.3 (Hierarchy of Development)

## Cuándo Usar Este Skill

Cuando el Producer evalúa un pitch, define la visión de un nuevo sistema, o necesita decidir si un feature merece recursos.

## Principio Central

> Definir el éxito ANTES de la producción es vital. Sin una jerarquía clara, el equipo desperdicia recursos en iteraciones sin rumbo.

## X-Factor Assessment

Antes de aprobar cualquier feature o sistema, el Producer debe evaluar su X-Factor:

| Componente           | Pregunta Clave                                             | Score (1-5) |
| -------------------- | ---------------------------------------------------------- | ----------- |
| Relevancia cultural  | ¿Conecta con algo que la audiencia target ya conoce y ama? |             |
| Promesa emocional    | ¿Cumple una fantasía clara y deseable?                     |             |
| Sinergia arte+diseño | ¿La estética amplifica la mecánica (no solo la decora)?    |             |
| Cohesión             | ¿Encaja con el X-Factor del juego completo?                |             |

**Score mínimo:** 12/20 para aprobar. Si < 12, el feature necesita rediseño o se descarta.

### X-Factor de Valhalla (referencia)

- **Relevancia cultural:** Mitología nórdica (Vikings, Thor, Ragnarok) → alta resonancia pop
- **Promesa emocional:** "De una choza a un imperio vikingo" → power fantasy clara
- **Sinergia:** Arte Clash-like + tema Norse → accesible pero épico
- **Cohesión target:** Todo feature debe sentirse "vikingo" y "estratégico"

## Success Definition Template

Cada propuesta que llega al Producer DEBE incluir (o él debe exigir):

```markdown
## 🎯 Success Definition: [Feature]

### Why — Objetivos

- **Negocio (externo):** [KPI concreto: D1/D7/D30 retention, ARPDAU, conversion]
- **Experiencia (interno):** [Qué siente el jugador — en una frase]

### What — Estructura

- **Modelo:** [Descripción del sistema a alto nivel]
- **Scope:** [Tamaño: S/M/L/XL en esfuerzo de agentes]

### How — Validación

- **Métricas de éxito:** [Números concretos que definirán si funcionó]
- **Timeline:** [Cuándo se puede medir el impacto]

### X-Factor Score

| Relevancia | Promesa | Sinergia | Cohesión | **Total** |
| ---------- | ------- | -------- | -------- | --------- |
| /5         | /5      | /5       | /5       | **/20**   |

### Decisión: [GO / REDESIGN / KILL]
```

## Caso GTA Vice City (Lección)

> Si analizamos Vice City por partes: controles frustrantes, combate tosco, geometría pobre. Pero su X-Factor (atmósfera 80s + música + narrativa) anula las deficiencias.

**Lección para el Producer:** Un juego con X-Factor fuerte puede sobrevivir a debilidades técnicas. Un juego sin X-Factor muere aunque sea técnicamente perfecto.

## Anti-Patterns del Producer

| Anti-Pattern     | Por Qué Es Peligroso                             | Señal de Alerta                                 |
| ---------------- | ------------------------------------------------ | ----------------------------------------------- |
| Feature sin Why  | Recursos gastados en algo sin propósito medible  | "Estaría cool si..." sin datos                  |
| KPI sin emoción  | Feature que cumple métricas pero no divierte     | Retention sube pero reviews bajan               |
| X-Factor diluido | Aprobar features que no encajan con la identidad | "Añadamos un battle royale porque está de moda" |
| Scope creep      | No definir límites claros de What                | Feature que crece infinitamente sin entregar    |
