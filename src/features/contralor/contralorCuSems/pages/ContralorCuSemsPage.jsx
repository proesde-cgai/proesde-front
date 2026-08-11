import React, { useEffect, useState } from "react";
import axios from "axios";
import { Menu, useMenu } from "../../../../reutilizable/Menu";
import { useAuthStore } from "../../../../store/useAuthStore";
import { Footer, Header } from "../../../layout";
import Loading from "../../../../reutilizable/Loading";
import Alert from "../../../../reutilizable/Alert";
import useMenuData from "../../../../hooks/useMenuData";
import Evaluacion from "../../components/Evaluacion";
import styles from "./styles/ContralorCuSemsPage.module.css";
import Expediente from "../../components/Expediente";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_SUBMENUS = `${API_BASE_URL}/api/v1/actividad/contralor_cu_sems`;

export const ContralorCuSemsPage = () => {

  const componentMap = {
    "Ver evaluaciones": <Evaluacion />,
    "Ver expediente": <Expediente />,
  }


  const {
    menu: menuData,
    menuConfig,
    isLoading: loadingMenus,
    error: errorMenu
  } = useMenuData({
    apiUrl: API_URL_SUBMENUS,
    componentMap,
    defaultSelectedValue: '',
    isVertical: false
  });

  const menu = useMenu(menuData, menuConfig);



  return (
    <>
      <Header />
      <div className={styles.container}>
        <Menu menu={menu} />
        {loadingMenus && (
          <Loading/>
        )}

        {errorMenu && (
          <Alert typeAlert={errorMenu.type}>
            <p>{errorMenu.message}</p>
          </Alert>
        )}
        {menu.element}
      </div>

      <Footer />
    </>
  );
};