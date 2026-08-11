import React, { useEffect, useState } from "react";
import axios from "axios";

import Loading from "../../../../../reutilizable/Loading";
import AlertaDescargandoDoc from "../../../components/AlertaDescargandoDoc";
import { useEvaluationStore } from "../../../../../store/useEvaluationStore";
import {
  generarDocumentoSolicitud,
  cargarDocumento,
} from "../services/generarDocumentoService";
import styles from "../../../components/styles/DescargarDocumentoSolicitud.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../../../../reutilizable/Modal";
import ViewerPDF from "../../../../../reutilizable/ViewerPDF";
import { useDocInconformidad } from "../hooks/useConsultaPDF";
import api from "../../../../../hooks/api";
import { useFileStore } from "../../../../../store/useFileStore";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const GET_STATUS = `${API_BASE_URL}/api/v1/cotejo-documentos/status?idSolicitud=`;


const GenerarInconformidad = () => {
  const { selectedDataAcademico } = useEvaluationStore();
  const {
    docNodoId,
    isInconformidadUploaded,
    getNodoInconformidad,
  } = useDocInconformidad();

  const [idSolicitud, setIdSolicitud] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensajeDescarga, setMensajeDescarga] = useState(null);
  const [mensajeCarga, setMensajeCarga] = useState(null);
  const [cargaHabilitada, setCargaHabilitada] = useState(true);
  const [dictamenFile, setDictamenFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [documentoNodoId, setDocumentoNodoId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [urlPdf, setUrlPdf] = useState(null);
  const [isSolicitudUploaded, setIsSolicitudUploaded] = useState(false);
  const [status, setStatus] = useState();
  const [reemplazar, setReemplazar] = useState(false);

  const [upploadSuccess, setUpploadSuccess] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openModalConfirm = () => setIsModalConfirmOpen(true);
  const closeModalConfirm = () => setIsModalConfirmOpen(false);

  const getStatus = () => {
    api.get(`${GET_STATUS}${selectedDataAcademico.id}`)
      .then(response => {
        setStatus(response.data)
        console.log("🚀 ~ useEffect ~ response:", response)
      })
      .catch(error => console.error("Error fetching criterios: ", error));
  }
  useEffect(() => {
    getStatus()
    // eslint-disable-next-line
  }, [selectedDataAcademico]);


  useEffect(() => {
    if (!selectedDataAcademico) return;

    setIdSolicitud(selectedDataAcademico.id);

    const fetchNodeData = async () => {
      await getNodoInconformidad();
    };

    fetchNodeData();

    const archivoInconformidad = selectedDataAcademico.archivos?.find(
      (archivo) => archivo.sigla === "G"
    );

    const updatedNodoId = docNodoId || archivoInconformidad?.nodoId || null;
    setDocumentoNodoId(updatedNodoId);

    setIsSolicitudUploaded(!isInconformidadUploaded);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDataAcademico]);

  useEffect(() => {
    setCargaHabilitada(!docNodoId);
  }, [docNodoId]);

  const descargarSolicitudAcademico = async () => {
    console.log('prpiont');
    
    setMensajeDescarga(null);
    setLoading(true);

    try {
      const response = await generarDocumentoSolicitud(idSolicitud);
      console.log(response);
      if (response.status === 200) {
        generateSolicitudInconformidadPdf(response.data)

        setMensajeDescarga({
          type: "success",
          mensaje: "Se ha descargado el documento de solicitud",
        });

        getStatus()
      }
    } catch (error) {
      console.error("Error al descargar documento de inconformidad: ", error);
      setMensajeDescarga({
        type: "error",
        mensaje: "Ocurrió un error al generar el documento de inconformidad",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSolicitudInconformidadPdf = (response) => {
    const blob = new Blob([response], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SOLICITUD_INCONFORMIDAD.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async () => {
    setMensajeCarga(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("idSolicitud", idSolicitud);
      formData.append("siglaDocumento", "G");
      formData.append("archivo", dictamenFile);

      const response = await cargarDocumento(formData);

      if (response?.status === 200) {
        alert("Archivo dictamen subido correctamente.");
        setMensajeCarga({
          type: "success",
          mensaje: "Documento cargado exitosamente.",
        });
        setDictamenFile(null);
        document.getElementById("fileInput").value = "";
        setCargaHabilitada(false);
        setIsSolicitudUploaded(true);

        setUpploadSuccess(!upploadSuccess);
        await getNodoInconformidad();

      } else {
        setMensajeCarga({
          type: "error",
          mensaje: `Error al cargar el documento. Código: ${response?.status}`,
        });
      }
    } catch {
      setMensajeCarga({
        type: "error",
        mensaje: "Error al cargar el documento. Intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
      setReemplazar(false);
    }
  };

  const handleFileChange = async (e) => {
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
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Solo se permiten archivos en formato PDF o DOCX.");
      e.target.value = "";
      return;
    }



    setDictamenFile(file);
  };

  return (
    <div className={styles.container}>
      <Modal isOpen={isModalOpen} onClose={closeModal} width="850px">
        <ViewerPDF urlPdf={urlPdf} />
      </Modal>

      <button
        onClick={descargarSolicitudAcademico}
        className={styles.btnDescargar}
      >
        Generar Inconformidad
      </button>

      {
        status !== 4 && status !== 5 ? (
          <></>
        ) : (<div className={styles.uploadSection}>
          <h2>Subir documentos</h2>

          <div className={styles.uploadRow}>
            <label htmlFor="fileInput" className={styles.label}>
              Inconformidad y acuse
            </label>

            {cargaHabilitada ? (
              <>
                <input
                  id="fileInput"
                  type="file"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                  disabled={isLoading}
                />
                <button
                  className={styles.uploadButton}
                  onClick={handleFileUpload}
                  disabled={!dictamenFile || isLoading}
                >
                  Subir cotejo
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={styles.buttonPdf}
                  title="Ver PDF"
                  onClick={() => {
                    openModal();
                    setUrlPdf(docNodoId || documentoNodoId);
                  }}
                >
                  <FontAwesomeIcon icon={faFilePdf} color="green" size="2xl" />
                </button>
                <p className={styles.uploadedMessage}>✅ Documento ya subido</p>
                &ensp;  
                <button className={styles.btnBlue} onClick={() => setReemplazar(true)}>Reemplazar</button>
              </>
            )}

          </div>
            {reemplazar && (
              <div className={styles.replaceContainer}>
                <label> Reemplazar </label>

                <input
                  id="fileInput"
                  type="file"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
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
        </div>)
      }

      
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

      {mensajeDescarga && (
        <AlertaDescargandoDoc mensajeDescarga={mensajeDescarga} />
      )}
      {mensajeCarga && <AlertaDescargandoDoc mensajeDescarga={mensajeCarga} />}
    </div>
  );
};

export default GenerarInconformidad;
