import React, { useMemo } from 'react';
import styles from './styles/tablaInconformidad.module.css';

const TablaInconformidad = ({ resultados = [], nivel }) => {
  const sumaPuntuacion = useMemo(() => {
    return resultados
      .filter(item => item.esCriterioPadre)
      .reduce((total, item) => total + item.puntuacion, 0);
  }, [resultados]);

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
        {resultados?.map((resultado, index) => {
          const esPadre = resultado.esCriterioPadre === true;
          const esHijo = resultado.esCriterioPadre === false;

          return (
            <tr key={`${resultado.nombreCriterio}-${index}`}>
              <td className={esHijo ? styles.tdNombreCriterioHijo : styles.tdNombreCriterioPadre}>
                {resultado.nombreCriterio}
              </td>
              <td className={styles.tdCalificacion}>
                {esHijo ? resultado.puntuacion : ''}
              </td>
              <td className={styles.tdCalificacion}>
                {esPadre ? resultado.puntuacion : ''}
              </td>
            </tr>
          );
        })}
        <tr className={styles.rowFooterTable}>
          <td className={styles.tdTotal}>Total:</td>
          <td className={styles.tdCalificacion}></td>
          <td className={styles.tdCalificacion}>{sumaPuntuacion}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default TablaInconformidad;
