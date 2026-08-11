import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPlus } from "@fortawesome/free-solid-svg-icons";
import EliminarEvidencia from "./EliminarEvidencia";
import Table from "../../../../reutilizable/Table";
import Modal from "../../../../reutilizable/Modal";
import styles from "./styles/RowTablaItemCriterio.module.css";
import { replaceBrWithNewline } from "../../../../utils";
import AgregaEvidencia from "./AgregarEvidencia";
import { obtenerItemsDeCriteriosExpediente } from "../services/criteriosExpedienteService";

const AgregarArchivo = ({
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
    requestStatus,
    SOLICITUD_ENVIADA,
    idExpediente,
    idSolicitud,
    handleDeleteSuccess,
    handleUploadSuccess,
    archivos
}) => {
    // Permite cargar/eliminar si requestStatus < 3 o requestStatus === 7
    const puedeCargarEliminar = requestStatus < SOLICITUD_ENVIADA || requestStatus === 7;

    const cabecerasTable = [
        { id: 2, labelCabecera: "Descripcion Actividad" },
        { id: 3, labelCabecera: "Documento Probatorio (evidencia)" },
        { id: 4, labelCabecera: "Puntaje que puede obtener" },
    ];

    let cabecerasTableFiles = [{ id: 5, labelCabecera: "Ver Evidencia" }];
    if (puedeCargarEliminar) {
        cabecerasTableFiles.push({ id: 6, labelCabecera: "Eliminar" });
    }


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
                            {puedeCargarEliminar && (
                                <td className={styles.tdEliminarEvidencia}>
                                    <EliminarEvidencia
                                        tipoDelete="criterio"
                                        idExpediente={archivo?.id}
                                        idSolicitud={idSolicitud}
                                        activo={existeDocumento}
                                        onDeleteSuccess={() => handleDeleteSuccess(idExpediente)}
                                    />
                                </td>
                            )}
                        </tr>
                    )
                })}

            </Table>


            {puedeCargarEliminar ? (
                <div className={styles.container}>
                    <label className={styles.label}>Agregar otro archivo</label>
                    <AgregaEvidencia
                        tipoUpload="criterio"
                        idExpediente={Number(idExpediente)}
                        idSolicitud={idSolicitud}
                        onUploadSuccess={() => handleUploadSuccess(idExpediente)}
                        setUpdate
                    />
                </div>
            ) : (<></>)}




        </Modal>
    );
};

export default AgregarArchivo;
