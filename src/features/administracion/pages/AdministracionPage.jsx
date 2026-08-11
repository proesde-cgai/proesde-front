import React from "react";
import { Footer, Header } from "../../layout";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import Alert from '../../../reutilizable/Alert';
import Loading from '../../../reutilizable/Loading';
import ReporteActaAcuerdos from "../../reportes/components/ReporteActaAcuerdos";
import ReporteActaEvaluaciones from "../../reportes/components/ReporteActaEvaluaciones";
import ReporteDictamenFinal from "../../reportes/components/ReporteDictamenFinal";
import ReporteActaSesion from "../../reportes/components/ReporteActaSesion";
import ReporteDictamenNoParticipantes from "../../reportes/components/ReporteDictamenNoParticipantes";
import Evaluacion from "../../evaluacion/components/Evaluacion";
import TablaResultadosEvaluacion from "../../evaluacion/components/TablaResultadosEvaluacion";
import useMenuData from '../../../hooks/useMenuData';
import styles from "./styles/AdminisstracionPage.module.css";
import ReporteResultadosEvaluacion from "../../reportes/components/ReporteResultadosEvaluacion";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_SUBMENUS = `${API_BASE_URL}/api/v1/actividad/comision_dictaminadora_cu_ep`;

export const AdministracionPage = () => {

  const componentMap = {
    "Instalación": <ReporteActaAcuerdos />,
    "Sesión(es)": <ReporteActaSesion />,
    "Dictamen de no participante": <ReporteDictamenNoParticipantes />,
    "Dictamen final": <ReporteDictamenFinal />,
    "Asignación de puntaje y nivel": <ReporteActaEvaluaciones />,
    "Realizar evaluación": <Evaluacion />,
    "Tabla resultados": <ReporteResultadosEvaluacion />,
  };

  const {
    menu: menuData,
    menuConfig,
    isLoading: loadingMenus,
    error: errorMenu
  } = useMenuData({
    apiUrl: API_URL_SUBMENUS,
    componentMap,
    defaultSelectedValue: 'Instrucciones',
    isVertical: false
  });

  const menu = useMenu(menuData, menuConfig);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Menu menu={menu} />
        {loadingMenus && (
          <Loading/>
        )}

        {errorMenu && (
          <Alert typeAlert={errorMenu.type}>
            <p>{errorMenu.message}</p>
          </Alert>
        )}
        {menu.element}
      </div>

      <Footer />
    </>
  );
};

/*
  const menu = useMenu(
    [
      {
        label: "Instrucciones",
        element: (
          <>
            <Instrucciones />,
          </>
        ),
      },
      {
        label: "Inconformidad",
        element: <Inconformidad />,
      },
      {
        label: "Evaluación",
        element: <Evaluacion />,
      },
      {
        label: "Reportes",
        children: [
          {
            label: "Imprimir acta de instalación",
            element: <ReporteActaAcuerdos />,
          },
          {
            label: "Imprimir acta de evaluaciones",
            element: <ReporteActaEvaluaciones />,
          },
          {
            label: "Imprimir acta de acuerdos",
            element: <ReporteActaSesion />,
          },
          {
            label: "Tabla de resultados de evaluacion",
            element: <ReporteResultadosEvaluacion />,
          },
          {
            label: "Dictamen de no participante",
            element: <ReporteDictamenNoParticipantes />,
          },
          {
            label: "Dictamen final",
            element: <ReporteDictamenFinal />,
          },
          {
            label: "Reporte estadisticos",
            element: <ReimprimirSolicitud />,
          },
        ],
      },
      {
        label: "Vaciados Excel",
        children: [
          {
            label: "Imprimir vaciado a excel",
            onClick: () => handleVaciadosExcelClick(),
          },
          {
            label: "Publicación en Gaceta",
            onClick: () => handlePublicacionGacetaClick(),
          },
          {
            label: "Vaciado a excel (T. Part.)",
            onClick: () => handleVaciadosExcelTPartClick(),
          },
          {
            label: "Vaciado a excel general",
            onClick: () => handleVaciadosExceGeneralClick(),
          },
        ],
      },
      {
        label: "Generar Inconformidad",
        element: <GenerarInconformidad />,
      },
      {
        label: "Administración",
        element: <p>Contenido de la Administración</p>,
        children: [
          {
            label: "Comisiones",
            element: <p>Comisiones</p>,
          },
          {
            label: "Estadísticas",
            element: <p>Estadisticas</p>,
          },
          {
            label: "Modificar usuario",
            element: <p>Modificar usuario</p>,
          },
          {
            label: "Nuevo usuario",
            element: <p>Nuevo usuario</p>,
          },
          {
            label: "Incumplimiento de académico",
            element: <p>Incumplimiento de académico</p>,
          },
          {
            label: "Editar solicitud",
            element: <p>Editar solicitud</p>,
          },
          {
            label: "Activar / inactivar solicitud",
            element: <ActivarInactivarSolicitud />,
          },
          {
            label: "Reimprimir Solicitud",
            element: <ReimprimirSolicitud />,
          },
          
        ],
      },
      {
        label: "Publicaciones",
        element: <p>Publicaciones</p>,
      },
    ],
    {
      selectedValue: "Desempeño docente",
      isVertical: false,
    }
  );*/