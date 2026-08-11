import { useEffect, useState } from "react";
import {
  generatePDFDicFinal,
  getStatusDictamenService,
  uploadDictamenFinal,
} from "../services/dictamenService";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { useFileStore } from "../../../store/useFileStore";

export const useDacFinal = () => {
  const [dictamenFile, setDictamenFile] = useState(null);
  const [actaFile, setActaFile] = useState(null);
  const [isLoadingDictamen, setIsLoadingDictamen] = useState(false);
  const [isLoadingActa, setIsLoadingActa] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDictamenUploaded, setIsDictamenUploaded] = useState(false);
  const [isActaUploaded, setIsActaUploaded] = useState(false);
  const [dictamenNodoId, setDictamenNodoId] = useState(null);
  const [actaNodoId, setActaNodoId] = useState(null);
  const [isLoadingViewer, setIsLoadingViewer] = useState(false);

  const { selectedDataAcademico, fetchStatusEvaluacion, } = useEvaluationStore();
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
      if (responseDic.nodoDictamen !== null) {
        setIsDictamenUploaded(true);
        setDictamenNodoId(responseDic.nodoDictamen);
      }
      const responseAct = await getStatusDictamenService(
        selectedDataAcademico.id,
        "acta"
      );
      if (responseAct.nodoDictamen !== null) {
        setIsActaUploaded(true);
        setActaNodoId(responseAct.nodoDictamen);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStatusDictamenNoParticipante();
    // eslint-disable-next-line
  }, [selectedDataAcademico]);

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    const { validateFileSize, fetchMaxUploadSize } = useFileStore.getState();

    if (!file) return;
    await fetchMaxUploadSize();

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];


    if (!allowedTypes.includes(file.type)) {
      alert("Solo se permiten archivos en formato PDF o DOCX.");
      e.target.value = "";
      return;
    }
    const isFileSizeValid = validateFileSize(file);
    if (!isFileSizeValid) {
      alert(`El archivo excede el tamaño máximo permitido de ${useFileStore.getState().maxUploadSizeMB.toFixed(2)} MB.`);
      e.target.value = "";
      return;
    }

    //fecha
    // const now = new Date();
    // const formattedDate = now.toISOString().replace(/[-T:]/g, "").split(".")[0]; // YYYYMMDDHHMMSS

    // const fileExtension = file.name.split('.').pop();
    // const renamedFile = `DictamenParticipante_${selectedDataAcademico.id}_${formattedDate}.${fileExtension}`;

    if (type === "dictamen") setDictamenFile(file);
    if (type === "acta") setActaFile(file);
  };

  const handleFileUpload = async (type) => {
    try {
      const formData = new FormData();
      if (type === "dictamen" && dictamenFile) {
        setIsLoadingDictamen(true);
        formData.append("archivo", dictamenFile);
        formData.append("idSolicitud", selectedDataAcademico.id);
        formData.append("dictamen", true);
        await uploadDictamenFinal(formData);
        alert("Archivo dictamen subido correctamente.");
        setDictamenFile(null);

        // Actualizar solo el estado de dictamen
        const responseDic = await getStatusDictamenService(selectedDataAcademico.id, "dictamen");
        if (responseDic.nodoDictamen !== null) {
          setIsDictamenUploaded(true);
          setDictamenNodoId(responseDic.nodoDictamen);
        }
        setIsLoadingDictamen(false);
      }

      if (type === "acta" && actaFile) {
        setIsLoadingActa(true);
        formData.append("archivo", actaFile);
        formData.append("idSolicitud", selectedDataAcademico.id);
        formData.append("dictamen", false);
        await uploadDictamenFinal(formData);
        alert("Archivo acta subido correctamente.");
        setActaFile(null);

        const responseAct = await getStatusDictamenService(selectedDataAcademico.id, "acta");
        if (responseAct.nodoDictamen !== null) {
          setIsActaUploaded(true);
          setActaNodoId(responseAct.nodoDictamen);
        }
        setIsLoadingActa(false);
      }
    } catch (error) {
      alert("Error al subir el archivo.");
    }
  };


  const handleGenerateDictamen = async () => {
    const userConfirmed = window.confirm(
      "Al generar el dictamen final se cerrará la evaluación, ¿estás seguro de continuar?"
    );

    if (userConfirmed) {
      setIsLoading(true);
      try {
        const payload = {
          academicosSeleccionados: [selectedDataAcademico.codigo],
          tipo: "evaluacion",
        };
        const response = await generatePDFDicFinal(payload);
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `DICTAMEN_SOLICITUD_PROESDE.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("Dictamen generado exitosamente.");
        fetchStatusEvaluacion();
      } catch (error) {
        let mensaje = "Error al generar el dictamen final.";
        const data = error.response?.data;
        if (data) {
          try {
            if (data.mensaje) {
              mensaje = data.mensaje;
            } else {
              const text = typeof data.text === "function" ? await data.text() : (typeof data === "string" ? data : null);
              if (text) {
                const json = JSON.parse(text);
                if (json.mensaje) mensaje = json.mensaje;
              }
            }
          } catch (_) {
            // mantener mensaje por defecto si falla el parse
          }
        }
        alert(mensaje);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Acción cancelada por el usuario.");
    }
  };

  const handleSetUrlPdf = (type) => {
    setIsLoadingViewer(true);
    if (type === "dictamen" && dictamenNodoId) {
      setUrlPdf(dictamenNodoId);
    } else if (type === "acta" && actaNodoId) {
      setUrlPdf(actaNodoId);
    } else {
      alert("No se encontró el documento.");
      setIsLoadingViewer(false);
      return;
    }
    openModal();
  };

  return {
    // properties
    dictamenFile,
    actaFile,
    isLoadingDictamen,
    isLoadingActa,
    isLoading,
    isDictamenUploaded,
    isActaUploaded,
    dictamenNodoId,
    actaNodoId,
    isModalOpen,
    urlPdf,
    // methods
    handleFileChange,
    handleFileUpload,
    handleGenerateDictamen,
    openModal,
    closeModal,
    handleSetUrlPdf,
  };
};
