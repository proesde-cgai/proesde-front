import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import useNotiInconformidadStore from "../../../store/useNotiInconformidadStore";
import { useSearchStore } from "../../../store/useSearchStore";
import ActivarInactivaSolicitud from "../../administradorConvocatoria/activarInactivarSolicitud/ActivarInactivarSolicitud";
import { Footer, Header } from "../../layout";
import ActualizarIntegranteComision from "../ActualizarIntegrantesComision/ActualizarIntegranteComision";
import BloquearDesbloquearAcademico from "../bloquearDesbloquearAcademico/bloquearDesbloquearAcademico";
import SendNotification from "../components/SendNotification";
import CreacionComisionEspecial from "../creacionComisionEspecial/CreacionComisionEspecial";
import Expediente from "../expediente/Expediente";
import GenerarReporte from "../GenerarReportes/page/GenerarReportePage";
import Inconformidades from "../Inconformidades/pages/InconformidadesPage";
import IncumplimientosAcademico from "../IncumplimientosAcademico/IncumplimientosAcademico";
import PublicacionResultados from "../publicacion-resultados/PublicacionResultados";
import AprobacionJefe from "../AprobaciónJefeDepartamento/AprobacionJefe";
import { SuperPase } from "../superPase/SuperPase";
import styles from "./styles/AdministradorConvocatoriaPage.module.css"
import ReportesExcel from "../reportesExcel/ReportesExcel";
import ConsultaConvocatorias from "../consultaConvocatorias/ConsultaConvocatorias";
import RespaldarHistorico from "../respaldarHistorico/RespaldarHistorico";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_SUBMENUS = `${API_BASE_URL}/api/v1/actividad/admin_convocatoria`;

export const AdministradorConvocatoriaPage = () => {

  const [menuResponse, setMenuResponse] = useState([]);
  const { sendNotiInconformidad, } = useNotiInconformidadStore();
  const clearFormData = useSearchStore(state => state.clearFormData);
  const setQuery = useSearchStore(state => state.setQuery);
  const previousElementRef = useRef(null);


  const componentMap = {
    "Asignación de Nivel": <PublicacionResultados />,
    Administración: <p>componente</p>,
    "Super pase": <SuperPase />,
    "Incumplimientos de académico": <IncumplimientosAcademico />,
    Solicitudes: <ActivarInactivaSolicitud />,
    "Ver expediente": <Expediente />,
    // "Ver evaluaciones": <Evaluacion />,
    "Actualizar integrantes de comisión": <ActualizarIntegranteComision />,
    "Generar reportes estadísticos": <GenerarReporte />,
    Inconformidades: <Inconformidades />,
    "Bloquear/desbloquear académicos": <BloquearDesbloquearAcademico />,
    "Notificar inconformidad": <SendNotification />,
    "Creación de Comision Especial": <CreacionComisionEspecial />,
    "Asignacion Jefe Departamento": <AprobacionJefe />,
    "Reportes Excel": <ReportesExcel />,
    "Consulta Convocatorias": <ConsultaConvocatorias />,
    "Respaldo": <RespaldarHistorico />
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(API_URL_SUBMENUS, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const sortedMenus = (response.data.menus || [])
          .map((menu) => ({
            ...menu,
            submenus: Array.isArray(menu.submenus)
              ? menu.submenus
                .map((submenu) => ({
                  ...submenu,
                }))
                .sort((a, b) => (a.orden === b.orden ? a.id - b.id : a.orden - b.orden))
              : [],
          }))
          .sort((a, b) => (a.orden === b.orden ? a.id - b.id : a.orden - b.orden))
          .filter((menu) => menu.nombreCorto !== "Ver evaluaciones");

        setMenuResponse(sortedMenus);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, []);

  const menu = useMenu(
    menuResponse.map((menu) => ({
      label: menu.nombreCorto,
      ...(menu.submenus.length > 0
        ? {
          children: menu.submenus.map((submenu) => ({
            label: submenu.nombreCorto,
            element:
              typeof componentMap[submenu.nombreCorto] === "function"
                ? null
                : componentMap[submenu.nombreCorto] || <p>{submenu.nombreCorto}</p>,
            onClick:
              typeof componentMap[submenu.nombreCorto] === "function" ? componentMap[submenu.nombreCorto] : null,
          })),
        }
        : {
          element:
            typeof componentMap[menu.nombreCorto] === "function"
              ? null
              : componentMap[menu.nombreCorto] || <p>{menu.nombreCorto}</p>,
          onClick: typeof componentMap[menu.nombreCorto] === "function" ? componentMap[menu.nombreCorto] : null,
        }),
    })),
    { selectedValue: "Instrucciones", isVertical: false }
  );

  useEffect(() => {
    // Comparar el elemento actual con el anterior
    if (previousElementRef.current !== null &&
      previousElementRef.current !== menu.element) {
      clearFormData();
      setQuery("");
    }
    // Actualizar la referencia al elemento actual
    previousElementRef.current = menu.element;
  }, [menu.element, clearFormData, setQuery]);


  return (
    <div className={styles.jefe_departamento_page_container}>
      <Header />
      <Menu menu={menu} />
      {menu.element}
      <Footer />
    </div>
  );
};
