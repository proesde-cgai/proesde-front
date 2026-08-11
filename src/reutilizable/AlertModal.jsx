import React from "react";
import styles from "./styles/AlertModal.module.css";

/**
 * Modal Alert Component for displaying messages.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The alert message.
 * @param {'success' | 'error' | 'warning'} props.typeAlert - Type of alert for styling.
 * @param {boolean} props.isOpen - Determines if the modal is visible.
 * @param {function} props.onClose - Function to close the modal.
 *
 * @returns {JSX.Element | null} The Alert modal.
 */
const Alert = ({ children, typeAlert, isOpen, onClose }) => {
  if (!isOpen) return null; // Hide if isOpen is false

  const alertClass = styles[`alert-${typeAlert}`] || styles.alert;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${alertClass} ${styles.modal}`}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default Alert;
