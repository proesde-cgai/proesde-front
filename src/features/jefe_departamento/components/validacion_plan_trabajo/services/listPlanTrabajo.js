import axios from "axios";
import { getAccessToken } from "../../../../../features/authService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_CICLO_ACTUAL_URL = `${API_BASE_URL}/api/v1/jefe_depto/get-ciclo-escolar-actual-plan-trabajo`;
const API_SIZE_LIST_URL = `${API_BASE_URL}/api/v1/jefe_depto/reporte/all-plan-trabajo-size`;

const API_REPORT_PT = `${API_BASE_URL}/api/v1/jefe_depto/reporte/all-plan-trabajo`;
const API_DETALLE_PT = `${API_BASE_URL}/api/v1/jefe_depto/reporte/get-plan-trabajo`;
const API_DELETE_PT = `${API_BASE_URL}/api/v1/jefe_depto/reporte/eliminar-plan-trabajo`;
const API_UPDATE_PT = `${API_BASE_URL}/api/v1/jefe_depto/reporte/actualizacion-plan-trabajo`;
const API_PDF_GENERATE = `${API_BASE_URL}/api/v1/jefe_depto/reporte/consulta-plan-trabajo`;
const API_CHANGE_STATUS = `${API_BASE_URL}/api/v1/jefe_depto/reporte/editar-plan-trabajo`;

export const obtenerCicloActual = async () => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(API_CICLO_ACTUAL_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener ciclo actual:", error);
  }
};

export const obtenerSizeList = async (cicloEscolar, jefeDepto) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(API_SIZE_LIST_URL + `?cicloEscolar=${cicloEscolar}&jefeDepto=${jefeDepto}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el tamaño de la lista:", error);
  }
};

export const getReportPT = async (page, cicloEscolar, jefeDepto) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      API_REPORT_PT + `?pagina=${page}&jefeDepto=${jefeDepto}&cicloEscolar=${cicloEscolar}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Backend error response:", error.response.data);
    return;
  }
};

export const getDetallePT = async (id) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(API_DETALLE_PT + `?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Backend error response:", error.response.data);
    return;
  }
};

export const generatePdfPT = async (id) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(API_PDF_GENERATE + `?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });
    return response;
  } catch (error) {
    console.log("Backend error response:", error.response);
    return;
  }
};

export const updatePT = async (id, data) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(API_UPDATE_PT + `?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Backend error response:", error.response.data);
    alert(error.response.data.mensaje);
    return;
  }
};

export const handleStatusPT = async (payload) => {
  try {
    const token = await getAccessToken();
    const response = await axios.post(API_CHANGE_STATUS, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Backend error response:", error.response.data);
    alert(error.response.data.mensaje);
    return;
  }
};

export const deletePT = async (id) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(API_DELETE_PT + `?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Backend error response:", error.response.data.mensaje);
    alert(error.response.data.mensaje);
    return;
  }
};
