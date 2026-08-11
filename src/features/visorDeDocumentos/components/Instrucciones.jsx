import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./instrucciones.module.css";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export const Instrucciones = () => {
  return (
    <>
      <div className={styles.container}>
        <section className={styles.textInstruccion}>
          <h4>
            <FontAwesomeIcon icon={faChevronRight} className={styles.icon} />{" "}
            Instrucciones testing
          </h4>
          <p>
            Este es el módulo donde usted visualizará los documentos del
            academico y sus datos personales, adicionalmente se podran adjuntar
            documentos digitalmente
          </p>
        </section>
      </div>
    </>
  );
};
