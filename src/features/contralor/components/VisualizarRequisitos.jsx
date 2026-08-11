import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPlus } from "@fortawesome/free-solid-svg-icons";

import styles from "./styles/RowTablaItemCriterio.module.css";
import Modal from "../../../reutilizable/Modal";
import Table from "../../../reutilizable/Table";


const VisualizarRequisitos = ({
    isOpen,
    onClose,
    existeDocumento,
    openModal,
    //requestStatus,
    //SOLICITUD_ENVIADA,
    idSolicitud,
    handleDeleteSuccess,
    handleUploadSuccess,
    archivos,
    nombre,
    setUrlPdf,
    idExpediente
}) => {


    const cabecerasTable = [
        { id: 2, labelCabecera: "Requisito" },
    ];

    let cabecerasTableFiles = [{ id: 3, labelCabecera: "Ver Evidencia" }];
    


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Table cabecerasTable={cabecerasTable}>
                <tr>
                    <td>{nombre}</td>
                </tr>
            </Table>

            <Table cabecerasTable={cabecerasTableFiles}>
                {archivos?.map((archivo) => {
                    return (
                        <tr>
                            <td className={styles.tdEvidencia}>
                                {existeDocumento && (
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
                                )}
                            </td>
                            
                        </tr>
                    )
                })}

            </Table>


        </Modal>
    );
};

export default VisualizarRequisitos;
