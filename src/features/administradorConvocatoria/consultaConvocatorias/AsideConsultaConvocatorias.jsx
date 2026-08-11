import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSearchStore } from "../../../store/useSearchStore";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { useCargaHorariaStore } from "../../../store/useCargaHorariaStore";
import { getAccessToken } from "../../authService";
import { useDetalleSolicitudHistoricoStore } from "./store/useDetalleSolicitudHistoricoStore";
import TableSearch from "../../../reutilizable/TableSearch";
import iconAmarillo from "../../../assets/images/note-edit-icon_amarillo.png";
import icon from "../../../assets/images/note-edit-icon.png";
import Alert from "../../../reutilizable/Alert";
import AdvancedSearchModal from "./AdvancedSearchModal";
import styles from "../components/styles/Aside.module.css";
import searchStyles from "../../../reutilizable/styles/Search.module.css";
import Loading from "../../../reutilizable/Loading";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_SOLICITUD_HISTORICO_DETALLE = `${API_BASE_URL}/api/v1/solicitud-historicos`;

const AsideConsultaConvocatorias = ({ alias, fullListHistoricos = [], onPageChange, onSearchByCodigo, onSearchAdvanced }) => {
  const { findAndSetDataAcademico } = useEvaluationStore();
  const { fetchCargaGlobal } = useCargaHorariaStore();

  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);
  const setHasSearched = useSearchStore((state) => state.setHasSearched);
  const hasSearched = useSearchStore((state) => state.hasSearched);
  const clearSearch = useSearchStore((state) => state.clearSearch);
  const academicos = useSearchStore((state) => state.academicos);
  const setPageNumber = useSearchStore((state) => state.setPageNumber);
  const paginationRecords = useSearchStore((state) => state.paginationRecords);
  const loading = useSearchStore((state) => state.loading);
  const totalSolicitudes = Number(paginationRecords?.totalElements) || 0;

  const [displayList, setDisplayList] = useState([]);
  const [isSelected, setIsSelected] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasSearchedLocal, setHasSearchedLocal] = useState(false);

  const clearDetalle = useDetalleSolicitudHistoricoStore(
    (state) => state.clearDetalle
  );

  useEffect(() => {
    // No limpiamos la búsqueda al montar para no borrar lo que el padre auto-cargó
    setDisplayList(academicos);
    setHasSearchedLocal(false);
    setCurrentPage(0);
    clearDetalle();
    // Si ya hay académicos (auto-cargados), nos aseguramos de que el contador sepa que hubo "búsqueda"
    if (academicos.length > 0) {
      setHasSearched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDisplayList(academicos);
    setCurrentPage(0);
    if (academicos && academicos.length > 0) {
      setHasSearchedLocal(true);
    }
  }, [academicos]);

  useEffect(() => {
    if (hasSearched && displayList.length === 0) {
      const delayTimer = setTimeout(() => {
        setShowAlert(true);
        const autoHideTimer = setTimeout(() => setShowAlert(false), 5000);
        return () => clearTimeout(autoHideTimer);
      }, 1500);
      return () => clearTimeout(delayTimer);
    } else if (displayList.length > 0) {
      setShowAlert(false);
    }
  }, [hasSearched, displayList.length]);

  const handleSearchByCode = (e) => {
    e.preventDefault();
    const q = (query || "").toString().trim();
    if (onSearchByCodigo) {
      onSearchByCodigo(q);
    }
    setHasSearchedLocal(true);
    setCurrentPage(0);
    setHasSearched(true);
  };

  const setDetalle = useDetalleSolicitudHistoricoStore(
    (state) => state.setDetalle
  );

  const handleClickAcademico = async (id) => {
    const dataAcademico = findAndSetDataAcademico(id, displayList);
    if (!dataAcademico) return;
    setIsSelected(dataAcademico.codigo);
    fetchCargaGlobal(dataAcademico.codigo);

    try {
      const token = await getAccessToken();
      const response = await axios.get(
        `${API_SOLICITUD_HISTORICO_DETALLE}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("GET /api/v1/solicitud-historicos/" + id + " - Response:", response.data);
      setDetalle(response.data ?? null);
    } catch (error) {
      console.error("Error al obtener detalle de solicitud histórica:", error);
      setDetalle(null);
    }
  };

  const handleButtonClick = () => setShowTable((prev) => !prev);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleApplyAdvancedSearch = (criteria) => {
    if (onSearchAdvanced) {
      onSearchAdvanced(criteria);
    }
    setHasSearchedLocal(true);
    setCurrentPage(0);
    setHasSearched(true);
    setShowModal(false);
  };

  // Paginación local (client-side) — pagina el displayList ya cargado
  const pageSize = 7;

  const totalPages = useMemo(
    () => Math.ceil(displayList.length / pageSize) || 0,
    [displayList.length]
  );

  const paginatedList = useMemo(() => {
    if (totalPages === 0) return [];
    const safePage =
      currentPage >= totalPages ? Math.max(totalPages - 1, 0) : currentPage;
    const startIndex = safePage * pageSize;
    const endIndex = startIndex + pageSize;
    return displayList.slice(startIndex, endIndex);
  }, [currentPage, displayList, totalPages]);

  const handleLocalPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleLocalNextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.max(totalPages - 1, 0))
    );
  };

  // Paginación del servidor (server-side) — carga más páginas desde la API
  const handleNextPage = () => {
    const newPage = paginationRecords.number + 1;
    setPageNumber(newPage);
    if (onPageChange) onPageChange(newPage);
  };

  const handlePreviousPage = () => {
    const newPage = paginationRecords.number - 1;
    setPageNumber(newPage);
    if (onPageChange) onPageChange(newPage);
  };

  return (
    <aside className={styles.aside}>
      <div className={styles.filters}>
        <div className={styles.filter_search}>
          <div className={searchStyles.searchContainer}>
            <div className={searchStyles.searchInputContainer}>
              <input
                type="number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={searchStyles.searchInput}
                disabled={loading}
              />
              <span
                onClick={!loading ? handleSearchByCode : null}
                className={searchStyles.searchButton}
                style={{ cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  width="20px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5-62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        <button
          className={styles.pBusquedaAvanzada}
          onClick={handleShowModal}
        >
          Búsqueda avanzada
        </button>
        <div className={styles.countAndButton}>
          {hasSearched && (
            <span className={styles.totalRecords}>
              {`${totalSolicitudes} Solicitudes`}
            </span>
          )}
        </div>

        {/* Paginación del servidor: carga más páginas desde la API */}
        {hasSearched && paginationRecords.totalPages > 1 && (
          <div className={styles.paginationAside}>
            <button
              onClick={handlePreviousPage}
              disabled={paginationRecords.number === 0 || loading}
              className={styles.pageButton}
            >
              &lt;
            </button>
            <span className={styles.pageInfo}>
              {paginationRecords.number + 1} / {paginationRecords.totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={paginationRecords.number >= paginationRecords.totalPages - 1 || loading}
              className={styles.pageButton}
            >
              &gt;
            </button>
          </div>
        )}

        {showTable && (
          <>
            <div className={styles.backdrop} onClick={() => setShowTable(false)} />
            <TableSearch participantes={displayList} />
          </>
        )}
      </div>

      <div className={styles.containerList}>
        {loading ? (
          <Loading />
        ) : showAlert && displayList.length === 0 && hasSearched ? (
          <Alert typeAlert="error">
            <p>
              {
                "La búsqueda no arroja resultados, intente con otro filtro o haga una búsqueda general sin filtros primero"
              }
            </p>
          </Alert>
        ) : (
          displayList?.map((academico) => (
            <div
              key={academico.codigo}
              className={
                isSelected === academico.codigo
                  ? `${styles.isSelected} ${styles.item_list}`
                  : `${styles.item_list}`
              }
              onClick={() => handleClickAcademico(academico.id)}
            >
              <p className={styles.itemParrafo}>
                <span>{academico.codigo}.</span>{" "}
                {academico.apellidoPaterno} {academico.apellidoMaterno}{" "}
                {academico.nombre}{" "}
                {academico.inconformidad ? (
                  <span style={{ color: "crimson" }}>[INC]</span>
                ) : (
                  ""
                )}
                {academico.comentario && (
                  <td>
                    {academico.revisado ? (
                      <img src={icon} alt="Icon" />
                    ) : (
                      <img src={iconAmarillo} alt="Icon" />
                    )}
                  </td>
                )}
              </p>
              <p className={styles.parrafoSpan}>
                <span
                  className={
                    academico.inconformidad
                      ? academico.respuestaInconformidad
                        ? styles.eAtendido
                        : styles.eVacio
                      : (academico.nivelRomano || academico.dictamen)
                      ? styles.eEvaluado
                      : styles.eVacio
                  }
                >
                  {academico.nivelRomano || academico.dictamen || "-"}
                </span>
                <span className={styles.spanTipo}>
                  [{academico.nombreParticipacion || academico.tipoParticipacion || ""}]
                </span>
              </p>
            </div>
          ))
        )}
      </div>
      <AdvancedSearchModal
        show={showModal}
        onHide={handleCloseModal}
        baseList={fullListHistoricos}
        onApply={handleApplyAdvancedSearch}
      />
    </aside>
  );
};

export default AsideConsultaConvocatorias;
