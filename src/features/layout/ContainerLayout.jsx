import styles from './css/container-layout.module.css'

export const ContainerLayout = ({ children }) => {
    return (
        <div className={styles.container}>{children}</div>
    )
}