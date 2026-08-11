import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../../reutilizable/Modal";
import Table from "../../../reutilizable/Table";
import { replaceBrWithNewline } from "../../../utils";
import styles from "./styles/VisualizarArchivosCriterios.module.css";

const OnlyViewFilesCriterios = ({
  isOpen,
  onClose,
  nombre,
  documentos,
  puntaje,
  sinNombreDocumento,
  sinPuntaje,
  openModal,
  setUrlPdf,
  archivos,
}) => {
  const cabecerasTable = [
    { id: 2, labelCabecera: "Descripcion Actividad" },
    { id: 3, labelCabecera: "Documento Probatorio (evidencia)" },
    { id: 4, labelCabecera: "Puntaje que puede obtener" },
  ];

  const cabecerasTableFiles = [{ id: 5, labelCabecera: "Evidencia" }];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Table cabecerasTable={cabecerasTable}>
        <tr>
          <td>{replaceBrWithNewline(nombre)}</td>
          <td>
            {sinNombreDocumento ? (
              <p>Sin registro de documento probatorio</p>
            ) : (
              replaceBrWithNewline(documentos)
            )}
          </td>
          <td>{sinPuntaje ? <p>Sin puntaje registrado para este ítem</p> : <p>{puntaje}</p>}</td>
        </tr>
      </Table>
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
            </tr>
          );
        })}
      </Table>
    </Modal>
  );
};

export default OnlyViewFilesCriterios;
