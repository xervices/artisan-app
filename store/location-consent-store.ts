import { create } from 'zustand';

type LocationConsentStore = {
  visible: boolean;
  resolve: ((consented: boolean) => void) | null;
  show: () => Promise<boolean>;
  respond: (consented: boolean) => void;
};

export const useLocationConsentStore = create<LocationConsentStore>((set, get) => ({
  visible: false,
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
    set({ visible: false, resolve: null });
  },
}));
