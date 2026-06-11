import type { WidgetDefinition } from '../../types/widget';
import type { HomeWeatherConfig } from './useHomeWeather';
import HomeWeatherWidget from './HomeWeatherWidget';
import HomeWeatherConfigPanel from './HomeWeatherConfig';

const homeWeatherDefinition: WidgetDefinition<HomeWeatherConfig> = {
  type: 'homeweather',
  label: 'Home Station',
  icon: '🏠',
  defaultConfig: {
    influxUrl: 'https://us-east-1-1.aws.cloud2.influxdata.com',
    token: '',
    org: '',
    bucket: '',
    refreshMinutes: 5,
  },
  defaultSize: { width: 200, height: 200 },
  minSize: { width: 160, height: 160 },
  component: HomeWeatherWidget,
  configPanel: HomeWeatherConfigPanel,
};

export default homeWeatherDefinition as unknown as WidgetDefinition;
