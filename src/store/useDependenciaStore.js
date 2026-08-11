import { create } from "zustand";

export const useDependenciaStore = create((set, get) => ({
  dependencia: {
    idDependencia: null,
    palabraClave: "",
  },
  setDependencia: (dependencia) => set({ dependencia }),
  clearDependencia: () => set({ dependencia: { idDependencia: null, palabraClave: "" } }),
}));
