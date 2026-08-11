import React, { useEffect, useState, useMemo } from 'react';
import { useMenu, Menu } from '../../../../reutilizable/Menu';
import Criterios from '../components/Criterios';
import Loading from '../../../../reutilizable/Loading';
import Alert from '../../../../reutilizable/Alert';
import { ERROR_MESSAGES_GENERICS_API } from '../../../../utils/messagesFromAPI';
import { obtenerCriteriosExpediente } from '../services/criteriosExpedienteService';
import { useDatosAcademico } from '../../store/useDatosAcademico';
import styles from './styles/ExpedienteCriteriosPage.module.css';

const ExpedienteCriteriosPage = () => {

  const { setDataAcademico, datosAcademico } = useDatosAcademico();

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

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('auth-storage'))
    const noAcademico = authData.state.userInfo.username;
    setDataAcademico(noAcademico);
  }, [setDataAcademico]);

  useEffect(() => {
    if (datosAcademico) {
      setIdSolicitud(datosAcademico.idSolicitud);
    }
  }, [datosAcademico]);

  useEffect(() => {
    
    setErrorMessage(null);
    //console.log(idSolicitud)

    if (idSolicitud) {
      obtenerCriteriosExpediente(idSolicitud)
        .then(response => {
          setMenuCriterios(response.data.menu);
          setIdMenuInicial(response.data?.menu[0]?.id);
          setIsLoading(false);
        })
        .catch(error => {
          if (error.response) {
            const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
            setErrorMessage({
              message,
              type: 'error'
            });
          }
          console.error('Error al obtener los criterios de expediente ', error)
        })
        .finally(() => setIsLoading(false))
    }

  }, [idSolicitud]);

  const menuOptions = useMemo(() => {
    return menuCriterios.map(item => ({
      label: item.nombre,
      element: <Criterios idMenu={item.id} idSolicitud={idSolicitud}/>,
    }));
  }, [menuCriterios, idSolicitud]);

  // Creamos el menú siempre, incluso si está vacío

  const menu = useMenu(
    menuOptions,
    {
      customClass: {
        menu: styles.menuContainer,
        menuOption: styles.menuOption,
        subMenuOption: styles.subMenuOption,
        selected: styles.selected,
      },
      selectedValue: menuOptions[0]?.label
    }
  );
  if (errorMessage) {
    return (
      <Alert typeAlert={errorMessage.type}>
        <p>{errorMessage.message}</p>
      </Alert>
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
