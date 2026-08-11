import {
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Instrucciones.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Instrucciones = () => {
  return (
    <>
      <div className={styles.container}>
        <section className={styles.textInstruccion}>
          <h4>
            <FontAwesomeIcon icon={faChevronRight} className={styles.icon} />{" "}
            Instrucciones
          </h4>
          <p>
            Este es el módulo donde usted llenara su solicitud, asegurese de 
            enviar todos los campos correctamente antes de presionar el boton enviar
          </p>
          <p>
            Para limpiar el formulario presione el boton "Cancelar".
          </p>
   
        </section>
      </div>
    </>
  );
};
