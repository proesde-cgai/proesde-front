import React, { useEffect, useState } from "react";
import styles from "../styles/ModalValidacionPlanTrabajo.module.css";

const ModalValidacionPlanTrabajo = ({
  isOpen,
  handleDownload,
  onClose,
  data,
  onSubmit,
  selectedMunicipio,
  generatePdf,
}) => {
  const [observaciones, setObservaciones] = useState(data.observaciones || "");
  const [estatus, setEstatus] = useState(data.estatus || "APROBADO");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (data) {
      setObservaciones(data.observaciones || "");
      setEstatus(data.estatus || "APROBADO");
    }
  }, [data]);

  useEffect(() => {
    // detectar ESC key para cancelar edición
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [data, onClose]);

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      e.preventDefault();
      const payload = {
        id: data.id,
        estatus,
        observaciones,
        municipio: selectedMunicipio,
      };
      const response = await onSubmit(payload);
      console.log(response);

      if (estatus === "APROBADO") {
        const response = await handleDownload(data.id);
        console.log("Response download", response);
        if (response) {
          generatePdf(response?.data);
        } 
      }
      onClose();
    } catch (error) {
      alert("Ocurrió un error al enviar la validación del plan de trabajo, error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <header className={styles.modalHeader}>
          <h3>Validación de Plan de Trabajo</h3>
        </header>
        <div className={styles.modalBody}>
          <div className={styles.solicitudContainer}>
            <form>
              <div className={styles.headerContainer}>
                <div className={styles.userInfoContainer}>
                  <div className={styles.column}>
                    <label className={styles.titleField}>Código de profesor</label>
                    <input className={styles.displayField} readOnly value={data.codigo || "No disponible"} />
                  </div>
                  <div className={styles.column}>
                    <label className={styles.titleField}>Nombre de docente</label>
                    <input
                      className={styles.displayField}
                      readOnly
                      value={data.nombreDocente || "No disponible"}
                    />{" "}
                  </div>

                  <div className={styles.column}>
                    <label className={styles.titleField}>No. Solicitud</label>
                    <input className={styles.displayField} readOnly value={data.noSolicitud || "No disponible"} />{" "}
                  </div>

                  <div className={styles.column}>
                    <label className={styles.titleField}>Año</label>
                    <input className={styles.displayField} readOnly value={data.cicloEscolar || "No disponible"} />{" "}
                  </div>
                </div>
              </div>

              <div className={styles.formFields}>
                <div className={styles.formColumn}>
                  <div className={styles.titleField}>
                    <span className={styles.labelTitle}>Docencia</span>
                    <br />
                    (materias, tutorías, intervenciones, prácticas, etc.)
                  </div>
                  <textarea className={styles.inputField} readOnly defaultValue={data.docencia || ""} />
                </div>

                <div className={styles.formColumn}>
                  <div className={styles.titleField}>
                    <span className={styles.labelTitle}>Generación y/o aplicación de conocimiento</span>
                    <br />
                    (investigación aplicada, asimilación, desarrollo y transferencia de tecnología)
                  </div>
                  <textarea className={styles.inputField} readOnly defaultValue={data.generacionConocimiento || ""} />
                </div>

                <div className={styles.formColumn}>
                  <div className={styles.titleField}>
                    <span className={styles.labelTitle}>Gestión Académica Individual o Colegiada</span>
                    <br />
                    (Participación en modelos educativos, comités, y actividades académico-administrativas)
                  </div>
                  <textarea className={styles.inputField} readOnly defaultValue={data.gestionAcademica || ""} />
                </div>

                <div className={styles.formColumn}>
                  <div className={styles.titleField}>
                    <span className={styles.labelTitle}>
                      Vinculación, Difusión y Extensión de la Ciencia y la Cultura
                    </span>
                    <br />
                    (Proyectos comunitarios, difusión cultural y preservación de la identidad)
                  </div>
                  <textarea className={styles.inputField} readOnly defaultValue={data.vinculacion || ""} />
                </div>
              </div>

              <div className={styles.section}>
                <label>Estado</label>
                <select value={estatus} onChange={(e) => setEstatus(e.target.value)} className={styles.select}>
                  <option value="APROBADO">Aprobado</option>
                  <option value="PENDIENTE_REVISION">Pendiente</option>
                  <option value="RECHAZADO">Rechazado</option>
                </select>
              </div>

              <div className={styles.section}>
                <label>Observaciones</label>
                <textarea
                  title="Maximo 500 caracteres"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Escribe tus observaciones aquí..."
                  className={styles.textarea}
                  maxLength={500}
                />
                <p style={{color: 'red'}}>{"*El campo observaciones es requerido"}</p>
              </div>

              <div className={styles.submit}>
                <button className={styles.cancelButton} type="button" onClick={onClose}>
                  Cancelar
                </button>
                <button
                  disabled={!observaciones || !selectedMunicipio || loading}
                  className={!observaciones || loading ? styles.disabled : styles.submitButton}
                  type="submit"
                  onClick={handleSubmit}
                >
                  Enviar
                </button>
                {!selectedMunicipio && <span className={styles.error}>Debes seleccionar un municipio</span>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalValidacionPlanTrabajo;
