import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import FormCriterios from '../../evaluacion/components/FormCriterios';
import styles from './styles/Evaluar.module.css';
import FormEvaluacionInconformidad from '../components/FormEvaluacionInconformidad';import { useInconformidadStore } from '../../../store/useInconformidadStore';
;

const Evaluar = () => {
  const { ultimoMiembro, } = useInconformidadStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionRefs = useRef([]); // Referencias para las preguntas
  const totalQuestions = 0; // En total serian 6 preguntas del formulario de evaluar

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
            Última evaluación realizada por: <span>{ultimoMiembro}</span>
          </p>
        </div>
      </div>

      <div className={styles.container_evaluacion}>
        {/* <FormularioEvaluar questionRefs={questionRefs}/> */}
        <FormEvaluacionInconformidad />
      </div>
    </div>
  )
}

export default Evaluar 
