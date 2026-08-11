import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useFileStore = create(
  persist(
    (set, get) => ({
      maxUploadSizeMB: null,

      fetchMaxUploadSize: async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
          const response = await axios.get(`${API_BASE_URL}/api/v1/parametro/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });

          const parametro = response.data.find(
            (item) => item.clave === 'TAMANIO_ARCHIVOS'
          );

          if (parametro && parametro.valor) {
            const maxSizeMB = parseInt(parametro.valor, 10) / (1024 * 1024);
            set({ maxUploadSizeMB: maxSizeMB });
          } else {
            console.warn('No se encontró el parámetro TAMANIO_ARCHIVOS o su valor está vacío. Usando valor predeterminado de 5 MB.');
            set({ maxUploadSizeMB: 5 });
          }
        } catch (error) {
          console.error('Error al obtener el tamaño máximo de carga:', error);
          set({ maxUploadSizeMB: 5 }); // Asegurar el valor predeterminado en caso de error
        }
      },

      validateFileSize: (file) => {
        const { maxUploadSizeMB } = get();
        const fileSizeMB = file.size / (1024 * 1024);
        console.log(`Validando archivo de ${fileSizeMB.toFixed(2)} MB contra el límite de ${maxUploadSizeMB} MB.`);
        return fileSizeMB <= maxUploadSizeMB;
      },
    }),
    {
      name: 'file-storage',
      getStorage: () => localStorage,
    }
  )
);
