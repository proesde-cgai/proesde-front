import axios from 'axios';
import { getAccessToken } from '../../../authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_CRITERIOS_EXPEDIENTE = `${API_BASE_URL}/api/v1/expediente/criterios`;
const API_EXPEDIENTE_ELIMINAR_CRITERIO = `${API_BASE_URL}/api/v1/expediente/eliminar-criterio`;
const API_EXPEDIENTE_SUBIR_CRITERIO = `${API_BASE_URL}/api/v1/expediente/subir-criterio`;
const API_ELIMINAR_ARCHIVO = `${API_BASE_URL}/api/v1/expediente/eliminar-archivo`;
const API_ACTUALIZAR_ARCHIVO = `${API_BASE_URL}/api/v1/cotejo-documentos/reemplazar`;

export const obtenerCriteriosExpediente = async (idSolicitud) => {
  try {
    const token = await getAccessToken();
    const response = await axios(`${API_CRITERIOS_EXPEDIENTE}?idSolicitud=${idSolicitud}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response;
  } catch (error) {
    console.error('Error al obtener los criterios del expediente academico: ', error);
    throw error;
  }
};

export const obtenerSubMenuCriteriosExpediente = async (idSolicitud, idMenu) => {
  try {
    const token = await getAccessToken();
    const response = await axios(`${API_CRITERIOS_EXPEDIENTE}?idSolicitud=${idSolicitud}&idMenu=${idMenu}`, {
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
export const obtenerItemsDeCriteriosExpediente = async (params) => {
  const { idSolicitud, idMenu, idSubMenu } = params;
  try {
    const token = await getAccessToken();
    const response = await axios(`${API_CRITERIOS_EXPEDIENTE}?idSolicitud=${idSolicitud}&idMenu=${idMenu}&idSubMenu=${idSubMenu}`, {
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

export const subirDocCriterioExpediente = async (body) => {
  try {
    const token = await getAccessToken();
    console.log("body ", body)
    const response = await axios.post(API_EXPEDIENTE_SUBIR_CRITERIO, body, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    
    return response;
  } catch (error) {
    console.error('Error al subir documento del criterio: ', error);
    throw error;
  }
};


export const eliminarDocCriterioExpediente = async (body) => {
  try {
    console.log(body)
    const token = await getAccessToken();
    const response = await axios.delete(API_EXPEDIENTE_ELIMINAR_CRITERIO, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: body
    });
    return response;
  } catch (error) {
    console.error('Error al eliminar documento del criterio: ', error);
    throw error;
  }
};

export const eliminarArchivoCriterioExpediente = async (body) => {
  try {
    
    const {idExpediente } = body;
    console.log("id expediente end point ", idExpediente)
    const token = await getAccessToken();
    const response = await axios.delete(`${API_ELIMINAR_ARCHIVO}/${idExpediente}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: body
    });
    return response;
  } catch (error) {
    console.error('Error al eliminar documento del criterio: ', error);
    throw error;
  }
};

export const eliminarArchivoCriterioExpedienteIdArchivo = async (body) => {
  try {
    
    const {idExpediente } = body;
    console.log("id expediente end point ", idExpediente)
    const token = await getAccessToken();
    const response = await axios.delete(`${API_ELIMINAR_ARCHIVO}/${body.get("archivoId")}`, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: body
    });
    return response;
  } catch (error) {
    console.error('Error al eliminar documento del criterio: ', error);
    throw error;
  }
};

export const actualizarArchivoCriterioExpediente = async (body) => {

  try {
    const token = await getAccessToken();
    const response = await axios.post(API_ACTUALIZAR_ARCHIVO, body, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log("se subio el nuevo archivo")
    return response;
  } catch (error) {
    console.error('Error al subir documento: ', error);
  throw error;
  }

}

