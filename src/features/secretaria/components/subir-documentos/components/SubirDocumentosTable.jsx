import React, { useState, useCallback } from "react";
import FiltroSubirDocumentos from "../components/FiltroSubirDocumentos";
import SubirDocumentosTableDetalles from "./SubirDocumentosTableDetalles";
import Paginacion from "../../../../../reutilizable/Paginacion";
import styles from "../styles/SubirDocumentosTable.module.css";
import { useSubirDocumentos } from "../hooks/useGenerateOficios";

const SubirDocumentosTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const {
    documentos,
    isLoading: isDocumentsLoading,
    buscarDocumento,
  } = useSubirDocumentos();

  const fetchDocentes = useCallback(async () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    try {
      await buscarDocumento(searchTerm);
    } catch (error) {
      console.error("Error fetching docentes: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, buscarDocumento]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchClick = () => {
    fetchDocentes();
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return null;
  };

  return (
    <div className={styles.container}>
      {isLoading || isDocumentsLoading ? (
        <p>Cargando datos...</p>
      ) : (
        <>
          <div className={`${styles.filterRow}`}>
            <FiltroSubirDocumentos
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              handleSearchClick={handleSearchClick}
            />
          </div>

          <SubirDocumentosTableDetalles
            currentItems={documentos} handleSort={handleSort}
            getSortIcon={getSortIcon}
          />
        </>
      )}
    </div>
  );
};

export default SubirDocumentosTable;
