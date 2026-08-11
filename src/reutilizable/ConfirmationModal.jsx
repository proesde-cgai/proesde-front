// src/components/ConfirmationModal.js
import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles/ConfirmationModal.module.css';


const ConfirmationModal = ({ type = 'success', message, isOpen, onClose, onConfirm  }) => {
  const backgroundColor = type === 'success' ? '#339900' : '#f2f2f2';
  const borderColor = type === 'success' ? '#c3e6cb' : '#f2f2f2';
  const textColor = type === 'success' ? '#FFFFFF' : '#000';

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={styles.modal}
        style={{
          backgroundColor,
          border: `1px solid ${borderColor}`,
          color: textColor,
          width: '400px',
        }}
      >
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            {type === 'success' ? 'Success' : 'Advertencia'}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>

        <div className={styles.content}>
          <p>{message}</p>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={onConfirm} className={styles.okButton}>
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
