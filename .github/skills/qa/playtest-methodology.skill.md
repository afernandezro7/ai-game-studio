# Skill: Playtesting, Iteración y Sesgos Cognitivos

> Fuente: "Level Design: In Pursuit of Better Levels" — Sección 8

## Cuándo Usar Este Skill

Cuando QA evalúa resultados de playtesting, prioriza bugs/issues, o revisa feedback del sandbox.

## Principio Central

> El feedback negativo es el activo más valioso. Un diseñador profesional debe priorizar el reporte de un "salto difícil" sobre cien elogios estéticos.

## Sesgos Cognitivos a Neutralizar

El QA Agent DEBE reconocer y combatir estos sesgos al evaluar feedback:

| Sesgo                 | Descripción                                    | Consecuencia si se ignora                            | Contrarrestar con                                                     |
| --------------------- | ---------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------- |
| **Survivorship Bias** | "Nadie más se quejó de esto"                   | Ignoras un problema real porque pocos lo reportaron  | Tratar CADA reporte mecánico como válido hasta demostrar lo contrario |
| **Confirmation Bias** | "Funciona porque yo lo diseñé así"             | Defiendes un diseño roto                             | Separar QA del diseñador original. Evaluar con datos, no opiniones    |
| **Sunk Cost Fallacy** | "Ya invertimos mucho en esto, no lo cambiemos" | Mantienes una feature rota por el esfuerzo invertido | Si está roto, está roto. El coste pasado es irrelevante               |
| **Polish Bias**       | "Se ve bonito, debe funcionar bien"            | Priorizas visual sobre mecánica                      | El sandbox puede ser feo. Validar FUNCIONALIDAD antes de visual       |
| **Recency Bias**      | "El último feedback es el más importante"      | Olvidas problemas previos no resueltos               | Mantener backlog ordenado por severidad, no por fecha                 |

## Priorización de Feedback

| Prioridad    | Tipo de Feedback          | Ejemplo                                  | Acción                                     |
| ------------ | ------------------------- | ---------------------------------------- | ------------------------------------------ |
| P0 — Blocker | Mecánica rota o soft-lock | "No puedo construir nada después de Lv3" | Parar todo. Arreglar inmediatamente        |
| P1 — Major   | Experiencia degradada     | "El upgrade de 8h se siente excesivo"    | Arreglar antes del próximo release         |
| P2 — Minor   | Inconveniencia            | "El botón está un poco pequeño"          | Backlog para la siguiente iteración        |
| P3 — Polish  | Estético                  | "Los árboles podrían ser más bonitos"    | No bloquea. Arreglar cuando haya bandwidth |

**REGLA:** Feedback mecánico (P0-P1) SIEMPRE prevalece sobre feedback estético (P2-P3). Nunca pulir visualmente un sistema que no es funcional.

## Metodología de Evaluación

### Datos sobre Opiniones

| Medir                      | Cómo                                     | Umbral                              |
| -------------------------- | ---------------------------------------- | ----------------------------------- |
| Tiempo en completar acción | Timer desde tap hasta resultado          | Si > expectativa × 1.5 = problem    |
| Tasa de abandono por zona  | % jugadores que dejan en punto X         | Si > 20% drop en un punto = problem |
| Toques erráticos           | Jugador toca repetidamente sin resultado | Si > 3 taps en 2s = UI confusa      |
| Tiempo entre sesiones      | Intervalo de retorno                     | Si > 48h promedio = daily loop roto |

### Template de Reporte de Playtest

```markdown
## 🧪 Playtest Report: [Fecha/Versión]

### Perfiles Probados

| Perfil | Cantidad | Dispositivo |
| ------ | -------- | ----------- |

### Métricas Recogidas

| Métrica | Valor | Umbral | Status |
| ------- | ----- | ------ | ------ |

### Issues Encontrados (por prioridad)

| P   | Descripción | Reproducción | Propuesta de Fix |
| --- | ----------- | ------------ | ---------------- |

### Sesgos Detectados

- [ ] ¿Algún issue fue descartado por "nadie más se quejó"? → Revisar
- [ ] ¿Se priorizó polish sobre funcionalidad? → Reordenar
- [ ] ¿Se defendió un diseño por el esfuerzo invertido? → Evaluar datos

### Conclusión

- Features que PASAN: [lista]
- Features que NECESITAN iteración: [lista + razón]
- Blockers: [lista]
```

## Checkpoints de Documentación para QA

Antes de aprobar cualquier versión, verificar que la documentación responde a:

| Pregunta                                    | Verificar en                     | Criterio                             |
| ------------------------------------------- | -------------------------------- | ------------------------------------ |
| ¿Dónde están los checkpoints de progresión? | BuildingsConfig.json → `unlocks` | Existen y son alcanzables            |
| ¿Hay remoción de control del jugador?       | Tutorial config                  | Solo en tutorial, nunca mid-gameplay |
| ¿Los assets son modulares?                  | Config → building sizes          | Siguen las métricas estándar         |
| ¿Las métricas de IA/NPC están validadas?    | Config → interaction radius      | Radios coherentes con grid           |
