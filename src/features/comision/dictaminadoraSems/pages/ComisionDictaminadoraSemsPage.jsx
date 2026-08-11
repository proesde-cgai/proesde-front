import React, { useEffect, useState } from "react";
import styles from "./styles/ComisionDictaminadoraSemsPage.module.css";
import axios from "axios";
import { Menu, useMenu } from "../../../../reutilizable/Menu";
import { useAuthStore } from "../../../../store/useAuthStore";
import { Footer, Header } from "../../../layout";
import { BusquedaAvanzada } from "../../components/BusquedaAvanzada";
import Evaluacion from "../../../evaluacion/components/Evaluacion";
import ReporteActaAcuerdos from "../../../reportes/components/ReporteActaAcuerdos";
import ReporteActaSesion from "../../../reportes/components/ReporteActaSesion";
import ReporteActaEvaluaciones from "../../../reportes/components/ReporteActaEvaluaciones";
import ReporteResultadosEvaluacion from "../../../reportes/components/ReporteResultadosEvaluacion";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_SUBMENUS = `${API_BASE_URL}/api/v1/actividad/comision_especial_dictaminadora_ag`;

export const ComisionDictaminadoraSemsPage = () => {

  const accessToken = useAuthStore((state) => state.accessToken);
  const userInfo = useAuthStore((state) => state.userInfo);



  const [menuResponse, setMenuResponse] = useState([]);

  const componentMap = {
    "Realizar evaluación" : <Evaluacion />,
    "Instalación" :<ReporteActaAcuerdos />,
    "Sesión(es)": <ReporteActaSesion />,
    "Asignación de puntaje y nivel" : <ReporteActaEvaluaciones />,
    "Tabla resultados" : <ReporteResultadosEvaluacion />,
  }


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

        const sortedMenus = (response.data.menus || []).map((menu) => ({
          ...menu,
          submenus: Array.isArray(menu.submenus)
            ? menu.submenus
              .map((submenu) => ({
                ...submenu,
              }))
              .sort((a, b) => (a.orden === b.orden ? a.id - b.id : a.orden - b.orden))
            : [],
        })).sort((a, b) => (a.orden === b.orden ? a.id - b.id : a.orden - b.orden));

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
            element: componentMap[submenu.nombreCorto] || <p>{submenu.nombreCorto}</p>,
          })),
        }
        : {
          element: componentMap[menu.nombreCorto] || <p>{menu.nombreCorto}</p>,
        }),
    })),
    { selectedValue: "Instrucciones", isVertical: false }
  );

  return (
    <div className={styles.jefe_departamento_page_container}>
      <Header />
      <Menu menu={menu} />
      {menu.element}
      <Footer />
    </div>
  );
};

