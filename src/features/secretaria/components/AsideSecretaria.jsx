import axios from "axios";
import React, { useEffect, useState } from "react";
import { VscArrowBoth } from "react-icons/vsc";
import icon from "../../../assets/images/note-edit-icon.png";
import iconAmarillo from "../../../assets/images/note-edit-icon_amarillo.png";
import FormModal from "../../../reutilizable/FormModal";
import Search from "../../../reutilizable/Search";
import TableSearch from "../../../reutilizable/TableSearch";
import { useCargaHorariaStore } from "../../../store/useCargaHorariaStore";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { useSearchStore } from "../../../store/useSearchStore";
import styles from "./styles/AsideSecretaria.module.css";

const API_URL_SEARCH = `${process.env.REACT_APP_API_BASE_URL}/api/v1/solicitud/lista`;

const AsideSecretaria = ({ alias }) => {
  const { selectedDataAcademico, findAndSetDataAcademico } = useEvaluationStore();
  const { fetchCargaGlobal } = useCargaHorariaStore();
  const academicos = useSearchStore((state) => state.academicos);
  const clearSearch = useSearchStore((state) => state.clearSearch);
  const [isSelected, setIsSelected] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const { loading, hasSearched, paginationRecords, setPageNumber, setLoading, query, lastSearchBody } = useSearchStore((state) => ({
    loading: state.loading,
    hasSearched: state.hasSearched,
    paginationRecords: state.paginationRecords,
    setPageNumber: state.setPageNumber,
    query: state.query,
    setQuery: state.setQuery,
    setLoading: state.setLoading,
    lastSearchBody: state.lastSearchBody,
  }));

  const handleClickAcademico = (id) => {
    console.log("selecciono academico");
    const dataAcademico = findAndSetDataAcademico(id, academicos);
    setIsSelected(dataAcademico.codigo);
    fetchCargaGlobal(dataAcademico.codigo);
  };

  const handleButtonClick = () => setShowTable((prev) => !prev);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  //console.log(" academicos", academicos )

  useEffect(() => {
    clearSearch();
    useSearchStore.getState().setLastSearchBody(null);
    // eslint-disable-next-line
  }, []);

  const searchByPageNumber = async (pageNumber) => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      const { lastSearchBody } = useSearchStore.getState();
      useSearchStore.getState().setLoading(true);
      useSearchStore.getState().setHasSearched(true);

      const requestBody = lastSearchBody
        ? {
          ...lastSearchBody,
          criterios: {
            ...lastSearchBody.criterios,
            pageNumber: pageNumber.toString(),
          },
        }
        : {
          "palabraClave": query?.length > 0 ? query : null,
          "criterios": {
            "paginadoCondicion": "7",
            "pageNumber": pageNumber.toString()
          }
        };

      // Agregar filtro de status para inconformidad
      if (alias === "inconformidad") requestBody.status = 6;

      const response = await axios.post(
        API_URL_SEARCH,
        requestBody,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        useSearchStore.getState().setAcademicos(response.data.content);
        useSearchStore.getState().setPaginationRecords(response.data);
      }
      
    } catch (error) {
      useSearchStore.getState().setLoading(false);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const handlePreviousPage = () => {
    const newPageNumber = paginationRecords.pageable.pageNumber - 1;
    setPageNumber(newPageNumber);
    searchByPageNumber(newPageNumber);
  };

  const handleNextPage = () => {
    const newPageNumber = paginationRecords.pageable.pageNumber + 1;
    setPageNumber(newPageNumber);
    searchByPageNumber(newPageNumber);
  };


  return (
    <aside className={styles.aside}>
      <div className={styles.filters}>
        <div className={styles.filter_search}>
          <Search aliasActividad={alias} />
        </div>

        <button className={styles.pBusquedaAvanzada} onClick={handleShowModal}>
          Búsqueda avanzada
        </button>

        <div className={styles.countAndButton}>
          {hasSearched && (
            <span className={styles.totalRecords}>" {paginationRecords.totalElements} Solicitudes"</span>
          )}
          <button className={styles.arrowBoth} onClick={handleButtonClick}>
            <VscArrowBoth />
          </button>
        </div>

        {hasSearched && paginationRecords.totalPages > 0 && (
          <div className={styles.paginationContainer}>
            <button
              className={[
                styles.paginationButton,
                (paginationRecords.pageable.pageNumber === 0 || loading) ? styles.disabled : ""
              ].join(" ")}
              onClick={handlePreviousPage}
              disabled={paginationRecords.pageable.pageNumber === 0 || loading}
            >
              ←
            </button>
            <span className={styles.paginationInfo}>
              Página {paginationRecords.pageable.pageNumber + 1} de {paginationRecords.totalPages}
            </span>
            <button
              className={[
                styles.paginationButton,
                (paginationRecords.pageable.pageNumber >= paginationRecords.totalPages - 1 || loading) ? styles.disabled : ""
              ].join(" ")}
              onClick={handleNextPage}
              disabled={paginationRecords.pageable.pageNumber >= paginationRecords.totalPages - 1 || loading}
            >
              →
            </button>
          </div>
        )}


        {showTable && (
          <>
            <div className={styles.backdrop} onClick={() => setShowTable(false)} />
            <TableSearch participantes={academicos} />
          </>
        )}
      </div>

      <div className={styles.containerList}>
        {academicos && academicos.length === 0 && hasSearched && !loading ? (
          <div>No hay participantes registrados que coincidan con los criterios de búsqueda.</div>
        ) : (
          academicos?.map((academico) => (
            <div
              key={academico.codigo}
              className={
                isSelected === academico.codigo ? `${styles.isSelected} ${styles.item_list}` : `${styles.item_list}`
              }
              onClick={() => handleClickAcademico(academico.id)}
            >
              <p className={styles.itemParrafo}>
                <span>{academico.codigo}.</span> {academico.apellidoPaterno} {academico.apellidoMaterno}{" "}
                {academico.nombre} {academico.inconformidad ? <span style={{ color: "crimson" }}>[INC]</span> : ""}
                {academico.comentario && (
                  <td>{academico.revisado ? <img src={icon} alt="Icon" /> : <img src={iconAmarillo} alt="Icon" />}</td>
                )}
              </p>
              <p className={styles.parrafoSpan}>
                <span
                  className={
                    academico.inconformidad
                      ? academico.respuestaInconformidad
                        ? styles.eAtendido
                        : styles.eVacio
                      : academico.nivelRomano
                        ? styles.eEvaluado
                        : styles.eVacio
                  }
                >
                  {academico.nivelRomano || "-"}
                </span>
                <span className={styles.spanTipo}>[{academico.nombreParticipacion}]</span>
              </p>
            </div>
          ))
        )}
      </div>

      <FormModal show={showModal} onHide={handleCloseModal} aliasActividad={alias} />
    </aside>
  );
};

export default AsideSecretaria;
