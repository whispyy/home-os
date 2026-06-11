import { useState, useEffect, useRef } from 'react';

export interface WeatherData {
  temperature: number;
  temperatureUnit: string;
  weatherCode: number;
  windSpeed: number;
  windUnit: string;
  isDay: boolean;
  cityLabel: string;
  updatedAt: string;
}

export interface WeatherConfig {
  lat: number | null;
  lon: number | null;
  cityLabel: string;
  unit: 'celsius' | 'fahrenheit';
  refreshMinutes: number;
}

export type GeoResult = { name: string; lat: number; lon: number; country: string };

export async function searchCity(query: string): Promise<GeoResult[]> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );
  const json = await res.json();
  return (json.results ?? []).map((r: { name: string; latitude: number; longitude: number; country: string }) => ({
    name: r.name,
    lat: r.latitude,
    lon: r.longitude,
    country: r.country,
  }));
}

async function fetchWeather(lat: number, lon: number, unit: 'celsius' | 'fahrenheit'): Promise<WeatherData | null> {
  const tempUnit = unit === 'celsius' ? 'celsius' : 'fahrenheit';
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m,is_day` +
    `&temperature_unit=${tempUnit}&wind_speed_unit=kmh`
  );
  if (!res.ok) return null;
  const json = await res.json();
  return {
    temperature: Math.round(json.current.temperature_2m),
    temperatureUnit: json.current_units.temperature_2m,
    weatherCode: json.current.weather_code,
    windSpeed: Math.round(json.current.wind_speed_10m),
    windUnit: json.current_units.wind_speed_10m,
    isDay: json.current.is_day === 1,
    cityLabel: '',
    updatedAt: json.current.time,
  };
}

export function useWeather(config: WeatherConfig) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function load() {
    if (config.lat === null || config.lon === null) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWeather(config.lat, config.lon, config.unit);
      if (result) {
        setData({ ...result, cityLabel: config.cityLabel });
      }
    } catch {
      setError('Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(load, config.refreshMinutes * 60 * 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [config.lat, config.lon, config.unit, config.refreshMinutes]);

  return { data, loading, error, refresh: load };
}
