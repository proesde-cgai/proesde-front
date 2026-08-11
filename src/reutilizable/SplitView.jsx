import React from 'react';
import styles from './styles/SplitView.module.css';

const SplitView = ({ sidebarContent, mainContent }) => {
  return (
    <div className={styles.splitViewContainer}>
      <div className={styles.sidebar}>
        {sidebarContent}
      </div>
      <div className={styles.mainContent}>
        {mainContent}
      </div>
    </div>
  );
};

export default SplitView;
