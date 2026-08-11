import styles from "../styles/Asignar.module.css";
import { useState, useEffect } from "react";
import Alert from "../../../../reutilizable/Alert";

export const Asignar = ({ hook }) => {
  const {
    academico,
    superPase,
    motivo,
    requisitosIds,
    isLocked,
    originalSuperPase,
    onChange,
    handleFormSubmit,
    setMotivo,
    loading,
  } = hook;

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    if (!formError) return;
    const t = setTimeout(() => setFormError(""), 3000);
    return () => clearTimeout(t);
  }, [formError]);

  useEffect(() => {
    if (!formSuccess) return;
    const t = setTimeout(() => setFormSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [formSuccess]);

  if (!academico) return null;

  return (
    <div className={styles.asignarContainer}>
      <h3 className={styles.title}>Asignar Super pase</h3>
      <div className={styles.formContainer}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setFormError("");
            setFormSuccess(false);
            const result = await handleFormSubmit();
            if (!result || result.success === false) {
              setFormError(
                result && result.message ? result.message : "Error al enviar"
              );
              return;
            }
            setFormSuccess(true);
          }}
        >
          <strong className={styles.textAlert}>
            Cambie el valor del "super pase" y después asegurese de oprimir el
            botón "Guardar".
          </strong>
          <div className={styles.datosPersonales}>
            <div>
              <span className={styles.subTiles}>Datos personales</span>
              <p className={styles.codigo}>
                {academico?.nombre} {academico?.apellidoPaterno}{" "}
                {academico?.apellidoMaterno} {academico?.codigo}
              </p>
            </div>
            <div style={{ padding: "0 0 0 50px" }}>
              <span className={styles.subTiles}>Super pase</span>
              <div className={styles.fechaInput}>
                <label>Tiene super pase:</label>
              </div>
            </div>
            <div className={styles.radioGroup}>
              <div className={styles.radioContainer}>
                <label>Sí</label>
                <input
                  type="radio"
                  name="superPase"
                  value="true"
                  checked={superPase}
                  onChange={onChange}
                />
              </div>
              <div className={styles.radioContainer}>
                <label>No</label>
                <input
                  type="radio"
                  name="superPase"
                  value="false"
                  checked={!superPase}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className={styles.subtitle}>Requisitos</h3>
            <div className={styles.requisitosContainer}>
              {Array.isArray(academico.requisitos)
                ? academico.requisitos.map((r) => (
                    <div className={styles.requisitoItem} key={r.id}>
                      <label htmlFor={`requisito_${r.id}`}>{r.nombre}</label>
                      <input
                        type="checkbox"
                        className="checkbox_green"
                        name={`requisito_${r.id}`}
                        checked={requisitosIds.includes(r.id)}
                        onChange={onChange}
                        disabled={isLocked || !superPase}
                        id={`requisito_${r.id}`}
                      />
                    </div>
                  ))
                : null}
            </div>
          </div>

          <div>
            <h3 className={styles.subtitle}>Motivo</h3>
            <div className={styles.textContainer}>
              <textarea
                name="motivo"
                value={motivo}
                onChange={onChange}
                className={styles.inputField}
                rows={5}
                maxLength={500}
                placeholder={
                  superPase
                    ? "Explique el motivo de activación."
                    : "(Solo es necesario si activa el super pase)."
                }
                disabled={isLocked || !superPase}
              />
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                {motivo ? motivo.length : 0}/500 caracteres
              </div>
            </div>
          </div>
          <strong className={styles.textAlert}>
            {originalSuperPase
              ? "Super pase activado"
              : "Super pase desactivado"}
          </strong>
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={styles.button}
              disabled={superPase === originalSuperPase || loading}
            >
              Guardar
            </button>
          </div>

          {formError && (
            <div>
              <Alert typeAlert="error">{formError}</Alert>
            </div>
          )}

          {formSuccess && (
            <div>
              <Alert typeAlert="success">Se ha guardado con éxito.</Alert>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
