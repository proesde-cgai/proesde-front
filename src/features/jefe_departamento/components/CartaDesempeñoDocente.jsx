import React, { useState, useEffect, useCallback } from "react";
import { obtenerMaterias, obtenerSizeList } from "../../materiasService";

import TablaMaterias from "./TablaMaterias";
import styles from "./CartaDesempeñoDocente.module.css";

const CartaDesempeñoDocente = ({userInfo}) => {
  const [materias, setMaterias] = useState([]);
  const [loading, setIsLoading] = useState();
  const [sizeListProfesor, setSizeListProfesor] = useState(0);
  
  const fetchTotalSize = useCallback(async () => {
    try {
      setIsLoading(true);
      const size = await obtenerSizeList();
      setSizeListProfesor(size);
    } catch (error) {
      console.error("Error fetching total size:", error);
      setSizeListProfesor(0); // Default to 0 if there is an error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTotalSize(); // invocar función
  }, [fetchTotalSize]);

  const totalProfesor = sizeListProfesor;
  return (
    <div>
      <article>
        <header>
          <h3 className={styles.constancia_title}>
          Generar cartas de desempeño docente
          </h3>
        </header>
        
        <TablaMaterias
          userInfo={userInfo}
          totalProfesor={totalProfesor}
          materias={materias}
          setMaterias={setMaterias}
          onGenerarPDF={(materia) => console.log("Generar PDF", materia)}
          onDescargarPDF={(materia) => console.log("Descargar PDF", materia)}
          onEliminar={(index) =>
            setMaterias(materias.filter((_, i) => i !== index))
          } 
        />

      </article>
    </div>
  );
};

export default CartaDesempeñoDocente;
