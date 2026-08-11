import React, { useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Modal from "../../../../reutilizable/Modal";
import Alert from "../../../../reutilizable/Alert";
import styles from "../styles/ModalSubirLista.module.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ModalSubirLista = ({ isOpen, onClose, idComision, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const fileInputRef = useRef(null);

  const validateExcelColumns = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          
          // Obtener la primera hoja
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convertir a JSON para obtener los datos
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            reject("El archivo Excel está vacío");
            return;
          }
          
          // Obtener la primera fila (encabezados)
          const headers = jsonData[0];
          
          // Normalizar los encabezados (eliminar espacios y convertir a minúsculas para comparación)
          const normalizedHeaders = headers.map(h => 
            String(h).trim().toLowerCase()
          );
          
          // Columnas requeridas (case-insensitive)
          const requiredColumns = ["código", "nombre", "codigo rh"];
          
          // Verificar que todas las columnas requeridas estén presentes
          const missingColumns = requiredColumns.filter(
            col => !normalizedHeaders.includes(col)
          );
          
          if (missingColumns.length > 0) {
            reject(`El archivo Excel debe contener las columnas: Código, Nombre y codigo rh. Faltan: ${missingColumns.join(", ")}`);
            return;
          }
          
          resolve(true);
        } catch (error) {
          reject("Error al leer el archivo Excel");
        }
      };
      
      reader.onerror = () => {
        reject("Error al leer el archivo");
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setSelectedFile(null);
      setError(null);
      setPreviewData([]);
      return;
    }
    
    // Validar que sea un archivo Excel
    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError("Formato incorrecto. Solo se permiten archivos .xlsx o .xls");
      setSelectedFile(null);
      setPreviewData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (!idComision) {
      setError("No se ha seleccionado una comisión");
      setSelectedFile(null);
      setPreviewData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    setError(null);
    setPreviewData([]);
    
    try {
      // Validar las columnas del Excel antes de enviarlo al endpoint
      await validateExcelColumns(file);
      
      // Si la validación pasa, proceder con el envío al endpoint
      setSelectedFile(file);
      
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("file", file);

      const API_URL_CARGA_MASIVA = `${API_BASE_URL}/api/v1/comision/carga-masiva-academicos?idComision=${idComision}`;
      const response = await axios.post(API_URL_CARGA_MASIVA, formData, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setPreviewData(response.data);
        setError(null);
      } else {
        setError("Error al procesar el archivo. Respuesta inválida del servidor.");
        setSelectedFile(null);
        setPreviewData([]);
      }
    } catch (err) {
      console.error("Error al validar o subir el archivo:", err);
      
      // Si es un error de validación de columnas, mostrar ese mensaje
      // Si es un error del endpoint, mostrar el mensaje del servidor
      const errorMessage = err.message || err.response?.data?.mensaje || err.response?.data?.message || "Error al procesar el archivo. Por favor intente nuevamente.";
      setError(errorMessage);
      setSelectedFile(null);
      setPreviewData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile || error || !idComision || previewData.length === 0) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const API_URL_GUARDAR = `${API_BASE_URL}/api/v1/comision/guardar-carga-masiva`;

      const response = await axios.post(
        API_URL_GUARDAR,
        {
          guardar: true,
          idComision: parseInt(idComision),
        },
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Si la respuesta es exitosa, cerrar el modal y limpiar el estado
      if (response.status === 200 || response.status === 201) {
        setSelectedFile(null);
        setPreviewData([]);
        setError(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        // Recargar los académicos si se proporciona la función callback
        if (onSuccess && typeof onSuccess === 'function') {
          await onSuccess();
        }
        
        onClose();
      }
    } catch (err) {
      console.error("Error al guardar la carga masiva:", err);
      const errorMessage =
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        "Error al guardar la carga masiva. Por favor intente nuevamente.";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setError(null);
    setPreviewData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      withFooter={false}
      title=""
      width="500px"
      showCloseButton={false}
      hideBorders={true}
    >
      <div className={styles.modalContent}>
        <div className={styles.headerWithIcon}>
          <svg
            className={styles.documentIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
              stroke="#0d6efd"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2V8H20"
              stroke="#0d6efd"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className={styles.modalTitle}>Subir Documento</h2>
        </div>

        <p className={styles.instructionText}>
          Elige el archivo Excel que quieres cargar.
        </p>

        <div className={styles.fileInputContainer}>
          <input
            ref={fileInputRef}
            type="file"
            id="excelFileInput"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className={styles.fileInput}
            disabled={isValidating}
          />
        </div>

        {(isValidating || isSaving) && (
          <p className={styles.instructionText} style={{ color: "#0d6efd" }}>
            {isValidating ? "Validando archivo..." : "Guardando académicos..."}
          </p>
        )}

        {error && (
          <Alert typeAlert="error">
            <p>{error}</p>
          </Alert>
        )}

        {previewData.length > 0 && (
          <div className={styles.previewContainer}>
            <div 
              className={`${styles.tableWrapper} ${previewData.length > 6 ? styles.tableWrapperScroll : ''}`}
            >
              <table className={styles.previewTable}>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Dependencia</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr 
                      key={row.id || index}
                      className={!row.valido ? styles.invalidRow : ""}
                    >
                      <td>{row.codigo}</td>
                      <td>{row.nombre}</td>
                      <td>{row.dependencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className={styles.footerButtons}>
          <button
            className={styles.cancelButton}
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleConfirm}
            disabled={!selectedFile || !!error || isValidating || isSaving || previewData.length === 0}
          >
            {isSaving ? "Guardando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSubirLista;
