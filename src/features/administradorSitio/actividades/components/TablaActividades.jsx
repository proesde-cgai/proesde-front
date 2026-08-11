import React, { useEffect, useState } from "react";
import ModalEdit from "./ModalEditar";
import styles from "./styles/TablaActividades.module.css";
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from "react-icons/fa";

const TablaActividad = ({ currentItems = [], handleModifyActividad, handleEliminarAsociacion }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [localItems, setLocalItems] = useState(currentItems);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(localItems.length / itemsPerPage);
  const paginatedActivities = localItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    setLocalItems(currentItems);
  }, [currentItems]);

  const handleOpenModal = (item) => {
    setModalData(item);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setModalData(null);
  };

  const handleDelete = async (idPrincipal, submenus) => {
    await handleEliminarAsociacion(idPrincipal, submenus);
    setLocalItems((prev) => prev.filter((item) => item.id !== idPrincipal));
  };

  const onFirstPage = () => setCurrentPage(1);
  const onLastPage = () => setCurrentPage(totalPages);
  const onNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const onPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div>
      <ModalEdit
        isOpen={modalIsOpen}
        onClose={handleCloseModal}
        title="Editar Actividad"
        selectedActividad={modalData}
        ActividadPrincipal={modalData?.menuPrimario}
        onSave={handleModifyActividad}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>NOMBRE</th>
            <th>FECHA INICIO</th>
            <th>FECHA FINAL</th>
            <th>EDITAR</th>
            <th>ELIMINAR</th>
          </tr>
        </thead>
        <tbody>
          {paginatedActivities.length > 0 ? (
            paginatedActivities.map((item, index) => (
              <tr key={index}>
                <td>{item.nombreCorto}</td>
                <td>{item.fechaInicio}</td>
                <td>{item.fechaFin}</td>
                <td>
                  <button className={styles.button} onClick={() => handleOpenModal(item)}>
                    Editar
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(item.id, item.submenus)}
                    className={`${styles.button} ${item.actividad === "0" ? styles.buttonDisabled : ""}`}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay actividades</td>
            </tr>
          )}
        </tbody>
      </table>

      {localItems.length > 0 && (
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
      )}
    </div>
  );
};

export default TablaActividad;
