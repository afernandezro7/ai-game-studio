# 🎮 Tutorial: Montar Project Valhalla en Unity (paso a paso)

> Tiempo estimado: ~2 horas hasta tener el juego corriendo en tu teléfono.

---

## Paso 1: Instalar Unity

- [x] Ve a [unity.com/download](https://unity.com/download) → descarga **Unity Hub**
- [x] Abre Unity Hub → pestaña **Installs** → **Install Editor**
- [x] Elige **Unity 6 LTS** (o la última LTS disponible)
- [x] En módulos, marca:
  - ✅ Android Build Support (incluye SDK & NDK)
  - ✅ iOS Build Support (solo funciona en Mac)
- [x] Dale a Install (~5GB, tarda un rato)

---

## Paso 2: Crear el proyecto

- [x] Unity Hub → pestaña **Projects** → **New Project**
- [x] Template: **2D (URP)** — Universal Render Pipeline
- [x] Configurar:
  - **Project name**: `valhalla-unity`
  - **Location**: `~/Desktop/Cursos/`
- [x] Click **Create Project** → espera que abra el editor

---

## Paso 3: Copiar los archivos

Abre Terminal y ejecuta:

```bash
# Desde la raíz de ai-game-studio:
cd ~/Desktop/Cursos/ai-game-studio

# 1. Copiar JSON configs
mkdir -p ~/Desktop/Cursos/valhalla-unity/Assets/Resources/Config
cp src/config/BuildingsConfig.json ~/Desktop/Cursos/valhalla-unity/Assets/Resources/Config/
cp src/config/ResourcesConfig.json ~/Desktop/Cursos/valhalla-unity/Assets/Resources/Config/

# 2. Copiar scripts C# — Data models
mkdir -p ~/Desktop/Cursos/valhalla-unity/Assets/Scripts/Valhalla/Data
cp src/unity/Models/*.cs ~/Desktop/Cursos/valhalla-unity/Assets/Scripts/Valhalla/Data/

# 3. Copiar scripts C# — Core systems
mkdir -p ~/Desktop/Cursos/valhalla-unity/Assets/Scripts/Valhalla/Core
cp src/unity/Core/*.cs ~/Desktop/Cursos/valhalla-unity/Assets/Scripts/Valhalla/Core/

# 4. Copiar scripts C# — UI
mkdir -p ~/Desktop/Cursos/valhalla-unity/Assets/Scripts/Valhalla/UI
cp src/unity/UI/*.cs ~/Desktop/Cursos/valhalla-unity/Assets/Scripts/Valhalla/UI/

# 5. Crear carpetas para assets
mkdir -p ~/Desktop/Cursos/valhalla-unity/Assets/Sprites/Buildings
mkdir -p ~/Desktop/Cursos/valhalla-unity/Assets/Sprites/Icons
mkdir -p ~/Desktop/Cursos/valhalla-unity/Assets/Prefabs
```

- [ ] Vuelve a Unity → verás que auto-detecta los archivos y compila

---

## Paso 4: Importar TextMeshPro

Los scripts de UI usan TextMeshPro (viene incluido en Unity 6, pero hay que importar sus recursos):

- [ ] En Unity → menú **Window → TextMeshPro → Import TMP Essential Resources** → click **Import**
- [ ] Si no ves ese menú: Hierarchy → click derecho → **UI → Text - TextMeshPro** → Unity te pedirá importar automáticamente → dale **Import TMP Essentials**

---

## Paso 5: Crear la escena del juego

### 5a. GameManager (carga los JSON)

- [ ] Panel **Hierarchy** (izquierda) → click derecho → **Create Empty**
- [ ] Renómbralo a `GameManager`
- [ ] Panel **Inspector** (derecha) → click **Add Component**
- [ ] Escribe `ConfigLoader` → selecciónalo

> Al darle Play, el ConfigLoader cargará los JSON automáticamente.

### 5b. Canvas (el contenedor de toda la UI)

- [ ] Hierarchy → click derecho → **UI → Canvas**
  - Se crea un Canvas + EventSystem automáticamente
- [ ] Selecciona el Canvas → Inspector → **Canvas Scaler**:
  - UI Scale Mode: **Scale With Screen Size**
  - Reference Resolution: **1080 × 1920** (vertical, móvil)
  - Match: **0.5**

### 5c. Resource Bar (barra de recursos arriba)

- [ ] Click derecho en **Canvas** → **UI → Panel** → renombra a `ResourceBar`
- [ ] Inspector → Rect Transform:
  - Anchor preset: **Top Stretch** (el icono con línea arriba y flechas a los lados)
  - Height: **80**
- [ ] Click derecho en **ResourceBar** → **UI → Panel** → renombra a `WoodPanel`
- [ ] Dentro de WoodPanel, crear:
  - Click derecho → **UI → Image** → renombra a `WoodIcon`
  - Click derecho → **UI → Text - TextMeshPro** → renombra a `WoodAmount`
  - Click derecho → **UI → Text - TextMeshPro** → renombra a `WoodRate`
- [ ] Selecciona `WoodPanel` → **Duplicar** (Cmd+D) → renombra a `SteelPanel`
  - Renombra sus hijos a `SteelIcon`, `SteelAmount`, `SteelRate`
- [ ] Duplica de nuevo → renombra a `RunesPanel`
  - Renombra sus hijos a `RunesIcon`, `RunesAmount` (sin Rate)
- [ ] Selecciona `ResourceBar` → Add Component → **Horizontal Layout Group**
  - Spacing: 10
  - Child Alignment: Middle Center
- [ ] Selecciona `ResourceBar` → Add Component → busca `ResourceBarUI`
- [ ] **Arrastra** cada referencia desde Hierarchy al campo del Inspector:

  | Desde Hierarchy | Al campo del Inspector |
  | --------------- | ---------------------- |
  | WoodIcon        | Wood Icon              |
  | WoodAmount      | Wood Amount            |
  | WoodRate        | Wood Rate              |
  | SteelIcon       | Steel Icon             |
  | SteelAmount     | Steel Amount           |
  | SteelRate       | Steel Rate             |
  | RunesIcon       | Runes Icon             |
  | RunesAmount     | Runes Amount           |

> **¿Qué es "arrastrar al Inspector"?** Con el ratón, tomas el objeto de la Hierarchy y lo sueltas sobre el campo vacío en el Inspector. Unity lo conecta automáticamente.

### 5d. Building Cards (tarjetas de edificios)

**Crear el contenedor scroll:**

- [ ] Click derecho en **Canvas** → **UI → Scroll View** → renombra a `BuildingsScroll`
- [ ] Rect Transform:
  - Anchor: **Bottom Stretch**
  - Height: **400**
- [ ] Dentro de `BuildingsScroll → Viewport → Content`:
  - Add Component → **Horizontal Layout Group**
  - Spacing: 20
  - Child Alignment: Middle Center

**Crear el prefab de una BuildingCard:**

- [ ] Click derecho en **Content** → **UI → Panel** → renombra a `BuildingCard`
- [ ] Tamaño: Width **300**, Height **380**
- [ ] Dentro de BuildingCard, crear estos hijos:

  | Tipo                      | Nombre            | Para qué                             |
  | ------------------------- | ----------------- | ------------------------------------ |
  | UI → Image                | `BuildingImage`   | Sprite del edificio                  |
  | UI → Text - TextMeshPro   | `BuildingName`    | Nombre ("Gran Salón")                |
  | UI → Text - TextMeshPro   | `LevelText`       | "Nivel 2"                            |
  | UI → Text - TextMeshPro   | `ProductionText`  | "+200/h"                             |
  | UI → Text - TextMeshPro   | `DescriptionText` | Descripción                          |
  | UI → Button - TextMeshPro | `UpgradeButton`   | Botón de mejorar                     |
  | UI → Panel                | `TimerPanel`      | Panel del timer (oculto por defecto) |
  | UI → Button - TextMeshPro | `SpeedUpButton`   | Botón "Acelerar con Runas"           |

- [ ] Dentro de `UpgradeButton`: el texto hijo renómbralo a `UpgradeCostText`
- [ ] Dentro de `TimerPanel`:
  - Click derecho → **UI → Slider** → renombra a `TimerSlider`
  - Click derecho → **UI → Text - TextMeshPro** → renombra a `TimerText`
- [ ] Selecciona `BuildingCard` → Add Component → busca `BuildingCardUI`
- [ ] Arrastra cada referencia al Inspector (igual que con ResourceBar)

**Convertir en Prefab:**

- [ ] En el panel **Project** (abajo), navega a `Assets/Prefabs/`
- [ ] **Arrastra** `BuildingCard` desde la **Hierarchy** a la carpeta **Prefabs** en el Project
  - Se pone azul = es un prefab
- [ ] **Borra** el BuildingCard de la Hierarchy (click derecho → Delete)
  - El prefab queda guardado en la carpeta

### 5e. GameHUD (conectar todo)

- [ ] Selecciona el **Canvas** → Add Component → busca `GameHUD`
- [ ] Arrastra las referencias:

  | Desde                                       | Al campo             |
  | ------------------------------------------- | -------------------- |
  | `ResourceBar` (Hierarchy)                   | Resource Bar         |
  | `Content` dentro del ScrollView (Hierarchy) | Buildings Container  |
  | `BuildingCard` prefab (Project/Prefabs)     | Building Card Prefab |

### 5f. (Opcional) Offline Earnings Popup

- [ ] Click derecho en **Canvas** → **UI → Panel** → renombra a `OfflinePopup`
- [ ] Dentro crear:
  - **Text - TextMeshPro** → `OfflineWoodText`
  - **Text - TextMeshPro** → `OfflineSteelText`
  - **Button - TextMeshPro** → `OfflineClaimButton` (texto: "Reclamar")
- [ ] Desactivar el OfflinePopup (quitar check en Inspector arriba)
- [ ] En el Canvas → componente GameHUD:
  - Arrastra OfflinePopup, OfflineWoodText, OfflineSteelText, OfflineClaimButton a sus campos

---

## Paso 6: Generar las imágenes con IA

- [ ] Abre [docs/art/building-prompts.md](art/building-prompts.md) (o el archivo en este repo)
- [ ] Ve a tu herramienta de IA favorita:
  - [Midjourney](https://midjourney.com) (la mejor calidad para game assets)
  - [ChatGPT/DALL-E](https://chatgpt.com) (más fácil, incluido en GPT Plus)
  - [Leonardo.ai](https://leonardo.ai) (gratis, bueno para game art)
- [ ] Copia cada prompt y pégalo. Ejemplo para Gran Salón nivel 1:

  > A small modest viking wooden longhouse, simple thatched roof, single entrance with wooden door, rough-hewn timber walls, small campfire outside, snowy nordic village background, stylized mobile game art, clash of clans style, vibrant colors, warm firelight glow, isometric view, 3d render, game asset, transparent background, clean edges --ar 1:1 --s 750

- [ ] Descarga cada imagen como **PNG**
- [ ] Guárdalas así:

  ```
  Assets/Sprites/Buildings/
  ├── great_hall_1.png
  ├── great_hall_2.png
  ├── great_hall_3.png
  ├── lumber_mill_1.png
  ├── lumber_mill_2.png
  ├── lumber_mill_3.png
  ├── steel_mine_1.png
  ├── steel_mine_2.png
  └── steel_mine_3.png

  Assets/Sprites/Icons/
  ├── icon_wood.png
  ├── icon_steel.png
  ├── icon_runes.png
  └── btn_upgrade.png
  ```

- [ ] En Unity, selecciona cada imagen → Inspector:
  - Texture Type: **Sprite (2D and UI)**
  - Pixels Per Unit: **100**
  - Click **Apply**

---

## Paso 7: Probar

- [ ] Click el botón **▶ Play** (arriba en el centro del editor)
- [ ] Deberías ver:
  - ✅ Barra de recursos arriba con números subiendo cada segundo
  - ✅ Tarjetas de edificios con información y botón de Mejorar
  - ✅ Click en Mejorar → bajan recursos → empieza timer de construcción
  - ✅ Timer completa → edificio sube de nivel → producción aumenta
- [ ] Si algo falla: menú **Window → General → Console** → lee el error en rojo

### Errores comunes

| Error                            | Solución                                                                         |
| -------------------------------- | -------------------------------------------------------------------------------- |
| "BuildingsConfig.json not found" | Verifica que el JSON está en `Assets/Resources/Config/` (con la R mayúscula)     |
| "NullReferenceException" en UI   | Alguna referencia no está arrastrada al Inspector. Revisa los campos vacíos      |
| No compila                       | Window → General → Console → lee el primer error. Suele ser un `using` que falta |

---

## Paso 8: Build para tu teléfono

### Android

- [ ] **File → Build Settings → Android** → click **Switch Platform** (tarda ~2 min)
- [ ] Click **Player Settings** (abajo izquierda):
  - Company Name: `AI Game Studio`
  - Product Name: `Project Valhalla`
  - Other Settings → Package Name: `com.aigamestudio.valhalla`
  - Minimum API Level: `Android 7.0 (API 24)`
- [ ] Conecta tu Android por USB
  - En el teléfono: Ajustes → Sobre el teléfono → toca "Build Number" 7 veces → activa Opciones de Desarrollador → activa Depuración USB
- [ ] En Unity: **Build And Run**
  - Genera APK → lo instala → abre el juego en tu teléfono

### iOS

- [ ] **File → Build Settings → iOS** → click **Switch Platform**
- [ ] Player Settings:
  - Bundle Identifier: `com.aigamestudio.valhalla`
  - Target minimum iOS version: `15.0`
- [ ] Click **Build** → elige una carpeta → genera proyecto Xcode
- [ ] Abre el `.xcodeproj` en Xcode
- [ ] Signing & Capabilities → selecciona tu Team (Apple Developer)
- [ ] Conecta iPhone → selecciónalo como destino → click **Run** (▶)
- [ ] Necesitas Apple Developer Program ($99/año)

---

## Checklist final

- [ ] Unity instalado con módulos Android/iOS
- [ ] Proyecto creado (2D URP)
- [ ] JSON configs copiados a `Assets/Resources/Config/`
- [ ] Scripts C# copiados a `Assets/Scripts/Valhalla/`
- [ ] TextMeshPro instalado e importado
- [ ] GameManager con ConfigLoader en la escena
- [ ] Canvas con ResourceBar configurado
- [ ] BuildingCard prefab creado
- [ ] GameHUD conectado en el Canvas
- [ ] Imágenes generadas e importadas como Sprites
- [ ] El juego funciona en Play Mode
- [ ] Build exitoso en Android o iOS

---

_¡Skål! 🍻 Tu juego vikingo está en tu teléfono._
