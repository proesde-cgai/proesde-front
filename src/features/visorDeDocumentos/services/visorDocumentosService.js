import api from '../../../hooks/api';

// Obtener la URL base desde las variables de entorno
const API_VISOR_DOCUMENTO = `/api/v1/evaluacion/documento-visor`;

export const visorDocumentosService = async (urlDocumento) => {
  try {
    const response = await api.get(`${API_VISOR_DOCUMENTO}?nodo=${urlDocumento}`, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer'
    });
    return response;
  } catch (error) {
    console.error('Error al obtener el documento: ', error);
    throw error;
  }
};