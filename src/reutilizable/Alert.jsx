import React, { useEffect, useState } from 'react';
import styles from './styles/Alert.module.css';

/**
 * Componente Alert para mostrar mensajes de alerta.
 *
 * @param {Object} props - Props del componente.
 * @param {React.ReactNode} props.children - El contenido de la alerta, debe ser un elemento p html.
 * @param {'success' | 'error' | 'warning'} props.typeAlert - Tipo de alerta que define el estilo.
 * @param {number} [props.autoHideMs=5000] - Tiempo en ms para ocultar automáticamente la alerta. Usa 0 para desactivar.
 *
 * @returns {JSX.Element} El componente Alert.
 */
const Alert = ({ children, typeAlert, autoHideMs = 5000 }) => {
    const alertClass = styles[`alert-${typeAlert}`] || styles.alert; // Fallback a un estilo por defecto

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setIsVisible(true);
        if (!autoHideMs) return undefined;

        const timeoutId = setTimeout(() => setIsVisible(false), autoHideMs);
        return () => clearTimeout(timeoutId);
    }, [autoHideMs, children, typeAlert]);

    if (!isVisible) return null;

    return (
        <div className={`${alertClass} ${styles.space} ${styles.alert}`}>
            {children}
        </div>
    )
}

export default Alert
