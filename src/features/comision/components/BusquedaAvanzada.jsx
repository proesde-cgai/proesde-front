import React, { useState } from "react";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import { DatosParticipante } from "../../visorDeDocumentos/components/DatosParticipante";
import styles from "./styles/BusquedaAvanzada.module.css";
import Aside from "../../../reutilizable/Aside";
import useStoredFecha from "../../useStoredFecha";


export const BusquedaAvanzada = () => {
    const fecha = useStoredFecha();
    const displayDate = fecha?.rangoFecha || "2024-2025";  

    const menu = useMenu(
        [
            {
                label: "Datos participante",
                element: <DatosParticipante />,
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


    return (
        <div className={styles.container}>
            <div className={styles.container_aside}>
                <Aside />
            </div>

            <div className={styles.container_content}>
                <div className={styles.container_menu}>
                    <div className={styles.menu}>
                        <Menu menu={menu} />
                        <div className={styles.option_menu}>
                            <h3 className={styles.font}>
                                Programa de Estímulos al Desempeño Docente {displayDate}
                            </h3>
                            {menu.element}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
