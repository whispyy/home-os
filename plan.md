# home-os — Plan

A configurable web app OS dashboard built in React. Desktop looks like a Windows/Linux blend. Mobile looks like iOS.

---

## Core Concept

The app is a browser-based "operating system shell" that wraps your bookmarks and internal tools. Links open inside resizable, draggable windows (iframes). The config is stored in localStorage and can be exported/imported as JSON.

---

## Layout Modes

### Desktop (≥ 768px) — Windows/Linux blend

```
+----------------------------------------------------------+
|                    Desktop Canvas                        |
|   [shortcut icon]   [shortcut icon]                      |
|                                                          |
|   +------------------+   +-------------------+          |
|   | Window (iframe)  |   | Window (iframe)   |          |
|   | [_ [] x]         |   | [_ [] x]          |          |
|   |                  |   |                   |          |
|   +------------------+   +-------------------+          |
|                                                          |
+----------------------------------------------------------+
| [Start] | [Win1 tab] [Win2 tab] |         [clock] [...]  |
+----------------------------------------------------------+
```

- **Desktop canvas**: background wallpaper, draggable shortcut icons, open windows
- **Bottom taskbar**:
  - Left: Start menu button
  - Center: open window tabs (click to focus/restore)
  - Right: clock, settings icon

### Mobile (< 768px) — iOS Springboard

```
+------------------+
|  Status bar       |
|                   |
|  [icon] [icon]    |
|  [icon] [folder]  |  <-- folder = category
|  [icon] [icon]    |
|                   |
|  [ page dots ]    |
|  [ dock area  ]   |
+------------------+
```

- Categories become folders (tap to open overlay with grid of links)
- Shortcuts become home screen icons
- No windowed mode — links open in new tab on mobile

---

## Features

### Start Menu
- Triggered by Start button in taskbar
- Displays categories as sections (or expandable groups)
- Each category contains links
- Clicking a link opens it in a new window frame on the desktop
- Search bar to filter links

### Window Manager
- Built with **react-rnd** (drag + resize)
- Each window:
  - Title bar with app name/icon, minimize `_`, maximize `[]`, close `x`
  - Content: `<iframe>` loading the link URL
  - If iframe is blocked (`X-Frame-Options` / CSP), shows a fallback screen with "Open in new tab" button
- Windows stack with z-index management (click to bring to front)
- Minimize hides window body, keeps tab in taskbar
- Maximize fills the desktop canvas

### Desktop Shortcuts
- Icons positioned on the desktop canvas at (x, y) coordinates
- Draggable via **react-dnd** to reposition
- Double-click to open
- Right-click context menu: Open, Rename, Remove shortcut
- Any link from the start menu can be pinned as a shortcut

### Config System
- All state lives in React Context, persisted to **localStorage**
- Config shape:
```json
{
  "wallpaper": "#1a1a2e",
  "categories": [
    {
      "id": "uuid",
      "name": "Dev Tools",
      "icon": "terminal",
      "links": [
        {
          "id": "uuid",
          "label": "Grafana",
          "url": "https://grafana.example.com",
          "icon": "chart-bar"
        }
      ]
    }
  ],
  "shortcuts": [
    {
      "linkId": "uuid",
      "position": { "x": 80, "y": 60 }
    }
  ]
}
```

- **Export**: download config as `home-os-config.json`
- **Import**: upload JSON file, validate shape, merge or replace

### Settings Panel
- Opens as a window or modal
- Tabs:
  - **Appearance**: wallpaper color or image URL, taskbar color
  - **Config**: export button, import file picker, reset to defaults
  - **About**: version, repo link

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite |
| Styling | styled-components |
| Windowing | react-rnd |
| Drag (icons) | react-dnd |
| State | React Context + useReducer |
| Persistence | localStorage |
| Icons | lucide-react |
| Mobile detection | CSS breakpoints + `useMediaQuery` hook |

---

## Project Structure

```
src/
  components/
    desktop/
      Desktop.tsx          # canvas with shortcuts + windows
      Taskbar.tsx          # bottom bar
      StartMenu.tsx        # start menu overlay
      WindowFrame.tsx      # individual window (react-rnd + iframe)
      Shortcut.tsx         # desktop icon
    mobile/
      Springboard.tsx      # iOS-style home screen
      AppFolder.tsx        # category folder overlay
      AppIcon.tsx          # single icon
    shared/
      ContextMenu.tsx      # right-click menu
      SettingsPanel.tsx    # settings window
  context/
    OSContext.tsx          # global state + actions
    WindowContext.tsx      # window manager state (open, focus, z-index)
  hooks/
    useLocalStorage.ts
    useMediaQuery.ts
    useIframeCheck.ts      # detects if URL is embeddable
  types/
    config.ts              # Config, Category, Link, Shortcut types
    window.ts              # WindowInstance type
  utils/
    config.ts              # export/import/validate helpers
    uuid.ts
  App.tsx
  main.tsx
```

---

## State Shape

### OSContext (config + persistence)
- `config: Config` — categories, shortcuts, wallpaper
- Actions: `addCategory`, `removeCategory`, `addLink`, `removeLink`, `addShortcut`, `removeShortcut`, `moveShortcut`, `importConfig`, `exportConfig`

