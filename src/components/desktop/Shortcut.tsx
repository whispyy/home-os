import { useState } from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { Trash2, ExternalLink } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { useWindows } from '../../context/WindowContext';
import type { Shortcut as ShortcutType } from '../../types/config';
import { theme } from '../../styles/theme';

interface Props {
  shortcut: ShortcutType;
}

export const DND_TYPE = 'SHORTCUT';

export default function Shortcut({ shortcut }: Props) {
  const { dispatch, getLinkById } = useOS();
  const { openWindow } = useWindows();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const link = getLinkById(shortcut.linkId);
  if (!link) return null;

  const [, dragRef] = useDrag({
    type: DND_TYPE,
    item: { linkId: shortcut.linkId },
  });

  function handleDoubleClick() {
    openWindow(link!.id, link!.label, link!.url, link!.icon);
  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }

  return (
    <>
      <ShortcutWrapper
        ref={dragRef as unknown as React.Ref<HTMLDivElement>}
        style={{ left: shortcut.position.x, top: shortcut.position.y }}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <ShortcutIcon>{link.icon ?? '🔗'}</ShortcutIcon>
        <ShortcutLabel>{link.label}</ShortcutLabel>
      </ShortcutWrapper>

      {contextMenu && (
        <>
          <ContextOverlay onClick={() => setContextMenu(null)} />
          <ContextMenu style={{ left: contextMenu.x, top: contextMenu.y }}>
            <ContextItem
              onClick={() => {
                openWindow(link.id, link.label, link.url, link.icon);
                setContextMenu(null);
              }}
            >
              <ExternalLink size={13} />
              Open
            </ContextItem>
            <ContextDivider />
            <ContextItem
              danger
              onClick={() => {
                dispatch({ type: 'REMOVE_SHORTCUT', linkId: shortcut.linkId });
                setContextMenu(null);
              }}
            >
              <Trash2 size={13} />
              Remove shortcut
            </ContextItem>
          </ContextMenu>
        </>
      )}
    </>
  );
}

const ShortcutWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 72px;
  padding: 6px;
  border-radius: ${theme.radius.md};
  cursor: pointer;
  user-select: none;
  transition: background 0.1s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ShortcutIcon = styled.div`
  font-size: 28px;
  line-height: 1;
  filter: drop-shadow(${theme.shadow.icon});
`;

const ShortcutLabel = styled.span`
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.text};
  text-align: center;
  word-break: break-word;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  line-height: 1.3;
`;

const ContextOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
`;

const ContextMenu = styled.div`
  position: fixed;
  z-index: 2001;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.menu};
  padding: 4px;
  min-width: 160px;
`;

const ContextItem = styled.button<{ danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: ${theme.radius.sm};
  font-size: ${theme.font.size.sm};
  color: ${(p) => (p.danger ? theme.colors.danger : theme.colors.text)};
  transition: background 0.1s;

  &:hover {
    background: ${(p) => (p.danger ? 'rgba(224,92,92,0.1)' : theme.colors.surfaceHover)};
  }
`;

const ContextDivider = styled.div`
  height: 1px;
  background: ${theme.colors.border};
  margin: 4px 0;
`;
