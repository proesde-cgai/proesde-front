import React, { useEffect } from 'react';
import { Menu, useMenu } from '../../../reutilizable/Menu';
import Aside from '../../../reutilizable/Aside';
import Evaluar from '../pages/Evaluar';
import Instrucciones from './Instrucciones';
import { Requisitos } from './Requisitos';
import { DatosParticipante } from '../../visorDeDocumentos/components/DatosParticipante';
import RazonesInconformidad from './RazonesInconformidad';
import Notas from '../../evaluacion/components/Notas';
import { useEvaluationStore } from '../../../store/useEvaluationStore';
import styles from './styles/Inconformidad.module.css';

const Inconformidad = () => {
  const menu = useMenu(
    [
      {
        label: 'Razones',
        element: <RazonesInconformidad />
      },
      {
        label: 'Datos del participante',
        element: <DatosParticipante />
      },
      {
        label: 'Requisitos',
        element: <Requisitos />
      },
      {
        label: 'Evaluar',
        element: <Evaluar />
      },
      {
        label: 'Notas',
        element: <Notas />,
      }
    ],
    {
      customClass: {
        menu: styles.menuContainer,
        menuOption: styles.menuOption,
        subMenuOption: styles.subMenuOption,
        selected: styles.selected,
      },
    }
  );

  const { selectedDataAcademico } = useEvaluationStore();
  const hasSelected = useEvaluationStore(state => state.hasSelectedDataAcademico());
  const resetSelectedDataAcademico = useEvaluationStore(state => state.resetSelectedDataAcademico);

  useEffect(() => {
    resetSelectedDataAcademico();
  }, [resetSelectedDataAcademico])

  return (
    <div className={styles.container}>
      <div className={styles.containerAside}>
        <Aside />
      </div>

      {hasSelected ? (
        <div className={styles.containerContent}>
          <div className={styles.containerMenu}>
            {selectedDataAcademico?.nombre && (
              <div className={styles.nombreAcademico}>
                <p>{`${selectedDataAcademico?.nombre} ${selectedDataAcademico?.apellidoPaterno} ${selectedDataAcademico?.apellidoMaterno}`}</p>
              </div>
            )}

            <div className={styles.menu}>
              <Menu menu={menu} />
              <div className={styles.optionMenu}>
                {menu.element}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Instrucciones />
      )}
    </div>
  )
}

export default Inconformidad
