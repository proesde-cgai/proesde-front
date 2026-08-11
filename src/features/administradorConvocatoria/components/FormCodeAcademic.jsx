import AlertMessage from '../IncumplimientosAcademico/components/AlertMessage/AlertMessage'
import { Spin } from '../IncumplimientosAcademico/components/Spinner'
import styles from './styles/FormCodeAcademic.module.css'

export const FormCodeAcademic = ({ actionForm, changeCode, value, loading, message, error }) => {
    return (
        <form className={styles.leftInfo} onSubmit={actionForm}>
            <h3 className={styles.codeTitle}>Código:</h3>
            <input
                type="text"
                className={styles.inputCode}
                onChange={changeCode}
                value={value}
                placeholder="Ingrese código académico"
            />

            <button className={styles.btnCode} disabled={loading} >
                {
                    loading ? (<Spin />) : ("Continuar")
                }
            </button>
            {
                message && (<AlertMessage error={error} message={message} />)
            }

        </form>
    )
}