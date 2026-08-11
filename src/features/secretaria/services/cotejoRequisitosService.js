import axios from 'axios';
import { getAccessToken } from '../../authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_REQUISITOS_COTEJO = `${API_BASE_URL}/api/v1/cotejo-documentos/requisitos`;
const API_COTEJAR_REQUISITOS = `${API_BASE_URL}/api/v1/cotejo-documentos/update-requisitos`;
const API_CHANGE_REQUISITOS = `${API_BASE_URL}/api/v1/cotejo-documentos/change-requisito`;
const API_CHANGE_COTEJO = `${API_BASE_URL}/api/v1/cotejo-documentos/change-cotejado`;

export const obtenerRequisitosCotejo = async (idSolicitud) => {
  try {
    const token = await getAccessToken();
    const response = await axios(`${API_REQUISITOS_COTEJO}?idSolicitud=${idSolicitud}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (error) {
    console.error('Error al obtener los criterios para cotejo: ', error);
    throw error;
  }
};

export const cotejarRequisitos = async (body) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(API_COTEJAR_REQUISITOS, body, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Error al cotejar documento del requisito: ', error);
    throw error;
  }
};

export const changeRequisito = async (body) => {
  try {
    const token = await getAccessToken();
    console.log("body requisitos ", body)
    const response = await axios.post(API_CHANGE_REQUISITOS, body, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Error al cambiar status del requisito: ', error);
    throw error;
  }
};

export const changeRequisitoCotejo = async (body) => {
  try {
    const token = await getAccessToken();
    

    const response = await axios.post(`${API_CHANGE_COTEJO}`, body, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Error al cambiar status del requisito: ', error);
    throw error;
  }
};

