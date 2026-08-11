import React, { useState, useEffect } from "react";
import TablaConvocatoria from "./TablaConvocatoria";
import styles from "././../styles/Convocatoria.module.css";

const ConvocatoriaActividad = () => {
  const isActive = true;

  const [datosInconformidad, setDatosInconform] = useState([]);

  const exampleData = [
    {
      id: "97FQ2F80HAF2TWG09WU0WNB0A8G",
      tipoActividad: "1",
      nombreActividad: "Actividad principal 1",
      nombreCorto: 'Act principal',
      alias: 'Principal',
      fechaInicio: "11/07/2024",
      fechaFinal: "12/12/2024",
      actividad: [],
    },
    {
      id: "97FQ2F80HAF2TWG09WU0WNB0A8G",
      tipoActividad: "2",
      nombreActividad: "Actividad secundario",
      nombreCorto: 'Act secundario',
      alias: 'Secundario',
      fechaInicio: "28/01/2024",
      fechaFinal: "28/06/2024",
      actividad: [

      ],
    },
  ];

  return (
    <div className={styles.container}>
      <article>
        <header>
          <h3 className={styles.inconformidad_title}>
            Convocatoria 2024-2025
          </h3>
        </header>

        <div className={styles.btnContainer}>
          <button
            className={styles.btn}
          >
            Asociar Actividad
          </button>
        </div>

        <TablaConvocatoria currentItems={exampleData} />

      </article>
    </div>
  );
};

export default ConvocatoriaActividad;
