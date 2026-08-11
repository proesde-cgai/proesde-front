import { useState } from "react";
import { ESTATUS } from "../models";
import {
  altaPlanTrabajo,
  getPDF,
  updatePlanTrabajo,
} from "../services/consultaPlanTrabajo";
import { linkDownloadPDF } from "../helpers/dowloadPDF";

const initialStatusResponse = {
  isLoading: false,
  message: null,
  status: false,
};

export const useFormularioPlanTrabajo = ({
  datosAcademico,
  obtainPlanTrabajo,
  styles,
  initialError,
}) => {
  const [statusResponse, setStatusResponse] = useState(initialStatusResponse);

  const downloadPDF = async () => {
    setStatusResponse({ ...statusResponse, isLoading: true });
    try {
      const data = await getPDF(datosAcademico.id);
      console.log(data);
      linkDownloadPDF(data);
      setStatusResponse({
        status: true,
        isLoading: false,
        message: "Plan de trabajo descargado correctamente",
      });
    } catch (error) {
      console.log("Error al generar PDF:", error);
      setStatusResponse({
        isLoading: false,
        status: false,
        message: "Hubo un error al descargar el PDF",
      });
    } finally {
      setTimeout(() => {
        setStatusResponse(initialStatusResponse);
      }, 5000);
    }
  };

  const onUpdatePlanTrabajo = async (e) => {
    try {
      const res = await updatePlanTrabajo(datosAcademico);

      if (res) {
        setStatusResponse({
          status: true,
          isLoading: false,
          message: "Plan de trabajo actualizado correctamente",
        });
      }
    } catch (error) {
      throw new Error("Hubo un error al actualizar el plan de trabajo");
    }
  };

  const onAltaPlanTrabajo = async () => {
    sessionStorage.setItem("planTrabajoGenerating", Date.now().toString());
    try {
      const res = await altaPlanTrabajo(datosAcademico);
      if (res) {
        setStatusResponse({
          status: true,
          isLoading: false,
          message: "Plan de trabajo guardado correctamente",
        });
      }
    } catch (error) {
      if (error.status === 409) {
        throw new Error("409");
      }
      throw error;
    } finally {
      sessionStorage.removeItem("planTrabajoGenerating");
      sessionStorage.setItem("planTrabajoJustCreated", Date.now().toString());
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (initialError || statusResponse.isLoading) return;
    if (!datosAcademico.code) {
      setStatusResponse({
        isLoading: false,
        status: false,
        message: "Por favor espera a que cargue la información del plan de trabajo.",
      });
      return;
    }
    setStatusResponse((prev) => ({ ...prev, isLoading: true }));
    try {
      datosAcademico.id !== "" && datosAcademico.id !== null
        ? await onUpdatePlanTrabajo()
        : await onAltaPlanTrabajo();

      let successObtain = false;
      for (let i = 0; i < 3; i++) {
        try {
          await obtainPlanTrabajo();
          successObtain = true;
          break;
        } catch (e) {
          if (e.status === 404) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
          } else {
            throw e;
          }
        }
      }

      if (!successObtain) {
        await obtainPlanTrabajo();
      }

    } catch (error) {
      if (error.message === "409") {
        await obtainPlanTrabajo();
        return;
      }
      setStatusResponse({
        isLoading: false,
        status: false,
        message: error.message,
      });
    } finally {
      setTimeout(() => {
        setStatusResponse(initialStatusResponse);
      }, 5000);
    }
  };

  const validStatus = (status) => {
    return datosAcademico.status === status;
  };

  const styleByStatus = () => {
    if (validStatus(ESTATUS.APROBADO)) {
      return styles.observacionSuccess;
    }
    if (validStatus(ESTATUS.PENDIENTE_REVISION)) {
      return styles.observacionWarning;
    }

    if (validStatus(ESTATUS.RECHAZADO)) {
      return styles.observacionWarning;
    }

    return styles.observacionDefault;
  };

  const textByStatus = () => {
    if (validStatus(ESTATUS.APROBADO)) {
      return "Su plan de trabajo ha sido aprobado";
    }
    if (validStatus(ESTATUS.PENDIENTE_REVISION)) {
      return "Pendiente de revisión";
    }

    if (validStatus(ESTATUS.RECHAZADO)) {
      return "Su plan de trabajo no ha sido aprobado revise las observaciones";
    }

    return "Debes llenar todos los datos de tu plan de trabajo para enviarlo";
  };

  return {
    // properties
    statusResponse,
    // methods
    validStatus,
    onSubmit,
    styleByStatus,
    textByStatus,
    downloadPDF,
  };
};
