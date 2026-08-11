import React, { useEffect, useState } from "react";
import Loading from "../../../reutilizable/Loading";
import AlertaDescargandoDoc from "./AlertaDescargandoDoc";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { generarDocumentoSolicitud, cargarDocumento } from "../services/generarDocumentoSolicitudService";
import styles from "./styles/DescargarDocumentoSolicitud.module.css";
import Modal from "../../../reutilizable/Modal";
import { obtenerStatusCotejo } from "../services/comentariosCotejo";
import ViewerPDF from "../../../reutilizable/ViewerPDF";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { message } from 'antd';
import Alert from '../../../reutilizable/Alert';
import { useDocSolicitud } from "../services/useConsultaPDF";
import { useFileStore } from "../../../store/useFileStore";
import { useSearchStore } from "../../../store/useSearchStore";

const DescargarDocumentoSolicitud = () => {
  const { selectedDataAcademico, idSolicitud, status } = useEvaluationStore();
  const {
    docNodoId,
    isSolicitudDocUploaded,
    getNodoSolicitud,
  } = useDocSolicitud();

  const [mensajeDescarga, setMensajeDescarga] = useState(null);
  const [cargaHabilitada, setCargaHabilitada] = useState(true);
  const [statusCotejo, setStatusCotejo] = useState();
  const [mensajeCarga, setMensajeCarga] = useState(null);
  const [loading, setLoading] = useState(false);
  const [habilitarDescarga, setHabilitarDescarga] = useState(false);
  const [dictamenFile, setDictamenFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //console.log(selectedDataAcademico)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenView, setIsModalOpenView] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);

  const [urlPdf, setUrlPdf] = useState(null);
  const [solicitudNodoId, setSolicitudNodoId] = useState(null);
  const [isSolicitudUploaded, setIsSolicitudUploaded] = useState(false);
  const [upploadSuccess, setUpploadSuccess] = useState(false);
  const [reemplazar, setReemplazar] = useState(false);

  const [mensajeAlerta, setMensajeAlerta] = useState({
    type: null,
    mensaje: null
  })
  // Cuando ya se descargó la solicitud (solo descarga), el botón se bloquea pero se mantiene la leyenda "Descargar solicitud"
  const [solicitudYaDescargada, setSolicitudYaDescargada] = useState(false);

  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);

  const openModalView = () => setIsModalOpenView(!isModalOpenView);
  const closeModalView = () => setIsModalOpenView(!isModalOpenView);

  const openModalConfirm = () => setIsModalConfirmOpen(true);
  const closeModalConfirm = () => setIsModalConfirmOpen(false);

  useEffect(() => {
    setSolicitudYaDescargada(false);
    getStatus();
    // eslint-disable-next-line
  }, [idSolicitud]);

  const getStatus = async () => {
    obtenerStatusCotejo(idSolicitud)
      .then((response) => {
        if (response.status === 200) setStatusCotejo(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener status de cotejo: ", error);
        setMensajeAlerta({
          type: "error",
          mensaje: "Error al obtener status de cotejo"
        })
      });
  };

  // Cuando el status sea uno debe activarse el boton para generar la solicitud
  useEffect(() => {
    if (statusCotejo === 1 && !docNodoId) {
      setHabilitarDescarga(true);
      return;
    } else {
      setHabilitarDescarga(false);
      return;
    }
  }, [status, idSolicitud, statusCotejo, docNodoId]);

  useEffect(() => {
    const fetchNodeData = async () => {
      await getNodoSolicitud();
    };
    fetchNodeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idSolicitud]);


  useEffect(() => {
    setMensajeCarga(null);
    setMensajeDescarga(null);

    // status 2 para subir el doccumento de solicitud
    if (!selectedDataAcademico) return;

    const archivoSolicitud = selectedDataAcademico.archivos.find((archivo) => archivo.sigla === "A");
    // console.log(archivoSolicitud);

    const updatedNodoId = docNodoId || archivoSolicitud?.nodoId || null;
    setSolicitudNodoId(updatedNodoId);
  }, [selectedDataAcademico, docNodoId]);

  const descargarSolicitudAcademico = async () => {
    let message = ""
    setMensajeDescarga(null);
    setLoading(true);

    try {
      const response = await generarDocumentoSolicitud(idSolicitud);

      message = {
        type: "success",
        mensaje: "Se ha descargado el documento de solicitud",
      };

      generateSolicitudParticipacionPdf(response.data);
      setSolicitudYaDescargada(true);
      getStatus();
    } catch (error) {
      console.error("Error al descargar solicitud academico: ", error);
      message = {
        type: "error",
        mensaje: "Ocurrió un error al generar el documento de solicitud de académico",
      };
    } finally {
      setLoading(false);
      closeModal();
      setMensajeDescarga(message);
      setTimeout(() => {
        setMensajeDescarga(null);
      }, 3000);
    }
  };

  const generateSolicitudParticipacionPdf = (response) => {
    const blob = new Blob([response], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SOLICITUD_PARTICIPACION_PROESDE.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (event) => {
    setMensajeCarga(null);
    setIsLoading(true);  // Establecer estado de carga

    let message = '';

    try {

      const response = await cargarDocumento({ idSolicitud, archivo: dictamenFile, siglaDocumento: 'A', actualizarEstatus: true });

      if (response?.data === true) {
        await getNodoSolicitud();


        const NUEVO_STATUS = 4;
        const NUEVA_DESCRIPCION_STATUS = "Evaluar (Cotejada)";

        const currentData = useEvaluationStore.getState().selectedDataAcademico;
        if (currentData) {
          useEvaluationStore.setState({
            selectedDataAcademico: {
              ...currentData,
              status: NUEVO_STATUS,
              statusDescripcion: NUEVA_DESCRIPCION_STATUS,
            },
            status: NUEVO_STATUS,
          });

          // Sincronizar la lista del sidebar para evitar que al regresar
          // al mismo académico se muestre el estatus anterior
          useSearchStore.getState().updateAcademicoStatus(
            idSolicitud,
            NUEVO_STATUS,
            NUEVA_DESCRIPCION_STATUS
          );
        }

        message = {
          type: "success",
          mensaje: "Documento cargado exitosamente.",
        };
        setDictamenFile(null);
        setCargaHabilitada(false);
        setUpploadSuccess(!upploadSuccess);
        setIsSolicitudUploaded(true);

      } else {
        message = {
          type: "error",
          mensaje: `Error al cargar el documento. Código: ${response?.status}`,
        };
      }
    } catch (error) {
      message = {
        type: "error",
        mensaje: "Error al cargar el documento. Intenta nuevamente.",
      };
    } finally {
      document.getElementById("fileInput").value = "";
      setIsLoading(false);  // Finalizar la carga
      setReemplazar(false);
      setMensajeCarga(message);

      setTimeout(() => {
        setMensajeCarga(null);
      }, 3000);
    }
  };


  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];

    if (!file) return;
    const { validateFileSize, fetchMaxUploadSize } = useFileStore.getState();
    await fetchMaxUploadSize();
    const isFileSizeValid = validateFileSize(file);
    if (!isFileSizeValid) {
      alert(`El archivo excede el tamaño máximo permitido de ${useFileStore.getState().maxUploadSizeMB.toFixed(2)} MB.`);
      e.target.value = "";
      return;
    }
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    if (!allowedTypes.includes(file.type)) {
      alert("Solo se permiten archivos en formato PDF o DOCX.");
      e.target.value = "";
      return;
    }


    setDictamenFile(file);
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} withFooter={false} title="GENERAR SOLICITUD" width="400px">
        <p>Esta accion no puede deshacerse, por favor verifique detalladamente antes de generar la solicitud</p>
        <br></br>
        <div className={styles.modalDiv}>
          <button type="button" onClick={descargarSolicitudAcademico} className={styles.btnGenerarDoc} disabled={loading}>
            Generar solicitud
            {loading && <Loading />}
          </button>
        </div>
      </Modal>

      <Modal isOpen={isModalOpenView} onClose={closeModalView} width='850px'>
        <ViewerPDF urlPdf={urlPdf} />
      </Modal>

      <div className={styles.container}>
        {habilitarDescarga}
        <button
          onClick={openModal}
          className={habilitarDescarga ? `${styles.btnDescargar}` : `${styles.btnDescargaDisabled}`}
          disabled={loading || !habilitarDescarga}
        >
          {habilitarDescarga || solicitudYaDescargada ? "Descargar solicitud" : "Aún no puede descargar la solicitud"}
        </button>

        <div className={styles.uploadSection}>
          <h2>Subir documentos</h2>
          <div className={styles.uploadRow}>
            <label className={styles.label}>Solicitud y Acuse</label>
            {docNodoId || isSolicitudUploaded ? (
              <>
                <button
                  type="button"
                  className={styles.buttonPdf}
                  title="Ver PDF"
                  onClick={() => {
                    openModalView();
                    setUrlPdf(docNodoId || solicitudNodoId);
                  }}
                >
                  <FontAwesomeIcon icon={faFilePdf} color="green" size="2xl" />
                </button>
                <p className={styles.uploadedMessage}>✅ Documento ya subido</p>
                &ensp;
                <button className={styles.btnBlue} onClick={() => setReemplazar(true)}>Reemplazar</button>
              </>
            ) : statusCotejo === 2 ? (
              <>
                <input
                  id="fileInput"
                  type="file"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                  accept=".pdf"
                  disabled={isLoading}
                />
                <button
                  className={styles.uploadButton}
                  onClick={handleFileUpload}
                  disabled={!dictamenFile || isLoading}
                >
                  {isLoading ? "Subiendo..." : "Subir"}
                </button>
              </>
            ) : <p>Aún no puede subir su solicitud y acuse</p>
            }
          </div>
          {reemplazar && (
            <div className={styles.replaceContainer}>
              <label> Reemplazar </label>

              <input
                id="fileInput"
                type="file"
                className={styles.fileInput}
                onChange={handleFileChange}
                accept=".pdf"
                disabled={isLoading}
              />

              <button
                className={styles.btnBlue}
                onClick={openModalConfirm}
                disabled={!dictamenFile || isLoading}
              >
                Subir
              </button>

              <button
                className={styles.btnBlue}
                onClick={() => {
                  setDictamenFile(null);
                  setReemplazar(false);
                  document.getElementById("fileInput").value = "";
                }}
                disabled={!dictamenFile}
              >
                Cancelar
              </button>
            </div>
          )}

        </div>


        <Modal isOpen={isModalConfirmOpen} onClose={closeModalConfirm} width="350px" title="Confirmacion" withFooter={false}>
          <div>
            <p className="text-center">¿Está seguro de que desea subir este archivo? Una vez cargado la informacion quedara registrada en el sistema.</p>
          </div> <br />
          <div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
            <button
              className={styles.btnBlue}
            onClick={()=>{
                handleFileUpload()
                closeModalConfirm()
              }}
            >
              Subir
            </button>
            <button
              className={styles.btnRed}
              onClick={closeModalConfirm}
            >
              Cancelar
            </button>
          </div>
        </Modal>

        {loading && <Loading />}

        {mensajeAlerta && <Alert typeAlert={mensajeAlerta.type}>{mensajeAlerta.mensaje}</Alert>}
        {mensajeDescarga && <AlertaDescargandoDoc mensajeDescarga={mensajeDescarga} />}
        {mensajeCarga && <AlertaDescargandoDoc mensajeDescarga={mensajeCarga} />}
      </div>
    </>
  );
};

export default DescargarDocumentoSolicitud;
