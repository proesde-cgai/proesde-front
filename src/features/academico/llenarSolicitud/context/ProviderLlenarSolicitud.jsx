import { useReducer } from "react"
import { ContextLlenarSolicitud } from "./ContextLlenarSolicitud"
import { LlenarSolicitudReducer } from "./reducerLlenarSolicitud";

const initialContextState = {
    data: 'data'
}

export const ProviderLlenarSolicitud = ({ children }) => {
    const [state, dispatch] = useReducer(LlenarSolicitudReducer, initialContextState);



    return (
        <ContextLlenarSolicitud.Provider value={state}>
            {children}
        </ContextLlenarSolicitud.Provider>
    )
}