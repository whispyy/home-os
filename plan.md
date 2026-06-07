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

## Open Questions / Future Ideas

- [ ] Multiple desktop wallpaper images (local file or URL)
- [ ] Pinned taskbar items (always visible, not just open windows)
- [ ] Widget system (clock widget, weather, notes on desktop)
- [ ] Multiple virtual desktops / workspaces
- [ ] Keyboard shortcuts (Win key = start menu, Alt+F4 = close window)
- [ ] Window snap zones (snap to left/right half)
- [ ] Dark/light theme toggle
- [ ] PWA support for installable experience
