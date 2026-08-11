import { useState, useEffect } from 'react';
import { getActividadesSinConvocatoria, saveAsociacionActividades } from '../services/actividadService';

const useActividades = () => {
  const [actividadesPrincipales, setActividadesPrincipales] = useState([]);
  const [actividadesSecundarias, setActividadesSecundarias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActividades = async () => {
    setIsLoading(true);
    try {
      const actividades = await getActividadesSinConvocatoria();
      const principales = actividades.filter(act => act.menuPrimario);
      const secundarias = actividades.filter(act => !act.menuPrimario);
      setActividadesPrincipales(principales);
      setActividadesSecundarias(secundarias);
    } catch (error) {
      console.error("Error fetching actividades:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAsociacion = async (data) => {
    setIsLoading(true);
    try {
      const response = await saveAsociacionActividades(data);
      return response;
    } catch (error) {
      console.error("Error saving asociacion:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActividades();
  }, []);

  return {
    actividadesPrincipales,
    actividadesSecundarias,
    isLoading,
    saveAsociacion,
  };
};

export default useActividades;