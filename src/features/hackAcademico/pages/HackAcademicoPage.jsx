import React, { useEffect, useState } from "react";
import { Footer, Header } from "../../layout";
import styles from "./styles/HackAcademico.module.css";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import axios from "axios";
import EnviarSolicitud from "../../academico/enviarSolicitud/pages/EnviarSolicitud";
import { VisualizarSolicitud } from "../../academico/visualizarSolicitud/components/visualizarSolicitud";
import ExpedienteRequisitosPage from "../../academico/expediente/pages/ExpedienteRequisitosPage";
import ExpedienteCriteriosPage from "../../academico/expediente/pages/ExpedienteCriteriosPage";
import PlanTrabajoPage from "../../academico/planTrabajo/pages/planTrabajoPage";
import { Solicitud } from "../../academico/llenarSolicitud/components/Solicitud";
import { GenerarInconformidad } from "../../administracion/components/GenerarInconformidad";
import { ModificarSolicitud } from "../../academico/modificarSolicitud/components/ModificarSolicitud";
import { CambioParticipacion } from "../components/CambioParticipacion";
import useStatusStore from "../../../store/useStatusStore";
import { DescargaDocumentos } from "../../academico/descargaDocumentos/components/DescargaDocumentos";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_SUBMENUS = `${API_BASE_URL}/api/v1/actividad/hack_academico`;
const API_URL_STATUS = `${API_BASE_URL}/api/v1/solicitud/status`;
const API_URL_EMAIL_STATUS = `${API_BASE_URL}/api/v1/gaceta/email-status`;


export const HackAcademicoPage = () => {


  const [menuResponse, setMenuResponse] = useState([]);
  const [status, setStatus] = useState(null);
  const [canShowDescargaDocumentos, setCanShowDescargaDocumentos] = useState(false);
  const { setRequestStatus } = useStatusStore();

  const componentMap = {
    "Cambio de Participación": <CambioParticipacion />,
    "Enviar Solicitud": <EnviarSolicitud />,
    Crear: <Solicitud />,
    Consultar: <VisualizarSolicitud />,
    "Plan de trabajo": <PlanTrabajoPage />,
    Requisitos: <ExpedienteRequisitosPage />,
    "Rubros de evaluación": <ExpedienteCriteriosPage />,
    "Generar Inconformidad": <GenerarInconformidad />,
    Modificar: <ModificarSolicitud />,
    "Descarga de Documentos": <DescargaDocumentos />
  };

  

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
        console.log("status hack", response.data);
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
        status !== 1 ||
        (menu.nombreCorto !== "Expediente" &&
          menu.nombreCorto !== "Enviar Solicitud")
    )
    .filter((menu) => canShowDescargaDocumentos || menu.nombreCorto !== "Descarga de Documentos");

  let filteredMenu = [];

  // Mostrar "Enviar Solicitud" sólo cuando status sea 2 o 7
  if (status !== 2 && status !== 7) {
    filteredMenu = filteredMenuResponse.filter(
      (menu) => menu.nombreCorto !== "Enviar Solicitud"
    );
  } else {
    filteredMenu = filteredMenuResponse;
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
