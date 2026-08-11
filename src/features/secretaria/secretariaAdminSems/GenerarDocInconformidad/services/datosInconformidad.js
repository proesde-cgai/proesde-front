import axios from 'axios';
import { getAccessToken } from '../../../../authService';

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Concatenar el contexto y el recurso para las materias
const API_URL_DATOS_INCONFORMARSE = `${API_BASE_URL}/api/v1/evaluacion/datos-inconformarse`;
const API_URL_POST_INCONFORMARSE = `${API_BASE_URL}/api/v1/evaluacion/inconformarse`; //Subir documento de inconformidad actualizado de academico
const API_URL_POST_OBSERVACION = `${API_BASE_URL}/api/v1/evaluacion/inconformarse`;


export const getDatosInconformidad = async (codigo) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${API_URL_DATOS_INCONFORMARSE}?codigo=${codigo}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;

  } catch (error) {
    console.error('Error getting datos del participante: ', error);
    throw error;
  }
};

export const postInconformidad = async () => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(`${API_URL_POST_INCONFORMARSE}`, {
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

export const postObservacionInconformdidad = async () => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(`${API_URL_POST_INCONFORMARSE}`, {
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