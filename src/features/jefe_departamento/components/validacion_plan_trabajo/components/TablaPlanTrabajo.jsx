import React, { useState, useEffect } from "react";
import Paginacion from "../../../../../reutilizable/Paginacion";
import FiltroValidacionPlanTrabajo from "../components/FiltroValidacionPlanTrabajo";
import TablaPlanTrabajoDetalles from "../components/TablaPlanTrabajoDetalles";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import useMunicipios from "../../../../../hooks/useMunicipios";
import useListPlanTrabajo from "../hooks/useListPlanTrabajo";
import usePagination from "../../../../../hooks/usePagination";
import useUpdateMunicipio from "../hooks/useUpdateMunicipio";
import styles from "../styles/TablaPlanTrabajo.module.css";

const TablaPlanTrabajo = ({ userInfo }) => {
  const { municipios, loadingMunicipios } = useMunicipios();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filteredPlanTrabajos, setFilteredPlanTrabajos] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [estatusFilter, setEstatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [currentCiclo, setCurrentCiclo] = useState("");

  const { currentPage, totalPages, currentItems, handleFirstPage, handleLastPage, handlePreviousPage, handleNextPage } =
    usePagination(filteredPlanTrabajos, totalItems);

  const { handleMunicipioChange, getMunicipioSaved } = useUpdateMunicipio(
    municipios,
    currentCiclo,
    filteredPlanTrabajos,
    setFilteredPlanTrabajos,
    userInfo,
    setSelectedMunicipio
  );

  const { fetchCicloActual, fetchTotalSize, fetchReportPlanTrabajo, isLoading } = useListPlanTrabajo(
    null,
    currentCiclo,
    currentPage,
    userInfo,
    setFilteredPlanTrabajos,
    getMunicipioSaved,
    selectedMunicipio
  );

  // Obtener ciclo actual
  useEffect(() => {
    const fetchCicloEscolarActual = async () => {
      const cicloActual = await fetchCicloActual();
      setCurrentCiclo(cicloActual);
    };

    fetchCicloEscolarActual();
  }, [fetchCicloActual]);

  // Obtener datos de Plan de Trabajo
  useEffect(() => {
    const loadData = async () => {
      if (!currentCiclo || municipios.length === 0 || loadingMunicipios) {
        console.warn("Esperando a que municipios tenga datos...");
        return;
      }
  
      console.log("Municipios cargados:", municipios);
      const total = await fetchTotalSize();
      setTotalItems(total);
      const data = await fetchReportPlanTrabajo(municipios);
      console.log("Datos obtenidos de fetchReportPlanTrabajo:", data);
      setOriginalData(data || []);
    };
  
    loadData();
  }, [currentCiclo, currentPage, fetchReportPlanTrabajo, fetchTotalSize, municipios, loadingMunicipios]);

  // Filtrar por estatus y búsqueda
  useEffect(() => {
    const filteredData = originalData.filter((docente) => {
      const matchesStatus = estatusFilter ? docente.estatus === estatusFilter : true;
      const matchesSearch =
        docente.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        docente.nombreDocente?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    setFilteredPlanTrabajos(filteredData);
  }, [estatusFilter, searchTerm, originalData]);

  // Manejar cambio de municipio
  const handleMunicipioChangeWrapper = (e) => {
    const newMunicipio = e.target.value;

    const confirmChange = window.confirm(
      "¿Estás seguro de que deseas cambiar el municipio? Esto actualizará todos los oficios relacionados."
    );

    if (!confirmChange) {
      return;
    }

    setSelectedMunicipio(newMunicipio);
    console.log(newMunicipio);
    handleMunicipioChange(newMunicipio);
  };

  // Ordenar datos
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredPlanTrabajos].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredPlanTrabajos(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? <FaArrowUp /> : <FaArrowDown />;
    }
    return null;
  };
  const handleUpdateStatus = (updatedItem) => {
    console.log(updatedItem);
    const updatedOriginalData = originalData.map((item) =>
      item.id.toString() === updatedItem.id.toString() ? { ...item, estatus: updatedItem.estatus, pdf: 1 } : item
    );
    setOriginalData(updatedOriginalData);

    const updatedFilteredData = filteredPlanTrabajos.map((item) =>
      item.id.toString() === updatedItem.id.toString() ? { ...item, estatus: updatedItem.estatus, pdf: 1 } : item
    );
    setFilteredPlanTrabajos(updatedFilteredData);
  };
  console.log(selectedMunicipio);
  return (
    <div className={styles.container}>
      <div className={`${styles.filter} ${styles.marginBottom}`}>
        <label>AÑO: </label>
        <span>{currentCiclo}</span>
      </div>
      {isLoading ? (
        <p>Cargando datos...</p>
      ) : (
        currentCiclo && (
          <>
            <FiltroValidacionPlanTrabajo
              searchTerm={searchTerm}
              handleSearchChange={(e) => setSearchTerm(e.target.value)}
              municipios={municipios}
              selectedMunicipio={selectedMunicipio}
              handleMunicipioChange={handleMunicipioChangeWrapper}
              selectedStatus={estatusFilter}
              handleStatusChange={(value) => setEstatusFilter(value)}
            />

            <TablaPlanTrabajoDetalles
              currentItems={filteredPlanTrabajos}
              municipios={municipios}
              cicloDisponible={currentCiclo}
              getSortIcon={getSortIcon}
              handleSort={handleSort}
              selectedMunicipio={selectedMunicipio}
              onUpdateStatus={handleUpdateStatus}
              setFilteredPlanTrabajos={setFilteredPlanTrabajos}
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

export default TablaPlanTrabajo;
