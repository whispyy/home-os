import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Menu, Settings, RefreshCw } from 'lucide-react';
import { useWindows } from '../../context/WindowContext';
import { useOS } from '../../context/OSContext';
import { usePWAUpdate } from '../../hooks/usePWAUpdate';
import { theme } from '../../styles/theme';

interface Props {
  onStartMenu: (e: React.MouseEvent) => void;
  onSettings: () => void;
  startMenuOpen: boolean;
}

export default function Taskbar({ onStartMenu, onSettings, startMenuOpen }: Props) {
  const { windows, restoreWindow, focusWindow } = useWindows();
  const { config } = useOS();
  const { needsUpdate, applyUpdate } = usePWAUpdate();
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  function handleTabClick(id: string, state: string) {
    if (state === 'minimized') {
      restoreWindow(id);
    } else {
      focusWindow(id);
    }
  }

  return (
    <Bar style={{ background: config.taskbarColor }}>
      <StartBtn $active={startMenuOpen} onClick={(e) => { e.stopPropagation(); onStartMenu(e); }}>
        <Menu size={16} />
        <span>Start</span>
      </StartBtn>

      <Separator />

      <WindowTabs>
        {windows.map((win) => (
          <WindowTab
            key={win.id}
            $minimized={win.state === 'minimized'}
            onClick={() => handleTabClick(win.id, win.state)}
          >
            <TabIcon>{win.icon ?? '🔗'}</TabIcon>
            <TabLabel>{win.title}</TabLabel>
          </WindowTab>
        ))}
      </WindowTabs>

      <RightArea>
        {needsUpdate && (
          <UpdateBtn onClick={applyUpdate} title="Update available">
            <RefreshCw size={15} />
          </UpdateBtn>
        )}
        <SettingsBtn onClick={onSettings}>
          <Settings size={15} />
        </SettingsBtn>
        <Clock>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Clock>
      </RightArea>
    </Bar>
  );
}

const Bar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${theme.taskbarHeight};
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  border-top: 1px solid ${theme.colors.border};
  z-index: 900;
  backdrop-filter: blur(12px);
`;

const StartBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${theme.radius.md};
  font-size: ${theme.font.size.sm};
  font-weight: 600;
  background: ${(p) => (p.$active ? theme.colors.accent : 'transparent')};
  color: ${(p) => (p.$active ? '#fff' : theme.colors.text)};
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;

  &:hover {
    background: ${(p) => (p.$active ? theme.colors.accentHover : theme.colors.surfaceHover)};
  }
`;

const Separator = styled.div`
  width: 1px;
  height: 24px;
  background: ${theme.colors.border};
  flex-shrink: 0;
`;

const WindowTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  overflow: hidden;
`;

const WindowTab = styled.button<{ $minimized: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: ${theme.radius.sm};
  font-size: ${theme.font.size.sm};
  max-width: 180px;
  opacity: ${(p) => (p.$minimized ? 0.5 : 1)};
  background: ${theme.colors.surfaceHover};
  border-bottom: 2px solid ${(p) => (p.$minimized ? 'transparent' : theme.colors.accent)};
  transition: opacity 0.15s, background 0.15s;

  &:hover {
    background: ${theme.colors.border};
  }
`;

const TabIcon = styled.span`
  font-size: 13px;
  flex-shrink: 0;
`;

const TabLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${theme.colors.text};
`;

const RightArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const UpdateBtn = styled.button`
  display: flex;
  align-items: center;
  padding: 6px;
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.accent};
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${theme.colors.accentHover};
    background: ${theme.colors.surfaceHover};
  }
`;

const SettingsBtn = styled.button`
  display: flex;
  align-items: center;
  padding: 6px;
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.textMuted};
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${theme.colors.text};
    background: ${theme.colors.surfaceHover};
  }
`;

const Clock = styled.div`
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.text};
  min-width: 48px;
  text-align: right;
`;
