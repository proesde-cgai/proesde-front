import React, { useState } from "react";

import TablaCargaHoraria from '../components/TablaCargaHoraria'
import styles from "../styles/CargaHorariaPage.module.css";

const CargaHorariaPage = ({ userInfo }) => {
  const [materias, setMaterias] = useState([]);

  return (
    <div>
      <article>
        <header>
          <h3 className={styles.constancia_title}>
          Generar oficio de carga horaria
          </h3>
        </header>

        <TablaCargaHoraria
          materias={materias}
          setMaterias={setMaterias}
          userInfo={userInfo}
        />

      </article>
    </div>
  );
};

export default CargaHorariaPage;
