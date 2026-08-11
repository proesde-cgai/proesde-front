import axios from 'axios';
import { getAccessToken } from "../../../../authService";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_UPDATE_MUNICIPIO_URL = `${API_BASE_URL}/api/v1/jefe_depto/reporte/actualizar-municipios`;


export const actualizarMunicipioPlanTrabajo = async ({ codigoEmpleado, cicloEscolar, idMunicipio }) => {
  try {
    const token = await getAccessToken();

    const response = await axios.put(
      API_UPDATE_MUNICIPIO_URL,
      {
        codigoEmpleado,
        cicloEscolar,
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
    console.error("Error al actualizar el municipio del plan de trabajo:", error);
  }
};
