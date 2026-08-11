import axios from 'axios';
import { getAccessToken } from '../../../../authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_STATUS_PARTICIPACION = `${API_BASE_URL}/api/v1/evaluacion/status-participacion`;

const getHeaders = async () => ({
  Accept: '*/*',
  Authorization: `Bearer ${await getAccessToken()}`,
  'Content-Type': 'application/json',
});

export const getStatusParticipacion = async (codigo) => {
  try {
    const headers = await getHeaders();
    const response = await axios.get(
      `${API_URL_STATUS_PARTICIPACION}?codigo=${codigo}`,
      { headers }
    );

    return response.data;

  } catch (error) {
    console.error("Error obteniendo status de participación:", error);
    throw error;
  }
};
