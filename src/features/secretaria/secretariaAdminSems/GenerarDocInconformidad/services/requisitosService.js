import axios from "axios";
import { getAccessToken } from "../../../../authService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_REQUISITOS = `${API_BASE_URL}/api/v1/evaluacion/requisitos`;

export const getRequisitos = async ({ idSolicitud, aliasActividad }) => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(API_URL_REQUISITOS, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        idSolicitud,
        aliasActividad,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting requisitos:", error);
    throw error;
  }
};
