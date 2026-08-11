import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { setTipoDeParticipacion } from "../services/modalidadEvaluacionService";
import { ERROR_MESSAGES_GENERICS_API } from "../../../../utils/messagesFromAPI";
import styles from "./styles/ContentModalSeleccionarModalidad.module.css";

const ContentModalSeleccionarModalidad = ({ onClose, setStatus, idTipoParticipacion, descripcion }) => {
  const [mensaje, setMensaje] = useState({
    type: null,
    mensaje: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determinar si es Evaluación basándose en la descripción
  const esEvaluacion = descripcion && (
    descripcion.toLowerCase().includes('evaluación') || 
    descripcion.toLowerCase().includes('evaluacion')
  );

  const handleSetTipoParticipacion = async () => {
    if (!idTipoParticipacion) {
      setMensaje({
        type: "error",
        mensaje: "Error: No se pudo determinar el tipo de participación",
      });
      return false;
    }

    if (isSubmitting) return false;

    setIsSubmitting(true);

    try {
      const response = await setTipoDeParticipacion(idTipoParticipacion);
      if (response.status === 200) {
        setMensaje({
          type: "success",
          mensaje: "El tipo de participación se ha establecido correctamente",
        });
        setStatus(1);
        return true;
      }
      return false;
    } catch (error) {
      if (error.response) {
        const message =
          ERROR_MESSAGES_GENERICS_API[error.response.status] ||
          ERROR_MESSAGES_GENERICS_API.default;
        setMensaje({
          type: "error",
          mensaje: message,
        });
      }
      console.error("Error al establecer el tipo de participación", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faWarning} color="red" size="7x" />
      {esEvaluacion ? (
        <p className={styles.textoAdvertencia}>
          ¿Desea continuar con la participación por Artículo 29 (Evaluación)?
        </p>
      ) : (
        <p className={styles.textoAdvertencia}>
          Si selecciona la modalidad por Art. 26, recuerde <span className={styles.br}></span>
          que el beneficio que obtenga estará <span className={styles.br}></span>
          condicionando a mantener la vigencia del <span className={styles.br}></span>
          reconocimiento de su perfil deseable PRODEP.
        </p>
      )}

      <div className={styles.containerButtons}>
        <button
          className={styles.buttonAceptar}
          type="button"
          disabled={isSubmitting}
          onClick={async () => {
            const ok = await handleSetTipoParticipacion();
            if (ok) {
              onClose();
            }
          }}
        >
          Continuar
        </button>

        <button
          className={styles.cancelarButton}
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ContentModalSeleccionarModalidad;
