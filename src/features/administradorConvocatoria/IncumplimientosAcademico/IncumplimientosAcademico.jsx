import { ContainerLayout } from "../../layout/ContainerLayout";
import { TitlePage } from "../components/TitlePage";
import InfoLeft from "./components/InfoLeft/InfoLeft";
import InfoRight from "./components/InfoRight/InfoRight";
import ModalActionIncumplimiento from "./components/ModalActionIncumplimiento/ModalActionIncumplimiento";
import { IncumplimientoProvider } from "./context/IncumplimientoProvider";
import styles from "./styles/IncumplimientosAcademico.module.css";

const IncumplimientosAcademico = () => {
  return (
    <IncumplimientoProvider>
      <div className={styles.container}>
        <ModalActionIncumplimiento />
        <TitlePage title='Incumplimientos de académicos' />

        <ContainerLayout>
          <InfoLeft />
          <InfoRight />
        </ContainerLayout>

      </div>
    </IncumplimientoProvider>
  );
};
export default IncumplimientosAcademico;
