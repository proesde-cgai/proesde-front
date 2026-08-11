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
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

const AgregarArchivoRequisito = ({
    isOpen,
    onClose,
    existeDocumento,
    openModal,
    requestStatus,
    SOLICITUD_ENVIADA,
    puedeCargarEliminar,
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
    if (puedeCargarEliminar) {
        cabecerasTableFiles.push({ id: 4, labelCabecera: "Eliminar" });
    }


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
                            {console.log("archivo id agregar ", archivo?.id)}
                            {puedeCargarEliminar && !archivo.generado ?(
                                <td className={styles.tdEliminarEvidencia}>
                                    <EliminarEvidencia
                                        tipoDelete="requisito"
                                        idExpediente={archivo?.id}
                                        idSolicitud={idSolicitud}
                                        activo={existeDocumento}
                                        onDeleteSuccess={() => handleDeleteSuccess(archivo?.id)}
                                    />
                                </td>
                            ): (
                                <td className={styles.tdEliminarEvidencia}>
                                    <button
                                    type='button'
                                    disabled={true}
                                    className={styles.buttonPdf}
                                    onClick={openModal}
                                    >
                                    <FontAwesomeIcon
                                        icon={faCircleXmark}
                                        cursor={true ? 'not-allowed' : 'pointer'}
                                        color={true ? 'gray' : 'red'}
                                        size='3x'
                                        title={true ? 'No hay documento a eliminar' : 'Eliminar documento'}
                                    />
                                    </button>
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
                        tipoUpload="requisito"
                        idExpediente={Number(idExpediente)}
                        idSolicitud={idSolicitud}
                        onUploadSuccess={() => handleUploadSuccess(idExpediente)}
                        setUpdate
                    />
                </div>) : (<></>)}


        </Modal>
    );
};

export default AgregarArchivoRequisito;
