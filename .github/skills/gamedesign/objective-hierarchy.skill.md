# Skill: Jerarquía de Objetivos — Why / What / How

> Fuente: "Level Design Book" — Sección 3 (Objetivos y Jerarquías)

## Cuándo Usar Este Skill

Cuando el GameDesign Agent diseña un nuevo sistema, mecánica, edificio, o feature completo. ANTES de diseñar tablas de balance, se debe definir la pirámide de objetivos.

## Principio Central

> Sin una jerarquía clara, el equipo desperdicia recursos en iteraciones sin rumbo. El arquitecto debe preguntar: ¿Por qué existe esto? ¿Qué debe sentir el jugador? ¿Cómo lo lograremos?

## Pirámide Why / What / How

Todo diseño DEBE comenzar con esta pirámide, de arriba hacia abajo:

| Nivel                        | Pregunta                     | Definición                         | Ejemplo Valhalla                                                                     |
| ---------------------------- | ---------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| **Why** (Success Definition) | ¿Por qué existe?             | Objetivos de negocio + emocionales | "Aumentar D7 retention 15%" + "El jugador se siente poderoso al ver su aldea crecer" |
| **What** (Structure)         | ¿Qué forma tiene?            | Marco espacial, estructura, modelo | "Base-building con grid isométrico, progresión por tech tree"                        |
| **How** (Gameplay Actions)   | ¿Cómo interactúa el jugador? | Acciones mecánicas concretas       | "Tocar para construir, drag para posicionar, tap para recolectar"                    |

**REGLA:** Nunca diseñar el "How" sin tener claro el "Why". Si no sabes POR QUÉ existe una mecánica, no la diseñes todavía.

## X-Factor (Factor Diferencial)

El X-Factor es lo que hace que un juego trascienda la suma de sus partes. Componentes:

| Componente             | Pregunta                                        | Ejemplo Valhalla                                                          |
| ---------------------- | ----------------------------------------------- | ------------------------------------------------------------------------- |
| Relevancia cultural    | ¿Conecta con algo que el jugador ya conoce/ama? | Mitología nórdica = Vikings, Thor, Ragnarok (alta relevancia pop)         |
| Promesa emocional      | ¿Qué fantasía cumple?                           | "Eres un Jarl fundando una aldea que se convertirá en un imperio vikingo" |
| Sinergia arte + diseño | ¿La estética amplifica la mecánica?             | Estilo Clash-like + tema Norse = accesible pero épico                     |

**REGLA:** Cada propuesta nueva de @producer o @gamedesign DEBE incluir un párrafo de X-Factor antes de las tablas numéricas.

## Aplicación al Pipeline de Valhalla

### Para Nuevos Edificios

```markdown
## 🏗️ Propuesta: [Nombre del Edificio]

### Why (Justificación)

- **Negocio:** [KPI que impacta: retention, monetization, engagement]
- **Emocional:** [Qué fantasía cumple para el jugador]

### What (Estructura)

- **Tipo:** Producción / Defensa / Militar / Decorativo
- **Prerrequisito:** [Qué se necesita para desbloquear]
- **Relación con otros sistemas:** [Qué alimenta y qué consume]

### How (Acciones del Jugador)

- **Construir:** [coste, tiempo, posición]
- **Operar:** [qué hace cuando está activo]
- **Mejorar:** [curva de upgrade]

### X-Factor

[1-2 frases: por qué este edificio hace el juego MÁS interesante]
```

### Para Nuevas Mecánicas

```markdown
## ⚙️ Propuesta: [Nombre de la Mecánica]

### Why

- **Negocio:** [Impacto en KPIs]
- **Emocional:** [Qué siente el jugador]

### What

- **Modelo:** [Cómo funciona conceptualmente]
- **Inspiración:** [Referente de la industria]

### How

- **Inputs del jugador:** [Acciones concretas]
- **Outputs del sistema:** [Resultados medibles]
- **Feedback loop:** [Cómo se cierra el ciclo]

### X-Factor

[Por qué esto no es "otra mecánica más"]
```

## Anti-Patterns

| Anti-Pattern     | Descripción                                    | Consecuencia                              |
| ---------------- | ---------------------------------------------- | ----------------------------------------- |
| How-First Design | Empezar por las acciones sin definir objetivos | Features que no sirven a ningún propósito |
| Why sin What     | Objetivos vagos sin estructura concreta        | "Queremos más engagement" sin plan        |
| What sin How     | Estructura diseñada pero sin acciones jugables | Documentos bonitos, juego vacío           |
| X-Factor ausente | Mecánica funcional pero genérica               | Juego olvidable, sin identidad            |
