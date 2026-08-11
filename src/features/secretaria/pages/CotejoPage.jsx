import React, { useEffect } from "react";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import MensajeEvaluacion from "../../evaluacion/components/MensajeEvaluacion";
import AsideSecretaria from "../components/AsideSecretaria";
import { DatosParticipante } from "../components/DatosParticipante";
import DescargarDocumentoSolicitud from "../components/DescargarDocumentoSolicitud";
import ComentariosCotejo from "./ComentariosCotejo";
import CotejoCriteriosPage from "./CotejoCriteriosPage";
import CotejoRequisitosPage from "./CotejoRequisitosPage";
import styles from "./styles/CotejoPage.module.css";

const CotejoPage = () => {
  const { selectedDataAcademico } = useEvaluationStore();
  const hasSelected = useEvaluationStore((state) => state.hasSelectedDataAcademico());
  const resetSelectedDataAcademico = useEvaluationStore((state) => state.resetSelectedDataAcademico);

  useEffect(() => {
    resetSelectedDataAcademico();
  }, [resetSelectedDataAcademico]);

  const menu = useMenu(
    [
      {
        label: "Datos participante",
        element: <DatosParticipante />,
      },
      {
        label: "Requisitos",
        element: <CotejoRequisitosPage />,
      },
      {
        label: "Rubros de evaluación",
        element: <CotejoCriteriosPage />,
      },
      {
        label: "Enviar Cotejo",
        element: <ComentariosCotejo />,
      },
      {
        label: "Generar Solicitud",
        element: <DescargarDocumentoSolicitud />,
      },
    ],
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
        <AsideSecretaria alias="cotejo" />
      </div>

      {hasSelected ? (
        <div className={styles.containerContent}>
          <div className={styles.containerMenu}>
            {selectedDataAcademico.nombre && (
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
              <div className={styles.optionMenu}>{menu.element}</div>
            </div>
          </div>
        </div>
      ) : (
        <MensajeEvaluacion nombreModulo={"cotejo de documentos"} />
      )}
    </div>
  );
};

export default CotejoPage;
