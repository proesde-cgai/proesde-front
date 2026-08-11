import React from 'react'
import styles from './styles/AsideInstrucciones.module.css'

const AsideInstrucciones = () => {
  return (
    <div className={styles.aside}>
      <p>INSTRUCCIONES</p>

      <p>
        Pueden imprimirse dos clases de reportes:
      </p>

      <ul className={styles.list_instrucciones}>
        <li>
            Actas de acuerdos de la comisión dictaminadora
        </li>
        <li>
            Reportes de las evaluaciones efectuadas en el transcurso
            del dia actual, o bien en un intervalo de fechas
        </li>
      </ul>

      <p>
        Algunos campos de las formas ya contienen texto prestablecido, y en
        otros se podrá agregar texto libremente.
      </p>

      <p>
        Las actas y reportes incluyen los nombres de los integrantes de la 
        comisión y la fecha; se generan en PDF y quedan almacenadas en la
        computadora local.
      </p>
    </div>
  )
}

export default AsideInstrucciones
