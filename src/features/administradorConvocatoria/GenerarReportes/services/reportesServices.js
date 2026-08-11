import axios from "axios";
import { getAccessToken } from "../../../authService";  // Asumimos que tienes el servicio de autenticación separado

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Concatenar el contexto y el recurso para las materias y ciclos escolares
const API_INCONFORMIDAD_URL = `${API_BASE_URL}/api/v1/estadisticas/inconformes/`; 
const API_COMISION_MIEMBRO_URL = `${API_BASE_URL}/api/v1/estadisticas/comisionmiembro/`;
const API_COMPARACION_CONVOCATORIA_URL = `${API_BASE_URL}/api/v1/estadisticas/comparacionconvocatorias/`;
const API_LISTADO_SOLICITUDES_CENTRO_URL = `${API_BASE_URL}/api/v1/estadisticas/listadosolicitudescentro/`;
const API_NUEVOS_PARTICIPANTES_URL = `${API_BASE_URL}/api/v1/estadisticas/nuevosparticipantes/`;
const API_TOTAL_SOLICITUDES_URL = `${API_BASE_URL}/api/v1/estadisticas/totalsolicitudes/`;
const API_DOCUMENTOS_DIGITALIZADOS_URL = `${API_BASE_URL}/api/v1/estadisticas/documentosdigitalizados/`;
const API_CICLOS_ESCOLARES_URL = `${API_BASE_URL}/api/v1/jefe_depto/lista-ciclos-escolares`;

const downloadBlob = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // Servicio para obtener la lista de materias
  export const generarReporteComisionMiembro = async (convocatoria, formato) => {
    try {
      // Obtener o renovar el access token
      const token = await getAccessToken(); 

      const response = await axios.get(
          `${API_COMISION_MIEMBRO_URL}${convocatoria}/${formato}`, 
          {
          headers: {
            Authorization: `Bearer ${token}`,  // Añadimos el token a los headers
          },
          responseType: 'blob', 
        }
      );
      downloadBlob(response.data, `ComisionMiembro.${formato}`); // Download the file

    } catch (error) {
      console.error("Error en generarReporteComisionMiembro:", error.response?.data || error);
      throw new Error("No se pudo obtener la lista de materias.");
    }
  };

  export const generarEstadisticaInconforme = async (convocatoria, formato) => {
    try {
      const token = await getAccessToken();
      const response = await axios.get(`${API_INCONFORMIDAD_URL}${convocatoria}/${formato}`, 
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', 
      });
      downloadBlob(response.data, `EstadisticaInconforme.${formato}`);
    } catch (error) {
      console.error("Error en generarEstadisticaInconforme:", error.response?.data || error);
      throw new Error("No se pudo generar la estadística de inconformes.");
    }
  };

  export const generarEstadisticaComparacionConvocatorias = async (convocatoria, formato) => {
    try {
      const token = await getAccessToken();
      const response = await axios.get(`${API_COMPARACION_CONVOCATORIA_URL}${convocatoria}/${formato}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob', 
      });
      downloadBlob(response.data, `ComparacionConvocatorias.${formato}`);
    } catch (error) {
      console.error("Error en generarEstadisticaComparacionConvocatorias:", error.response?.data || error);
      throw new Error("No se pudo generar la estadística de comparación de convocatorias.");
    }
  };

  export const generarEstadisticaListadosSolicitudesCentro = async (idDependencia, porCentro = "N",convocatoria,  formato) => {
    try {
      const token = await getAccessToken();
      const response = await axios.get(`${API_LISTADO_SOLICITUDES_CENTRO_URL}${idDependencia}/${porCentro}/${convocatoria}/${formato}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',

      });
      downloadBlob(response.data, `ListadosSolicitudesCentro.${formato}`);

    } catch (error) {
      console.error("Error en generarEstadisticaListadosSolicitudesCentro:", error.response?.data || error);
      throw new Error("No se pudo generar la estadística de listados de solicitudes por centro.");
    }
  };

  export const generarEstadisticaNuevosParticipantes = async (convocatoria, formato) => {
    try {
      const token = await getAccessToken();
      const response = await axios.get(`${API_NUEVOS_PARTICIPANTES_URL}${convocatoria}/${formato}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',

      });
      downloadBlob(response.data, `NuevosParticipantes.${formato}`);
    } catch (error) {
      console.error("Error en generarEstadisticaNuevosParticipantes:", error.response?.data || error);
      throw new Error("No se pudo generar la estadística de nuevos participantes.");
    }
  };

  export const generarEstadisticaTotalSolicitudes = async (convocatoria, formato) => {
    try {
      const token = await getAccessToken();
      const response = await axios.get(`${API_TOTAL_SOLICITUDES_URL}${convocatoria}/${formato}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      downloadBlob(response.data, `TotalSolicitudes.${formato}`);
    } catch (error) {
      console.error("Error en generarEstadisticaTotalSolicitudes:", error.response?.data || error);
      throw new Error("No se pudo generar la estadística de total de solicitudes.");
    }
  };

  export const generarEstadisticaDocumentosDigitalizados = async (convocatoria, formato) => {
    try {
      const token = await getAccessToken();
      const response = await axios.get(`${API_DOCUMENTOS_DIGITALIZADOS_URL}${convocatoria}/${formato}`, 
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',

      }
    );
    downloadBlob(response.data, `DocumentosDigitalizados.${formato}`);
    } catch (error) {
      console.error("Error en generarEstadisticaDocumentosDigitalizados:", error.response?.data || error);
      throw new Error("No se pudo generar la estadística de documentos digitalizados.");
    }
  };


// Servicio para obtener la lista de ciclos escolares
export const obtenerCiclosEscolares = async () => {
  try {
    const token = await getAccessToken(); // Obtener o renovar el access token
    const response = await axios.get(API_CICLOS_ESCOLARES_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Se añade el token para autenticación
      },
    });
    return response.data; // Devolvemos los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener los ciclos escolares:", error);
    throw new Error("No se pudo obtener la lista de ciclos escolares.");
  }
};



