import axios from 'axios';
import { getAccessToken } from '../../../../authService'; // Asumimos que tienes esta función para obtener el token

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_GENERAR_CARTA_URL = `${API_BASE_URL}/api/v1/`;
const API_ELIMINAR_CARTA_URL = `${API_BASE_URL}/api/v1/`;
const API_CONSULTAR_CARTA_URL = `${API_BASE_URL}/api/v1/jefe_depto/reporte/consultar-carta-jefe-depto`;
const API_EDITAR_CARTA_URL = `${API_BASE_URL}/api/v1/`;

// Servicio para generar el documento de inconformidad
export const generarCartaDesempeno = async (materia) => {
  try {
    const token = await getAccessToken();

    console.log("Enviando solicitud para generar el doc de inconformidad:", {
      idQr: materia.idQr,
      programaEducativo: materia.programaEducativo,
    });

    // Petición para generar el documento de inconformidad
    await axios.post(
      API_GENERAR_CARTA_URL,
      {
        idQr: materia.idQr,
        programaEducativo: materia.programaEducativo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Asegurarnos de que el token esté correctamente configurado
        },
      }
    );

    console.log("Generación exitosa de doc de inconformidad.");
  } catch (error) {
    console.error('Error al generar el doc de inconformidad', error.response?.data || error.message);
    throw new Error('No se pudo generar el doc de inconformidad.');
  }
};



// Servicio para consultar documento y descargar el PDF
export const descargarPDF = async (idQr) => {
  try {
    const token = await getAccessToken();

    console.log("Enviando solicitud para consultar Doc de inconformidad con el ID:", idQr);

    // Petición para consultar doc de inconformidad
    const response = await axios.post(
      API_CONSULTAR_CARTA_URL,
      {
        idQr,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Asegurarnos de que el token esté correctamente configurado
        },
        responseType: 'blob', // Esperamos el PDF como un blob
      }
    );

    // Crear un archivo descargable del blob
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CartaDesempeño_${idQr}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Carta de Desempeño descargada exitosamente.");
  } catch (error) {
    console.error('Error al consultar Doc de inconformidad:', error.response?.data || error.message);
    throw new Error('No se pudo consultar Doc de inconformidad.');
  }
};



