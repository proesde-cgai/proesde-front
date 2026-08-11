

import React from 'react';
import { Header } from '../features/layout';
import styles from "./styles/Restriccion.module.css";
import Alert from './Alert';

const Restriccion = () => {
    return (
        <div className={styles.container}>
            <Header />
            <Alert typeAlert="error">
                <p>No se tienen los permisos para accesar</p>
            </Alert>
        </div>
    );
}

export default Restriccion;
