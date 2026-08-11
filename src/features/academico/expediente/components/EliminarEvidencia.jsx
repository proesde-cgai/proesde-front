import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { eliminarDocRequisitosExpediente } from '../services/requisitosExpedienteService';
import { eliminarDocCriterioExpediente } from '../services/criteriosExpedienteService';
import styles from './styles/EliminarEvidencia.module.css';
import Modal from '../../../../reutilizable/Modal';
import ContentModalEliminarEvidencia from './ContentModalEliminarEvidencia';

const SERVICES = {
  eliminarDocRequisito: async (body) => {
    await eliminarDocRequisitosExpediente(body)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error('Error al eliminar el requisito del expediente: ', error);
      });
  },

  eliminarDocCriterio: async (body) => {
    await eliminarDocCriterioExpediente(body)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error('Error al eliminar el criterio del expediente: ', error);
      });
  }
};

/**
 * Componente EliminarEvidencia para eliminar un documento ya sea de requisitos o criterios.
 *
 * @param {Object} props - Props del componente.
 * @param {'criterio' | 'requisito'} props.tipoDelete - Tipo de accion (delete) que hara el componente
 * @param {Number} props.idExpediente - Id del criterio que se eliminara su respectivo documento
 * @param {Number} props.idSolicitud - Id de la solicitud del academico
 * @param {Boolean} props.activo - Indica si activar o no el boton para eliminar el documento
 *
 * @returns {JSX.Element} Formulario con boton de eliminar un documento.
 */
const EliminarEvidencia = ({ tipoDelete, idExpediente, idSolicitud, activo, onDeleteSuccess, requisito }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} with='100px'>
        <ContentModalEliminarEvidencia
          idExpediente={idExpediente}
          tipoDelete={tipoDelete}
          idSolicitud={idSolicitud}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          onDeleteSuccess={onDeleteSuccess}
        />
      </Modal>
      
      {requisito?.generado && requisito.generado === true ? (
        <></>
      ) : (<button 
        type='button'
        disabled={!activo}
        className={styles.buttonPdf}
        onClick={openModal}
      >
        <FontAwesomeIcon
          icon={faCircleXmark}
          cursor={!activo ? 'not-allowed' : 'pointer'}
          color={!activo ? 'gray' : 'red'}
          size='3x'
          title={!activo ? 'No hay documento a eliminar' : 'Eliminar documento'}
        />
      </button>)}
      
    </>
  );
};

export default EliminarEvidencia;

