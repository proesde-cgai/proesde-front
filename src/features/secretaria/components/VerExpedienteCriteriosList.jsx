import React, { useEffect, useState } from 'react'
import VerCriteriosExpedienteTable from './VerCriteriosExpedienteTable';
import { obtenerSubMenuCriteriosExpediente } from '../../academico/expediente/services/criteriosExpedienteService';
import { ERROR_MESSAGES_GENERICS_API } from '../../../utils/messagesFromAPI';
import Alert from '../../../reutilizable/Alert';
import styles from './styles/VerExpedienteCriterios.module.css'
import { useRef } from 'react';


const VerExpedienteCriteriosList = ({ idMenu, idSolicitud }) => {
  const tableRef = useRef(null); // Declara el ref

  console.log('idMenu:', idMenu, 'idSolicitud:', idSolicitud)

  const [subMenuOptions, setSubMenuOptions] = useState([]);
  const [isActive, setIsActive] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const [params, setParams] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idMenu && !idSolicitud) return;
    setError(null);

    if (idMenu && idSolicitud) {
      obtenerSubMenuCriteriosExpediente(idSolicitud, idMenu)
      .then(response => {
        setSubMenuOptions(response.data.subMenu)
      })
      .catch(error => {
        if (error.response) {
          const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
          setError({
            message,
            type: 'error'
          });
        }
        console.error('Error al obtener los submenus', error)
      })
      .finally(() => setIsLoading(false))
    }
  }, [idMenu, idSolicitud]);

  if (loading) {
    return (
      <Alert typeAlert='success'>
        <p>Seleccione un inciso para comenzar a ver el expediente del académico</p>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert typeAlert={error.type}>
        <p>{error.message}</p>
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
                    idSolicitud,
                    idMenu,
                    idSubMenu: subMenu.id
                  });

                  setIsActive(subMenu.id);
                  tableRef.current.scrollIntoView({ behavior: 'smooth' });
                }}
                className={isActiveOpcion ? `${styles.opcionItemCriterioButton} ${styles.isActiveOpcionItemCriterio}` : `${styles.opcionItemCriterioButton}`}
              >
                {subMenu.nombre}
              </button>
            </li>
          );
        })}
      </ul>

      <div ref={tableRef} className={styles.containerTableItemsEvaluacion}>
        {params && (
          <VerCriteriosExpedienteTable params={params}/>
        )}
      </div>
    </div>
  );
}

export default VerExpedienteCriteriosList;