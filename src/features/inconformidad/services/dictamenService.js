import api from "../../../hooks/api";

export const generatePDFDicNoParticipant = async (body) => {
  // const body = { academicosSeleccionados: [8717745], tipo: "inconformidad" };

  try {
    const response = await api.post(
      `/api/v1/dictamen/dictamen-no-participante`,
      body, {
      responseType: "blob",
    }
    );
    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Error al generar el PDF del dictamen de no participantes");
  } catch (error) {
    console.log("S: Error al generar el PDF:", error);
    throw new Error("Error al generar el PDF");
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
    // El error llega como blob — extraer el mensaje JSON real
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        throw new Error(json.mensaje || "Error al generar el PDF");
      } catch (parseError) {
        if (parseError.message !== "Error al generar el PDF") throw parseError;
      }
    }
    console.error("Error al generar el PDF:", error);
    throw new Error(error.message || "Error al generar el PDF");
  }
};

export const uploadDictamenNoParticipante = async (body) => {
  try {
    const response = await api.post(
      `/api/v1/dictamen-inconformidad/subir-dictamen-no-participante`,
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
      `/api/v1/dictamen-inconformidad/subir-dictamen-final`,
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
