import { createContext, useContext, useReducer } from 'react';
import type { WindowInstance, WindowState } from '../types/window';
import { uuid } from '../utils/uuid';

type Action =
  | { type: 'OPEN'; linkId: string; title: string; url: string; icon?: string }
  | { type: 'CLOSE'; id: string }
  | { type: 'MINIMIZE'; id: string }
  | { type: 'MAXIMIZE'; id: string }
  | { type: 'RESTORE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'MOVE'; id: string; position: { x: number; y: number } }
  | { type: 'RESIZE'; id: string; size: { width: number; height: number } };

interface WindowsState {
  windows: WindowInstance[];
  maxZ: number;
}

const INITIAL_SIZE = { width: 900, height: 600 };

function nextPosition(count: number) {
  const offset = (count % 8) * 30;
  return { x: 80 + offset, y: 60 + offset };
}

function reducer(state: WindowsState, action: Action): WindowsState {
  switch (action.type) {
    case 'OPEN': {
      // If already open, just focus it
      const existing = state.windows.find((w) => w.linkId === action.linkId);
      if (existing) {
        return {
          ...state,
          maxZ: state.maxZ + 1,
          windows: state.windows.map((w) =>
            w.id === existing.id
              ? { ...w, state: 'open' as WindowState, zIndex: state.maxZ + 1 }
              : w
          ),
        };
      }
      const newZ = state.maxZ + 1;
      const newWindow: WindowInstance = {
        id: uuid(),
        linkId: action.linkId,
        title: action.title,
        url: action.url,
        icon: action.icon,
        state: 'open',
        position: nextPosition(state.windows.length),
        size: INITIAL_SIZE,
        zIndex: newZ,
      };
      return { windows: [...state.windows, newWindow], maxZ: newZ };
    }
    case 'CLOSE':
      return { ...state, windows: state.windows.filter((w) => w.id !== action.id) };
    case 'MINIMIZE':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, state: 'minimized' } : w
        ),
      };
    case 'MAXIMIZE':
      return {
        ...state,
        maxZ: state.maxZ + 1,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, state: 'maximized', zIndex: state.maxZ + 1 } : w
        ),
      };
    case 'RESTORE':
      return {
        ...state,
        maxZ: state.maxZ + 1,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, state: 'open', zIndex: state.maxZ + 1 } : w
        ),
      };
    case 'FOCUS':
      return {
        ...state,
        maxZ: state.maxZ + 1,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, zIndex: state.maxZ + 1 } : w
        ),
      };
    case 'MOVE':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, position: action.position } : w
        ),
      };
    case 'RESIZE':
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, size: action.size } : w
        ),
      };
    default:
      return state;
  }
}

interface WindowContextValue {
  windows: WindowInstance[];
  openWindow: (linkId: string, title: string, url: string, icon?: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, position: { x: number; y: number }) => void;
  resizeWindow: (id: string, size: { width: number; height: number }) => void;
}

const WindowContext = createContext<WindowContextValue | null>(null);

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { windows: [], maxZ: 10 });

  const value: WindowContextValue = {
    windows: state.windows,
    openWindow: (linkId, title, url, icon) =>
      dispatch({ type: 'OPEN', linkId, title, url, icon }),
    closeWindow: (id) => dispatch({ type: 'CLOSE', id }),
    minimizeWindow: (id) => dispatch({ type: 'MINIMIZE', id }),
    maximizeWindow: (id) => dispatch({ type: 'MAXIMIZE', id }),
    restoreWindow: (id) => dispatch({ type: 'RESTORE', id }),
    focusWindow: (id) => dispatch({ type: 'FOCUS', id }),
    moveWindow: (id, position) => dispatch({ type: 'MOVE', id, position }),
    resizeWindow: (id, size) => dispatch({ type: 'RESIZE', id, size }),
  };

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>;
}

export function useWindows() {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error('useWindows must be used within WindowProvider');
  return ctx;
}
