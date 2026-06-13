import styled from 'styled-components';
import { useOS } from '../../context/OSContext';
import { widgetRegistry } from '../../widgets/registry';

export default function MobileWidgetStrip() {
  const { config, dispatch } = useOS();
  const widgets = config.widgets ?? [];

  if (widgets.length === 0) return null;

  return (
    <Strip>
      {widgets.map((widget) => {
        const def = widgetRegistry[widget.type];
        if (!def) return null;
        const Component = def.component;
        return (
          <WidgetCard key={widget.id}>
            <Component
              id={widget.id}
              config={widget.config as never}
              onUpdateConfig={(patch: Record<string, unknown>) =>
                dispatch({ type: 'UPDATE_WIDGET_CONFIG', id: widget.id, config: patch })
              }
              onRemove={() => dispatch({ type: 'REMOVE_WIDGET', id: widget.id })}
            />
          </WidgetCard>
        );
      })}
    </Strip>
  );
}

const Strip = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px 16px;
`;

const WidgetCard = styled.div`
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  backdrop-filter: blur(20px) saturate(140%);
  background: rgba(0, 0, 0, 0.25);
  min-height: 120px;
`;
