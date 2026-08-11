import { useReducer } from 'react'
import { actualizarIntComContext } from './ActualizarIntComContext';
import { actualizarIntComReducer } from './actualizarIntComReducer';
import { TYPES_UPDATE_INTEGRANTES_COMISION } from './actualizarIntComTypes';

const initialContextState = {
  positions: [],
  members: [],
  statusResponse: {
    loading: false,
    error: false,
    message: "",
  },
  isOpenModal: false,
  commissions: null,
  selectedCommission: null
}

export const ActualizarIntProvider = ({ children }) => {
  const [state, dispatch] = useReducer(actualizarIntComReducer, initialContextState);
  const {
    ADD_MEMBER,
    OPEN_MODAL,
    SET_MEMBERS,
    SET_POSITIONS,
    SET_COMMISSIONS,
    SET_STATUS_RESPONSE,
    SET_SELECTED_COMMISSION
  } = TYPES_UPDATE_INTEGRANTES_COMISION

  // Response 
  const loadingResponse = () => {
    dispatch({
      type: SET_STATUS_RESPONSE,
      payload: {
        loading: true,
        error: false,
        message: ""
      }
    });
  }

  const successResponse = (message = 'Acción ejecutada correctamente') => {
    dispatch({
      type: SET_STATUS_RESPONSE,
      payload: {
        loading: false,
        error: false,
        message
      }
    });
  }

  const errorResponse = (message = 'Error al ejecutar la acción') => {
    dispatch({
      type: SET_STATUS_RESPONSE,
      payload: {
        loading: false,
        error: true,
        message
      }
    })
  }

  const resetResponse = () => {
    dispatch({
      type: SET_STATUS_RESPONSE,
      payload: {
        loading: false,
        error: false,
        message: ""
      }
    });
  }

  const toggleModal = () => {
    dispatch({
      type: OPEN_MODAL
    });
  }

  const addMember = (member) => {
    dispatch({
      type: ADD_MEMBER,
      payload: member
    });
  }

  const setMembers = (members) => {
    dispatch({
      type: SET_MEMBERS,
      payload: members
    });
  }

  const setPositions = (cargos) => {
    dispatch({
      type: SET_POSITIONS,
      payload: cargos
    });
  }

  const removeMember = (codigo) => {
    const newArray = state.members.map((item) => 
      item.codigo === codigo ? { ...item, activo: false } : item
    );

    dispatch({
      type: SET_MEMBERS,
      payload: newArray
    });
  }

  const setCommissions = (commissions) => {
    dispatch({
      type: SET_COMMISSIONS,
      payload: commissions
    });
  }

  const setSelectedComision = (commission) => {
    dispatch({
      type: SET_SELECTED_COMMISSION,
      payload: commission
    });
  }

  return <actualizarIntComContext.Provider value={{
    state,
    toggleModal,
    addMember,
    setMembers,
    setPositions,
    removeMember,
    setCommissions,
    successResponse,
    errorResponse,
    resetResponse,
    loadingResponse,
    setSelectedComision
  }} >
    {children}
  </actualizarIntComContext.Provider>

}