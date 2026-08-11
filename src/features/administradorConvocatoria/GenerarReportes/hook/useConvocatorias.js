import { useState, useEffect } from "react";
import { obtenerConvocatorias } from "../services/obtenerConvocatorias";

const useConvocatorias = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConvocatorias = async () => {
      try {
        setLoading(true);
        const data = await obtenerConvocatorias(); // Fetch data 
        setConvocatorias(data); 
      } catch (err) {
        console.error("Error fetching convocatorias:", err);
        setError("No se pudo cargar la lista de convocatorias.");
      } finally {
        setLoading(false);
      }
    };

    fetchConvocatorias();
  }, []);

  return { convocatorias, loading, error };
};

export default useConvocatorias;
