import React from 'react';

const ConditionalSelectOrInput = ({ label, id, value, options, propertyName, onChange, readOnly, styles }) => (
    <div className={styles.inputContainer}>
        <label htmlFor={id}>{label}</label>
        {options && options.length === 1 ? (
            <input
                id={id}
                type="text"
                onChange={onChange}
                value={propertyName === "" ? options[0] : options[0][propertyName] }
                readOnly
            />
        ) : (
            <select id={id} value={value || ""} onChange={onChange} disabled={readOnly}>
                <option value="">Seleccione</option>
                {options && options.length > 0 &&
                    options.map((item) => (
                        <option key={item.id} value={item[label]}>
                            {item[label.toLowerCase()]}
                        </option>
                    ))}
            </select>
        )}
    </div>
);


export default ConditionalSelectOrInput;