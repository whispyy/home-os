import { createContext, useContext, useReducer, useEffect } from 'react';
import type { Config, Link } from '../types/config';
import type { WidgetInstance } from '../types/widget';
import { DEFAULT_CONFIG } from '../types/config';
import { loadConfig, saveConfig } from '../utils/config';
import { uuid } from '../utils/uuid';
import { widgetRegistry } from '../widgets/registry';

type Action =
  | { type: 'ADD_CATEGORY'; name: string; icon?: string }
  | { type: 'REMOVE_CATEGORY'; categoryId: string }
  | { type: 'RENAME_CATEGORY'; categoryId: string; name: string }
  | { type: 'ADD_LINK'; categoryId: string; link: Omit<Link, 'id'> }
  | { type: 'REMOVE_LINK'; categoryId: string; linkId: string }
  | { type: 'ADD_SHORTCUT'; linkId: string; position: { x: number; y: number } }
  | { type: 'REMOVE_SHORTCUT'; linkId: string }
  | { type: 'MOVE_SHORTCUT'; linkId: string; position: { x: number; y: number } }
  | { type: 'SET_WALLPAPER'; wallpaper: string }
  | { type: 'SET_TASKBAR_COLOR'; color: string }
  | { type: 'IMPORT_CONFIG'; config: Config }
  | { type: 'RESET_CONFIG' }
  | { type: 'ADD_WIDGET'; widgetType: string; position: { x: number; y: number } }
  | { type: 'REMOVE_WIDGET'; id: string }
  | { type: 'UPDATE_WIDGET_CONFIG'; id: string; config: Record<string, unknown> }
  | { type: 'MOVE_WIDGET'; id: string; position: { x: number; y: number } }
  | { type: 'RESIZE_WIDGET'; id: string; size: { width: number; height: number } };

function reducer(state: Config, action: Action): Config {
  switch (action.type) {
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [
          ...state.categories,
          { id: uuid(), name: action.name, icon: action.icon, links: [] },
        ],
      };
    case 'REMOVE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.categoryId),
        shortcuts: state.shortcuts.filter(
          (s) =>
            !state.categories
              .find((c) => c.id === action.categoryId)
              ?.links.some((l) => l.id === s.linkId)
        ),
      };
    case 'RENAME_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.categoryId ? { ...c, name: action.name } : c
        ),
      };
    case 'ADD_LINK':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.categoryId
            ? { ...c, links: [...c.links, { ...action.link, id: uuid() }] }
            : c
        ),
      };
    case 'REMOVE_LINK':
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.categoryId
            ? { ...c, links: c.links.filter((l) => l.id !== action.linkId) }
            : c
        ),
        shortcuts: state.shortcuts.filter((s) => s.linkId !== action.linkId),
      };
    case 'ADD_SHORTCUT':
      if (state.shortcuts.some((s) => s.linkId === action.linkId)) return state;
      return {
        ...state,
        shortcuts: [...state.shortcuts, { linkId: action.linkId, position: action.position }],
      };
    case 'REMOVE_SHORTCUT':
      return {
        ...state,
        shortcuts: state.shortcuts.filter((s) => s.linkId !== action.linkId),
      };
    case 'MOVE_SHORTCUT':
      return {
        ...state,
        shortcuts: state.shortcuts.map((s) =>
          s.linkId === action.linkId ? { ...s, position: action.position } : s
        ),
      };
    case 'SET_WALLPAPER':
      return { ...state, wallpaper: action.wallpaper };
    case 'SET_TASKBAR_COLOR':
      return { ...state, taskbarColor: action.color };
    case 'IMPORT_CONFIG':
      return action.config;
    case 'RESET_CONFIG':
      return DEFAULT_CONFIG;

    case 'ADD_WIDGET': {
      const def = widgetRegistry[action.widgetType];
      if (!def) return state;
      const instance: WidgetInstance = {
        id: uuid(),
        type: action.widgetType,
        position: action.position,
        size: def.defaultSize,
        config: def.defaultConfig as Record<string, unknown>,
      };
      return { ...state, widgets: [...(state.widgets ?? []), instance] };
    }
    case 'REMOVE_WIDGET':
      return { ...state, widgets: (state.widgets ?? []).filter((w) => w.id !== action.id) };
    case 'UPDATE_WIDGET_CONFIG':
      return {
        ...state,
        widgets: (state.widgets ?? []).map((w) =>
          w.id === action.id ? { ...w, config: { ...w.config, ...action.config } } : w
        ),
      };
    case 'MOVE_WIDGET':
      return {
        ...state,
        widgets: (state.widgets ?? []).map((w) =>
          w.id === action.id ? { ...w, position: action.position } : w
        ),
      };
    case 'RESIZE_WIDGET':
      return {
        ...state,
        widgets: (state.widgets ?? []).map((w) =>
          w.id === action.id ? { ...w, size: action.size } : w
        ),
      };
    default:
      return state;
  }
}

interface OSContextValue {
  config: Config;
  dispatch: React.Dispatch<Action>;
  getLinkById: (linkId: string) => Link | undefined;
}

const OSContext = createContext<OSContextValue | null>(null);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [config, dispatch] = useReducer(reducer, undefined, loadConfig);

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const getLinkById = (linkId: string): Link | undefined => {
    for (const cat of config.categories) {
      const link = cat.links.find((l) => l.id === linkId);
      if (link) return link;
    }
    return undefined;
  };

  return (
    <OSContext.Provider value={{ config, dispatch, getLinkById }}>
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error('useOS must be used within OSProvider');
  return ctx;
}
