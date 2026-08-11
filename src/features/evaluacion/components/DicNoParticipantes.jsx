import React, { useEffect, useState, useRef } from "react";
import styles from "./styles/DicNoParticipante.module.css";
import {
  generatePDFDicNoParticipant,
  getStatusDictamenService,
  uploadDictamenNoParticipante,
} from "../services/dictamenService";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../../reutilizable/Modal";
import ViewerPDF from "../../../reutilizable/ViewerPDF";
import { set } from "react-hook-form";
import { useFileStore } from "../../../store/useFileStore";
import UploadFile from "./UploadFile";
import api from "../../../hooks/api";

const DicNoParticipantes = () => {
  const [dictamenFile, setDictamenFile] = useState(null);
  const [actaFile, setActaFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDictamenUploaded, setIsDictamenUploaded] = useState(false);
  const [isActaUploaded, setIsActaUploaded] = useState(false);
  const [dictamenNodoId, setDictamenNodoId] = useState(null);
  const [actaNodoId, setActaNodoId] = useState(null);
  const [showReplaceInput, setShowReplaceInput] = useState(false);
  const roleUser = localStorage.getItem('rol');
  const isDictaminadora = roleUser === 'comision_especial_dictaminadora_ag' ||
                          roleUser === 'comision_especial_dictaminadora_sems' ||
                          roleUser === 'comision_dictaminadora_cu_ep';
  const [gacetaConfirmada, setGacetaConfirmada] = useState(false);
  const [loadingGaceta, setLoadingGaceta] = useState(true);

  const uploadFileRef = useRef(null);
  const replaceFileRef = useRef(null);

  const { selectedDataAcademico, fetchStatusEvaluacion, statusEvaluacion } =
    useEvaluationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlPdf, setUrlPdf] = useState(null);
  const openModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => setIsModalOpen(!isModalOpen);

  const getStatusDictamenNoParticipante = async () => {
    setIsActaUploaded(false);
    setIsDictamenUploaded(false);
    setDictamenNodoId(null);
    setActaNodoId(null);
    try {
      const responseDic = await getStatusDictamenService(
        selectedDataAcademico.id,
        "dictamen"
      );
      // Detectar si hay un nodo (archivo subido)
      if (responseDic && responseDic.nodoDictamen != null) {
        setIsDictamenUploaded(true);
        setDictamenNodoId(responseDic.nodoDictamen);
      }

      // no hay bandera de 'generado' en backend para este endpoint; no hacer nada adicional
      // const responseAct = await getStatusDictamenService(selectedDataAcademico.id, 'acta')
      // if (responseAct.nodoDictamen !== null) {
      //     setIsActaUploaded(true)
      //     setActaNodoId(responseAct.nodoDictamen)
      // }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStatusDictamenNoParticipante();
    // eslint-disable-next-line
  }, [selectedDataAcademico]);

  useEffect(() => {
    if (!isDictaminadora) {
      setLoadingGaceta(false);
      return;
    }
    api.get("/api/v1/gaceta/status")
      .then((response) => {
        const confirmada = response.data === true || response.data === "true";
        setGacetaConfirmada(confirmada);
      })
      .catch(() => setGacetaConfirmada(false))
      .finally(() => setLoadingGaceta(false));
  }, [isDictaminadora]);

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    const { validateFileSize, fetchMaxUploadSize } = useFileStore.getState();

    if (!file) return;
    await fetchMaxUploadSize();
    const isFileSizeValid = validateFileSize(file);
    if (!isFileSizeValid) {
      alert(
        `El archivo excede el tamaño máximo permitido de ${useFileStore
          .getState()
          .maxUploadSizeMB.toFixed(2)} MB.`
      );
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

    // const now = new Date();
    // const formattedDate = now.toISOString().replace(/[-T:]/g, "").split(".")[0]; // YYYYMMDDHHMMSS

    // const fileExtension = file.name.split('.').pop();
    // const renamedFile = `DictamenNoParticipante_${selectedDataAcademico.id}_${formattedDate}.${fileExtension}`;

    if (type === "dictamen") setDictamenFile(file);
    if (type === "acta") setActaFile(file);
  };

  const handleFileUpload = async (type) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (type === "dictamen" && dictamenFile) {
        formData.append("archivo", dictamenFile);
        formData.append("idSolicitud", selectedDataAcademico.id);
        formData.append("dictamen", true);

        console.log("File name:", dictamenFile);

        await uploadDictamenNoParticipante(formData);
        alert("Archivo dictamen subido correctamente.");
        setDictamenFile(null);
        setIsDictamenUploaded(true);
        setShowReplaceInput(false);
        // Resetear el componente UploadFile
        if (uploadFileRef.current) {
          uploadFileRef.current.reset();
        }
        if (replaceFileRef.current) {
          replaceFileRef.current.reset();
        }
        await getStatusDictamenNoParticipante();
      }
      if (type === "acta" && actaFile) {
        formData.append("archivo", actaFile);
        formData.append("idSolicitud", selectedDataAcademico.id);
        formData.append("dictamen", false);
        await uploadDictamenNoParticipante(formData);
        alert("Archivo acta subido correctamente.");
        setActaFile(null);
        setIsActaUploaded(true);
        await getStatusDictamenNoParticipante();
      }
    } catch (error) {
      alert("Error al subir el archivo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDictamen = async () => {
    setIsLoading(true);
    try {
      const payload = {
        academicosSeleccionados: [selectedDataAcademico.codigo],
        tipo: "evaluacion",
      };
      const response = await generatePDFDicNoParticipant(payload);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `DICTAMEN_SOLICITUD_PROESDE_NO_PARTICIPANTE.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("Dictamen de no participante generado exitosamente.");
    } catch (error) {
      alert(error.message || "Error al generar el dictamen de no participante.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Modal isOpen={isModalOpen} onClose={closeModal} width="850px">
        <ViewerPDF urlPdf={urlPdf} />
      </Modal>

      <button
        className={styles.generateButton}
        onClick={handleGenerateDictamen}
        disabled={isLoading || loadingGaceta || (isDictaminadora && gacetaConfirmada)}
      >
        GENERAR DICTAMEN DE NO PARTICIPANTE
      </button>

      <div className={styles.uploadSection}>
        <h2>Subir documentos</h2>

        {isDictamenUploaded ? (
          <div className={styles.uploadRow}>
            <label className={styles.label}>Dictamen</label>
            <button
              type="button"
              className={styles.buttonPdf}
              title="Ver PDF"
              onClick={() => {
                openModal();
                setUrlPdf(dictamenNodoId);
              }}
            >
              <FontAwesomeIcon icon={faFilePdf} color="green" size="2xl" />
            </button>
            <p className={styles.uploadedMessage}>✅ Dictamen ya subido</p>
            <button
              className={`${styles.uploadButton} ${styles.toggleButton}`}
              onClick={() => setShowReplaceInput((v) => !v)}
              disabled={isLoading}
            >
              {showReplaceInput ? "Cancelar" : "Reemplazar"}
            </button>
          </div>
        ) : (
          <UploadFile
            ref={uploadFileRef}
            label="Dictamen"
            inputId="dictamenInput"
            accept=".pdf,.docx"
            onFileChange={(e) => handleFileChange(e, "dictamen")}
            onUpload={() => handleFileUpload("dictamen")}
            uploading={isLoading}
          />
        )}

        {isDictamenUploaded && showReplaceInput && (
          <UploadFile
            ref={replaceFileRef}
            label="Reemplazar Dictamen"
            inputId="dictamenReplaceInput"
            accept=".pdf,.docx"
            onFileChange={(e) => handleFileChange(e, "dictamen")}
            onUpload={() => handleFileUpload("dictamen")}
            uploading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default DicNoParticipantes;
