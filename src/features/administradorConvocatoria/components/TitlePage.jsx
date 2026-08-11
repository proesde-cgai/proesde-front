import styles from './styles/title.module.css'

export const TitlePage = ({ title }) => {
  return (
    <h2 className={styles.title}>{title}</h2>
  )
}