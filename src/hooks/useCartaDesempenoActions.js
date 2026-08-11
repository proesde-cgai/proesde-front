import { useState } from 'react';
import { generarCartaDesempeno, editarCartaDesempeno } from '../features/CartaDesempenoService';

const useCartaDesempenoActions = (municipios, filteredMaterias, setFilteredMaterias, changes) => {
  
  const handleGenerarOActualizarPDF = async (materia, globalIndex) => {
    try {
      console.log(`Intentando generar o actualizar PDF para la materia con índice: ${globalIndex}`);
      console.log('Estado actual de changes:', changes);
      console.log('Estado de statusMunicipio:', materia.statusMunicipio);
      console.log(materia);
      const municipioSeleccionado = municipios.find(municipio => municipio.municipio === materia.ubicacion);
      const ubicacionId = municipioSeleccionado ? municipioSeleccionado.id : null;
  
      if (materia.marcado === "0") {
        console.log("Generando una nueva carta de desempeño...");
        await generarCartaDesempeno({ ...materia, ubicacion: ubicacionId });
        console.log("Carta de Desempeño generada exitosamente.");
        const updatedMaterias = [...filteredMaterias];
        updatedMaterias[globalIndex].marcado = "1";
        updatedMaterias[globalIndex].statusMunicipio = "1";
        setFilteredMaterias(updatedMaterias);
      } else if (
        materia.statusMunicipio === "0" || 
        changes[globalIndex]?.ubicacion || 
        changes[globalIndex]?.noOficio || 
        changes[globalIndex]?.calificacion
      ) {
        console.log("Actualizando una carta de desempeño existente...");
        await editarCartaDesempeno({ ...materia, ubicacion: ubicacionId });
        console.log("Carta de Desempeño actualizada exitosamente.");
        const updatedMaterias = [...filteredMaterias];
        updatedMaterias[globalIndex].statusMunicipio = "1"; // Cambiar el estado para indicar que se actualizó
        setFilteredMaterias(updatedMaterias);
      } else {
        console.log("No se detectaron cambios para actualizar la carta de desempeño.");
      }
    } catch (error) {
      console.error("Error al generar/actualizar la Carta de Desempeño:", error);
      alert("Ocurrió un error al generar/actualizar el pdf");
    }
  };

  return {
    handleGenerarOActualizarPDF
  };
};

export default useCartaDesempenoActions;
