import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/useAuthStore";
import { useSearchStore } from "../store/useSearchStore";
// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Concatenar el contexto y el servicio/recurso
const API_URL = `${API_BASE_URL}/api/v1/auth/login`;
const API_REFRESH_URL = `${API_BASE_URL}/api/v1/auth/refresh-token`;
const API_LOGIN_ROLES = `${API_BASE_URL}/api/v1/auth/rol-user`;
const API_FRONT_VERSION = `${API_BASE_URL}/public/version`;

export const login = async (username, password) => {
  try {
    const version = await axios.get(API_FRONT_VERSION + `?version=${process.env.REACT_APP_FRONT_VERSION}`);
  
    const response = await axios.post(API_URL, {
      username,
      pwd: password,
    });

    console.log("Login response:", response.data);

    if (response.data) {
      const { accessToken, refreshToken } = response.data;

      if (typeof accessToken === "string" && accessToken.trim() !== "") {
        const decodedToken = jwtDecode(accessToken);
        const roles = decodedToken.roles || [];
        const rolesAsArray = Array.isArray(roles) ? roles : [roles];

        // Actualizamos Zustand con el token y la información del usuario
        const setAccessToken = useAuthStore.getState().setAccessToken;
        const setRefreshToken = useAuthStore.getState().setRefreshToken;
        const setUserInfo = useAuthStore.getState().setUserInfo;

        // Almacenar tokens y timestamp en Zustand y en localStorage
        const sessionTimestamp = new Date().toISOString();
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userName", username);
        localStorage.setItem("sessionTimestamp", sessionTimestamp); // <-- Guarda el timestamp de la sesión

        setUserInfo({
          roles: rolesAsArray,
          username: decodedToken.sub,
        });

        return { accessToken, refreshToken, roles, rolesAsArray };
      } else {
        throw new Error("Invalid token format received from the server");
      }
    }
  } catch (error) {
    console.log(error?.response?.data);

    if (error.response ) {
      const errorMessage = error.response.data?.mensaje || error.response.data;
      const mensajes = Array.isArray(errorMessage) 
        ? errorMessage.map(msg => msg.trim()).join("<br><br>")
        : errorMessage.split(",").map(msg => msg.trim()).join("<br><br>");

      if (error.response.status === 403 && mensajes === "Version no valida.") {

        throw new Error(
          `Estimado usuario, no cuenta con la última versión del sistema.
  
          Limpie la caché de su navegador o ingrese en modo incognito para asegurar que cuenta con los últimos cambios liberados.
          `
          );
      } else if (error.response.status === 403){
        throw new Error("¿Tienes algún problema con el acceso? <a href='https://script.google.com/macros/s/AKfycby-fPIycs9-u0DEA0eShKeyweSHQhJ6O3I-xngFayUG0_PFJE7Sqkn8_17l-ZU-CvUO2w/exec' target='_blank' rel='noopener noreferrer' style='color:#1e293b; font-weight:800; text-decoration:underline;'>Solicita ayuda aquí.</a>");
      }
            
      else {
        throw new Error(mensajes || "Login fallido. Verifique sus credenciales.");
      }
    }
      throw new Error("Login fallido. Sucedio un error inesperado.");
  }
};


export const loginRoles = async (token, selectedRole) => {
  try {
    const response = await axios.post(
      API_LOGIN_ROLES,
      { rol: selectedRole },
      {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Login response roles:", response.data);

    if (response.data) {
      const { accessToken, refreshToken } = response.data;

      if (typeof accessToken === "string" && accessToken.trim() !== "") {
        const decodedToken = jwtDecode(accessToken);
        const roles = decodedToken.roles || [];
        const rolesAsArray = Array.isArray(roles) ? roles : [roles];

        // Actualizamos Zustand con el token y la información del usuario
        const setAccessToken = useAuthStore.getState().setAccessToken;
        const setRefreshToken = useAuthStore.getState().setRefreshToken;
        const setUserInfo = useAuthStore.getState().setUserInfo;

        // Almacenar tokens en Zustand y en localStorage
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem("accessToken", accessToken); // <-- Asegúrate de almacenar el access token
        localStorage.setItem("refreshToken", refreshToken); // <-- Almacena también el refresh token

        setUserInfo({
          roles: rolesAsArray,
          username: decodedToken.sub,
        });

        return { accessToken, refreshToken, roles, rolesAsArray };
      } else {
        throw new Error("Invalid token format received from the server");
      }
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Login failed. Please check your credentials.");
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(API_REFRESH_URL, null, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (response.data) {
      const { accessToken } = response.data;
      if (typeof accessToken !== "string" || accessToken.trim() === "") {
        throw new Error("Invalid token format received from the server");
      }

      const decodedToken = jwtDecode(accessToken);
      const roles = decodedToken.roles || [];
      const rolesAsArray = Array.isArray(roles) ? roles : [roles];

      useAuthStore.getState().setAccessToken(accessToken);
      useAuthStore.getState().setUserInfo({
        roles: rolesAsArray,
        username: decodedToken.sub,
      });

      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    }
  } catch (error) {
    console.error("Error while refreshing access token:", error);
    throw error;
  }
};
export const isTokenExpired = (token) => {
  if (!token) return true;

  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Tiempo actual en segundos

  return decodedToken.exp < currentTime;
};

export const getDecodedToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    return jwtDecode(accessToken);
  }
  return null;
};

export const getAccessTokenRefreshDelay = (secondsBeforeExpire = 60) => {
  const decodedToken = getDecodedToken();
  if (!decodedToken?.exp) {
    return 30 * 60 * 1000;
  }

  const refreshAtMs = (decodedToken.exp - secondsBeforeExpire) * 1000;
  const remainingMs = refreshAtMs - Date.now();

  // Evitar delays negativos o demasiado cortos por diferencias de reloj.
  return Math.max(remainingMs, 1000);
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.clear();
  // Limpiar completamente el estado de búsqueda persistido y en memoria
  if (useSearchStore?.getState) {
    const { clearFormData, clearSearch } = useSearchStore.getState();
    clearFormData && clearFormData();
    clearSearch && clearSearch();
  }
};

export const getAccessToken = async () => {
  let accessToken = localStorage.getItem("accessToken");

  if (!accessToken || isTokenExpired(accessToken)) {
    // El token ha expirado o no está presente, refrescarlo
    console.log("Access token expired. Refreshing...");
    accessToken = await refreshAccessToken();
  }

  return accessToken;
};

export const fetchUserProfile = async () => {
  try {
    const token = await getAccessToken(); // Obtener o renovar el access token
    const response = await axios.get("/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
