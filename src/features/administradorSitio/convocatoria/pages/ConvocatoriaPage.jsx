import React, { useState, useEffect } from "react";
import GenerateConvocatoria from "../components/GenerateConvocatoria";
import styles from "./styles/Convocatoria.module.css";
import useConvocatoria from "../hooks/useConvocatoria";

const ConvocatoriaPage = () => {
  const {
    convocatoria,
    fetchConvocatoriaActual,
    isLoading,
  } = useConvocatoria();

  const [localConvocatoria, setLocalConvocatoria] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchConvocatoriaActual();
        setLocalConvocatoria(data);
      } catch (error) {
        console.error("Error fetching convocatoria:", error);
      }
    };

    if (!convocatoria) {
      fetchData();
    } else {
      setLocalConvocatoria(convocatoria);
    }
  }, [fetchConvocatoriaActual, convocatoria]);

  const isActive = !!localConvocatoria;

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <article>
        <header>
          <h3 className={styles.inconformidad_title}>
            Generar convocatoria
          </h3>
        </header>

        <div className={styles.header}>
          <h4 className={styles.subTitle}>Datos Convocatoria</h4>
        </div>

        <GenerateConvocatoria convocatoria={localConvocatoria} />
      </article>
    </div>
  );
};

export default ConvocatoriaPage;
