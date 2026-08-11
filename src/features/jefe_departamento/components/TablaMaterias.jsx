import React, { useState, useEffect, useCallback, useMemo } from "react";
import Paginacion from "../../../reutilizable/PaginacionCarta";
import FiltrosMaterias from "./FiltrosMaterias";
import TablaMateriasDetalle from "./TablaMateriasDetalle";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Loading from "../../../reutilizable/Loading";

// Estilos
import styles from "./TablaMaterias.module.css";

// Custom hooks
import useMunicipios from "../../../hooks/useMunicipios";
import useCiclosEscolares from "../../../hooks/useCiclosEscolares";
import useMaterias from "../../../hooks/useMaterias";
import useEditMode from "../../../hooks/useEditMode";
import useMateriasPag from "../../../hooks/useMateriasPagination";
import useProfesorPag from "../../../hooks/useProfesorPag";
import useCartaDesempenoActions from "../../../hooks/useCartaDesempenoActions";
import useEliminarCartaDesempeno from "../../../hooks/useEliminarCartaDesempeno";
import useCicloDisponibilidad from "../../../hooks/useCicloDisponibilidad";
import useMunicipioChange from "../../../hooks/useMunicipioChange";
import useFilteredMaterias from "../../../hooks/useFilteredMateriasPag";
import useCicloChange from "../../../hooks/useCicloChange";
import useSaveCartasJefeDepto from "../useSaveCartasJefeDepto";

