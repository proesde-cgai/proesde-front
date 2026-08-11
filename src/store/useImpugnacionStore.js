import { create } from "zustand";

export const useImpugnacionStore = create((set) => ({
  impugnados: [],

  addImpugnado: (id) =>
    set((state) => ({
      impugnados: state.impugnados.includes(id)
        ? state.impugnados
        : [...state.impugnados, id],
    })),

  removeImpugnado: (id) =>
    set((state) => ({
      impugnados: state.impugnados.filter((item) => item !== id),
    })),

  toggleImpugnado: (id) =>
    set((state) => ({
      impugnados: state.impugnados.includes(id)
        ? state.impugnados.filter((item) => item !== id)
        : [...state.impugnados, id],
    })),

  clearImpugnados: () => set({ impugnados: [] }),
}));
