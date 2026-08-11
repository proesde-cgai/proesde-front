import { INCUMPLIMIENTO_TYPES } from "./incumplimientoTypes";

export const IncumplimientoReducer = (state, action) => {
    const {
        SET_ACADEMIC,
        SET_RESPONSE,
        MODAL,
        ADD_BREACH,
        SET_BREACHES,
        ADD_BREACH_TO_DELETE,
        SET_CONDITIONS,
        UPDATE_BREACH,
        DELETE_BREACH_TO_DELETE,
        SET_BREACHES_TO_DELETE,
        SET_BREACHES_TO_UPDATE
    } = INCUMPLIMIENTO_TYPES;
    const { payload } = action;

    switch (action.type) {
        case SET_ACADEMIC:
            return {
                ...state,
                academic: payload
            }
        case SET_RESPONSE:
            return {
                ...state,
                serviceResponse: payload
            }
        case MODAL:
            return {
                ...state,
                modal: payload
            }
        case ADD_BREACH:
            return {
                ...state,
                breaches: [...state.breaches, payload]
            }
        case SET_BREACHES:
            return {
                ...state,
                breaches: payload
            }
        case ADD_BREACH_TO_DELETE:
            return {
                ...state,
                breachesToDelete: [...state.breachesToDelete, payload]
            }
        case SET_CONDITIONS:
            return {
                ...state,
                conditions: payload
            }
        case UPDATE_BREACH:
            const data = state.breaches.map(breach => {
                if (breach.id === payload.breach.id) {
                    return {
                        ...breach,
                        idCondition: payload.idCondition
                    }
                }
                return breach
            })

            return {
                ...state,
                breaches: data
            }
        case DELETE_BREACH_TO_DELETE:
            return {
                ...state,
                breachesToDelete: state.breachesToDelete.filter(breach => breach.id !== payload.id)
            }
        case SET_BREACHES_TO_DELETE:
            return {
                ...state,
                breachesToDelete: payload
            }
        case SET_BREACHES_TO_UPDATE:
            return {
                ...state,
                breachesToUpdate: payload
            }
        default:
            return state;
    }
}