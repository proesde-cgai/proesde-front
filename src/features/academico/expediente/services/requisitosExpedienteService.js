import axios from 'axios';
import { getAccessToken } from '../../../authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_EXPEDIENTE_REQUISITOS = `${API_BASE_URL}/api/v1/expediente/requisitos`;
const API_EXPEDIENTE_ELIMINAR_REQUISITO = `${API_BASE_URL}/api/v1/expediente/eliminar-requisito`;
const API_EXPEDIENTE_SUBIR_REQUISITO = `${API_BASE_URL}/api/v1/expediente/subir-requisito`;
const API_ELIMINAR_ARCHIVO = `${API_BASE_URL}/api/v1/expediente/eliminar-archivo`;
const API_ACTUALIZAR_ARCHIVO = `${API_BASE_URL}/api/v1/cotejo-documentos/reemplazar`;

export const obtenerRequisitosExpediente = async (idSolicitud) => {
  try {
    const token = await getAccessToken();
    const response = await axios(`${API_EXPEDIENTE_REQUISITOS}?idSolicitud=${idSolicitud}`, {
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

export const subirRequisitosExpediente = async (body) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(API_EXPEDIENTE_SUBIR_REQUISITO, body, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return response;
  } catch (error) {
    console.error('Error al subir documento: ', error);
    throw error;
  }
};

export const eliminarDocRequisitosExpediente = async (body) => {
  try {
    const token = await getAccessToken();
    const response = await axios.delete(API_EXPEDIENTE_ELIMINAR_REQUISITO, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: body
    });
    return response;
  } catch (error) {
    console.error('Error al eliminar documento: ', error);
    throw error;
  }
};

export const actualizarRequisitosExpediente = async (body) => {
  const response = await eliminarArchivoRequisitoExpedienteIdArcvhio(body);
  //console.log("se elimino ")
  
  if (response.status === 200) {
    try {
      const token = await getAccessToken();
      const response = await axios.post(API_EXPEDIENTE_SUBIR_REQUISITO, body, {
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
  
};

export const eliminarArchivoRequisitoExpediente = async (body) => {
  try {
    console.log("entro en elimar ", body.get("idExpediente"))
    const token = await getAccessToken();
    const response = await axios.delete(`${API_ELIMINAR_ARCHIVO}/${body.get("idExpediente")}`, {
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

export const eliminarArchivoRequisitoExpedienteAcademico = async (body) => {
  try {
   // console.log("entro en elimar ", body.get("idExpediente"))
    const token = await getAccessToken();
    const {idExpediente} = body;
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

export const eliminarArchivoRequisitoExpedienteIdArcvhio = async (body) => {
  try {
    console.log("entro en elimar ", body.get("archivoId"))
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

export const actualizarArchivoRequisitoExpediente = async (body) => {

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

