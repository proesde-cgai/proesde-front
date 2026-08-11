import React, { useEffect, useMemo, useState } from 'react';
import { Menu, useMenu } from '../../../../reutilizable/Menu';
import { useEvaluationStore } from '../../../../store/useEvaluationStore';
import { Actas } from '../../../administradorConvocatoria/components/Actas';
import Inconformidad from '../../../administradorConvocatoria/expediente/pages/Inconformidad';
import SolicitudPage from '../../../administradorConvocatoria/expediente/pages/SolicitudPage';
import VisualizacionAsignacionNivel from '../../../administradorConvocatoria/verEvaluaciones/visualizacion-asignacion-nivel/page/VisualizacionAsignacionNivel';
import Evaluar from '../../../contralor/components/Evaluar';
import { Requisitos } from '../../../contralor/components/Requisitos';
import AsideSecretaria from '../../components/AsideSecretaria';
import { DatosParticipante } from '../../components/DatosParticipante';
import styles from '../styles/VerExpedientePage.module.css';

const VerExpedientePage = () => {
  const { selectedDataAcademico } = useEvaluationStore();
  const [cotejoStatus, setCotejoStatus] = useState(null);
  const resetSelectedDataAcademico = useEvaluationStore((state) => state.resetSelectedDataAcademico);

  useEffect(() => {
    resetSelectedDataAcademico();
  }, [resetSelectedDataAcademico]);


  const finalSubmenus = useMemo(() => {
    const submenusFiltered = [
      {
        label: 'Datos participante',
        element: <DatosParticipante />,
      },
      {
        label: 'Documentos sujetos a evaluación',
        children: [
          {
            label: 'Requisitos',
            element: <Requisitos />
          },
          {
            label: 'Rubros de evaluación',
            element: <Evaluar withHead={false} />
          },
        ],
      },
      {
        label: "Subir documentos",
        element: <Actas />,
      },
    ]

    const validStatusSolicitud = [4];
    const validStatusVizualizarAsignacionNivel = [3, 4, 7, 8, 9, 10];
    const validStatusInconformidad = [13, 14, 15, 16];
    if (validStatusSolicitud.includes(selectedDataAcademico?.status || 0)) {
      submenusFiltered.push({
        label: "Solicitud",
        element: <SolicitudPage />
      });
    }

    if (validStatusVizualizarAsignacionNivel.includes(cotejoStatus)) {
      submenusFiltered.push({
        label: "Visualizar Asignación de nivel",
        element: <VisualizacionAsignacionNivel />,
      });
    }

    if (validStatusInconformidad.includes(cotejoStatus)) {
      submenusFiltered.splice(1, 0, {
        label: "Solicitud",
        element: <SolicitudPage />,
      });
      submenusFiltered.push({
        label: "Inconformidad",
        element: <Inconformidad />,
      });
      submenusFiltered.push({
        label: "Visualizar Asignación de nivel",
        element: <VisualizacionAsignacionNivel />,
      });
    }

    return submenusFiltered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cotejoStatus, selectedDataAcademico]);


  useEffect(() => {
    const fetchCotejoStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/cotejo-documentos/status?idSolicitud=${selectedDataAcademico?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (!response.ok) {
          throw new Error('Error al consultar el estado de cotejo');
        }
        const data = await response.json();
        setCotejoStatus(data);
      } catch (err) {
        console.error('Error fetching Cotejo status:', err);
      }
    };

    if (selectedDataAcademico?.id) {
      fetchCotejoStatus();
    }
  }, [selectedDataAcademico?.id]);

  // Limpiar el estado del académico seleccionado cuando el componente se desmonte
  useEffect(() => {
    return () => {
      resetSelectedDataAcademico();
    };
  }, [resetSelectedDataAcademico]);

  const menu = useMenu(
    finalSubmenus,
    {
      customClass: {
        menu: styles.menuContainer,
        menuOption: styles.menuOption,
        subMenuOption: styles.subMenuOption,
        selected: styles.selected,
      },
    }
  );

  return (
    <div className={styles.container}>
      <div className={styles.containerAside}>
        <AsideSecretaria />
      </div>

      <div className={styles.containerContent}>
        <div className={styles.containerMenu}>
          {selectedDataAcademico?.nombre && (
            <div className={styles.nombreAcademico}>
              <p>{`${selectedDataAcademico.nombre} ${selectedDataAcademico.apellidoPaterno} ${selectedDataAcademico.apellidoMaterno}`}</p>
              <div className={styles.estadoSolicitudContainer}>
                <div className={styles.estadoSolicitudRounded} />
                <p className={styles.estadoSolicitudText}>Estatus</p>
                <p className={styles.estadoSolicitudTextStatus}>{selectedDataAcademico?.statusDescripcion}</p>
              </div>
            </div>
          )}

          <div className={styles.menu}>
            <Menu menu={menu} />
            <div className={styles.optionMenu}>
              {menu.element}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerExpedientePage;