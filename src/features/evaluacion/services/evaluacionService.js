import api from "../../../hooks/api";

// Obtener la URL base desde las variables de entorno
const API_DATOS_EVALUAR_URL = `/api/v1/evaluacion/datos-evaluar`;
const API_EVALUAR_INCONFORMIDAD = `/api/v1/evaluacion/evaluar`;

export const datosEvaluacion = async (idSolicitud, aliasActividad) => {
  try {
    const response = await api.get(
      `${API_DATOS_EVALUAR_URL}?aliasActividad=${aliasActividad}&idSolicitud=${idSolicitud}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting datos de evaluacion: ", error);
    throw error;
  }
};

export const evaluar = async (body) => {
  try {
    const response = await api.post(API_EVALUAR_INCONFORMIDAD, body);
    return response;
  } catch (error) {
    console.error("Error getting datos de evaluacion: ", error);
    throw error;
  }
};
