import React, { useEffect, useState } from "react";
import Loading from "../../../../reutilizable/Loading";
import TablaProfesores from "../../../../reutilizable/components/TablaProfesores";
import TablaProfesoresPaginacion from "../../../../reutilizable/components/TablaProfesoresPaginacion";
import MunicipiosSelect from "../../../../reutilizable/components/MunicipiosSelect";
import useCumplimientoTrabajoContext from "../context/useCumplimientoTrabajoContext";
import styles from "../styles/CumplimientoTrabajoMain.module.css";
import FiltroCumplPlanTrabajo from "../components/FiltroCumplPlanTrabajo";
import useFilterCumplPlanTrabajo from "../hooks/useFIlterCumplPlanTrabajo";
import { obtenerCicloActual } from "../hooks/useFetchCicloEscolar";
const CumplimientoTrabajoMain = () => {
  const {
    municipios,
    handleMunicipioChange,
    cicloEscolar,
    isLoadingProfesores,
    selectedMunicipio,
    loading,
    fetchTotalSize,
    totalPages,
    handleGoFirstPage,
    handleGoLastPage,
    ciclosEscolares,
    fetchCiclosEscolares,
    handleChangeSelect,
    handleNextPageLegacy,
    handlePreviousPageLegacy,
    listaProfesores,
    handleNoOficioChange,
    saveEditProfesor,
    editProfesor,
    generateNewPdf,
    updatePdf,
    downloadPdf,
    handleDeleteProfesor,
    toggleSortProfesorCodigo,
    toggleSortProfesorNombre,
    cicloDisponible,
    currentPage,
    setCurrentPage,
    setSelectedMunicipio,
    sortProfesorCodigo,
    sortProfesorNombre,
  } = useCumplimientoTrabajoContext();

  const [currentCiclo, setCurrentCiclo] = useState("");

  const { search, handleSearchChange, filteredMateriasSearch } = useFilterCumplPlanTrabajo(listaProfesores, () =>
    setCurrentPage(1)
  );

  const [filteredProfesores, setFilteredProfesores] = useState(listaProfesores);
  const [indexLoading, setIndexLoading] = useState(0);

  console.log(filteredProfesores[0]);
  console.log(selectedMunicipio);

  useEffect(() => {
    setFilteredProfesores(filteredMateriasSearch);
  }, [filteredMateriasSearch, setFilteredProfesores, filteredProfesores]);

  useEffect(() => {
    const fetchCicloEscolarActual = async () => {
      const cicloActual = await obtenerCicloActual();
      const cicloModificado = parseInt(cicloActual) - 1;
      setCurrentCiclo(cicloModificado);

      handleChangeSelect(cicloModificado);
      // setCurrentCiclo(cicloActual);
    };

    fetchCicloEscolarActual();
    // eslint-disable-next-line
  }, []);

  const tablaProps = {
    listaProfesores,
    isLoadingProfesores,
    headers: (
      <>
        <th onClick={toggleSortProfesorCodigo}>CÓDIGO PROFESOR {sortProfesorCodigo ? <>&uarr;</> : <>&darr;</>}</th>
        <th onClick={toggleSortProfesorNombre}>NOMBRE DOCENTE {sortProfesorNombre ? <>&uarr;</> : <>&darr;</>}</th>
        <th>NO. OFICIO</th>
        <th>MUNICIPIO</th>
        <th>AÑO</th>
        <th>GENERAR/ACTUALIZAR</th>
        <th>DESCARGAR</th>
        <th>EDITAR</th>
        <th>ELIMINAR</th>
      </>
    ),
    rows: (profesor) => {
      console.log(profesor);
      return (
        <>
          <td>{profesor.codigoProfesor}</td>
          <td>{profesor.nombreProfesor}</td>
          <td>
            {profesor.isEdit ? (
              <input
                type="text"
                value={profesor.noOficio || ""}
                onChange={(e) => handleNoOficioChange(e.target.value, profesor)}
              />
            ) : (
              profesor.noOficio
            )}
          </td>
          <td>{profesor.ubicacion || "No disponible"}</td>
          <td>{profesor.cicloEscolar}</td>
          <td>
            {((profesor.marcado === "1" && profesor.statusMunicipio === "0") ||
              (profesor.hasChanged && profesor.marcado === "1")) &&
            !profesor.isEdit ? (
              <button
                className={`${styles.button} ${styles.buttonChanged}`}
                disabled={loading || indexLoading === profesor.idQr || profesor.isEdit}
                onClick={async () => {
                  setIndexLoading(profesor.idQr);
                  await updatePdf(profesor);
                  setIndexLoading(0);
                }}
              >
                {indexLoading === profesor.idQr ? "Actualizando..." : "Actualizar PDF"}
              </button>
            ) : null}
            {profesor.marcado === "0" && profesor.hasChanged && !profesor.isEdit && (
              <button
                className={`${styles.button} ${styles.buttonChanged}`}
                onClick={async () => {
                  setIndexLoading(profesor.idQr);
                  await generateNewPdf(profesor);
                  setIndexLoading(0);
                }}
                disabled={
                  !profesor.noOficio ||
                  !profesor.ubicacion ||
                  loading ||
                  indexLoading === profesor.idQr ||
                  profesor.isEdit
                }
              >
                {indexLoading === profesor.idQr ? "Generando..." : "Generar PDF"}
              </button>
            )}
          </td>
          <td>
            {profesor.marcado === "1" ? (
              <button className={`${styles.button}`} onClick={() => downloadPdf(profesor)}>
                Descargar PDF
              </button>
            ) : (
              <button className={`${styles.button}`} onClick={() => {}} disabled={true}>
                No disponible
              </button>
            )}
          </td>
          <td>
            <button
              className={`${styles.button}`}
              onClick={() => (profesor.isEdit ? saveEditProfesor(profesor) : editProfesor(profesor))}
              disabled={!cicloDisponible}
            >
              {profesor.isEdit ? "Guardar" : "Editar"}
            </button>
          </td>
          <td>
            <button
              className={`${styles.button} ${profesor.marcado === "0" ? styles.buttonDisabled : ""}`}
              onClick={() => handleDeleteProfesor(profesor.idQr, currentPage)}
            >
              Eliminar
            </button>
          </td>
        </>
      );
    },
  };

  useEffect(() => {
    fetchTotalSize();
    if (Array.isArray(ciclosEscolares) && ciclosEscolares.length === 0) {
      fetchCiclosEscolares();
    }
    setSelectedMunicipio(JSON.parse(localStorage.getItem("municipio")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;
  return (
    <>
      <article>
        <header>
          <h3 className={styles.constancia_title}>Generar oficio de cumplimiento de plan de trabajo</h3>
        </header>
        <div className={styles.container}>
          <div className={`${styles.filter} ${styles.marginBottom}`}>
            <label htmlFor="cicloEscolar">AÑO: </label>
            <span>{currentCiclo}</span>
          </div>
          {cicloEscolar && (
            <>
              <div className={`${styles.filterRow}`}>
                {/* <FiltroCumplPlanTrabajo searchTerm={search} handleSearchChange={handleSearchChange} /> */}
                <MunicipiosSelect
                  municipios={municipios}
                  currentPage={currentPage}
                  selectedMunicipio={selectedMunicipio}
                  handleMunicipioChange={handleMunicipioChange}
                />
              </div>
              {listaProfesores.length > 0 ? (
                <TablaProfesores {...tablaProps} />
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>CÓDIGO PROFESOR</th>
                      <th>NOMBRE DOCENTE</th>
                      <th>NO. OFICIO</th>
                      <th>MUNICIPIO</th>
                      <th>CICLO ESCOLAR</th>
                      <th>GENERAR/ACTUALIZAR</th>
                      <th>DESCARGAR</th>
                      <th>EDITAR</th>
                      <th>ELIMINAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="9">No hay datos disponibles</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </>
          )}
          <TablaProfesoresPaginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onFirstPage={handleGoFirstPage}
            onLastPage={handleGoLastPage}
            onPreviousPage={handlePreviousPageLegacy}
            onNextPage={handleNextPageLegacy}
          />
        </div>
      </article>
    </>
  );
};

export default CumplimientoTrabajoMain;
