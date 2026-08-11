import { useCallback, useState } from "react";
import { altaOficio,consultaOficio,actualizarOficio,eliminarOficio } from "../services/generateOficios";

const useGenerateOficios = () => {
    const [isLoading, setIsLoading] = useState(false);



    const fetchAltaOficio = useCallback(async (payload) => {
        try {
            setIsLoading(true);

            const response = await altaOficio(payload);

            return response;
        } catch (error) {
            console.error("Error alta oficio:", error);
            return error;
        } finally {
            setIsLoading(false);
        }
    }, []);
    const fetchEliminarOficio = useCallback(async (payload) => {
        try {
            setIsLoading(true);

            const response = await eliminarOficio(payload);

            return response;
        } catch (error) {
            console.error("Error eliminar oficio:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    const fetchActualizarOficio = useCallback(async (payload) => {
        try {
            setIsLoading(true);

            const response = await actualizarOficio(payload);

            return response;
        } catch (error) {
            console.error("Error actualizar oficio:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchConsultaOficio = useCallback(async (idQr) => {
        try {
            setIsLoading(true);

            const response = await consultaOficio(idQr);

            return response;
        } catch (error) {
            console.error("Error consulta oficio:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { fetchAltaOficio,fetchConsultaOficio,fetchActualizarOficio, fetchEliminarOficio,isLoading };
};

export default useGenerateOficios;
