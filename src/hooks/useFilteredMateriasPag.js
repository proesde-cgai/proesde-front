import { useState, useEffect } from "react";

const useFilteredMaterias = (materias, resetMateriasPage) => {
  const [search, setSearch] = useState("");
  const [filteredMateriasSearch, setFilteredMateriasSearch] = useState(materias);

  useEffect(() => {
    if (!search.trim()) {
      
      setFilteredMateriasSearch(materias);
    } else {
      const lowerCaseSearch = search.toLowerCase();
      const filtered = materias.filter(
        (materia) =>
          materia.nombreProfesor.toLowerCase().includes(lowerCaseSearch) ||
          materia.codigoProfesor.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredMateriasSearch(filtered);
    }
  }, [search, materias]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    resetMateriasPage();
  };

  return {
    search,
    filteredMateriasSearch,
    handleSearchChange,
  };
};

export default useFilteredMaterias;
