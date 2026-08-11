import React, { useState } from "react";
import Input from "../../components/Input";
import styles from "./styles/SecondaryActivitiesTable.module.css";
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from "react-icons/fa";

const SecondaryActivitiesTable = ({
  secondaryActivities,
  setSecondaryActivities,
  mainActivityDates,
  handleSubmit,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(secondaryActivities.length / itemsPerPage);
  const paginatedActivities = secondaryActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSecondaryActivityToggle = (id) => {
    setSecondaryActivities((prev) =>
      prev.map((activity) =>
        activity.id === id
          ? { ...activity, selected: !activity.selected }
          : activity
      )
    );
  };

  const handleSecondaryDateChange = (id, name, value) => {
    const updatedActivities = secondaryActivities.map((activity) => {
      if (activity.id === id) {
        const updatedActivity = { ...activity, [name]: value };

        const { fechaInicio, fechaFinal } = updatedActivity;
        const mainFechaInicio = new Date(mainActivityDates.fechaInicio);
        const mainFechaFinal = new Date(mainActivityDates.fechaFinal);
        const selectedDate = new Date(value);

        if (name === "fechaInicio" && selectedDate < mainFechaInicio) {
          alert(`La fecha de inicio debe estar dentro del rango de la actividad principal: 
            ${mainActivityDates.fechaInicio} - ${mainActivityDates.fechaFinal}`);
        }

        if (name === "fechaFinal" && selectedDate > mainFechaFinal) {
          alert(`La fecha de finalización debe estar dentro del rango de la actividad principal: 
            ${mainActivityDates.fechaInicio} - ${mainActivityDates.fechaFinal}`);
        }

        if (name === "fechaFinal" && fechaInicio && selectedDate < new Date(fechaInicio)) {
          alert(`La fecha de finalización no puede ser anterior a la fecha de inicio.`);
        }

        if (name === "fechaInicio" && fechaFinal && selectedDate > new Date(fechaFinal)) {
          alert(`La fecha de inicio no puede ser posterior a la fecha de finalización.`);
        }

        return updatedActivity;
      }
      return activity;
    });

    setSecondaryActivities(updatedActivities);
  };

  const allDatesValid = secondaryActivities.every((activity) => {
    if (activity.selected) {
      const fechaInicio = new Date(activity.fechaInicio);
      const fechaFinal = new Date(activity.fechaFinal);
      const mainFechaInicio = new Date(mainActivityDates.fechaInicio);
      const mainFechaFinal = new Date(mainActivityDates.fechaFinal);

      return (
        fechaInicio >= mainFechaInicio &&
        fechaFinal <= mainFechaFinal &&
        fechaInicio <= fechaFinal
      );
    }
    return true;
  });

  const onFirstPage = () => setCurrentPage(1);
  const onLastPage = () => setCurrentPage(totalPages);
  const onNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const onPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className={styles.tableContainer}>
      <h4 className={styles.subTitle}>Actividades Secundarias</h4>
      {secondaryActivities.length > 0 ? (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Seleccionar</th>
                <th className={styles.txtCenter}>Nombre</th>
                <th className={styles.txtCenter}>Fecha Inicio</th>
                <th className={styles.txtCenter}>Fecha Final</th>
              </tr>
            </thead>
            <tbody>
              {paginatedActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={activity.selected}
                      onChange={() => handleSecondaryActivityToggle(activity.id)}
                    />
                  </td>
                  <td className={styles.txtCenter}>{activity.actividad}</td>
                  <td>
                    <Input
                      type="date"
                      value={activity.fechaInicio}
                      onChange={(e) =>
                        handleSecondaryDateChange(activity.id, "fechaInicio", e.target.value)
                      }
                      disabled={!activity.selected}
                    />
                  </td>
                  <td>
                    <Input
                      type="date"
                      value={activity.fechaFinal}
                      onChange={(e) =>
                        handleSecondaryDateChange(activity.id, "fechaFinal", e.target.value)
                      }
                      disabled={!activity.selected}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button onClick={onFirstPage} disabled={currentPage === 1}>
              <FaAngleDoubleLeft />
            </button>
            <button onClick={onPreviousPage} disabled={currentPage === 1}>
              <FaAngleLeft />
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button onClick={onNextPage} disabled={currentPage === totalPages}>
              <FaAngleRight />
            </button>
            <button onClick={onLastPage} disabled={currentPage === totalPages}>
              <FaAngleDoubleRight />
            </button>
          </div>

          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !mainActivityDates.fechaInicio ||
              !mainActivityDates.fechaFinal ||
              !allDatesValid ||
              secondaryActivities.length === 0 
            }
          >
            Guardar Asociación
          </button>
        </>
      ) : (
        <p className={styles.noDataText}>No hay actividades secundarias disponibles.</p>
      )}
    </div>
  );
};

export default SecondaryActivitiesTable;
