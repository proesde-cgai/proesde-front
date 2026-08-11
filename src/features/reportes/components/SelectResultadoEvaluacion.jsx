import React from "react";
import { useSelect } from "../hooks/useSelect";
import styles from "./styles/Select.module.css";
import { IoIosArrowDown } from "react-icons/io";

function SelectResultadoEvaluacion({ placeholder = "Seleccione una opción", disabled = false }) {
  const {
    handleSelectClick,
    handleOptionClick,
    isVisibleOptions,
    dependencias,
    selectedOption,
    handleChangeVisibleOption
  } = useSelect();

  return (
    <div
      className={`${styles.selectContainer} ${disabled ? styles.disabled : ""}`}
    >
      <div
        className={styles.selectBox}
        onClick={() => handleSelectClick(disabled)}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      >
        {selectedOption || placeholder}
        {isVisibleOptions ? <IoIosArrowDown /> : <IoIosArrowDown />}
      </div>

      {isVisibleOptions && !disabled && (
        <div className={styles.optionsContainer}>
          <div
            className={styles.option}
            onClick={handleChangeVisibleOption}
          >
            {placeholder}{" "}
          </div>
          {dependencias?.map((option) => (
            <div
              key={option.id}
              className={styles.option}
              onClick={() => handleOptionClick(option)}
            >
              {option.dependencia}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectResultadoEvaluacion;
