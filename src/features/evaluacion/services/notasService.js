import axios from "axios";
import { getAccessToken } from "../../authService";

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_OBTENER_COMENTARIOS_URL = `${API_BASE_URL}/api/v1/evaluacion/obtener-comentarios`;
const API_AGREGAR_COMENTARIO_URL = `${API_BASE_URL}/api/v1/evaluacion/agregar-comentario`;
const API_REVISAR_COMENTARIO_URL = `${API_BASE_URL}/api/v1/evaluacion/revisar`;

export const getComentarios = async (idSolicitud) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      `${API_OBTENER_COMENTARIOS_URL}?idSolicitud=${idSolicitud}`,
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
    console.error("Error al obtener los comentarios: ", error);
    throw error;
  }
};

export const postComentario = async (body) => {
  console.log(body);
  try {
    const token = await getAccessToken();
    const response = await axios.post(API_AGREGAR_COMENTARIO_URL, body, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error al agregar el comentario: ", error);
    throw error;
  }
};

export const putComentario = async (body) => {
  try {
    const token = await getAccessToken();
    const response = await axios.put(API_REVISAR_COMENTARIO_URL, body, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al leer el comentario: ", error);
    throw error;
  }
};
