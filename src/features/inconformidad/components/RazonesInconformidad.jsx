import React, { useEffect, useState } from 'react';
import { getRazonesInconformidad } from '../services/razonesInconformidadService';
import styles from './styles/RazonesInconformidad.module.css';

const RazonesInconformidad = () => {
  const [razonesInconformidad, setRazonesInconformidad] = useState({});

  useEffect(() => {
    getRazonesInconformidad()
      .then(response => setRazonesInconformidad(response))
      .catch(error => console.error('Error al establecer razones de inconformidad: ', error))
  }, []);

  const { fechaRecibido, fechaInconformidad, razones, respuesta } = razonesInconformidad;

  return (
    <div className={styles.container}>
      <div className={styles.containerData}>
        <div className={styles.datosPersonales}>
          <div className={styles.containerTableData}>
            <div className={styles.inputContainer}>
              <label htmlFor='solicitudRecibida'>Solicitud Recibida el</label>
              <input
                id='solicitudRecibida'
                type='text'
                value={fechaRecibido || 'No existe registro de fecha'}
                readOnly
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor='fechaInconformidad'>Fecha de inconformidad</label>
              <input
                id='fechaInconformidad'
                type='text'
                value={fechaInconformidad || 'No existe registro de fecha'}
                readOnly
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor='razonesInconformidad'>Razones de inconformidad</label>
              <textarea
                id='razonesInconformidad'
                type='text'
                value={razones || 'Sin razones'}
                readOnly
              ></textarea>
            </div>
          </div>
        </div>

        <div className={styles.containerRespuestaInconformidad}>
          <div className={styles.inputContainer}>
            <label htmlFor='respuestaInconformidad'>Respuesta de inconformidad</label>
            <textarea
              id='respuestaInconformidad'
              type='text'
              value={respuesta || 'Sin respuesta'}
              readOnly
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RazonesInconformidad;
