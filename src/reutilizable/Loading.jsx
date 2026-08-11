import React from 'react';
import styles from './styles/Loading.module.css';

const Loading = () => {
  return (
    <div className={styles.containerLoading}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default Loading;
