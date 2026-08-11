import React from 'react';

const SelectField = ({ label, id, value, onChange, options = [], propertyName, readOnly = false, styles }) => (
    <div className={styles.inputContainer}>
        <label htmlFor={id}>{label}</label>
        {readOnly ? (
            <input id={id} type="text" value={options.find(option => Number(option.id) === Number(value))?.nombre || ""} readOnly />
        ) : (
            <select id={id} value={value} onChange={onChange}>
                <option value="0">Seleccione</option>
                {options.map(option => (
                    <option key={option.id} value={option.id}>
                        {propertyName === "" ? option.nombre : option[propertyName]}
                    </option>
                ))}
            </select>
        )}
    </div>
);

export default SelectField;
