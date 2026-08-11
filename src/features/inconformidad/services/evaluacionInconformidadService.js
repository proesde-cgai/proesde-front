import axios from "axios";
import { getAccessToken } from '../../authService';

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_DATOS_EVALUAR_URL = `${API_BASE_URL}/api/v1/evaluacion/datos-evaluar`;
const API_DATOS_EVALUAR_LECTURA_URL = `${API_BASE_URL}/api/v1/evaluacion/datos-evaluar-lectura`;
const API_EVALUAR_INCONFORMIDAD = `${API_BASE_URL}/api/v1/evaluacion/evaluar`;

export const datosEvaluacionInconformidad = async (idSolicitud, aliasActividad) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${API_DATOS_EVALUAR_URL}?idSolicitud=${idSolicitud}&aliasActividad=${aliasActividad}`, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting datos de evaluacion: ", error);
    throw error;
  }
};
export const datosEvaluacionLectura = async (idSolicitud, aliasActividad) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${API_DATOS_EVALUAR_LECTURA_URL}?idSolicitud=${idSolicitud}&aliasActividad=${aliasActividad}`, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting datos de evaluacion: ", error);
    throw error;
  }
};


export const evaluarInconformidad = async (body) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(API_EVALUAR_INCONFORMIDAD, body, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
    );
    return response;
  } catch (error) {
    console.error("Error getting datos de evaluacion: ", error);
    throw error;
  }
}