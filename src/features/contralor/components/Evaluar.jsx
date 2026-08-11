import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/Evaluar.module.css';
import FormEvaluacionInconformidad from './FormEvaluacionInconformidad';


const Evaluar = ({ withHead = true }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const questionRefs = useRef([]); // Referencias para las preguntas
    const totalQuestions = 0; // En total serian 6 preguntas del formulario de evaluar
    const [ultimoMiembro, setUltimoMiembro] = useState({});
    console.log("Nombre del ultimo evaluado: ", ultimoMiembro);

    const handleClickUP = () => {
        setCurrentQuestion((prev) => {
            const newIndex = prev > 0 ? prev - 1 : prev;
            questionRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth' });
            return newIndex;
        });
    };

    const handleClickDown = () => {
        setCurrentQuestion((prev) => {
            const newIndex = prev < totalQuestions - 1 ? prev + 1 : prev;
            questionRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth' });
            return newIndex;
        });
    };

    return (
        <div className={styles.container}>
            {withHead ? (
                <div className={styles.head_evaluacion}>
                    <div className={styles.container_head}>
                        <div className={styles.container_head_buttons}>
                            <button type='button' onClick={handleClickUP}>
                                <FontAwesomeIcon icon={faArrowUp} color='black' />
                            </button>
                            <button type='button' onClick={handleClickDown}>
                                <FontAwesomeIcon icon={faArrowDown} color='black' />
                            </button>
                        </div>
                        <p>Panel de Evaluación</p>
                        <p>
                            1 de 6
                        </p>
                    </div>
                    <div className={styles.data_nombre}>
                        <p>
                            Última evaluación realizada por: <span>{ultimoMiembro ? ultimoMiembro.nombre : "No se encontro el nombre del ultimo evaluador."}</span>
                        </p>
                    </div>
                </div>
            ) : <></>}

            <div className={styles.container_evaluacion}>
                {/* <FormularioEvaluar questionRefs={questionRefs}/> */}
                <FormEvaluacionInconformidad setUltimoMiembro={setUltimoMiembro} />
            </div>
        </div>
    )
}

export default Evaluar 
