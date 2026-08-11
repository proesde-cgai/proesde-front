import React from 'react';
import styles from './DownloadButtonComponent.module.css';

const DownloadButtonComponent = ({ documento }) => {
  const handleDownload = () => {
    console.log(`Descargar ${documento}`);
  };

  return (
    <button onClick={handleDownload} className={styles.downloadButton}>
      Descargar {documento}
    </button>
  );
};

export default DownloadButtonComponent;
