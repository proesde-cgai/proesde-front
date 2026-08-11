import React, { useEffect, useState } from "react";
import { Footer, Header } from "../../layout";
import styles from "./styles/JefeDepartamentoPage.module.css";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import CartaDesempeñoDocente from "../components/CartaDesempeñoDocente";
import { useAuthStore } from "../../../store/useAuthStore";
import EvaluationPage from "../../evaluarestudiante/pages/EvaluationPage";
import QRValidatorPage from "../../qr-cartas/pages/QRValidatorPage";
import CargaHorariaPage from "../components/carga_horaria/page/CargaHorariaPage";
import axios from "axios";
import EvaluacionEstudiantePage from "../evaluacion_estudiante/pages/EvaluacionEstudiantePage";
import EvaluacionEstudiantePageMain from "../evaluacion_estudiante/pages/EvaluacionEstudiantePageMain";
import CumplimientoTrabajo from "../cumplimiento_plan_trabajo/pages/CumplimientoTrabajo";
import ValidacionPlanTrabajoPage from "../components/validacion_plan_trabajo/page/ValidacionPlanTrabajoPage";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_SUBMENUS = `${API_BASE_URL}/api/v1/actividad/jefe_depto`;

export const JefeDepartamentoPage = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const userInfo = useAuthStore((state) => state.userInfo);

  const [menuResponse, setMenuResponse] = useState([]);

  const componentMap = {
    "Desempeño docente": <CartaDesempeñoDocente userInfo={userInfo.username}/>,
    "Evaluación de estudiantes": <EvaluacionEstudiantePageMain userInfo={userInfo.username} />,
    "Carga horaria": <CargaHorariaPage userInfo={userInfo?.username} />,
    "Cumplimiento de plan de trabajo": <CumplimientoTrabajo />,
    "Validación de plan de trabajo": <ValidacionPlanTrabajoPage userInfo={userInfo.username} />,
    "Validación QR": <QRValidatorPage />,
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


 /*
  const menu = useMenu(
    [
      {
        label: "Desempeño docente",
        element: (
          <>
            
            <CartaDesempeñoDocente userInfo={userInfo.username}/>
          </>
        ),
      },
      {
        label: "Evaluación de estudiantes",
        element: <EvaluationPage/>,
      },
      {
        label: "Carga horaria",
        element: <><CargaHorariaPage userInfo={userInfo.username}/></>,
      },
      {
        label: "Cumplimiento de plan de trabajo",
        element: <p>Oficio de cumplimiento de plan de trabajo</p>,
      },{
        label: "Validación de plan de trabajo",
        element: <p>Oficio de validación de plan de trabajo</p>,
      },{
        label: "Validación de QR",
        element: <QRValidatorPage/>,
      }
    ],
    {
      selectedValue: "Desempeño docente",
      isVertical: false,
    }
  );*/