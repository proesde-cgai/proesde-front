import styles from './styles/MessageWarning.module.css'

export const MessageWarning = ({ children }) => {
    return (
        <div className={styles.containerAlert}>
            <p className={styles.textAlert}>{children}</p>
        </div>
    )
}