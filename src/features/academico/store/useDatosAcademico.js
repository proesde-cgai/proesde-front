import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDatosParticipante } from "../../visorDeDocumentos/services/datosParticipanteService";

export const useDatosAcademico = create((set, get) => ({
  datosAcademico: null,
  datosAcademicoFull: null,
  codigoActual: null, // Agregamos un estado para almacenar el código actual
  setDataAcademico: async (codigo) => {
    const codigoActual = get().codigoActual;

    // Verificamos si el código es el mismo que el almacenado
    if (codigo === codigoActual) {
      console.log("El código no ha cambiado, no se realiza la petición.");
      return;
    }

    try {
      const response = await getDatosParticipante(codigo);
      console.log("🚀 ~ setDataAcademico: ~ response:", response);
      const objDataAcademico = {
        idSolicitud: response.data.idSolicitud,
        codigo: response.data.codigo,
        nombre: response.data.nombre,
        apellidoPaterno: response.data.apellidoP,
        apellidoMaterno: response.data.apellidoM,
        tipoParitipacion: response.data.tipoParticipacionNombre,
        tipoParticipacionDescripcion: response.data.tipoParticipacionDescripcion,
      };
      console.log(objDataAcademico);
      set({
        datosAcademico: objDataAcademico,
        datosAcademicoFull: response.data,
        codigoActual: codigo, // Actualizamos el código actual
      });
    } catch (error) {
      console.log("Error al obtener los datos del participante: ", error);
    }
  },
  hasdatosAcademico: () => !!get().datosAcademico,
  resetDatosAcademico: () => {
    set({
      datosAcademico: null,
      datosAcademicoFull: null,
      codigoActual: null, // Reseteamos el código actual
    });
  },
  refreshDataAcademico: async (codigo) => {
    // Método para forzar la actualización de los datos del académico
    // Resetea el código actual para que se vuelva a hacer la petición
    const currentCodigo = codigo || get().codigoActual || localStorage.getItem('userName');
    if (!currentCodigo) {
      console.log("No hay código disponible para refrescar");
      return;
    }
    
    // Resetear el código actual para forzar la actualización
    set({ codigoActual: null });
    
    // Llamar a setDataAcademico para actualizar los datos
    await get().setDataAcademico(currentCodigo);
  },
}));
