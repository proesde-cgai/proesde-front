import React from 'react';
import styles from "../styles/Modal.module.css";

const Modal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Proceso Exitoso</h2>
        <p>{message}</p>
        <button 
        className={styles.btn}
        onClick={(e) => {
          e.preventDefault(); 
          onClose();
        }}>Aceptar</button>
      </div>
    </div>
    );
};

export default Modal;