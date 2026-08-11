import React, { useEffect, useRef, useState } from 'react';
import { obtenerSubMenuCriteriosExpediente } from '../services/criteriosExpedienteService';
import Alert from '../../../../reutilizable/Alert';
import TablaItemsEvaluacion from './TablaItemsEvaluacion';
import { ERROR_MESSAGES_GENERICS_API } from '../../../../utils/messagesFromAPI';
import styles from './styles/Criterios.module.css';

const Criterios = ({ idMenu, idSolicitud }) => {
  const [subMenuOptions, setSubMenuOptions] = useState([]);
  const [isActive, setIsActive] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const [params, setParams] = useState(null);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false); // Controla si se muestra la tabla

  useEffect(() => {
    if (!idMenu || !idSolicitud) return;

    setError(null);
    setShowTable(false); // Restablecer la tabla al cambiar el criterio

    obtenerSubMenuCriteriosExpediente(idSolicitud, idMenu)
      .then(response => {
        setSubMenuOptions(response.data.subMenu);
      })
      .catch(error => {
        if (error.response) {
          const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
          setError({
            message,
            type: 'error'
          });
        }
        console.error('Error al obtener los submenus', error);
      })
      .finally(() => setIsLoading(false));
  }, [idMenu, idSolicitud]); // Dependencia en idMenu para que se recargue cuando cambie

  const tableRef = useRef(null);

  if (error) {
    return (
      <Alert typeAlert="error">
        <p>{error.message}</p>
      </Alert>
    );
  }

  if (loading) {
    return (
      <Alert typeAlert="success">
        <p>Seleccione un inciso para adjuntar sus evidencias</p>
      </Alert>
    );
  }

  const handleSubMenuClick = (subMenu) => {
    setParams({
      ...params,
      idSolicitud,
      idMenu,
      idSubMenu: subMenu.id
    });

    setIsActive(subMenu.id);
    setShowTable(true); // Mostrar la tabla solo cuando se haga clic en un submenú

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className={styles.containerSubMenuCriterios}>
      <ul className={styles.listOpcionesCriterios}>
        {subMenuOptions?.map(subMenu => {
          const isActiveOpcion = isActive === subMenu.id;
          return (
            <li key={subMenu.id} className={styles.opcionItemCriterio}>
              <button
                type="button"
                onClick={() => handleSubMenuClick(subMenu)}
                className={isActiveOpcion ? `${styles.opcionItemCriterioButton} ${styles.isActiveOpcionItemCriterio}` : `${styles.opcionItemCriterioButton}`}
              >
                {subMenu.nombre}
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.containerTableItemsEvaluacion}>
        {showTable && params && (
          <TablaItemsEvaluacion params={params} ref={tableRef} />
        )}
      </div>
    </div>
  );
};

export default Criterios;
