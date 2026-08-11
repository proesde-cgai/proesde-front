import React, { useEffect } from 'react';
import { Menu, useMenu } from '../../../reutilizable/Menu';
import { useEvaluationStore } from '../../../store/useEvaluationStore';
import MensajeEvaluacion from '../../evaluacion/components/MensajeEvaluacion';
import styles from "./styles/Evaluacion.module.css";
import ExpedienteRequisitosPage from '../pages/ExpedienteRequisitosPage';
import ExpedienteCriteriosPage from '../pages/ExpedienteCriteriosPage';
import Aside from './Aside';

const Expediente = () => {
    const { selectedDataAcademico } = useEvaluationStore();
    const hasSelected = useEvaluationStore(state => state.hasSelectedDataAcademico());
    const resetSelectedDataAcademico = useEvaluationStore(state => state.resetSelectedDataAcademico);


    const menu = useMenu(
        [
            {
                label: 'Requisitos',
                element: <ExpedienteRequisitosPage selectedDataAcademico={selectedDataAcademico}/>
            },
            {
                label: 'Rubros de evaluación',
                element: <ExpedienteCriteriosPage />
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

    

    useEffect(() => {
        resetSelectedDataAcademico();
    }, [resetSelectedDataAcademico])

    return (
        <div className={styles.container}>
            <div className={styles.containerAside}>
                <Aside alias="ver_expediente"/>
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
}

export default Expediente;
