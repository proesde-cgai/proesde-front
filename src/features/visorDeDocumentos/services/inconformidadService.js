import api from "../../../hooks/api";

export const getDatosInconformidad = async () => {
    try {
        const response = await api.get(`/api/v1/evaluacion/datos-inconformarse`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}