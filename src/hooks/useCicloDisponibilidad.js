// Custom hook: useCicloDisponibilidad.js
import { useState, useEffect } from 'react';
import cicloEscolarService from '../features/cicloEscolarService';

const useCicloDisponibilidad = (selectedCiclo) => {
  const [cicloDisponible, setCicloDisponible] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkCicloDisponibilidad = async () => {
      if (selectedCiclo) {
        try {
          const disponibilidad = await cicloEscolarService.checkCicloEscolarDisponibilidad();
          setCicloDisponible(disponibilidad);
        } catch (err) {
          console.error("Error al verificar la disponibilidad del ciclo escolar:", err);
          setError(err);
          setCicloDisponible(false);
        }
      }
    };

    checkCicloDisponibilidad();
  }, [selectedCiclo]);

  return { cicloDisponible, error };
};

export default useCicloDisponibilidad;
