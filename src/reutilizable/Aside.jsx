import React, { useEffect, useMemo, useState } from "react";
import { VscArrowBoth } from "react-icons/vsc";
import icon from "../assets/images/note-edit-icon.png";
import iconAmarillo from "../assets/images/note-edit-icon_amarillo.png";
import { useEvaluationStore } from "../store/useEvaluationStore";
import { useInconformidadStore } from "../store/useInconformidadStore";
import { useSearchStore } from "../store/useSearchStore";
import Alerta from "./Alert";
import FormModal from "./FormModal";
import Search from "./Search";
import Select from "./Select";
import styles from "./styles/Aside.module.css";
import TableSearch from "./TableSearch";

import axios from "axios";
import { getRequisitos } from "../features/inconformidad/services/requisitosService";
import { fetchStatus } from "../features/secretaria/secretariaAdminSems/GenerarDocInconformidad/hooks/useFetchStatus";
import { useCargaHorariaStore } from "../store/useCargaHorariaStore";
import Loading from "./Loading";

const API_URL_SEARCH = `${process.env.REACT_APP_API_BASE_URL}/api/v1/solicitud/lista`;

const Aside = ({ selectVisible = false, alias, selectedDependencia = null }) => {
  const { findAndSetDataAcademico, setFullDataAcademico, setIsConcursante, status, setStatusEvaluacion } =
    useEvaluationStore();
  const {
    setFullDataAcademicoInconformidad,
    setIsConcursanteInconformidad,
    setErrorInconformidad,
    errorInconformidad,
    setStatusInconformidad,
    statusInconformidad,
  } = useInconformidadStore();
  const { fetchCargaGlobal } = useCargaHorariaStore();
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

  const clearSearch = useSearchStore((state) => state.clearSearch);
  const { academicos, academicosComplete } = useSearchStore((state) => ({
    academicos: state.academicos,
    academicosComplete: state.academicosComplete
  }));
  const [isSelected, setIsSelected] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [currentPageFiltrada, setCurrentPageFiltrada] = useState(0);

  const [selectedUser, setSelectedUser] = useState("");
  const roleUser = localStorage.getItem("rol");

  useEffect(() => {
    // Calcular académicos filtrados para verificar si hay resultados
    let academicosFiltrados = [...academicos];
    if (selectedDependencia && selectedDependencia.siglas) {
      academicosFiltrados = academicos.filter(academico => {
        return academico.siglasDependencia === selectedDependencia.siglas;
      });
    }

    if (!loading && hasSearched && academicosFiltrados.length === 0) {
      const delayTimer = setTimeout(() => {
        setShowAlert(true);

        // Oculta despues de 5s
        const autoHideTimer = setTimeout(() => {
          setShowAlert(false);
        }, 5000);

        return () => clearTimeout(autoHideTimer);
      }, 1500); //espera 1.5 segundos para renderizar

      return () => clearTimeout(delayTimer);
    } else if (academicosFiltrados.length > 0) {
      // Si hay resultados, ocultar la alerta
      setShowAlert(false);
    }
  }, [loading, academicos, hasSearched, selectedDependencia]);

  useEffect(() => {
    clearSearch();
     useSearchStore.getState().setLastSearchBody(null);
    // eslint-disable-next-line
  }, []);

  const handleClickAcademico = async (id) => {
    console.log(roleUser);
    const dataAcademico = findAndSetDataAcademico(id, academicos);

    // capturar usuario seleccionado para poder limpiar formulario de evaluacion
    setSelectedUser(dataAcademico.codigo)

    localStorage.setItem("usuarioSeleccionado", dataAcademico.codigo)
    console.log("✔Status: ", status);
    console.log("✔Data Academico: ", dataAcademico);
    setIsSelected(dataAcademico.codigo);
    console.log(dataAcademico.codigo);
    fetchCargaGlobal(dataAcademico.codigo);
    // Validate Rol
    if (
      roleUser === "comision_ingreso_promocion_personal_academico_sems" ||
      roleUser === "comision_ingreso_promocion_personal_academico_cu_ep" ||
      roleUser === "comision_ingreso_promocion_personal_academico_h_cgu"
    ) {
      const response = await setFullDataAcademicoInconformidad(dataAcademico.codigo);
      const responseStatus = await fetchStatus(dataAcademico.id);
      setStatusInconformidad(responseStatus);
      if (!response) {
        console.warn("No se pudieron recuperar todos los datos del academico");
        // setErrorInconformidad('Error desde aside');
        console.log(errorInconformidad);
        return;
      }
      console.log("Response from Aside for Inconformidad ~🚀: ", response);
      const isConcursante = await getRequisitos(response.idSolicitud, "inconformidad");
      console.log("isConcursante: ", isConcursante.data);
      setIsConcursanteInconformidad(isConcursante.data.esConcursante);
      return;
    }
    //----------------
    if (
      roleUser === "secretaria_admin_sems" ||
      roleUser === "secretaria_admin_cu" ||
      roleUser === "secretaria_escuelas_preparatorias" ||
      roleUser === "comision_especial_dictaminadora_ag" ||
      roleUser === "comision_especial_dictaminadora_sems" ||
      roleUser === "comision_dictaminadora_cu_ep"
    ) {
      // solo aplica para Dictaminadora y secretaria
      const response = await setFullDataAcademico(dataAcademico.codigo);
      console.log("Response from Aside for Evaluation ~🚀: ", response);
      const responseConcursante = await getRequisitos(response.idSolicitud, "evaluacion");
      setIsConcursante(responseConcursante.data.esConcursante);
      const responseStatus = await fetchStatus(dataAcademico.id);
      setStatusEvaluacion(responseStatus);
      // console.log("isConcursante: ", isConcursante.data);
      // console.log("🚀 ~ handleClickAcademico ~ isConcursante.data.esConcursante:", isConcursante)
      // setIsConcursante(isConcursante.data.esConcursante);
    }
  };

  useEffect(() => {
    localStorage.removeItem("formValues")
  }, [selectedUser])

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

      if (alias === "inconformidades") requestBody.status = 6;

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

  const handleButtonClick = () => setShowTable((prev) => !prev);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handlePreviousPage = () => {
    if (selectedDependencia && selectedDependencia.siglas) {
      // Paginación local para resultados filtrados
      setCurrentPageFiltrada(prev => Math.max(0, prev - 1));
    } else {
      // Paginación del backend
      const newPageNumber = (paginationRecords.pageable?.pageNumber ?? 0) - 1;
      setPageNumber(newPageNumber);
      searchByPageNumber(newPageNumber);
    }
  };

  const handleNextPage = () => {
    if (selectedDependencia && selectedDependencia.siglas) {
      // Paginación local para resultados filtrados
      const pageSize = 7;
      const totalPages = Math.ceil(academicosOrdenados.length / pageSize);
      setCurrentPageFiltrada(prev => Math.min(totalPages - 1, prev + 1));
    } else {
      // Paginación del backend
      const newPageNumber = (paginationRecords.pageable?.pageNumber ?? 0) + 1;
      setPageNumber(newPageNumber);
      searchByPageNumber(newPageNumber);
    }
  };

  const academicosOrdenados = useMemo(() => {
    // Filtrar académicos por dependencia si hay una seleccionada
    let academicosFiltrados = [...academicos];
    
    if (selectedDependencia && selectedDependencia.siglas) {
      academicosFiltrados = academicos.filter(academico => {
        // Comparar siglasDependencia del académico con siglas de la dependencia seleccionada
        return academico.siglasDependencia === selectedDependencia.siglas;
      });
    }

    // Ordenar los académicos filtrados
    return academicosFiltrados.sort((a, b) => {
      const tieneDatosA = !!(a.nombre && a.apellidoPaterno && a.apellidoMaterno);
      const tieneDatosB = !!(b.nombre && b.apellidoPaterno && b.apellidoMaterno);

      if (!tieneDatosA && tieneDatosB) return 1;
      if (tieneDatosA && !tieneDatosB) return -1;
      if (!tieneDatosA && !tieneDatosB) return 0;

      const apPaternoA = (a.apellidoPaterno || "").toUpperCase();
      const apPaternoB = (b.apellidoPaterno || "").toUpperCase();
      if (apPaternoA < apPaternoB) return -1;
      if (apPaternoA > apPaternoB) return 1;

      const apMaternoA = (a.apellidoMaterno || "").toUpperCase();
      const apMaternoB = (b.apellidoMaterno || "").toUpperCase();
      if (apMaternoA < apMaternoB) return -1;
      if (apMaternoA > apMaternoB) return 1;

      const nombreA = (a.nombre || "").toUpperCase();
      const nombreB = (b.nombre || "").toUpperCase();
      if (nombreA < nombreB) return -1;
      if (nombreA > nombreB) return 1;

      return 0;
    });
  }, [academicos, selectedDependencia]);

  // Resetear página cuando cambia el filtro
  useEffect(() => {
    if (selectedDependencia && selectedDependencia.siglas) {
      setCurrentPageFiltrada(0);
    }
  }, [selectedDependencia]);

  // Calcular paginación basada en resultados filtrados
  const paginacionFiltrada = useMemo(() => {
    if (!selectedDependencia || !selectedDependencia.siglas) {
      // Si no hay filtro, usar la paginación del backend
      return paginationRecords;
    }

    // Calcular paginación basada en los resultados filtrados
    const pageSize = paginationRecords.pageable?.pageSize || 7;
    const totalElements = academicosOrdenados.length;
    const totalPages = Math.ceil(totalElements / pageSize);

    return {
      ...paginationRecords,
      totalElements,
      totalPages,
      pageable: {
        ...paginationRecords.pageable,
        pageNumber: currentPageFiltrada,
      },
      number: currentPageFiltrada,
    };
  }, [academicosOrdenados, selectedDependencia, paginationRecords, currentPageFiltrada]);

  // Obtener académicos de la página actual cuando hay filtro
  const academicosPaginados = useMemo(() => {
    if (!selectedDependencia || !selectedDependencia.siglas) {
      // Si no hay filtro, mostrar todos los académicos de la página actual del backend
      return academicosOrdenados;
    }

    // Paginar localmente los resultados filtrados
    const pageSize = 7;
    const startIndex = currentPageFiltrada * pageSize;
    const endIndex = startIndex + pageSize;
    return academicosOrdenados.slice(startIndex, endIndex);
  }, [academicosOrdenados, selectedDependencia, currentPageFiltrada]);

  return (
    <aside className={styles.aside}>
      <div className={styles.filters}>
        {roleUser === "comision_especial_dictaminadora_ag" ? (
          <div className={selectVisible ? styles.hiddenSelect : ""}>
            <Select placeholder={"Seleccionar"} disabled={showModal} aliasActividad={alias} />
          </div>
        ) : null}
        <div className={styles.filter_search}>
          <Search
            aliasActividad={alias}
          />
        </div>

        {alias !== "consulta_convocatorias" && (
          <button className={styles.pBusquedaAvanzada} onClick={handleShowModal}>
            Búsqueda avanzada
          </button>
        )}

        <div className={styles.countAndButton}>
          {hasSearched  && (
              <span className={styles.totalRecords}>
                " {selectedDependencia && selectedDependencia.siglas 
                  ? academicosOrdenados.length 
                  : paginationRecords.totalElements} Solicitudes"
              </span>
            )}
          <button className={styles.arrowBoth} onClick={handleButtonClick}>
            <VscArrowBoth />
          </button>

        </div>

        {hasSearched && paginacionFiltrada.totalPages > 0 && (
          <div className={styles.paginationContainer}>
            <button
              className={[
                styles.paginationButton,
                ((selectedDependencia && selectedDependencia.siglas ? currentPageFiltrada : (paginationRecords.pageable?.pageNumber ?? 0)) === 0 || loading) ? styles.disabled : ""
              ].join(" ")}
              onClick={handlePreviousPage}
              disabled={(selectedDependencia && selectedDependencia.siglas ? currentPageFiltrada : (paginationRecords.pageable?.pageNumber ?? 0)) === 0 || loading}
            >
              ←
            </button>
            <span className={styles.paginationInfo}>
              Página {(selectedDependencia && selectedDependencia.siglas ? currentPageFiltrada : (paginationRecords.pageable?.pageNumber ?? 0)) + 1} de {paginacionFiltrada.totalPages}
            </span>
            <button
              className={[
                styles.paginationButton,
                ((selectedDependencia && selectedDependencia.siglas ? currentPageFiltrada : (paginationRecords.pageable?.pageNumber ?? 0)) >= paginacionFiltrada.totalPages - 1 || loading) ? styles.disabled : ""
              ].join(" ")}
              onClick={handleNextPage}
              disabled={(selectedDependencia && selectedDependencia.siglas ? currentPageFiltrada : (paginationRecords.pageable?.pageNumber ?? 0)) >= paginacionFiltrada.totalPages - 1 || loading}
            >
              →
            </button>
          </div>
        )}


        {showTable && (
          <>
            <div className={styles.backdrop} onClick={() => setShowTable(false)} />
            <TableSearch participantes={academicosOrdenados} />
          </>
        )}
      </div>

      <div className={styles.containerList}>
        {showAlert && academicosOrdenados.length === 0 && hasSearched ? (
          <Alerta typeAlert="error">
            <p>
              {
                "La búsqueda no arroja resultados, intente con otro filtro o haga una búsqueda general sin filtros primero"
              }
            </p>
          </Alerta>
        ) : (

          loading ? (<Loading />) : (
            academicosPaginados?.map((academico) => (
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
          )


        )}
      </div>

      <FormModal show={showModal} onHide={handleCloseModal} aliasActividad={alias} />
    </aside>
  );
};

export default Aside;
