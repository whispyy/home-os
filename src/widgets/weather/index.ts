import type { WidgetDefinition } from '../../types/widget';
import type { WeatherConfig } from './useWeather';
import WeatherWidget from './WeatherWidget';
import WeatherConfigPanel from './WeatherConfig';

const weatherDefinition: WidgetDefinition<WeatherConfig> = {
  type: 'weather',
  label: 'Weather',
  icon: '🌤️',
  defaultConfig: {
    lat: null,
    lon: null,
    cityLabel: '',
    unit: 'celsius',
    refreshMinutes: 10,
  },
  defaultSize: { width: 200, height: 240 },
  minSize: { width: 160, height: 200 },
  component: WeatherWidget,
  configPanel: WeatherConfigPanel,
};

export default weatherDefinition as unknown as WidgetDefinition;
