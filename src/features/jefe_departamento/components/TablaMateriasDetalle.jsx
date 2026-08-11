import React, { useState } from "react";
import ConfirmationModal from "../../../reutilizable/ConfirmationModal";
import styles from "./TablaMateriasDetalle.module.css";

const TablaMateriasDetalle = ({
  currentItems,
  editMode,
  municipios,
  changes,
  needsPdfUpdate,
  markPdfUpdated,
  cicloDisponible,
  handleInputChange,
  toggleEditMode,
  handleGenerarOActualizarPDF,
  handleConsultarPDF,
  handleEliminar,
  getSortIcon,
  handleSort,
  handleCargaSort,
  setIsEditing,
  materiasPerPage,
  currentPage,
  savedChanges,
  selectedMunicipio,
  handleGuardarCalificacion,
}) => {
  console.log("🚀 ~ file: TablaMateriasDetalle.jsx:28 ~ selectedMunicipio:", selectedMunicipio);
  React.useEffect(() => {
    const isEditing = currentItems.some((_, index) => editMode[(currentPage - 1) * materiasPerPage + index]);
    setIsEditing(isEditing);
  }, [editMode, currentItems, currentPage, materiasPerPage, setIsEditing]);
  const [processingIndex, setProcessingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const openModal = (action) => {
    setModalAction(() => action); // Store the action to be executed
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (modalAction) await modalAction();
    setIsModalOpen(false);
  };

  const handleSave = async (index) => {
    const itemChanged = currentItems.find((_, i) => i === index);
    console.log("Item changed:", itemChanged);
    if (itemChanged && itemChanged.calificacion && itemChanged.noOficio && selectedMunicipio) {
      console.log("Guardando cambios...");
      await handleGuardarCalificacion({ ...itemChanged, ubicacion: selectedMunicipio });
    } else {
      console.error("No se puede guardar, la calificación o el No. de oficio vacío");
      //no mostrar el boton generar PDF
    }
    toggleEditMode(index);
  };

  const getMunicipioName = (ubicacion) => {
    if (!ubicacion) return null;

    const municipio = municipios.find(
      (m) => m.id === Number(ubicacion) || m.municipio.toString() === ubicacion.toString()
    );
    return municipio ? municipio.municipio : "No disponible";
  };

  console.log(selectedMunicipio);
  console.log(currentItems);

  return (
    <>
      <ConfirmationModal
        type="warning"
        message="Estas seguro de proceder con la acción?"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal without action
        onConfirm={handleConfirm} // Confirm action
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort("codigoProfesor")}>CÓDIGO PROFESOR {getSortIcon("codigoProfesor")}</th>
            <th onClick={() => handleSort("nombreProfesor")}>NOMBRE DOCENTE {getSortIcon("nombreProfesor")}</th>
            <th>MATERIA</th>
            <th>CRN </th>
            <th>CLAVE </th>
            <th>CARGA HORARIA </th>
            <th>NO. OFICIO</th>
            <th>CALIFICACIÓN</th>
            <th>MUNICIPIO</th>
            <th>CICLO ESCOLAR</th>
            <th>GENERAR</th>
            <th>DESCARGAR</th>
            <th>EDITAR</th>
            <th>ELIMINAR</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((materia, index) => {
              const globalIndex = (currentPage - 1) * materiasPerPage + index; // Calculate global index
              console.log(materia.ubicacion);
              console.log(materia.statusMunicipio);
              return (
                <tr key={index}>
                  <td>{materia.codigoProfesor}</td>
                  <td>{materia.nombreProfesor}</td>
                  <td>{materia.asignatura}</td>
                  <td>{materia.crn}</td>
                  <td>{materia.clave}</td>
                  <td>{materia.cargaHoraria}</td>
                  <td>
                    {editMode[globalIndex] ? (
                      <input
                        type="text"
                        value={materia.noOficio || ""}
                        onChange={(e) => handleInputChange(globalIndex, "noOficio", e.target.value)}
                      />
                    ) : (
                      materia.noOficio || ""
                    )}
                  </td>
                  <td>
                    {editMode[globalIndex] ? (
                      <select
                        value={materia.calificacion}
                        onChange={(e) => handleInputChange(globalIndex, "calificacion", e.target.value)}
                      >
                        <option value="">Seleccione una calificación</option>
                        <option value="Bueno">Bueno</option>
                        <option value="Excelente">Excelente</option>
                        <option value="No Aplica">No Aplica</option>
                      </select>
                    ) : (
                      materia.calificacion
                    )}
                  </td>
                  <td>{getMunicipioName(materia.ubicacion) || getMunicipioName(selectedMunicipio)}</td>
                  <td>{materia.cicloEscolar}</td>
                  <td>
                    {materia.marcado === "1" &&
                    !editMode[globalIndex] &&
                    (materia.statusMunicipio === "0" ||
                      (needsPdfUpdate[globalIndex] &&
                        savedChanges[globalIndex] &&
                        (selectedMunicipio !== materia.ubicacion ||
                          materia.calificacion !== savedChanges[globalIndex].calificacion ||
                          materia.noOficio !== savedChanges[globalIndex].noOficio))) ? (
                      <button
                        className={`${styles.button} ${styles.buttonChanged}`}
                        onClick={async () => {
                          setProcessingIndex(globalIndex);
                          await handleGenerarOActualizarPDF(materia, globalIndex);
                          markPdfUpdated(globalIndex);
                          setProcessingIndex(null);
                        }}
                        disabled={processingIndex === globalIndex}
                      >
                        {processingIndex === globalIndex ? "Actualizando..." : "Actualizar PDF"}
                      </button>
                    ) : materia.marcado === "0" && materia.calificacion && materia.noOficio && materia.ubicacion ? (
                      <button
                        className={`${styles.button} ${styles.buttonChanged}`}
                        onClick={async () => {
                          setProcessingIndex(globalIndex);
                          await handleGenerarOActualizarPDF(materia, globalIndex);
                          markPdfUpdated(globalIndex);
                          setProcessingIndex(null);
                        }}
                        disabled={
                          !materia.noOficio ||
                          !materia.calificacion ||
                          !materia.ubicacion ||
                          processingIndex === globalIndex
                        }
                      >
                        {processingIndex === globalIndex ? "Generando..." : "Generar PDF"}
                      </button>
                    ) : null}
                  </td>
                  <td>
                    {materia.marcado === "0" ? (
                      <button className={`${styles.button}`} disabled={true}>
                        No disponible
                      </button>
                    ) : (
                      <button className={`${styles.button}`} onClick={() => handleConsultarPDF(materia.idQr)}>
                        Descargar PDF
                      </button>
                    )}
                  </td>
                  {editMode[globalIndex] ? (
                    <td>
                      <button
                        className={styles.button}
                        onClick={() => {
                          console.log("Guardando cambios...");
                          handleSave(globalIndex);
                        }}
                      >
                        Guardar
                      </button>
                    </td>
                  ) : (
                    <td>
                      <button
                        className={styles.button}
                        onClick={() => {
                          toggleEditMode(globalIndex);
                          handleInputChange(globalIndex, "noOficio", materia.noOficio);
                          handleInputChange(globalIndex, "calificacion", materia.calificacion);
                          handleInputChange(globalIndex, "ubicacion", materia.ubicacion);
                        }}
                      >
                        Editar
                      </button>
                    </td>
                  )}
                  <td>
                    <button
                      className={`${styles.button} ${materia.marcado === "0" ? styles.buttonDisabled : ""}`}
                      onClick={() => {
                        window.confirm(
                          "¿Estás seguro de que deseas eliminar este oficio? Esta acción no se puede deshacer."
                        ) && handleEliminar(materia, globalIndex);
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="15">No hay materias disponibles para el ciclo seleccionado</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default TablaMateriasDetalle;
