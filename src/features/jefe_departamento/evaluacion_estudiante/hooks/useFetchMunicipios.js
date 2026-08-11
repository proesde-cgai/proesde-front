import React from "react";
import api from "../../../../hooks/api";

const useFetchMunicipios = () => {
  const getAllMunicipios = async () => {
    try {
      const response = await api.get("/api/v1/pais/municipio/all");
      const data = response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  return {
    getAllMunicipios,
  };
};

export default useFetchMunicipios;
