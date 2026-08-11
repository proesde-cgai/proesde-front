import { useState } from "react";
import { generatePDFDicFinal, uploadDictamenFinal } from "../services/index";
import { downloadPDF } from "../helpers/index";
import { initialStatusResponse } from "../utils/util";

export const useReporteDictamenFinal = () => {
  const [statusResponse, setStatusResponse] = useState(initialStatusResponse);
  const handleGeneratePDFDicFinal = async (body) => {
    try {
      const response = await generatePDFDicFinal(body);
      if (response) {
        downloadPDF(response.data);
        setStatusResponse({
          ...statusResponse,
          isLoading: false,
          message: "PDF generado con éxito.",
        });
      }
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      setStatusResponse({
        isLoading: false,
        message: error.message,
        isError: true,
      });
    } finally {
      setTimeout(() => {
        setStatusResponse(initialStatusResponse);
      }, 2000);
    }
  };

  const handleSubmitFile = async (body) => {
    try {
      const response = await uploadDictamenFinal(body);
      if (response) {
        setStatusResponse({
          ...statusResponse,
          isLoading: false,
          message: "PDF subido con éxito.",
        });
      }
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      setStatusResponse({
        isLoading: false,
        message: error.message,
        isError: true,
      });
    } finally {
      setTimeout(() => {
        setStatusResponse(initialStatusResponse);
      }, 2000);
    }
  };

  return { handleGeneratePDFDicFinal, handleSubmitFile, statusResponse };
};
