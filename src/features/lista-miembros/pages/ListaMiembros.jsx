import React from "react";
import { Footer, Header } from "../../layout";
import { Menu, MenuOption, useMenu } from "../../../reutilizable/Menu";
import { InconformidadPage } from "../../inconformidad";
import { Evaluar } from "../../administracion/components/Evaluar";

import { Instrucciones } from "../components/Instrucciones";
import styles from './ListaMiembros.module.css'
import { Table } from "../components/Table";
import { ActivarInactivarSolicitud } from "../../administracion/components/ActivarInactivarSolicitud";
export const ListaMiembros = () => {
    const menu = useMenu(
        [
          {
            label: "Página Principal",
            element: (
              <>
                <p>Pagina principal</p>,
              </>
            ),
          },
          {
            label: "Programas",
            element: <p>Programas</p>,
          },
          {
            label: "Inconformidad",
            element: <InconformidadPage/>,
          },
          {
            label: "Evaluación",
            element: <Evaluar/>,
          },
          {
            label: "Reportes",
            element: <p>Reportes</p>,
          },
          {
            label: "Activar / Inactivar solicitud",
            element: <ActivarInactivarSolicitud/>,
          },
          {
            label: "Generar inconformidad",
            element: <p>Generar inconformidad</p>,
          },
          {
            label: "Administración",
            element: <p>Administracion</p>,
          },
        ],
        {
          selectedValue: "Desempeño docente",
          isVertical: false,
        }
      );
  return (
    <>
      <Header/>
      <Menu menu={menu} />
      <div className={styles.mainContainer}>
        <Instrucciones />
        <Table />
      </div>
      <Footer />
    </>
  );
};
