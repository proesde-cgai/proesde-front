import api from "../../../../../hooks/api";

const API_DATOS_EVALUAR_URL = `api/v1/evaluacion/datos-evaluar-lectura`;

export const datosInconformidad = async (id) => {
  try {
    const response = await api(
      `${API_DATOS_EVALUAR_URL}?aliasActividad=inconformidad&idSolicitud=${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting datos de evaluacion: ", error);
    // const err =
    console.log(error);

    throw new Error(error.response.data.mensaje);
  }
};
