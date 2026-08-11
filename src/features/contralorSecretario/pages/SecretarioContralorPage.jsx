import React, { useEffect, useRef } from "react";
import { Footer, Header } from "../../layout";
import { Menu, useMenu } from "../../../reutilizable/Menu";
import Alert from "../../../reutilizable/Alert";
import Loading from "../../../reutilizable/Loading";
import useMenuData from "../../../hooks/useMenuData";
import { useSearchStore } from "../../../store/useSearchStore";
import styles from "../styles/SecrearioContralorPage.module.css";
import ReportesExcel from "../reportesExcel/ReportesExcel"
import Evaluacion from "../../contralor/components/Evaluacion";
import Expediente from "../../contralor/components/Expediente";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_SUBMENUS = `${API_BASE_URL}/api/v1/actividad/contralor_secretario_cgai`;

const SecretarioContralorPage = () => {
    const clearFormData = useSearchStore(state => state.clearFormData);
    const setQuery = useSearchStore(state => state.setQuery);
    const previousElementRef = useRef(null);

    const componentMap = {
        "Ver evaluaciones": <Evaluacion />,
        "Ver expediente": <Expediente />,
        "Reportes Excel": <ReportesExcel />,
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

    useEffect(() => {
        if (previousElementRef.current !== null && 
            previousElementRef.current !== menu.element) {
            clearFormData();
            setQuery("");
        }
        // Actualizar la referencia al elemento actual
        previousElementRef.current = menu.element;
    }, [menu.element, clearFormData, setQuery]);

    return <>
        <Header />
        <div className={styles.container}>
            <Menu menu={menu} />
            {loadingMenus && (
                <Loading />
            )}

            {errorMenu && (
                <Alert typeAlert={errorMenu.type}>
                    <p>{errorMenu.message}</p>
                </Alert>
            )}
            {menu.element}
        </div>

        <Footer />
    </>;
}

export default SecretarioContralorPage;