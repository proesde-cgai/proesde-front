import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faFilePdf, faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../../reutilizable/Modal";
import Table from "../../../reutilizable/Table";
import { replaceBrWithNewline } from "../../../utils";
import styles from "./styles/VisualizarArchivosCriterios.module.css";
import ActualizarEvidencia from "./ActualizarEvidencia";


const VisualizarArchivosCriterios = ({
    isOpen,
    onClose,
    nombre,
    documentos,
    puntaje,
    sinNombreDocumento,
    sinPuntaje,
    //existeDocumento,
    openModal,
    setUrlPdf,
    nodo,
    //requestStatus,
    //SOLICITUD_ENVIADA,
    idExpediente,
    idSolicitud,
    handleDeleteSuccess,
    handleUploadSuccess,
    archivos,
    idCriterio,
    esCotejadoRubros
}) => {


    let cabecerasTable = [
        { id: 2, labelCabecera: "Descripcion Actividad" },
        { id: 3, labelCabecera: "Documento Probatorio (evidencia)" },
        { id: 4, labelCabecera: "Puntaje que puede obtener" },
    ];

    let cabecerasTableFiles = [{ id: 5, labelCabecera: "Ver Evidencia" },{ id: 1, labelCabecera: "Generado por sistema" }, { id: 6, labelCabecera: "Reemplazar Evidencia" }];
    

    if (!esCotejadoRubros) cabecerasTable = cabecerasTable.filter((cabecera) => cabecera.id !== 6);
    if (!esCotejadoRubros) cabecerasTableFiles = cabecerasTableFiles.filter((cabecera) => cabecera.id !== 6);

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
                            </td>

                            <td>
                                {archivo.generado && (<FontAwesomeIcon icon={faCheckCircle} color="green" title="Generado por sistema" size="lg" />)}
                            </td>

                            {esCotejadoRubros ? (<td>
                                <ActualizarEvidencia
                                    idExpediente={idExpediente}
                                    idSolicitud={idSolicitud}
                                    tipoUpload="criterio"
                                    onUploadSuccess={() => handleUploadSuccess(idCriterio)}
                                    onDeleteSuccess={() => handleDeleteSuccess(archivo?.id)}
                                    archivoId={archivo?.id}
                                />
                            </td>) : (<></>)
                            }
                        </tr>
                    )
                })}

            </Table>

        </Modal>
    );
};

export default VisualizarArchivosCriterios;
