import React, { useEffect, useRef, useState } from "react";
import Alert from "../../../reutilizable/Alert";
import { obtenerSubMenuCriteriosCotejo } from "../services/cotejoCriteriosService";
import TablaCriteriosCotejo from "./TablaCriteriosCotejo";
import { ERROR_MESSAGES_GENERICS_API } from "../../../utils/messagesFromAPI";
import styles from "./styles/CriteriosCotejo.module.css";
import useCotejoStore from "../../../store/useCotejoStore";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import Loading from "../../../reutilizable/Loading";

const CriteriosCotejo = ({ idSolicitud, idMenu, menuInicial }) => {
  const { esCotejadoRubros } = useCotejoStore();
  const [subMenuOptions, setSubMenuOptions] = useState([]);
  const [criterios, setCriterios] = useState([]);
  const [existenItems, setExistenItems] = useState(false);
  const [isActive, setIsActive] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const [params, setParams] = useState(null);
  const [error, setError] = useState(null);
  const { isLoading,selectedDataAcademico  } = useEvaluationStore();

  const tableRef = useRef(null);
  useEffect(() => {
    setCriterios([]);
    setParams(null);
    setIsActive(null);
    setSubMenuOptions([]);
    setExistenItems(false);
  }, [idMenu, idSolicitud]);

  useEffect(() => {
    if (!idMenu && !idSolicitud && !selectedDataAcademico) return;
    setError(null);
    setSubMenuOptions([]);
    obtenerSubMenuCriteriosCotejo(selectedDataAcademico.id, idMenu)
      .then((response) => {
        setSubMenuOptions(response.data?.subMenu);
        console.log("Submenu de criterios: ", response.data?.subMenu);
      })
      .catch((error) => {
        if (error.response) {
          const message = 'Por favor, seleccione un inciso para comenzar el cotejo de documentos';
          setError({
            message,
            type: "error",
          });
        }
        console.error("Error al obtener los submenus", error);
        setSubMenuOptions([]);

      })
      .finally(() => setIsLoading(false));
  }, [idMenu, idSolicitud, selectedDataAcademico]);

  const handleClickOption = (subMenuId) => {
    console.log("cambiando subMenuId", subMenuId);
    setParams({
      idSolicitud,
      idMenu,
      idSubMenu: subMenuId,
    });

    setIsActive(subMenuId);

    if (tableRef.current) {
      tableRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (error) {
    return (
      <Alert typeAlert={error.type}>
        <p>{error.message}</p>
      </Alert>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  // let hiddenOption = (criterios.length <= 0) ? 'none' : 'black';

  return (
    <div className={styles.containerSubMenuCriterios}>
      <ul className={styles.listOpcionesCriterios}>
        {!loading &&
          subMenuOptions?.map((subMenu) => {
            console.log("Submenu: ", subMenu);
            const isActiveOpcion = isActive === subMenu.id;
            return (
              <li key={subMenu.id} className={styles.opcionItemCriterio}>
                <button
                  type="button"
                  onClick={() => handleClickOption(subMenu.id)}
                  className={
                    isActiveOpcion
                      ? `${styles.opcionItemCriterioButton} ${styles.isActiveOpcionItemCriterio}`
                      : `${styles.opcionItemCriterioButton}`
                  }
                >
                  {subMenu.nombre}
                </button>
              </li>
            );
          })}
      </ul>

      <div className={styles.containerTableItemsEvaluacion} ref={tableRef}>
        {params && (
          <TablaCriteriosCotejo setExistenItems={setExistenItems} onCriteriosChange={setCriterios} params={params} />
        )}
      </div>
      {!esCotejadoRubros && !params && (
        <Alert typeAlert="success">
          <p>Seleccione un inciso para comenzar el cotejo de documentos</p>
        </Alert>
      )}
    </div>
  );
};

export default CriteriosCotejo;
