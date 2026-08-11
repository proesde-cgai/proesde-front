import React from "react";
import styles from "../styles/ModalConfirmation.module.css";

const ModalConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Procesar registros</h2>
        <p className={styles.modalMessage}>¿Está seguro que desea guardar?</p>
        <div className={styles.modalButtons}>
          <button onClick={onCancel} className={styles.cancelButton}>
            No
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Sí
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmation;
