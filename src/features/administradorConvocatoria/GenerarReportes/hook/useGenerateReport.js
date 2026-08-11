import { useState } from "react";

// Import all service functions
import {
  generarReporteComisionMiembro,
  generarEstadisticaInconforme,
  generarEstadisticaComparacionConvocatorias,
  generarEstadisticaListadosSolicitudesCentro,
  generarEstadisticaNuevosParticipantes,
  generarEstadisticaTotalSolicitudes,
  generarEstadisticaDocumentosDigitalizados,
} from "../services/reportesServices";

const useGenerateReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async ({ formato, reporte, contra, convocatoria }) => {
    setLoading(true);
    setError(null);

    try {
      let result;
      switch (reporte) {
        case "1": // Comparación convocatoria actual
          result = await generarEstadisticaComparacionConvocatorias(convocatoria, formato);
          break;
        case "2": // Documentos digitalizados pendientes
          result = await generarEstadisticaDocumentosDigitalizados(convocatoria, formato);
          break;
        case "3": // Miembros de comisión dictaminadoras
          result = await generarReporteComisionMiembro(convocatoria, formato);
          break;
        case "4": // Nuevos académicos participantes
          result = await generarEstadisticaNuevosParticipantes(convocatoria, formato);
          break;
        case "5": // Recursos de inconformidad presentados
          result = await generarEstadisticaInconforme(convocatoria, formato);
          break;
        case "6": // Solicitudes evaluadas por comisión especial
          result = await generarEstadisticaListadosSolicitudesCentro(contra, "none", convocatoria, formato);
          break;
        case "7": // Total de solicitudes registradas
          result = await generarEstadisticaTotalSolicitudes(convocatoria, formato);
          break;
        default:
          throw new Error("Tipo de reporte desconocido.");
      }

      return result;
    } catch (err) {
      console.error("Error generando el reporte:", err);
      setError(err.message || "Error al generar el reporte.");
      throw err; // Re-throw to allow the component to handle specific cases if needed
    } finally {
      setLoading(false);
    }
  };

  return { generateReport, loading, error };
};

export default useGenerateReport;
