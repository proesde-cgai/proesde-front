  import React, { useCallback, useState } from "react";
import api from "../../../../hooks/api";

const useFetchProfesoresList = (setSelectedMunicipio) => {
  const [listaProfesores, setListaProfesores] = useState([]);
  const [isLoadingProfesores, setIsLoadingProfesores] = useState(true);

  const getListProfesores = useCallback(async (data) => {
    const body = {
      codigoEmpleado: data.codigoEmpleado,
      cicloEscolar: data.cicloEscolar,
      page: data.page,
      app: "PruebasSpertoDigital",
    };
    try {
      setIsLoadingProfesores(true);
      const response = await api.post(
        "/api/v1/jefe_depto/lista-profesores-oficio-cumplimiento-plan-trabajo",
        body
      );
      setSelectedMunicipio(JSON.parse(localStorage.getItem("municipio")));
      setTimeout(() => {
        setListaProfesores(
          response.data.map((profesor) => ({
            ...profesor,
            isEdit: false,
            hasChanged: false,
            ubicacion: JSON.parse(localStorage.getItem("municipio")),
          }))
        );
        setIsLoadingProfesores(false);
      }, 700);
    } catch (error) {
      console.error(error);
      setIsLoadingProfesores(false);
    }
  }, [setSelectedMunicipio]);
  return {
    listaProfesores,
    isLoadingProfesores,
    getListProfesores,
    setListaProfesores,
  };
};

export default useFetchProfesoresList;
