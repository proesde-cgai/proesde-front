import React from 'react';
import RowHeadTable from './RowHeadTable';
import styles from './styles/Table.module.css';

/**
 * Componente que representa una tabla.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {Array<{ id: number, labelCabecera: string }>} props.cabecerasTable - Un arreglo de objetos que representan las cabeceras de la tabla.
 * @param {Boolean} props.withHeader - Variable booleana para agregar o no un header arriba del thead a la tabla (por defecto es false)
 * @param {React.ReactNode} props.children - Fila(s) que tendra el body de la tabla
 * @param {Function} props.onSelectAll - Función para seleccionar/deseleccionar todas las filas.
 * @param {Boolean} props.isAllSelected - Indica si todas las filas están seleccionadas.
 * @returns {JSX.Element} El elemento JSX que representa una tabla.
 */
const Table = ({ cabecerasTable, withHeader = false, children, onSelectAll, isAllSelected }) => {
  const sizeColSpan = cabecerasTable.length; // se obtiene el tamaño del arrego de las cabeceras

  return (
    <table>
      <thead>
        {withHeader && (
          <tr>
            <th colSpan={sizeColSpan} className={styles.message_head}>
              Haga click en cualquier fila para seleccionarla/deseleccionarla. Cuando termine, haga clic en "Generar PDF"
            </th>
          </tr>
        )}
        <RowHeadTable 
          cabecerasTable={cabecerasTable}
          onSelectAll={onSelectAll}
          isAllSelected={isAllSelected}
        />
      </thead>

      <tbody className={styles.tabla_body}>
        {children}
      </tbody>
    </table>
  )
}

export default Table;
