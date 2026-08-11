import React, { useState } from "react";
import TablaPlanTrabajo from "../components/TablaPlanTrabajo";
import styles from "../styles/ValidacionPlanTrabajoPage.module.css";

const ValidacionPlanTrabajoPage = ({ userInfo }) => {
  const [planTrabajo, setPlanTrabajo] = useState([]);

  return (
    <div>
      <article>
        <header>
          <h3 className={styles.constancia_title}>Validación de plan de trabajo</h3>
        </header>

        <TablaPlanTrabajo planTrabajo={planTrabajo} setPlanTrabajo={setPlanTrabajo} userInfo={userInfo} />
      </article>
    </div>
  );
};

export default ValidacionPlanTrabajoPage;
