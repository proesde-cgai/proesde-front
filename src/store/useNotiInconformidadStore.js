import { create } from "zustand";
import api from "../hooks/api";

const useNotiInconformidadStore = create((set) => ({
    isLoading: null,
    notiReponse: null,
    sendNotiInconformidad: async () => {
        try {
            set({ isLoading: true, notiReponse: null });
            const response = await api.get('/api/v1/publicacion/notificar-inconformidad');
            set({ notiResponse: response });
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            set({ isLoading: false });
        }
    }
}))

export default useNotiInconformidadStore;