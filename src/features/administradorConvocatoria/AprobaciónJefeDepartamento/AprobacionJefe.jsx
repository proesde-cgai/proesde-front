import { ContainerLayout } from "../../layout/ContainerLayout";
import { TitlePage } from "../components/TitlePage";
import CodigoSearch from "./components/CodigoSearch";
import styles from "./styles/AprobacionJefeDepartamento.module.css";

const AprobacionJefe = () => {
    return (
        <div className={styles.spacing}>
            <TitlePage title='Asignacion Jefe Departamento' />
            <ContainerLayout>
                <CodigoSearch />
            </ContainerLayout>
        </div>
    );
};

export default AprobacionJefe;