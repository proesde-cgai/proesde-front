import { useState, useEffect } from "react";
import { getRequisitos } from "../services/requisitosService";

export const useRequisitos = (paramsIniciales = null) => {
  const [params, setParams] = useState(paramsIniciales); // {idSolicitud, aliasActividad}
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (customParams = params) => {
    if (!customParams) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getRequisitos(customParams);
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params) fetchData(params);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setParams, 
  };
};
