import React from "react";
import styles from "../styles/FiltroValidacionPlanTrabajo.module.css";

const FiltroValidacionPlanTrabajo = ({
  searchTerm,
  handleSearchChange,
  municipios,
  selectedMunicipio,
  handleMunicipioChange,
  selectedStatus,
  handleStatusChange,
}) => {

  console.log(selectedMunicipio)
  return (
    <div className={styles.filterContainer}>
      {/* <div className={styles.filterGroup}>
        <label htmlFor="searchInput" className={styles.label}>
          Buscar:
        </label>
        <input
          type="text"
          id="searchInput"
          className={styles.input}
          placeholder="Buscar por código de profesor o nombre"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div> */}
      <div className={styles.filterGroup}>
        <label htmlFor="statusSelector" className={styles.label}>
          Filtrar por estatus:
        </label>
        <select
          id="statusSelector"
          className={styles.select}
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="APROBADO">Aprobado</option>
          <option value="PENDIENTE_REVISION">Pendiente</option>
          <option value="RECHAZADO">Rechazado</option>
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label htmlFor="municipioSelector" className={styles.label}>
          Municipio:
        </label>
        <select
          id="municipioSelector"
          className={styles.select}
          value={selectedMunicipio || ""}
          onChange={handleMunicipioChange}
        >
          <option value="">Todos</option>
          {municipios.map((municipio) => (
            <option key={municipio.id} value={municipio.id}>
              {municipio.municipio}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FiltroValidacionPlanTrabajo;
