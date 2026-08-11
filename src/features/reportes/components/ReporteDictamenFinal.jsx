import React, { useState, useEffect } from "react";
import styles from "./styles/ReporteDictamenFinal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faSave } from "@fortawesome/free-solid-svg-icons";
import Search from "../../../reutilizable/Search";
import Select from "../../../reutilizable/Select";
import Table from "../../../reutilizable/Table";
import { useForm } from "react-hook-form";
import { useSearchStore } from "../../../store/useSearchStore";
import axios from "axios";
import { useReporteDictamenFinal } from "../hooks/useReporteDictamenFinal";
import Spinn from "./Spinn";

const ReporteDictamenFinal = () => {
  const { setValue, watch } = useForm();
  const { academicos, setAcademicos, clearSearch } = useSearchStore();
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState(new Set());
  const [file, setFile] = useState(null);
  const {
    handleGeneratePDFDicFinal,
    handleSubmitFile,
    statusResponse: { isLoading, isError, message },
  } = useReporteDictamenFinal();

  const CABECERAS_TABLA = [
    { id: 1, labelCabecera: "input" },
    { id: 2, labelCabecera: "#" },
    { id: 3, labelCabecera: "Apellido(S) Nombre(s)" },
    { id: 4, labelCabecera: "Tipo" },
    { id: 5, labelCabecera: "Dependencia" },
    { id: 6, labelCabecera: "Nivel" },
    { id: 7, labelCabecera: "Calidad" },
    { id: 8, labelCabecera: "Pts." },
    { id: 9, labelCabecera: "Acciones" },
  ];

  useEffect(() => {
    setFilteredParticipants(academicos);
  }, [academicos]);

  const handleSearch = (query) => {
    const filtered = academicos.filter((participant) =>
      Object.values(participant).some((value) => value?.toString().toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredParticipants(filtered);
  };

  const handleClearFilters = () => {
    setFilteredParticipants(academicos);
    clearSearch();
    setSelectedParticipants(new Set());
  };

  const handleCheckboxChange = (id) => {
    const updatedSelection = new Set(selectedParticipants);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id);
    } else {
      updatedSelection.add(id);
    }
    setSelectedParticipants(updatedSelection);
  };

  const handleGeneratePDF = async () => {
    if (selectedParticipants.size === 0) {
      alert("Seleccione al menos un académico para generar el PDF.");
      return;
    }

    const selectedCodes = Array.from(selectedParticipants);
    const payload = { academicosSeleccionados: selectedCodes };
    try {
      const response = await handleGeneratePDFDicFinal(payload);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Error al generar el PDF");
    }
  };

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
      <p className={styles.title_page}>Dictamen final</p>

      <div className={styles.container_parrafo}>
        <p className={styles.p_instrucciones}>
          <FontAwesomeIcon icon={faAngleRight} color="yellow" /> Instrucciones
        </p>
        <p className={styles.parrafo_instrucciones}>
          Seleccione de la tabla los académicos para los cuales se vaya a generar el reporte. Elija los que desee usando
          las casillas <br /> correspondientes, o todos los de la tabla haciendo clic en la casilla de la cabecera.{" "}
          <br />
          También puede realizar búsquedas específicas por nombre, apellido, código, tipo de participación u otros datos
          del académico.
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
                    checked={selectedParticipants.has(dataBody.id)}
                    onChange={() => handleCheckboxChange(dataBody.id)}
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
        <button type="button" className="texto_con_icono" onClick={handleGeneratePDF}>
          Generar PDF <FontAwesomeIcon icon={faSave} color="cyan" />
        </button>
      </div>

      {isLoading && <Spinn />}
      {isError && (
        <div className={styles.container_message}>
          <p className={styles.error_message}>{message}</p>
        </div>
      )}
      {!isError && <p className={styles.success_message}>{message}</p>}
    </div>
  );
};

export default ReporteDictamenFinal;
