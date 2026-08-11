import React from "react";

const InputField = ({
  id,
  value,
  onChange,
  placeholder = "Insertar texto",
  readOnly = false,
  type = "text",
  styles,
  disabled,
  name,
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    placeholder={placeholder}
    className={styles}
    disabled={disabled}
    name={name}
  />
);

export default InputField;
