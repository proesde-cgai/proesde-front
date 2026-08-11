import React, { useEffect, useMemo, useState } from "react";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { ERROR_MESSAGES_GENERICS_API } from "../../../utils/messagesFromAPI";
import Alert from "../../../reutilizable/Alert";
import { obtenerCriteriosCotejo } from "../services/cotejoCriteriosService";
import CriteriosCotejo from "../components/CriteriosCotejo";
import styles from "./styles/CotejoCriteriosPage.module.css";
import useCotejoStore from "../../../store/useCotejoStore";

const CotejoCriteriosPage = () => {
  const { selectedDataAcademico } = useEvaluationStore();
  const { setEsCotejadoRubros, setIDSolicitud, esCotejadoRubros } = useCotejoStore();
  const [errorMessage, setErrorMessage] = useState(null);
  const [idSolicitud, setIdSolicitud] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [idMenuInicial, setIdMenuInicial] = useState(null);
  const [menuCriterios, setMenuCriterios] = useState([{ id: idMenuInicial, nombre: "Cargando Criterios..." }]);
  useEffect(() => {
    if (!selectedDataAcademico) return;
    setIdSolicitud(selectedDataAcademico.id);
    setIDSolicitud(selectedDataAcademico.id);
    // eslint-disable-next-line
  }, [selectedDataAcademico]);

  useEffect(() => {
    console.log("esCotejadoRubros", esCotejadoRubros);
  }, [esCotejadoRubros]);

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage(null);
    if (idSolicitud) {
      obtenerCriteriosCotejo(idSolicitud)
        .then((response) => {
          const cotejado = response.data.statusCotejo;
          setMenuCriterios(response.data.menu);
          setIdMenuInicial(response.data?.menu[0]?.id);
          cotejado === 1 ? setEsCotejadoRubros(true) : setEsCotejadoRubros(false);
        })
        .catch((error) => {
          if (error.response) {
            const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
            setErrorMessage({
              message,
              type: "error",
            });
          }
          console.error("Error al obtener los criterios de expediente ", error);
        })
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line
  }, [idSolicitud]);

  const menuOptions = useMemo(() => {
    console.log("menu criterios", menuCriterios);
    console.log(idSolicitud);
    console.log(idMenuInicial);

    if (menuCriterios) {
      return menuCriterios.map((item) => ({
        label: item.nombre,
        element: (
          <CriteriosCotejo
            key={`${idSolicitud}-${item.id}-`}
            idMenu={item.id}
            idSolicitud={idSolicitud}
            menuInicial={idMenuInicial}
          />
        ),
      }));
    } else {
      return [
        {
          label: "",
          element: "",
        },
      ];
    }
  }, [menuCriterios, idSolicitud, idMenuInicial]);

  // Creamos el menú siempre, incluso si está vacío
  const menu = useMenu(
    menuOptions,
    {
      customClass: {
        menu: styles.menuContainer,
        menuOption: styles.menuOption,
        subMenuOption: styles.subMenuOption,
        selected: styles.selected,
      },
      selectedValue: menuOptions[0]?.label || "",
    },
    idMenuInicial
  );

  if (errorMessage) {
    return (
      <Alert typeAlert={errorMessage.type}>
        <p>{errorMessage.message}</p>
      </Alert>
    );
  }

  if (!menuCriterios) {
    return (
      <Alert typeAlert="warning">
        <p>{"Este usuario no tiene rubros de evaluacion"}</p>
      </Alert>
    );
  }

  return (
    <div className={styles.containerExpedienteCriterio}>
      {isLoading && <div className={styles.loading}>Cargando...</div>}
      <Menu key={idSolicitud} menu={menu} />
      <div className={styles.containerOpcionExpedienteCriterio}>{menu.element}</div>
    </div>
  );
};

export default CotejoCriteriosPage;
