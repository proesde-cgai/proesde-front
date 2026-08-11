import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../../../reutilizable/Loading";
import Alert from "../../../../reutilizable/Alert";
import Modal from "../../../../reutilizable/Modal";
import modalStyles from "../../../../reutilizable/styles/Modal.module.css";
import styles from "./DescargaDocumentos.module.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_DOCUMENTOS = `${API_BASE_URL}/api/v1/gestorDocs/documentos-oficiales`;

export const DescargaDocumentos = () => {
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [descargando, setDescargando] = useState(false);
  const [showAviso, setShowAviso] = useState(true);

  useEffect(() => {
    const fetchDocumentos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(API_URL_DOCUMENTOS, {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("response ", response)
        if (response.data && Array.isArray(response.data)) {
          setDocumentos(response.data);
        } else {
          setDocumentos([]);
        }
      } catch (error) {
        setError("Error al cargar los documentos oficiales. Por favor, intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentos();
  }, []);

  const formatearFecha = (timestamp) => {
    if (!timestamp) return "";
    try {
      const fecha = new Date(timestamp);
      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const año = fecha.getFullYear();
      return `${dia}/${mes}/${año}`;
    } catch (error) {
      console.error("Error al formatear fecha: ", error);
      return "";
    }
  };

  const handleDescargar = async (documento) => {
    if (!documento.nodo && !documento.nodoId) {
      setError("El documento no tiene un nodo asociado para descargar.");
      return;
    }

    const nodo = documento.nodo || documento.nodoId;
    setDescargando(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/api/v1/documento/${nodo}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Importante para manejar archivos binarios
      });

      // Crear un blob con la respuesta como PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Usar el nombre del documento o un nombre por defecto, asegurando que termine en .pdf
      let nombreArchivo = documento.nombreDocumento || `documento_${nodo}`;
      // Asegurar que el nombre termine en .pdf
      if (!nombreArchivo.toLowerCase().endsWith('.pdf')) {
        nombreArchivo = `${nombreArchivo}.pdf`;
      }
      link.setAttribute("download", nombreArchivo);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Liberar la URL del objeto
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el documento:", error);
      setError("Error al descargar el documento. Por favor, intente nuevamente.");
    } finally {
      setDescargando(false);
    }
  };

  const handleAceptarAviso = () => {
    setShowAviso(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert typeAlert="error">
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.section}>
          <h2 className={styles.title}>Documentos oficiales disponibles</h2>
          <p className={styles.description}>
            Aquí puedes consultar y descargar los documentos oficiales emitidos para tu expediente.
          </p>

          {documentos.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No hay documentos oficiales disponibles en este momento.</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Nombre del Documento</th>
                    <th className={styles.th}>Tipo de Documento</th>
                    <th className={styles.th}>Fecha de Emisión</th>
                    <th className={styles.th}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {documentos.map((documento, index) => (
                    <tr key={index} className={styles.tr}>
                      <td className={styles.td}>{documento.nombreDocumento}</td>
                      <td className={styles.td}>{documento.tipoDocumento}</td>
                      <td className={styles.td}>{formatearFecha(documento.fechaEmision)}</td>
                      <td className={styles.td}>
                        <button
                          className={styles.buttonDescargar}
                          onClick={() => handleDescargar(documento)}
                          disabled={descargando || showAviso}
                        >
                          {descargando ? "Descargando..." : "Descargar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Aviso"
        isOpen={showAviso}
        onClose={handleAceptarAviso}
        width="400px"
        withFooter={false}
        showCloseButton={false}
        hideBorders={true}
      >
        <div className={styles.modalContentContainer}>
          <p className={styles.modalText}>
            Solo se muestran documentos oficiales generados. No se podrá visualizar aquellos documentos que aún no son generados por el sistema.
          </p>
        </div>
        <div className={`${modalStyles.footer} ${modalStyles.footerNoBorder} ${styles.modalFooter}`}>
          <button
            onClick={handleAceptarAviso}
            className={`${modalStyles.okButton} ${styles.modalButtonAceptar}`}
          >
            Aceptar
          </button>
        </div>
      </Modal>
    </>
  );
};

