import { useState, useCallback } from "react";
import axios from "axios";
import { getAccessToken } from "../../../../authService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_PUBLICACION_FINAL_URL = `${API_BASE_URL}/api/v1/publicacion/final`;
const API_GET_COMISIONES_URL = `${API_BASE_URL}/api/v1/comision/all`;

export const usePublicacionFinal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComisiones = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      const response = await axios.get(API_GET_COMISIONES_URL, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      console.error("Error al obtener las comisiones: ", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPublicacionFinal = useCallback(async (idComision) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      const response = await axios.get(API_PUBLICACION_FINAL_URL + `?idComision=${idComision}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "PublicacionFinal.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Error al descargar la Publicación Final: ", err.response);
      setError(err.response);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchPublicacionFinal, fetchComisiones, isLoading, error, setError };
};
