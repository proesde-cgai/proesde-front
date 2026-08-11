import { useEffect, useState } from "react";
import {
  getCeroPlanTrabajoAdapter,
  getPlanTrabajoAdapter,
} from "../adapters/PlanTrabajo.adapter";
import {
  consultaPlanTrabajoCero,
  getPlanTrabajo,
} from "../services/consultaPlanTrabajo";

const initialDatosAcademico = {
  schoolCycle: "",
  code: "",
  teaching: "",
  status: "",
  generation: "",
  academicManagement: "",
  id: "",
  teacherName: "",
  observations: "",
  requestID: "",
  linkage: "",
};

const usePlanTrabajo = () => {
  const [datosAcademico, setDatosAcademico] = useState(initialDatosAcademico);
  const [initialError, setInitialError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const obtainCeroPlanTrabajo = async () => {
    try {
      const data = await consultaPlanTrabajoCero();
      const dataAdapter = getCeroPlanTrabajoAdapter(data);

      setDatosAcademico((prev) => ({
        ...prev,
        ...dataAdapter,
      }));
    } catch (error) {
      setInitialError(true);
      console.log(error.message);
    }
  };

  const obtainPlanTrabajo = async () => {
    try {
      const res = await getPlanTrabajo();
      const dataAdapter = getPlanTrabajoAdapter(res);

      setDatosAcademico((prev) => ({
        ...prev,
        ...dataAdapter,
      }));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const justCreated = sessionStorage.getItem("planTrabajoJustCreated");
      const wasRecentlyCreated = justCreated && (Date.now() - parseInt(justCreated) < 20000);
      let wasWaitingForGeneration = !!wasRecentlyCreated;

      while (isMounted) {
        const isGenerating = sessionStorage.getItem("planTrabajoGenerating");
        if (isGenerating && (Date.now() - parseInt(isGenerating) < 45000)) {
          wasWaitingForGeneration = true;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          break;
        }
      }

      if (!isMounted) return;

      try {
        await obtainPlanTrabajo();
      } catch (error) {
        if (wasWaitingForGeneration && error.status === 404) {
          let successAfterWait = false;
          for (let i = 0; i < 3; i++) {
            if (!isMounted) break;
            await new Promise((resolve) => setTimeout(resolve, 1500));
            try {
              await obtainPlanTrabajo();
              successAfterWait = true;
              break;
            } catch (e) {
            }
          }
          sessionStorage.removeItem("planTrabajoJustCreated");
          if (!successAfterWait && isMounted) {
            await obtainCeroPlanTrabajo();
          }
        } else {
          await obtainCeroPlanTrabajo();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
    //  eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDatosAcademico((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    // properties
    datosAcademico,
    initialError,
    isLoading,
    // methods
    handleChange,
    obtainPlanTrabajo,
  };
};

export default usePlanTrabajo;
