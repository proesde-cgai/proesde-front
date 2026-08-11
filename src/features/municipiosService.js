import axios from "axios";
import { getAccessToken } from "./authService"; // Aseguramos que ya tienes el servicio de autenticación

// URL base para la API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_MUNICIPIOS_URL = `${API_BASE_URL}/api/v1/pais/municipio/all`;
const API_UPDATE_MUNICIPIO_URL = `${API_BASE_URL}/api/v1/jefe_depto/reporte/update-municipio-carta-desempeno-academico`;

// Servicio para obtener la lista de municipios
export const obtenerMunicipios = async () => {
  try {
    const token = await getAccessToken(); // Obtener o renovar el access token

    const response = await axios.get(API_MUNICIPIOS_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Se añade el token para autenticación
      },
    });
    console.log(response.data);
    const municipiosSosrted = response.data.sort((a, b) => {
      if (a.municipio < b.municipio) {
        return -1;
      }
      if (a.municipio > b.municipio) {
        return 1;
      }
      return 0;
    });
    console.log(municipiosSosrted);
    return municipiosSosrted; // Devolvemos los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener los municipios:", error);
    throw new Error("No se pudo obtener la lista de municipios.");
  }
};

// Servicio para actualizar el municipio de la carta de desempeño
export const actualizarMunicipioCartaDesempeno = async ({ codigoEmpleado, cicloEscolar, app, idMunicipio }) => {
  try {
    const token = await getAccessToken(); // Obtener o renovar el access token

    const response = await axios.post(
      API_UPDATE_MUNICIPIO_URL,
      {
        codigoEmpleado,
        cicloEscolar,
        app,
        idMunicipio,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Se añade el token para autenticación
        },
      }
    );
    return response.data; // Devolvemos los datos de la respuesta
  } catch (error) {
    console.error("Error al actualizar el municipio de la carta de desempeño:", error);
    throw new Error("No se pudo actualizar el municipio de la carta de desempeño.");
  }
};
