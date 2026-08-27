import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faFileLines,
  faCheckCircle,
  faClock,
  faArrowLeft,
  faTimes,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import styles from "./RatificacionModal.module.css";

/**
 * Modal minimalista e imparcial para Ratificación de Nivel vs Convocatoria Actual.
 * Ambas opciones cuentan con un diseño, badges y colores 100% idénticos.
 */
export const RatificacionModal = ({
  isOpen,
  onClose,
  onRatifyConfirm,
  onParticipateConfirm,
  nivelActual = "Nivel VII",
  subprograma = "Subprograma I - Docencia y Educación Pública",
}) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleSelectRatification = () => {
    setStep(2);
  };

  const handleSelectParticipate = () => {
    if (onParticipateConfirm) {
      onParticipateConfirm();
    }
    onClose();
  };

  const handleConfirmRatification = () => {
    setStep(3);
    if (onRatifyConfirm) {
      onRatifyConfirm(nivelActual);
    }
  };

  const handleBackToChoice = () => {
    setStep(1);
  };

  const handleFinishStep = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.headerTitle}>Convocatoria & Ratificación PROESDE</h3>
          <button onClick={onClose} className={styles.closeBtn} title="Cerrar">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* PASO 1: ELECCIÓN NEUTRA E IDÉNTICA */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <div className={styles.introText}>
                <p>
                  Estimado(a) docente, seleccione la opción correspondiente para su participación en el proceso PROESDE:
                </p>
              </div>

              <div className={styles.cardsContainer}>
                {/* Opción 1: Ratificar nivel */}
                <div className={styles.optionCard} onClick={handleSelectRatification}>
                  <div className={styles.cardHeader}>
                    <FontAwesomeIcon icon={faAward} className={styles.cardIcon} />
                    <h5 className={styles.cardTitle}>Ratificar mi nivel actual</h5>
                  </div>
                  <p className={styles.cardDescription}>
                    Conserva tu nivel asignado sin necesidad de someter un nuevo expediente a evaluación.
                  </p>

                  <div className={styles.badgeContainer}>
                    <FontAwesomeIcon icon={faAward} className={styles.badgeIcon} />
                    <div className={styles.badgeText}>
                      <span className={styles.badgeLabel}>Nivel Registrado</span>
                      <span className={styles.badgeValue}>{nivelActual}</span>
                    </div>
                  </div>

                  <button type="button" className={styles.cardSelectBtn}>
                    Ratificar nivel
                  </button>
                </div>

                {/* Opción 2: Participar en Convocatoria */}
                <div className={styles.optionCard} onClick={handleSelectParticipate}>
                  <div className={styles.cardHeader}>
                    <FontAwesomeIcon icon={faFileLines} className={styles.cardIcon} />
                    <h5 className={styles.cardTitle}>Participar en la convocatoria actual</h5>
                  </div>
                  <p className={styles.cardDescription}>
                    Ingresa un nuevo expediente completo para participar en el proceso de evaluación de la convocatoria vigente.
                  </p>
                  
                  <div className={styles.badgeContainer}>
                    <FontAwesomeIcon icon={faFileLines} className={styles.badgeIcon} />
                    <div className={styles.badgeText}>
                      <span className={styles.badgeLabel}>Proceso Activo</span>
                      <span className={styles.badgeValue}>Convocatoria Vigente</span>
                    </div>
                  </div>

                  <button type="button" className={styles.cardSelectBtn}>
                    Participar en convocatoria
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: RESUMEN Y CONFIRMACIÓN */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <h4 className={styles.sectionTitle}>Confirmación de Ratificación</h4>
              
              <div className={styles.summaryTable}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Nivel a ratificar:</span>
                  <div className={styles.badgeContainerCompact}>
                    <FontAwesomeIcon icon={faAward} className={styles.badgeIconSmall} />
                    <span className={styles.badgeValueCompact}>{nivelActual}</span>
                  </div>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subprograma:</span>
                  <span className={styles.summaryValue}>{subprograma}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Estado posterior:</span>
                  <span className={styles.statusPillWarning}>
                    <FontAwesomeIcon icon={faClock} /> En evaluación
                  </span>
                </div>
              </div>

              <div className={styles.infoNote}>
                <FontAwesomeIcon icon={faInfoCircle} className={styles.infoNoteIcon} />
                <span>
                  Al registrar tu ratificación, tu solicitud pasará al estado de <strong>"En evaluación"</strong>.
                </span>
              </div>

              <div className={styles.actionsRow}>
                <button type="button" className={styles.btnSecondary} onClick={handleBackToChoice}>
                  <FontAwesomeIcon icon={faArrowLeft} /> Regresar
                </button>
                <button type="button" className={styles.btnPrimary} onClick={handleConfirmRatification}>
                  <FontAwesomeIcon icon={faCheckCircle} /> Confirmar Ratificación
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: REGISTRO REALIZADO - EN EVALUACIÓN */}
          {step === 3 && (
            <div className={styles.stepContentCenter}>
              <FontAwesomeIcon icon={faCheckCircle} className={styles.successIcon} />
              <h4 className={styles.successTitle}>Solicitud Registrada</h4>

              <div className={styles.badgeContainer}>
                <FontAwesomeIcon icon={faAward} className={styles.badgeIcon} />
                <div className={styles.badgeText}>
                  <span className={styles.badgeLabel}>NIVEL RATIFICADO</span>
                  <span className={styles.badgeValue}>{nivelActual}</span>
                </div>
              </div>

              <div className={styles.statusBadgeLarge}>
                Estatus: <strong>EN EVALUACIÓN</strong>
              </div>

              <p className={styles.successText}>
                Tu solicitud para ratificar tu nivel ha sido registrada exitosamente y se encuentra en proceso de evaluación.
              </p>

              <button type="button" className={styles.btnPrimary} onClick={handleFinishStep}>
                Aceptar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
