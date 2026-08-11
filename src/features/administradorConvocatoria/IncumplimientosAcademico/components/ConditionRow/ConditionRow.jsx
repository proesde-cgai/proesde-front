import { Checkbox } from "antd";
import { useIncumplimientoContext } from "../../hooks/useIncumplimientoContext";
import styles from "./ConditionRow.module.css";
import ConditionItem from "../ConditionItem/ConditionItem";

const ConditionRow = ({ breach }) => {
  const { data, updateBreach, addBreachToDelete, deleteBreachToDelete, addBreachesToUpdate } = useIncumplimientoContext();
  const breachFound = data.breachesToDelete.find(breachToDelete => breachToDelete?.id === breach?.id)

  console.log("Breaches to select, ", breach)

  const handleChangeSelect = (e) => {
    const { value } = e.target
    updateBreach(breach, Number(value));

    if (!breach.new) addBreachesToUpdate(breach, Number(value));

  }

  const handleAddBreachToDelete = (e) => {
    const { checked } = e.target
    if (checked && !breachFound) {
      addBreachToDelete(breach)
      return
    }
    deleteBreachToDelete(breach)
  }

  return (
    <tr className={styles.condicionesTableBodyTr}>
      <td>
        <div className={styles.btnDelete}>
          <Checkbox checked={!!breachFound} onClick={handleAddBreachToDelete} />
        </div>
      </td>
      <td className={styles.conditionRowSelect}>
        <select
          className={styles.conditionSelect}
          value={breach.idCondition}
          onChange={handleChangeSelect}
        >
          <option className={styles.conditionOption} value={0}>
            Selecciona un incumplimiento
          </option>
          {data.conditions.map((item) => {
            // Desahabilitar condition si fue seleccionado
            const isDisabled = data.breaches.some(
              (b) => b.idCondition === item.id && b.id !== breach.id
            );

            return (
              <option
                key={item.id}
                value={item.id}
                disabled={isDisabled} 
              >
                {item.description}
              </option>
            );
          })}
        </select>
      </td>
    </tr>
  );
};

export default ConditionRow;
