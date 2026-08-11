import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import Aside from "../../../reutilizable/Aside";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import Mensaje from "../../../reutilizable/components/Mensaje";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import Evaluar from "../../contralor/components/Evaluar";
import { Requisitos } from "../../contralor/components/Requisitos";
import { DatosParticipante } from "../../visorDeDocumentos/components/DatosParticipante";
import { Actas } from "../components/Actas";
import VisualizacionAsignacionNivel from "../verEvaluaciones/visualizacion-asignacion-nivel/page/VisualizacionAsignacionNivel";
import Inconformidad from "./pages/Inconformidad";
import SolicitudPage from "./pages/SolicitudPage";
import styles from "./styles/expediente.module.css";

const Expediente = () => {
  const { selectedDataAcademico } = useEvaluationStore();
  const [cotejoStatus, setCotejoStatus] = useState(null);
  const hasSelected = useEvaluationStore((state) =>
    state.hasSelectedDataAcademico()
  );
  const resetSelectedDataAcademico = useEvaluationStore(
    (state) => state.resetSelectedDataAcademico
  );
  const [estadosSolicitud, setEstadosSolicitud] = useState([]);

  const finalSubmenus = useMemo(() => {
    const submenusFiltered = [
      {
        label: "Datos participante",
        element: <DatosParticipante />,
      },
      {
        label: "Documentos sujetos a evaluación",
        children: [
          {
            label: "Requisitos",
            element: <Requisitos />,
          },
          {
            label: "Rubros de evaluación",
            element: <Evaluar withHead={false} />,
          },
        ],
      },
      {
        label: "Subir Documento",
        element: <Actas />,
      },
    ];

    // Solicitud visible desde status 4 (EVALUAR) en adelante
    if ((selectedDataAcademico?.status || 0) >= 4) {
      submenusFiltered.splice(1, 0, {
        label: "Solicitud",
        element: <SolicitudPage />,
      });
    }

    // Visualizar Asignación de Nivel visible con statusCotejo [3, 4, 5, 7, 8, 9, 10, 13, 14, 15, 16]
    const validStatusVizualizarAsignacionNivel = [3, 4, 5, 7, 8, 9, 10, 13, 14, 15, 16];
    if (validStatusVizualizarAsignacionNivel.includes(cotejoStatus)) {
      submenusFiltered.push({
        label: "Visualizar Asignación de nivel",
        element: <VisualizacionAsignacionNivel />,
      });
    }

    const validStatusInconformidad = [13, 14, 15, 16];
    if (validStatusInconformidad.includes(cotejoStatus)) {
      submenusFiltered.push({
        label: "Inconformidad",
        element: <Inconformidad />,
      });
    }

    return submenusFiltered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cotejoStatus, selectedDataAcademico]);

  useEffect(() => {
    if (!selectedDataAcademico?.id) return;

    const fetchCotejoStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/cotejo-documentos/status?idSolicitud=${selectedDataAcademico?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al consultar el estado de cotejo");
        }
        const data = await response.json();
        setCotejoStatus(data);
      } catch (err) {
        console.error("Error fetching Cotejo status:", err);
      }
    };

    fetchCotejoStatus();
  }, [selectedDataAcademico?.id]);

  const menu = useMenu(finalSubmenus, {
    customClass: {
      menu: styles.menuContainer,
      menuOption: styles.menuOption,
      subMenuOption: styles.subMenuOption,
      selected: styles.selected,
    },
  });

  useEffect(() => {
    if (selectedDataAcademico && menu.resetToFirst) {
      menu.resetToFirst();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDataAcademico?.id]);

  const getEstadosSolicitud = async () => {
    const API_URL_ESTADOS_SOLICITUD = `${process.env.REACT_APP_API_BASE_URL}/api/v1/expediente/catalogos/estados-solicitud`;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(API_URL_ESTADOS_SOLICITUD, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setEstadosSolicitud(response.data);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  useEffect(() => {
    getEstadosSolicitud();
  }, [selectedDataAcademico]);

  useEffect(() => {
    resetSelectedDataAcademico();
  }, [resetSelectedDataAcademico]);

  return (
    <div className={styles.container}>
      <div className={styles.containerAside}>
        <Aside selectVisible={true} alias="ver_expediente" />
      </div>

      {hasSelected ? (
        <div className={styles.containerContent}>
          <div className={styles.containerMenu}>
            {selectedDataAcademico?.nombre && (
              <div className={styles.nombreAcademico}>
                <p>{`${selectedDataAcademico?.nombre} ${selectedDataAcademico?.apellidoPaterno} ${selectedDataAcademico?.apellidoMaterno}`}</p>
                <div className={styles.estadoSolicitudContainer}>
                  <div className={styles.estadoSolicitudRounded} />
                  <p className={styles.estadoSolicitudText}>Estatus</p>
                  <p className={styles.estadoSolicitudTextStatus}>
                    {selectedDataAcademico?.statusDescripcion}
                  </p>
                </div>
              </div>
            )}

            <div className={styles.menu}>
              <Menu menu={menu} />
              <div className={styles.optionMenu}>{menu.element}</div>
            </div>
          </div>
        </div>
      ) : (
        <Mensaje nombreModulo={"Ver Expediente"} />
      )}
    </div>
  );
};

export default Expediente;
