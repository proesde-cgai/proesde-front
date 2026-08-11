import axios from "axios";
import { getAccessToken } from "../../../../../features/authService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_TEACHERS_URL = `${API_BASE_URL}/api/v1/jefe_depto/lista-profesores-asignacion-carga-horaria`;
const API_CICLO_ACTUAL_URL = `${API_BASE_URL}/api/v1/jefe_depto/get-ciclo-escolar-actual`;
const API_SIZE_LIST_URL = `${API_BASE_URL}/api/v1/jefe_depto/size-list-profesores`;
const API_LIST_SUBJECTS_URL = `${API_BASE_URL}/api/v1/jefe_depto/lista-materias`;


export const obtenerDocentes = async (codigoEmpleado, cicloEscolar, page, app) => {
    try {
        const token = await getAccessToken();
        
        const response = await axios.post(
            API_TEACHERS_URL,
            {
                codigoEmpleado,
                cicloEscolar,
                page,
                app,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Backend error response:", error.response.data);
    }
};

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

export const obtenerSizeList = async () => {
    try {
        const token = await getAccessToken();
        const response = await axios.get(API_SIZE_LIST_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener el tamaño de la lista:", error);
    }
};

export const obtenerMaterias = async (codigoEmpleado, cicloEscolar, idQr) => {
    try {
        const token = await getAccessToken();
        const response = await axios.post(API_LIST_SUBJECTS_URL, {
            codigoEmpleado,
            cicloEscolar,
            idQr
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener materias:", error);
    }
};