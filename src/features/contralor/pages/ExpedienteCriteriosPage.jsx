import React, { useEffect, useState, useMemo } from 'react';
import styles from './styles/ExpedienteCriteriosPage.module.css';
import { useDatosAcademico } from '../../academico/store/useDatosAcademico';
import { useEvaluationStore } from '../../../store/useEvaluationStore';
import Criterios from '../components/Criterios';
import { obtenerCriteriosExpediente } from '../../academico/expediente/services/criteriosExpedienteService';
import { ERROR_MESSAGES_GENERICS_API } from '../../../utils/messagesFromAPI';
import Alert from '../../../reutilizable/Alert';
import { Menu, useMenu } from '../../../reutilizable/Menu';

const ExpedienteCriteriosPage = () => {
    const { selectedDataAcademico } = useEvaluationStore();

    const [errorMessage, setErrorMessage] = useState(null);
    const [idSolicitud, setIdSolicitud] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [idMenuInicial, setIdMenuInicial] = useState(null);
    const [menuCriterios, setMenuCriterios] = useState([{
        id: idMenuInicial,
        nombre: 'Cargando Criterios...',
        valorInicial: 0,
        tope: 0
    }]);

    // Reset state whenever selectedDataAcademico changes
    useEffect(() => {
        if (selectedDataAcademico) {
            // Reset states to their initial values
            setIsLoading(true);  // Show loading state
            setErrorMessage(null); // Reset any error message
            setMenuCriterios([{ id: null, nombre: 'Cargando Criterios...', valorInicial: 0, tope: 0 }]);  // Reset menuCriterios
            setIdMenuInicial(null);  // Reset the initial menu ID
            setIdSolicitud(selectedDataAcademico.id);  // Set the new `idSolicitud`
        }
    }, [selectedDataAcademico]);



    useEffect(() => {
        if (selectedDataAcademico?.id) {
            obtenerCriteriosExpediente(selectedDataAcademico.id)
                .then(response => {
                    // Update the menu options after fetching data
                    const menus = response.data.menu || [];
                    setMenuCriterios(menus);
                    if (menus.length > 0) {
                        setIdMenuInicial(menus[0].id); // Set the initial menu ID from the response
                    }
                })
                .catch(error => {
                    if (error.response) {
                        const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
                        setErrorMessage({
                            message,
                            type: 'error'
                        });
                    }
                    console.error('Error al obtener los criterios de expediente ', error);
                })
                .finally(() => setIsLoading(false));  // Hide loading state after the fetch
        }
    }, [selectedDataAcademico.id]);  // Re-fetch when idSolicitud changes

    // Prepare the menu options based on the fetched menu criteria
    const menuOptions = useMemo(() => {
        return menuCriterios.map(item => ({
            label: item.nombre,
            element: <Criterios idMenu={item.id} idSolicitud={selectedDataAcademico.id} />,
        }));
    }, [menuCriterios, selectedDataAcademico]);  // Recompute when menuCriterios or idSolicitud changes

    const menu = useMenu(
        menuOptions,
        {
            customClass: {
                menu: styles.menuContainer,
                menuOption: styles.menuOption,
                subMenuOption: styles.subMenuOption,
                selected: styles.selected,
            },
            selectedValue: menuOptions.find((menu) => menu.id === idMenuInicial)?.label,
        }
    );

    if (errorMessage) {
        return (
            <Alert typeAlert={errorMessage.type}>
                <p>{errorMessage.message}</p>
            </Alert>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.containerExpedienteCriterio}>
                <Menu menu={menu} />
                <div className={styles.containerOpcionExpedienteCriterio}>
                    <Alert typeAlert='success'>
                        <p>Seleccione un inciso para comenzar a enviar sus evidencias</p>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.containerExpedienteCriterio}>
            <Menu menu={menu} />
            <div className={styles.containerOpcionExpedienteCriterio}>
                {menu.element}
            </div>
        </div>
    );
};

export default ExpedienteCriteriosPage;
