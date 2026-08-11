import { useEffect, useState } from "react";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { useDictamenNoParticipantes } from "../hooks/useDictamenNoParticipantes";
import { uploadDictamenNoParticipante, } from "../services/dictamenService";
import styles from "./styles/DicNoParticipante.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faDownload } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../../reutilizable/Modal";
import ViewerPDF from "../../../reutilizable/ViewerPDF";
import { useDocDictamenP } from "../hooks/useFetchDictamenP";
import { useInconformidadStore } from "../../../store/useInconformidadStore";
import { visorDocumentosService } from "../../visorDeDocumentos/services/visorDocumentosService";

export const DictamenNoParticipantes = () => {
    const { selectedDataAcademico, idSolicitud } = useEvaluationStore();
    const { statusInconformidad, fetchStatusInconformidad, } = useInconformidadStore()
    const {
        docNodoDictamen,
        docNodoActa,
        getNodoDictamenInc,
        getNodoActaInc,
    } = useDocDictamenP();
    // console.log(statusInconformidad);

    const [dictamenFile, setDictamenFile] = useState(null);
    const [actaFile, setActaFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [canFetchActa, setCanFetchActa] = useState(false);
    const [isActaUploaded, setIsActaUploaded] = useState(false);
    const [isDictamenUploaded, setIsDictamenUploaded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const { handleGenerateDictamen, isLoadingFile } = 
    useDictamenNoParticipantes();


    const [dictamenNodoId, setDictamenNodoId] = useState(null);
    const [actaNodoId, setActaNodoId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [urlPdf, setUrlPdf] = useState(null);
    const [showReplaceInput, setShowReplaceInput] = useState(false);

    const openModal = () => setIsModalOpen(!isModalOpen);
    const closeModal = () => setIsModalOpen(!isModalOpen);

    //LLamada unica para obtener acta nodo, se lanza despues de subir archivo exitosamente
    // useEffect(() => {
    //     const fetchActa = async () => {
    //         await getNodoActaInc();
    //     };
    //     if(canFetchActa){
    //         fetchActa();
    //     }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [canFetchActa]);

    useEffect(() => {
    
        const fetchDictamenDatas = async () => {
            await getNodoDictamenInc();
            // await getNodoActaInc();
        };
    
        fetchDictamenDatas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idSolicitud]);

    useEffect(() => {
        if (!selectedDataAcademico || !selectedDataAcademico.archivos) return;

        const archivos = selectedDataAcademico.archivos;

        const dictamen = archivos.find(archivo => archivo.sigla === 'I');
        const acta = archivos.find(archivo => archivo.sigla === 'J');

        setIsDictamenUploaded(!!dictamen);
        setIsActaUploaded(!!acta);

        //SET DE NODO PARA DICTAMEN
        const dictamenNodo = docNodoDictamen || dictamen?.nodoId || null;
        setDictamenNodoId(dictamenNodo);
        //SET DE NODO PARA ACTA
        const actaNodo = docNodoActa || acta?.nodoId || null;
        setActaNodoId(actaNodo);
        fetchStatusInconformidad();
        // eslint-disable-next-line
    }, [selectedDataAcademico, docNodoDictamen, docNodoActa]);

    if (!selectedDataAcademico) return null;

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        const maxFileSize = 2 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            alert("Solo se permiten archivos en formato PDF o DOCX.");
            e.target.value = "";
            return;
        }

        if (file.size > maxFileSize) {
            alert("El tamaño del archivo no debe superar los 2 MB.");
            e.target.value = "";
            return;
        }

        if (type === "dictamen") setDictamenFile(file);
        if (type === "acta") setActaFile(file);
    };
    
    const setData = (type) => {
        const formData = new FormData();
        if (type === "dictamen" && dictamenFile) {
          formData.append("archivo", dictamenFile);
          formData.append("idSolicitud", selectedDataAcademico.id);
          formData.append("dictamen", true);
        }
    
        if (type === "acta" && actaFile) {
          formData.append("archivo", actaFile);
          formData.append("idSolicitud", selectedDataAcademico.id);
          formData.append("dictamen", false);
        }
        return formData;
      };

    const handleFileUpload = async (type) => {
        setIsLoading(true);
        try {
          if (type === "dictamen") {
            const body = setData(type);
            console.log(body)
            await uploadDictamenNoParticipante(body);
            alert("Archivo subido correctamente.");
            await getNodoDictamenInc();
            setDictamenFile(null);
            setIsDictamenUploaded(true);
            setShowReplaceInput(false);
            const replaceInput = document.getElementById("dictamenReplaceInput");
            if (replaceInput) replaceInput.value = "";
            // document.getElementById("dictamenInput").value = "";
          }
          if (type === "acta") {
            const data = setData(type);
            const success = await uploadDictamenNoParticipante(data);
            
            if (success) {
              alert("Archivo acta subido correctamente.");
              setActaFile(null);
              setIsActaUploaded(true);
              setCanFetchActa(true);  
            //   document.getElementById("actaInput").value = "";
            } else {
              alert("Error al subir el archivo acta.");
            }
          }
        } catch (error) {
          alert("Error al subir el archivo.");
        } finally {
          setIsLoading(false);
        }
    };

    const handleDownloadDictamen = async () => {
        const nodo = docNodoDictamen || dictamenNodoId;
        if (!nodo) return;
        setIsDownloading(true);
        try {
            const response = await visorDocumentosService(nodo);
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "DICTAMEN_INCONFORMIDAD_NO_PARTICIPANTE.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Error al descargar el dictamen.");
        } finally {
            setIsDownloading(false);
        }
    };

    const effectiveStatus = statusInconformidad;

    return (
        <div className={styles.container}>
            <Modal isOpen={isModalOpen} onClose={closeModal} width='850px'>
                <ViewerPDF urlPdf={urlPdf} />
            </Modal>

            <button
                className={styles.generateButton}
                onClick={handleGenerateDictamen}
                disabled={isLoadingFile}
            >
                GENERAR DICTAMEN DE NO PARTICIPANTE
            </button>

            {effectiveStatus === 16 ? <div className={styles.uploadSection}>
                <h2>Subir documentos</h2>

                <div className={styles.uploadRow}>
                    <label className={styles.label}>Dictamen</label>
                    {docNodoDictamen || isDictamenUploaded ? (
                        <>
                            <button
                                type='button'
                                className={styles.buttonPdf}
                                title='Ver PDF'
                                onClick={() => {
                                    openModal();
                                    setUrlPdf(docNodoDictamen || dictamenNodoId);
                                }}
                            >
                                <FontAwesomeIcon icon={faFilePdf} color='green' size='2xl' />
                            </button>
                            <p className={styles.uploadedMessage}>✅ Dictamen ya subido</p>
                            <button
                                type="button"
                                className={`${styles.uploadButton} ${styles.toggleButton}`}
                                onClick={handleDownloadDictamen}
                                disabled={isDownloading}
                            >
                                <FontAwesomeIcon icon={faDownload} /> Descargar
                            </button>
                            <button
                                className={`${styles.uploadButton} ${styles.toggleButton}`}
                                onClick={() => setShowReplaceInput(!showReplaceInput)}
                                disabled={isLoading}
                            >
                                {showReplaceInput ? "Cancelar" : "Reemplazar"}
                            </button>
                        </>
                    ) : (
                        <>
                            <input
                                id="dictamenInput"
                                type="file"
                                className={styles.fileInput}
                                onChange={(e) => handleFileChange(e, "dictamen")}
                                accept=".pdf,.docx"
                                disabled={isLoading}
                            />
                            <button
                                className={styles.uploadButton}
                                onClick={() => handleFileUpload("dictamen")}
                                disabled={!dictamenFile || isLoading}
                            >
                                Subir
                            </button>
                        </>
                    )}
                </div>

                {showReplaceInput && (
                    <div className={styles.uploadRow}>
                        <label className={styles.label}>Reemplazar Dictamen</label>
                        <input
                            id="dictamenReplaceInput"
                            type="file"
                            className={styles.fileInput}
                            onChange={(e) => handleFileChange(e, "dictamen")}
                            accept=".pdf,.docx"
                            disabled={isLoading}
                        />
                        <button
                            className={styles.uploadButton}
                            onClick={() => handleFileUpload("dictamen")}
                            disabled={!dictamenFile || isLoading}
                        >
                            Subir
                        </button>
                    </div>
                )}

            </div>
            :
            <></>
            }
        </div>
    );
};
