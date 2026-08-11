import React from 'react'

const InputRadio = ({ styles, checked, onChange, value, name}) => {
    return (
        <div className={styles.estadoItem}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onClick={onChange}
                onChange={onChange}
            />
            <label>
                {value.toUpperCase()}
            </label>
        </div>
    )
}

export default InputRadio
