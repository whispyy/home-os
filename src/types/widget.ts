export interface WidgetInstance {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, unknown>;
}

export interface WidgetProps<TConfig = Record<string, unknown>> {
  id: string;
  config: TConfig;
  onUpdateConfig: (patch: Partial<TConfig>) => void;
  onRemove: () => void;
}

export interface WidgetConfigProps<TConfig = Record<string, unknown>> {
  config: TConfig;
  onUpdateConfig: (patch: Partial<TConfig>) => void;
}

export interface WidgetDefinition<TConfig = Record<string, unknown>> {
  type: string;
  label: string;
  icon: string;
  defaultConfig: TConfig;
  defaultSize: { width: number; height: number };
  minSize?: { width: number; height: number };
  component: React.ComponentType<WidgetProps<TConfig>>;
  configPanel?: React.ComponentType<WidgetConfigProps<TConfig>>;
}
