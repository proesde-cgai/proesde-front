import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { faBrush, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles/ReporteEstadistico.module.css'
import Alert from '../../../reutilizable/Alert';
import axios from 'axios';
import { miembros } from '../../../utils/miembros';
import InputField from '../../../reutilizable/InputField';
import SelectField from '../../../reutilizable/SelectField';
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";


// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const ReporteEstadistico = () => {
    const initialState = {
        formato: "",
        reporte: "",
        contra: ""
    }

    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (data) => {
        console.log("sumbit form")
        const camposVacios = Object.values(data).some(value => value === '');


    };

    return (

        <div className={styles.container}>
            <div className={styles.container_aside}>
                <div className={styles.aside}>
                    <p>INSTRUCCIONES</p>
                    <p>Pueden imprimirse varios reportes:</p>
                    <p>Solo es posible ejecutarse un reporte a la vez</p>
                </div>
            </div>
            <div className={styles.solicitudContainer}>
                <form className={styles.form} >

                </form>
                <div className={styles.submit}>
                    <button className={`${styles.btn} ${styles.enviar}`} type="submit" onClick={handleSubmit} >
                        Guardar
                        <span className={styles.iconContainer}>
                            <FontAwesomeIcon icon={faFloppyDisk} className={styles.customIcon} />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );

}

export default ReporteEstadistico;
