import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getConvocatoriaActual = async () => {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/convocatoria/convocatoria_actual`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data[0];
    } catch (error) {
        console.error("Error fetching convocatoria actual:", error);
        return null;
    }
};

export const createConvocatoria = async (data) => {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await axios.post(`${API_BASE_URL}/api/v1/convocatoria/generar-convocatoria`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating convocatoria:", error);
        return null;
    }
};

export const updateConvocatoria = async (id, data) => {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await axios.put(`${API_BASE_URL}/api/v1/convocatoria`, { id, ...data }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating convocatoria:", error);
        return null;
    }
};
