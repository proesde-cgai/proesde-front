
import React, { useState, useEffect } from "react";
import Input from "../../../components/Input";
import styles from "./styles/FormPrincipal.module.css";

const SecondaryFormField = (
  {
    selectedSecActivity,
    formValues,
    onInputChange,
    onAddActivity,
  }
) => {

  //La idea es primero enviar la info de actividad principal y luego la info de las actividades secundarias asociadas

  if (!selectedSecActivity) return null;

  return (
    <form onSubmit={(e) => {
      e.preventDefault(); 
      onAddActivity(); 
    }}>
      <div className={styles.formContainer}>
          <Input
            type="date"
            label="Fecha Inicial"
            name="fechaInicio"
            value={formValues.fechaInicio}
            onChange={onInputChange}
          />
          <Input
            type="date"
            label="Fecha Final"
            name="fechaFinal"
            value={formValues.fechaFinal}
            onChange={onInputChange}
            min={formValues.fechaInicio || new Date().toISOString().split("T")[0]}
          />
      </div>
          <div className={styles.addBtn}>
            <button
              type="button"
              className={styles.btn}
              onClick={onAddActivity}
              disabled={!formValues.fechaInicio || !formValues.fechaFinal}
            >
              +
            </button>
          </div>

          <div className={styles.submit}>
            <button 
                type="submit" 
                className={styles.btn}
                >
                    Guardar
            </button>       
          </div>
    </form>

  );
};

export default SecondaryFormField;
