import axios from "axios";
import React, { useState } from "react";
import api from "../../../../hooks/api";

const useFetchGetListProfesores = () => {
  const [listaProfesores, setListaProfesores] = useState([]);
  const [isLoadingProfesores, setIsLoadingProfesores] = useState(false);

  const getListProfesores = async (body, sortField = null, sortDirection = "asc") => {
    try {
      setIsLoadingProfesores(true);
      const response = await api.post("/api/v1/jefe_depto/lista-profesores-oficio-evaluacion-estudiante", body);

      const updatedProfesores = response.data.map((profesor) => ({
        ...profesor,
        isEdit: false,
        hasChanged: false,
        ubicacion: JSON.parse(localStorage.getItem("municipio")),
      }));

      // Aplicar ordenamiento si se especifica
      let sortedProfesores = [...updatedProfesores];
      if (sortField) {
        sortedProfesores = sortedProfesores.sort((a, b) => {
          if (sortDirection === "asc") {
            return a[sortField] > b[sortField] ? 1 : -1;
          } else {
            return a[sortField] < b[sortField] ? 1 : -1;
          }
        });
      }
      console.log("sortedProfesores", sortedProfesores);

      setTimeout(() => {
        setListaProfesores(sortedProfesores);
        setIsLoadingProfesores(false);
      }, 700);
    } catch (error) {
      console.log(error);
      setIsLoadingProfesores(false);
    }
  };

  return {
    getListProfesores,
    isLoadingProfesores,
    listaProfesores,
    setListaProfesores,
  };
};

export default useFetchGetListProfesores;
