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
    "Enviar Solicitud": <EnviarSolicitud />,
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
  if (!puedeEnviarSolicitud) {
    console.log("filteredMenuResponse", filteredMenuResponse);
    filteredMenu = filteredMenuResponse.filter((menu) => {
      return menu.nombreCorto !== "Enviar Solicitud";
    });

  } else {
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

        {/* Tarjeta / Banner superior de Modalidad y Estatus */}
        <div style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "0.85rem 1.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              background: isRatifiedInEvaluation ? "#fefce8" : "#eff6ff",
              border: isRatifiedInEvaluation ? "1px solid #fde047" : "1px solid #dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              color: isRatifiedInEvaluation ? "#ca8a04" : "#1b396a",
              flexShrink: 0
            }}>
              <FontAwesomeIcon icon={isRatifiedInEvaluation ? faAward : faLayerGroup} />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>
                  {isRatifiedInEvaluation ? "Modalidad: Ratificación de Nivel" : "Modalidad: Convocatoria Vigente"}
                </span>
                {isRatifiedInEvaluation ? (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    background: "#fef9c3",
                    color: "#854d0e",
                    border: "1px solid #fde047",
                    padding: "0.2rem 0.65rem",
                    borderRadius: "20px",
                    fontWeight: "800",
                    fontSize: "0.75rem",
                    letterSpacing: "0.03em"
                  }}>
                    <FontAwesomeIcon icon={faClock} style={{ fontSize: "0.75rem" }} /> EN EVALUACIÓN
                  </span>
                ) : (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    background: "#f1f5f9",
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    padding: "0.2rem 0.65rem",
                    borderRadius: "20px",
                    fontWeight: "700",
                    fontSize: "0.75rem",
                    letterSpacing: "0.02em"
                  }}>
                    PROCESO ACTIVO
                  </span>
                )}
              </div>

              <div style={{ fontSize: "0.825rem", color: "#64748b", marginTop: "2px" }}>
                {isRatifiedInEvaluation
                  ? `Solicitud registrada para conservar ${ratifiedLevel} • En espera para la revisión por la Comisión Dictaminadora`
                  : "Participación con evaluación de expediente • Puedes cambiar a ratificar tu nivel actual"}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsRatificacionModalOpen(true)}
            style={{
              background: isRatifiedInEvaluation ? "#ffffff" : "#1b396a",
              color: isRatifiedInEvaluation ? "#1b396a" : "#ffffff",
              border: isRatifiedInEvaluation ? "1.5px solid #1b396a" : "none",
              padding: "0.5rem 1.1rem",
              borderRadius: "6px",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
              transition: "all 0.2s ease"
            }}
          >
            <FontAwesomeIcon icon={faRotate} />
            {isRatifiedInEvaluation ? "Cambiar a ser evaluado en la convocatoria actual" : "Cambiar a Ratificación de Nivel"}
          </button>
        </div>

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

