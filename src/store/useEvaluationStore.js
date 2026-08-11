import { create } from "zustand";
import {
  getDatosParticipante,
  getDatosParticipanteFullData,
} from "../features/visorDeDocumentos/services/datosParticipanteService";
import { DatosParticipante } from "../features/visorDeDocumentos/components/DatosParticipante";
import Notas from "../features/evaluacion/components/Notas";
import DicNoParticipantes from "../features/evaluacion/components/DicNoParticipantes";
import { Requisitos } from "../features/inconformidad/components/Requisitos";
import DicFinal from "../features/evaluacion/components/DicFinal";
import TabEvaluarPage from "../features/evaluacion/pages/TabEvaluarPage";
import { persist } from "zustand/middleware";
import { fetchStatus } from "../features/secretaria/secretariaAdminSems/GenerarDocInconformidad/hooks/useFetchStatus";

export const useEvaluationStore = create(
  persist(
    (set, get) => ({
      // Propiedad para almacenar los datos del academico seleccionado
      selectedDataAcademico: null,
      selectedDataAcademicoFull: null,
      selectedIdSolicitud: "",
      //idSolicitud del academico que esta seleccionado
      idSolicitud: null,
      // Status en el que se encuentra el academico
      status: null,
      customMenuItems: [],
      esConcursante: null,
      isLoading: false,
      isLoadingValidation: false,
      ultimoMiembro: "",
      idSolicitudEvaluacion: "",
      statusEvaluacion: "",
      esParticipante: () => {
        const selectedDataAcademicoFull = get().selectedDataAcademicoFull;
        return selectedDataAcademicoFull?.validacion?.esParticipante || false;
      },
      razonesNoParticipante: () => {
        const selectedDataAcademicoFull = get().selectedDataAcademicoFull;
        return selectedDataAcademicoFull?.validacion?.razones || "";
      },
      cumpleRequisitos: () => {
        const selectedDataAcademicoFull = get().selectedDataAcademicoFull;
        return selectedDataAcademicoFull?.requisitos || false;
      },
      setStatusEvaluacion: (status) => {
        set({ statusEvaluacion: status });
      },
      menuItems: () => {
        const esParticipante = get().esParticipante();
        const cumpleRequisitos = get().cumpleRequisitos();
        const esConcursante = get().esConcursante;
        const status = get().statusEvaluacion;
        console.log("🚀 ~ useEvaluationStore ~ esConcursante:", esConcursante);
        const menu = [
          {
            label: "Datos del participante",
            element: <DatosParticipante />,
          },
          {
            label: "Notas",
            element: <Notas />,
          },
          ...(esParticipante
            ? [
                {
                  label: "Requisitos",
                  element: <Requisitos isEdited={true} />,
                },
                ...(esConcursante === true
                  ? [
                      {
                        label: "Evaluar",
                        element: <TabEvaluarPage />,
                      },
                      {
                        label: "Dictamen final",
                        element: <DicFinal />,
                      },
                    ]
                  : esConcursante === false
                  ? [
                      {
                        label: "Dictamen no participante",
                        element: <DicNoParticipantes />,
                      },
                    ]
                  : []),
              ]
            : [
                {
                  label: "Requisitos",
                  element: <Requisitos isEdited={false} />,
                },
                {
                  label: "Dictamen no participante",
                  element: <DicNoParticipantes />,
                },
              ]),
        ];
        if (status === 2 && !esParticipante)
          return menu.filter((item) =>
            ["Datos del participante", "Notas", "Requisitos", "Dictamen no participante"].includes(item.label)
          );
        if (status === 2)
          return menu.filter((item) => ["Datos del participante", "Notas", "Requisitos"].includes(item.label));

        return menu;
      },
      setIsConcursante: (cumpleRequisitos) => {
        cumpleRequisitos ? set({ esConcursante: true }) : set({ esConcursante: false });
      },
      setUltimoMiembro: (nameMiembro) => {
        set({ ultimoMiembro: nameMiembro });
      },
      // Función para encontrar el objeto por Id y establecerlo en selectedDataAcademico
      findAndSetDataAcademico: (id = 0, academicos = []) => {
        set({ isLoading: true });

        const academico = academicos.find((item) => item.id === id);
        set({ selectedDataAcademico: academico });
        set({ idSolicitud: academico.id });
        set({ status: academico.status });
        setTimeout(() => {
          set({ isLoading: false });
        }, 500);
        return academico;
      },
      // Función para verificar si selectedDataAcademico tiene valores en sus propiedades (retorna true o false depende el caso)
      hasSelectedDataAcademico: () => !!get().selectedDataAcademico,
      // Función para resetear selectedDataAcademico a null
      resetSelectedDataAcademico: () =>
        set({
          selectedDataAcademico: null,
          customMenuItems: [],
          esConcursante: null,
        }),
      // Funcion para setear los datos del academico al iniciar sesion
      setDataAcademico: async (codigo) => {
        try {
          set({ isLoading: true });
          const response = await getDatosParticipante(codigo);
          console.log(response);
          set({ selectedDataAcademico: response.data });
        } catch (error) {
          console.log("Error al obtener los datos del participante: ", error);
        } finally {
          set({ isLoading: false });
        }
      },
      setFullDataAcademico: async (code) => {
        try {
          set({ isLoading: true });
          const response = await getDatosParticipanteFullData(code, "evaluacion");
          console.log(response);
          set({ selectedDataAcademicoFull: response });
          set({ idSolicitudEvaluacion: response.idSolicitud });
          console.log(response.idSolicitud);
          return response;
        } catch (error) {
          console.log("Error al obtener los datos completos del participante: ", error);
        } finally {
          set({ isLoading: false });
        }
      },
      setIsLoading: (value) => set({ isLoading: value }),
      updateSelectedArchivoNodoBySigla: (sigla, nodoId) =>
        set((state) => {
          const selected = state.selectedDataAcademico;
          if (!selected || !Array.isArray(selected.archivos)) {
            return state;
          }
          const archivosActualizados = selected.archivos.map((archivo) => {
            if (archivo.sigla === sigla) {
              return { ...archivo, nodoId };
            }
            return archivo;
          });
          return {
            selectedDataAcademico: {
              ...selected,
              archivos: archivosActualizados,
            },
          };
        }),
      fetchStatusEvaluacion: async () => {
        const response = await fetchStatus(get().idSolicitudEvaluacion);
        set({ statusEvaluacion: response });
      },
    }),
    { name: "data-evaluacion" }
  )
);
