import axios from "axios";
import { getAccessToken } from "../../../authService"; // Asumimos que tienes el servicio de autenticación separado
import {
  requestAltasPlanTrabajo,
  requestUpdatePlanTrabajo,
} from "../adapters/PlanTrabajo.adapter";
import { instanceAxios } from "./instanceAxios";

const BASEURL_PT = "/api/v1/plan_trabajo/reporte";

export const consultaPlanTrabajoCero = async () => {
  try {
    const token = await getAccessToken();
    const response = await instanceAxios.get(
      `${BASEURL_PT}/get-cero-plan-trabajo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error comunícate con el administrador");
  }
};

export const getPlanTrabajo = async () => {
  try {
    const token = await getAccessToken();
    const response = await instanceAxios.get(`${BASEURL_PT}/get-plan-trabajo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    const err = new Error("Error al obtener el plan de trabajo");
    err.status = error.response?.status;
    throw err;
  }
};

export const altaPlanTrabajo = async (dataAcademic) => {
  try {
    sessionStorage.setItem("planTrabajoGenerating", Date.now().toString());
    const token = await getAccessToken();
    const response = await instanceAxios.post(
      `${BASEURL_PT}/alta-plan-trabajo`,
      requestAltasPlanTrabajo(dataAcademic),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      sessionStorage.removeItem("planTrabajoGenerating");
      return true;
    }

    throw new Error("Error al guardar el plan de trabajo");
  } catch (error) {
    sessionStorage.removeItem("planTrabajoGenerating");
    console.log(error);
    const mensaje = error.response?.data?.mensaje;
    const message =
      typeof mensaje === "string"
        ? mensaje
        : Array.isArray(mensaje)
          ? mensaje.map((m) => (typeof m === "string" ? m : "")).join(" ").trim() || "Error al guardar el plan de trabajo"
          : "Error al guardar el plan de trabajo";
    const err = new Error(message);
    err.status = error.response?.status;
    throw err;
  }
};

export const updatePlanTrabajo = async (dataAcademic) => {
  try {
    sessionStorage.setItem("planTrabajoGenerating", Date.now().toString());
    const token = await getAccessToken();
    const response = await instanceAxios.post(
      `${BASEURL_PT}/editar-plan-trabajo`,
      requestUpdatePlanTrabajo(dataAcademic),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      sessionStorage.removeItem("planTrabajoGenerating");
      return true;
    }

    throw new Error("Error al guardar el plan de trabajo");
  } catch (error) {
    sessionStorage.removeItem("planTrabajoGenerating");
    console.log(error);
    const mensaje = error.response?.data?.mensaje;
    const message =
      typeof mensaje === "string"
        ? mensaje
        : Array.isArray(mensaje)
          ? mensaje.map((m) => (typeof m === "string" ? m : "")).join(" ").trim() || "Error al actualizar el plan de trabajo"
          : "Error al actualizar el plan de trabajo";
    throw new Error(message);
  }
};

export const getPDF = async (id) => {
  try {
    const token = await getAccessToken();
    const response = await instanceAxios.post(
      `${BASEURL_PT}/consulta-plan-trabajo?id=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Error al descargar el PDF");
  } catch (error) {

    if (error.response) {
      if (error.response.status === 500) {
        alert("Error interno del servidor. Contacte a soporte.");
      } else {
        alert(`Error al descargar el PDF. Código de estado: ${error.response.status}`);
      }
    } else {
      alert("Error al comunicarse con el servidor. Verifique su conexión.");
    }
    throw new Error("Error al guardar el plan de trabajo");
  }
};
