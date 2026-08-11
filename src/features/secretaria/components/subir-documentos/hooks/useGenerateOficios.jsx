import { useState } from "react";
import {
  fetchBuscarDocumento,
  fetchGuardarDocumento,
  fetchEliminarArchivo,
} from "../services/generateOficios";

export const useSubirDocumentos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [documentos, setDocumentos] = useState([]);

  const buscarDocumento = async (codigoProfesor) => {
    setIsLoading(true);
    try {
      const data = await fetchBuscarDocumento(codigoProfesor);
      console.log(data)
      setDocumentos(data);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const guardarDocumento = async (formData) => {
    setIsLoading(true);
    try {
      const data = await fetchGuardarDocumento(formData);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarArchivo = async (payload) => {
    setIsLoading(true);
    try {
      const data = await fetchEliminarArchivo(payload);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    documentos,
    buscarDocumento,
    guardarDocumento,
    eliminarArchivo,
  };
};
