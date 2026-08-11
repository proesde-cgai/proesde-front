import React from "react";
import styles from "./FiltrosMaterias.module.css";

const FiltrosMaterias = ({
  searchTerm,
  handleSearchChange,
  municipios,
  selectedMunicipio,
  handleMunicipioChange,
  cicloDisponible,
  
}) => {


  return (
    <div className={styles.searchAndMunicipio}>
      {/* <div className={styles.searchInputContainer}>
        <label htmlFor="searchInput" className={styles.searchLabel}>Buscar: </label>
        <input
          type="text"
          id="searchInput"
          className={styles.searchInput}
          placeholder="Buscar por código de profesor o nombre"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div> */}
      <div className={styles.municipioFilterContainer}>
        <label htmlFor="municipioSelector">Municipio: </label>
        <select
          id="municipioSelector"
          value={selectedMunicipio}
          onChange={handleMunicipioChange}
          disabled={!cicloDisponible}
        >
          <option value="">Seleccione un municipio</option>
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

export default FiltrosMaterias;
