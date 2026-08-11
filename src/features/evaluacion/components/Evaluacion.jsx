import React, { useEffect } from 'react';
import Aside from '../../../reutilizable/Aside';
import { Menu, } from '../../../reutilizable/Menu';
import { Requisitos } from '../../inconformidad/components/Requisitos';
import MensajeEvaluacion from './MensajeEvaluacion';
import TabEvaluarPage from '../pages/TabEvaluarPage';
import Notas from './Notas';
import RazonesInconformacion from '../../inconformidad/components/RazonesInconformidad';
import { useEvaluationStore } from '../../../store/useEvaluationStore';
import styles from './styles/Evaluacion.module.css';
import Loading from '../../../reutilizable/Loading';
import useMenu from '../../../hooks/useMenuItems';

const Evaluacion = () => {

const { selectedDataAcademico, esParticipante, razonesNoParticipante, isLoading, } = useEvaluationStore();
const { useMenuItems, } = useMenu();
const participante = esParticipante();
console.log(participante);


// const menuItems = useMenuItems();
const menuItems = useEvaluationStore((state) => state.menuItems());


  const menu = useMenuItems(menuItems, {
    customClass: {
      menu: styles.menuContainer,
      menuOption: styles.menuOption,
      subMenuOption: styles.subMenuOption,
      selected: styles.selected,
    },
  });

  const hasSelected = useEvaluationStore((state) => state.hasSelectedDataAcademico());
  const resetSelectedDataAcademico = useEvaluationStore((state) => state.resetSelectedDataAcademico);

  useEffect(() => {
    resetSelectedDataAcademico();
  }, [resetSelectedDataAcademico]);

  // if( isLoading ) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.containerAside}>
        <Aside alias="evaluacion"/>
      </div>

      {isLoading ? (
        <div className={styles.containerContent}>
          <Loading />
        </div>
      ) : (
        <>
          {hasSelected ? (
        <div className={styles.containerContent}>
          <div className={styles.containerMenu}>
            {selectedDataAcademico.nombre && (
              <div className={styles.nombreAcademico}>
                <p>{`${selectedDataAcademico.nombre} ${selectedDataAcademico.apellidoPaterno} ${selectedDataAcademico.apellidoMaterno}`} { !participante && ('(No Participante)')}</p>
                { !participante && (
                  <p>Razones: {razonesNoParticipante()}</p>
                )}
              </div>
            )}

            <div className={styles.menu}>
              <Menu menu={menu} />
              <div className={styles.optionMenu}>{menu.element}</div>
            </div>
          </div>
        </div>
      ) : (
        <MensajeEvaluacion />
      )}
        </>
      )
      }

      
    </div>
  );
};

export default Evaluacion;
