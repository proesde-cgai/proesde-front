import { TYPES_UPDATE_INTEGRANTES_COMISION } from "./actualizarIntComTypes";

export const actualizarIntComReducer = (state, action) => {
  const {
    OPEN_MODAL,
    ADD_MEMBER,
    SET_MEMBERS,
    SET_POSITIONS,
    SET_COMMISSIONS,
    SET_STATUS_RESPONSE,
    SET_SELECTED_COMMISSION,
  } = TYPES_UPDATE_INTEGRANTES_COMISION;
  const { payload } = action;

  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        isOpenModal: !state.isOpenModal,
      };
    case ADD_MEMBER:
      return {
        ...state,
        members: [payload, ...state.members],
      };
    case SET_MEMBERS:
      return {
        ...state,
        members: payload,
      };
    case SET_POSITIONS:
      return {
        ...state,
        positions: payload,
      };

    case SET_COMMISSIONS:
      return {
        ...state,
        commissions: payload,
      };
    case SET_STATUS_RESPONSE:
      return {
        ...state,
        statusResponse: {
          ...state.statusResponse,
          ...payload,
        },
      };

    case SET_SELECTED_COMMISSION:
      return {
        ...state,
        selectedCommission: payload,
      };
    default:
      return state;
  }
};
