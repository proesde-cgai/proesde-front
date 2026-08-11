import axios from 'axios'; 
import { getAccessToken } from "./authService";  // Asegúrate de tener este servicio de autenticación

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const cicloEscolarService = {
  async checkCicloEscolarDisponibilidad() {
    try {
      // Obtener o renovar el token de acceso
      const token = await getAccessToken();
      
      const response = await axios.get(`${API_BASE_URL}/api/v1/jefe_depto/ciclo-escolar-disponibilidad`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Añadir el token al header
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error checking ciclo escolar disponibilidad:', error);
      throw error;
    }
  },
};

export default cicloEscolarService;
