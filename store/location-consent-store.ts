import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import Storage from 'expo-sqlite/kv-store';

type LocationConsentStore = {
  visible: boolean;
  hasConsented: boolean;
  resolve: ((consented: boolean) => void) | null;
  show: () => Promise<boolean>;
  respond: (consented: boolean) => void;
  resetConsent: () => void;
};

export const useLocationConsentStore = create<LocationConsentStore>()(
  persist(
    (set, get) => ({
      visible: false,
      hasConsented: false,
      resolve: null,
      show: () =>
        new Promise<boolean>((resolve) => {
          const pending = get().resolve;
          if (pending) pending(false);
          set({ visible: true, resolve });
        }),
      respond: (consented) => {
        const { resolve } = get();
        if (resolve) resolve(consented);
        set({
          visible: false,
          resolve: null,
          hasConsented: consented ? true : get().hasConsented,
        });
      },
      resetConsent: () => set({ hasConsented: false }),
    }),
    {
      name: 'location-consent-store',
      storage: createJSONStorage(() => ({
        setItem: (key: string, value: string) => Storage.setItem(key, value),
        getItem: (key: string) => Storage.getItem(key),
        removeItem: (key: string) => Storage.removeItem(key),
      })),
      partialize: (state) => ({ hasConsented: state.hasConsented }),
    }
  )
);
