# 🛡️ Sistema de Alianzas — Midgard Online

> Sistema social completo: creación, roles, diplomacia, mecánicas de alianza y rankings.
> Referencia: [map.md](map.md) | [combat.md](combat.md) | [troops.md](troops.md) | [vision.md](vision.md)

---

## 🏛️ Resumen del Sistema

Las alianzas son el núcleo social del juego. Un jugador puede pertenecer a **UNA sola alianza** a la vez. Las alianzas coordinan defensa, ataques conjuntos y diplomacia entre grupos.

| Parámetro                   | Valor                        |
| --------------------------- | ---------------------------- |
| **Máximo de miembros**      | 60                           |
| **Mínimo para crear**       | 1 jugador (el fundador)      |
| **Coste de creación**       | Gratis                       |
| **Máximo alianzas/jugador** | 1 (exclusiva)                |
| **Nombre máximo**           | 30 caracteres                |
| **Tag**                     | 2-4 caracteres (ej: `[VKG]`) |
| **Descripción**             | 500 caracteres               |

---

## 👥 Roles y Permisos

### Jerarquía de Roles (4 niveles)

| Rol                   | Máximo | Prioridad | Descripción                                     |
| --------------------- | ------ | --------- | ----------------------------------------------- |
| **Jarl (Líder)**      | 1      | 1 (max)   | Fundador o sucesor. Control total.              |
| **Thane (Consejero)** | 3      | 2         | Mano derecha del Jarl. Casi todos los permisos. |
| **Hirdman (Oficial)** | 10     | 3         | Oficiales de confianza. Gestión de miembros.    |
| **Karl (Miembro)**    | 46     | 4 (base)  | Miembro estándar. Permisos básicos.             |

### Tabla de Permisos

| Permiso                   | Jarl | Thane | Hirdman | Karl |
| ------------------------- | ---- | ----- | ------- | ---- |
| Invitar miembros          | ✅   | ✅    | ✅      | ❌   |
| Expulsar Karls            | ✅   | ✅    | ✅      | ❌   |
| Expulsar Hirdmen          | ✅   | ✅    | ❌      | ❌   |
| Expulsar Thanes           | ✅   | ❌    | ❌      | ❌   |
| Promover a Karl/Hirdman   | ✅   | ✅    | ❌      | ❌   |
| Promover a Thane          | ✅   | ❌    | ❌      | ❌   |
| Degradar miembros         | ✅   | ✅    | ❌      | ❌   |
| Cambiar diplomacia        | ✅   | ✅    | ❌      | ❌   |
| Editar descripción        | ✅   | ✅    | ❌      | ❌   |
| Enviar mensaje de alianza | ✅   | ✅    | ✅      | ❌   |
| Chat de alianza           | ✅   | ✅    | ✅      | ✅   |
| Ver tropas de aliados     | ✅   | ✅    | ✅      | ✅   |
| Disolver alianza          | ✅   | ❌    | ❌      | ❌   |
| Transferir liderazgo      | ✅   | ❌    | ❌      | ❌   |

### Sucesión del Jarl

```
Si el Jarl está inactivo (sin login) durante 14 días:
  1. El Thane más antiguo se convierte en Jarl automáticamente
  2. Si no hay Thanes → el Hirdman más antiguo
  3. Si no hay Hirdmen → el Karl con más población

Si el Jarl abandona la alianza voluntariamente:
  1. Debe transferir liderazgo primero (o se aplica sucesión automática)
```

---

## 🤝 Diplomacia

### Estados Diplomáticos (4 tipos)

| Estado                         | Icono | Color UI  | Efecto en Mapa              | Efecto en Combate                    |
| ------------------------------ | ----- | --------- | --------------------------- | ------------------------------------ |
| **Aliado**                     | 🟢    | `#4CAF50` | Aldeas marcadas en verde    | Puede reforzar. NO puede atacar.     |
| **Pacto de No-Agresión (NAP)** | 🟡    | `#FFC107` | Aldeas marcadas en amarillo | NO puede atacar ni reforzar.         |
| **Neutral**                    | ⚪    | `#9E9E9E` | Sin marca especial          | Puede atacar y ser atacado.          |
| **Enemigo**                    | 🔴    | `#F44336` | Aldeas marcadas en rojo     | Puede atacar. Bonus de coordinación. |

### Mecánica de Diplomacia

```
1. El Jarl o Thane de Alianza A propone un estado diplomático a Alianza B
2. El Jarl o Thane de Alianza B ACEPTA o RECHAZA
3. Si aceptan → el estado se aplica inmediatamente a todos los miembros
4. Si rechazan → se mantiene el estado anterior (default: Neutral)
5. Cualquiera puede "romper" un tratado unilateralmente (con 24h de cooldown de aviso)

Cooldowns:
  - Cambiar de Aliado → Neutral: 24h de preaviso
  - Cambiar de Aliado → Enemigo: 48h de preaviso (evita traiciones instantáneas)
  - Cambiar de NAP → Neutral: 12h de preaviso
  - Cambiar de Neutral → Enemigo: Inmediato
```

