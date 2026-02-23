# Skill: GDD como Producto — Documentación Profesional

> Fuente: "Level Up!" — Sección 3 (El Documento de Diseño de Juego)

## Cuándo Usar Este Skill

Cuando el Archivist crea, actualiza, o revisa cualquier documento del GDD.

## Reglas de Documentación

### El GDD es un Contrato, No un Diario

Todo documento en `docs/` DEBE cumplir:

1. **Visualmente atractivo:** Usar tablas, iconos, diagramas. Un documento feo no se lee y no se respeta.
2. **Determinista:** Todo valor es un número. "Bastante daño" → RECHAZADO. "150 DPS" → APROBADO.
3. **Verificable:** Cada dato del GDD debe poder compararse contra `config/*.json`. Si no coinciden, es un `[MISMATCH]`.
4. **Navegable:** Todo documento enlaza a los documentos relacionados. Nunca información huérfana.

### Estructura de Documento (Template Obligatorio)

```markdown
# [Icono] [Título del Sistema]

> Última actualización: [fecha] — Autor: @[agente]

## Resumen

[1-2 frases. Qué es esto y por qué importa al core loop.]

## Datos

[Tablas Markdown con valores numéricos explícitos]

## Relaciones

[Link a → economía, edificios, tropas, etc.]
[Cómo alimenta al core loop]

## Historial de Cambios

| Fecha | Cambio | Autor |
| ----- | ------ | ----- |

---

_Diseñado por @[agente]. Documentado por @archivist._
```

### Niveles de Documentación

| Nivel        | Cuándo                      | Contenido                          |
| ------------ | --------------------------- | ---------------------------------- |
| High Concept | Pitch de nueva idea         | 1-2 páginas, vision + core loop    |
| GDD de 10p   | Presentación a stakeholders | Síntesis ejecutiva del juego       |
| GDD Completo | Producción activa           | Documento maestro, 50-200+ páginas |
| Config JSON  | Implementación              | Datos del GDD traducidos a código  |

### Checklist de Calidad

```
[ ] ¿Tiene resumen ejecutivo de 1-2 frases?
[ ] ¿Todos los valores son números explícitos?
[ ] ¿Las tablas coinciden con los JSON configs?
[ ] ¿Tiene enlaces a documentos relacionados?
[ ] ¿Tiene historial de cambios?
[ ] ¿Es visualmente legible (no un muro de texto)?
```

## Anti-Patterns

| ❌ Rechazar                                         | ✅ Exigir                                         |
| --------------------------------------------------- | ------------------------------------------------- |
| "Los edificios cuestan bastante"                    | "Lumber Mill Lv2: 200 wood, 100 steel, 5m build"  |
| Un documento de 10 páginas sin una sola tabla       | Tablas de balance cada 2-3 párrafos máximo        |
| Información que contradice un config JSON existente | Flag `[MISMATCH]` inmediato + issue de corrección |
| Referencias a documentos que no existen             | Crear el documento vacío con TODO si es necesario |
