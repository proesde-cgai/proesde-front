import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles/GlobalAlert.module.css";

const GlobalAlert = ({ message, typeAlert = "warning", autoHideMs = 5000 }) => {
  const [isVisible, setIsVisible] = useState(Boolean(message));

  const timeoutRef = useRef(null);
  const expireAtRef = useRef(0);
  const remainingMsRef = useRef(autoHideMs);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (ms) => {
    clearTimer();
    if (!ms) return;
    remainingMsRef.current = ms;
    expireAtRef.current = Date.now() + ms;
    timeoutRef.current = setTimeout(() => setIsVisible(false), ms);
    },
    [clearTimer]
  );

  useEffect(() => {
    setIsVisible(Boolean(message));
    clearTimer();
    remainingMsRef.current = autoHideMs;
    if (!message || !autoHideMs) return undefined;

    startTimer(autoHideMs);
    return () => clearTimer();
  }, [message, autoHideMs, clearTimer, startTimer]);

  if (!message || !isVisible) return null;

  const variantClass = styles[`toast-${typeAlert}`] || styles["toast-warning"];

  return (
    <div className={styles.container} role="status" aria-live="polite" aria-atomic="true">
      <div
        className={`${styles.toast} ${variantClass}`}
        onMouseEnter={() => {
          if (!autoHideMs) return;
          const remaining = Math.max(0, expireAtRef.current - Date.now());
          remainingMsRef.current = remaining;
          clearTimer();
        }}
        onMouseLeave={() => {
          if (!autoHideMs) return;
          startTimer(remainingMsRef.current);
        }}
      >
        <p className={styles.message}>{String(message)}</p>
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => {
            clearTimer();
            setIsVisible(false);
          }}
          aria-label="Cerrar alerta"
          title="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default GlobalAlert;
