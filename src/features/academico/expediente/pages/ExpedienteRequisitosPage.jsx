import React, { useState, useEffect } from "react";
import Alert from "../../../../reutilizable/Alert";
import Modal from "../../../../reutilizable/Modal";
import Table from "../../../../reutilizable/Table";
import Loading from "../../../../reutilizable/Loading";
import ViewerPDF from "../../../../reutilizable/ViewerPDF";
import { ERROR_MESSAGES_GENERICS_API } from "../../../../utils/messagesFromAPI";
import { useDatosAcademico } from "../../store/useDatosAcademico";
import RowTableExpedienteRequisitos from "../components/RowTableExpedienteRequisitos";
import { obtenerRequisitosExpediente } from "../services/requisitosExpedienteService";
import styles from "./styles/ExpedienteRequisitosPage.module.css";
import useStatusStore from "../../../../store/useStatusStore";

const ExpedienteRequisitosPage = () => {
  const SOLICITUD_ENVIADA = 3
  const { requestStatus } = useStatusStore();
  const { setDataAcademico, datosAcademico } = useDatosAcademico();

  const [uploadedDocs, setUploadedDocs] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idSolicitud, setIdSolicitud] = useState(null);
  const [urlPDF, setUrlPDF] = useState(null);
  const [requisitos, setRequisitos] = useState([]);
  // Permite cargar/eliminar si requestStatus < 3 o requestStatus === 7
  const puedeCargarEliminar = requestStatus < SOLICITUD_ENVIADA || requestStatus === 7;
  let caberasTable = [
    { id: 1, labelCabecera: "Id", center: false },
    { id: 2, labelCabecera: "Requisito", center: false },
    { id: 3, labelCabecera: "Cargar/Ver Evidencia", center: true },
  ];
  console.log("resquest status ", requestStatus)
  console.log("SOLCITUD ENVIADA ", SOLICITUD_ENVIADA)
  if (puedeCargarEliminar) caberasTable = [...caberasTable, { id: 4, labelCabecera: "Eliminar" }];

  const [errorMessage, setErrorMessage] = useState({
    type: null,
    mensaje: null,
  });

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("auth-storage"));
    const noAcademico = authData?.state?.userInfo?.username;
    setDataAcademico(noAcademico);
  }, [setDataAcademico]);

  useEffect(() => {
    setErrorMessage(null);
    if (!datosAcademico) return;

    if (datosAcademico) {
      setIdSolicitud(datosAcademico.idSolicitud);
    }
  }, [datosAcademico]);

  useEffect(() => {
    setErrorMessage(null);
    //if (!datosAcademico) return;

    if (idSolicitud) {
      obtenerRequisitosExpediente(idSolicitud)
        .then((response) => {
          setRequisitos(response);
        })
        .catch((error) => {
          if (error.response) {
            const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
            setErrorMessage({
              type: "error",
              mensaje: message,
            });
          }
        });
    }
  }, [datosAcademico, idSolicitud, uploadedDocs]);

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
  const closeModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className={styles.containerExpedienteRequisitos}>
      <div className={styles.containerTablaRequisitos}>
        <Modal isOpen={isModalOpen} onClose={closeModal} width="750px">
          <ViewerPDF urlPdf={urlPDF} />
        </Modal>
        <Table cabecerasTable={caberasTable}>
          {requisitos?.length ? (
            requisitos?.map((requisito) => {
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
                  puedeCargarEliminar={puedeCargarEliminar}
                />
              );
            })
          ) : (
            <Loading />
          )}
        </Table>

        <div className={styles.supportNotes}>
          <p className={styles.supportNotesTitle}>NOTAS DE APOYO PARA EL LLENADO:</p>
          <ul className={styles.supportNotesList}>
            <li className={styles.annotation}>
              <span className={styles.bold}>Validación Automática:</span> Los campos marcados con el ícono de <b className={styles.bold}>verificación (✓)</b>
              corresponden a requisitos validados automáticamente por la CGRH. <b>No es necesario
              adjuntar documentos probatorios.</b>
            </li>
            <li className={styles.annotation}>
              <span className={styles.bold}>Carga Obligatoria (Campos 4 y 5):</span> Es obligatorio cargar los documentos
              probatorios solicitados; específicamente, las cartas de desempeño académico de cada
              ciclo escolar mencionado.
            </li>
            <li className={styles.annotation}>
              <span className={styles.bold}>Documentos del Sistema (Campos 7 y 8):</span> Los comprobantes de estos campos serán
              generados directamente en la plataforma por el Jefe de Departamento o Director de
              Escuela correspondiente. <b>No es necesario adjuntar documentos adicionales.</b>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExpedienteRequisitosPage;
