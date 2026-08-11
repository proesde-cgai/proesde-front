import { useCallback, useState } from "react";
import { obtenerDocentes, obtenerCicloActual, obtenerSizeList, obtenerMaterias } from "../services/listCargaHoraria";

const useListCargaHoraria = (
  setMaterias,
  selectedCiclo,
  currentPage = 1,
  userInfo,
  setFilteredMaterias,
  getMunicipioSaved
) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchTotalSize = useCallback(async () => {
    try {
      setIsLoading(true);
      const size = await obtenerSizeList();
      if (!size) {
        console.warn("Size is empty or undefined.");
        return 0;
      }
      return size;
    } catch (error) {
      console.error("Error fetching total size:", error);
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCicloActual = useCallback(async () => {
    try {
      setIsLoading(true);
      const ciclo = await obtenerCicloActual();
      if (!ciclo) {
        console.warn("Ciclo actual is empty or undefined.");
        return null;
      }
      return ciclo;
    } catch (error) {
      console.error("Error fetching ciclo actual:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMaterias = useCallback(async (codigoDocente, idQr, cicloEscolar) => {
    try {
      const data = await obtenerMaterias(codigoDocente, cicloEscolar, idQr);
      if (!data || data.length === 0) {
        console.warn("No materias found.");
        return [];
      }
      return data;
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return [];
    }
  }, []);
  const fetchDocentes = useCallback(async () => {
    try {
      setIsLoading(true);
      const codigoEmpleado = userInfo;
      const app = "PruebasSpertoDigital";

      const response = await obtenerDocentes(codigoEmpleado, selectedCiclo, currentPage, app);
      if (!response || response.length === 0) {
        console.warn("No docentes found.");
        setMaterias([]);
        setFilteredMaterias([]);
        return;
      }

      setMaterias(response);
      setFilteredMaterias(response.filter((materia) => materia.cicloEscolar === selectedCiclo));
await getMunicipioSaved(response);
    } catch (error) {
      console.error("Error fetching docentes:", error);
      setMaterias([]);
      setFilteredMaterias([]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCiclo, currentPage, setMaterias, setFilteredMaterias, userInfo]);
  return { fetchDocentes, fetchTotalSize, fetchCicloActual, fetchMaterias, isLoading };
};

export default useListCargaHoraria;
