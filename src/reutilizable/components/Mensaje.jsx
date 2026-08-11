import React, { useEffect, useState } from "react";
import { obtenerAnios } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import styles from '../styles/Mensaje.module.css';

const Mensaje = ({ nombreModulo = '' }) => {

  const { anioActual, anioSiguiente } = obtenerAnios();

  return (
      <div className={styles.container}>
          <p className={styles.titulo}>
              <FontAwesomeIcon icon={faChevronRight} className={styles.icon} size='xl'/>{' '}
              Programa para estimulos al desempeño docente {anioActual} - {anioSiguiente}
          </p>

          <div className={styles.texto}>
              <p>
                  Bienvenido al módulo de {nombreModulo} <br/>
                  <span>Instrucciones</span>
              </p>
          </div>



      </div>
  )
}

export default Mensaje