### Restricciones de Diplomacia

| Regla              | Valor                                           | Justificación                |
| ------------------ | ----------------------------------------------- | ---------------------------- |
| Máximo de aliados  | 3 alianzas aliadas                              | Evita mega-coaliciones       |
| Máximo de NAPs     | 5 alianzas                                      | Permite diplomacia flexible  |
| Auto-diplomacia    | Una alianza está aliada consigo misma (siempre) | Obvio                        |
| Atacar a un aliado | Bloqueado por el sistema                        | Deben romper alianza primero |
| Reforzar a un NAP  | NO permitido                                    | Solo aliados pueden reforzar |

---

## 🏆 Rankings

### Rankings Individuales

| Ranking       | Métrica                                                            | Actualización     |
| ------------- | ------------------------------------------------------------------ | ----------------- |
| **Población** | Suma de población de todas las aldeas del jugador                  | Cada hora         |
| **Atacante**  | Puntos de ataque acumulados (ATK de tropas destruidas al enemigo)  | Tras cada batalla |
| **Defensor**  | Puntos de defensa acumulados (DEF de tropas destruidas al enemigo) | Tras cada batalla |
| **Saqueador** | Total de recursos saqueados                                        | Tras cada batalla |
| **Aldeas**    | Número de aldeas                                                   | Cada hora         |

### Rankings de Alianza

| Ranking               | Métrica                                 | Cálculo   |
| --------------------- | --------------------------------------- | --------- |
| **Población**         | Suma de población de todos los miembros | Cada hora |
| **Ofensiva**          | Suma de puntos de ataque de miembros    | Cada hora |
| **Defensiva**         | Suma de puntos de defensa de miembros   | Cada hora |
| **Media por miembro** | Población total / miembros              | Cada hora |
| **Territorio**        | Número de aldeas controladas            | Cada hora |

### Fórmula de Puntos de Batalla

```
Puntos de Ataque:
  puntos_atk = Σ (tropas_enemigas_destruidas_i × coste_total_tropa_i / 10)

Puntos de Defensa:
  puntos_def = Σ (tropas_enemigas_destruidas_i × coste_total_tropa_i / 10)

Ejemplo: Destruir 10 Berserkers (coste 500 c/u):
  puntos = 10 × 500 / 10 = 500 puntos
```

---

## 💬 Comunicación

### Chat de Alianza

| Feature          | Especificación                           |
| ---------------- | ---------------------------------------- |
| **Tipo**         | Chat de texto en tiempo real (WebSocket) |
| **Acceso**       | Todos los miembros de la alianza         |
| **Historial**    | Últimos 500 mensajes (7 días)            |
| **Max longitud** | 300 caracteres por mensaje               |
| **Rate limit**   | 10 mensajes por minuto                   |
| **Formato**      | Solo texto plano (sin HTML/Markdown)     |

### Mensajes de Alianza (Circular)

| Feature          | Especificación                           |
| ---------------- | ---------------------------------------- |
| **Acceso**       | Jarl, Thane, Hirdman (roles con permiso) |
| **Tipo**         | Mensaje broadcast a todos los miembros   |
| **Visibilidad**  | Aparece como banner en la UI del juego   |
| **Max activos**  | 3 mensajes simultáneos                   |
| **Max longitud** | 500 caracteres                           |

### Notificaciones Automáticas

| Evento              | Mensaje                                       | Destinatarios      |
| ------------------- | --------------------------------------------- | ------------------ |
| Miembro atacado     | "⚔️ [Jugador] está siendo atacado en [aldea]" | Todos los miembros |
| Nuevo miembro       | "🟢 [Jugador] se unió a la alianza"           | Todos los miembros |
| Miembro expulsado   | "🔴 [Jugador] fue expulsado"                  | Todos los miembros |
| Diplomacia cambiada | "🤝 Ahora somos [estado] con [Alianza]"       | Todos los miembros |
| Miembro conquistado | "💀 [Jugador] perdió su aldea [aldea]"        | Todos los miembros |
| Oasis reclamado     | "🌿 [Jugador] reclamó un oasis (+25% Hierro)" | Todos los miembros |

---

## 🎯 Mecánicas de Alianza

### Refuerzo (Aliados)

```
1. Un miembro aliado puede enviar tropas a la aldea de otro aliado
2. Las tropas viajan al destino y se quedan como defensores
3. Si la aldea es atacada, las tropas refuerzo defienden como si fueran locales
4. El dueño de las tropas puede retirarlas en cualquier momento
5. Las tropas refuerzo consumen trigo del DEFENSOR (aldea donde están)
```

| Regla                         | Valor                                             |
| ----------------------------- | ------------------------------------------------- |
| Máximo de refuerzos por aldea | Sin límite (limitado por trigo del defensor)      |
| Velocidad de refuerzo         | Velocidad de la tropa más lenta del grupo         |
| Trigo de tropas refuerzo      | Lo paga el defensor (aldea destino)               |
| Retirada                      | El dueño o el defensor pueden devolver las tropas |

### Ataque Coordinado (Feature: Planificador)

