import React, { useState, useEffect, useCallback } from "react";
import CreateActividadForm from "../components/CreateActividadForm";

import styles from "./styles/CrearActividades.module.css";

const CrearActPage = () => {
  const [selectedActivityType, setSelectedActivityType] = useState("");

  const handleReporteChange = (e) => {
    setSelectedActivityType(e.target.value);
  };

  return (
    <div className={styles.container}>
      <article>
        <header>
          <h3 className={styles.inconformidad_title}>
            Crear Actividad
          </h3>
        </header>

        <div className={styles.container_aside}>
          <div className={styles.aside}>
            <div className={styles.column}>
              <label htmlFor="reporte" className={styles.label}>
                Actividad:
              </label>
              <select
                id="act"
                className={styles.select}
                value={selectedActivityType}
                onChange={handleReporteChange}
              >
                <option value="">Seleccione un tipo de actividad</option>
                <option value="true">Actividad Principal</option>
                <option value="false">Actividad Secundaria</option>
              </select>
            </div>
          </div>
          <div className={styles.solicitudContainer}>
            <CreateActividadForm
              ActividadPrincipal={selectedActivityType}
              selectedActividad={selectedActivityType}
            />
          </div>
        </div>


      </article>
    </div>
  );
};

export default CrearActPage;
