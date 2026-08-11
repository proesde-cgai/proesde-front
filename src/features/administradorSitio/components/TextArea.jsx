import React from "react";
import styles from "../styles/Input.module.css";

const TextField = ({
  label,
  name,
  value,
  onChange,
  readOnly,
  placeholder,
  disabled = false,
}) => {
  return (
    <div className={styles.textField}>
      <label className={styles.label}>{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={styles.textArea}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default TextField;
