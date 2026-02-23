# Skill: Validación del Vínculo de Confianza (Trust Relationship)

> Fuente: "Level Design Book" — Sección 2.4 (Trust Relationship) + Sección 4 (Pacing)

## Cuándo Usar Este Skill

Cuando QA valida una mecánica nueva, un cambio de balance, un flujo de tutorial, o cualquier modificación que afecte la experiencia del jugador.

## Principio Central

> Traicionar la confianza del jugador mediante el uso de habilidades no enseñadas es un **pecado capital** del diseño. Transforma el desafío en frustración injusta y arruina retención.

## Checklist de Confianza (6 puntos)

Ejecutar ANTES de aprobar cualquier mecánica o cambio:

### 1. Enseñanza Previa ✅

```
¿La mecánica fue enseñada al jugador antes de ser evaluada?
→ Verificar: ¿Existe un skill gate o tutorial para esta mecánica?
→ Verificar: ¿El tutorial ocurre ANTES del primer uso obligatorio?
→ FAIL si: El jugador necesita una habilidad que nunca se introdujo
```

### 2. Dificultad Gradual 📈

```
¿La dificultad escala de forma predecible?
→ Verificar: Curva de costes en BuildingsConfig.json (exponente razonable)
→ Verificar: No hay spikes repentinos entre niveles consecutivos
→ FAIL si: Lv3→Lv4 es 10x más difícil que Lv2→Lv3 sin justificación
```

### 3. Feedback de Fallo 💬

```
¿El jugador puede entender POR QUÉ falló?
→ Verificar: Mensajes de error claros ("Necesitas 500 Wood" no "Recursos insuficientes")
→ Verificar: UI muestra qué falta y cómo obtenerlo
→ FAIL si: El jugador no sabe qué le impide progresar
```

### 4. Feedback Inmediato ⚡

```
¿Toda acción tiene respuesta visible en < 200ms?
→ Verificar: Tocar construir → animación inmediata
→ Verificar: Recolectar → números suben visiblemente
→ FAIL si: Acción del jugador sin respuesta perceptible
```

### 5. Reglas Consistentes 📏

```
¿Las reglas del juego son estables y predecibles?
→ Verificar: No hay cambios ocultos en producción/costes
→ Verificar: Si algo cambia, el jugador es notificado
→ FAIL si: Un sistema cambia de comportamiento sin explicación
```

### 6. Bottleneck Justo 🚪

```
¿Los cuellos de botella se sienten como logros, no como castigos?
→ Verificar: Great Hall upgrade desbloquea contenido NUEVO y visible
→ Verificar: El tiempo de espera es razonable para el tier (ver Time Wall Check)
→ Verificar: El jugador puede ver un preview de lo que viene
→ FAIL si: Bottleneck es solo "esperar más" sin recompensa clara
```

## Matriz de Severidad

| Violación                   | Severidad      | Acción                                 |
| --------------------------- | -------------- | -------------------------------------- |
| Mecánica no enseñada        | 🔴 **BLOCKER** | No release hasta que se añada tutorial |
| Spike de dificultad injusto | 🔴 **BLOCKER** | Re-balancear curva                     |
| Feedback ausente            | 🟡 **MAJOR**   | Añadir antes de release                |
| Mensaje de error vago       | 🟡 **MAJOR**   | Mejorar copy                           |
| Regla cambiante sin aviso   | 🔴 **BLOCKER** | Añadir notificación o revertir         |
| Bottleneck sin recompensa   | 🟡 **MAJOR**   | Diseñar unlock reward                  |

## Escenarios de Prueba Obligatorios

Para cada mecánica nueva, simular estos perfiles:

| Perfil                  | Comportamiento                        | Qué Validar                             |
| ----------------------- | ------------------------------------- | --------------------------------------- |
| **Novato total**        | Primera vez jugando un city builder   | ¿Los tutoriales le guían sin confusión? |
| **Veterano impaciente** | Sabe jugar, quiere skipear tutoriales | ¿Puede saltarse sin perderse mecánicas? |
| **F2P puro**            | 0 gasto real, solo grinding           | ¿Puede progresar sin dead-ends?         |
| **Whale**               | Gasta mucho                           | ¿Obtiene valor pero no ventaja injusta? |
| **Jugador ausente**     | Vuelve después de 7 días offline      | ¿Entiende qué pasó mientras tanto?      |

## Output Esperado

```markdown
## 🤝 Trust Validation: [Mecánica/Feature]

### Checklist

| #   | Check               | Resultado | Notas |
| --- | ------------------- | --------- | ----- |
| 1   | Enseñanza previa    | ✅/❌     |       |
| 2   | Dificultad gradual  | ✅/❌     |       |
| 3   | Feedback de fallo   | ✅/❌     |       |
| 4   | Feedback inmediato  | ✅/❌     |       |
| 5   | Reglas consistentes | ✅/❌     |       |
| 6   | Bottleneck justo    | ✅/❌     |       |

### Perfiles Simulados

| Perfil | Resultado | Issues |
| ------ | --------- | ------ |

### Veredicto: [PASS / FAIL — lista de blockers]
```
