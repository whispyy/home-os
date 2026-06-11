import { useState } from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { useOS } from '../../context/OSContext';
import { useWindows } from '../../context/WindowContext';
import { widgetRegistry } from '../../widgets/registry';
import WidgetContainer from '../../widgets/WidgetContainer';
import { Settings } from 'lucide-react';
import { theme } from '../../styles/theme';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import WindowFrame from './WindowFrame';
import Shortcut, { DND_TYPE } from './Shortcut';
import SettingsPanel from '../shared/SettingsPanel';

const WIDGET_BASE_Z = 50;

export default function Desktop() {
  const { config, dispatch } = useOS();
  const { windows } = useWindows();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);

  const [, dropRef] = useDrop({
    accept: DND_TYPE,
    drop: (item: { linkId: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        dispatch({
          type: 'MOVE_SHORTCUT',
          linkId: item.linkId,
          position: { x: offset.x - 36, y: offset.y - 36 },
        });
      }
    },
  });

  function handleDesktopContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  }

  function addWidget(type: string) {
    if (!ctxMenu) return;
    dispatch({
      type: 'ADD_WIDGET',
      widgetType: type,
      position: { x: ctxMenu.x, y: ctxMenu.y },
    });
    setCtxMenu(null);
  }

  return (
    <DesktopWrapper
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      style={{ background: config.wallpaper }}
      onClick={() => { setStartMenuOpen(false); setCtxMenu(null); }}
      onContextMenu={handleDesktopContextMenu}
    >
      {/* Widgets — below windows */}
      {(config.widgets ?? []).map((w, i) => (
        <WidgetContainer key={w.id} widget={w} zIndex={WIDGET_BASE_Z + i} />
      ))}

      {config.shortcuts.map((s) => (
        <Shortcut key={s.linkId} shortcut={s} />
      ))}

      {windows.map((win) => (
        <WindowFrame key={win.id} window={win} />
      ))}

      {startMenuOpen && (
        <StartMenu onClose={() => setStartMenuOpen(false)} />
      )}

      {settingsOpen && (
        <SettingsPanel onClose={() => setSettingsOpen(false)} />
      )}

      {/* Desktop right-click menu */}
      {ctxMenu && (
        <>
          <CtxOverlay onClick={() => setCtxMenu(null)} />
          <CtxMenu style={{ left: ctxMenu.x, top: ctxMenu.y }}>
            <CtxItem onClick={() => { setSettingsOpen(true); setCtxMenu(null); }}>
              <Settings size={14} />
              Settings
            </CtxItem>
            <CtxDivider />
            <CtxLabel>Add widget</CtxLabel>
            {Object.values(widgetRegistry).map((def) => (
              <CtxItem key={def.type} onClick={() => addWidget(def.type)}>
                <span>{def.icon}</span>
                {def.label}
              </CtxItem>
            ))}
          </CtxMenu>
        </>
      )}

      <Taskbar
        startMenuOpen={startMenuOpen}
        onStartMenu={() => setStartMenuOpen((v) => !v)}
        onSettings={() => setSettingsOpen(true)}
      />
    </DesktopWrapper>
  );
}

const DesktopWrapper = styled.div`
  position: fixed;
  inset: 0;
  overflow: hidden;
  transition: background 0.3s;
`;

const CtxOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 800;
`;

const CtxMenu = styled.div`
  position: fixed;
  z-index: 801;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.menu};
  padding: 4px;
  min-width: 180px;
`;

const CtxLabel = styled.div`
  padding: 4px 10px 2px;
  font-size: ${theme.font.size.xs};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${theme.colors.textMuted};
`;

const CtxDivider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border};
  margin: 4px 0;
`;

const CtxItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: ${theme.radius.sm};
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.text};
  transition: background 0.1s;
  &:hover { background: ${theme.colors.surfaceHover}; }
`;
