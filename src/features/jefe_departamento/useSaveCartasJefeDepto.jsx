import React, { useState } from "react";
import { saveCumplimientoPt } from "./jefeDeptoService";

function useSaveCartasJefeDepto() {
  const [response, setResponse] = useState({
    loading: false,
    error: false,
    data: null,
  });

  const saveCartaDesempenoDocente = async (item) => {
    try {
      const payload = {
        idQr: item.idQr,
        noOficio: item.noOficio,
        calificacion: item.calificacion,
        ubicacion: item.ubicacion,
      };
      const result = await saveCumplimientoPt(payload);
      setResponse({ loading: false, error: false, data: result });
    } catch (error) {
      console.error("Error saving carga horaria:", error);
      setResponse({ loading: false, error: true, data: null });
    }
  };

  return { saveCartaDesempenoDocente, response };
}

export default useSaveCartasJefeDepto;
