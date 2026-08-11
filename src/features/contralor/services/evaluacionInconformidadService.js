import axios from "axios";
import { getAccessToken } from '../../authService';

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_DATOS_EVALUAR_URL = `${API_BASE_URL}/api/v1/evaluacion/datos-evaluar`;

export const datosEvaluacionInconformidad = async (idSolicitud, aliasActividad) => {
  try {
    const token = await getAccessToken();
    const response = await axios(
      `${API_DATOS_EVALUAR_URL}?aliasActividad=evaluacion&idSolicitud=${idSolicitud}&aliasActividad=${aliasActividad}`,
      {
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
