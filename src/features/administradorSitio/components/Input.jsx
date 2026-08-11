import React from "react";
import styles from "../styles/Input.module.css";

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  readOnly,
  placeholder,
  disabled = false,
}) => {
  return (
    <div className={styles.inputField}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={styles.input}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default InputField;
