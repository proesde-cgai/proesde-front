import api from "../../../hooks/api";

const DEFAULT_ERROR_MSG = "Error al generar el dictamen de no participante.";

/**
 * Extrae el mensaje de error del response cuando responseType es "blob" (el body viene como Blob con JSON).
 */
const getErrorMessageFromResponse = async (error) => {
  const data = error.response?.data;
  if (!data) return DEFAULT_ERROR_MSG;
  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const json = JSON.parse(text);
      return json.mensaje || DEFAULT_ERROR_MSG;
    } catch (e) {
      return DEFAULT_ERROR_MSG;
    }
  }
  return data?.mensaje || DEFAULT_ERROR_MSG;
};

export const generatePDFDicNoParticipant = async (body) => {
  try {
    const response = await api.post(
      `/api/v1/dictamen/dictamen-no-participante`,
      body, {
        responseType: "blob",
      }
    );
    if (response.status === 200) {
      return response;
    }

    throw new Error(DEFAULT_ERROR_MSG);
  } catch (error) {
    console.log("S: Error al generar el PDF:", error);
    const message = await getErrorMessageFromResponse(error);
    throw new Error(message);
  }
};

export const generatePDFDicFinal = async (body) => {
  try {
    const response = await api.post(`/api/v1/dictamen/dictamen-final`, body, {
      responseType: 'blob',
    });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    throw error;
  }
};

export const uploadDictamenNoParticipante = async (body) => {
  try {
    const response = await api.post(
      "/api/v1/dictamen/subir-dictamen-no-participante",
      body
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw new Error("Error al subir el archivo");
  }
};

export const uploadDictamenFinal = async (body) => {
  try {
    const response = await api.post(
      "/api/v1/dictamen/subir-dictamen-final",
      body
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw new Error("Error al subir el archivo");
  }
};

export const getStatusDictamenService = async (idSolicitud, tipo, signal) => {
  try {
    const response = await api.get(
      `/api/v1/dictamen/archivo/${idSolicitud}/${tipo}`,
      { signal }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw Error;
  } catch (error) {
    console.error("Error al obtener el estado del dictamen:", error);
    throw new Error("Error al obtener el estado del dictamen");
  }
};
