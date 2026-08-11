import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { eliminarArchivoRequisitoExpediente, eliminarArchivoRequisitoExpedienteAcademico, eliminarDocRequisitosExpediente } from '../services/requisitosExpedienteService';
import { eliminarArchivoCriterioExpediente, eliminarDocCriterioExpediente } from '../services/criteriosExpedienteService';
import styles from './styles/ContentModalEliminarEvidencia.module.css';

const ContentModalEliminarEvidencia = ({ 
  tipoDelete, idExpediente, idSolicitud, closeModal, onDeleteSuccess
}) => {
  
  const handleEliminarDocumento = async (evt) => {
    evt.preventDefault();

    const body = {
      idSolicitud,
      idExpediente
    };

    try {
      if (tipoDelete === 'requisito') {
        await eliminarArchivoRequisitoExpedienteAcademico(body)
          .then(response => {
            if (response?.status === 200) {
              console.log('Documento eliminado exitosamente:', response);
              onDeleteSuccess();
              closeModal();
            }
            console.log(response);
          })
          .catch(error => {
            console.error('Error al eliminar el requisito del expediente: ', error);
          });
      }

      if (tipoDelete === 'criterio') {
        await eliminarArchivoCriterioExpediente(body)
        .then(response => {
          if (response?.status === 200) {
            console.log('Documento eliminado exitosamente:', response);
            onDeleteSuccess();
            closeModal();
          }
          console.log(response);
        })
        .catch(error => {
          console.error('Error al eliminar el criterio del expediente: ', error);
        });
      }

    } catch (error) {
      console.error('Error')
    }
  };

  return (
    <div className={styles.containerModalEliminarEvidencia}>
      <FontAwesomeIcon icon={faWarning} color='red' size='7x' />

      <p className={styles.textoAdvertencia}>
        ¿Esta seguro que desea eliminar este archivo? <br /><br />

        <span>
          NOTA: Una vez eliminado el archivo <br />
          ya no será posible recuperarlo.
        </span>
      </p>

      <form
        className={styles.formEliminarEvidencia}
        onClick={handleEliminarDocumento}
      >
        <button
          type='submit'
          className={styles.btnEliminarEvidencia}
          onClick={closeModal}
        >
          Eliminar
        </button>
      </form>
    </div>
  );
};

export default ContentModalEliminarEvidencia;
