import {
  faBan,
  faChevronRight,
  faSquarePen,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Instrucciones.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";

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
            Este es el módulo de cálculo automático para la asignación de
            niveles y salarios del sistema Proesde, según las normas definidas
            por el reglamento.
          </p>
          <p>
            Aquí se podrán verificar los datos de cada académico o realizar
            cambios antes de imprimir la publicación final. Para modificar los
            datos de un académico, haga clic en el botón{" "}
            <span className={styles.textInstruccionSpan}>
              <FontAwesomeIcon icon={faSquarePen} />
            </span>{" "}
            o doble clic sobre la fila correspondiente.
          </p>
          <p>
            Aparecerán entonces aquellos campos cuyo contenido se puede cambiar
            (<strong>horas, antigüedad, grado, directivo, baja</strong>),
            alterando con ello el orden de prelación. Además, habrá que escribir
            las razones de haber efectuado esos cambios. ("Baja" se refiere a
            dar de baja al académico por condiciones externas.)
          </p>
          <p>
            Si se escribe un valor nuevo para un campo, ambos (el nuevo y el
            anterior) se mantendrán para referencias posteriores.
          </p>
          <p>
            Al terminar, guarde los cambios presionando el botón{" "}
            <span className={styles.iconContainer}>
              <FontAwesomeIcon
                icon={faFloppyDisk}
                className={styles.customIcon}
              />
            </span>
            . También puede cancelar la edición presionando <kbd>Esc</kbd> o el
            botón{" "}
            <span className={styles.iconContainer}>
              <FontAwesomeIcon icon={faBan} className={styles.customIcon} />
            </span>
            .
          </p>

          <p>
            Pueden realizarse búsquedas específicas por nombre, apellido,
            código, tipo de participación u otros datos del académico. Si se
            desea hacer búsquedas por nivel (I-IX), habrá que especificarlo de
            la siguiente forma: <code>n=I</code>, <code>n=II</code>, etc.
          </p>
          <p>
            Para terminar, haga clic en "Generar PDF". El reporte PDF generado
            ya estará en el orden de prelación según los cambios que se hayan
            realizado.
          </p>
        </section>
      </div>
    </>
  );
};
