import { useState, useEffect } from "react";

const useStoredFecha = () => {
  const [fecha, setFecha] = useState(null);

  useEffect(() => {
    const storedFecha = JSON.parse(localStorage.getItem("fecha"));
    setFecha(storedFecha);
  }, []);

  return fecha;
};

export default useStoredFecha;
