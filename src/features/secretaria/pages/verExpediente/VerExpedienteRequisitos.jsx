import React, { useEffect, useState } from 'react'
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Table from '../../../../reutilizable/Table';
import Modal from '../../../../reutilizable/Modal';
import ViewerPDF from '../../../../reutilizable/ViewerPDF';
import Alert from '../../../../reutilizable/Alert';
import Loading from '../../../../reutilizable/Loading';
import { useEvaluationStore } from '../../../../store/useEvaluationStore';
import { obtenerRequisitosExpediente } from '../../../academico/expediente/services/requisitosExpedienteService';
import { ERROR_MESSAGES_GENERICS_API } from '../../../../utils/messagesFromAPI';
import styles from '../styles/VerExpedienteRequisitos.module.css';

const VerExpedienteRequisitos = () => {
  const { idSolicitud, selectedDataAcademico } = useEvaluationStore();

  const [urlPDF, setUrlPDF] = useState(null);
  const [requisitos, setRequisitos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mensaje, setMensaje] = useState({
    type: null,
    mensaje: null
  });
  const [cabecerasTable, _set] = useState([
    {
      id: 1,
      labelCabecera: 'Id'
    },
    {
      id: 2,
      labelCabecera: 'Requisito'
    },
    {
      id: 3,
      labelCabecera: 'Ver Evidencia'
    },
  ]);

  useEffect(() => {
    setMensaje(null);
    if (!idSolicitud) return;

    obtenerRequisitosExpediente(idSolicitud)
      .then(response => {
        console.log(response)
        setRequisitos(response);
      })
      .catch(error => {
        console.error('Error al obtener requisitos', error);
        if (error.response) {
          const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
          setMensaje({
            mensaje: message,
            type: 'error'
          });
        }
      })
  }, [idSolicitud, selectedDataAcademico]);

  useEffect(() => {
    const sinDocumentosCargados = requisitos?.some((item) => item.nodo === null);
    if (sinDocumentosCargados) {
      setMensaje({
        type: 'warning',
        mensaje: 'El académico no ha cargado documentos para todos los requisitos'
      })
    }
  }, [requisitos])

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);

  if (mensaje) {
    return (
      <Alert typeAlert={mensaje.type}>
        <p>{mensaje.mensaje}</p>
      </Alert>
    );
  }

  return (
    <div className={styles.containerCotejoRequisitos}>
      <div className={styles.containerTablaRequisitos}>
        <Modal isOpen={isModalOpen} onClose={closeModal} width='750px'>
          <ViewerPDF urlPdf={urlPDF} />
        </Modal>

        <Table cabecerasTable={cabecerasTable}>
            {requisitos?.length
              ? (
                requisitos?.map(requisito => {
                  const withoutNode = requisito.nodo === null;
                  return (
                    <tr key={requisito.id}>
                      <td>{requisito.romano}</td>
                      <td>{requisito.nombre}</td>
                      <td className={styles.tdTablaCotejoRequisitos}>
                        <div className={styles.containerBtnPDF}>
                          <button
                            type='button'
                            className={styles.buttonPdf}
                            title='Ver PDF'
                            disabled={withoutNode}
                            onClick={() => {
                              openModal();
                              setUrlPDF(requisito.nodo || '');
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faFilePdf}
                              color={withoutNode ? 'gray' : 'green'}
                              title={withoutNode ? 'Sin documento' : 'Ver documento'}
                              cursor={withoutNode ? 'not-allowed' : 'pointer'}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <Loading />
              )}
          </Table>
      </div>
    </div>
  );
}

export default VerExpedienteRequisitos