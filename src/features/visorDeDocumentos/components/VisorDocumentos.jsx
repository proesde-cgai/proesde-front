import React from "react";
import { useMenu } from "../../../reutilizable/Menu";
import styles from "./visorDocumentos.module.css";
import { SubirDocumento } from "./SubirDocumento";
import { DatosParticipante } from "./DatosParticipante";
import { Requisitos } from "./Requisitos";
import { Notas } from "./Notas";

export const VisorDocumentos = () => {
  const menu = useMenu(
    [
      {
        label: "Subir documentos",
        element: <SubirDocumento />,
      },
      {
        label: "Datos participante",
        element: <DatosParticipante />,
      },
      {
        label: "Requisitos",
        element: <Requisitos />,
      },
      {
        label: "Notas",
        element: <Notas />,
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

  return (
    <div className={styles.container}>
      <div className={styles.content}>{menu.element}</div>
    </div>
  );
};
