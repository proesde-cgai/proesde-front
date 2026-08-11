import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getResultadoEvaluacionList,
  postResultadoEvaluacion,
  RESULTADO_EVALUACION_PAGE_SIZE,
} from "../features/resultadoEvaluacion";
export const useResultadoEvaluacionStore = create(
  persist(
    (set, get) => ({
      resultadoEvaluacionList: null,
      hasfiltroDependencias: null,
      dependenciesList: null,
      isErrorResultadoEvaluacionList: null,
      isLoading: true,
      pagination: {
        number: 0,
        size: RESULTADO_EVALUACION_PAGE_SIZE,
        totalElements: 0,
        totalPages: 0,
        last: true,
      },

      executeFetchResultadoEvaluacion: async (
        idDependencia,
        idTipoParticipacion = null,
        palabraClave = null,
        pageNumber = 0,
        pageSize = RESULTADO_EVALUACION_PAGE_SIZE
      ) => {
        set({ isLoading: true });
        const response = await getResultadoEvaluacionList(idDependencia, {
          idTipoParticipacion,
          palabraClave,
          pageNumber,
          pageSize,
        });
        const evalList = response.content || response.evaluaciones || [];
        set({
          resultadoEvaluacionList: Array.isArray(evalList) ? evalList : [],
          hasfiltroDependencias: !!response.filtroDependencias,
          dependenciesList: response.filtroDependencias || [],
          isErrorResultadoEvaluacionList: null,
          isLoading: false,
          pagination: {
            number: response.number ?? pageNumber,
            size: response.size ?? pageSize,
            totalElements: response.totalElements ?? 0,
            totalPages: response.totalPages ?? 0,
            last: response.last ?? true,
          },
        });
      },

      fetchResultadoEvaluacion: async (
        idDependencia,
        idTipoParticipacion = null,
        palabraClave = null,
        pageNumber = 0,
        pageSize = RESULTADO_EVALUACION_PAGE_SIZE
      ) => {
        try {
          await get().executeFetchResultadoEvaluacion(
            idDependencia,
            idTipoParticipacion,
            palabraClave,
            pageNumber,
            pageSize
          );
        } catch (error) {
          set({
            isErrorResultadoEvaluacionList: error,
            isLoading: false,
          });
        }
      },
      generatePdf: async (body) => {
        const response = await postResultadoEvaluacion(body);
        return response;
      },

      updateFilteredList: async (
        query,
        idDependencia,
        idTipoParticipacion = null,
        pageNumber = 0,
        pageSize = RESULTADO_EVALUACION_PAGE_SIZE
      ) => {
        try {
          await get().executeFetchResultadoEvaluacion(
            idDependencia,
            idTipoParticipacion,
            query,
            pageNumber,
            pageSize
          );
        } catch (error) {
          console.error("Error al filtrar resultados:", error);
          set({
            isErrorResultadoEvaluacionList: error.message,
            isLoading: false,
          });
        }
      },

      selectOptionFilteredList: async (
        option,
        idTipoParticipacion = null,
        palabraClave = null,
        pageNumber = 0,
        pageSize = RESULTADO_EVALUACION_PAGE_SIZE
      ) => {
        try {
          await get().executeFetchResultadoEvaluacion(
            option?.id,
            idTipoParticipacion,
            palabraClave,
            pageNumber,
            pageSize
          );
        } catch (error) {
          console.error("Error al seleccionar opción:", error);
          set({
            isErrorResultadoEvaluacionList: error.message,
            isLoading: false,
          });
        }
      },
    }),
    { name: "data-resultado-evaluacion" }
  )
);
