import React from "react";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import styles from "./TablaProfesoresPaginacion.module.css";

const TablaProfesoresPaginacion = ({
  currentPage,
  totalPages,
  onFirstPage,
  onLastPage,
  onPreviousPage,
  onNextPage,
}) => {
  return (
    <div
      className={styles.pagination}
      style={{ textAlign: "center", margin: "20px 0" }}
    >
      <button onClick={onFirstPage} disabled={currentPage === 1}>
        <FaAngleDoubleLeft />
      </button>
      <button onClick={onPreviousPage} disabled={currentPage === 1}>
        <FaAngleLeft />
      </button>
      <span style={{ margin: "0 15px" }}>
        Página {currentPage} de {totalPages}
      </span>
      <button onClick={onNextPage} disabled={currentPage === totalPages}>
        <FaAngleRight />
      </button>
      <button onClick={onLastPage} disabled={currentPage === totalPages}>
        <FaAngleDoubleRight />
      </button>
    </div>
  );
};

export default TablaProfesoresPaginacion;
