import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import FormCriterios from '../components/FormCriterios';
import styles from './styles/TabEvaluarPage.module.css';
import { useEvaluationStore } from '../../../store/useEvaluationStore';

const TabEvaluarPage = () => {
  const { selectedDataAcademico, ultimoMiembro, fetchStatusEvaluacion, } = useEvaluationStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionRefs = useRef([]); // Referencias para las preguntas
  const totalQuestions = 0; // En total serian 6 preguntas del formulario de evaluar

  useEffect(() => {
    fetchStatusEvaluacion();
    // eslint-disable-next-line
  }, []);

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
              <FontAwesomeIcon icon={faArrowUp} color='white' size='xl' />
            </button>
            <button type='button' onClick={handleClickDown}>
              <FontAwesomeIcon icon={faArrowDown} color='white' size='xl' />
            </button>
          </div>
          <p>Panel de Evaluación</p>
          {/* <p>
            1 de 6
          </p> */}
        </div>
        <div className={styles.data_nombre}>
          <p>
            Última evaluación realizada por: <span>{ultimoMiembro}</span>
          </p>
        </div>
      </div>

      <div className={styles.container_evaluacion}>
        {/* <FormularioEvaluar questionRefs={questionRefs}/> */}
        <FormCriterios />
      </div>
    </div>
  )
}

export default TabEvaluarPage