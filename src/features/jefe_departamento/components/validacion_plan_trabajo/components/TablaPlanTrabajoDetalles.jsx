import React, { useState, useEffect } from "react";
import styles from "../styles/TablaPlanTrabajoDetalles.module.css";
import ModalValidacionPlanTrabajo from "./ModalValidacionPlanTrabajo";
import useListPlanTrabajo from "../hooks/useListPlanTrabajo";

const TablaPlanTrabajoDetalles = ({
  currentItems,
  municipios,
  getSortIcon,
  handleSort,
  selectedMunicipio,
  onUpdateStatus,
  setFilteredPlanTrabajos,
}) => {
  const { getDetallePlanTrabajo, updatedplanTrabajo, deletePlanTrabajo, generatePdfPT, changeStatusPT } =
    useListPlanTrabajo();

  const [modalOpen, setModalOpen] = useState(false);
  const [itemAction, setItemAction] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);

  console.log(currentItems);
  console.log(selectedMunicipio);

  const onSubmit = async (payload) => {
    console.log(payload);
    const response = await changeStatusPT(payload);
    console.log(response);
    if (response && response?.status === 200) {
      onUpdateStatus(payload);
    }
  };

  const handleRowClick = async (item, event) => {
    const ignoredColumnIndexes = [7, 8, 9];
    const clickedCell = event.target.closest("td");

    if (!clickedCell) return;
    const columnIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell);

    if (ignoredColumnIndexes.includes(columnIndex)) {
      return;
    }
    const response = await getDetallePlanTrabajo(item.id);
    console.log(response);

    if (!response) {
      console.warn("No detalle found.");
      return;
    }
    setSelectedData({
      id: item.id,
      codigo: response.codigo || "",
      nombreDocente: item.nombreDocente || "",
      estatus: item.estatus || "",
      noSolicitud: item.solicitudID || "",
      cicloEscolar: item.cicloEscolar || "",
      docencia: response.docencia || "",
      generacionConocimiento: response.generacion || "",
      gestionAcademica: response.gestionAcademica || "",
      vinculacion: response.vinculacion || "",
      observaciones: response.observaciones || "",
    });
    setModalOpen(true);
  };

  const handleDownload = async (solicitudID) => {
    setIsDownloading(true);
    try {
      setFilteredPlanTrabajos(
        currentItems.map((item) => (item.id === solicitudID ? { ...item, isDownloading: true } : item))
      );
      const response = await generatePdfPT(solicitudID);
      if (response) {
        generatePdf(response.data);
        setFilteredPlanTrabajos(
          currentItems.map((item) => (item.id === solicitudID ? { ...item, isDownloading: false } : item))
        );
      } else {
        console.error("Error al generar el PDF.");
      }
    } catch (error) {
      console.error("Error en la descarga del PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async (solicitudID) => {
    console.log("Eliminar PDF");
    if (!window.confirm("¿Estás seguro de que deseas eliminar el plan de trabajo?")) return;
    const response = await deletePlanTrabajo(solicitudID);
    console.log(response);
    if (!response) return;
    setFilteredPlanTrabajos(currentItems.filter(item => item.id !== solicitudID));
  };

  const handleUpdate = async (itemId) => {
    console.log("Actualizar PDF");
    const response = await updatedplanTrabajo(itemId);
    console.log(response);
    if (!response) return;
    setFilteredPlanTrabajos(currentItems.map((item) => (item.id === itemId ? { ...item, pdf: 1 } : item)));
  };

  const getMunicipioName = (ubicacion) => {
    if (!ubicacion) return null;
    const municipio = municipios.find(
      (m) => m.id === Number(ubicacion) || m.municipio.toString() === ubicacion.toString()
    );
    return municipio ? municipio.municipio : "No disponible";
  };

  const generatePdf = (response) => {
    const blob = new Blob([response], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `PLAN_TRABAJO.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <p className={styles.instruccionesTitle}> DOBLE CLIC EN EL NOMBRE DEL DOCENTE PARA VISUALIZAR PLAN DE TRABAJO.</p>
      <table className={styles.tablePlan}>
        <thead>
          <tr>
            <th rowSpan="2" onClick={() => handleSort("codigoProfesor")}>
              CÓDIGO PROFESOR {getSortIcon("codigoProfesor")}
            </th>
            <th rowSpan="2" onClick={() => handleSort("nombreProfesor")}>
              NOMBRE DOCENTE {getSortIcon("nombreProfesor")}
            </th>
            <th rowSpan="2">NO. SOLICITUD</th>
            <th rowSpan="2">ESTATUS</th>
            <th rowSpan="2">MUNICIPIO</th>
            <th rowSpan="2">AÑO</th>
            <th>GENERAR / ACTUALIZAR</th>
            <th>DESCARGAR</th>
            <th>ELIMINAR</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <tr
                key={index}
                onDoubleClick={(event) => handleRowClick(item, event)}
                className={styles.clickableRow}
                style={{ cursor: "pointer" }}
              >
                <td>{item.codigo}</td>
                <td>{item.nombreDocente}</td>
                <td>{item.solicitudID || "N/A"}</td>
                <td
                  className={
                    item.estatus === "APROBADO"
                      ? styles.statusApproved
                      : item.estatus === "RECHAZADO"
                      ? styles.statusRejected
                      : styles.statusPending
                  }
                >
                  {item.estatus}
                </td>
                <td>{item.ubicacion || getMunicipioName(selectedMunicipio)}</td>
                <td>{item.cicloEscolar}</td>
                <td>
                  {item.pdf.toString() === "0" && item.estatus === "APROBADO" && item.municipio === "1" ? (
                    <button
                      disabled={
                        !item.id_ubicacion > 0 || item.estatus.toString() !== "APROBADO" || itemAction === index
                      }
                      className={`${styles.button} ${styles.buttonChanged}`}
                      onClick={async () => {
                        setItemAction(index);
                        await handleUpdate(item.id);
                        setItemAction(null);
                      }}
                    >
                      {itemAction === index ? "Actualizando..." : "Actualizar PDF"}
                    </button>
                  ) : null}
                </td>
                <td>
                  <button
                    className={`${styles.button}`}
                    disabled={item.pdf.toString() === "0" || isDownloading || item.estatus.toString() !== "APROBADO"}
                    onClick={() => handleDownload(item.id)}
                  >
                    {item.isDownloading
                      ? "Generando..."
                      : item.pdf.toString() === "0" || item.estatus.toString() !== "APROBADO"
                      ? "No disponible"
                      : "Descargar PDF"}
                  </button>
                </td>
                <td>
                  <button className={styles.button} onClick={() => handleDelete(item.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No hay docentes disponibles para este perfil</td>
            </tr>
          )}
        </tbody>
      </table>
      {modalOpen && selectedData && (
        <ModalValidacionPlanTrabajo
          isOpen={modalOpen}
          handleDownload={generatePdfPT}
          onClose={() => setModalOpen(false)}
          data={selectedData}
          onSubmit={onSubmit}
          selectedMunicipio={selectedMunicipio}
          generatePdf={generatePdf}
        />
      )}
    </>
  );
};

export default TablaPlanTrabajoDetalles;
