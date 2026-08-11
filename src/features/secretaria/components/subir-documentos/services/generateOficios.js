import axios from "axios";
import { getAccessToken } from "../../../../../features/authService";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL+"/api/v1/gestorDocs";



export const fetchBuscarDocumento = async (codigoProfesor) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${API_BASE_URL}/buscar-documento?codigoProfesor=${codigoProfesor}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching documento:", error);
    throw error;
  }
};

export const fetchGuardarDocumento = async (formData) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(`${API_BASE_URL}/guardar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving documento:", error);
    throw error;
  }
};

export const fetchEliminarArchivo = async (payload) => {
  try {
    const token = await getAccessToken();
    const response = await axios.delete(`${API_BASE_URL}/eliminar-archivo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting archivo:", error);
    throw error;
  }
};