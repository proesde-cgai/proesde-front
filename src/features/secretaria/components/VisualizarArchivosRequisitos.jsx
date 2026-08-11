import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faFilePdf, faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/VisualizarArchivosRequisitos.module.css";
import Modal from "../../../reutilizable/Modal";
import Table from "../../../reutilizable/Table";
import CargarEvidencia from "../../academico/expediente/components/CargarEvidencia";
import ActualizarEvidencia from "./ActualizarEvidencia";

const VisualizarArchivosRequisitos = ({
    isOpen,
    onClose,
    //existeDocumento,
    openModal,
    //requestStatus,
    //SOLICITUD_ENVIADA,
    idSolicitud,
    handleDeleteSuccess,
    handleUploadSuccess,
    archivos,
    nombre,
    setUrlPdf,
    idExpediente,
    esCotejadoRequisitos
}) => {


    let cabecerasTable = [
        { id: 2, labelCabecera: "Requisito" },

    ];

    let cabecerasTableFiles = [{ id: 4, labelCabecera: "Ver Evidencia" }, { id: 1, labelCabecera: "Generado por sistema" }, { id: 3, labelCabecera: "Reemplazar Evidencia" },];
    
    if (!esCotejadoRequisitos) cabecerasTableFiles = cabecerasTableFiles.filter((cabecera) => cabecera.id !== 3);


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Table cabecerasTable={cabecerasTable}>
                <tr>
                    <td>{nombre}</td>
                </tr>
            </Table>

            <Table cabecerasTable={cabecerasTableFiles}>
                {archivos?.map((archivo, index) => {
                    return (
                        <tr key={index}>
                            <td className={styles.tdEvidencia}>
                                <div className={styles.containerBtnPDF}>
                                    <button
                                        type="button"
                                        className={styles.buttonPdf}
                                        title="Ver PDF"
                                        onClick={() => {
                                            openModal();
                                            setUrlPdf(archivo.nodo);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faFilePdf} color="green" />
                                    </button>
                                </div>
                            </td>
                            
                            <td>
                            {archivo.generado && ( <FontAwesomeIcon icon={faCheckCircle} color="green" title="Generado por sistema" size="lg" /> )}
                            </td>

                            { esCotejadoRequisitos ? (
                                    <td className={styles.tdEvidencia}>
                                        <ActualizarEvidencia
                                            idExpediente={idExpediente}
                                            idSolicitud={idSolicitud}
                                            tipoUpload="requisito"
                                            onUploadSuccess={() => handleUploadSuccess(idExpediente)}
                                            onDeleteSuccess={() => handleDeleteSuccess(archivo?.id)}
                                            archivoId={archivo.id}
                                        />
                                    </td>
                            ) : (<></>)}


                        </tr>
                    )
                })}

            </Table>

        </Modal>
    );
};

export default VisualizarArchivosRequisitos;
