// Internal components.
import Modal from "../../../reutilizable/Modal";
import Table from "../../../reutilizable/Table";

// Styles.
import styles from "./styles/VisualizarArchivosRequisitos.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

const OnlyViewFilesRequisitos = ({ isOpen, onClose, openModal, archivos, nombre, setUrlPdf }) => {
  const cabecerasTable = [{ id: 2, labelCabecera: "Requisito" }];
  const cabecerasTableFiles = [{ id: 4, labelCabecera: "Ver Evidencia" }];

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
            </tr>
          );
        })}
      </Table>
    </Modal>
  );
};

export default OnlyViewFilesRequisitos;
