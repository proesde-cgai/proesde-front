import axios from "axios";
import { getAccessToken } from "../../../../../features/authService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_ALTA_OFICIO_URL = `${API_BASE_URL}/api/v1/jefe_depto/reporte/alta-asignacion-carga-horaria`;
const API_CONSULTA_OFICIO_URL = `${API_BASE_URL}/api/v1/jefe_depto/reporte/consultar-carta-jefe-depto`;
const API_ACTUALIZAR_OFICIO_URL = `${API_BASE_URL}/api/v1/jefe_depto/reporte/editar-asignacion-carga-horaria`;
const API_ELIMINAR_OFICIO_URL = `${API_BASE_URL}/api/v1/jefe_depto/reporte/eliminar-asignacion-carga-horaria`;

export const altaOficio = async (payload) => {
    try {
        const token = await getAccessToken();

        const response = await axios.post(
            API_ALTA_OFICIO_URL,
            payload,
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

export const actualizarOficio = async (payload) => {
    try {
        const token = await getAccessToken();

        const response = await axios.post(
            API_ACTUALIZAR_OFICIO_URL,
            payload,
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
export const eliminarOficio = async (idQr) => {
    try {
        const token = await getAccessToken();

        const response = await axios.post(
            API_ELIMINAR_OFICIO_URL,
            {idQr},
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


export const consultaOficio = async (idQr) => {
    try {
        const token = await getAccessToken();
        const response = await axios.post(
            API_CONSULTA_OFICIO_URL,
            {idQr},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',

            }
        );
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `CargaHoraria_${idQr}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
    } catch (error) {
        console.error("Backend error response:", error.response.data);
    }
};

