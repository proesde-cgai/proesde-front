import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/EvaluacionEstudiantePage.module.css";
import Loading from "../../../../reutilizable/Loading";
import TablaProfesores from "../../../../reutilizable/components/TablaProfesores";
import TablaProfesoresPaginacion from "../../../../reutilizable/components/TablaProfesoresPaginacion";
import MunicipiosSelect from "../../../../reutilizable/components/MunicipiosSelect";
import useEvaluacionEstudianteContext from "../context/useEvaluacionEstudianteContext";
import FiltroEvaluacionEstudiante from "../components/filtroEvaluacionEstudiante";
import useFiltroEvaluacionEstudiante from "../hooks/useFiltroEvaluacionEstudiante";

const EvaluacionEstudiantePage = () => {
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
    setListaProfesores,
    handleNoOficioChange,
    saveEditProfesor,
    editProfesor,
    generateNewPdf,
    updatePdf,
    downloadPdf,
    handleDeleteProfesor,
    toggleSortProfesorCodigo,
    toggleSortProfesorNombre,
    handleRowDoubleClick,
    cicloDisponible,
    currentPage,
    sortProfesorCodigo,
    sortProfesorNombre,
    setCurrentPage,
  } = useEvaluacionEstudianteContext();
  const { filteredMateriasSearch, handleSearchChange, search } = useFiltroEvaluacionEstudiante(listaProfesores, () =>
    setCurrentPage(1)
  );
  const [filteredProfesores, setFilteredProfesores] = useState(listaProfesores);

  useEffect(() => {
    setFilteredProfesores(filteredMateriasSearch);
  }, [filteredMateriasSearch, setFilteredProfesores, filteredProfesores]);

  const tablaProps = {
    listaProfesores: filteredProfesores,
    isLoadingProfesores,
    headers: (
      <>
        <th onClick={toggleSortProfesorCodigo}>
          CÓDIGO PROFESOR{" "}
          {sortProfesorCodigo ? (
            <div className={styles.upArrow}>&uarr;</div>
          ) : (
            <div className={styles.downArrow}>&darr;</div>
          )}
        </th>
        <th onClick={toggleSortProfesorNombre}>
          NOMBRE DOCENTE{" "}
          {sortProfesorNombre ? (
            <div className={styles.upArrow}>&uarr;</div>
          ) : (
            <div className={styles.downArrow}>&darr;</div>
          )}
        </th>
        <th>NO. OFICIO</th>
        <th>MUNICIPIO</th>
        <th>CICLO ESCOLAR</th>
        <th>GENERAR/ACTUALIZAR</th>
        <th>DESCARGAR</th>
        <th>EDITAR</th>
        <th>ELIMINAR</th>
      </>
    ),
    rows: (profesor) => (
      <>
        <td>{profesor.codigoProfesor}</td>
        <td
          className={`${styles.cursor} ${profesor.isEdit ? styles.clickHere : ""}`}
          onDoubleClick={() => handleRowDoubleClick(profesor)}
        >
          {profesor.nombreProfesor}
        </td>
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
        <td>{profesor.ubicacion || selectedMunicipio}</td>
        <td>{profesor.cicloEscolar}</td>
        <td>
          {(profesor.marcado === "1" && profesor.hasChanged) ||
          (profesor.marcado === "1" && profesor.statusMunicipio === "0") ? (
            <button
              className={`${styles.button} ${styles.buttonChanged}`}
              disabled={profesor.loading}
              onClick={() => updatePdf(profesor)}
            >
              {profesor.loading ? "Actualizando..." : "Actualizar PDF"}
            </button>
          ) : profesor.marcado === "0" && profesor.hasChanged ? (
            <button
              className={`${styles.button} ${styles.buttonChanged}`}
              onClick={() => generateNewPdf(profesor)}
              disabled={!profesor.noOficio || !profesor.ubicacion || !profesor.materia || profesor?.loading}
            >
              {profesor.loading ? "Generando..." : "Generar PDF"}
            </button>
          ) : null}
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
    ),
  };

  useEffect(() => {
    fetchTotalSize();
    if (Array.isArray(ciclosEscolares) && ciclosEscolares.length === 0) {
      fetchCiclosEscolares();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading />;
  return (
    <>
      <article>
        <header>
          <h3 className={styles.constancia_title}>Generar oficio de evaluación de estudiantes</h3>
        </header>
        <div className={styles.container}>
          <div className={`${styles.filter} ${styles.marginBottom}`}>
            <label htmlFor="cicloEscolar">CICLO ESCOLAR: </label>
            <select id="cicloEscolar" value={cicloEscolar} onChange={handleChangeSelect} disabled={!cicloDisponible}>
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
          {cicloEscolar && (
            <>
              <div className={`${styles.filterRow}`}>
                {/* <FiltroEvaluacionEstudiante searchTerm={search} handleSearchChange={handleSearchChange} /> */}
                <MunicipiosSelect
                  municipios={municipios}
                  currentPage={currentPage}
                  selectedMunicipio={selectedMunicipio}
                  handleMunicipioChange={handleMunicipioChange}
                />
              </div>
              <p className={styles.instruccionesTitle}>
                {" "}
                DOBLE CLIC EN EL NOMBRE DEL DOCENTE PARA EDITAR CALIFICACIONES. CLIC EN "ACEPTAR" PARA CERRAR. LOS
                CAMBIOS SE GUARDAN LUEGO.
              </p>
              <TablaProfesores {...tablaProps} />
            </>
          )}
          {cicloEscolar && (
            <TablaProfesoresPaginacion
              currentPage={currentPage}
              totalPages={totalPages}
              onFirstPage={handleGoFirstPage}
              onLastPage={handleGoLastPage}
              onPreviousPage={handlePreviousPageLegacy}
              onNextPage={handleNextPageLegacy}
            />
          )}
        </div>
      </article>
    </>
  );
};

export default EvaluacionEstudiantePage;
