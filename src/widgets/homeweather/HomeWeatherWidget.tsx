import { useState } from 'react';
import styled from 'styled-components';
import { RefreshCw, Settings, X, Thermometer, Droplets } from 'lucide-react';
import type { WidgetProps } from '../../types/widget';
import type { HomeWeatherConfig } from './useHomeWeather';
import { useHomeWeather } from './useHomeWeather';
import HomeWeatherConfigPanel from './HomeWeatherConfig';
import { theme } from '../../styles/theme';

export default function HomeWeatherWidget({ config, onUpdateConfig, onRemove }: WidgetProps<HomeWeatherConfig>) {
  const needsSetup = !config.token || !config.org || !config.bucket;
  const [showConfig, setShowConfig] = useState(needsSetup);
  const { data, loading, error, refresh } = useHomeWeather(config);

  return (
    <Shell>
      <Header>
        <HeaderTitle>🏠 Home Station</HeaderTitle>
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

      {showConfig ? (
        <ConfigArea>
          <HomeWeatherConfigPanel
            config={config}
            onUpdateConfig={(patch) => {
              onUpdateConfig(patch);
              // Close config if all required fields are now filled
              const merged = { ...config, ...patch };
              if (merged.token && merged.org && merged.bucket) setShowConfig(false);
            }}
          />
        </ConfigArea>
      ) : (
        <Body>
          {needsSetup && <Setup>Tap ⚙️ to configure your InfluxDB connection</Setup>}
          {error && <ErrorText>{error}</ErrorText>}
          {loading && !data && <Muted>Loading...</Muted>}
          {data && (
            <>
              <Reading>
                <Thermometer size={20} color={theme.colors.accent} />
                <Value>{data.temperature.toFixed(1)}°C</Value>
              </Reading>
              <Reading>
                <Droplets size={20} color="#5bc4f5" />
                <Value>{data.humidity.toFixed(1)}%</Value>
              </Reading>
              <UpdatedAt>
                {new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </UpdatedAt>
            </>
          )}
        </Body>
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
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 2px;
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
  gap: 8px;
  padding: 12px;
`;

const Reading = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Value = styled.span`
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
`;

const UpdatedAt = styled.div`
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.textMuted};
  opacity: 0.7;
  margin-top: 4px;
`;

const Setup = styled.div`
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.textMuted};
  text-align: center;
  padding: 8px;
`;

const Muted = styled(Setup)``;

const ErrorText = styled.div`
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.danger};
  text-align: center;
  padding: 8px;
`;
