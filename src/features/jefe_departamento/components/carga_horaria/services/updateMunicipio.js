import axios from 'axios';
import { getAccessToken } from "../../../../authService"; 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_MUNICIPIOS_URL = `${API_BASE_URL}/api/v1/pais/municipio/all`;
const API_UPDATE_MUNICIPIO_URL = `${API_BASE_URL}/api/v1/jefe_depto/reporte/update-municipio-asignacion-carga-horaria`;

export const obtenerMunicipios = async () => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(
      API_MUNICIPIOS_URL,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error("Error al obtener los municipios:", error);
    throw new Error("No se pudo obtener la lista de municipios.");
  }
};

export const actualizarMunicipioCargaHoraria = async ({ codigoEmpleado, cicloEscolar, page, app, idMunicipio }) => {
  try {
    const token = await getAccessToken();

    const response = await axios.post(
      API_UPDATE_MUNICIPIO_URL,
      {
        codigoEmpleado,
        cicloEscolar,
        page,
        app,
        idMunicipio,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data;  
  } catch (error) {
    console.error("Error al actualizar el municipio de la carga horaria:", error);
  }
};
