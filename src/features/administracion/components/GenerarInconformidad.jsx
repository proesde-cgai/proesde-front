import React, { useEffect, useState } from "react";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import styles from "./styles/GenerarInconformidad.module.css";
import { Inconformarse } from "./Inconformarse";
import Aside from "../../../reutilizable/Aside";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { DatosParticipante } from "./DatosParticipante";
import RubrosImpugnados from "./RubrosImpugnados";
import { useImpugnacionStore } from "../../../store/useImpugnacionStore";


export const GenerarInconformidad = () => {
  const clearImpugnados = useImpugnacionStore((state) => state.clearImpugnados)

  const { setDataAcademico, selectedDataAcademico, selectedIdSolicitud, } = useEvaluationStore();
  
  useEffect(() => {
    setDataAcademico(localStorage.getItem('userName'));
    clearImpugnados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDataAcademico]);

  const [infoAcademico, setInfoAcademico] = useState({
    id: selectedIdSolicitud,
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    cargo: "",
    tipo: "",
    nivel: "",
    codigo: "",
  });

  console.log(infoAcademico);
  console.log("selected data" ,selectedDataAcademico);

  const menu = useMenu(
    [
      {
        label: "Datos participante",
        element: <DatosParticipante setInfoAcademico={setInfoAcademico}/>,
      },
      {
        label: "Rubros impugnados",
        element: <RubrosImpugnados />,
      },
      {
        label: "Inconformarse",
        element: <Inconformarse idSolicitud={selectedDataAcademico?.idSolicitud}/>,
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

  const fecha = JSON.parse(localStorage.getItem("fecha"));
  const displayDate = fecha?.rangoFecha || "2024-2025";

  return (
    <div className={styles.container}>
      <div className={styles.container_content}>
        <div className={styles.container_menu}>
          {infoAcademico.nombre && (
            <div className={styles.nombre_academico}></div>
          )}
          <div className={styles.menu}>
            <Menu menu={menu} />
            <div className={styles.option_menu}>
              <h3 className={styles.font}>
                Programa de Estímulos al Desempeño Docente {displayDate}
              </h3>
              <p className={styles.nombreAcademico}>{infoAcademico.nombre.toUpperCase()}</p>
              {menu.element}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
