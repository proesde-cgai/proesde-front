import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/v1`;

export const generatePDFDicNoParticipant = async (body) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(`${BASE_URL}/dictamen/dictamen-no-participante`, body, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      responseType: "blob",
    });
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
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/dictamen/dictamen-final`, body, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    throw new Error("Error al generar el PDF");
  }
};

export const uploadDictamenNoParticipante = async (body) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(
      `${BASE_URL}/dictamen/subir-dictamen-no-participante
`,
      body,
      {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
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
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(`${BASE_URL}/dictamen/subir-dictamen-final`, body, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw new Error("Error al subir el archivo");
  }
};
