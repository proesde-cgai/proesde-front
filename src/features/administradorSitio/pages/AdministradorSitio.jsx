import React, { useEffect } from 'react'
import { Menu, useMenu } from '../../../reutilizable/Menu';
import { Footer, Header } from '../../layout';
import styles from './AdministradorSitio.module.css'
import Configuracion from '../components/Configuracion';
import useMenuData from '../../../hooks/useMenuData';
import Loading from '../../../reutilizable/Loading';
import Alert from '../../../reutilizable/Alert';
import ConvocatoriaPage from '../convocatoria/pages/ConvocatoriaPage';
import ActividadesPage from '../actividades/pages/ActividadesPage';
import CrearActPage from '../actividades/pages/CrearActPage';
import AsociarConvocatoria from '../convocatoria/pages/sin-uso/AsociarConvocatoria';
import AsociarActividadPage from '../actividades/pages/AsociarActividadPage';
import ConvocatoriaActividad from '../convocatoria/pages/sin-uso/ConvocatoriaActividad';
import EdiciónDictamenes from '../actividades/pages/EdiciónDictamenes';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_SUBMENUS = `${API_BASE_URL}/api/v1/actividad/admin_gral`;


export const AdministradorSitio = () => {


    const componentMap = {
        "Parametrización del sistema": <Configuracion />,
        "Generar convocatorias": <ConvocatoriaPage />,
        "Asociar actividad": <AsociarActividadPage />,
        "Crear actividad": <CrearActPage />,
        "Modificar actividad": <ActividadesPage />,
        "Edición de Dictámenes": <EdiciónDictamenes />,
    };

    const {
        menu: menuData,
        menuConfig,
        isLoading: loadingMenus,
        error: errorMenu
    } = useMenuData({
        apiUrl: API_URL_SUBMENUS,
        componentMap,
        defaultSelectedValue: 'Generar convocatorias',
        isVertical: false
    });

    const menu = useMenu(menuData, menuConfig);

    return (
        <>
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
        </>
    );
};

