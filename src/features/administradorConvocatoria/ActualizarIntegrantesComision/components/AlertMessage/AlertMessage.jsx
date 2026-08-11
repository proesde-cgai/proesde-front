import styles from '../../styles/AlertMessage.module.css';

const AlertMessage = ({ error = false, message = '' }) => {
	return (
		<div className={`${styles.alert} ${error ? styles.alert_danger : styles.alert_success}`}>
			{message}
		</div>
	);
};

export default AlertMessage;
