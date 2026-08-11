import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import api from "../../../hooks/api";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import styles from "./styles/Actas.module.css";
import { useForm } from "react-hook-form";
import Modal from "../../../reutilizable/Modal";
import ViewerPDF from "./ViewerPDF";
import Alert from "../../../reutilizable/Alert";
import stylesReplaceModal from "./styles/ReplaceModal.module.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_VISUALIZAR = `${API_BASE_URL}/api/v1/expediente/visualizar-acta`;
const API_ETAPA_DOCUMENTOS = `${API_BASE_URL}/api/v1/expediente/obtener-etapa-documentos`;
const API_DOCUMENTOS_HISTORICO = `${API_BASE_URL}/api/v1/expediente/documentos-historico`;
const API_REEMPLAZAR = `${API_BASE_URL}/api/v1/expediente/reemplazar-archivo`;

export const Actas = ({ isHistorico = false }) => {
  const { selectedDataAcademico, isLoading, updateSelectedArchivoNodoBySigla } = useEvaluationStore();
  const { handleSubmit, register, watch, setValue } = useForm();
  const [documentos, setDocumentos] = useState([]);
  const [sigla, setSigla] = useState("");
  const [listaDocumentos, setListaDocumentos] = useState([]);
  const [loadingArchivo, setLoadingArchivo] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlPdf, setUrlPdf] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [error, setError] = useState(null);

  // estados para reemplazo
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // modal de subir/reemplazar
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // modal de confirmación
  const [fileToReplace, setFileToReplace] = useState(null); // { id, nombre, nodo }
  const [selectedFile, setSelectedFile] = useState(null); // File object
  const [replacing, setReplacing] = useState(false); // estado de reemplazo
  const skipSiglaResetRef = useRef(false);

  //cargar catalogo de documentos
  useEffect(() => {
    if (!selectedDataAcademico) {
      // limpiar estado cuando no hay selección
      setDocumentos([]);
      setSigla("");
      setListaDocumentos([]);
      setUrlPdf(null);
      setIsModalOpen(false);
      return;
    }

    // Skip full reset when triggered by a nodo-only store update after replace
    if (skipSiglaResetRef.current) {
      skipSiglaResetRef.current = false;
      return;
    }

    // Al cambiar la solicitud, limpiar selección previa antes de cargar
    setSigla("");
    // sincronizar con react-hook-form
    try {
      setValue("documento", "");
    } catch (e) {
      /* noop si setValue no está disponible o falla */
    }
    setListaDocumentos([]);
    setUrlPdf(null);
    setIsModalOpen(false);
    setLoadingData(true);
    setError(null);
    const token = localStorage.getItem("accessToken");

    // limpiar opciones inmediatamente para evitar mostrar las del usuario anterior
    setDocumentos([]);

    const controller = new AbortController();
    const headers = {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const fetchDocumentos = async () => {
      try {
        if (isHistorico) {
          // Módulo históricos: buscar directamente por idSolicitud en la API de históricos
          try {
            const response = await axios.get(
              API_DOCUMENTOS_HISTORICO + `?idSolicitud=${selectedDataAcademico.id}`,
              { headers, signal: controller.signal }
            );
            const filteredArray = response.data.filter(
              (item) => !(item.id === 6 && item.sigla === "F")
            );
            console.log("Documentos histórico: ", filteredArray);
            setDocumentos(filteredArray);
          } catch (error) {
            if (error && (error.code === "ERR_CANCELED" || error.name === "CanceledError")) return;
            setDocumentos([]);
          }
        } else {
          // Módulo proesde: buscar por idSolicitud en la API principal
          try {
            const response = await axios.get(
              API_ETAPA_DOCUMENTOS + `?idSolicitud=${selectedDataAcademico.id}`,
              { headers, signal: controller.signal }
            );
            const filteredArray = response.data.filter(
              (item) => !(item.id === 6 && item.sigla === "F")
            );
            console.log("Documentos: ", filteredArray);
            setDocumentos(filteredArray.length > 0 ? filteredArray : []);
          } catch (error) {
            if (error && (error.code === "ERR_CANCELED" || error.name === "CanceledError")) return;
            if (error?.response) {
              setError({ message: error.response.data?.mensaje || "Error al cargar documentos", type: "error" });
            } else {
              setError({ message: "Error al cargar documentos (problema de red)", type: "error" });
            }
          }
        }
      } finally {
        setLoadingData(false);
      }
    };

    fetchDocumentos();

    return () => controller.abort();
  }, [selectedDataAcademico, setValue, isHistorico]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // Limpiar el mensaje de error después de 3 segundos
      }, 3000);
      return () => clearTimeout(timer); // Limpiar el timeout si el componente se desmonta
    }
  }, [error]);

  //buscar actas
  const handleSubmitEvaluacion = async (nodo) => {
    setLoadingArchivo(nodo);
    console.log("buscar actas", nodo);
    const token = localStorage.getItem("accessToken");

    axios
      .get(`${API_VISUALIZAR}?nodo=${nodo}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
      })
      .then((response) => {
        openModal();
        setUrlPdf(response.data); // Ensure you're passing the response.data which is the actual blob
      })
      .catch((error) => {
        setError({
          message: "Acta no encontrada",
          type: "error",
        });
        console.error("Error fetching: ", error);
      })
      .finally(() => setLoadingArchivo(null));
  };

  // Descargar archivo
  const handleDownload = async (nodo, nombreArchivo) => {
    setLoadingArchivo(nodo);
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(`${API_VISUALIZAR}?nodo=${nodo}`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
      });

      const blob = response.data;

      // Detectar si el blob contiene JSON de error
      if (blob.type && blob.type.includes("application/json")) {
        const text = await blob.text();
        try {
          const parsed = JSON.parse(text);
          setError({
            message: parsed.message || "Error al descargar",
            type: "error",
          });
        } catch (e) {
          setError({ message: "Error al descargar archivo", type: "error" });
        }
        return;
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const safeName =
        nombreArchivo && nombreArchivo.includes(".")
          ? nombreArchivo
          : `${nombreArchivo || "documento"}.pdf`;
      link.setAttribute("download", safeName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error descargando: ", error);
      setError({ message: "No se pudo descargar el archivo", type: "error" });
    } finally {
      setLoadingArchivo(null);
    }
  };

  // Abrir modal de upload para un archivo específico
  const openUploadModal = (archivo) => {
    setFileToReplace(archivo);
    setSelectedFile(null);
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setFileToReplace(null);
    setSelectedFile(null);
  };

  // Confirmar reemplazo (abre modal de confirmación)
  const openConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  // Enviar FormData al endpoint para reemplazar archivo
  const handleReplace = async () => {
    if (!fileToReplace || !selectedFile) {
      setError({
        message: "Seleccione un archivo para reemplazar",
        type: "error",
      });
      return;
    }

    setReplacing(true);
    const formData = new FormData();
    formData.append("id", fileToReplace.id);
    formData.append("archivo", selectedFile);

    try {
      await api.post("/api/v1/expediente/reemplazar-archivo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setError({
        message: "Archivo reemplazado correctamente",
        type: "success",
      });
      setIsConfirmModalOpen(false);
      setIsUploadModalOpen(false);
      setFileToReplace(null);
      setSelectedFile(null);

      // Refrescar lista sin tocar selectedDataAcademico (evita cascade del useEffect)
      if (selectedDataAcademico) {
        setLoadingData(true);
        api
          .get(`/api/v1/expediente/obtener-etapa-documentos?idSolicitud=${selectedDataAcademico.id}`)
          .then((response) => {
            const filteredArray = response.data.filter(
              (item) => !(item.id === 6 && item.sigla === "F")
            );
            setDocumentos(filteredArray);
            // Sync replaced archivo's new nodo to store so other tabs reflect it
            const replacedGroup = filteredArray.find((d) =>
              d.archivos?.some((a) => a.id === fileToReplace?.id)
            );
            const replacedArchivo = replacedGroup?.archivos?.find(
              (a) => a.id === fileToReplace?.id
            );
            if (replacedGroup && replacedArchivo) {
              skipSiglaResetRef.current = true;
              updateSelectedArchivoNodoBySigla(replacedGroup.sigla, replacedArchivo.nodo);
            }
          })
          .catch((error) => console.error("Error al refrescar documentos: ", error))
          .finally(() => setLoadingData(false));
      }
    } catch (error) {
      console.error("Error reemplazando archivo: ", error);
      const msg = error?.response?.data?.mensaje || "No se pudo reemplazar el archivo";
      setError({ message: msg, type: "error" });
    } finally {
      setReplacing(false);
    }
  };

  useEffect(() => {
    console.log(sigla);
    if (sigla === "" || sigla.length === 0) return;
    setListaDocumentos(
      documentos.find((documento) => documento.sigla === sigla)
    );
    console.log(documentos.find((documento) => documento.sigla === sigla));
  }, [sigla, documentos]);

  // Mostrar estado de carga en línea (no hacer return temprano para no romper modales)

  // Mostrar el estado de carga global como antes
  if (loadingData) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} width="850px">
        <ViewerPDF urlPdf={urlPdf} />
      </Modal>
      <div>
        <div className={styles.restdiv}>
          <div className={styles.containerInputsSelectRadio}>
            <div className={styles.inputSelect}>
              <select
                name="documento"
                id="documento"
                {...register("documento")}
                value={sigla}
                onChange={(e) => {
                  const val = e.target.value;
                  setSigla(val);
                  try {
                    setValue("documento", val);
                  } catch (err) {}
                }}
              >
                <option value="" disabled>
                  -- Seleccione su nombre de la lista --
                </option>
                {documentos.map((documento) => (
                  <option
                    key={documento.sigla || documento.id}
                    value={documento.sigla}
                  >
                    {documento.nombre}
                  </option>
                ))}
              </select>
            </div>
            {/* Estado de carga / vacío para las opciones y la tabla */}
            {loadingData ? (
              ""
            ) : documentos.length === 0 ? (
              <Alert typeAlert={"warning"}>
                <p style={{ margin: 0, textAlign: "center" }}>
                  No se encontraron documentos para esta solicitud. Si el académico tiene evaluación, verifique que los documentos hayan sido cargados al sistema.
                </p>
              </Alert>
            ) : null}
          </div>
          <div>
            {listaDocumentos?.id && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    {(listaDocumentos?.nombre === "Producción Académica" || 
                      listaDocumentos?.nombre === "Requisitos de participación") && (
                      <th>Descripción</th>
                    )}
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {listaDocumentos?.archivos?.map((archivo) => (
                    <tr key={archivo.id}>
                      {(listaDocumentos?.nombre === "Producción Académica" || 
                        listaDocumentos?.nombre === "Requisitos de participación") && (
                        <td>{archivo.rubro}</td>
                      )}
                      {(listaDocumentos?.nombre === "Solicitud" ) && (
                        <td>Solicitud</td>
                      )}
                      {(listaDocumentos?.nombre === "Dictámenes (Evaluación)" ) && (
                        <td>Dictámenes de Evaluación</td>
                      )}
                      {(listaDocumentos?.nombre === "Dictámenes (Inconformidad)" ) && (
                        <td>Dictámenes de Inconformidad</td>
                      )}
                      {(listaDocumentos?.nombre === "Expresión de agravios" ) && (
                        <td>Expresión de agravios</td>
                      )}
                      {(listaDocumentos?.nombre === "Documentos justificativos de los agravios" ) && (
                        <td>Documentos justificativos de los agravios</td>
                      )}
                      {(listaDocumentos?.nombre !== "Solicitud"
                      && listaDocumentos?.nombre !== "Dictámenes (Evaluación)"
                      && listaDocumentos?.nombre !== "Dictámenes (Inconformidad)"
                      && listaDocumentos?.nombre !== "Expresión de agravios"
                    && listaDocumentos?.nombre !== "Documentos justificativos de los agravios") && (
                        <td>{archivo.nodo ? archivo.nombre : "Sin documento"}</td>
                      )}
                      <td className={styles.tdAcciones}>
                        <button
                          onClick={() => handleSubmitEvaluacion(archivo.nodo)}
                          className={
                            loadingArchivo === archivo.nodo
                              ? styles.buttonVisualizarDisabled
                              : styles.buttonVisualizar
                          }
                          disabled={!archivo.nodo || loadingArchivo === archivo.nodo}
                        >
                          Visualizar
                        </button>

                        <button
                          onClick={() =>
                            handleDownload(archivo.nodo, archivo.nombre)
                          }
                          className={
                            loadingArchivo === archivo.nodo
                              ? styles.buttonGenerarDisabled
                              : styles.buttonGenerar
                          }
                          disabled={!archivo.nodo || loadingArchivo === archivo.nodo}
                        >
                          Descargar Documento
                        </button>

                        {!isHistorico && (
                          <button
                            onClick={() => openUploadModal(archivo)}
                            className={
                              loadingArchivo === archivo.nodo
                                ? styles.buttonSubirDisabled
                                : styles.buttonSubir
                            }
                          >
                            Subir Documento
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {error ? (
        <Alert typeAlert={error.type}>
          <p>{error.message}</p>
        </Alert>
      ) : (
        ""
      )}

      {/* Modal para subir/reemplazar archivo */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        withFooter={false}
        title={`Subir Documento`}
        width="500px"
      >
        <div className={stylesReplaceModal.content}>
          <p>
            Elige el archivo PDF que quieres cargar para reemplazar{" "}
            <span className={stylesReplaceModal.fileName}>
              {fileToReplace?.nombre || ""}
            </span>
            .
          </p>
          <input
            type="file"
            accept="application/pdf"
            className={stylesReplaceModal.fileInput}
            onChange={(e) =>
              setSelectedFile(e.target.files && e.target.files[0])
            }
          />
          <div className={stylesReplaceModal.footerButtons}>
            <button
              className={stylesReplaceModal.cancelButton}
              onClick={closeUploadModal}
            >
              Cancelar
            </button>
            <button
              className={stylesReplaceModal.buttonReemplazar}
              onClick={() => openConfirmModal()}
              disabled={!selectedFile || replacing}
            >
              Reemplazar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de confirmación antes de reemplazar */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleReplace}
        title="Confirmar Reemplazo"
        width="400px"
        withFooter={false}
      >
        <div className={stylesReplaceModal.content}>
          <p>
            ¿Estás seguro de que deseas reemplazar el archivo PDF? Una vez
            confirmado los cambios quedarán registrados en el sistema.
          </p>

          <div className={stylesReplaceModal.footerButtons}>
            <button
              className={stylesReplaceModal.cancelButton}
              onClick={closeConfirmModal}
            >
              Cancelar
            </button>
            <button
              className={stylesReplaceModal.buttonReemplazar}
              onClick={() => handleReplace()}
              disabled={replacing}
            >
              {replacing ? "Subiendo..." : "Confirmar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
