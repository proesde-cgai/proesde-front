import { ContainerLayout } from "../../layout/ContainerLayout";
import { TitlePage } from "../components/TitlePage";
import CodigoSearch from "./components/CodigoSearch";
import styles from "./styles/CreacionComisionEspecial.module.css";

const CreacionComisionEspecial = () => {
    return (
        <div className={styles.spacing}>
            <TitlePage title='Creación de Comisión Especial' />
            <ContainerLayout>
                <CodigoSearch />
            </ContainerLayout>
        </div>
    );
};

export default CreacionComisionEspecial;