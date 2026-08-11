import { ContainerLayout } from "../../layout/ContainerLayout";
import { FormCodeAcademic } from "../components/FormCodeAcademic";
import { TitlePage } from "../components/TitlePage";
import LeftInformation from "./components/LeftInformation";
import RightInformation from "./components/RightInformation";
import TextStatus from "./components/TextStatus";
import TextSuggestion from "./components/TextSuggestion";
import { useActivarInactivarSolicitud } from "./hooks/useActivarInactivarSolicitud";
import styles from "./styles/ActivarInactivarSolicitud.module.css";

const BloquearDesbloquearAcademico = () => {
  const {
    handleBuscarSolicitud,
    handleGuardarSolicitud,
    codigo,
    blocked,
    error,
    message,
    dataAcademic,
    onChange,
    loading,
    onChangeCheckbox
  } = useActivarInactivarSolicitud();

  return (
    <div className={styles.mainContainer}>
      <TitlePage title='Bloquear/desbloquear académicos' />
      <ContainerLayout>
        <FormCodeAcademic
          actionForm={handleBuscarSolicitud}
          changeCode={onChange}
          error={error}
          loading={loading}
          message={message}
          value={codigo}
        />

        <div className={styles.listaContainer}>
          <TextStatus message={message} styles={styles} error={error} />
          <RightInformation
            dataAcademic={dataAcademic}
            estado={blocked}
            handleGuardarSolicitud={handleGuardarSolicitud}
            onChangeCheckbox={onChangeCheckbox}
            loading={loading}
            styles={styles}
          />
          <TextSuggestion styles={styles} dataAcademic={dataAcademic} />
        </div>
      </ContainerLayout>
    </div>
  );
};

export default BloquearDesbloquearAcademico;
