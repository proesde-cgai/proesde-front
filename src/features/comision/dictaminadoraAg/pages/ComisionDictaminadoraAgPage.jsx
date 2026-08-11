import React from "react";
import { Footer, Header } from "../../../layout";
import { Menu, useMenu } from "../../../../reutilizable/Menu";
import Loading from '../../../../reutilizable/Loading';
import Alert from '../../../../reutilizable/Alert';
import { BusquedaAvanzada } from "../../components/BusquedaAvanzada";
import useMenuData from '../../../../hooks/useMenuData';
import styles from "./styles/ComisionDictaminadoraAgPage.module.css";
import ReporteActaSesion from "../../../reportes/components/ReporteActaSesion";
import Evaluacion from "../../../evaluacion/components/Evaluacion";
import ReporteResultadosEvaluacion from "../../../reportes/components/ReporteResultadosEvaluacion";
import ReporteActaEvaluaciones from "../../../reportes/components/ReporteActaEvaluaciones";
import ReporteActaAcuerdos from "../../../reportes/components/ReporteActaAcuerdos";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_SUBMENUS = `${API_BASE_URL}/api/v1/actividad/comision_especial_dictaminadora_ag`;

export const ComisionDictaminadoraAgPage = () => {
  //"Evaluación": <BusquedaAvanzada />,
  const componentMap = {
    "Realizar evaluación" : <Evaluacion />,
    "Instalación" :<ReporteActaAcuerdos />,
    "Sesión(es)": <ReporteActaSesion />,
    "Asignación de puntaje y nivel" : <ReporteActaEvaluaciones />,
    "Tabla resultados" : <ReporteResultadosEvaluacion />,
  }

  const { menu: menuData, menuConfig, isLoading: loadingMenus, error: errorMenu } = useMenuData({
    apiUrl: API_URL_SUBMENUS,
    componentMap,
    defaultSelectedValue: 'Instrucciones',
    isVertical: false
  });

  const menu = useMenu(menuData, menuConfig);

  return (
    <div className={styles.jefe_departamento_page_container}>
      <Header />
      <Menu menu={menu} />
      {loadingMenus && (
        <Loading />
      )}

      {errorMenu && (
        <Alert typeAlert={errorMenu.type}>
          <p>{errorMenu.message}</p>
        </Alert>
      )}
      {menu.element}
      <Footer />
    </div>
  );
};

