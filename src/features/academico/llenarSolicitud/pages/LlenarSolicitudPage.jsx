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
import { RatificacionModal } from "../../components/RatificacionModal/RatificacionModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faRotate, faAward, faLayerGroup } from "@fortawesome/free-solid-svg-icons";

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

  // Estados para la ventana de Ratificación de Nivel (Docente)
  const [isRatificacionModalOpen, setIsRatificacionModalOpen] = useState(true);
  const [isRatifiedInEvaluation, setIsRatifiedInEvaluation] = useState(false);
  const [ratifiedLevel, setRatifiedLevel] = useState("Nivel VII");

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

  const handleRatifyConfirm = (level) => {
    setIsRatifiedInEvaluation(true);
    setRatifiedLevel(level || "Nivel VII");
  };

  const handleParticipateConfirm = () => {
    setIsRatifiedInEvaluation(false);
  };

  return (
    <>
      <div>
        <Header />

        {/* Barra de estado de Ratificación (solo visible si está En Evaluación) o botón de acceso */}
        {isRatifiedInEvaluation && (
          <div style={{
            background: "#fffbebf7",
            borderBottom: "1px solid #fde68a",
            padding: "0.5rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.875rem", color: "#92400e" }}>
              <FontAwesomeIcon icon={faClock} style={{ color: "#b45309" }} />
              <span>
                <strong>Solicitud de Ratificación ({ratifiedLevel}):</strong> Estatus actual:{" "}
                <span style={{
                  background: "#b45309",
                  color: "#ffffff",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "0.775rem"
                }}>
                  EN EVALUACIÓN
                </span>
              </span>
            </div>

            <button
              onClick={() => setIsRatificacionModalOpen(true)}
              style={{
                background: "#1b396a",
                color: "#ffffff",
                border: "none",
                padding: "0.35rem 0.75rem",
                borderRadius: "4px",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <FontAwesomeIcon icon={faRotate} /> Ratificación / Convocatoria
            </button>
          </div>
        )}

        <Menu menu={menu} />
        {menu?.element}
        <Footer />
      </div>

      {/* Modal de Ratificación de Nivel para el Docente */}
      <RatificacionModal
        isOpen={isRatificacionModalOpen}
        onClose={() => setIsRatificacionModalOpen(false)}
        onRatifyConfirm={handleRatifyConfirm}
        onParticipateConfirm={handleParticipateConfirm}
        nivelActual={ratifiedLevel}
      />
    </>
  );
};