```
Fase 3+ feature:
  El Jarl/Thane puede crear un "Plan de Ataque" con:
  - Aldea objetivo (celda del mapa)
  - Hora de llegada deseada
  - Lista de miembros participantes

  El sistema calcula automáticamente la hora de envío para cada miembro
  basándose en la distancia y velocidad de sus tropas, para que TODOS
  lleguen al mismo tiempo (ataque sincronizado).
```

### Compartir Inteligencia

```
Los miembros de una alianza pueden ver:
  - Posición de aldeas de todos los miembros (en el mapa)
  - Tropas estacionadas en aldeas de aliados (si envías refuerzos)
  - Ataques entrantes a aldeas de aliados (notificación)

Los miembros NO pueden ver:
  - Recursos exactos de aliados
  - Edificios exactos de aliados
  - Tropas en producción de aliados
```

---

## 📊 Progresión de Alianzas

### Ciclo de Vida Típico de un Servidor

| Fase              | Día del Servidor | Actividad de Alianzas                                             |
| ----------------- | ---------------- | ----------------------------------------------------------------- |
| **Formación**     | Day 1-7          | Se crean alianzas, reclutamiento activo. Diplomacia mínima.       |
| **Consolidación** | Day 7-21         | Las alianzas débiles se disuelven o fusionan. Se establecen NAPs. |
| **Conflicto**     | Day 21-45        | Guerras entre alianzas por territorio y oasis. Diplomacia tensa.  |
| **Dominio**       | Day 45-75        | 3-5 alianzas dominantes controlan zonas del mapa.                 |
| **Endgame**       | Day 75+          | Lucha por Yggdrasil (centro del mapa). Mega-alianzas vs todos.    |

### Métricas Objetivo

| Métrica                            | Target | Justificación                                         |
| ---------------------------------- | ------ | ----------------------------------------------------- |
| % de jugadores en alianza (Day 7)  | 40%    | La presión PvP incentiva unirse                       |
| % de jugadores en alianza (Day 30) | 70%    | Jugadores sin alianza tienden a abandonar             |
| Alianzas activas por servidor      | 20-40  | Con 60 miembros max → 1,200-2,400 jugadores cubiertos |
| Guerras activas (Day 30+)          | 3-8    | Contenido PvP constante                               |

---

## ⚙️ Configuración Técnica

### Creación de Alianza

```
POST /api/alliances
{
  "name": "Hijos de Odín",
  "tag": "ODN",
  "description": "Gloria para Valhalla",
  "founder": "player_id"
}

Validaciones:
  - Nombre: 3-30 chars, único en el servidor
  - Tag: 2-4 chars, alfanumérico, único
  - Jugador no debe estar en otra alianza
```

### Unirse a una Alianza

```
Opción 1: Invitación (el oficial invita al jugador)
Opción 2: Solicitud (el jugador pide unirse, un oficial acepta)

No hay "join automático" — siempre requiere aprobación de un rol con permiso.
```

### Abandonar / Disolver

```
Abandonar:
  - El jugador deja la alianza inmediatamente
  - Si es Jarl → debe transferir liderazgo primero (o sucesión automática)
  - Cooldown de 24h antes de poder unirse a otra alianza

Disolver:
  - Solo el Jarl puede disolver
  - Todos los miembros son expulsados inmediatamente
  - Todos los tratados diplomáticos se cancelan
  - Cooldown de 48h antes de que el Jarl pueda crear otra alianza
```

---

## 🔍 Edge Cases & Exploit Check

| Escenario                              | Resultado                                                                                        | Veredicto                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------- |
| Jugador sin alianza en Day 30+         | Puede sobrevivir pero muy vulnerable a raids                                                     | ✅ Incentiva participación social       |
| Alianza de 1 solo jugador              | Válido — puede servir para diplomacia personal                                                   | ✅ Caso edge legítimo                   |
| Mega-alianza con alts (cuentas falsas) | Max 60 miembros limita el impacto. Anti-multicuenta: IP + device check                           | ✅ Mitigable                            |
| Romper alianza y atacar inmediatamente | Cooldown 24-48h de preaviso → no se puede traicionar instantáneamente                            | ✅ Protección mecánica                  |
| Alianza aliada de alianza aliada       | Transitividad NO aplica — debes tener alianza directa                                            | ✅ Evita mega-coaliciones pasivas       |
| Jarl abandona el juego                 | Sucesión automática a los 14 días                                                                | ✅ La alianza sobrevive                 |
| 3 alianzas aliadas + 5 NAPs cada una   | 3 aliados × 60 = 180 "protegidos" + NAPs → ~480 no-atacables. De 2000 jugadores → 24% intocable. | ⚠️ Monitorear — podría necesitar ajuste |

---

## 📌 Next Step

> **@archivist** debe integrar el sistema de alianzas en la documentación oficial del GDD.
> **@qa** debe validar: límites de miembros, balance de diplomacia (máx aliados), anti-exploit de mega-coaliciones, y mecánicas de sucesión.

---

_Diseñado por `@gamedesign` — 2026-02-23_
_Pendiente validación por `@qa`_
