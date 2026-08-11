import { useState, useEffect } from "react";
import { getActividadesNuevaConvocatoria, updateActividad, deleteAsociacionActividades } from "../services/actividadService";

const useActividadesAsociadas = () => {
  const [actividades, setActividades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActividades = async () => {
    setIsLoading(true);
    try {
      const data = await getActividadesNuevaConvocatoria();
      setActividades(data);
    } catch (error) {
      console.error("Error al cargar las actividades:", error);
      setError("Error al cargar las actividades");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActividades();
  }, []);

  const modifyActividad = async (data) => {
    try {
      const response = await updateActividad(data);

      if (!response) {
        alert("Error desconocido al modificar la actividad.");
        return false;
      }

      if (response.status === 200) {
        alert("Actividad modificada correctamente");
        return true;
      }

      if (response.status === 400) {
        const errorMessage = response.data?.Error || "Error desconocido al modificar la actividad.";
        alert(`Error: ${errorMessage}`);
        return false;
      }

      alert(`Error al modificar la actividad. Código de estado: ${response.status}`);
      return false;
    } catch (error) {
      console.error("Error modificando actividad:", error);
      alert("Error al modificar la actividad.");
      return false;
    }
  };
  const eliminarAsociacion = async (idPrincipal, idSecundarias) => {
    setIsLoading(true);
    try {
      const response = await deleteAsociacionActividades(idPrincipal, idSecundarias);

      if (response.status === 200) {
        alert("Asociación eliminada correctamente.");
        return true;
      } else {
        alert(`Error al eliminar asociación. Código: ${response.status}`);
        return false;
      }
    } catch (error) {
      alert("Error al eliminar la asociación.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  return {
    actividades, isLoading, error, fetchActividades, modifyActividad, eliminarAsociacion
  };
};

export default useActividadesAsociadas;
