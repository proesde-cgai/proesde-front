import React, { useEffect } from "react";
import styles from "./MateriaModal.module.css";

const MateriaModal = ({
  profesorData,
  modalIsOpen,
  setModalIsOpen,
  getAllMateriasProfesor,
  materiasList,
  setMateriaList,
  updateMateriasProfesor,
}) => {
  useEffect(() => {
    if (!profesorData.materia) {
      const fetchMaterias = async () => {
        if (profesorData && Object.keys(profesorData).length > 0) {
          const response = await getAllMateriasProfesor({
            cicloEscolar: profesorData.cicloEscolar,
            codigoEmpleado: profesorData.codigoProfesor,
            idQr: profesorData.idQr,
          });
          const materiasWithCalificaciones = response.map((materia) => ({
            ...materia,
            resultado: "Bueno",
          }));
          setMateriaList(materiasWithCalificaciones);
        }
      };
      fetchMaterias();
    } else {
      setMateriaList(profesorData.materia);
    }

    // eslint-disable-next-line
  }, [profesorData, getAllMateriasProfesor]);

  const closeModal = () => setModalIsOpen(false);

  const handleCalificacionChange = (value, materiaIdx) => {
    setMateriaList((prev) =>
      prev.map((materia, idx) =>
        idx === materiaIdx
          ? { ...materia, resultado: value } // Actualiza solo la calificación correspondiente
          : materia
      )
    );
  };

  const handleAccept = () => {
    updateMateriasProfesor(profesorData, materiasList);
    closeModal();
  };

  if (!modalIsOpen) return;

  if (!profesorData) return <p>No hay información que mostrar</p>;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalTitle}>
          <h2>Materias del Profesor</h2>
          <button className={styles.closeButton} onClick={closeModal}>
            X
          </button>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Calificación</th>
                <th>Materia</th>
                <th>CRN</th>
                <th>Clave</th>
                <th>Carga Horaria</th>
              </tr>
            </thead>
            <tbody>
              {materiasList.length > 0 ? (
                materiasList.map((materia, idx) => (
                  <tr key={idx}>
                    <td>
                      <select value={materia.resultado} onChange={(e) => handleCalificacionChange(e.target.value, idx)}>
                        <option value="" disabled>
                          Selecciona una nota
                        </option>
                        <option value="BUENO">BUENO</option>
                        <option value="MALO">MALO</option>
                        <option value="EXCELENTE">EXCELENTE</option>
                      </select>
                    </td>
                    <td>{materia.asignatura}</td>
                    <td>{materia.crn}</td>
                    <td>{materia.clave}</td>
                    <td>{materia.cargaHoraria}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No hay materias disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.acceptButton} onClick={handleAccept}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MateriaModal;
