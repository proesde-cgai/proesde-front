import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFolder } from '@fortawesome/free-regular-svg-icons';
import styles from './styles/RowTableExpedienteRequisitos.module.css';
import VisualizarRequisitos from './VisualizarRequisitos';

const RowTableExpedienteRequisitos = ({
    requisito, existeDocumento, openModal, setUrlPDF, idSolicitud, handleUploadSuccess, handleDeleteSuccess
}) => {

    const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
    const [infoModal, setInfoModal] = useState({});

    const openAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);
    const closeAddFileModal = () => setIsAddFileModalOpen(!isAddFileModalOpen);

    return (
        <>
            <VisualizarRequisitos
                isOpen={isAddFileModalOpen}
                onClose={() => setIsAddFileModalOpen(false)}
                existeDocumento={existeDocumento}
                openModal={openModal}
               // requestStatus={requestStatus}
               // SOLICITUD_ENVIADA={SOLICITUD_ENVIADA}
                idSolicitud={idSolicitud}
                handleDeleteSuccess={handleDeleteSuccess}
                handleUploadSuccess={handleUploadSuccess}
                archivos={requisito?.archivos}
                nombre={requisito?.nombre}
                setUrlPdf={setUrlPDF}
                idExpediente={requisito.id}
            />

            <tr key={requisito.id} >
                {console.log("requisito ", requisito)}
                <td>{requisito.id}</td>
                <td>{requisito.nombre}</td>
                <td className={styles.tdTablaExpedienteRequisitos}>
                    {requisito.validado ? (
                        <div className={styles.containerBtnPDF}>
                            <input
                                type="checkbox"
                                className={`checkbox_green`}
                                id={requisito.id}
                                checked={true}
                            />
                        </div>) : requisito?.archivos?.length === 1 ? (
                            <div className={styles.containerBtnPDF}>
                                <button
                                    type="button"
                                    className={styles.buttonPdf}
                                    title="Ver PDF"
                                    onClick={() => {
                                        openModal();
                                        setUrlPDF(requisito?.archivos[0].nodo || '');
                                    }}
                                >
                                    <FontAwesomeIcon icon={faFilePdf} color="green" />
                                </button>
                            </div>
                        ) : requisito?.archivos?.length > 1 ? (
                            <div className={styles.containerBtnPDF}>
                                <button
                                    type="button"
                                    className={styles.buttonPdf}
                                    tile="folder de archivos"
                                    onClick={() => {
                                        openAddFileModal()
                                        setInfoModal({ ...infoModal })
                                    }}
                                >
                                    <FontAwesomeIcon icon={faFolder} color="green" />
                                </button>
                            </div>
                        ) : (<></>)}
                </td>
            </tr >

        </>


    );
};

export default RowTableExpedienteRequisitos;