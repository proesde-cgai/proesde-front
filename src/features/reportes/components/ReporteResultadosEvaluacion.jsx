import { faAngleRight, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Loading from "../../../reutilizable/Loading";
import SearchResultadoEvaluacion from "../../../reutilizable/SearchResultadoEvaluacion";
import Table from "../../../reutilizable/Table";
import { useResultadoEvaluacionStore } from "../../../store/useResultadoEvaluacionStore";
import { RESULTADO_EVALUACION_PAGE_SIZE } from "../../resultadoEvaluacion";
import AlertaDescargandoDoc from "../../secretaria/components/AlertaDescargandoDoc";
import { CABECERAS_TABLA } from "../data/index";
import styles from "./styles/ReporteResultadosEvaluacion.module.css";
import Alert from "../../../reutilizable/Alert";

const ROLES_HIDE_FILTER = [
  "comision_ingreso_promocion_personal_academico_sems",
  "comision_ingreso_promocion_personal_academico_cu_ep",
  "comision_ingreso_promocion_personal_academico_h_cgu",
];

const TIPO_PARTICIPACION_ID = {
  "Evaluación": 3,
  "PRODEP": 4,
};

const ReporteResultadosEvaluacion = () => {
  const { fetchResultadoEvaluacion, resultadoEvaluacionList, isErrorResultadoEvaluacionList, isLoading, generatePdf, hasfiltroDependencias, dependenciesList, pagination } =
    useResultadoEvaluacionStore();

  const roleUser = localStorage.getItem("rol");
  const showFilterTipoParticipacion = !ROLES_HIDE_FILTER.includes(roleUser);

  const [mensajeDescarga, setMensajeDescarga] = useState(null);

  useEffect(() => {
    fetchResultadoEvaluacion(null, null, null, 0, RESULTADO_EVALUACION_PAGE_SIZE);
    // eslint-disable-next-line
  }, []);

  const [selectedRows, setSelectedRows] = useState([]);
  const [filterTipoParticipacion, setFilterTipoParticipacion] = useState("");
  const [filterDependencia, setFilterDependencia] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSelectedRows([]);
  }, [resultadoEvaluacionList]);

  const getTipoParticipacionId = (tipoParticipacion) =>
    tipoParticipacion ? TIPO_PARTICIPACION_ID[tipoParticipacion] : null;

  const handleFilterDependenciaChange = (e) => {
    const newIdDependencia = e.target.value;
    setFilterDependencia(newIdDependencia);
    fetchResultadoEvaluacion(
      newIdDependencia || null,
      getTipoParticipacionId(filterTipoParticipacion),
      searchQuery || null,
      0,
      RESULTADO_EVALUACION_PAGE_SIZE
    );
  };

  const handleFilterChange = (e) => {
    const newTipoParticipacion = e.target.value;
    setFilterTipoParticipacion(newTipoParticipacion);
    fetchResultadoEvaluacion(
      filterDependencia || null,
      getTipoParticipacionId(newTipoParticipacion),
      searchQuery || null,
      0,
      RESULTADO_EVALUACION_PAGE_SIZE
    );
  };

  const handleSearch = () => {
    fetchResultadoEvaluacion(
      filterDependencia || null,
      getTipoParticipacionId(filterTipoParticipacion),
      searchQuery || null,
      0,
      RESULTADO_EVALUACION_PAGE_SIZE
    );
  };

  const handlePageChange = (nextPage) => {
    fetchResultadoEvaluacion(
      filterDependencia || null,
      getTipoParticipacionId(filterTipoParticipacion),
      searchQuery || null,
      nextPage,
      RESULTADO_EVALUACION_PAGE_SIZE
    );
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  const handleSelectAll = () => {
    const filteredCodigos = filteredList.map((item) => item.codigo);
    const allFilteredSelected = filteredCodigos.every((codigo) => selectedRows.includes(codigo));
    
    if (allFilteredSelected) {
      setSelectedRows((prev) => prev.filter((codigo) => !filteredCodigos.includes(codigo)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...filteredCodigos])]);
    }
  };

  const filteredList = resultadoEvaluacionList?.filter((item) => {
    if (!filterTipoParticipacion) return true;
    return item.tipoParticipacion === filterTipoParticipacion;
  }) || [];

  const isAllSelected = filteredList.length > 0 && filteredList.every((item) => selectedRows.includes(item.codigo));
  const currentPage = pagination?.number ?? 0;
  const totalPages = pagination?.totalPages ?? 0;
  const totalElements = pagination?.totalElements ?? 0;

  const handleSubmit = async () => {
    try {
      if (selectedRows.length === 0) {
        const errorMessage = {
          type: "warning",
          mensaje: "No has seleccionado ninguna fila",
        };
        setMensajeDescarga(errorMessage);
        return;
      }
      const requestData = {
        ids: [...selectedRows].map((id) => id.toString()),
      };
      let nombreParticipacion = {
        prodep: false,
        evaluacion: false,
      };
      const selectedTipoParticipacion = resultadoEvaluacionList
        .filter((item) => selectedRows.includes(item.codigo))
        .map((item) => item.tipoParticipacion);
      selectedTipoParticipacion.forEach((tipo) => {
        if (tipo === "PRODEP") {
          nombreParticipacion.prodep = true;
        } else if (tipo === "Evaluación") {
          nombreParticipacion.evaluacion = true;
        }
      });

      // const response = await axios.post(
      //   "http://localhost:8081/api/v1/reportes/generar_reporte_evaluacion",
      //   requestData,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //     responseType: "blob",
      //   }
      // );
      const response = await generatePdf(requestData);
      generateTablaResultadosPdf(response, nombreParticipacion);

      const succesMessage = {
        type: "success",
        mensaje: "Se genero los reportes correctamente",
      };
      setMensajeDescarga(succesMessage);
      setTimeout(() => {
        setMensajeDescarga(null);
      }, 8000);
    } catch (error) {
      const errorMessage = {
        type: "error",
        mensaje: error?.message || "Ha ocurrido un error en el servidor",
      };
      setMensajeDescarga(errorMessage);
    } finally {
      setTimeout(() => {
        setMensajeDescarga(null);
      }, 6000);
    }
  };

  const generateTablaResultadosPdf = (response, nombreParticipacion) => {
    const filename =
      nombreParticipacion.prodep && nombreParticipacion.evaluacion
        ? "Tabla - Evaluación-PRODEP.pdf"
        : nombreParticipacion.prodep
        ? "Tabla - PRODEP.pdf"
        : "Tabla - Evaluación.pdf";

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      {isErrorResultadoEvaluacionList && <Alert typeAlert="error" />}
      <div>
        <h2 className={styles.titlePage}>TABLA DE RESULTADOS DE EVALUACIÓN</h2>
      </div>

      <div className={styles.containerParrafo}>
        <p className={styles.parrafoInstruccionesConIcon}>
          <FontAwesomeIcon icon={faAngleRight} color={"yellow"} /> Instrucciones
        </p>

        <p className={styles.parrafoInstrucciones}>
          Seleccione de la <span>Tabla de resultados de evaluación</span> los acádemicos para los cuales se vaya a
          generar el reporte. Elija los que desee <br /> usando las casillas correspondientes, o todos los de la tabla
          haciendo clic en la casilla de la cabecera. <br />
          También puede realizar búsquedas especificas por nombre, apellido, código, tipo de participación u otros datos
          del académico. <br /> Si se desea hacer búsquedas por nivel (I-IX), habrá que especificarlo de la siguiente
          forma: "n=I" o "n=II", etc. <br />
          Cuando haya terminado, haga clic en "Generar PDF <FontAwesomeIcon icon={faSave} color={"cyan"} />
          ".
        </p>
      </div>

      <div className={styles.containerTable}>
        <div className={styles.containerFiltrosTabla}>
          <div>
            <p className={styles.textoGris}>Buscar:</p>
            <SearchResultadoEvaluacion
              placeholder={"Teclee su búsqueda"}
              idDependencia={filterDependencia}
              idTipoParticipacion={getTipoParticipacionId(filterTipoParticipacion)}
              value={searchQuery}
              onQueryChange={setSearchQuery}
              onSearch={handleSearch}
            />{" "}
            {/* Pendiente pasar las props de este componente */}
          </div>
          {showFilterTipoParticipacion && (
            <div>
              <p className={styles.textoGris}>Tipo de Participación:</p>
              <select 
                className={styles.selectFilter}
                value={filterTipoParticipacion}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="Evaluación">Evaluación</option>
                <option value="PRODEP">PRODEP</option>
              </select>
            </div>
          )}
          {hasfiltroDependencias && (
            <div>
              <p className={styles.textoGris}>Dependencia:</p>
              <select 
                className={styles.selectFilter}
                value={filterDependencia}
                onChange={handleFilterDependenciaChange}
              >
                <option value="">Todas</option>
                {dependenciesList.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.dependencia}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className={styles.tableLoadingWrapper}>
          <Table 
            cabecerasTable={CABECERAS_TABLA} 
            withHeader={true}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
          >
            {filteredList &&
              filteredList.map((dataBody) => (
                <tr key={dataBody.id}>
                  <td className={`${styles.tdCheckbox}`}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(dataBody.codigo)}
                      onChange={() => handleSelectRow(dataBody.codigo)}
                    />
                  </td>
                  <td className={`${styles.td} ${styles.tdTextCenter}`}>{dataBody.id}</td>
                  <td className={`${styles.td} ${styles.tdNombre}`}>
                    {dataBody.nombre} {}
                    {dataBody.apellidoPaterno} {}
                    {dataBody.apellidoMaterno}
                  </td>
                  <td className={`${styles.td} ${styles.tdTextCenter}`}>{dataBody.tipoParticipacion}</td>
                  <td className={`${styles.td} ${styles.tdTextCenter}`}>{dataBody.nombreDependencia}</td>
                  <td className={`${styles.td} ${styles.tdTextCenter}`}>
                    {dataBody.puntajesEvaluacion.nivel ? dataBody.puntajesEvaluacion.nivel : "0"}
                  </td>
                  <td className={`${styles.td} ${styles.tdTextCenter}`}>{dataBody.puntajesEvaluacion.calidad}</td>
                  <td className={`${styles.td} ${styles.tdTextCenter}`}>{dataBody.puntajesEvaluacion.puntajeTotal}</td>
                </tr>
              ))}
          </Table>
          <div className={styles.paginationContainer}>
            <button
              type="button"
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={isLoading || currentPage <= 0}
            >
              Anterior
            </button>
            <span className={styles.paginationInfo}>
              Página {totalPages === 0 ? 0 : currentPage + 1} de {totalPages} ({totalElements} registros)
            </span>
            <button
              type="button"
              className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={isLoading || pagination?.last || totalPages === 0}
            >
              Siguiente
            </button>
          </div>
          {isLoading && (
            <div className={styles.tableLoadingOverlay}>
              <Loading />
            </div>
          )}
        </div>
      </div>

      <div className={styles.containerButtons}>
        <button type="button" placeholder="Limpiar" className="texto_con_icono" onClick={handleSubmit}>
          Generar PDF <FontAwesomeIcon icon={faSave} color="cyan" />
        </button>
      </div>
      {mensajeDescarga && <AlertaDescargandoDoc mensajeDescarga={mensajeDescarga} />}
    </div>
  );
};

export default ReporteResultadosEvaluacion;
