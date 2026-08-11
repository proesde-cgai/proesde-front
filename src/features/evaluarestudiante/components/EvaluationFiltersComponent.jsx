import React from 'react';
import styles from './EvaluationFiltersComponent.module.css';
import Search from "../../../reutilizable/Search";

const EvaluationFiltersComponent = ({ onSearch }) => {
  return (
    <div>
      <div className={styles.filters}>
      </div>

      {/* Colocamos el título fuera del div que contiene los filtros */}
      <article>
        <header className={styles.constancia_title_container}>
          <h3 className={styles.constancia_title}>
            Constancia de evaluación de estudiante
          </h3>
        </header>
      </article>
    </div>
  );
};

export default EvaluationFiltersComponent;
