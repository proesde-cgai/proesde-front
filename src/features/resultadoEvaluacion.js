import api from "../hooks/api";

const url = `/api/v1/reportes/obtener-lista-resultados-evaluaciones`;
const URL_EVALUATION = `/api/v1/reportes/generar_reporte_evaluacion`;
export const RESULTADO_EVALUACION_PAGE_SIZE = 10;

export const getResultadoEvaluacionList = async (
  idDependencia,
  {
    idTipoParticipacion,
    palabraClave,
    pageNumber = 0,
    pageSize = RESULTADO_EVALUACION_PAGE_SIZE,
    tipoOrdenCondicion,
    ordenarPorCondicion,
  } = {}
) => {
  try {
    const params = {
      ...(idDependencia != null ? { idDependencia } : {}),
      ...(idTipoParticipacion != null ? { idTipoParticipacion } : {}),
      ...(palabraClave ? { palabraClave } : {}),
      pageNumber,
      pageSize,
      ...(tipoOrdenCondicion ? { tipoOrdenCondicion } : {}),
      ...(ordenarPorCondicion ? { ordenarPorCondicion } : {}),
    };

    const response = await api.get(url, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postResultadoEvaluacion = async (body) => {
  try {
    const response = await api.post(URL_EVALUATION, body, {
      responseType: "blob",
    });
    console.log(response);
    return response;
  } catch (error) {
    let mensaje = "Ha ocurrido un error en el servidor";
    if (error.response?.data != null) {
      try {
        const data = error.response.data;
        if (typeof data.text === "function") {
          const text = await data.text();
          const json = JSON.parse(text);
          mensaje = json.mensaje || mensaje;
        } else if (data?.mensaje) {
          mensaje = data.mensaje;
        }
      } catch (_) {
        // mantener mensaje por defecto si falla el parse
      }
    }
    throw new Error(mensaje);
  }
};
