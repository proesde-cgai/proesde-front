import { ContainerLayout } from "../../layout/ContainerLayout";
import { FormCodeAcademic } from "../components/FormCodeAcademic";
import { MessageWarning } from "../components/MessageWarning";
import { TitlePage } from "../components/TitlePage";
import { useSuperPase } from "./hook/useSuperPase";
import styles from "./styles/SuperPase.module.css";
import { useState } from "react";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import { Asignar } from "./pages/Asignar";
import { Historial } from "./pages/Historial";

export const SuperPase = () => {
  const hook = useSuperPase();
  const {
    academico,
    codigo,
    error,
    handleFormSubmit,
    handleSubmitCodigo,
    isVisible,
    loading,
    onChange,
    superPase,
  } = hook;

  const [selectedLabel, setSelectedLabel] = useState("Asignar");

  const opciones = [
    {
      label: "Asignar",
      element: <Asignar hook={hook} />,
      onClick: () => setSelectedLabel("Asignar"),
    },
    {
      label: "Historial",
      element: <Historial hook={hook} />,
      onClick: () => setSelectedLabel("Historial"),
    },
  ];

  const menu = useMenu(opciones, {
    customClass: {
      menu: styles.menuContainer,
      menuOption: styles.menuOption,
      subMenuOption: styles.subMenuOption,
      selected: styles.selected,
      subMenu: styles.subMenu,
    },
  });

  return (
    <div className={styles.container}>
      <TitlePage title="Super pase" />
      <ContainerLayout>
        <FormCodeAcademic
          actionForm={handleSubmitCodigo}
          changeCode={onChange}
          value={codigo}
          loading={loading}
          message={error}
          error={error.length > 0}
        />

        <div className={styles.form}>
          {academico ? (
            <div className={styles.menu}>
              <Menu menu={menu} />
              <div className={styles.optionMenu}>
                {selectedLabel === "Asignar" ? (
                  <Asignar hook={hook} />
                ) : (
                  <Historial hook={hook} />
                )}
              </div>
            </div>
          ) : (
            <MessageWarning>
              Introduzca el código del académico y oprima el botón "Continuar".
            </MessageWarning>
          )}

          {/* Form submission alerts are shown inside the Asignar page. */}
        </div>
      </ContainerLayout>
    </div>
  );
};
