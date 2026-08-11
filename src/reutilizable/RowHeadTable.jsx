import React from 'react';
import styles from './styles/RowHeadTable.module.css';

/**
 * Componente que representa la fila de cabeceras de una tabla.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {Array<{ id: number, labelCabecera: string }>} props.cabecerasTable - Un arreglo de objetos que representan las cabeceras de la tabla.
 * @param {Function} props.onSelectAll - Función para seleccionar/deseleccionar todas las filas.
 * @param {Boolean} props.isAllSelected - Indica si todas las filas están seleccionadas.
 * @returns {JSX.Element} El elemento JSX que representa la fila de cabeceras.
 */

const RowHeadTable = ({ cabecerasTable, onSelectAll, isAllSelected }) => {
  return (
    <tr className={styles.rowHead}>
      {cabecerasTable.map((cabecera, index) => {
        if (cabecera.labelCabecera === "inp" && onSelectAll) {
          return (
            <th key={cabecera.id} className={styles.rowHead} style={{ textAlign: cabecera.center ? "center" : "left" }}>
              <input 
                type="checkbox" 
                checked={isAllSelected}
                onChange={onSelectAll}
              />
            </th>
          );
        }
        return (
          <th key={cabecera.id} className={styles.rowHead} style={{ textAlign: cabecera.center ? "center" : "left" }}>
            {cabecera.labelCabecera}
          </th>
        );
      })}
    </tr>
  )
}

export default RowHeadTable
