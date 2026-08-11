import { MessageWarning } from '../../../components/MessageWarning';
import { breachesResponseAdapter } from "../../adapters/academicAdapter";
import { useIncumplimientoContext } from "../../hooks/useIncumplimientoContext";
import { getInfoAcademicoService } from "../../services/getInfoAcademico";
import styles from "../../styles/InfoRight.module.css";
import AlertMessage from "../AlertMessage/AlertMessage";
import ConditionRow from "../ConditionRow/ConditionRow";

const InfoRight = () => {
  const { data, toggleModal, setBreaches, setBreachesUpdate } = useIncumplimientoContext();
  const { error, message } = data.serviceResponse

  if (data.academic === null) {
    return (<MessageWarning>
      Introduzca el código del académico y oprima el botón "Continuar".
    </MessageWarning>)
  }

  const fullName = `${data.academic.name} ${data.academic.lastName}`

  const createNewBreach = () => {
    console.log("New condition: ", data.breaches)
    const newBreach = {
      id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
      description: "",
      new: true
    }

    return [...data.breaches, newBreach]
  }

  const getBreachesToDelete = async () => {
    try {
      const res = await getInfoAcademicoService(data.academic.code);
      setBreaches(breachesResponseAdapter(res));
      setBreachesUpdate();
    } catch (error) {
      console.log(error)
    }
  }

  console.log("Condition data: ", data);

  return (
    <div className={styles.rightInfo}>
      {
        (error || message) && <AlertMessage error={error} message={message} />
      }
      <p className={styles.textAlert}>
        Elimine o agregue incumplimientos y después asegúrese de oprimir el
        botón de "Guardar".
      </p>
      <h3 className={styles.textlistdbet}>Lista de adeudos del Académico</h3>
      <p className={styles.textTotal}>
        Total de adeudos: <span>{data.breaches.length}</span>
      </p>
      <p className={styles.textInfoAcademic}>
        {fullName} <span>{data.academic.code}</span>
      </p>

      <div className={styles.tableContainer}>
        <table className={styles.condicionesTable}>
          <thead className={styles.condicionesTableThead}>
            <tr>
              <th className={styles.condicionesTableTh}></th>
              <th className={styles.condicionesTableTh}>Condición</th>
            </tr>
          </thead>
          <tbody>
            {data.breaches.map((breach, index) => (
              <ConditionRow
                key={breach.id || index}
                breach={breach}
                index={index}
              />
            ))}
          </tbody>
        </table>

        {/* actions */}
        <div className={styles.containerActions}>
          <button
            className={`${styles.btnAction} ${styles.btnActionPrimaryCancel}`}
            onClick={getBreachesToDelete}
          >
            Cancelar
          </button>
          <button
            className={`${styles.btnAction} ${styles.btnActionAdd}`}
            onClick={() => setBreaches(createNewBreach())}
          >
            Agregar
          </button>
          <button
            className={`${styles.btnAction} ${styles.btnActionPrimary}`}
            onClick={() => toggleModal("save")}
          >
            Guardar
          </button>
          <button
            className={`${styles.btnAction} ${styles.btnActionDelete}`}
            onClick={() => toggleModal("delete")}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoRight;
