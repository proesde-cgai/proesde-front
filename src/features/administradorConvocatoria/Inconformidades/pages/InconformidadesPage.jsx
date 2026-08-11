import React, { useEffect, useState } from "react";
import { Menu, useMenu } from "../../../../reutilizable/Menu";
import Aside from "../../../../reutilizable/Aside"; //maybe change later 
import MensajeEvaluacion from '../../../evaluacion/components/MensajeEvaluacion';
import { useEvaluationStore } from '../../../../store/useEvaluationStore';
import styles from "./Inconformidades.module.css";
import DatosInconformidad from "../../../secretaria/secretariaAdminSems/GenerarDocInconformidad/component/DatosInconformidad";
import CotejosInconformidad from "../../../secretaria/secretariaAdminSems/GenerarDocInconformidad/component/CotejoInconformidad";
import SubirInconformidad from "../../../secretaria/secretariaAdminSems/GenerarDocInconformidad/component/SubirInconformidad";
import GenerarInconformidad from "../../../secretaria/secretariaAdminSems/GenerarDocInconformidad/component/GenerarInconformidad";
import SelectInconformidad from "../../../../reutilizable/SelectInconformidad";
import { DatosParticipante } from "../../../secretaria/components/DatosParticipante";


const Inconformidades = () => {
  const { selectedDataAcademico } = useEvaluationStore();
  const hasSelected = useEvaluationStore(state => state.hasSelectedDataAcademico());
  const resetSelectedDataAcademico = useEvaluationStore(state => state.resetSelectedDataAcademico);
  const [selectedDependencia, setSelectedDependencia] = useState(null);

  const menu = useMenu(
    [
      {
        label: "Datos participante",
        element: <DatosParticipante />,
      },
      {
        label: "Datos de Inconformidad",
        element: <DatosInconformidad />
      },
      {
        label: "Cotejos de Inconformidad",
        element: <CotejosInconformidad />
      },
      {
        label: "Generar Documento",
        element: <GenerarInconformidad />
      },
    ],
    {
      customClass: {
        menu: styles.menuContainer,
        menuOption: styles.menuOption,
        subMenuOption: styles.subMenuOption,
        selected: styles.selected,
      },
      defaultSelection: 0,
    }
  );

  useEffect(() => {
    resetSelectedDataAcademico();
  }, [resetSelectedDataAcademico])

  return (
    <div className={styles.container}>
      <div className={styles.containerAside}>
        <SelectInconformidad
          placeholder="Seleccionar"
          onChange={(option) => {
            console.log("Opción seleccionada:", option);
            setSelectedDependencia(option);
          }}
        />
        <Aside alias="inconformidades" selectedDependencia={selectedDependencia}/>
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
              <div className={styles.optionMenu}>
                {menu.element}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <MensajeEvaluacion />
      )}
    </div>
  );
};

export default Inconformidades;
