import { useEffect, useState } from "react";
import { useSearchStore } from "../../../store/useSearchStore";
import { downloadPDF } from "../helpers";
import { generatePDFDicNoParticipant, uploadDictamenNoParticipante } from "../services";
import { initialStatusResponse } from "../utils/util";

export const useReporteDictamenNoParticipante = () => {
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState(new Set());
  const { academicos, setAcademicos, clearSearch } = useSearchStore();
  const [statusResponse, setStatusResponse] = useState(initialStatusResponse);

  const handleCheckboxChange = (id) => {
    const updatedSelection = new Set(selectedParticipants);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id);
    } else {
      updatedSelection.add(id);
    }
    setSelectedParticipants(updatedSelection);
  };

  const handleGeneratePDF = async (participante) => {
    if (selectedParticipants.size === 0) {
      setStatusResponse({
        ...statusResponse,
        isError: true,
        message: "Seleccione al menos un académico para generar el PDF.",
      });
      return;
    }

    const body = participante;

    try {
      setStatusResponse({ ...statusResponse, isLoading: true });
      const response = await generatePDFDicNoParticipant(body);
      downloadPDF(response.data);
      setStatusResponse({
        ...statusResponse,
        isLoading: false,
        message: "PDF generado con éxito.",
      });
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      setStatusResponse({
        isLoading: false,
        message: error.message,
        isError: true,
      });
      alert(error.message);
    } finally {
      setTimeout(() => {
        setStatusResponse(initialStatusResponse);
      }, 2000);
    }
  };

  const handleSubmitFile = async (body) => {
    try {
      setStatusResponse({ ...statusResponse, isLoading: true });
      const response = await uploadDictamenNoParticipante(body);
      setStatusResponse({
        ...statusResponse,
        isLoading: false,
        message: "PDF subido con éxito.",
      });
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      setStatusResponse({
        isLoading: false,
        message: error.message,
        isError: true,
      });
      alert(error.message);
    } finally {
      setTimeout(() => {
        setStatusResponse(initialStatusResponse);
      }, 2000);
    }
  };

  useEffect(() => {
    setFilteredParticipants(academicos);
  }, [academicos]);

  const handleSearch = (query) => {
    const filtered = academicos.filter((participant) =>
      Object.values(participant).some((value) => value?.toString().toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredParticipants(filtered);
  };

  return {
    // properties
    filteredParticipants,
    selectedParticipants,
    academicos,
    statusResponse,
    // methods
    handleCheckboxChange,
    handleGeneratePDF,
    handleSearch,
    handleSubmitFile,
    setAcademicos,
  };
};
