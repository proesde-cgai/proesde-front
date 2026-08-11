import { useEffect, useState } from "react";
import { getAccessToken } from "../../authService"; // Asumimos que tienes el servicio de autenticación separado

import {
  getFechasPublic,
} from "../service/bannerService";

const useFetchFecha = () => {
  const [fecha, setFecha] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const obtainFecha = async () => {
    setLoading(true);
    setError(null); 

    try {
      let data;

      try {
        const token = await getAccessToken(); // Authentication check.
        if (token) {
          return null; //usuario authenticado
        }
      } catch (authError) {
        console.log("Obtaining public fecha");
        data = await getFechasPublic();
      }
      console.log("Obtained data from public fecha", data);
      setFecha(data); 

    } catch (error) {
      console.log(error.message);
      setError("Error al obtener fecha de convocatoria");

    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    obtainFecha();
  }, []);

  return {
    fecha, loading, error,
  };
};

export default useFetchFecha;
