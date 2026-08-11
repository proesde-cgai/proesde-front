import React from 'react';

const InputField = ({ label, id, value, onChange, readOnly = false, type = "text", styles }) => (
    <div className={styles.inputContainer}>
        <label htmlFor={id}>{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
        />
    </div>
);

export default InputField;
