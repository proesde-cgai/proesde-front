import axios from "axios";
import { getAccessToken } from "../../authService";
import api from "../../../hooks/api";

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Concatenar el contexto y el recurso para las materias
const API_DATOS_PARTICIPANTE_URL = `${API_BASE_URL}/api/v1/evaluacion/datos-participante`;

export const getDatosParticipante = async () => {
  try {
    const token = await getAccessToken();
    console.log(token)
    const response = await axios.get(`${API_DATOS_PARTICIPANTE_URL}`, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error getting datos del participante: ", error);
    throw error;
  }
};

export const getEmailUdgService = async (code) => {
  try {
    const response = await api.get(`/api/v1/solicitud/email/${code}`);

    console.log("🚀 ~ getEmailUdgService ~ response:", response)
    if (response.status !== 200) {
      throw new Error("Error email no encontrado");
    }

    return response.data;
  } catch (error) {
    console.error("Error getting email udg: ", error);
    throw error;
  }
};

export const getDatosParticipanteFullData = async (code, tipo) => {
  try {
    const response = await api.get(`/api/v1/evaluacion/datos-participante2?codigo=${code}&tipo=${tipo}`);
    console.log("🚀 ~ datosParticipante ~ response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error: ', error);
    // throw error;
  }
}
