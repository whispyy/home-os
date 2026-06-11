export interface Link {
  id: string;
  label: string;
  url: string;
  icon?: string; // lucide icon name or emoji fallback
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  links: Link[];
}

export interface Shortcut {
  linkId: string;
  position: { x: number; y: number };
}

export interface Config {
  widgets: import('./widget').WidgetInstance[];
  wallpaper: string;
  taskbarColor: string;
  categories: Category[];
  shortcuts: Shortcut[];
}

export const DEFAULT_CONFIG: Config = {
  wallpaper: '#1a1a2e',
  taskbarColor: '#0f0f23',
  categories: [],
  shortcuts: [],
  widgets: [],
};

export const DEMO_CONFIG: Config = {
  wallpaper: '#1a1a2e',
  taskbarColor: '#0f0f23',
  categories: [
    {
      id: 'cat-dev',
      name: 'Dev Tools',
      icon: '🛠️',
      links: [
        { id: 'link-github',  label: 'GitHub',      url: 'https://github.com',      icon: '🐙' },
        { id: 'link-gitlab',  label: 'GitLab',      url: 'https://gitlab.com',      icon: '🦊' },
        { id: 'link-vscode',  label: 'VS Code Web', url: 'https://vscode.dev',      icon: '💻' },
        { id: 'link-codepen', label: 'CodePen',     url: 'https://codepen.io',      icon: '🖊️' },
      ],
    },
    {
      id: 'cat-infra',
      name: 'Infrastructure',
      icon: '⚙️',
      links: [
        { id: 'link-grafana',   label: 'Grafana',        url: 'https://play.grafana.org',   icon: '📊' },
        { id: 'link-portainer', label: 'Portainer Demo', url: 'https://demo.portainer.io',  icon: '🐳' },
      ],
    },
    {
      id: 'cat-productivity',
      name: 'Productivity',
      icon: '📋',
      links: [
        { id: 'link-notion', label: 'Notion',  url: 'https://notion.so',     icon: '📝' },
        { id: 'link-linear', label: 'Linear',  url: 'https://linear.app',    icon: '📐' },
        { id: 'link-figma',  label: 'Figma',   url: 'https://figma.com',     icon: '🎨' },
        { id: 'link-cal',    label: 'Cal.com', url: 'https://cal.com',       icon: '📅' },
      ],
    },
    {
      id: 'cat-media',
      name: 'Media',
      icon: '🎬',
      links: [
        { id: 'link-yt',      label: 'YouTube', url: 'https://youtube.com',        icon: '▶️' },
        { id: 'link-spotify', label: 'Spotify', url: 'https://open.spotify.com',   icon: '🎵' },
      ],
    },
  ],
  shortcuts: [
    { linkId: 'link-github',  position: { x: 24, y: 24  } },
    { linkId: 'link-grafana', position: { x: 24, y: 120 } },
    { linkId: 'link-notion',  position: { x: 24, y: 216 } },
  ],
  widgets: [],
};
