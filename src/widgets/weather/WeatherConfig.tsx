import { useState } from 'react';
import styled from 'styled-components';
import { Search, Loader, MapPin } from 'lucide-react';
import type { WidgetConfigProps } from '../../types/widget';
import type { WeatherConfig, GeoResult } from './useWeather';
import { searchCity } from './useWeather';
import { theme } from '../../styles/theme';

export default function WeatherConfigPanel({ config, onUpdateConfig }: WidgetConfigProps<WeatherConfig>) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true);
    try {
      setResults(await searchCity(query));
    } finally {
      setSearching(false);
    }
  }

  function handleSelect(r: GeoResult) {
    onUpdateConfig({ lat: r.lat, lon: r.lon, cityLabel: `${r.name}, ${r.country}` });
    setResults([]);
    setQuery('');
  }

  function handleGeolocate() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onUpdateConfig({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          cityLabel: 'My location',
        });
        setLocating(false);
      },
      () => setLocating(false)
    );
  }

  return (
    <Wrap>
      <Row>
        <Input
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <IconBtn onClick={handleSearch} disabled={searching}>
          {searching ? <Loader size={14} className="spin" /> : <Search size={14} />}
        </IconBtn>
        <IconBtn onClick={handleGeolocate} disabled={locating} title="Use my location">
          {locating ? <Loader size={14} className="spin" /> : <MapPin size={14} />}
        </IconBtn>
      </Row>

      {results.length > 0 && (
        <Results>
          {results.map((r, i) => (
            <ResultItem key={i} onClick={() => handleSelect(r)}>
              {r.name}, {r.country}
            </ResultItem>
          ))}
        </Results>
      )}

      {config.lat !== null && (
        <Current>📍 {config.cityLabel}</Current>
      )}

      <Row style={{ marginTop: 8 }}>
        <Label>Unit</Label>
        <Select
          value={config.unit}
          onChange={(e) => onUpdateConfig({ unit: e.target.value as 'celsius' | 'fahrenheit' })}
        >
          <option value="celsius">°C</option>
          <option value="fahrenheit">°F</option>
        </Select>
      </Row>

      <Row>
        <Label>Refresh</Label>
        <Select
          value={config.refreshMinutes}
          onChange={(e) => onUpdateConfig({ refreshMinutes: Number(e.target.value) })}
        >
          <option value={5}>5 min</option>
          <option value={10}>10 min</option>
          <option value={30}>30 min</option>
          <option value={60}>1 hour</option>
        </Select>
      </Row>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Label = styled.span`
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.textMuted};
  width: 48px;
  flex-shrink: 0;
`;

const Input = styled.input`
  flex: 1;
  background: ${theme.colors.bg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  padding: 5px 8px;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.text};
  outline: none;
  &:focus { border-color: ${theme.colors.accent}; }
`;

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.surfaceHover};
  color: ${theme.colors.text};
  flex-shrink: 0;
  &:hover { background: ${theme.colors.accent}; }
  &:disabled { opacity: 0.5; }

  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const Results = styled.div`
  background: ${theme.colors.bg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  overflow: hidden;
`;

const ResultItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 6px 10px;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.text};
  &:hover { background: ${theme.colors.surfaceHover}; }
`;

const Current = styled.div`
  font-size: ${theme.font.size.xs};
  color: ${theme.colors.textMuted};
`;

const Select = styled.select`
  flex: 1;
  background: ${theme.colors.bg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  padding: 5px 8px;
  font-size: ${theme.font.size.sm};
  color: ${theme.colors.text};
  outline: none;
`;
