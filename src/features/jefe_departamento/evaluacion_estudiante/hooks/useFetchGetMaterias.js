import { useCallback } from "react";
import api from "../../../../hooks/api";

const useFetchGetMaterias = () => {
  const getAllMateriasProfesor = useCallback(async (body) => {
    try {
      const response = await api.post(
        "/api/v1/jefe_depto/lista-materias",
        body
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  }, []);
  return {
    getAllMateriasProfesor,
  };
};

export default useFetchGetMaterias;
