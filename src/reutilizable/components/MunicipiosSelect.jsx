import React from "react";
import styles from "./MunicipiosSelect.module.css";

const MunicipiosSelect = ({
  municipios,
  selectedMunicipio,
  handleMunicipioChange,
  currentPage,
}) => {
  return (
    <div className={styles.searchAndMunicipio}>
      <div className={styles.municipioFilterContainer}>
        <label htmlFor="municipioSelector">Municipio: </label>
        <select
          id="municipioSelector"
          value={selectedMunicipio}
          onChange={(e) => handleMunicipioChange(e.target.value, currentPage)}
        >
          <option value="">Seleccione un municipio</option>
          {municipios.map((municipio) => (
            <option key={municipio.id} value={municipio.municipio}>
              {municipio.municipio}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MunicipiosSelect;
