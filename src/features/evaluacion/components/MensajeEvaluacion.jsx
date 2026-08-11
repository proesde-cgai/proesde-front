import React from 'react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles/MensajeEvaluacion.module.css';
import { obtenerAnios } from '../../../utils';
import useStoredFecha from "../../useStoredFecha";

const MensajeEvaluacion = ({ nombreModulo = 'Evaluación' }) => {

    const { anioActual, anioSiguiente } = obtenerAnios();
    const fecha = useStoredFecha();
    const displayDate = fecha?.rangoFecha || "2024-2025";  
    return (
        <div className={styles.container}>
            <p className={styles.titulo}>
                <FontAwesomeIcon icon={faChevronRight} className={styles.icon} />{' '}
                Programa para estimulos al desempeño docente {displayDate}
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

export default MensajeEvaluacion
