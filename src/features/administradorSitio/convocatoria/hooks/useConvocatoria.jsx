import { useState, useCallback } from "react";
import { getConvocatoriaActual, createConvocatoria, updateConvocatoria } from "../services/convocatoriaService";

const useConvocatoria = () => {
    const [convocatoria, setConvocatoria] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchConvocatoriaActual = useCallback(async () => {
        setIsLoading(true);
        const data = await getConvocatoriaActual();
        setConvocatoria(data);
        setIsLoading(false);
        return data;
    }, []);

    const createNewConvocatoria = useCallback(async (data) => {
        setIsLoading(true);
        const response = await createConvocatoria(data);
        setIsLoading(false);
        return response;
    }, []);

    const updateExistingConvocatoria = useCallback(async (id, data) => {
        setIsLoading(true);
        const response = await updateConvocatoria(id, data);
        setIsLoading(false);
        return response;
    }, []);

    return {
        convocatoria,
        isLoading,
        fetchConvocatoriaActual,
        createNewConvocatoria,
        updateExistingConvocatoria,
    };
};

export default useConvocatoria;
