import React, { useState, useEffect, useCallback } from "react";
import Loading from "../../../../../reutilizable/Loading";
import AsideSecretaria from "../../../components/AsideSecretaria";
import { useMenu, Menu } from "../../../../../reutilizable/Menu";
import { useEvaluationStore } from "../../../../../store/useEvaluationStore";
import MensajeEvaluacion from "../../../../evaluacion/components/MensajeEvaluacion";

import DatosInconformidad from "../component/DatosInconformidad";
import CotejosInconformidad from "../component/CotejoInconformidad";
import SubirInconformidad from "../component/SubirInconformidad";
import GenerarInconformidad from "../component/GenerarInconformidad";

import styles from "./DocInconformidad.module.css";
import { DatosParticipante } from "../../../components/DatosParticipante";

const DocInconformidad = () => {
  const [isLoading, setIsLoading] = useState();
  const { selectedDataAcademico } = useEvaluationStore();
  const hasSelected = useEvaluationStore((state) => state.hasSelectedDataAcademico());
  const resetSelectedDataAcademico = useEvaluationStore((state) => state.resetSelectedDataAcademico);

  const [idSolicitud, setIdSolicitud] = useState(null);
  const [mensajeDescarga, setMensajeDescarga] = useState({
    type: null,
    mensajeDescarga: null,
  });

  useEffect(() => {
    resetSelectedDataAcademico();
  }, [resetSelectedDataAcademico]);

  useEffect(() => {
    if (!selectedDataAcademico) return;
    setIdSolicitud(selectedDataAcademico.id);
  }, [selectedDataAcademico]);

  const menu = useMenu(
    [
      {
        label: "Datos participante",
        element: <DatosParticipante />,
      },
      {
        label: "Datos Inconformidad",
        element: <DatosInconformidad />,
      },
      {
        label: "Cotejos de Inconformidad",
        element: <CotejosInconformidad />,
      },
      {
        label: "Generar Documento",
        element: <GenerarInconformidad />,
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
        <AsideSecretaria alias="inconformidad" />
      </div>

      {hasSelected ? (
        <div className={styles.containerContent}>
          <div className={styles.containerMenu}>
            {selectedDataAcademico.nombre && (
              <div className={styles.nombreAcademico}>
                <p>{`${selectedDataAcademico.nombre} ${selectedDataAcademico.apellidoPaterno} ${selectedDataAcademico.apellidoMaterno}`}</p>
              </div>
            )}

            <div className={styles.menu}>
              <Menu menu={menu} />
              <div className={styles.optionMenu}>{menu.element}</div>
            </div>
          </div>
        </div>
      ) : (
        <MensajeEvaluacion />
      )}
    </div>
  );
};

export default DocInconformidad;
