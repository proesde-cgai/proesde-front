import { useState } from "react";
import {
  buscar_academic_service,
  get_data_academic_service,
  toggle_state_academic,
} from "../services";
import { dataInformationAcademicAdapter } from "../adapters/index";

const initialStatusResponse = {
  loading: false,
  error: false,
  message: "",
};

export const useActivarInactivarSolicitud = () => {
  const [statusResponse, setStatusResponse] = useState(initialStatusResponse);
  const [codigo, setCodigo] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [dataAcademic, setDataAcademic] = useState(null);

  const onChange = (e) => {
    const { value } = e.target;
    if (value.length <= 7) {
      setCodigo(value);
    }
  };

  const onChangeCheckbox = (e) => {
    const { name } = e.target;

    if (name === "block") {
      setBlocked(true);
      return;
    }

    setBlocked(false);
  };

  const handleBuscarSolicitud = async (e) => {
    e.preventDefault();
    setStatusResponse({ ...statusResponse, loading: true });
    setDataAcademic(null);
    try {
      const response = await buscar_academic_service(codigo);
      const dataAcademicAdapter = dataInformationAcademicAdapter(response);
      setDataAcademic({
        ...dataAcademicAdapter,
        activo: response.activo,
      });
      setBlocked(!response.activo);
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

  console.log(dataAcademic);

  const handleGuardarSolicitud = async (e) => {
    e.preventDefault();
    const { activo } = dataAcademic;
    setStatusResponse({ ...statusResponse, loading: true });

    if (activo !== blocked) {
      const messageSuccess = `Academico ${
        activo ? "Desbloqueado" : "Bloqueado"
      } correctamente.`;
      setStatusResponse({ ...statusResponse, message: messageSuccess });
      return;
    }

    try {
      await toggle_state_academic(codigo, !blocked);
      setDataAcademic({ ...dataAcademic, activo: !activo });
      const message = `Academico ${
        blocked ? "Bloqueado" : "Desbloqueado"
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
    blocked,
    codigo,
    ...statusResponse,
    dataAcademic,
    // methods
    onChange,
    handleBuscarSolicitud,
    handleGuardarSolicitud,
    onChangeCheckbox,
  };
};
