import axios from "axios";
import { getAccessToken } from "../../../../authService";
import api from "../../../../../hooks/api";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_GENERAR_DOCUMENTO_SOLICITUD = `${API_BASE_URL}/api/v1/evaluacion/generar-inconformidad?idSolicitud=`;
const API_URL_CARGAR_DOCUMENTO = `${API_BASE_URL}/api/v1/gestorDocs/guardar`;
///api/v1/dictamen-inconformidad/directivo
export const generarDocumentoSolicitud = async (idSolicitud) => {
  try {
   const token = await getAccessToken();
       const body = {};
       const response = await axios.post(`${API_GENERAR_DOCUMENTO_SOLICITUD}${idSolicitud}`, body, {
         headers: {
           'Content-Type': 'application/json',
           Accept: 'application/json',
           Authorization: `Bearer ${token}`,
         },
         responseType: 'blob',
       });
       return response;
  } catch (error) {
    console.error("Error al generar el documento de inconformidad: ", error);
    throw error;
  }
};


export const cargarDocumento = async (formData) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(API_URL_CARGAR_DOCUMENTO, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error al cargar el documento: ', error);
    throw error;
  }
};
