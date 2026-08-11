import axios from "axios";
import { getAccessToken } from "./authService";

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Servicio para validar el QR token
export const validarQRToken = async (token) => {

  const decodedToken = decodeURIComponent(token);
  console.log(decodedToken)
  try {
    const response = await axios.post(`${API_BASE_URL}/public/validadorQR`, { token: decodedToken });
    return response.data;
  } catch (error) {
    console.error("Error al validar el token QR:", error);
    throw new Error("No se pudo validar el token QR.");
  }
};
