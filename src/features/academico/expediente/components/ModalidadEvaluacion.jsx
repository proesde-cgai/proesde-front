import React, { useEffect, useState } from 'react';
import Modal from '../../../../reutilizable/Modal';
import { useModalidadEvaluacion } from '../store/useModalidadEvaluacionStore';
import ContentModalSeleccionarModalidad from './ContentModalSeleccionarModalidad';
import styles from './styles/ModalidadEvaluacion.module.css';

const ModalidadEvaluacion = ({ setStatus }) => {

  const { getModalidadesEvaluacion, modalidadesEvaluacion } = useModalidadEvaluacion();

  const [isArt29ModalOpen, setIsArt29ModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoEvaluacion, setTipoEvaluacion] = useState(null);
  const [tipoPRODEP, setTipoPRODEP] = useState(null);

  const openModal = () => setIsModalOpen(!isModalOpen);
  const onClose = () => setIsModalOpen(!isModalOpen);

  const openModalArt29 = () => setIsArt29ModalOpen(!isArt29ModalOpen)
  const onCloseModalArt29 = () => setIsArt29ModalOpen(!isArt29ModalOpen)

  useEffect(() => {
    getModalidadesEvaluacion();
  }, [getModalidadesEvaluacion])

  useEffect(() => {
    if (modalidadesEvaluacion && Array.isArray(modalidadesEvaluacion)) {
      // Buscar el tipo de participación que contiene "Evaluación"
      const evaluacion = modalidadesEvaluacion.find(tipo => {
        const descripcion = tipo.desciptcion || '';
        return descripcion.toLowerCase().includes('evaluación') || descripcion.toLowerCase().includes('evaluacion');
      });

      // Buscar el tipo de participación que contiene "PRODEP" o "Art.26"
      const prodep = modalidadesEvaluacion.find(tipo => {
        const descripcion = tipo.desciptcion || '';
        return descripcion.toLowerCase().includes('prodep') || descripcion.toLowerCase().includes('art.26') || descripcion.toLowerCase().includes('art 26');
      });

      setTipoEvaluacion(evaluacion);
      setTipoPRODEP(prodep);
    }
  }, [modalidadesEvaluacion]);

  const handleClick = (tipoParticipacion) => {
    if (tipoParticipacion && tipoParticipacion.id) {
      // Determinar si es Evaluación o PRODEP basándose en la descripción
      const descripcion = tipoParticipacion.desciptcion || '';
      const esEvaluacion = descripcion.toLowerCase().includes('evaluación') || descripcion.toLowerCase().includes('evaluacion');

      if (esEvaluacion) {
        openModalArt29();
      } else {
        openModal();
      }
    }
  };

  // Función para obtener el texto del botón basado en la descripción
  const getButtonText = (tipo) => {
    if (!tipo) return '';
    const descripcion = tipo.desciptcion;
    const esEvaluacion = descripcion.toLowerCase().includes('evaluación') || descripcion.toLowerCase().includes('evaluacion');

    if (esEvaluacion) {
      return <>Art. 29 <br /> (Evaluación)</>;
    } else {
      return <>Art. 26 <br />(Perfil PRODEP)</>;
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.titulo}>Seleccione la modalidad de participación</p>

      <form className={styles.formulario}>
        <div className={styles.containerButtons}>
          {tipoEvaluacion && (
            <button
              className={styles.buttonModalidad}
              type='button'
              onClick={() => handleClick(tipoEvaluacion)}
            >
              {getButtonText(tipoEvaluacion)}
            </button>
          )}

          {tipoPRODEP && (
            <button
              className={styles.buttonModalidad}
              type='button'
              onClick={() => handleClick(tipoPRODEP)}
            >
              {getButtonText(tipoPRODEP)}
            </button>
          )}
        </div>

        <p className={styles.textoAdvertencia}>
          NOTA: Por favor, verifique la modalidad de participación antes de continuar.
        </p>
      </form>

      <Modal isOpen={isModalOpen} onClose={onClose} >
        <ContentModalSeleccionarModalidad
          onClose={onClose}
          setStatus={setStatus}
          idTipoParticipacion={tipoPRODEP?.id}
          descripcion={tipoPRODEP?.desciptcion}
        />
      </Modal>

      <Modal isOpen={isArt29ModalOpen} onClose={onCloseModalArt29} >
        <ContentModalSeleccionarModalidad
          onClose={onCloseModalArt29}
          setStatus={setStatus}
          idTipoParticipacion={tipoEvaluacion?.id}
          descripcion={tipoEvaluacion?.desciptcion}
        />
      </Modal>
    </div>
  );
};

export default ModalidadEvaluacion;
