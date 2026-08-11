import { useState } from 'react';
import { consultarCartaDesempeno } from '../features/CartaDesempenoService';

const useEditMode = (filteredMaterias, setFilteredMaterias) => {
  const [editMode, setEditMode] = useState({});
  const [changes, setChanges] = useState({});
  const [savedChanges, setSavedChanges] = useState({});
  const [needsPdfUpdate, setNeedsPdfUpdate] = useState({});
  
  const toggleEditMode = (globalIndex) => {
    setEditMode((prevState) => {
      const newEditMode = {
        ...prevState,
        [globalIndex]: !prevState[globalIndex],
      };

      if (!newEditMode[globalIndex]) {
        
        setSavedChanges((prevSavedChanges) => ({
          ...prevSavedChanges,
          [globalIndex]: true,
        }));
      }

      return newEditMode;
    });
  };

  const handleInputChange = (globalIndex, field, value) => {
    const updatedMaterias = [...filteredMaterias];
    updatedMaterias[globalIndex][field] = value || "";
    setFilteredMaterias(updatedMaterias);

    setChanges((prevChanges) => ({
      ...prevChanges,
      [globalIndex]: {
        ...prevChanges[globalIndex],
        [field]: true,
      },
    }));

    setNeedsPdfUpdate((prevNeedsPdfUpdate) => ({
      ...prevNeedsPdfUpdate,
      [globalIndex]: true,
    }));
  };

  const handleSaveChanges = (globalIndex) => {
    setSavedChanges((prevSavedChanges) => ({
      ...prevSavedChanges,
      [globalIndex]: true,
    }));
    setChanges((prevChanges) => ({
      ...prevChanges,
      [globalIndex]: false,
    }));
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [globalIndex]: false,
    }));
  };

  const markPdfUpdated = (globalIndex) => {
    setNeedsPdfUpdate((prevNeedsPdfUpdate) => ({
      ...prevNeedsPdfUpdate,
      [globalIndex]: false, // Mark the PDF as updated
    }));
  }

  const handleConsultarPDF = async (idQr) => {
    try {
      await consultarCartaDesempeno(idQr);
    } catch (error) {
      console.error("Error al consultar la Carta de Desempeño:", error.message);
    }
  };

  const shouldShowUpdateButton = (globalIndex, materia) => {
    if (materia.marcado === "0") {
      return false;
    }
    return (
      materia.marcado === "1" &&
      (changes[globalIndex]?.ubicacion ||
        changes[globalIndex]?.noOficio ||
        changes[globalIndex]?.calificacion ||
        materia.statusMunicipio === "0")
    );
  };

  const isUpdateButtonClickable = (globalIndex, materia) => {
    // Asegurarse de que el campo changes[globalIndex] está definido y tiene valores válidos
    const hasChanges = changes[globalIndex] && (
      changes[globalIndex].ubicacion ||
      changes[globalIndex].noOficio ||
      changes[globalIndex].calificacion
    );

    // Si el statusMunicipio es "0", siempre debe permitir actualizar
    return hasChanges || materia.statusMunicipio === "0";
  };

  return {
    editMode,
    setEditMode,
    changes,
    savedChanges,
    toggleEditMode,
    handleInputChange,
    handleSaveChanges,
    handleConsultarPDF,
    shouldShowUpdateButton,
    isUpdateButtonClickable,
    markPdfUpdated,
    needsPdfUpdate,
  };
};

export default useEditMode;
