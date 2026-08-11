import api from "../../../../../hooks/api";

const API_DATOS_EVALUAR_URL = `/api/v1/evaluacion/datos-evaluar-lectura`;

export const datosEvaluacion = async (id) => {
  try {
    const response = await api(
      `${API_DATOS_EVALUAR_URL}?aliasActividad=evaluacion&idSolicitud=${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting datos de evaluacion: ", error);
    // const err =
    console.log();

    throw new Error(error.response.data.mensaje);
  }
};