const TablaMaterias = ({ materias = [], setMaterias, onEliminar, userInfo, totalProfesor }) => {
  const { municipios } = useMunicipios();
  const {
    saveCartaDesempenoDocente,
    response: { error, data, loading },
  } = useSaveCartasJefeDepto();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filteredMaterias, setFilteredMaterias] = useState([]);
  const [materiasState, setMateriasState] = useState(materias); // Ensure this is set up
  const materiasPerPage = 10;
  const [isEditing, setIsEditing] = useState(false);

  const resetSortConfig = () => setSortConfig({ key: null, direction: "asc" });

  // Move usePagination before useCicloChange so setCurrentPage is available
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    handleFirstPage,
    handleLastPage,
    handlePreviousPage,
    handleNextPage,
    setCurrentPage,
  } = useProfesorPag(totalProfesor);

  const {
    materiasPage,
    totalMateriasPages,
    currentMaterias,
    handleFirstMateriasPage,
    handleLastMateriasPage,
    handlePreviousMateriasPage,
    handleNextMateriasPage,
    setMateriasPage,
  } = useMateriasPag(filteredMaterias);

  const handleProfesorNextPage = () => {
    resetSortConfig();
    handleNextPage(); //siguiente pagina profesor
    setMateriasPage(1); // resetear pagina 1 de materias
  };

  const handleProfesorPreviousPage = () => {
    resetSortConfig();
    handlePreviousPage(); // pagina enterior profesor
    setMateriasPage(1); // Reset resetear materias page 1
  };

  const handleProfesorFirstPage = () => {
    resetSortConfig();
    handleFirstPage(); // pagina uno profesor
    setMateriasPage(1); // Reset resetear materias page 1
  };

  const handleProfesorLastPage = () => {
    resetSortConfig();
    handleLastPage(); // pagina final profesor
    setMateriasPage(1); // Reset resetear materias page 1
  };

  const { selectedCiclo, handleCicloChange } = useCicloChange(setCurrentPage);
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const { ciclosEscolares, fetchCiclosEscolares } = useCiclosEscolares();

  const { handleMunicipioChange, municipioError, getMunicipioSaved } = useMunicipioChange(
    municipios,
    selectedCiclo,
    filteredMaterias,
    setFilteredMaterias,
    currentPage,
    userInfo,
    setSelectedMunicipio,
    "1"
  );

  const { cicloDisponible, error: cicloError } = useCicloDisponibilidad(selectedCiclo);

  const { fetchMaterias, isLoading } = useMaterias(
    setMaterias,
    selectedCiclo,
    currentPage,
    userInfo,
    setFilteredMaterias,
    getMunicipioSaved
  ); //hook para obtener materias

  const {
    editMode,
    setEditMode,
    changes,
    savedChanges,
    toggleEditMode,
    handleInputChange,
    handleSaveChanges,
    handleConsultarPDF,
    needsPdfUpdate,
    markPdfUpdated,
  } = useEditMode(filteredMaterias, setFilteredMaterias);

  useEffect(() => {
    const updateMaterias = async () => {
      if (!selectedCiclo) return;
      resetSortConfig();
      fetchMaterias();
    };
    updateMaterias();
  }, [selectedCiclo, currentPage, fetchMaterias, itemsPerPage]);

  const { handleGenerarOActualizarPDF } = useCartaDesempenoActions(
    municipios,
    filteredMaterias,
    setFilteredMaterias,
    changes
  );

  const { handleEliminar } = useEliminarCartaDesempeno(filteredMaterias, setFilteredMaterias);

  const { filteredMateriasSearch, handleSearchChange, search } = useFilteredMaterias(materias, () =>
    setMateriasPage(1)
  );

  useEffect(() => {
    setFilteredMaterias(filteredMateriasSearch);
  }, [filteredMateriasSearch]);

  useEffect(() => {
    if (Array.isArray(ciclosEscolares) && ciclosEscolares.length === 0) {
      fetchCiclosEscolares();
    }
  }, [ciclosEscolares, fetchCiclosEscolares]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedMaterias = [...filteredMaterias].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredMaterias(sortedMaterias);
  };

  const handleGuardarCalificacion = async (item) => {
    await saveCartaDesempenoDocente(item);
    if (!error) {
      console.log("Calificacion guardada");
    } else if (error) {
      console.error("Error guardando calificacion");
    }
  };

  const handleCargaSort = (key) => {
    // Determine sort direction
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedMaterias = [...filteredMaterias].sort((a, b) => {
      const aValue = parseFloat(a[key]);
      const bValue = parseFloat(b[key]);

      if (isNaN(aValue)) return direction === "asc" ? 1 : -1;
      if (isNaN(bValue)) return direction === "asc" ? -1 : 1;

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredMaterias(sortedMaterias);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? <FaArrowUp /> : <FaArrowDown />;
    } else {
      return <FaArrowDown />;
    }

  };



  const handleMunicipioChangeWrapper = (e) => {
    const newMunicipio = e.target.value;

    const confirmChange = window.confirm(
      "¿Estás seguro de que deseas cambiar el municipio? Esto actualizará todos los oficios relacionados."
    );

    if (!confirmChange) {
      return;
    }

    setSelectedMunicipio(Number(newMunicipio));
    handleMunicipioChange(Number(newMunicipio));
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.filter} ${styles.marginBottom}`}>
        <label htmlFor="cicloEscolar">CICLO ESCOLAR: </label>
        <select
          id="cicloEscolar"
          value={selectedCiclo}
          onChange={(e) => {
            handleCicloChange(e);
            if (editMode) {
              setEditMode(false); // Reset edit mode when changing ciclo escolar
            }
          }}
          disabled={!cicloDisponible}
        >
          <option value="">Seleccione un ciclo escolar</option>
          {ciclosEscolares.length > 0 ? (
            ciclosEscolares.map((ciclo) => (
              <option key={ciclo} value={ciclo}>
                {ciclo}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No hay ciclos disponibles
            </option>
          )}
        </select>
      </div>

      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        selectedCiclo && (
          <>
            <div className={`${styles.filterRow}`}>
              <FiltrosMaterias
                searchTerm={search}
                handleSearchChange={handleSearchChange}
                municipios={municipios}
                selectedMunicipio={selectedMunicipio}
                handleMunicipioChange={handleMunicipioChangeWrapper}
                cicloDisponible={cicloDisponible}
              />
            </div>

            <TablaMateriasDetalle
              currentItems={currentMaterias}
              editMode={editMode}
              municipios={municipios}
              changes={changes}
              cicloDisponible={cicloDisponible}
              handleInputChange={handleInputChange}
              toggleEditMode={toggleEditMode}
              handleSaveChanges={handleSaveChanges}
              handleGenerarOActualizarPDF={handleGenerarOActualizarPDF}
              handleConsultarPDF={handleConsultarPDF}
              handleEliminar={handleEliminar}
              getSortIcon={getSortIcon}
              handleSort={handleSort}
              handleCargaSort={handleCargaSort}
              setIsEditing={setIsEditing}
              isEliminarDisabled={(materia) => materia.marcado === "0"}
              materiasPerPage={materiasPerPage} // Pass per-page limit
              currentPage={materiasPage}
              needsPdfUpdate={needsPdfUpdate}
              markPdfUpdated={markPdfUpdated}
              savedChanges={savedChanges}
              selectedMunicipio={selectedMunicipio}
              handleGuardarCalificacion={handleGuardarCalificacion}
            />

            <Paginacion
              currentPage={materiasPage}
              totalPages={totalMateriasPages}
              onFirstPage={handleFirstMateriasPage}
              onLastPage={handleLastMateriasPage}
              onPreviousPage={handlePreviousMateriasPage}
              onNextPage={handleNextMateriasPage}
              disableNext={isEditing}
            />
            <div className="pagination-label">Materias</div>

            <Paginacion
              currentPage={currentPage}
              totalPages={totalPages}
              onFirstPage={handleProfesorFirstPage}
              onLastPage={handleProfesorLastPage}
              onPreviousPage={handleProfesorPreviousPage}
              onNextPage={handleProfesorNextPage}
              disableNext={isEditing}
            />
            <div className="pagination-label">Profesores</div>
          </>
        )
      )}
    </div>
  );
};

export default TablaMaterias;
