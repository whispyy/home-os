import type { Config } from '../types/config';
import { DEFAULT_CONFIG, DEMO_CONFIG } from '../types/config';

const STORAGE_KEY = 'home-os-config';

export function loadConfig(): Config {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEMO_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: Config): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function exportConfig(config: Config): void {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'home-os-config.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importConfig(file: File): Promise<Config> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        // Basic shape validation
        if (
          typeof parsed === 'object' &&
          Array.isArray(parsed.categories) &&
          Array.isArray(parsed.shortcuts)
        ) {
          resolve({ ...DEFAULT_CONFIG, ...parsed });
        } else {
          reject(new Error('Invalid config format'));
        }
      } catch {
        reject(new Error('Failed to parse config file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
