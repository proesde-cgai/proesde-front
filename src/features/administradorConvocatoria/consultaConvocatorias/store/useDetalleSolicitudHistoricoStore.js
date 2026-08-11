import { create } from "zustand";

export const useDetalleSolicitudHistoricoStore = create((set) => ({
  detalle: null,
  setDetalle: (data) => set({ detalle: data }),
  clearDetalle: () => set({ detalle: null }),
}));
