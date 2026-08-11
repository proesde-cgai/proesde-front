import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ERROR_MESSAGES_GENERICS_API } from '../../../../utils/messagesFromAPI';
import { obtenerModalidadesEvaluacion, setTipoDeParticipacion } from '../services/modalidadEvaluacionService';

/** 
 * @typedef {Object} ModalidadEvaluacion - Estado de la modalidad por la cual desea participar un academico
 * @property {string} modalidadEvaluacion - Tipo de evaluacion que seleccionara el academico
 * 
 * Tipos permitidos para `modalidad`.
 * @typedef {'[Art 29]-Evaluacion' | '[Art 26]-PRODEP'} ModalidadEvaluacionType
*/

/**
 * Estado global para manejar la modalidad de evaluación.
 * 
 * @typedef {Object} ModalidadEvaluacionState
 * @property {ModalidadEvaluacionType | null} modalidadEvaluacion - La modalidad actual de evaluación.
 * @property {function(ModalidadEvaluacionType): void} setModalidad - Establece la modalidad de evaluación.
 * @property {function(): void} clearModalidadEvaluacion - Limpia la modalidad de evaluación.
 */

/**
 * Hook para acceder al estado global de la modalidad de evaluacion
 * 
 * @returns {ModalidadEvaluacion} - Estado y acciones de la modalidad de evaluacion
 */

export const useModalidadEvaluacion = create(
  persist(
    (set) => ({
      modalidadesEvaluacion: null,
      modalidadEvaluacion: null,

      responseMessageOk: null,
      responseMessageEror: null,

      getModalidadesEvaluacion: async () => {
        obtenerModalidadesEvaluacion()
          .then(response => {
            set({ modalidadesEvaluacion: response })
            return response;
          })
          .catch(error => console.error('Error al obtener las modalidades de evaluación', error));
      },

      /** Funcion para establecer el tipo de modalidad por la cual desea participar
       * @param {Number} idSolicitud - idSolicitud del academico
       * @param {Number} idTipoParticipacion - Tipo de participacion por la cual participara 1 = Evaluacion Art.29; 2 = PRODEP Art.26
       * */ 
      setTipoParticipacion: async (idTipoParticipacion) => {
        setTipoDeParticipacion(idTipoParticipacion)
          .then(response => {
            //console.log(response.status);
            if (response.status === 200) {
              set({ responseMessageOk: 'El tipo de participación se ha establecido correctamente' })
            }
          })
          .catch(error => {
            if (error.response) {
              const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
              set({ responseMessageEror: message });
            }
            console.error('Error al establecer el tipo de participación', error)
          });
      },

    }),
    { name: 'modalidad-evaluacion' }, // Opcional: nombre para almacenar el objeto en localStorage
  )
);
