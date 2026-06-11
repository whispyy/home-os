import type { WidgetDefinition } from '../types/widget';
import weatherDefinition from './weather';
import homeWeatherDefinition from './homeweather';

// Register all widget types here
const definitions: WidgetDefinition[] = [
  weatherDefinition,
  homeWeatherDefinition,
];

export const widgetRegistry: Record<string, WidgetDefinition> = Object.fromEntries(
  definitions.map((d) => [d.type, d])
);
