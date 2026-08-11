import { useState } from "react";
import { buscarSolicitud, toggleSolicitud } from "../services";

const initialStatusResponse = {
  loading: false,
  error: false,
  message: "",
};

export const useActivarInactivarSolicitud = () => {
  const [statusResponse, setStatusResponse] = useState(initialStatusResponse);
  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState("");
  const [dataAcademic, setDataAcademic] = useState(null);

  const onChange = (e) => {
    const { value, name } = e.target;
    if (name === "estado") {
      setEstado(value);
      return;
    }

    if (value.length <= 7) {
      setCodigo(value);
    }
  };

  const handleBuscarSolicitud = async (e) => {
    e.preventDefault();
    setStatusResponse({ ...statusResponse, loading: true });
    try {
      const response = await buscarSolicitud(codigo);
      setEstado(response.activo ? "activo" : "inactivo");
      setDataAcademic(response);
      setStatusResponse(initialStatusResponse);
    } catch (error) {
      setStatusResponse({
        ...statusResponse,
        error: true,
        message: error.message,
      });
    } finally {
      setTimeout(() => {
        setStatusResponse(initialStatusResponse);
      }, 3000);
    }
  };

  const handleGuardarSolicitud = async (e) => {
    e.preventDefault();
    const { id, activo } = dataAcademic;
    setStatusResponse({ ...statusResponse, loading: true });

    if (!id) {
      const error = "No se encontró un ID válido para la solicitud.";
      setStatusResponse({ ...statusResponse, error: true, message: error });
      return;
    }

    const currentState = activo ? "activo" : "inactivo";
    if (currentState === estado) {
      const messageSuccess = `Solicitud ${
        estado === "activo" ? "activada" : "inactivada"
      } correctamente.`;
      setStatusResponse({ ...statusResponse, message: messageSuccess });
      return;
    }

    try {
      await toggleSolicitud(id, estado === "activo");
      setDataAcademic({ ...dataAcademic, activo: !activo });
      const message = `Solicitud ${
        estado === "activo" ? "activada" : "inactivada"
      } correctamente.`;
      setStatusResponse({
        ...statusResponse,
        message: message,
      });
    } catch (error) {
      setStatusResponse({
        ...statusResponse,
        error: true,
        message: error.message,
      });
    } finally {
      setTimeout(() => {
        setStatusResponse(initialStatusResponse);
      }, 3000);
    }
  };

  return {
    // properties
    estado,
    codigo,
    ...statusResponse,
    dataAcademic,
    // methods
    onChange,
    handleBuscarSolicitud,
    handleGuardarSolicitud,
  };
};
