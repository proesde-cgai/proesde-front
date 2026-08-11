import axios from "axios";
import { getAccessToken } from "../../../../features/authService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_CICLO_ACTUAL_URL = `${API_BASE_URL}/api/v1/jefe_depto/get-ciclo-escolar-actual-plan-trabajo`;


export const obtenerCicloActual = async () => {
    try {
        const token = await getAccessToken();
        const response = await axios.get(API_CICLO_ACTUAL_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener ciclo actual:", error);
    }
};

