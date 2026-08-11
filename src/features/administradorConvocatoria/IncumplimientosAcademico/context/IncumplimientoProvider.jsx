import { useReducer } from "react"
import { initialContextState } from "../data"
import { IncumplimientoContext } from "./IncumplimientoContext"
import { IncumplimientoReducer } from "./incumplimientoReducer"
import { INCUMPLIMIENTO_TYPES } from "./incumplimientoTypes"

export const IncumplimientoProvider = ({ children }) => {
    const [state, dispatch] = useReducer(IncumplimientoReducer, initialContextState);

    const {
        MODAL,
        SET_ACADEMIC,
        SET_RESPONSE,
        SET_BREACHES,
        ADD_BREACH_TO_DELETE,
        SET_CONDITIONS,
        UPDATE_BREACH,
        DELETE_BREACH_TO_DELETE,
        SET_BREACHES_TO_DELETE,
        SET_BREACHES_TO_UPDATE
    } = INCUMPLIMIENTO_TYPES;

    const setAcademic = (academic) => {
        dispatch({
            type: SET_ACADEMIC,
            payload: academic
        })
    }

    const setConditions = (conditions) => {
        dispatch({
            type: SET_CONDITIONS,
            payload: conditions
        })
    }

    const setResponse = (response) => {
        dispatch({
            type: SET_RESPONSE,
            payload: { ...response }
        })
    }

    const toggleModal = (actionModal = '') => {
        dispatch({
            type: MODAL,
            payload: {
                isOpen: !state.modal.isOpen,
                action: actionModal
            }
        })
    }

    const updateBreach = (breach, idCondition) => {
        const body = { breach, idCondition }

        dispatch({
            type: UPDATE_BREACH,
            payload: body
        })
    }

    const setBreachesUpdate = () => {
        dispatch({
            type: SET_BREACHES_TO_UPDATE,
            payload: []
        })
    }

    const setBreaches = (breaches) => {
        dispatch({
            type: SET_BREACHES,
            payload: breaches
        })
    }

    const resetBreaches = () => {
        dispatch({
            type: SET_BREACHES,
            payload: [],
        });
        dispatch({
            type: SET_BREACHES_TO_UPDATE,
            payload: [],
        });
    };

    const addBreachToDelete = (breach) => {
        dispatch({
            type: ADD_BREACH_TO_DELETE,
            payload: breach
        })
    }

    const deleteBreachToDelete = (breach) => {
        dispatch({
            type: DELETE_BREACH_TO_DELETE,
            payload: breach
        })
    }

    const setBreachesToDelete = (breaches) => {
        dispatch({
            type: SET_BREACHES_TO_DELETE,
            payload: breaches
        })
    }

    const addBreachesToUpdate = (breach, newValue) => {
        if (breach.new) {
            return
        }

        const breachExists = state.breachesToUpdate.some(item => item.id === breach.id);

        const updatedBreaches = breachExists
            ? state.breachesToUpdate.map(item =>
                item.id === breach.id
                    ? { ...item, idCondition: newValue }
                    : item
            )
            : [
                ...state.breachesToUpdate,
                {
                    id: breach.id,
                    initialValue: breach.idCondition,
                    idCondition: newValue,
                },
            ];

        dispatch({
            type: SET_BREACHES_TO_UPDATE,
            payload: updatedBreaches,
        });
    };

    return <IncumplimientoContext.Provider value={{
        data: state,
        setAcademic,
        setResponse,
        updateBreach,
        setBreaches,
        addBreachToDelete,
        toggleModal,
        setConditions,
        deleteBreachToDelete,
        setBreachesToDelete,
        addBreachesToUpdate,
        resetBreaches,
        setBreachesUpdate 
    }}>
        {children}
    </IncumplimientoContext.Provider >

}