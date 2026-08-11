import React, { useEffect } from "react";
import { DatosParticipante } from "../../visorDeDocumentos/components/DatosParticipante";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import styles from "./styles/Evaluacion.module.css";
import Aside from "./Aside";
import MensajeEvaluacion from '../../evaluacion/components/MensajeEvaluacion';
import VisualizacionAsignacionNivel from "../verEvaluaciones/visualizacion-asignacion-nivel/page/VisualizacionAsignacionNivel";
import { Actas } from "./Actas";


export const Evaluacion = () => {
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
                label: "Visualizar Asignación de nivel",
                element: <VisualizacionAsignacionNivel />,
            },
            {
                label: "Visualizar actas,tablas y dictámenes",
                element: <Actas />,
            },
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
};
