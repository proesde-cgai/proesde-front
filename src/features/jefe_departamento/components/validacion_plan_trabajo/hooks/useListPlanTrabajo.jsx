import { useCallback, useState } from "react";
import {
  obtenerCicloActual,
  obtenerSizeList,
  getReportPT,
  getDetallePT,
  generatePdfPT,
  handleStatusPT,
  updatePT,
  deletePT,
} from "../services/listPlanTrabajo";

const useListPlanTrabajo = (
  setPlanTrabajo,
  selectedCiclo,
  currentPage = 1,
  userInfo,
  setFilteredPlanTrabajos,
  getMunicipioSaved,
  selectedMunicipio
) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchTotalSize = useCallback(async () => {
    try {
      setIsLoading(true);
      const size = await obtenerSizeList(selectedCiclo, userInfo);
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
  }, [selectedCiclo, userInfo]);

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

  const fetchReportPlanTrabajo = useCallback(async (municipios) => {
    try {
      setIsLoading(true);
      const response = await getReportPT(currentPage, selectedCiclo, userInfo);
      if (!response) {
        console.warn("No report found.");
        return;
      }
      await getMunicipioSaved(response, municipios);
      console.log(selectedMunicipio);
      return response;
    } catch (error) {
      console.error("Error fetching report:", error);
      return;
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCiclo, currentPage, setFilteredPlanTrabajos, userInfo, selectedMunicipio]);

  const getDetallePlanTrabajo = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const response = await getDetallePT(id);
      if (!response) {
        console.warn("No detalle found.");
        return;
      }
      return response;
    } catch (error) {
      console.error("Error fetching detalle:", error);
      return;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changeStatusPT = useCallback(async (payload) => {
    try {
      setIsLoading(true);
      const response = await handleStatusPT(payload);
      if (!response) {
        console.warn("No PDF found.");
        return;
      }
      return response;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return;
    }
  }, []);

  const updatedplanTrabajo = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const response = await updatePT(id);
      if (!response) {
        console.warn("No plan de trabajo found.");
      }
      return response;
    } catch (error) {
      console.error("Error updating plan de trabajo:", error);
      return;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePlanTrabajo = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const response = await deletePT(id);
      if (!response) {
        console.warn("No plan de trabajo found.");
        return;
      }
      return response;
    } catch (error) {
      console.error("Error deleting plan de trabajo:", error);
      return;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchTotalSize,
    fetchCicloActual,
    fetchReportPlanTrabajo,
    getDetallePlanTrabajo,
    deletePlanTrabajo,
    updatedplanTrabajo,
    changeStatusPT,
    generatePdfPT,
    isLoading,
  };
};

export default useListPlanTrabajo;
