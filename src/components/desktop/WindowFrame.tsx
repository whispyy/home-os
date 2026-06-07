import { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';
import { X, Minus, Square, ExternalLink, AlertTriangle } from 'lucide-react';
import type { WindowInstance } from '../../types/window';
import { useWindows } from '../../context/WindowContext';
import { theme } from '../../styles/theme';

const TASKBAR_H = parseInt(theme.taskbarHeight); // 48

interface Props {
  window: WindowInstance;
}

export default function WindowFrame({ window: win }: Props) {
  const {
    closeWindow, minimizeWindow, maximizeWindow,
    restoreWindow, focusWindow, moveWindow, resizeWindow,
  } = useWindows();

  const [iframeBlocked, setIframeBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Local pos/size so re-renders from context (e.g. zIndex change) don't
  // reset the Rnd position mid-drag.
  const [pos, setPos] = useState(win.position);
  const [size, setSize] = useState(win.size);

  // Save pre-maximize geometry so we can restore it exactly.
  const savedBeforeMax = useRef<{ pos: typeof pos; size: typeof size } | null>(null);

  useEffect(() => {
    if (win.state === 'maximized') {
      if (!savedBeforeMax.current) {
        savedBeforeMax.current = { pos, size };
      }
    } else if (savedBeforeMax.current) {
      setPos(savedBeforeMax.current.pos);
      setSize(savedBeforeMax.current.size);
      savedBeforeMax.current = null;
    }
  }, [win.state]);

  const isMin = win.state === 'minimized';
  const isMax = win.state === 'maximized';

  const rndPosition = isMax ? { x: 0, y: 0 } : pos;
  const rndSize = isMax
    ? { width: window.innerWidth, height: window.innerHeight - TASKBAR_H }
    : size;

  return (
    <Rnd
      position={rndPosition}
      size={rndSize}
      minWidth={320}
      minHeight={240}
      dragHandleClassName="window-titlebar"
      disableDragging={isMax || isMin}
      enableResizing={!isMax && !isMin}
      style={{ zIndex: win.zIndex, display: isMin ? 'none' : undefined }}
      onMouseDown={() => !isMin && focusWindow(win.id)}
      onDragStop={(_: unknown, d: { x: number; y: number }) => {
        setPos({ x: d.x, y: d.y });
        moveWindow(win.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(
        _e: unknown,
        _dir: unknown,
        ref: HTMLElement,
        _delta: unknown,
        newPos: { x: number; y: number }
      ) => {
        const newSize = { width: parseInt(ref.style.width), height: parseInt(ref.style.height) };
        setSize(newSize);
        setPos(newPos);
        resizeWindow(win.id, newSize);
        moveWindow(win.id, newPos);
      }}
    >
      <WindowShell $isMax={isMax}>
        <TitleBar className={isMax ? undefined : 'window-titlebar'}>
          <TitleBarButtons>
            <TitleBtn $color={theme.colors.titleBarBtn.close} onClick={() => closeWindow(win.id)}>
              <X size={8} />
            </TitleBtn>
            <TitleBtn $color={theme.colors.titleBarBtn.minimize} onClick={() => minimizeWindow(win.id)}>
              <Minus size={8} />
            </TitleBtn>
            <TitleBtn
              $color={theme.colors.titleBarBtn.maximize}
              onClick={() => (isMax ? restoreWindow(win.id) : maximizeWindow(win.id))}
            >
              <Square size={8} />
            </TitleBtn>
          </TitleBarButtons>
          <TitleLabel>{win.title}</TitleLabel>
          <TitleActions>
            <OpenExternalBtn onClick={() => globalThis.open(win.url, '_blank')} title="Open in new tab">
              <ExternalLink size={12} />
            </OpenExternalBtn>
          </TitleActions>
        </TitleBar>

        <WindowContent>
          {iframeBlocked ? (
            <BlockedScreen>
              <AlertTriangle size={32} color={theme.colors.textMuted} />
              <BlockedTitle>Cannot embed this page</BlockedTitle>
              <BlockedDesc>
                This site restricts embedding via iframe. You can open it in a new tab instead.
              </BlockedDesc>
              <OpenBtn onClick={() => globalThis.open(win.url, '_blank')}>
                <ExternalLink size={14} />
                Open in new tab
              </OpenBtn>
            </BlockedScreen>
          ) : (
            <IFrame
              ref={iframeRef}
              src={win.url}
              title={win.title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onError={() => setIframeBlocked(true)}
            />
          )}
        </WindowContent>
      </WindowShell>
    </Rnd>
  );
}

const WindowShell = styled.div<{ $isMax: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.windowChrome};
  border: 1px solid ${theme.colors.windowBorder};
  border-radius: ${(p) => (p.$isMax ? '0' : theme.radius.lg)};
  box-shadow: ${theme.shadow.window};
  overflow: hidden;
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 36px;
  background: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
  flex-shrink: 0;
  user-select: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const TitleBarButtons = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

const TitleBtn = styled.button<{ $color: string }>`
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.6);
  opacity: 0.9;
  transition: opacity 0.15s;

  svg {
    opacity: 0;
    transition: opacity 0.15s;
  }

  &:hover {
    opacity: 1;
    svg { opacity: 1; }
  }
`;

const TitleLabel = styled.span`
  flex: 1;
  text-align: center;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TitleActions = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`;

const OpenExternalBtn = styled.button`
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.textMuted};
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${theme.colors.text};
    background: ${theme.colors.border};
  }
`;

const WindowContent = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const IFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: #fff;
`;

const BlockedScreen = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px;
  background: ${theme.colors.surface};
  text-align: center;
`;

const BlockedTitle = styled.h3`
  font-size: ${theme.font.size.lg};
  color: ${theme.colors.text};
`;

const BlockedDesc = styled.p`
  font-size: ${theme.font.size.md};
  color: ${theme.colors.textMuted};
  max-width: 320px;
  line-height: 1.5;
`;

const OpenBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${theme.colors.accent};
  color: #fff;
  border-radius: ${theme.radius.md};
  font-size: ${theme.font.size.md};
  transition: background 0.15s;
  margin-top: 4px;

  &:hover {
    background: ${theme.colors.accentHover};
  }
`;
