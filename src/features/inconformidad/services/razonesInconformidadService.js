import axios from 'axios';
import { getAccessToken } from '../../authService';  // Asumimos que tienes el servicio de autenticación separado

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Concatenar el contexto y el recurso para las materias
const API_RAZONES_INCONFORMIDAD_URL = `${API_BASE_URL}/api/v1/evaluacion/razones-inconformidad?idSolicitud=1`;

export const getRazonesInconformidad = async () => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(API_RAZONES_INCONFORMIDAD_URL, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    return response.data;
  } catch (error) {
    console.error('Error getting razones de inconformidad: ', error);
    throw error;
  }
};