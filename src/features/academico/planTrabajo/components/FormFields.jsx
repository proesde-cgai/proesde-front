import InputField from "./InputField";
import { ESTATUS } from "../models";

/**
 * Componente FormFields para mostrar los campos del formulario.
 * @param {Object} props - Props del componente.
 * @param {Object} props.styles - Estilos del componente.
 * @param {Object} props.datosAcademico - Datos del académico.
 * @param {Function} props.handleChange - Función para manejar el cambio de los campos del formulario.
 * @returns {JSX.Element} Campos del formulario.
 */

const FormFields = ({ styles, datosAcademico, handleChange }) => {
  const validStatus = (status) => {
    if (datosAcademico.status === "") {
      return false;
    }

    return datosAcademico.status !== status;
  };

  return (
    <div className={styles.formFields}>
      <div className={styles.formColumn}>
        <div className={styles.titleField}>
          <span className={styles.labelTitle}>Docencia</span>
          <br />
          (materias, tutorías, intervenciones, prácticas, etc.)
        </div>
        <textarea
          title={!validStatus(ESTATUS.RECHAZADO) ? "Maximo 3927 caracteres" : ''}
          id="docencia"
          className={styles.inputField}
          disabled={validStatus(ESTATUS.RECHAZADO)}
          value={datosAcademico.teaching}
          onChange={handleChange}
          name={"teaching"}
          type="text"
          maxLength={3927}
        />
      </div>

      <div className={styles.formColumn}>
        <div className={styles.titleField}>
          <span className={styles.labelTitle}>
            Generación y/o aplicación de conocimiento
          </span>
          <br />
          (investigación aplicada, asimilación, desarrollo y transferencia de
          tecnología)
        </div>

        <textarea
          title={!validStatus(ESTATUS.RECHAZADO) ? "Maximo 3927 caracteres" : ''}
          id="conocimiento"
          className={styles.inputField}
          disabled={validStatus(ESTATUS.RECHAZADO)}
          value={datosAcademico.generation}
          name={"generation"}
          onChange={handleChange}
          maxLength={3927}
        />
      </div>

      <div className={styles.formColumn}>
        <div className={styles.titleField}>
          <span className={styles.labelTitle}>
            Gestión académica individual o colegiada
          </span>
          <br />
          (Participación en la definición de los modelos e instrumentos de
          enseñanza-aprendizaje o en la línea de investigación adecuada.
          Participación en comités de evaluación académica, comisiones,
          organización de eventos académicos, realización de actividades
          académico-administrativas, etc.)
        </div>

        <textarea
          title={!validStatus(ESTATUS.RECHAZADO) ? "Maximo 3927 caracteres" : ''}
          id="gestionAcademica"
          className={styles.inputField}
          disabled={validStatus(ESTATUS.RECHAZADO)}
          onChange={handleChange}
          value={datosAcademico.academicManagement}
          name={"academicManagement"}
          maxLength={3927}
        />
      </div>

      <div className={styles.formColumn}>
        <div className={styles.titleField}>
          <span className={styles.labelTitle}>
            Vinculación, difusión y extensión de la ciencia y la cultura
          </span>
          <br />
          (programas o proyectos de servicio a la comunidad a través de la
          difusión de la ciencia y de la cultura, preservación de la identidad y
          vinculación con el entorno social)
        </div>
        <textarea
          title={!validStatus(ESTATUS.RECHAZADO) ? "Maximo 3927 caracteres" : ''}
          id="actividades"
          className={styles.inputField}
          value={datosAcademico.linkage}
          disabled={validStatus(ESTATUS.RECHAZADO)}
          onChange={handleChange}
          name={"linkage"}
          maxLength={3927}
        />
      </div>
    </div>
  );
};
export default FormFields;
