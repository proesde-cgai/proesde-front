import React, { useEffect, useState } from "react";
import axios from "axios";
import { Menu, useMenu } from "../../../../reutilizable/Menu";
import { Footer, Header } from "../../../layout";
import { Instrucciones } from "../../instrucciones/components/Instrucciones";
import { LlenarSolicitudComponent } from "../components/LlenarSolicitudComponent";
import ArmarExpedientePage from "../../expediente/pages/ArmarExpedientePage";
import ExpedienteCriteriosPage from "../../expediente/pages/ExpedienteCriteriosPage";
import ExpedienteRequisitosPage from "../../expediente/pages/ExpedienteRequisitosPage";
import { VisualizarSolicitud } from "../../visualizarSolicitud/components/visualizarSolicitud";
import { ModificarSolicitud } from "../../modificarSolicitud/components/ModificarSolicitud";
import PlanTrabajoPage from "../../planTrabajo/pages/planTrabajoPage";
import styles from "./llenarSolicitud.module.css";
import { GenerarInconformidad } from "../../../administracion/components/GenerarInconformidad";
import { Solicitud } from "../components/Solicitud";
import EnviarSolicitud from "../../enviarSolicitud/pages/EnviarSolicitud";
import useStatusStore from "../../../../store/useStatusStore";
import { CambioParticipacion } from "../../../hackAcademico/components/CambioParticipacion";
import { DescargaDocumentos } from "../../descargaDocumentos/components/DescargaDocumentos";

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_SUBMENUS = `${API_BASE_URL}/api/v1/actividad/academico`;
const API_URL_STATUS = `${API_BASE_URL}/api/v1/solicitud/status`;
const API_URL_EMAIL_STATUS = `${API_BASE_URL}/api/v1/gaceta/email-status`;

export const LlenarSolicitudPage = () => {
  const [menuResponse, setMenuResponse] = useState([]);
  const [status, setStatus] = useState(null);
  const [canShowDescargaDocumentos, setCanShowDescargaDocumentos] = useState(false);
  const { setRequestStatus } = useStatusStore();

  const componentMap = {
    Crear: <Solicitud />,
    Enviar: <EnviarSolicitud />,
    Modificar: <ModificarSolicitud />,
    Consultar: <VisualizarSolicitud />,
    Expediente: <ArmarExpedientePage />,
    Requisitos: <ExpedienteRequisitosPage />,
    "Rubros de evaluación": <ExpedienteCriteriosPage />,
    "Plan de trabajo": <PlanTrabajoPage />,
    "Generar Inconformidad": <GenerarInconformidad />,
    "Enviar Solicitud" : <EnviarSolicitud />,
    "Cambio de Participación": <CambioParticipacion />,
    "Descarga de Documentos": <DescargaDocumentos />,
  };

  // Obtener el estado
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios
      .get(API_URL_STATUS, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("status", response.data);
        setRequestStatus(parseInt(response.data.status))
        setStatus(parseInt(response.data.status));
      })
      .catch((error) => console.error("Error fetching status: ", error));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchEmailStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(API_URL_EMAIL_STATUS, {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const flag = response.data === true || response.data === "true";
        setCanShowDescargaDocumentos(flag);
      } catch (error) {
        console.error("Error fetching email status: ", error);
        setCanShowDescargaDocumentos(false);
      }
    };

    fetchEmailStatus();
  }, []);

  console.log("Current status: ", status)


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
        console.log("response.data.menus ", response.data.menus);
        const sortedMenus = (response.data.menus || [])
          .map((menu) => ({
            ...menu,
            submenus: Array.isArray(menu.submenus)
              ? menu.submenus
                .map((submenu) => ({
                  ...submenu,
                }))
                .sort((a, b) => (a.orden === b.orden ? a.id - b.id : a.orden - b.orden))
              : [], // Handle missing or invalid `submenus`
          }))
          .sort((a, b) => (a.orden === b.orden ? a.id - b.id : a.orden - b.orden));
        console.log("response.data.menus ", response.data);
        setMenuResponse(sortedMenus);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, []);

  const filteredMenuResponse = menuResponse
    .map((menu) => {
      let submenus = Array.isArray(menu.submenus) ? menu.submenus : [];

      if (!canShowDescargaDocumentos) {
        submenus = submenus.filter((submenu) => submenu.nombreCorto !== "Descarga de Documentos");
      }

      if (status <= 1) {
        submenus = submenus.filter((submenu) => submenu.nombreCorto !== "Modificar");
      }

      return { ...menu, submenus };
    })
    .filter(
      (menu) =>
        (status !== 1) ||
        menu.nombreCorto !== "Expediente" ||
        menu.nombreCorto !== "Enviar Solicitud"
    )
    .filter((menu) => canShowDescargaDocumentos || menu.nombreCorto !== "Descarga de Documentos");
  
  // Permite mostrar "Enviar Solicitud" si status === 2 o status === 7
  const puedeEnviarSolicitud = status === 2 || status === 7;
  
  let filteredMenu = []
  if(!puedeEnviarSolicitud){
    console.log("filteredMenuResponse", filteredMenuResponse);
    filteredMenu = filteredMenuResponse.filter((menu) => {
      return  menu.nombreCorto !== "Enviar Solicitud";
    });

  }else{
    filteredMenu = filteredMenuResponse
  }
  
  const menu = useMenu(
    filteredMenu.map((menu) => ({
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
    <>
      <div>
        <Header />
        <Menu menu={menu} />
        {menu?.element}
        <Footer />
      </div>
    </>
  );
};
