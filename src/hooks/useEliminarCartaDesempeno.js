import { useState } from 'react';
import { eliminarCartaDesempeno } from '../features/CartaDesempenoService';

const useEliminarCartaDesempeno = (filteredMaterias, setFilteredMaterias) => {
  const handleEliminar = async (idQr) => {
    try {
      await eliminarCartaDesempeno(idQr);
      console.log("Carta de Desempeño eliminada exitosamente.");

      // Actualizar la lista de materias eliminando ciertos datos, no la materia completa
      const updatedMaterias = filteredMaterias.map(materia => {
        if (materia.idQr === idQr) {
          return {
            ...materia,
            noOficio: "",          // Limpiar el campo noOficio
            calificacion: "",      // Limpiar el campo calificacion
            marcado: "0",          // Cambiar el estado a 0 indicando que la carta ya no existe
          };
        }
        return materia;
      });

      setFilteredMaterias(updatedMaterias);

    } catch (error) {
      console.error("Error al eliminar la Carta de Desempeño:", error);
    }
  };

  return {
    handleEliminar
  };
};

export default useEliminarCartaDesempeno;
