import React from 'react'
import styles from './styles/RowBodyTable.module.css'

/**
 * Componente que representa el body una tabla.
 * 
 * @param {Object} props - Las propiedades del componente.
 * @param {Array<>} props.bodyTable - Un arreglo con los datos del body de la tabla.
 * @returns {JSX.Element} El elemento JSX que representa el body una tabla.
 */
const RowBodyTable = ({ bodyTable }) => {
  return (
    <>
     {bodyTable.map(itemsBody => {
      return (
        <tr key={itemsBody.id} className={styles.tr_body}>
          <td className={`${styles.td_checkbox} ${styles.td}`}>
            <input type="checkbox" />
          </td>
          <td className={`${styles.td} ${styles.td_textCenter}`}>{itemsBody.num}</td>
          <td className={`${styles.td} ${styles.td_}`}>{itemsBody.nombre}</td>
          <td className={`${styles.td} ${styles.td_}`}>{itemsBody.tipo}</td>
          <td className={`${styles.td} ${styles.td_}`}>{itemsBody.dependencia}</td>
          <td className={`${styles.td} ${styles.td_}`}>{itemsBody.nivel}</td>
          <td className={`${styles.td} ${styles.td_}`}>{itemsBody.calidad}</td>
          <td className={`${styles.td} ${styles.td_}`}>{itemsBody.pts}</td>
        </tr>
      )
     })} 
    </>
  )
}

export default RowBodyTable
