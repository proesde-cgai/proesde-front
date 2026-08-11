import React, { useState, useEffect } from 'react';
import styles from './styles/ExpedienteRequisitosPage.module.css';
import { obtenerRequisitosExpediente } from '../../academico/expediente/services/requisitosExpedienteService';
import { useDatosAcademico } from '../../academico/store/useDatosAcademico';
import { ERROR_MESSAGES_GENERICS_API } from '../../../utils/messagesFromAPI';
import ViewerPDF from '../../../reutilizable/ViewerPDF';
import Loading from '../../../reutilizable/Loading';
import Alert from '../../../reutilizable/Alert';
import Modal from '../../../reutilizable/Modal';
import Table from '../../../reutilizable/Table';
import { useEvaluationStore } from '../../../store/useEvaluationStore';
import RowTableExpedienteRequisitos from '../components/RowTableExpedienteRequisitos';

const ExpedienteRequisitosPage = () => {
    const { selectedDataAcademico } = useEvaluationStore();


    const [uploadedDocs, setUploadedDocs] = useState(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idSolicitud, setIdSolicitud] = useState(null);
    const [urlPDF, setUrlPDF] = useState(null);
    const [requisitos, setRequisitos] = useState([]);
    const [caberasTable, _] = useState([
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
        }
    ]);
    const [errorMessage, setErrorMessage] = useState({
        type: null,
        mensaje: null
    });

    useEffect(() => {
        console.log("entro en esta parte")
        setErrorMessage(null);
        if (!selectedDataAcademico) return;

        if (selectedDataAcademico) {
            setIdSolicitud(selectedDataAcademico.id);
        }
    }, [selectedDataAcademico]);

    useEffect(() => {
        setErrorMessage(null);
        //if (!datosAcademico) return;

        if (idSolicitud) {
            console.log("entro en el use effect")
            obtenerRequisitosExpediente(idSolicitud)
                .then(response => {
                    setRequisitos(response)
                })
                .catch(error => {
                    if (error.response) {
                        const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
                        setErrorMessage({
                            type: 'error',
                            mensaje: message
                        });
                    }
                })
        }

    }, [idSolicitud]);

    const handleUploadSuccess = (idExpediente) => {
        setUploadedDocs((prev) => {
            const newSet = new Set(prev);
            newSet.add(idExpediente);
            return newSet;
        });
    };

    const handleDeleteSuccess = (idExpediente) => {
        setUploadedDocs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(idExpediente);
            console.log("Documento eliminado para id:", idExpediente);
            console.log("Nuevo estado de uploadedDocs:", newSet);
            return newSet;
        });
    };

    if (errorMessage) {
        return (
            <Alert typeAlert={errorMessage.type}>
                <p>{errorMessage.mensaje}</p>
            </Alert>
        );
    }

    const openModal = () => setIsModalOpen(!isModalOpen);
    const closeModal = () => setIsModalOpen(!isModalOpen)

    return (
        <div className={styles.containerExpedienteRequisitos}>
            <div className={styles.containerTablaRequisitos}>
                <Modal isOpen={isModalOpen} onClose={closeModal} width='750px'>
                    <ViewerPDF urlPdf={urlPDF} />
                </Modal>

                <Table cabecerasTable={caberasTable}>
                    {requisitos?.length
                        ? (
                            requisitos?.map(requisito => {
                                const existeDocumento = requisito.nodo !== null || uploadedDocs.has(requisito.id);
                                return (
                                    <RowTableExpedienteRequisitos
                                        key={requisito.id}
                                        requisito={requisito}
                                        idSolicitud={idSolicitud}
                                        setUrlPDF={setUrlPDF}
                                        handleUploadSuccess={handleUploadSuccess}
                                        handleDeleteSuccess={handleDeleteSuccess}
                                        existeDocumento={existeDocumento}
                                        openModal={openModal}
                                    />
                                )
                            })
                        ) : (
                            <Loading />
                        )}
                </Table>
            </div>
        </div>
    );
};

export default ExpedienteRequisitosPage;
