import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePWAUpdate() {
  const {
    needRefresh: [needsUpdate],
    updateServiceWorker,
  } = useRegisterSW();

  return {
    needsUpdate,
    applyUpdate: () => updateServiceWorker(true),
  };
}
