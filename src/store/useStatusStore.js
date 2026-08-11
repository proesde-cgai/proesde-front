import { create } from "zustand";

const useStatusStore = create((set) => ({
  // Estado inicial
  requestStatus: 0,

  // Función para actualizar "requisitos"
  setRequestStatus: (nuevoStatus) => {
    console.log("Request status: ", nuevoStatus);
    set({ requestStatus: nuevoStatus });
  },

  // Función para resetear todo el estado
  resetStore: () => {
    set({
      requestStatus: 0,
    });
  },
}));

export default useStatusStore;
