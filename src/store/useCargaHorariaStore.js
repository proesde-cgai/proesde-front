import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../hooks/api";

export const useCargaHorariaStore = create(persist((set, get) => ({
    cargaHorariaData: null,
    ciclosEscolares: [], // Columnas dinámicas (ej: ["2025A", "2025B", "2026A"])
    isLoadingCargaHoraria: true,
    isErrorCargaHoraria: null,
    fetchCargaGlobal: async (code) => {
        try {
            set({ isErrorCargaHoraria: null, isLoadingCargaHoraria: true });
            const response = await api.get(`api/v1/solicitud/obtener-carga-global-tabla/${code}`);
            
            if (response.data && response.data.datos && Array.isArray(response.data.datos)) {
                const datos = response.data.datos;
                
                // Extraer las columnas de ciclos escolares (todas las keys excepto "nivel")
                const ciclosEscolares = [];
                if (datos.length > 0) {
                    const firstItem = datos[0];
                    Object.keys(firstItem).forEach(key => {
                        if (key !== 'nivel') {
                            ciclosEscolares.push(key);
                        }
                    });
                    // Ordenar los ciclos escolares
                    ciclosEscolares.sort();
                }
                
                set({ 
                    cargaHorariaData: datos, 
                    ciclosEscolares: ciclosEscolares 
                });
            } else {
                set({ cargaHorariaData: [] });
            }
        } catch (error) {
            console.error(error);
            set({ isErrorCargaHoraria: 'Hubo un error al tratar de obtener la carga horaria.' });
        } finally {
            set({ isLoadingCargaHoraria: false });
        }
    },
}),
{ name: 'carga-horaria' },
));