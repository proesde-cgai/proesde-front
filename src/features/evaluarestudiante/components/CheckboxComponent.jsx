import React from 'react';
import styles from './CheckboxComponent.module.css';

const CheckboxComponent = ({ checked, onChange }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={styles.checkbox}
    />
  );
};

export default CheckboxComponent;
