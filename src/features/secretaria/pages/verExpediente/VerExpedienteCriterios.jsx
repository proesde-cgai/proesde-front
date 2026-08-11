import React, { useEffect, useMemo, useState } from 'react';
import { Menu, useMenu } from '../../../../reutilizable/Menu';
import Alert from '../../../../reutilizable/Alert';
import Loading from '../../../../reutilizable/Loading';
import { useEvaluationStore } from '../../../../store/useEvaluationStore';
import VerExpedienteCriteriosList from '../../components/VerExpedienteCriteriosList';
import { obtenerCriteriosExpediente } from '../../../academico/expediente/services/criteriosExpedienteService';
import { ERROR_MESSAGES_GENERICS_API } from '../../../../utils/messagesFromAPI';
import styles from '../styles/VerExpedienteCriterios.module.css';

const VerExpedienteCriterios = () => {

  const { idSolicitud } = useEvaluationStore();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [idMenuInicial, setIdMenuInicial] = useState(null);
  const [menuCriterios, setMenuCriterios] = useState([{
    id: idMenuInicial,
    nombre: 'Cargando Criterios...'
  }]);

  useEffect(() => {
    setErrorMessage(null);

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
      element: <VerExpedienteCriteriosList idMenu={item.id} idSolicitud={idSolicitud}/>
    }));
  }, [menuCriterios, idSolicitud]);

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

  if (isLoading) return <Loading/>;

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

export default VerExpedienteCriterios;