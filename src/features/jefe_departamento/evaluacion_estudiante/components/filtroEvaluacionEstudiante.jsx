import React from "react";
import styles from "../styles/FiltroEvaluacionEstudiante.module.css";

const FiltroEvaluacionEstudiante = ({ searchTerm, handleSearchChange }) => {
  return (
    <div className={styles.searchAndMunicipio}>
      <div className={styles.searchInputContainer}>
        <label htmlFor="searchInput" className={styles.searchLabel}>
          Buscar:{" "}
        </label>
        <input
          type="text"
          id="searchInput"
          className={styles.searchInput}
          placeholder="Buscar por código de profesor o nombre"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default FiltroEvaluacionEstudiante;
