import axios from 'axios';
import { getAccessToken } from '../../../authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_MODALIDAD_EVALUACION = `${API_BASE_URL}/api/v1/tipo-participacion/all`;
const API_TIPO_PARTICIPACION = `${API_BASE_URL}/api/v1/tipo-participacion/set`;

export const obtenerModalidadesEvaluacion = async () => {
  try {
    const token = await getAccessToken();
    const response = await axios(`${API_MODALIDAD_EVALUACION}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting requisitos del expediente: ', error);
    throw error;
  }
};

/** Servicio para establecer el tipo de modalidad por la cual desea participar
 * @param {Number} idSolicitud - idSolicitud del academico
 * @param {Number} idTipoParticipacion - Tipo de participacion por la cual participara 1 = Evaluacion Art.29; 2 = PRODEP Art.26
 * */ 
export const setTipoDeParticipacion = async (idTipoParticipacion) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(`${API_TIPO_PARTICIPACION}?idTipoParticipacion=${idTipoParticipacion}`, undefined, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (error) {
    console.error('Error al establecer el tipo de participacion: ', error);
    throw error;
  }
};