import { useState } from 'react';
import styled from 'styled-components';
import { RefreshCw, Settings, X } from 'lucide-react';
import type { WidgetProps } from '../../types/widget';
import type { WeatherConfig } from './useWeather';
import { useWeather } from './useWeather';
import { weatherIcon, weatherLabel } from './weatherCode';
import WeatherConfigPanel from './WeatherConfig';
import { theme } from '../../styles/theme';

export default function WeatherWidget({ config, onUpdateConfig, onRemove }: WidgetProps<WeatherConfig>) {
  const { data, loading, error, refresh } = useWeather(config);
  const [showConfig, setShowConfig] = useState(config.lat === null);

  const needsSetup = config.lat === null;

  return (
    <Shell>
      <Header>
        <HeaderTitle>{data?.cityLabel || config.cityLabel || 'Weather'}</HeaderTitle>
        <HeaderActions>
          {!needsSetup && (
            <ActionBtn onClick={refresh} title="Refresh">
              <RefreshCw size={12} className={loading ? 'spin' : ''} />
            </ActionBtn>
          )}
          <ActionBtn onClick={() => setShowConfig((v) => !v)} title="Settings">
            <Settings size={12} />
          </ActionBtn>
          <ActionBtn onClick={onRemove} title="Remove">
            <X size={12} />
          </ActionBtn>
        </HeaderActions>
      </Header>

      {showConfig && (
        <ConfigArea>
          <WeatherConfigPanel config={config} onUpdateConfig={(patch) => { onUpdateConfig(patch); if (patch.lat !== undefined) setShowConfig(false); }} />
        </ConfigArea>
      )}

      {!showConfig && (
        <>
          {needsSetup && (
            <Setup>Tap ⚙️ to set a location</Setup>
          )}
          {error && <ErrorText>{error}</ErrorText>}
          {loading && !data && <LoadingText>Loading...</LoadingText>}
          {data && (
            <Body>
              <WeatherIcon>{weatherIcon(data.weatherCode, data.isDay)}</WeatherIcon>
              <TempRow>
                <Temp>{data.temperature}{data.temperatureUnit}</Temp>
                <Condition>{weatherLabel(data.weatherCode)}</Condition>
              </TempRow>
              <Wind>💨 {data.windSpeed} {data.windUnit}</Wind>
              <UpdatedAt>Updated {data.updatedAt.replace('T', ' ')}</UpdatedAt>
            </Body>
          )}
        </>
      )}
    </Shell>
  );
}

const Shell = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  border-radius: inherit;
  overflow: hidden;
  color: ${theme.colors.text};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
`;

const HeaderTitle = styled.span`
  font-size: ${theme.font.size.sm};
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 2px;
  flex-shrink: 0;
`;

const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.textMuted};
  transition: color 0.15s, background 0.15s;
  &:hover { color: ${theme.colors.text}; background: ${theme.colors.border}; }

  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const ConfigArea = styled.div`
  padding: 10px;
  flex: 1;
  overflow-y: auto;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  gap: 4px;
`;

const WeatherIcon = styled.div`
  font-size: 48px;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
`;

const TempRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Temp = styled.div`
  font-size: 36px;
  font-weight: 700;
  line-height: 1.1;
`;

const Condition = styled.div`
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.textMuted};
`;

const Wind = styled.div`
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.textMuted};
  margin-top: 4px;
`;

const UpdatedAt = styled.div`
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.textMuted};
  margin-top: 4px;
  opacity: 0.6;
`;

const Setup = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.textMuted};
  padding: 16px;
  text-align: center;
`;

const LoadingText = styled(Setup)``;
const ErrorText = styled(Setup)`
  color: ${theme.colors.danger};
`;
