import { useState } from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { useOS } from '../../context/OSContext';
import { useWindows } from '../../context/WindowContext';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import WindowFrame from './WindowFrame';
import Shortcut, { DND_TYPE } from './Shortcut';
import SettingsPanel from '../shared/SettingsPanel';

export default function Desktop() {
  const { config, dispatch } = useOS();
  const { windows } = useWindows();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  return (
    <DesktopWrapper
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      style={{ background: config.wallpaper }}
      onClick={() => setStartMenuOpen(false)}
    >
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
