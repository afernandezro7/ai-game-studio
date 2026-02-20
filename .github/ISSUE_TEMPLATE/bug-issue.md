---
name: Bug Report / Exploit
about: Reportar un fallo lógico o exploit en el diseño
title: "[QA] Posible Soft-Lock en la Economía Inicial"
labels: "bug, qa, economy"
assignees: ""
---

## 🐛 Descripción del Problema

He revisado el GDD (`docs/buildings.md` y `docs/economy.md`) y he encontrado un fallo lógico grave que puede causar un **Soft-Lock** (el jugador se queda atascado sin poder avanzar) en los primeros minutos de juego.

**El problema:**

1. El jugador empieza con el Gran Salón Nivel 1.
2. Para construir un **Aserradero Nivel 1**, necesita **150 de Acero**.
3. Para construir una **Mina de Acero Nivel 1**, necesita **150 de Madera**.
4. Si el jugador gasta sus recursos iniciales (que no están definidos explícitamente, pero asumamos que son pocos) en defensas o tropas antes de construir los recolectores, **no tendrá Madera para construir la Mina, ni Acero para construir el Aserradero**.
5. Al no tener recolectores, su producción por hora es 0. No puede generar recursos para atacar (PvE/PvP) ni para construir. El juego se rompe.

## 🧮 Análisis Matemático

- Producción base sin edificios: 0/hora.
- Coste mínimo para iniciar la economía: 150 Madera + 150 Acero.
- Si Recursos Actuales < 150 y Producción = 0 -> **Soft-Lock**.

## 💡 Solución Propuesta

Para evitar este problema, propongo dos cambios en el diseño:

1. **Cambio en los Costes Iniciales:**
   - El **Aserradero Nivel 1** debe costar **Madera** (ej. 100 Madera), no Acero.
   - La **Mina de Acero Nivel 1** debe costar **Madera** (ej. 150 Madera), no Acero.
   - _Justificación:_ La Madera es el recurso de construcción base. El jugador siempre debe poder construir recolectores usando el recurso más básico.

2. **Producción Base del Gran Salón:**
   - El Gran Salón Nivel 1 debería tener una producción pasiva mínima (ej. 50 Madera/hora y 50 Acero/hora) para garantizar que un jugador _nunca_ se quede con producción 0.

## 🚀 Siguiente Paso

- [ ] `@gamedesign` debe revisar esta propuesta, ajustar las tablas en `docs/buildings.md` y definir los recursos iniciales exactos con los que empieza el jugador.
