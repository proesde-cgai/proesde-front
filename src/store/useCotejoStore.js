import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCotejoStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      idSolicitud: 0,
      requisitos: [],
      rubros: [],
      selectedOptions: [],
      esCotejadoRequisitos: false,
      esCotejadoRubros: false,
      uploadRubro: false,

      // Función para actualizar "idSolicitud"
      setIDSolicitud: (id) => {
        console.log("ID Solicitud: ", id);
        set({ idSolicitud: id });
      },
      // Función para actualizar "requisitos"
      setRequisitosCotejo: (nuevosRequisitos) => {
        console.log("Requisitos: ", nuevosRequisitos);
        set({ requisitos: nuevosRequisitos });
      },

      // Función para actualizar esCotejado en "requisitos"
      setEsCotejadoRequisitos: (nuevoValor) => {
        console.log("EsCotejadoRequisitos: ", nuevoValor);
        set({ esCotejadoRequisitos: nuevoValor });
      },

      // Función para actualizar esCotejado en "requisitos"
      setEsCotejadoRubros: (nuevoValor) => {
        console.log("esCotejadoRubros: ", nuevoValor);
        set({ esCotejadoRubros: nuevoValor });
      },

      setUploadRubro: (nuevoValor) => {
        console.log("setUploadRubro: ", nuevoValor);
        set({ uploadRubro: nuevoValor });
      },

      // Función para actualizar "rubros"
      setRubrosCotejo: (nuevoRubro, checked) => {
        console.log("Nuevos rubros: ", nuevoRubro, checked);

        const { selectedOptions } = get();

        const updatedSelectedOptions = checked
          ? [...selectedOptions, nuevoRubro]
          : selectedOptions.filter((option) => option !== nuevoRubro);

        set({
          selectedOptions: updatedSelectedOptions,
          rubros: updatedSelectedOptions,
        });

        console.log("Opciones seleccionadas actualizadas: ", updatedSelectedOptions);
      },

      // Función para resetear todo el estado
      resetStore: () => {
        set({
          idSolicitud: 0,
          requisitos: [],
          rubros: [],
          selectedOptions: [],
          esCotejadoRequisitos: false,
          esCotejadoRubros: false,
          uploadRubro: false,
        });
      },
    }),
    { name: "cotejo-storage" }
  )
);

export default useCotejoStore;
