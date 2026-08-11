import React, { useEffect } from "react";
import { Menu, } from "../../../reutilizable/Menu";
import Aside from "../../../reutilizable/Aside";
import Instrucciones from "../components/Instrucciones";
import Evaluar from "./Evaluar";
import Notas from "../../evaluacion/components/Notas";
import RequisitosInconformidadPage from "./RequisitosInconformidadPage";
import { DatosParticipante } from "../../visorDeDocumentos/components/DatosParticipante";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import styles from "./styles/ExpedienteInconformidad.module.css";
import DatosInconformidad from "../../secretaria/secretariaAdminSems/GenerarDocInconformidad/component/DatosInconformidad";
import { DictamenNoParticipantes } from "../components/DictamenNoParticipantes";
import DictamenFinal from "../components/DictamenFinal";
import { useInconformidadStore } from "../../../store/useInconformidadStore";
import Alert from "../../../reutilizable/Alert";
import Loading from "../../../reutilizable/Loading";
import useMenu from "../../../hooks/useMenuItems";

const ExpedienteInconformidad = () => {
  const { selectedDataAcademico, isLoading } = useEvaluationStore();
  const { errorInconformidad, selectedDataAcademicoFull, isLoadingInconformidad, esParticipante, razonesNoParticipante, } = useInconformidadStore();
  
  const participante = esParticipante();
  const menuItems = useInconformidadStore((state) => state.menuItems());
  const hasSelected = useEvaluationStore((state) =>
    state.hasSelectedDataAcademico()
  );
  const resetSelectedDataAcademico = useEvaluationStore(
    (state) => state.resetSelectedDataAcademico
  );

  const { useMenuItems, } = useMenu();
  
  const menu = useMenuItems(menuItems, {
    customClass: {
      menu: styles.menuContainer,
      menuOption: styles.menuOption,
      subMenuOption: styles.subMenuOption,
      selected: styles.selected,
    },
  });

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  useEffect(() => {
    resetSelectedDataAcademico();
  }, [resetSelectedDataAcademico]);

  return (
    <div className={styles.container}>
      <div className={styles.containerAside}>
        <Aside alias="lista_inconformidades" />
      </div>
  
      {isLoadingInconformidad ? (
        <div className={styles.containerContent}>
          <Loading />
        </div>
      ) : (
        hasSelected ? (
          <div className={styles.containerContent}>
            <div className={styles.containerMenu}>
              {errorInconformidad && (
                <Alert typeAlert={"error"}>
                  <p>{errorInconformidad}</p>
                </Alert>
              )}
              {selectedDataAcademico?.nombre && (
                <div className={styles.nombreAcademico}>
                  <p>{`${selectedDataAcademico?.nombre} ${selectedDataAcademico?.apellidoPaterno} ${selectedDataAcademico?.apellidoMaterno}`} {!participante && ('(No Participante)')}</p>
                  {!participante && (
                  <p>Razones: {razonesNoParticipante()}</p>)}
                </div>
              )}
  
              <div className={styles.menu}>
                <Menu menu={menu} />
                <div className={styles.optionMenu}>{menu.element}</div>
              </div>
            </div>
          </div>
        ) : (
          <Instrucciones />
        )
      )}
    </div>
  );
  
};

export default ExpedienteInconformidad;
