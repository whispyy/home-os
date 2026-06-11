import { useState } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';
import { useOS } from '../context/OSContext';
import { widgetRegistry } from './registry';
import type { WidgetInstance } from '../types/widget';

interface Props {
  widget: WidgetInstance;
  zIndex: number;
}

export default function WidgetContainer({ widget, zIndex }: Props) {
  const { dispatch } = useOS();
  const [pos, setPos] = useState(widget.position);
  const [size, setSize] = useState(widget.size);

  const def = widgetRegistry[widget.type];
  if (!def) return null;

  const Component = def.component;

  function handleUpdateConfig(patch: Record<string, unknown>) {
    dispatch({ type: 'UPDATE_WIDGET_CONFIG', id: widget.id, config: patch });
  }

  function handleRemove() {
    dispatch({ type: 'REMOVE_WIDGET', id: widget.id });
  }

  return (
    <Rnd
      onContextMenu={(e: React.MouseEvent) => e.stopPropagation()}
      position={pos}
      size={size}
      minWidth={def.minSize?.width ?? 140}
      minHeight={def.minSize?.height ?? 120}
      style={{ zIndex }}
      onDragStop={(_: unknown, d: { x: number; y: number }) => {
        const next = { x: d.x, y: d.y };
        setPos(next);
        dispatch({ type: 'MOVE_WIDGET', id: widget.id, position: next });
      }}
      onResizeStop={(
        _e: unknown,
        _dir: unknown,
        ref: HTMLElement,
        _delta: unknown,
        newPos: { x: number; y: number }
      ) => {
        const nextSize = { width: parseInt(ref.style.width), height: parseInt(ref.style.height) };
        const nextPos = { x: newPos.x, y: newPos.y };
        setSize(nextSize);
        setPos(nextPos);
        dispatch({ type: 'RESIZE_WIDGET', id: widget.id, size: nextSize });
        dispatch({ type: 'MOVE_WIDGET', id: widget.id, position: nextPos });
      }}
    >
      <WidgetShell>
        <Component
          id={widget.id}
          config={widget.config as never}
          onUpdateConfig={handleUpdateConfig as never}
          onRemove={handleRemove}
        />
      </WidgetShell>
    </Rnd>
  );
}

const WidgetShell = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  backdrop-filter: blur(20px) saturate(140%);
  background: rgba(0, 0, 0, 0.25);
`;
