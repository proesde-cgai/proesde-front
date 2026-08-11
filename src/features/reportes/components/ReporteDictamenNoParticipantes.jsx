import { faAngleRight, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Search from "../../../reutilizable/Search";
import Select from "../../../reutilizable/Select";
import Table from "../../../reutilizable/Table";
import { useReporteDictamenNoParticipante } from "../hooks/useReporteDictamenNoParticipante";
import { CABECERAS_TABLA } from "../utils/util";
import styles from "./styles/ReporteDictamenNoParticipante.module.css";
import Spinn from "./Spinn";

const ReporteDictamenNoParticipantes = () => {
  const { setValue, watch } = useForm();
  const [file, setFile] = useState(null);
  const {
    setAcademicos,
    filteredParticipants,
    handleSearch,
    selectedParticipants,
    handleCheckboxChange,
    handleGeneratePDF,
    handleSubmitFile,
    statusResponse: { isLoading, isError, message },
  } = useReporteDictamenNoParticipante();

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      console.log("Archivo PDF seleccionado:", selectedFile);
    } else {
      console.error("El archivo debe ser un PDF");
    }
  };

  const openFileExplorer = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className={styles.container}>
      {isError && (
        <div className={styles.container_message}>
          <p className={styles.message_error}>{message}</p>
        </div>
      )}
      <p className={styles.title_page}>Dictamen de no participantes</p>

      <div className={styles.container_parrafo}>
        <p className={styles.p_instrucciones}>
          <FontAwesomeIcon icon={faAngleRight} color="yellow" /> Instrucciones
        </p>
        <p className={styles.parrafo_instrucciones}>
          Seleccione de la tabla los acádemicos para los cuales se vaya a generar el reporte. Elija los que desee usando
          las casillas <br /> correspondientes, o todos los de la tabla haciendo clic en la casilla de la cabecera.{" "}
          <br />
          También puede realizar búsquedas especificas por nombre, apellido, código, tipo de participación u otros datos
          del académico. <br /> Si se desea hacer búsquedas por nivel (I-IX), habrá que especificarlo de la siguiente
          forma: "n=I", o "n=II", etc. <br />
          Cuando haya terminado, haga clic en "Generar PDF <FontAwesomeIcon icon={faSave} color={"cyan"} />
          ".
        </p>
      </div>

      <div className={styles.container_table}>
        <div className={styles.container_filtros_tabla}>
          <div>
            <p>Buscar:</p>
            <Search placeholder="Teclee su búsqueda" onSearch={handleSearch} />
          </div>
          <p>en</p>
          <div>
            <Select
              form={{ setValue, watch }}
              name="dependenciaSeleccionada"
              placeholder="Seleccione una dependencia"
              onSelectParticipants={setAcademicos}
            />
          </div>
        </div>

        <Table cabecerasTable={CABECERAS_TABLA} bodyTable={filteredParticipants} withHeader={true}>
          {filteredParticipants.length > 0 ? (
            filteredParticipants.map((dataBody) => (
              <tr key={dataBody.id}>
                <td className={`${styles.td_checkbox}`}>
                  <input
                    type="checkbox"
                    checked={selectedParticipants.has(dataBody.codigo)}
                    onChange={() => handleCheckboxChange(dataBody.codigo)}
                  />
                </td>
                <td className={`${styles.td} ${styles.td_textCenter}`}>{dataBody.id}</td>
                <td className={`${styles.td} ${styles.td_nombre}`}>
                  {dataBody.nombre} {dataBody.apellidoPaterno} {dataBody.apellidoMaterno}
                </td>
                <td className={`${styles.td} ${styles.td_textCenter}`}>{dataBody.nombreRol}</td>
                <td className={`${styles.td} ${styles.td_textCenter}`}>{dataBody.siglasDependencia}</td>
                <td className={`${styles.td} ${styles.td_textCenter}`}>{dataBody.nivelRomano}</td>
                <td className={`${styles.td} ${styles.td_textCenter}`}>{dataBody.calidad}</td>
                <td className={`${styles.td} ${styles.td_textCenter}`}>{dataBody.puntuacion}</td>
                <td className={`${styles.td} ${styles.td_textCenter}`}>
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                    accept="application/pdf"
                  />
                  <button onClick={openFileExplorer} htmlFor="fileInput">
                    Subir archivo
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={CABECERAS_TABLA.length} className={styles.noData}>
                No hay datos disponibles.
              </td>
            </tr>
          )}
        </Table>
      </div>

      <div className={styles.container_buttons}>
        <button onClick={handleGeneratePDF} type="button" className="texto_con_icono" disabled={isLoading}>
          {isLoading ? (
            <Spinn />
          ) : (
            <>
              Generar PDF
              <FontAwesomeIcon icon={faSave} color="cyan" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReporteDictamenNoParticipantes;
