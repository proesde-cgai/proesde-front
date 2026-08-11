import React from "react";
import styles from "../styles/ModalPDF.module.css"; 

const ModalPDF = ({ isOpen, content, onClose,  }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {content}
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPDF;
