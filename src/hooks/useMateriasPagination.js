import React, { useState, useEffect, useCallback, useMemo } from "react";


const useMateriasPag = (materias) => {
  const [materiasPage, setMateriasPage] = useState(1);
  const materiasPerPage = 10;
  const totalMateriasPages = Math.ceil(materias.length / materiasPerPage);

  const currentMaterias = useMemo(() => {
    const startIndex = (materiasPage - 1) * materiasPerPage;
    const endIndex = startIndex + materiasPerPage;
    return materias.slice(startIndex, endIndex);
  }, [materias, materiasPage, materiasPerPage]);


  const handleFirstMateriasPage = () => setMateriasPage(1);
  const handleLastMateriasPage = () => setMateriasPage(totalMateriasPages);
  const handlePreviousMateriasPage = () => {
    if (materiasPage > 1) {
      setMateriasPage(materiasPage - 1);
    }
  };
  const handleNextMateriasPage = () => {
    if (materiasPage < totalMateriasPages) {
      setMateriasPage(materiasPage + 1);
    }
  };

  return {
    materiasPage,
    materiasPerPage,
    totalMateriasPages,
    currentMaterias,
    handleFirstMateriasPage,
    handleLastMateriasPage,
    handlePreviousMateriasPage,
    handleNextMateriasPage,
    setMateriasPage,
    
  };
};

export default useMateriasPag;
