import React from "react";
import styles from "./planTrabajoPage.module.css";
import FormularioPlan from "../components/FormularioPlan";
import usePlanTrabajo from "../hooks/usePlanTrabajo";

const PlanTrabajoPage = () => {
  const { datosAcademico, handleChange, obtainPlanTrabajo, initialError, isLoading } = usePlanTrabajo();

  return (
    <div>
      <h2 className={styles.titulo}>Plan de Trabajo</h2>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <span style={{
            width: "48px",
            height: "48px",
            border: "5px solid #6a0dad",
            borderBottomColor: "transparent",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 1s linear infinite",
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <FormularioPlan
          datosAcademico={datosAcademico}
          handleChange={handleChange}
          obtainPlanTrabajo={obtainPlanTrabajo}
          initialError={initialError}
        />
      )}
    </div>
  );
};

export default PlanTrabajoPage;
