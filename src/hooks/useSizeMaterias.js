import { useState, useEffect } from 'react';
import { obtenerSizeList } from "../features/materiasService";

const useSizeMaterias = () => {
  const [sizeListMaterias, setSizeListMaterias] = useState();

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const data = await obtenerSizeList();
        setSizeListMaterias(data);
      } catch (error) {
        console.error("Error al obtener tamaño de lista:", error);
      }
    };
    fetchMunicipios();
  }, []);

  return { sizeListMaterias };
};

export default useSizeMaterias;