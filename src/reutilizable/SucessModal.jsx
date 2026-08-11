import React, { useState } from 'react';
import styles from "./styles/SucessModal.module.css"
const SuccessModal = ({ isOpen, onClose, message }) => {
    console.log("Modal isOpen:", isOpen); 
    if (!isOpen) return null; 
  
    return (
        <div className={`${styles.modal} ${isOpen ? styles.show : ""}`}>
        <div className={styles.modalContent}>
          <span className={styles.close} onClick={onClose}>&times;</span>
          <h2 className={styles.title}>¡Exitoso!</h2>
          <p>{message}</p>
        </div>
      </div>
    );
  };

export default SuccessModal;
