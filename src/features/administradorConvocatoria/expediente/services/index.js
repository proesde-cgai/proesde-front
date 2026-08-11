
import axios from 'axios';
import { getAccessToken } from '../../../authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const URL_TIPOS_DOCUMENTOS = `${API_BASE_URL}/api/v1/expediente/obtener-etapa-documentos`;
const URL_DATOS_INCONFORMIDAD = `${API_BASE_URL}/api/v1/evaluacion/datos-inconformarse`;
const URL_SOLICITUD = ``;

export const tiposDocumentos = async (idSolicitud) => {
  try {
    const token = await getAccessToken();
    const response = await axios(URL_TIPOS_DOCUMENTOS + `?idSolicitud=${idSolicitud}`, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting datos de evaluacion: ", error);
    throw error;
  }
};

export const consultarSolicitud = async () => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${URL_SOLICITUD}`, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting datos de evaluacion: ", error);
    throw error;
  }
};


export const datosInconformidad = async (idSolicitud) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(`${URL_DATOS_INCONFORMIDAD}?idSolicitud=${idSolicitud}`, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting datos de inconformidad: ", error);
    throw error;
  }
};
