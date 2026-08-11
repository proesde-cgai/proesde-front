import { useEffect, useState } from "react";
import { getStatusParticipacion } from "../services/participacionService";

export const useParticipante = (codigo) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!codigo) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getStatusParticipacion(codigo);
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [codigo]);

  return {
    data,
    loading,
    error,
  };
};
