import React, { useState, useEffect } from "react";
import Paginacion from "../../../../../reutilizable/Paginacion";
import FiltroCargaHoraria from "../components/FiltroCargaHoraria";
import TablaCargaHorariaDetalles from "../components/TablaCargaHorariaDetalles";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import styles from "../styles/TablaCargaHoraria.module.css";

import useMunicipios from "../../../../../hooks/useMunicipios";
import useListCargaHoraria from "../hooks/useListCargaHoraria";
import useEditMode from "../../../../../hooks/useEditMode";
import usePagination from "../../../../../hooks/usePagination";
import useCartaDesempenoActions from "../../../../../hooks/useCartaDesempenoActions";
import useEliminarCartaDesempeno from "../../../../../hooks/useEliminarCartaDesempeno";
import useCicloDisponibilidad from "../../../../../hooks/useCicloDisponibilidad";
import useFilteredMaterias from "../../../../../hooks/useFilteredMaterias";
import useUpdateMunicipio from "../hooks/useUpdateMunicipio";

const TablaCargaHoraria = ({ materias, setMaterias, userInfo }) => {
  const { municipios } = useMunicipios();

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [filteredMaterias, setFilteredMaterias] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    currentItems,
    handleFirstPage,
    handleLastPage,
    handlePreviousPage,
    handleNextPage,
    setCurrentPage,
  } = usePagination(filteredMaterias, totalItems);

  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [currentCiclo, setCurrentCiclo] = useState("");

  const { cicloDisponible } = useCicloDisponibilidad(currentCiclo);

  const { handleMunicipioChange, getMunicipioSaved } = useUpdateMunicipio(
    municipios,
    currentCiclo,
    filteredMaterias,
    setFilteredMaterias,
    userInfo,
    setSelectedMunicipio
  );

  const { fetchCicloActual, fetchDocentes, fetchTotalSize, fetchMaterias, isLoading } = useListCargaHoraria(
    setMaterias,
    currentCiclo,
    currentPage,
    userInfo,
    setFilteredMaterias,
    getMunicipioSaved
  );

  useEffect(() => {
    const fetchCicloEscolarActual = async () => {
      const cicloActual = await fetchCicloActual();
      setCurrentCiclo(cicloActual);
    };

    fetchCicloEscolarActual();
  }, [fetchCicloActual]);

  

  useEffect(() => {
    const updateMaterias = async () => {
      if (!currentCiclo) return;

      const total = await fetchTotalSize();
      setTotalItems(total);

      fetchDocentes();
    };

    updateMaterias();
  }, [currentCiclo, currentPage, fetchDocentes, fetchTotalSize, itemsPerPage]);

  useEffect(() => {
    const inicialMunicipio = currentItems.find((materia) => materia.ubicacion)?.ubicacion;
    if (inicialMunicipio) {
      const municipio = municipios.find((m) => m.municipio === inicialMunicipio);
      if (municipio) setSelectedMunicipio(municipio.id);
    }
  }, [currentItems, municipios]);

  const { editMode, changes, toggleEditMode, handleInputChange, handleConsultarPDF } = useEditMode(
    filteredMaterias,
    setFilteredMaterias
  );

  const { handleGenerarOActualizarPDF } = useCartaDesempenoActions(
    municipios,
    filteredMaterias,
    setFilteredMaterias,
    changes
  );

  const { handleEliminar } = useEliminarCartaDesempeno(filteredMaterias, setFilteredMaterias);

  const { filteredMateriasSearch, handleSearchChange, search } = useFilteredMaterias(materias);
  useEffect(() => {
    setFilteredMaterias(filteredMateriasSearch);
  }, [filteredMateriasSearch]);
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
        <label>CICLO ESCOLAR: </label>
        <span>{currentCiclo}</span>
      </div>
      {isLoading ? (
        <p>Cargando datos...</p>
      ) : (
        currentCiclo && (
          <>
            <div className={`${styles.filterRow}`}>
              <FiltroCargaHoraria
                searchTerm={search}
                handleSearchChange={handleSearchChange}
                municipios={municipios}
                selectedMunicipio={selectedMunicipio}
                handleMunicipioChange={handleMunicipioChangeWrapper}
                cicloDisponible={!!currentCiclo}
              />
            </div>

            <TablaCargaHorariaDetalles
              currentItems={currentItems}
              editMode={editMode}
              municipios={municipios}
              changes={changes}
              cicloDisponible={cicloDisponible}
              handleInputChange={handleInputChange}
              toggleEditMode={toggleEditMode}
              handleGenerarOActualizarPDF={handleGenerarOActualizarPDF}
              handleConsultarPDF={handleConsultarPDF}
              handleEliminar={handleEliminar}
              getSortIcon={getSortIcon}
              handleSort={handleSort}
              isEliminarDisabled={(materia) => materia.marcado === "0"}
              fetchMaterias={fetchMaterias}
              userInfo={userInfo}
              fetchDocentes={fetchDocentes}
              selectedMunicipio={selectedMunicipio}
            />

            <Paginacion
              currentPage={currentPage}
              totalPages={totalPages}
              onFirstPage={handleFirstPage}
              onLastPage={handleLastPage}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
            />
          </>
        )
      )}
    </div>
  );
};

export default TablaCargaHoraria;
