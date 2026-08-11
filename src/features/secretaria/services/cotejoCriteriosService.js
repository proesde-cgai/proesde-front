import axios from 'axios';
import { getAccessToken } from '../../authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_CRITERIOS_COTEJO = `${API_BASE_URL}/api/v1/cotejo-documentos/criterios`;
const API_COTEJAR_CRITERIOS = `${API_BASE_URL}/api/v1/cotejo-documentos/update-criterios`;
const API_CHANGE_CRITERIOS = `${API_BASE_URL}/api/v1/cotejo-documentos/change-criterios`;
const API_CHANGE_COTEJADO = `${API_BASE_URL}/api/v1/cotejo-documentos/change-cotejado`;

export const obtenerCriteriosCotejo = async (idSolicitud) => {
  try {
    const token = await getAccessToken();
    const response = await axios(`${API_CRITERIOS_COTEJO}?idSolicitud=${idSolicitud}`, {
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

export const obtenerSubMenuCriteriosCotejo = async (idSolicitud, idMenu) => {
  try {
    const token = await getAccessToken();
    const response = await axios(`${API_CRITERIOS_COTEJO}?idSolicitud=${idSolicitud}&idMenu=${idMenu}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (error) {
    console.error('Error al obtener submenus criterios: ', error);
    throw error;
  }
}

/** 
 * Servicio que obtiene y retorna los items por cada criterio de evaluación
 * @param {Object} params - Objeto de parametros que necesita el servicio
 * @param {number} params.idSolicitud - Identificador de la solicitud.
 * @param {number} params.idMenu - Identificador del menú.
 * @param {number} params.idSubMenu - Identificador del submenú.
 */
export const obtenerItemsDeCriteriosCotejo = async (params) => {
  const { idSolicitud, idMenu, idSubMenu } = params;
  try {
    const token = await getAccessToken();
    const response = await axios(`${API_CRITERIOS_COTEJO}?idSolicitud=${idSolicitud}&idMenu=${idMenu}&idSubMenu=${idSubMenu}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (error) {
    console.error('Error al obtener items del criterio: ', error);
    throw error;
  }
};

export const cotejarCriterios = async (body) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(API_COTEJAR_CRITERIOS, body, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Error al cotejar documento del criterio: ', error);
    throw error;
  }
};

export const changeCriterio = async (body) => {
  try {
    console.log("body cotejado ", body)
    const token = await getAccessToken();
    const response = await axios.post(API_CHANGE_CRITERIOS, body, {
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

export const changeCriterioCotejado = async (body) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(`${API_CHANGE_COTEJADO}`, body, {
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

