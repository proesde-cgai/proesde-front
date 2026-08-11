import React, { useEffect } from 'react';
import { Menu, useMenu } from '../../../reutilizable/Menu';
import { DatosParticipante } from '../../visorDeDocumentos/components/DatosParticipante';
import Notas from '../../evaluacion/components/Notas';
import { useEvaluationStore } from '../../../store/useEvaluationStore';
import MensajeEvaluacion from '../../evaluacion/components/MensajeEvaluacion';
import styles from "./styles/Evaluacion.module.css";
import Evaluar from './Evaluar';
import { Requisitos } from './Requisitos';
import Aside from './Aside';


const Evaluacion = () => {
    const menu = useMenu(
        [
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
                <Aside alias="ver_evaluaciones" />
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

export default Evaluacion;
