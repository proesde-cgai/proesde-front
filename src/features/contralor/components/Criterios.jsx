import React, { useEffect, useRef, useState } from 'react';
import styles from './styles/Criterios.module.css';
import { obtenerSubMenuCriteriosExpediente } from '../../academico/expediente/services/criteriosExpedienteService';
import { ERROR_MESSAGES_GENERICS_API } from '../../../utils/messagesFromAPI';
import Alert from '../../../reutilizable/Alert';
import TablaItemsEvaluacion from './TablaItemsEvaluacion';
import { useEvaluationStore } from '../../../store/useEvaluationStore';

const Criterios = ({ idMenu, idSolicitud }) => {

    const [subMenuOptions, setSubMenuOptions] = useState([]);
    const [isActive, setIsActive] = useState(null);
    const [loading, setIsLoading] = useState(true);
    const [params, setParams] = useState(null);
    const [error, setError] = useState(null);

    const { selectedDataAcademico } = useEvaluationStore();
    const prevSelectedRef = useRef({}); // Almacena el valor anterior

    useEffect(() => {
        if (!idMenu || !idSolicitud) return;
        setParams(null)
        setIsLoading(true);
        obtenerSubMenuCriteriosExpediente(idSolicitud, idMenu)
            .then((response) => {
                setSubMenuOptions(response.data?.subMenu || []);
            })
            .catch((error) => {
                const message =
                    ERROR_MESSAGES_GENERICS_API[error.response?.status] ||
                    ERROR_MESSAGES_GENERICS_API.default;
                setError({ message, type: 'error' });
            })
            .finally(() => setIsLoading(false)); 
    }, [idMenu, idSolicitud])



    const tableRef = useRef(null);

    if (error) {
        return (
            <Alert typeAlert={error.type}>
                <p>{error.message}</p>
            </Alert>
        );
    }


    if (loading) {
        return (
            <Alert typeAlert='success'>
                <p>Seleccione un inciso para comenzar a enviar sus evidencias</p>
            </Alert>
        );
    }

    return (
        <div className={styles.containerSubMenuCriterios}>
            <ul className={styles.listOpcionesCriterios}>
                {subMenuOptions?.map(subMenu => {
                    const isActiveOpcion = isActive === subMenu.id;
                    return (
                        <li key={subMenu.id} className={styles.opcionItemCriterio}>
                            <button
                                type='button'
                                onClick={() => {
                                    setParams({
                                        ...params,
                                        idSolicitud: selectedDataAcademico.id,
                                        idMenu,
                                        idSubMenu: subMenu.id
                                    });

                                    setIsActive(subMenu.id);
                                    window.scrollTo({
                                        top: window.innerHeight,
                                        behavior: 'smooth'
                                    });
                                }}
                                className={isActiveOpcion ? `${styles.opcionItemCriterioButton} ${styles.isActiveOpcionItemCriterio}` : `${styles.opcionItemCriterioButton}`}
                            >
                                {subMenu.nombre}
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className={styles.containerTableItemsEvaluacion}>
                {params && (
                    <TablaItemsEvaluacion params={params} ref={tableRef} />
                )}
            </div>
        </div>
    );
};

export default Criterios;