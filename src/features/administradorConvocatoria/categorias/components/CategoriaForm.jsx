import React from "react";
import styles from "../styles/CategoriaForm.module.css";

function CategoriaForm() {
  return (
    <>
      <div className={styles.form_container}>
        <form className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Formato:</label>
            <div className={styles.radio_group}>
              <label>
                <input type="radio" name="format" value="pdf" defaultChecked />{" "}
                PDF
              </label>
              <label>
                <input type="radio" name="format" value="excel" /> Excel
              </label>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Reporte:</label>
            <select className={styles.select}>
              <option>Comparación convocatoria a</option>
              <option>Otro reporte</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Contra:</label>
            <select className={styles.select}>
              <option>PROESDE 2023-2024</option>
              <option>Otro ciclo</option>
            </select>
          </div>
        </form>
      </div>
      <div className={styles.button_container}>
        <button className={styles.button}>Imprimir</button>
      </div>
    </>
  );
}

export default CategoriaForm;
