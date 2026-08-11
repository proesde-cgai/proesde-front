import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/RowTablaItemCriterio.module.css";
import { replaceBrWithNewline } from "../../../utils";
import Modal from "../../../reutilizable/Modal";
import Table from "../../../reutilizable/Table";


const VisualizarCriterios = ({
    isOpen,
    onClose,
    nombre,
    documentos,
    puntaje,
    sinNombreDocumento,
    sinPuntaje,
    existeDocumento,
    openModal,
    setUrlPdf,
    nodo,
    //requestStatus,
    //SOLICITUD_ENVIADA,
    idExpediente,
    idSolicitud,
    handleDeleteSuccess,
    handleUploadSuccess,
    archivos
}) => {


    const cabecerasTable = [
        { id: 2, labelCabecera: "Descripcion Actividad" },
        { id: 3, labelCabecera: "Documento Probatorio (evidencia)" },
        { id: 4, labelCabecera: "Puntaje que puede obtener" },
    ];

    let cabecerasTableFiles = [{ id: 5, labelCabecera: "Ver Evidencia" }];



    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Table cabecerasTable={cabecerasTable}>
                <tr>
                    <td>{replaceBrWithNewline(nombre)}</td>
                    <td>{sinNombreDocumento ? <p>Sin registro de documento probatorio</p> : replaceBrWithNewline(documentos)}</td>
                    <td>{sinPuntaje ? <p>Sin puntaje registrado para este ítem</p> : <p>{puntaje}</p>}</td>
                </tr>
            </Table>
            {console.log("nodo ", nodo)}
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
                                                setUrlPdf(archivo?.nodo);
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

export default VisualizarCriterios;
