import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDatosInconformidad } from "../features/visorDeDocumentos/services/inconformidadService";
import { DatosParticipante } from "../features/visorDeDocumentos/components/DatosParticipante";
import Notas from "../features/evaluacion/components/Notas";
import { Requisitos } from "../features/inconformidad/components/Requisitos";
import TabEvaluarPage from "../features/evaluacion/pages/TabEvaluarPage";
import DictamenFinal from "../features/inconformidad/components/DictamenFinal";
import { DictamenNoParticipantes } from "../features/inconformidad/components/DictamenNoParticipantes";
import Evaluar from "../features/inconformidad/pages/Evaluar";
import { getDatosParticipanteFullData } from "../features/visorDeDocumentos/services/datosParticipanteService";
import DatosInconformidad from "../features/secretaria/secretariaAdminSems/GenerarDocInconformidad/component/DatosInconformidad";
import RequisitosInconformidadPage from "../features/inconformidad/pages/RequisitosInconformidadPage";
import { fetchStatus } from "../features/secretaria/secretariaAdminSems/GenerarDocInconformidad/hooks/useFetchStatus";

export const useInconformidadStore = create(
  persist(
    (set, get) => ({
      datosInconformidad: null,
      isErrorDatosInconformidad: "",
      isLoadingInconformidad: false,
      customMenuItems: [],
      esConcursanteInconformidad: null,
      errorInconformidad: '',
      ultimoMiembro: '',
      statusInconformidad: '',
      idSolicitudInconformidad: '',
      selectedDataAcademicoFull: null,
      esParticipante: () => {
        const selectedDataAcademicoFull = get().selectedDataAcademicoFull;
        return selectedDataAcademicoFull?.validacion?.esParticipante || false;
      },
      razonesNoParticipante: () => {
        const selectedDataAcademicoFull = get().selectedDataAcademicoFull;
        console.log(selectedDataAcademicoFull);
        return selectedDataAcademicoFull?.validacion?.razones || '';
      },
      cumpleRequisitos: () => {
        const selectedDataAcademicoFull = get().selectedDataAcademicoFull;
        return selectedDataAcademicoFull?.requisitos || false;
      },
      cumpleInconformidad: () => {
        const selectedDataAcademicoFull = get().selectedDataAcademicoFull;
        return selectedDataAcademicoFull?.inconformidad || false;
      },
      setIsConcursanteInconformidad: (cumpleRequisitos) => {
        cumpleRequisitos ? set({ esConcursanteInconformidad: true }) : set({ esConcursanteInconformidad: false });
      },
      setErrorInconformidad: (msgError) => {
        set({ errorInconformidad: msgError });
      },
      setUltimoMiembro: (nameMiembro) => {
        set({ ultimoMiembro: nameMiembro });
      },
      setStatusInconformidad: (status) => {
        set({statusInconformidad: status})
      },
      menuItems: () => {
        const esParticipante = get().esParticipante();
        const cumpleRequisitos = get().cumpleRequisitos();
        const esConcursante = get().esConcursanteInconformidad;
        const cumpleInconformidad = get().cumpleInconformidad();
        const status = get().statusInconformidad;
      
        // Construcción normal del menú con todas las reglas actuales
        const menu = [
          ...(cumpleInconformidad
            ? [
                {
                  label: "Razones Inconformidad",
                  element: <DatosInconformidad />,
                },
              ]
            : []),
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
                  element: <Requisitos />,
                },
                ...(esConcursante === true
                  ? [
                      {
                        label: "Evaluar",
                        element: <Evaluar />,
                      },
                      {
                        label: "Dictamen final",
                        element: <DictamenFinal />,
                      },
                    ]
                  : esConcursante === false
                  ? [
                      {
                        label: "Dictamen no participante",
                        element: <DictamenNoParticipantes />,
                      },
                    ]
                  : []),
              ]
            : [
                {
                  label: "Dictamen no participante",
                  element: <DictamenNoParticipantes />,
                },
              ]),
        ];
      
        // Si el status está entre 8 y 12, solo permitimos ciertos elementos
        if (status >=4 && !esParticipante) {
          return menu.filter((item) =>
            ["Razones Inconformidad", "Datos del participante", "Notas", "Dictamen no participante"].includes(item.label)
        )
        } else if (status === 4) {
          return menu.filter((item) =>
            ["Razones Inconformidad", "Datos del participante", "Notas", "Requisitos"].includes(item.label)
          );
        }
      
        return menu;
      },
      
      setFullDataAcademicoInconformidad: async (code) => {
        try {
          set({ isLoadingInconformidad: true });
          const response = await getDatosParticipanteFullData(
            code,
            "inconformidad"
          );
          console.log(response);
          if( !response ) return set({ errorInconformidad: 'Error: error al obtener los datos completos del participante '});
          set({ selectedDataAcademicoFull: response });
          set({idSolicitudInconformidad: response.idSolicitud });
          set({ errorInconformidad: null} )
          return response;
        } catch (error) {
          console.log(
            "Error al obtener los datos completos del participante: ",
            error
          );
        } finally {
          set({ isLoadingInconformidad: false });
        }
      },
      fetchDatosInconformidad: async () => {
        try {
          const response = await getDatosInconformidad();
          set({
            datosInconformidad: response,
            isLoadingInconformidad: false,
          });
        } catch (error) {
          console.log(error);
          set({
            isErrorDatosInconformidad: error,
          });
        }
      },
      fetchStatusInconformidad: async() => {
        const response = await fetchStatus(get().idSolicitudInconformidad);
        set({statusInconformidad: response});
      },
    }),
    { name: "data-inconformidad" },
  )
);
