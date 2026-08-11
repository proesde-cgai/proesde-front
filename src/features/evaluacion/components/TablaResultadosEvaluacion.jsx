import React, { useEffect, useState } from 'react';
import styles from './styles/TablaResultadosEvaluacion.module.css';

const TablaResultadosEvaluacion = ({ resultados = [], nivel, visible = true }) => {
  const [sumaPuntuacion, setSumaPuntuacion] = useState(0);

  useEffect(() => {
    const sumaPuntuacion = resultados
      .filter(item => item.esCriterioPadre === true)
      .reduce((total, item) => total + item.puntuacion, 0);

    setSumaPuntuacion(sumaPuntuacion);
  }, [resultados])

  if (!visible) return null;

  return (
    <table className={styles.tablaResultados}>
      <thead>
        <tr className={styles.rowHeadTable}>
          <th colSpan={3}>
            Resultados <br />
            <span>Nivel: {nivel}</span>
          </th>
        </tr>
        <tr className={styles.rowHeadTh}>
          <th className={styles.tdTextCenter}>Criterio</th>
          <th className={styles.tdTextCenter}>Subtotal</th>
          <th className={styles.tdTextCenter}>Total</th>
        </tr>
      </thead>

      <tbody className={styles.bodyTable}>
        {resultados?.map(resultado => {
          const esCriterioPadre = resultado.esCriterioPadre === true;
          const esSubcriterio = resultado.esCriterioPadre === false;

          return (
            <tr key={resultado.nombreCriterio}>
              <td className={esSubcriterio ? styles.tdNombreCriterio : styles.tdCriterio}>{resultado.nombreCriterio}</td>
              <td className={styles.tdCalificacion}>
                {esSubcriterio ? resultado.puntuacion : ''}
              </td>
              <td className={styles.tdCalificacion}>
                {esCriterioPadre ? resultado.puntuacion : ''}
              </td>
            </tr>
          )
        })}
        <tr className={styles.rowFooterTable}>
          <td className={styles.tdTotal}>Total:</td>
          <td className={styles.tdCalificacion}></td>
          <td className={styles.tdCalificacion}>{sumaPuntuacion}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default TablaResultadosEvaluacion;
