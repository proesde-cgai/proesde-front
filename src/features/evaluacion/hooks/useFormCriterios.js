import { useEffect, useState } from "react";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { ERROR_MESSAGES_GENERICS_API } from "../../../utils/messagesFromAPI";
import { datosEvaluacion, evaluar } from "../services/evaluacionService";

export const useFormCriterios = () => {
  const { selectedDataAcademico, setUltimoMiembro, } = useEvaluationStore();
  const { idSolicitud } = useEvaluationStore();
  const [dataResponse, setDataResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState({
    type: null,
    mensaje: null,
  });

  const onGetDatosEvaluacion = async () => {
    setIsLoading(true);
    setUltimoMiembro('');
    try {
      const data = await datosEvaluacion(idSolicitud, "evaluacion");
      setDataResponse({
        miembros: data.miembros,
        arbolCriterios: data.arbolCriterios,
        resultadosEvaluacion: data.tablaResultados,
        nivel: data.nivelPrimerEvaluacion || 0,
        puntaje: data.puntaje,
      });
      setUltimoMiembro(data.ultimoMiembro.nombre);
    } catch (error) {
      if (error.response) {
        const message =
          ERROR_MESSAGES_GENERICS_API[error.response.status] ||
          ERROR_MESSAGES_GENERICS_API.default;
        setMensaje({
          mensaje: message,
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMensaje(null);
    if (idSolicitud) {
      onGetDatosEvaluacion();
    }
    // eslint-disable-next-line
  }, [selectedDataAcademico]);

  const onSubmitEvaluar = async (data) => {
    setIsLoading(true);
    const { idMiembro, ...rest } = data;

    const valoresPuntajeData = rest;

    const valoresPuntajeFormat = Object.keys(valoresPuntajeData).reduce(
      (acc, key) => {
        acc[key] =
          valoresPuntajeData[key] === undefined || valoresPuntajeData[key] === null ? "0" : valoresPuntajeData[key];
        return acc;
      },
      {}
    );


    const body = {
      idSolicitud,
      idMiembro: Number(idMiembro),
      aliasActividad: "evaluacion",
      valoresPuntaje: valoresPuntajeFormat,
      // ratificaModifica: +data.radio
    };

    console.log( body );


    try {
      await evaluar(body);
      await onGetDatosEvaluacion();
      // console.log(response);
    } catch (error) {
      console.error("Error al realizar la evaluación: ", error);
      if (error.response) {
        const message =
          ERROR_MESSAGES_GENERICS_API[error.response.status] ||
          ERROR_MESSAGES_GENERICS_API.default;
        setMensaje({
          mensaje: message,
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // properties
    ...dataResponse,
    isLoading,
    mensaje,
    // methods
    onSubmitEvaluar,
  };
};
