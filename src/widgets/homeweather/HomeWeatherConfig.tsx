import styled from 'styled-components';
import type { WidgetConfigProps } from '../../types/widget';
import type { HomeWeatherConfig } from './useHomeWeather';
import { theme } from '../../styles/theme';

export default function HomeWeatherConfigPanel({ config, onUpdateConfig }: WidgetConfigProps<HomeWeatherConfig>) {
  return (
    <Wrap>
      <Field>
        <Label>InfluxDB URL</Label>
        <Input
          value={config.influxUrl}
          onChange={(e) => onUpdateConfig({ influxUrl: e.target.value })}
          placeholder="https://us-east-1-1.aws.cloud2.influxdata.com"
        />
      </Field>
      <Field>
        <Label>Token</Label>
        <Input
          type="password"
          value={config.token}
          onChange={(e) => onUpdateConfig({ token: e.target.value })}
          placeholder="InfluxDB API token"
        />
      </Field>
      <Field>
        <Label>Org</Label>
        <Input
          value={config.org}
          onChange={(e) => onUpdateConfig({ org: e.target.value })}
          placeholder="your-org"
        />
      </Field>
      <Field>
        <Label>Bucket</Label>
        <Input
          value={config.bucket}
          onChange={(e) => onUpdateConfig({ bucket: e.target.value })}
          placeholder="your-bucket"
        />
      </Field>
      <Field>
        <Label>Refresh</Label>
        <Select
          value={config.refreshMinutes}
          onChange={(e) => onUpdateConfig({ refreshMinutes: Number(e.target.value) })}
        >
          <option value={1}>1 min</option>
          <option value={5}>5 min</option>
          <option value={10}>10 min</option>
          <option value={30}>30 min</option>
        </Select>
      </Field>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const Label = styled.label`
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.textMuted};
`;

const Input = styled.input`
  background: ${theme.colors.bg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  padding: 5px 8px;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.text};
  outline: none;
  width: 100%;
  &:focus { border-color: ${theme.colors.accent}; }
`;

const Select = styled.select`
  background: ${theme.colors.bg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  padding: 5px 8px;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.text};
  outline: none;
  width: 100%;
`;
