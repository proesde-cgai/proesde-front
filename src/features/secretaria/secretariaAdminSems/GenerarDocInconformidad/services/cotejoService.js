import axios from 'axios';
import { getAccessToken } from '../../../../authService';

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Concatenar el contexto y el recurso para las materias
const API_URL_GET_COTEJO= `${API_BASE_URL}/api/v1/evaluacion/datos-inconformarse`;
const API_URL_COTEJO_INCONFORMIDAD = `${API_BASE_URL}/api/v1/evaluacion/inconformarse`; 


export const getDatosInconformidad = async (idSolicitud) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${API_URL_GET_COTEJO}?idSolicitud=${idSolicitud}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;

  } catch (error) {
    console.error('Error getting datos del cotejo: ', error);
    throw error;
  }
};

export const postInconformidad = async () => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(`${API_URL_COTEJO_INCONFORMIDAD}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    return response;
  } catch (error) {
    console.error('Error getting datos del participante: ', error);
    throw error;
  }
};

