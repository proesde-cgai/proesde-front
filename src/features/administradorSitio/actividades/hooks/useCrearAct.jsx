import { useState, useCallback } from "react";
import { saveActividad } from "../services/crearActSevices";

const useActividad = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createActividad = useCallback(async (actividadData) => {
    setIsLoading(true);
    try {
      const response = await saveActividad(actividadData);
      return response;
    } catch (error) {
      console.error("Error in createActividad:", error);
      return;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createActividad, isLoading };
};

export default useActividad;