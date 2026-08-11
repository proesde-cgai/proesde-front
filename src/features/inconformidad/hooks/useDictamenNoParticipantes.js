import { useState, useEffect } from "react";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import {
  generatePDFDicNoParticipant,
  uploadDictamenNoParticipante,
} from "../services/dictamenService";
import { generatePDF } from "../utils";
import { useDocDictamenP } from "../hooks/useFetchDictamenP";
import { useInconformidadStore } from "../../../store/useInconformidadStore";
import { useFileStore } from "../../../store/useFileStore";

export const useDictamenNoParticipantes = () => {
  const [dictamenFile, setDictamenFile] = useState(null);
  const [actaFile, setActaFile] = useState(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canFetchActa, setCanFetchActa] = useState(false);
  const [isActaUploaded, setIsActaUploaded] = useState(false);
  const [isDictamenUploaded, setIsDictamenUploaded] = useState(false);

  const { selectedDataAcademico } = useEvaluationStore();
  const { fetchStatusInconformidad, } = useInconformidadStore();
  const {
    getNodoDictamenInc,
  } = useDocDictamenP();

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];

    if (!file) return;
    const { validateFileSize, fetchMaxUploadSize } = useFileStore.getState();
    await fetchMaxUploadSize();

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const isFileSizeValid = validateFileSize(file);
    if (!isFileSizeValid) {
      alert(`El archivo excede el tamaño máximo permitido de ${useFileStore.getState().maxUploadSizeMB.toFixed(2)} MB.`);
      e.target.value = "";
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert("Solo se permiten archivos en formato PDF o DOCX.");
      e.target.value = "";
      return;
    }


    if (type === "dictamen") setDictamenFile(file);
    if (type === "acta") setActaFile(file);
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
        document.getElementById("dictamenInput").value = "";
      }
      if (type === "acta") {
        const data = setData(type);
        const success = await uploadDictamenNoParticipante(data);

        if (success) {
          alert("Archivo acta subido correctamente.");
          setActaFile(null);
          setIsActaUploaded(true);
          setCanFetchActa(true);
          document.getElementById("actaInput").value = "";
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

  const handleGenerateDictamen = async () => {
    setIsLoadingFile(true);
    try {
      const payload = {
        academicosSeleccionados: [selectedDataAcademico.codigo],
        tipo: "inconformidad",
      };
      const data = await generatePDFDicNoParticipant(payload);
      generatePDF(data);
      alert("Dictamen de no participante generado exitosamente.");
      fetchStatusInconformidad();
    } catch (error) {
      alert("Error al generar el dictamen de no participante.");
    } finally {
      setIsLoadingFile(false);
    }
  };

  return {
    // properties
    isLoadingFile,
    isLoading,
    dictamenFile,
    actaFile,
    isActaUploaded,
    isDictamenUploaded,
    // methods
    handleFileChange,
    handleFileUpload,
    handleGenerateDictamen,
    setIsActaUploaded,
    setIsDictamenUploaded,
  };
};
