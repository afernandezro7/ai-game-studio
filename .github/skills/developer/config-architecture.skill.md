# Skill: Config-Driven Design (Arquitectura de Datos)

> Fuente: "Level Up!" — Sección 3 (GDD) + Sección 5 (Arquitectura de Mundo)

## Cuándo Usar Este Skill

Cuando el Developer genera o modifica JSON configs en `src/config/` o `games/<id>/config/`.

## Principio: El Config ES el Juego

En un estudio config-driven, el JSON no es "una copia de los datos". **El JSON es el juego.** Unity, Godot, Roblox o el web sandbox simplemente lo leen y lo ejecutan.

### Reglas de Arquitectura de Config

1. **1:1 con el GDD:** Cada tabla del GDD tiene un JSON config correspondiente. Si el GDD dice "Lumber Mill Lv2: 200 wood, 100 steel", el JSON dice exactamente eso.

2. **Schema tipado:** Todo config DEBE tener una interfaz TypeScript que lo defina:

```typescript
interface BuildingLevel {
  level: number;
  cost: { [resourceId: string]: number };
  buildTimeSeconds: number;
  productionPerHour?: number;
  hp?: number;
}
```

3. **Sin lógica en los datos:** El JSON contiene DATOS, no comportamiento. No meter fórmulas como strings.

| ❌ Incorrecto                         | ✅ Correcto                             |
| ------------------------------------- | --------------------------------------- |
| `"damage": "base * level"`            | `"damage": 150`                         |
| `"buildTime": "depends on resources"` | `"buildTimeSeconds": 300`               |
| `"cost": "check economy.md"`          | `"cost": { "wood": 200, "steel": 100 }` |

4. **Versionable y diffable:** Los JSON deben estar formateados con indentación de 2 espacios para que los diffs de Git sean legibles.

5. **Validación automática:** Antes de hacer commit, verificar que el JSON:
   - Parsea sin errores (`JSON.parse()`)
   - Cumple con la interfaz TypeScript (sin campos faltantes)
   - Los valores numéricos están dentro de rangos razonables (no negativos, no infinitos)

### Mapping GDD → Config

| GDD Section              | Config File            |
| ------------------------ | ---------------------- |
| economy.md (recursos)    | ResourcesConfig.json   |
| economy-and-buildings.md | BuildingsConfig.json   |
| troops.md (futuro)       | TroopsConfig.json      |
| defenses.md (futuro)     | DefensesConfig.json    |
| progression.md (futuro)  | ProgressionConfig.json |

### Feedback Loop Configs

El Developer debe incluir datos de feedback en los configs cuando aplique:

```json
{
  "id": "lumber_mill",
  "levels": [...],
  "feedback": {
    "onBuildComplete": {
      "sound": "build_complete_wood",
      "particle": "dust_cloud_medium",
      "screenShake": false
    },
    "onCollectResources": {
      "sound": "coins_collect",
      "particle": "wood_sparkle"
    }
  }
}
```

Esto permite que cualquier motor (Unity, Godot, web) lea los mismos feedback events.
