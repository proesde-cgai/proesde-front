import React from "react";
import styles from "./styles/ConfirmationModal.module.css";
import Loading from "../../../reutilizable/Loading";

function ConfirmationModal({ isOpen, onClose, onConfirm, message, loading }) {
  if (!isOpen) return null; // No renderiza el modal si no está abierto

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>CONFIRMAR ENVIO DE NOTIFICACIÓN</h2>
        <div className={styles.warning}>
          <p>{message}</p>
          <p>Esta acción es irreversible.</p>
        </div>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Loading />
            <p>Generando publicación final, por favor espere...</p>
          </div>
        ) : (
          <div className={styles.buttons}>
            <button className={styles.sendButton} onClick={onConfirm}>
              Aceptar
            </button>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfirmationModal;
