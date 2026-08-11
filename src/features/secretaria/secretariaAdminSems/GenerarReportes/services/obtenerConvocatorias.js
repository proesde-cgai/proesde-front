import axios from "axios";
import { getAccessToken } from "../../../../authService";  // Asumimos que tienes el servicio de autenticación separado

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_CONVOCATORIAS_URL = `${API_BASE_URL}/api/v1/convocatoria/all`; 

export const obtenerConvocatorias = async () => {
    try {
      const token = await getAccessToken(); // Obtener o renovar el access token
  
      const response = await axios.get(
        API_CONVOCATORIAS_URL,
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Se añade el token para autenticación
          },
        }
      );
      return response.data;  // Devolvemos los datos de la respuesta
    } catch (error) {
      console.error("Error al obtener las convocatorias:", error);
      throw new Error("No se pudo obtener la lista de convocatorias.");
    }
  };