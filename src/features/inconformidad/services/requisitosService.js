import axios from 'axios';
import { getAccessToken } from '../../authService';

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_REQUISITOS_URL = `${API_BASE_URL}/api/v1/evaluacion/requisitos`;

const API_SATISFACER_REQUISITOS_URL = `${API_BASE_URL}/api/v1/evaluacion/satisfacer-requisitos`

/**
 * Servicio para obtener los requisitos del participante
 * 
 * @param {number}  idSolicitud - idSolicitud para obtener los tipos de requisitos
 * @param {string} aliasActividad - aliasActividad inconformidad o evaluacion (depende el tipo de actividad)
 * @returns {Promise<AxiosResponse<any, any>>} - Promise response axios
 */
export const getRequisitos = async (idSolicitud, aliasActividad) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${API_REQUISITOS_URL}?idSolicitud=${idSolicitud}&aliasActividad=${aliasActividad}`, {
      headers: { 
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (error) {
    console.error('Error getting requisitos: ', error);
    throw error;
  }
};

/**
 * Servicio para satisfacer los requisitos del participante
 * 
 * @param {object} body - objeto con los requisitos a satisfacer
 * @param {string} body.aliasRol - El alias del rol.
 * @param {string} body.aliasActividad - El alias de la actividad.
 * @param {boolean} body.esConcursante - Indica si el usuario es concursante o no.
 * @param {string|null} body.razones - Las razones de la solicitud, puede ser `null`.
 * @param {number} body.idSolicitud - El Id de la solicitud.
 * @param {Object.<string, string>} body.requisitos - Un objeto con los requisitos donde el key es el id del requisito satisfecho, value sera siempre la palabra satisfecho.
 * 
 * @returns {Promise<AxiosResponse>} - Promesa que resuelve con la respuesta de Axios.
 */
export const postSatisfacerRequisitos = async (body) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(API_SATISFACER_REQUISITOS_URL, body, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log('Error posting requisitos: ', error);
    throw error;
  }
};