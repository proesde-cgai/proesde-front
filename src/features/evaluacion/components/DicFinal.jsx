import React, { useEffect, useState, useRef } from "react";
import styles from "./styles/DicFinal.module.css";
import {
  generatePDFDicFinal,
  uploadDictamenFinal,
} from "../services/dictamenService";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../../reutilizable/Modal";
import ViewerPDF from "../../../reutilizable/ViewerPDF";
import { useDacFinal } from "../hooks/useDacFinal";
import UploadFile from "./UploadFile";
import api from "../../../hooks/api";

const DicFinal = () => {
  const {
    closeModal,
    handleFileChange,
    handleFileUpload,
    handleGenerateDictamen,
    handleSetUrlPdf,
    openModal,
    actaFile,
    actaNodoId,
    dictamenFile,
    isActaUploaded,
    isDictamenUploaded,
    isLoadingDictamen,
    isLoadingActa,
    isLoading,
    isModalOpen,
    urlPdf,
  } = useDacFinal();
  const { statusEvaluacion, fetchStatusEvaluacion } = useEvaluationStore();
  const [showReplaceInput, setShowReplaceInput] = useState(false);
  const roleUser = localStorage.getItem('rol');
  const isDictaminadora = roleUser === 'comision_especial_dictaminadora_ag' ||
                          roleUser === 'comision_especial_dictaminadora_sems' ||
                          roleUser === 'comision_dictaminadora_cu_ep';
  const [gacetaConfirmada, setGacetaConfirmada] = useState(false);
  const [loadingGaceta, setLoadingGaceta] = useState(true);

  const uploadFileRef = useRef(null);
  const replaceFileRef = useRef(null);

  const handleUploadWithReset = async (type) => {
    try {
      await handleFileUpload(type);
      // Reset input después de upload exitoso
      if (type === "dictamen") {
        if (uploadFileRef.current) uploadFileRef.current.reset();
        if (replaceFileRef.current) replaceFileRef.current.reset();
        setShowReplaceInput(false);
      }
    } catch (error) {
      // Error ya manejado en handleFileUpload
    }
  };

  useEffect(() => {
    fetchStatusEvaluacion();
    // eslint-disable-next-line
  }, []);

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
        GENERAR DICTAMEN FINAL
      </button>

      {statusEvaluacion === 9 ? (
        <div className={styles.uploadSection}>
          <h2>Subir documentos</h2>

          {isDictamenUploaded ? (
            <div className={styles.uploadRow}>
              <label className={styles.label}>Dictamen Firmado y Tabla</label>
              <button
                type="button"
                className={styles.buttonPdf}
                title="Ver PDF"
                onClick={() => handleSetUrlPdf("dictamen")}
              >
                <FontAwesomeIcon icon={faFilePdf} color="green" size="2xl" />
              </button>
              <p className={styles.uploadedMessage}>✅ Dictamen ya subido</p>
              <button
                className={`${styles.uploadButton} ${styles.toggleButton}`}
                onClick={() => setShowReplaceInput(!showReplaceInput)}
                disabled={isLoadingDictamen}
              >
                {showReplaceInput ? "Cancelar" : "Reemplazar"}
              </button>
            </div>
          ) : (
            <UploadFile
              ref={uploadFileRef}
              inputId="dictamenInput"
              label="Dictamen Firmado y Tabla"
              accept=".pdf,.docx"
              onFileChange={(e) => handleFileChange(e, "dictamen")}
              onUpload={() => handleUploadWithReset("dictamen")}
              uploading={isLoadingDictamen}
            />
          )}

          {isDictamenUploaded && showReplaceInput && (
            <UploadFile
              ref={replaceFileRef}
              inputId="dictamenInput"
              label="Reemplazar Dictamen"
              accept=".pdf,.docx"
              onFileChange={(e) => handleFileChange(e, "dictamen")}
              onUpload={() => handleUploadWithReset("dictamen")}
              uploading={isLoadingDictamen}
            />
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DicFinal;