### WindowContext (runtime only, not persisted)
- `windows: WindowInstance[]`
- Each `WindowInstance`: `{ id, linkId, title, url, icon, state: 'open'|'minimized'|'maximized', position, size, zIndex }`
- Actions: `openWindow`, `closeWindow`, `minimizeWindow`, `maximizeWindow`, `focusWindow`, `moveWindow`, `resizeWindow`

---

## Iframe Embedding Strategy

1. Attempt to load URL in iframe
2. Attach `onError` + a timeout check — if the frame fails to load content (sandboxing headers), detect it
3. Show a friendly fallback UI inside the window: app icon, name, and "Open in new tab" CTA
4. Note: detection is best-effort; some blocked iframes fail silently — add a manual "not loading?" button always visible in the title bar

---

## Milestones

1. **Scaffold** — Vite + React + TS + Tailwind, folder structure, types
2. **Config layer** — OSContext, localStorage persistence, export/import
3. **Desktop shell** — canvas, taskbar, clock
4. **Start menu** — category/link rendering, search
5. **Window manager** — WindowContext, WindowFrame with react-rnd, iframe + fallback
6. **Desktop shortcuts** — Shortcut component, react-dnd drag to reposition, right-click menu
7. **Settings panel** — appearance + config management
8. **Mobile Springboard** — responsive switch, folder/icon grid
9. **Polish** — animations, wallpaper, taskbar theming, accessibility

---

## Widget System

Widgets are draggable, resizable cards that live on the desktop canvas. They sit below open windows in z-index. Multiple instances of the same widget type are supported (e.g. weather for two cities).

### Adding widgets
Right-click on the desktop → "Add widget" → picker of available widget types.

### Widget Definition (registry pattern)

Each widget type is self-contained in `src/widgets/<type>/`:

```ts
interface WidgetDefinition<TConfig = Record<string, unknown>> {
  type: string                    // unique key e.g. 'weather'
  label: string                   // display name
  icon: string                    // emoji
  defaultConfig: TConfig          // initial config when added
  defaultSize: { width: number; height: number }
  minSize?: { width: number; height: number }
  component: React.ComponentType<WidgetProps<TConfig>>
  configPanel?: React.ComponentType<WidgetConfigProps<TConfig>>  // optional inline settings
}
```

Central registry at `src/widgets/registry.ts` — maps type string → definition. Adding a new widget = one new folder + one registry line.

### Widget Instance (persisted in config)

```ts
interface WidgetInstance {
  id: string
  type: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  config: Record<string, unknown>
}
```

### Widget Props contract

```ts
interface WidgetProps<TConfig> {
  id: string
  config: TConfig
  onUpdateConfig: (config: Partial<TConfig>) => void
  onRemove: () => void
}
```

### Widget Container

`WidgetContainer.tsx` wraps every widget instance:
- Draggable + resizable via **react-rnd**
- Right-click context menu: Settings, Remove
- Renders the widget's `component` inside

### Data fetching

Each widget manages its own fetching (useEffect + setInterval). No shared layer — keeps widgets independent.

### Config changes

`widgets: WidgetInstance[]` added to `Config`. OSContext gains:
- `addWidget(type, position)` — creates instance with defaults
- `removeWidget(id)`
- `updateWidgetConfig(id, config)`
- `moveWidget(id, position)`
- `resizeWidget(id, size)`

### Desktop right-click menu

Right-click on desktop canvas (not on a shortcut/widget) opens:
- Add widget → sub-picker listing all registered types
- (future) Change wallpaper

### Project structure additions

```
src/
  widgets/
    registry.ts              # maps type → WidgetDefinition
    WidgetContainer.tsx      # rnd wrapper + context menu
    weather/
      index.ts               # WidgetDefinition export
      WeatherWidget.tsx      # component
      WeatherConfig.tsx      # config panel
      useWeather.ts          # data fetching hook
```

### Weather widget

- **API**: open-meteo (free, no key)
- **Geocoding**: open-meteo geocoding API (`https://geocoding-api.open-meteo.com/v1/search?name=...`) to resolve city name → lat/lon
- **Location**: browser `navigator.geolocation` for "use my location"
- **Config**: `{ lat, lon, cityLabel, unit: 'celsius'|'fahrenheit', refreshInterval: number }`
- **Display**: temperature, weather condition (icon mapped from WMO weather code), wind speed, day/night background tint
- **Refresh**: configurable interval (default 10 min)

### WMO weather code → icon mapping (open-meteo)

| Code | Condition | Icon |
|---|---|---|
| 0 | Clear sky | ☀️ / 🌙 |
| 1–3 | Partly cloudy | 🌤️ |
| 45–48 | Fog | 🌫️ |
| 51–67 | Drizzle / Rain | 🌧️ |
| 71–77 | Snow | ❄️ |
| 80–82 | Rain showers | 🌦️ |
| 95–99 | Thunderstorm | ⛈️ |

---

## Open Questions / Future Ideas

- [ ] Multiple desktop wallpaper images (local file or URL)
- [ ] Pinned taskbar items (always visible, not just open windows)
- [ ] More widgets: clock, notes, RSS feed, system stats
- [ ] Multiple virtual desktops / workspaces
- [ ] Keyboard shortcuts (Win key = start menu, Alt+F4 = close window)
- [ ] Window snap zones (snap to left/right half)
- [ ] Dark/light theme toggle
- [ ] PWA support for installable experience
