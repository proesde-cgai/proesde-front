import axios from "axios";
import { getAccessToken } from "../../../../authService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_DATOS_EVALUAR_LECTURA_ULTIMA_EVAL = `${API_BASE_URL}/api/v1/evaluacion/datos-evaluar-lectura-ultima-evaluacion`;

const getHeaders = async () => ({
  Accept: "*/*",
  Authorization: `Bearer ${await getAccessToken()}`,
  "Content-Type": "application/json",
});

export const getUltimaEvaluacion = async ({
  aliasActividad,
  idSolicitud,
}) => {
  try {
    const headers = await getHeaders();

    const response = await axios.get(
      `${API_URL_DATOS_EVALUAR_LECTURA_ULTIMA_EVAL}?aliasActividad=${aliasActividad}&idSolicitud=${idSolicitud}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error("Error obteniendo datos de la lectura de evaluación:", error);
    throw error;
  }
};
