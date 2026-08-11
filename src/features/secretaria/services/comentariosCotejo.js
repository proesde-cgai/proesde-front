import axios from "axios";
import { getAccessToken } from "../../authService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_AGREGAR_COMENTARIO = `${API_BASE_URL}/api/v1/cotejo-documentos/agregar-comentario`;
const API_ENVIAR_CORREO_COTEJO = `${API_BASE_URL}/api/v1/cotejo-documentos/enviar-cotejo`;
const API_COTEJO_STATUS = `${API_BASE_URL}/api/v1/cotejo-documentos/status`;
const API_COMENTARIOS_COTEJO = `${API_BASE_URL}/api/v1/cotejo-documentos/comentarios-cotejo`;
const API_REGRESAR_SOLICITUD = `${API_BASE_URL}/api/v1/solicitud/regresar`;

export const agregrarComentarioCotejo = async (body) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(API_AGREGAR_COMENTARIO, body, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error al comentar una nota de cotejo: ", error);
    throw error;
  }
};

export const obtenerComentariosCotejo = async (idSolicitud) => {
  try {
    const token = await getAccessToken();
    const response = await axios(
      `${API_COMENTARIOS_COTEJO}?idSolicitud=${idSolicitud}`,
      {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error al obtener los comentarios de cotejo: ", error);
    throw error;
  }
};

export const enviarComentariosCotejo = async (body) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(API_ENVIAR_CORREO_COTEJO, body, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error al agregar el comentario de cotejo: ", error);
    throw error;
  }
};

export const obtenerStatusCotejo = async (idSolicitud) => {
  try {
    const token = await getAccessToken();
    const response = await axios(
      `${API_COTEJO_STATUS}?idSolicitud=${idSolicitud}`,
      {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error al obtener el status del cotejo: ", error);
    throw error;
  }
};

export const regresarSolicitud = async (idSolicitud) => {
  try {
    const token = await getAccessToken();
    const response = await axios.put(
      `${API_REGRESAR_SOLICITUD}/${idSolicitud}`,
      null,
      {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error al regresar la solicitud: ", error);
    throw error;
  }
};
