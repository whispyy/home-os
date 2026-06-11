import { useState, useEffect, useRef } from 'react';

export interface HomeWeatherConfig {
  influxUrl: string;
  token: string;
  org: string;
  bucket: string;
  refreshMinutes: number;
}

export interface HomeWeatherData {
  temperature: number;
  humidity: number;
  updatedAt: string; // ISO time string from InfluxDB
}

async function fetchHomeWeather(config: HomeWeatherConfig): Promise<HomeWeatherData> {
  const res = await fetch(`${config.influxUrl}/api/v2/query`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${config.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/csv',
    },
    body: JSON.stringify({
      org: config.org,
      query: `
        from(bucket: "${config.bucket}")
          |> range(start: -2h)
          |> filter(fn: (r) => r._measurement == "environment")
          |> last()
      `,
    }),
  });

  if (!res.ok) throw new Error(`InfluxDB error: ${res.status}`);

  const csvData = await res.text();
  const rows = csvData.trim().split('\n');
  const headers = rows[0].split(',');

  const fieldIndex = headers.indexOf('_field');
  const valueIndex = headers.indexOf('_value');
  const timeIndex = headers.indexOf('_time');

  let temperature = 0;
  let humidity = 0;
  let updatedAt = '';

  for (let i = 1; i < rows.length; i++) {
    const columns = rows[i].split(',');
    const field = columns[fieldIndex];
    const value = parseFloat(columns[valueIndex]);
    const time = columns[timeIndex];

    if (field === 'temperature') {
      temperature = value;
      updatedAt = time;
    } else if (field === 'humidity') {
      humidity = value;
    }
  }

  return { temperature, humidity, updatedAt };
}

function isConfigured(config: HomeWeatherConfig) {
  return config.token.trim() !== '' && config.org.trim() !== '' && config.bucket.trim() !== '';
}

export function useHomeWeather(config: HomeWeatherConfig) {
  const [data, setData] = useState<HomeWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function load() {
    if (!isConfigured(config)) return;
    setLoading(true);
    setError(null);
    try {
      setData(await fetchHomeWeather(config));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
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
  }, [config.token, config.org, config.bucket, config.influxUrl, config.refreshMinutes]);

  return { data, loading, error, refresh: load };
}
