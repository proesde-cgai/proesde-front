import styles from "./visorDocumentos.module.css";
import useStoredFecha from "../../useStoredFecha";

export const SubirDocumento = () => {
  const fecha = useStoredFecha();
  const displayDate = fecha?.rangoFecha || "2024-2025"; 

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.title}>
        Programa de estímulos para el desempeño docente {displayDate}
      </h1>

      <p>
        Verá el documento palomeado si ya ha sido capturado, o tachado si no. Si
        el símbolo en <span className={styles.red}>Rojo</span>, el documento es{" "}
        <span className={styles.red}>obligatorio</span>
      </p>

      {[
        "A. Requisito de participación",
        "B1. Requisito de participación. Documentos requeridos en etapa de supervisión (1ra)",
        "B2. Requisito de participación. Documentos requeridos en etapa de supervisión (2da)",
        "B3. Requisito de participación. Documentos requeridos en etapa de supervisión (3ra)",
        "B4. Requisito de participación. Documentos requeridos en etapa de supervisión (4ta)",
        "C. Tabla de puntaje o dictamen de no participante debidamente firmado",
        "I. Recurso de inconformidad",
        "E. Dictamen resolutivo de recurso de inconformidad debidamente firmado",
        "D. Dictamen final de resultados debidamente firmado",
        "F. Dictamen final (Corrección) debidamente firmado",
      ].map((documento, index) => (
        <div key={index}>
          <div className={styles.check}>
            <div className={styles.textContainer}>
              <input type="checkbox" />
              <p>{documento}</p>
            </div>

            <div className={styles.buttonContainer}>
              <label
                htmlFor={`file-upload-${index}`}
                className={styles.labelFile}
              >
                Examinar
              </label>
              <input
                id={`file-upload-${index}`}
                className={styles.file}
                type="file"
                accept="application/pdf" 
              />
              <button className={styles.btn}>Guardar</button>
            </div>
          </div>

          <p className={styles.message}>
            El periodo para subir este documento ha iniciado
          </p>
          <hr />
        </div>
      ))}

      <h2>
        Para capturar los documentos de otro participante, selecciónelo de la
        lista
      </h2>

      <div className={styles.buttonCenter}>
        <button className={styles.btn}>Terminar sesión</button>
      </div>
    </div>
  );
};
