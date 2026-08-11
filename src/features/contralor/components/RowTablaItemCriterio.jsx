import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf,faFolder } from '@fortawesome/free-regular-svg-icons';
import styles from './styles/RowTablaItemCriterio.module.css';
import { replaceBrWithNewline } from '../../../utils';
import VisualizarCriterios from './VisualizarCriterios';

const RowTablaItemCriterio = ({
  item,
  openModal,
  uploadedDocs,
  setUrlPdf,
  idSolicitud,
  handleUploadSuccess,
  handleDeleteSuccess
}) => {

  const { criterio, nodo, subCriterios } = item;
  const { id: idExpediente, nombre, documentos, valorFijo } = criterio;

  const existeDocumento = nodo !== null || uploadedDocs.has(idExpediente);
  const sinNombreDocumento = !documentos || documentos === '';
  const sinPuntaje = valorFijo === null;

   const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
    const [infoModal, setInfoModal] = useState({});
  
    const openAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
    const closeAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);

  return (
    <>
    <VisualizarCriterios
        isOpen={isAddFileModalOpen}
        onClose={() => setIsAddFileModalOpen(false)}
        nombre={nombre}
        documentos={documentos}
        puntaje={valorFijo}
        sinNombreDocumento={sinNombreDocumento}
        sinPuntaje={sinPuntaje}
        existeDocumento={existeDocumento}
        openModal={openModal}
        setUrlPdf={setUrlPdf}
        nodo={nodo}
        //requestStatus={requestStatus}
        //SOLICITUD_ENVIADA={SOLICITUD_ENVIADA}
        idExpediente={idExpediente}
        idSolicitud={idSolicitud}
        handleDeleteSuccess={handleDeleteSuccess}
        handleUploadSuccess={handleUploadSuccess}
        archivos={item?.archivos}
      />

      <tr>
        {/* <td>{idExpediente}</td> */}
        <td>{replaceBrWithNewline(nombre)}</td>
        <td>
          {sinNombreDocumento ? (
            <p>Sin registro de documento probatorio</p>
          ) : (
            replaceBrWithNewline(documentos)
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
          {item.archivos?.length === 1 ? (
            <div className={styles.containerBtnPDF}>
              <button
                type='button'
                className={styles.buttonPdf}
                title='Ver PDF'
                onClick={() => {
                  openModal();
                  setUrlPdf(item.archivos[0]?.nodo);
                }}
              >
                <FontAwesomeIcon icon={faFilePdf} color='green' />
              </button>
            </div>
          ) : item.archivos?.length > 1 ? (
            <div className={styles.containerBtnPDF}>
              <button
                type="button"
                className={styles.buttonPdf}
                tile="folder de archivos"
                onClick={() => {
                  openAddFileModal();
                  setInfoModal({ ...infoModal, descripcionActividad: replaceBrWithNewline(nombre), nombreDocumento: sinNombreDocumento, sinPuntaje: sinPuntaje, puntaje: valorFijo });
                }}
              >
                <FontAwesomeIcon icon={faFolder} color="green" />
              </button>
            </div>
          )
            : (
              <p>N/A</p>
            )}
        </td>
      </tr>
    </>
  );
};

export default RowTablaItemCriterio;