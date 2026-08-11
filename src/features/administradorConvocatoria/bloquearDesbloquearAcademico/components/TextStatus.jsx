const TextStatus = ({ styles, message, error }) => {
    if (!message) return null;

    return (
        <p className={`${styles.textStatus} ${error ? styles.error : styles.success}`}>{message}</p>
    )
}

export default TextStatus;