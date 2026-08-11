// responses
export const getCeroPlanTrabajoAdapter = (planTrabajo) => {
  return {
    code: planTrabajo.codigo || "Sin código",
    teacherName: planTrabajo.nombreDocente || "Sin nombre",
    schoolCycle: planTrabajo.cicloEscolar || "Sin ciclo escolar",
    requestID: planTrabajo.solicitudID || "Sin ID de solicitud",
  };
};

export const getPlanTrabajoAdapter = (planTrabajo) => {
  return {
    schoolCycle: planTrabajo.cicloEscolar || "Sin ciclo escolar",
    code: planTrabajo.codigo || "Sin código",
    teaching: planTrabajo.docencia || "Sin docencia",
    status: planTrabajo.estatus || "Sin estatus",
    generation: planTrabajo.generacion || "Sin generación",
    academicManagement: planTrabajo.gestionAcademica || "Sin gestión académica",
    id: planTrabajo.id || 1,
    teacherName: planTrabajo.nombreDocente || "Sin nombre",
    observations: planTrabajo.observaciones || "Sin observaciones",
    requestID: planTrabajo.solicitudID || "Sin ID de solicitud",
    linkage: planTrabajo.vinculacion || "Sin vinculación",
  };
};

// requests
export const requestAltasPlanTrabajo = (data) => {
  return {
    docencia: data.teaching,
    generacion: data.generation,
    gestionAcademica: data.academicManagement,
    vinculacion: data.linkage,
  };
};

export const requestUpdatePlanTrabajo = (data) => {
  return {
    docencia: data.teaching,
    generacion: data.generation,
    gestionAcademica: data.academicManagement,
    vinculacion: data.linkage,
    id: data.id,
  };
};
