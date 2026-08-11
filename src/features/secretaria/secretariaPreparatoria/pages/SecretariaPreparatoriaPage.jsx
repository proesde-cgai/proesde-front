import React, { useEffect, useRef, useState } from "react";
import { Menu, useMenu } from "../../../../reutilizable/Menu";
import { Footer, Header } from "../../../layout";
import { BusquedaAvanzada } from "../../components/BusquedaAvanzada";
import CotejoPage from "../../pages/CotejoPage";
import GenerarDocInconformidad from "../../secretariaAdminSems/GenerarDocInconformidad/page/DocInconformidadPage";
import GenerarReporte from "../../secretariaAdminSems/GenerarReportes/page/GenerarReportePage";

import useMenuData from '../../../../hooks/useMenuData';
import { useSearchStore } from "../../../../store/useSearchStore";
import Loading from '../../../../reutilizable/Loading';
import Alert from '../../../../reutilizable/Alert';
import styles from "./styles/SecretariaPreparatoriaPage.module.css";
import VerExpedientePage from '../../pages/verExpediente/VerExpedientePage';
import SubirDocumentosPage from "../../components/subir-documentos/page/SubirDocumentosPage";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_SUBMENUS = `${API_BASE_URL}/api/v1/actividad/secretaria_escuelas_preparatorias`;

export const SecretariaPreparatoriaPage = () => {

  const clearFormData = useSearchStore(state => state.clearFormData);
  const setQuery = useSearchStore(state => state.setQuery);
  const previousElementRef = useRef(null);
  const [gacetaStatus, setGacetaStatus] = useState(false);
  const componentMap = {
    "Inconformidad": <GenerarDocInconformidad />,
    "Evaluación": <BusquedaAvanzada />,
    "Subir documentos": <SubirDocumentosPage />,
    "Solicitudes": <CotejoPage />,
    "Generar reportes": <GenerarReporte />,
    "Ver Expediente": <VerExpedientePage />
 
  }
  
  const { menu: menuData, menuConfig, error, isLoading } = useMenuData({
    apiUrl: API_URL_SUBMENUS,
    componentMap: componentMap,
    defaultSelectedValue: 'Instrucciones',
    isVertical: false
  });

  const menu = useMenu(menuData.filter((element) => gacetaStatus ? true : element.label !== "Ver expediente"), menuConfig)

  useEffect(() => {
    if (previousElementRef.current !== null && 
        previousElementRef.current !== menu.element) {
      clearFormData();
      setQuery("");
    }
    previousElementRef.current = menu.element;
  }, [menu.element, clearFormData, setQuery]);

  useEffect(() => {
    const fetchGacetaStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/api/v1/gaceta/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error('Error al consultar el estado de Gaceta');
        }
        const data = await response.json();
        setGacetaStatus(data);
      } catch (err) {
        console.error('Error fetching Gaceta status:', err);
      }
    };

    fetchGacetaStatus();
  }, []);


  return (
    <div className={styles.jefe_departamento_page_container}>
      <Header />
      <Menu menu={menu} />
      {isLoading && (<Loading />)}
      { error && (
        <Alert typeAlert={error.type}>
          <p>{error.message}</p>
        </Alert>
      )}
      {menu.element}
      <Footer />
    </div>
  );
};

