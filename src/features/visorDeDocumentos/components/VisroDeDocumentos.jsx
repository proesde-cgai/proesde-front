import React from "react";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import { Instrucciones } from "./Instrucciones";
import styles from "./visorDocumentos.module.css";
import { useState } from "react";
import Aside from '../../../reutilizable/Aside';
import { SubirDocumento } from "./SubirDocumento";


export const SubirDocumentos = () => {
  const menu = useMenu([
    {
      label: "Instrucciones",
      element: <Instrucciones />,
    },
    {
      label: "Subir documentos",
      element: <SubirDocumento />,
    },
  ]);

  const [infoAcademico, setInfoAcademico] = useState({
    id: 0,
    nombre: "",
    cargo: "",
    tipo: "",
    nivel: "",
  });

  return (
    <div className={styles.container}>
      <div className={styles.container_aside}>
        <Aside setInfoAcademico={setInfoAcademico} />
      </div>

      <div className={styles.container_content}>
        <div className={styles.container_menu}>
          {infoAcademico.nombre && (
            <div className={styles.nombre_academico}>
            </div>
          )}
          <div className={styles.menu}>
            <Menu menu={menu} />
            <div className={styles.option_menu}>{menu.element}</div>
          </div>
        </div>
      </div>  
    </div>
  );
};
