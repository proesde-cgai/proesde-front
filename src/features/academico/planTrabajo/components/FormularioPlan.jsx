import { useFormularioPlanTrabajo } from "../hooks/useFormularioPlanTrabajo";
import FormField from "./FormFields";
import styles from "./FormularioPlan.module.css";
import ShowButton from "./ShowButton";

/**
 * Componente FormularioPlan para mostrar el formulario de plan de trabajo.
 * @param {Object} props - Props del componente.
 * @param {Object} props.datosAcademico - Datos del academico.
 * @param {Function} props.handleChange - Funcion para manejar el cambio de los campos del formulario.
 * @param {Function} props.obtainPlanTrabajo - Funcion para obtener el plan de trabajo del academico.
 * @returns {JSX.Element} Formulario de plan de trabajo.
 */

const FormularioPlan = ({
  datosAcademico,
  handleChange,
  obtainPlanTrabajo,
  initialError,
}) => {
  const {
    onSubmit,
    styleByStatus,
    textByStatus,
    validStatus,
    statusResponse,
    downloadPDF,
  } = useFormularioPlanTrabajo({ datosAcademico, obtainPlanTrabajo, styles, initialError });

  return (
    <div className={styles.solicitudContainer}>
      <form onSubmit={onSubmit}>
        <div className={styles.headerContainer}>
          {/* information teacher */}
          <div className={styles.userInfoContainer}>
            <div className={styles.column}>
              <label className={styles.titleField}>Código de profesor</label>
              <input
                className={styles.displayField}
                readOnly
                value={datosAcademico.code}
              />
            </div>
            <div className={styles.column}>
              <label className={styles.titleField}>Nombre de docente</label>
              <input
                className={styles.displayField}
                readOnly
                value={datosAcademico.teacherName}
              />
            </div>
            {console.log("nombre docente ", datosAcademico.teacherName)}

            <div className={styles.column}>
              <label className={styles.titleField}>No. Solicitud</label>
              <input
                className={styles.displayField}
                readOnly
                value={datosAcademico.requestID}
              />
            </div>

            <div className={styles.column}>
              <label className={styles.titleField}>Año</label>
              <input
                className={styles.displayField}
                readOnly
                value={datosAcademico.schoolCycle}
              />
            </div>
          </div>

          {/* Status and observations */}
          <div className={styleByStatus()}>
            <p>{textByStatus()}</p>
          </div>
          <div className={styles.observacionContainer}>
            <p className={styles.textObservacion}>
              {datosAcademico.observations}
            </p>
          </div>

          {/* information request */}
          <FormField
            styles={styles}
            datosAcademico={datosAcademico}
            handleChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div className={styles.submit}>
          {statusResponse.message && (
            <p
              className={
                statusResponse.status
                  ? styles.textStatusResponseSuccess
                  : styles.textStatusResponseFailed
              }
            >
              {statusResponse.message}
            </p>
          )}

          <ShowButton
            validStatus={validStatus}
            downloadPDF={downloadPDF}
            statusResponse={statusResponse}
            styles={styles}
            active={initialError}
          />
        </div>
      </form>
    </div>
  );
};

export default FormularioPlan;
