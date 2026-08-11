import useMenuData from '../../../hooks/useMenuData';
import Alert from '../../../reutilizable/Alert';
import Loading from '../../../reutilizable/Loading';
import { Menu, useMenu } from '../../../reutilizable/Menu';
import { Footer, Header } from '../../layout/components';
import ReporteResultadosEvaluacion from '../../reportes/components/ReporteResultadosEvaluacion';
import ExpedienteInconformidad from './ExpedienteInconformidad';
import styles from './styles/InconformidadPage.module.css';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL_SUBMENUS = `${API_BASE_URL}/api/v1/actividad/comision_ingreso_promocion_personal_academico_sems` 

export const InconformidadPage = () => {
  
  const componentMap = {
    "Lista de inconformidades": <ExpedienteInconformidad/>,
    "Tabla Resultados": <ReporteResultadosEvaluacion/>
  };

  const { menu: menuData, menuConfig, error, isLoading } = useMenuData({
    apiUrl: API_URL_SUBMENUS,
    componentMap: componentMap,
  });

  const menu = useMenu(menuData, menuConfig); 

  return (
    <>
      <Header />
        <Menu menu={menu} />
        <div className={styles.container}>
          {isLoading && ( <Loading/> )}
          {error && (
            <Alert typeAlert={error.type}>
              <p>{error.message}</p>
            </Alert>
          )}
          {menu.element}
        </div>
      <Footer />
    </>
  );
};
