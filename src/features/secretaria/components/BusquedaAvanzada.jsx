import React, { useEffect } from "react";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import { DatosParticipante } from "../../visorDeDocumentos/components/DatosParticipante";
import MensajeEvaluacion from '../../evaluacion/components/MensajeEvaluacion';
import CotejoRequisitosPage from '../pages/CotejoRequisitosPage'
import CotejoCriteriosPage from '../pages/CotejoCriteriosPage'
import { useEvaluationStore } from '../../../store/useEvaluationStore';
import styles from "./styles/BusquedaAvanzada.module.css";
import AsideSecretaria from "./AsideSecretaria";


export const BusquedaAvanzada = () => {
  const { selectedDataAcademico } = useEvaluationStore();
  const hasSelected = useEvaluationStore(state => state.hasSelectedDataAcademico());
  const resetSelectedDataAcademico = useEvaluationStore(state => state.resetSelectedDataAcademico);

  const menu = useMenu(
    [
      {
        label: "Datos participante",
        element: <DatosParticipante />,
      },
      {
        label: "Requisitos",
        element: <CotejoRequisitosPage/>
      },
      {
        label: "Rubros de evaluación",
        element: <CotejoCriteriosPage/>
      }
    ],
    {
      customClass: {
        menu: styles.menuContainer,
        menuOption: styles.menuOption,
        subMenuOption: styles.subMenuOption,
        selected: styles.selected,
      },
      defaultSelection: 0,
    }
  );

  useEffect(() => {
    resetSelectedDataAcademico();
  }, [resetSelectedDataAcademico])

  return (
    <div className={styles.container}>
      <div className={styles.containerAside}>
        <AsideSecretaria />
      </div>

      {hasSelected ? (
        <div className={styles.containerContent}>
          <div className={styles.containerMenu}>
            {selectedDataAcademico.nombre && (
              <div className={styles.nombreAcademico}>
                <p>{`${selectedDataAcademico.nombre} ${selectedDataAcademico.apellidoPaterno} ${selectedDataAcademico.apellidoMaterno}`}</p>
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
        <MensajeEvaluacion />
      )}
    </div>
  );
};
