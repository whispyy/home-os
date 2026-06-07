export type WindowState = 'open' | 'minimized' | 'maximized';

export interface WindowInstance {
  id: string;
  linkId: string;
  title: string;
  url: string;
  icon?: string;
  state: WindowState;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}
