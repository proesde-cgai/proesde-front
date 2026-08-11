import React, { useState } from 'react';
import { useModalidadEvaluacion } from '../store/useModalidadEvaluacionStore';
import styles from './styles/ArmarExpedientePage.module.css';

const ArmarExpedientePage = () => {
  const { modalidadEvaluacion } = useModalidadEvaluacion();
  

  const [modalidad, setModalidad] = useState('art26');

  /* if (modalidadEvaluacion) {
    return <p>Pa atras</p>;
  } */


  return (
    <div className={styles.containerArmarExpediente}>
      <p>hiiiii</p>
    </div>
  );
}

export default ArmarExpedientePage;
