import { create } from "zustand";
import { obtenerMunicipios } from "../features/municipiosService";

const useMunicipiosStore = create((set, get) => ({
  municipios: [],
  loadingMunicipios: false,
  fetchMunicipios: async () => {
    if (get().municipios.length > 0) return; // Evitar múltiples llamadas si ya se cargaron
    set({ loadingMunicipios: true });
    try {
      const data = await obtenerMunicipios();
      set({ municipios: data });
    } catch (error) {
      console.error("Error al obtener municipios:", error);
    } finally {
      set({ loadingMunicipios: false });
    }
  },
}));

const useMunicipios = () => {
  const { municipios, loadingMunicipios, fetchMunicipios } = useMunicipiosStore();

  if (!loadingMunicipios && municipios.length === 0) {
    fetchMunicipios();
  }

  return { municipios, loadingMunicipios };
};

export default useMunicipios;