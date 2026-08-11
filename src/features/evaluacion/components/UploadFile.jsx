import React, { useRef, forwardRef } from "react";
import styles from "./styles/UploadFile.module.css";

/**
 * UploadFile
 * Props:
 * - label: string — texto de la etiqueta mostrado a la izquierda.
 * - inputId: string — id para el elemento input file.
 * - accept: string — valor para input.accept (p. ej. ".pdf,.docx").
 * - onFileChange: function(event) — manejador para el evento onChange del input.
 * - onUpload: function() — manejador para el botón "Subir".
 * - uploading: boolean — indica que hay una subida en curso; deshabilita controles.
 *
 * Métodos expuestos vía ref:
 * - reset(): limpia el input y reinicia el estado de selección.
 */
const UploadFile = forwardRef(
  (
    {
      label = "Archivo",
      inputId = "fileInput",
      accept = ".pdf,.docx",
      onFileChange,
      onUpload,
      uploading = false,
    },
    ref
  ) => {
    const inputRef = useRef(null);
    const [fileSelected, setFileSelected] = React.useState(false);

    const handleFileChange = (e) => {
      setFileSelected(e.target.files && e.target.files.length > 0);
      onFileChange(e);
    };

    // Exponer método reset vía ref
    React.useImperativeHandle(ref, () => ({
      reset: () => {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setFileSelected(false);
      },
    }));

    return (
      <div className={styles.uploadRow}>
        <label className={styles.label}>{label}</label>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className={styles.fileInput}
          onChange={handleFileChange}
          accept={accept}
          disabled={uploading}
        />

        <button
          className={styles.uploadButton}
          onClick={onUpload}
          disabled={!fileSelected || uploading}
        >
          Subir
        </button>
      </div>
    );
  }
);

UploadFile.displayName = "UploadFile";

export default UploadFile;
