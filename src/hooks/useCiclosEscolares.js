import { create } from "zustand";
import { obtenerCiclosEscolares } from "../features/materiasService";

const useCiclosEscolaresStore = create((set, get) => ({
  ciclosEscolares: [],
  loadingCiclosEscolares: false,
  fetchCiclosEscolares: async () => {
    if (get().ciclosEscolares.length > 0) return;
    set({ loadingCiclosEscolares: true });
    try {
      const data = await obtenerCiclosEscolares();
      const sortedData = data.sort((a, b) => {
        const yearA = parseInt(a.substring(0, 4));
        const yearB = parseInt(b.substring(0, 4));
        if (yearA !== yearB) {
          return yearA - yearB;
        }
        return a.slice(-1).localeCompare(b.slice(-1));
      });
      set({ ciclosEscolares: sortedData });
    } catch (error) {
      console.error("Error al obtener los ciclos escolares:", error);
    } finally {
      set({ loadingCiclosEscolares: false });
    }
  },
}));

const useCiclosEscolares = () => {
  const { ciclosEscolares, loadingCiclosEscolares, fetchCiclosEscolares } = useCiclosEscolaresStore();

  if (!loadingCiclosEscolares && ciclosEscolares.length === 0) {
    fetchCiclosEscolares();
  }

  return { ciclosEscolares, loadingCiclosEscolares, fetchCiclosEscolares };
};

export default useCiclosEscolares;
