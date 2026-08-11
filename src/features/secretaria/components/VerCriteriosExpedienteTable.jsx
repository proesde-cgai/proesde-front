import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import Alert from '../../../reutilizable/Alert';
import Modal from '../../../reutilizable/Modal';
import ViewerPDF from '../../../reutilizable/ViewerPDF';
import Table from '../../../reutilizable/Table';
import { replaceBrWithNewline } from '../../../utils';
import { obtenerItemsDeCriteriosExpediente } from '../../academico/expediente/services/criteriosExpedienteService';
import { ERROR_MESSAGES_GENERICS_API } from '../../../utils/messagesFromAPI';
import styles from './styles/VerCriteriosExpedienteTable.module.css';

const VerCriteriosExpedienteTable = ({ params }) => {

  const [itemsEvaluacion, setItemsEvaluacion] = useState([]);
  const [itemsCriterios, setItemsCriterios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlPdf, setUrlPdf] = useState(null);
  const [mensaje, setMensaje] = useState({
    type: null,
    mensaje: null
  });
  const [cabecerasTable, _] = useState([
    {
      id: 1,
      labelCabecera: 'Item'
    },
    {
      id: 2,
      labelCabecera: 'Descripcion Actividad'
    },
    {
      id: 3,
      labelCabecera: 'Documento Probatorio (evidencia)'
    },
    {
      id: 4,
      labelCabecera: 'Puntos'
    },
    {
      id: 5,
      labelCabecera: 'Ver Evidencia'
    }
  ]);

  useEffect(() => {
    setMensaje(null);
    if (!params) return;

    setItemsCriterios([]);
    obtenerItemsDeCriteriosExpediente(params)
      .then(response => { setItemsCriterios(response?.data) })
      .catch(error => {
        console.error('Error al obtener los items del criterio ', error);
        if (error.response) {
          const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
          setMensaje({
            mensaje: message,
            type: 'error'
          });
        }
      })
  }, [params])

  useEffect(() => {
    if (!itemsCriterios || !itemsCriterios.arbol) return;
    setItemsEvaluacion(itemsCriterios?.arbol);
  }, [itemsCriterios]);

  useEffect(() => {
    const arbolCriterios = itemsCriterios?.arbol;
    const sinDocumentoCargado = arbolCriterios?.some((item) => item.nodo === null);

    if (sinDocumentoCargado) {
      setMensaje({
        type: 'warning',
        mensaje: 'El académico no ha terminado de subir sus documentos'
      });
    }
  }, [itemsCriterios]);

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
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ViewerPDF urlPdf={urlPdf} />
      </Modal>

      <Table cabecerasTable={cabecerasTable}>
        {itemsEvaluacion?.map(itemEvaluacion => {
          const { nodo, criterio } = itemEvaluacion;
          const { id, nombre, documentos, valorFijo } = criterio;
          const sinNombreDocumento = documentos === "";
          const sinPuntaje = valorFijo === null;

          return (
            <tr key={id}>
              <td>{id}</td>
              <td>{replaceBrWithNewline(nombre)}</td>
              <td>
                {sinNombreDocumento ? (
                  <p>Sin registro de documento probatorio</p>
                ) : (
                  <label htmlFor={id} className={styles.label}>{replaceBrWithNewline(documentos)}</label>
                )}
              </td>
              <td>
                {sinPuntaje ? (
                  <p>Sin puntaje registrado para este ítem</p>
                ) : (
                  <p>{valorFijo}</p>
                )}
              </td>
              <td className={styles.tdEvidencia}>
                <div className={styles.containerBtnPDF}>
                  <button
                    type='button'
                    className={styles.buttonPdf}
                    title='Ver PDF'
                    onClick={() => {
                      openModal();
                      setUrlPdf(nodo);
                    }}
                  >
                    <FontAwesomeIcon icon={faFilePdf} color='green' />
                  </button>
                </div>
              </td>
            </tr>
          )
        })}
      </Table>
    </>
  );
};

export default VerCriteriosExpedienteTable;