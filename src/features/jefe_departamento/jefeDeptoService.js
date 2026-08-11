import axios from "axios";
import { getAccessToken } from "../authService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_SAVE_DATA = `${API_BASE_URL}/api/v1/jefe_depto/reporte/save_data`;
const API_CHANGE_MUNICIPIO = `${API_BASE_URL}/api/v1/municipio`;
const API_GET_MUNICIPIO_JEFE = `${API_BASE_URL}/api/v1/municipio/get_data_municipio`;

export const saveCumplimientoPt = async (payload) => {
  try {
    const token = await getAccessToken();

    const response = await axios.post(API_SAVE_DATA, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Backend error response:", error.response.data);
  }
};

export const getMunicipiosJefeDepto = async (usuario, id_etapa_jefe) => {
  try {
    const token = await getAccessToken();

    const response = await axios.post(
      API_GET_MUNICIPIO_JEFE,
      {
        usuario,
        id_etapa_jefe,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Backend error response:", error.response.data);
  }
};

export const saveChangeMunicipio = async (payload) => {
  try {
    const token = await getAccessToken();

    const response = await axios.put(API_CHANGE_MUNICIPIO, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Backend error response:", error.response.data);
  }
};
