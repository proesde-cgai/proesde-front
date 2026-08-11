import { useCallback, useState } from "react";
import { obtenerMaterias, obtenerSizeList } from "../features/materiasService";

const useMaterias = (setMaterias, selectedCiclo, currentPage = 1, userInfo, setFilteredMaterias, getMunicipioSaved) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchMaterias = useCallback(async () => {
    try {
      setIsLoading(true);
      const codigoEmpleado = userInfo;
      const app = "PruebasSpertoDigital";

      const response = await obtenerMaterias(codigoEmpleado, selectedCiclo, currentPage, app);

      setMaterias(response);
      setFilteredMaterias(response.filter((materia) => materia.cicloEscolar === selectedCiclo));
      await getMunicipioSaved(response.filter((materia) => materia.cicloEscolar === selectedCiclo));
    } catch (error) {
      console.error("Error fetching materias:", error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCiclo, currentPage, setMaterias, setFilteredMaterias, userInfo]);

  return { fetchMaterias, isLoading };
};

export default useMaterias;
