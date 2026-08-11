import axios from 'axios';
import { getAccessToken } from '../../../../authService'; // Asumimos que tienes esta función para obtener el token

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const GET_STATUS = `${API_BASE_URL}/api/v1/cotejo-documentos/status?idSolicitud=`;

// Fetch the status service
export const fetchStatus = async (id) => {
    const token = await getAccessToken();
    const headers = {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

  try {
    const response = await axios.get(`${GET_STATUS}${id}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching criterios: ", error);
    throw error; // Rethrow for specific error handling if needed
  }
};

