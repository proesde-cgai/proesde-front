import axios from "axios";
import { getAccessToken } from "./../../../authService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_ENVIAR_SOLICITUD = `${API_BASE_URL}/api/v1/solicitud/enviar`;

export const enviarSolicitud = async (body) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(API_ENVIAR_SOLICITUD, body, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error al enviar la solicitud: ", error);
    throw error;
  }
};
