import React, { useState } from "react";
import { useReporteDictamenFinal } from "../../reportes/hooks/useReporteDictamenFinal";
import styles from "./Dictamen.module.css";
import { useEvaluationStore } from "../../../store/useEvaluationStore";

function Dictamen({ tipoDictamen }) {
  const { selectedDataAcademico } = useEvaluationStore();
  const [filePreview, setFilePreview] = useState(null);
  const [file, setFile] = useState(null);
  const {
    handleGeneratePDFDicFinal,
    handleSubmitFile,
    statusResponse: { isError, isLoading, message },
  } = useReporteDictamenFinal();

  const handleDownload = async () => {
    console.log(selectedDataAcademico.codigo);
    const payload = {
      academicosSeleccionados: [selectedDataAcademico.codigo],
    };
    await handleGeneratePDFDicFinal(payload);
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    setFile(file);

    const fileURL = URL.createObjectURL(file);
    setFilePreview(fileURL);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("idSolicitud", 217);
    formData.append("archivo", file);
    await handleSubmitFile(formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{tipoDictamen && tipoDictamen}</div>
      <button onClick={handleDownload} disabled={isLoading} className={styles.button}>
        {isLoading ? "Generando PDF..." : "Generar PDF"}
      </button>
      <form onSubmit={handleSubmit}>
        {!filePreview && <input className={styles.input} type="file" onChange={handleUpload} />}
        {filePreview && (
          <div className={styles.preview}>
            <iframe
              src={filePreview}
              title="Vista previa del archivo"
              className={styles.iframe}
              scrolling="no"
            ></iframe>
          </div>
        )}
        {filePreview && (
          <button type="submit" className={styles.button}>
            Subir archivo
          </button>
        )}
      </form>

      {isError && <div style={{ color: "red" }}>{message}</div>}
      {!isError && message && <div className={styles.message}>{message}</div>}
    </div>
  );
}

export default Dictamen;
