import styles from "./EvaluationTableComponent.module.css";
import React, { useState, useEffect } from "react";


const ModalContent = (materias = []) => {
    return (  
        <table className={styles.table}>
        <thead>
          <tr>
            <th>MATERIA</th>
            <th>CRN</th>
            <th>CLAVE</th>
            <th>CARGA HORARIA</th>
            <th>CALIFICACIÓN</th>
          </tr>
        </thead>
        <tbody>
          {materias.length > 0 ? (
            materias.map((materia, index) => (
              <tr key={index}>
                <td>{materia.asignatura || "N/A"}</td>
                <td>{materia.crn || "N/A"}</td>
                <td>{materia.clave || "N/A"}</td>
                <td>{materia.cargaHoraria || "N/A"}</td>
                <td>{materia.calificacion || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="14">No hay materias disponibles para evaluar.</td>
            </tr>
          )}
        </tbody>
      </table>
    );
}

export default ModalContent;