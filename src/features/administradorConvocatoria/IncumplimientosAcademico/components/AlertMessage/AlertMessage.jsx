import styles from '../../styles/AlertMessage.module.css';
import { useEffect, useState } from 'react';

const AlertMessage = ({ error = false, message = '', autoHideMs = 5000 }) => {
	const [isVisible, setIsVisible] = useState(Boolean(message));

	useEffect(() => {
		setIsVisible(Boolean(message));
		if (!message || !autoHideMs) return undefined;

		const timeoutId = setTimeout(() => setIsVisible(false), autoHideMs);
		return () => clearTimeout(timeoutId);
	}, [message, autoHideMs]);

	if (!isVisible || !message) return null;

	return (
		<div className={`${styles.alert} ${error ? styles.alert_danger : styles.alert_success}`}>
			{message}
		</div>
	);
};

export default AlertMessage;